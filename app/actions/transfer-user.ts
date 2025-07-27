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

export async function exportUser(userId: string): Promise<string> {
  const userDocRef = db.collection('users').doc(userId);
  const userSnapshot = await userDocRef.get();

  if (!userSnapshot.exists) {
    throw new Error('User not found');
  }

  const userData = userSnapshot.data();

  // Fetch subcollections
  const subcollections = await userDocRef.listCollections();
  const subcollectionData: Record<string, any[]> = {};

  for (const col of subcollections) {
    const colSnap = await col.get();
    subcollectionData[col.id] = colSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  const fullData = {
    id: userId,
    ...userData,
    subcollections: subcollectionData,
  };

  return JSON.stringify(fullData);
}

export async function importUser(jsonString: string): Promise<string> {
  try {
    const userData = JSON.parse(jsonString);

    const { id: userId, subcollections, ...userFields } = userData;

    const userDocRef = db.collection('users').doc(userId);
    await userDocRef.set(userFields, { merge: true });

    for (const [subcollectionName, docs] of Object.entries(subcollections)) {
      const subColRef = userDocRef.collection(subcollectionName);
      for (const doc of docs as any[]) {
        const { id, ...fields } = doc;
        await subColRef.doc(id).set(fields, { merge: true });
      }
    }

    return JSON.stringify({ success: true });
  } catch (err: any) {
    return JSON.stringify({ success: false, message: err.message });
  }
}