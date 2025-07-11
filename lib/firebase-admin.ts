import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Check if we already have initialized the Firebase Admin SDK
// This is important for Next.js since it can hot-reload server code
const apps = getApps();

// Service account credentials from environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

// Initialize the app if it hasn't been initialized yet
if (!apps.length) {
  initializeApp({
    credential: cert(serviceAccount),
    // databaseURL: `https://${process.env.FIREBASE_ADMIN_PROJECT_ID}.firebasestorage.app`,
  });
}

// Export the auth and firestore instances
export const auth = getAuth();
export const db = getFirestore();

// Helper function to convert Firestore timestamps to ISO strings when needed
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