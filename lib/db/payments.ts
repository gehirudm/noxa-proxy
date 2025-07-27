import { db } from "@/lib/firebase/firebase-admin";
import { DocumentData, FieldValue, Query } from "firebase-admin/firestore";
import { PaymentProvider } from "@/lib/payment/providers/PaymentProvider";

/**
 * Payment status types
 */
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'canceled';

/**
 * Payment types
 */
export type PaymentType = 'proxy_purchase' | 'wallet_deposit';

/**
 * Payment document structure
 */
export interface Payment {
  orderId: string;
  userId: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  completedAt?: FirebaseFirestore.Timestamp;
  status: PaymentStatus;
  provider: string;
  amount: number;
  currency: string;
  type: PaymentType;
  checkoutUrl?: string;
  cryptomusUuid?: string;
  error?: string;
  metadata: Record<string, any>;
}

/**
 * Creates a new payment document in Firestore
 */
export async function createPayment({
  orderId,
  userId,
  provider,
  amount,
  currency = 'USD',
  type,
  status,
  metadata = {},
}: {
  orderId: string;
  userId: string;
  provider: string;
  amount: number;
  currency?: string;
  type: PaymentType;
  status?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId);
  
  const paymentData = {
    orderId,
    userId,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    status: status || 'pending' as PaymentStatus,
    provider,
    amount,
    currency,
    type,
    metadata
  };
  
  await paymentRef.set(paymentData);
}

/**
 * Updates an existing payment document
 */
export async function updatePayment(
  userId: string,
  orderId: string,
  data: Partial<Omit<Payment, 'orderId' | 'userId' | 'createdAt'>>
): Promise<void> {
  const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId);
  
  // Always update the updatedAt timestamp
  const updateData = {
    ...data,
    updatedAt: FieldValue.serverTimestamp()
  };
  
  await paymentRef.update(updateData);
}

/**
 * Updates payment status to completed and sets completedAt timestamp
 */
export async function markPaymentCompleted(
  userId: string,
  orderId: string
): Promise<void> {
  const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId);
  
  await paymentRef.update({
    status: 'completed',
    updatedAt: FieldValue.serverTimestamp(),
    completedAt: FieldValue.serverTimestamp()
  });
}

/**
 * Updates payment status to failed with error message
 */
export async function markPaymentFailed(
  userId: string,
  orderId: string,
  error: string
): Promise<void> {
  const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId);
  
  await paymentRef.update({
    status: 'failed',
    error,
    updatedAt: FieldValue.serverTimestamp()
  });
}

/**
 * Updates payment with checkout URL
 */
export async function updatePaymentWithCheckoutUrl(
  userId: string,
  orderId: string,
  checkoutUrl: string
): Promise<void> {
  const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId);
  
  await paymentRef.update({
    checkoutUrl,
    updatedAt: FieldValue.serverTimestamp()
  });
}

/**
 * Updates payment with Cryptomus specific details
 */
export async function updatePaymentWithCryptoDetails(
  userId: string,
  orderId: string,
  cryptomusUuid: string,
  checkoutUrl: string
): Promise<void> {
  const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId);
  
  await paymentRef.update({
    cryptomusUuid,
    checkoutUrl,
    updatedAt: FieldValue.serverTimestamp()
  });
}

/**
 * Gets a payment document by order ID
 */
export async function getPaymentByOrderId(
  userId: string,
  orderId: string
): Promise<Payment | null> {
  const paymentRef = db.collection('users').doc(userId).collection('payments').doc(orderId);
  const paymentDoc = await paymentRef.get();
  
  if (!paymentDoc.exists) {
    return null;
  }
  
  return paymentDoc.data() as Payment;
}

/**
 * Gets all payments for a user
 */
export async function getUserPayments(
  userId: string,
  options?: {
    limit?: number;
    status?: PaymentStatus;
    type?: PaymentType;
    orderBy?: 'createdAt' | 'updatedAt' | 'completedAt';
    orderDirection?: 'desc' | 'asc';
  }
): Promise<Payment[]> {
  const {
    limit = 100,
    status,
    type,
    orderBy = 'createdAt',
    orderDirection = 'desc'
  } = options || {};
  
  let query: Query<DocumentData> = db.collection('users').doc(userId).collection('payments');
  
  if (status) {
    query = query.where('status', '==', status);
  }
  
  if (type) {
    query = query.where('type', '==', type);
  }
  
  query = query.orderBy(orderBy, orderDirection).limit(limit);
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => doc.data() as Payment);
}

/**
 * Creates a transaction record for a payment
 */
export async function createTransactionRecord({
  userId,
  type,
  amount,
  currency = 'USD',
  paymentId,
  paymentProvider,
  description,
  metadata = {},
}: {
  userId: string;
  type: 'deposit' | 'purchase' | 'refund';
  amount: number;
  currency?: string;
  paymentId: string;
  paymentProvider: string;
  description: string;
  metadata?: Record<string, any>;
}): Promise<string> {
  const transactionRef = db.collection('users').doc(userId).collection('transactions').doc();
  
  await transactionRef.set({
    type,
    amount,
    currency,
    paymentId,
    paymentProvider,
    createdAt: FieldValue.serverTimestamp(),
    description,
    metadata
  });
  
  return transactionRef.id;
}

/**
 * Updates user wallet balance using a transaction to ensure consistency
 */
export async function updateUserWalletBalance(
  userId: string,
  amountToAdd: number,
  paymentRef: FirebaseFirestore.DocumentReference
): Promise<{ previousBalance: number; newBalance: number }> {
  const userRef = db.collection('users').doc(userId);
  
  // Use a transaction to safely update the wallet balance
  const result = await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists) {
      throw new Error("User document not found");
    }
    
    const userData = userDoc.data() || {};
    const currentBalance = userData.walletBalance || 0;
    const newBalance = currentBalance + amountToAdd;
    
    transaction.update(userRef, {
      walletBalance: newBalance,
      updatedAt: FieldValue.serverTimestamp()
    });
    
    // Also update the payment document with final details
    transaction.update(paymentRef, {
      'metadata.previousBalance': currentBalance,
      'metadata.newBalance': newBalance
    });
    
    return {
      previousBalance: currentBalance,
      newBalance
    };
  });
  
  return result;
}

/**
 * Generates a unique order ID for tracking payments
 */
export function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}