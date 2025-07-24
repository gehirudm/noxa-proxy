import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const apps = getApps();

let db: FirebaseFirestore.Firestore;
if (!apps.length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
    // databaseURL: `https://${process.env.FIREBASE_ADMIN_PROJECT_ID}.firebasestorage.app`,
  });
  
  db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });
} else {
  db = getFirestore();
}

export const auth = getAuth();
export { db };

export const convertTimestamps = (obj: any) => {
  if (!obj) return obj;

  if (obj.toDate && typeof obj.toDate === 'function') {
    return obj.toDate().toISOString();
  }

  if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      obj[key] = convertTimestamps(obj[key]);
    });
  }

  return obj;
};