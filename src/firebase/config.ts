// TAPAR.AZ — Firebase CLIENT SDK initialization only.
// No Admin SDK, no Cloud Functions, no custom Node backend.
// All security is enforced via Firestore/Storage/RTDB security rules (see /firebase-rules).

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getDatabase, type Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // Realtime Database needs its own URL (separate product from Firestore)
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const rtdb: Database = getDatabase(app);

export default app;
