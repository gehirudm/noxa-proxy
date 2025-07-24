import { NextRequest, NextResponse } from 'next/server';
import { getPaymentByOrderId, updatePayment } from '@/lib/db/payments';
import { db } from '@/lib/firebase/firebase-admin';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  try {
    // Extract the order ID from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }
    
    // Find the payment document across all users
    const paymentsSnapshot = await db.collectionGroup('payments')
      .where('orderId', '==', orderId)
      .limit(1)
      .get();
    
    if (paymentsSnapshot.empty) {
      console.error(`Payment not found for order ID: ${orderId}`);
      // Redirect to a cancellation page with an error message
      return redirect(`/dashboard/billing/cancel?error=payment_not_found&orderId=${orderId}`);
    }
    
    const paymentDoc = paymentsSnapshot.docs[0];
    const payment = paymentDoc.data();
    const userId = payment.userId;
    
    if (!userId) {
      console.error(`User ID not found for order ID: ${orderId}`);
      return redirect(`/dashboard/billing/cancel?error=user_not_found&orderId=${orderId}`);
    }
    
    // Update the payment status to canceled
    await updatePayment(userId, orderId, {
      status: 'canceled',
      error: 'Payment cancelled by user',
      // @ts-ignore
      cancelledAt: new Date().toISOString()
    });
    
    // Extract additional parameters that might be useful for the cancellation page
    const provider = searchParams.get('provider') || payment.provider;
    const amount = searchParams.get('amount') || payment.amount;
    const type = searchParams.get('type') || payment.type;
    
    // Redirect to the cancellation page with relevant information
    const redirectUrl = `/dashboard/billing/cancel?orderId=${orderId}&provider=${provider}&amount=${amount}&type=${type}&status=cancelled`;
    
    return redirect(redirectUrl);
  } catch (error) {
    console.error('Error processing payment cancellation:', error);
    
    // Extract the order ID for the error redirect
    const orderId = request.nextUrl.searchParams.get('orderId') || 'unknown';
    
    // Redirect to the cancellation page with an error message
    return redirect(`/dashboard/billing/cancel?error=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}&orderId=${orderId}`);
  }
}