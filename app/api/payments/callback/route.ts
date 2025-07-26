import { NextRequest, NextResponse } from 'next/server';
import { 
  getPaymentByOrderId, 
  markPaymentCompleted, 
  markPaymentFailed, 
  updatePayment,
  createTransactionRecord,
  updateUserWalletBalance
} from '@/lib/db/payments';
import { PaymentStatus } from '@/lib/payment/providers/PaymentProvider';
import { db } from '@/lib/firebase/firebase-admin';
import crypto from 'crypto';
import { evomiAPI } from '@/lib/evomi-api';

// IP whitelist for Cryptomus webhooks
const CRYPTOMUS_IPS = ['91.227.144.54'];

// Function to verify Cryptomus webhook signature
function verifyCryptomusSignature(payload: any, signature: string): boolean {
  try {
    // Remove the sign from the payload for verification
    const payloadCopy = { ...payload };
    delete payloadCopy.sign;
    
    // Get the API payment key from environment variables
    const apiPaymentKey = process.env.CRYPTOMUS_PAYMENT_KEY;
    if (!apiPaymentKey) {
      console.error('CRYPTOMUS_PAYMENT_KEY is not defined in environment variables');
      return false;
    }
    
    // Generate the hash according to Cryptomus documentation
    const base64Payload = Buffer.from(JSON.stringify(payloadCopy)).toString('base64');
    const hash = crypto.createHash('md5').update(base64Payload + apiPaymentKey).digest('hex');
    
    // Compare the generated hash with the provided signature
    return hash === signature;
  } catch (error) {
    console.error('Error verifying Cryptomus signature:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if the request is coming from a Cryptomus IP (optional but recommended)
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const clientIp = forwardedFor.split(',')[0].trim();
    
    if (process.env.NODE_ENV === 'production' && !CRYPTOMUS_IPS.includes(clientIp)) {
      console.warn(`Received webhook from non-Cryptomus IP: ${clientIp}`);
      // You can choose to reject the request here or continue with signature verification
      // return NextResponse.json({ error: 'Unauthorized IP' }, { status: 403 });
    }
    
    // Get the raw request body
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    
    // Extract the signature from the body
    const signature = body.sign;
    
    if (!signature) {
      console.error('Missing Cryptomus signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }
    
    // Verify the signature
    const isValidSignature = verifyCryptomusSignature(body, signature);
    
    if (!isValidSignature) {
      console.error('Invalid Cryptomus signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Extract the order ID from the webhook data
    const orderId = body.order_id;
    if (!orderId) {
      console.error('Missing order ID in webhook payload', body);
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }
    
    // Extract payment status
    const status = body.status;
    let paymentStatus: PaymentStatus;
    switch (status) {
      case 'paid':
        paymentStatus = PaymentStatus.COMPLETED;
        break;
      case 'failed':
        paymentStatus = PaymentStatus.FAILED;
        break;
      case 'canceled':
        paymentStatus = PaymentStatus.CANCELED;
        break;
      case 'refunded':
        paymentStatus = PaymentStatus.REFUNDED;
        break;
      default:
        paymentStatus = PaymentStatus.PENDING;
    }
    
    // Extract user ID from additional data if available
    let userId: string | undefined;
    if (body.additional_data) {
      try {
        const additionalData = JSON.parse(body.additional_data);
        userId = additionalData.userId;
      } catch (e) {
        console.error('Failed to parse additional_data', e);
      }
    }
    
    // If we couldn't get the user ID from additional_data, try to find the payment in the database
    if (!userId) {
      // Search for the payment across all users (this could be optimized with a separate index)
      const paymentsSnapshot = await db.collectionGroup('payments')
        .where('orderId', '==', orderId)
        .limit(1)
        .get();
      
      if (paymentsSnapshot.empty) {
        console.error(`Payment not found for order ID: ${orderId}`);
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
      }
      
      const paymentDoc = paymentsSnapshot.docs[0];
      const paymentData = paymentDoc.data();
      userId = paymentData.userId;
    }
    
    if (!userId) {
      console.error(`User ID not found for order ID: ${orderId}`);
      return NextResponse.json({ error: 'User ID not found' }, { status: 404 });
    }
    
    // Get the payment from the database
    const payment = await getPaymentByOrderId(userId, orderId);
    if (!payment) {
      console.error(`Payment not found for user ${userId} and order ${orderId}`);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    
    // Update the payment based on the webhook status
    switch (paymentStatus) {
      case PaymentStatus.COMPLETED:
        // Mark the payment as completed
        await markPaymentCompleted(userId, orderId);
        
        // Create a transaction record
        await createTransactionRecord({
          userId,
          type: payment.type === 'wallet_deposit' ? 'deposit' : 'purchase',
          amount: payment.amount,
          currency: payment.currency,
          paymentId: orderId,
          paymentProvider: 'cryptomus',
          description: payment.metadata?.description || `Payment ${orderId}`,
          metadata: {
            cryptomusUuid: body.uuid,
            network: body.network,
            txid: body.txid,
            paymentAmount: body.payment_amount,
            paymentCurrency: body.currency,
            rawData: body
          }
        });
        
        // If this is a wallet deposit, update the user's wallet balance
        if (payment.type === 'wallet_deposit') {
          const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId);
          await updateUserWalletBalance(userId, payment.amount, paymentRef);
        }
        
        // If this is a proxy purchase, provision the proxy (implementation depends on your system)
                if (payment.type === 'proxy_purchase') {
          // Implement proxy provisioning logic here using evomiAPI
          console.log(`Provisioning proxy for user ${userId}, plan: ${JSON.stringify(payment.metadata)}`);
          
          // Update the user's proxy plan information in Firestore
          if (payment.metadata?.proxyType) {
            const userRef = db.collection('users').doc(userId);
            
            // Get the user document to retrieve the Evomi username
            const userDoc = await userRef.get();
            const userData = userDoc.data();
            
            if (!userData?.evomi?.username) {
              console.error(`No Evomi username found for user ${userId}`);
              throw new Error('User does not have an Evomi account configured');
            }
            
            const evomiUsername = userData.evomi.username;
            
            // Map our proxy types to Evomi product types
            const proxyTypeToEvomiProduct: Record<string, 'residential' | 'sharedDataCenter' | 'mobile'> = {
              'residential': 'residential',
              'datacenter': 'sharedDataCenter',
              'mobile': 'mobile',
              'static_residential': 'residential' // Assuming static residential uses the same product
            };
            
            const evomiProduct = proxyTypeToEvomiProduct[payment.metadata.proxyType];
            
            if (!evomiProduct) {
              console.error(`Invalid proxy type: ${payment.metadata.proxyType}`);
              throw new Error(`Invalid proxy type: ${payment.metadata.proxyType}`);
            }
            
            // Parse bandwidth from string (e.g., "5 GB") to MB amount
            let mbAmount = 0;
            const bandwidthMatch = payment.metadata.bandwidth.match(/(\d+)\s*GB/i);
            if (bandwidthMatch && bandwidthMatch[1]) {
              // Convert GB to MB (1 GB = 1024 MB)
              mbAmount = parseInt(bandwidthMatch[1], 10) * 1024;
            } else {
              console.error(`Invalid bandwidth format: ${payment.metadata.bandwidth}`);
              throw new Error(`Invalid bandwidth format: ${payment.metadata.bandwidth}`);
            }
            
            try {
              // Add the bandwidth to the user's Evomi account
              const updatedSubUser = await evomiAPI.giveBalance(
                evomiUsername,
                evomiProduct,
                mbAmount
              );
              
              console.log(`Successfully added ${mbAmount}MB to ${evomiUsername}'s ${evomiProduct} balance`);
              
              // Update the user's proxy plan information in Firestore
              await userRef.update({
                [`proxyPlans.${payment.metadata.proxyType}`]: {
                  tier: payment.metadata.tier,
                  purchasedAt: new Date(),
                  expiresAt: payment.metadata.isRecurring 
                    ? null // For subscriptions, we don't set an expiration
                    : new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days for one-time purchases
                  isActive: true,
                  bandwidth: payment.metadata.bandwidth,
                  planName: payment.metadata.planName,
                  evomiBalance: updatedSubUser.products[evomiProduct]?.balance || mbAmount
                },
                updatedAt: new Date()
              });
            } catch (error) {
              console.error(`Failed to add balance to Evomi account: ${error}`);
              // Still update the user's plan in Firestore, but mark that provisioning failed
              await userRef.update({
                [`proxyPlans.${payment.metadata.proxyType}`]: {
                  tier: payment.metadata.tier,
                  purchasedAt: new Date(),
                  expiresAt: payment.metadata.isRecurring 
                    ? null 
                    : new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
                  isActive: true,
                  bandwidth: payment.metadata.bandwidth,
                  planName: payment.metadata.planName,
                  provisioningError: error instanceof Error ? error.message : 'Unknown error'
                },
                updatedAt: new Date()
              });
              
              // Re-throw the error to be caught by the outer try-catch
              throw error;
            }
          }
        }
        
        break;
        
      case PaymentStatus.FAILED:
        await markPaymentFailed(userId, orderId, 'Payment failed according to Cryptomus webhook');
        break;
        
      case PaymentStatus.CANCELED:
        await updatePayment(userId, orderId, { 
          status: 'canceled',
          error: 'Payment was canceled'
        });
        break;
        
      case PaymentStatus.REFUNDED:
        await updatePayment(userId, orderId, { 
          status: 'refunded',
          error: 'Payment was refunded'
        });
        break;
        
      default:
        // For pending or other statuses, just update the payment with the latest info
        await updatePayment(userId, orderId, {
          metadata: {
            ...payment.metadata,
            lastWebhookUpdate: new Date().toISOString(),
            lastWebhookStatus: status,
            lastWebhookData: body
          }
        });
    }
    
    // Return a success response to Cryptomus
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Cryptomus webhook:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error processing webhook' },
      { status: 500 }
    );
  }
}