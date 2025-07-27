'use server';

import { db } from "@/lib/firebase/firebase-admin";

export async function transferUserData(sourceUid: string, targetUid: string) {
  const sourceRef = db.collection('users').doc(sourceUid);
  const targetRef = db.collection('users').doc(targetUid);

  try {
    // 1. Transfer main document fields
    const sourceSnap = await sourceRef.get();
    if (!sourceSnap.exists) throw new Error('Source user does not exist');

    const sourceData = sourceSnap.data();
    if (sourceData) {
      await targetRef.set(sourceData, { merge: true });
    }

    // 2. Transfer subcollections
    const subcollections = await sourceRef.listCollections();
    for (const subcol of subcollections) {
      const docsSnap = await subcol.get();
      const targetSubcol = targetRef.collection(subcol.id);

      for (const doc of docsSnap.docs) {
        await targetSubcol.doc(doc.id).set(doc.data(), { merge: true });
      }
    }

    return { success: true, message: 'User data transferred successfully' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
