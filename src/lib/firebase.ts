/**
 * Firebase Client Initialization
 * ==============================================================================
 * Initialized from root firebase-applet-config.json credentials.
 * Exports Auth and Firestore instances for use across the application.
 * ==============================================================================
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Ensure singleton instance
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore using provisioned database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Google Auth Provider for popup login
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
