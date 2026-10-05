/**
 * Firebase Client Initialization
 * ==============================================================================
 * Initialized from root firebase-applet-config.json credentials.
 * Configured with Google Workspace Gmail API scopes for authenticated email access.
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
const dbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = dbId ? getFirestore(app, dbId) : getFirestore(app);

// Google Auth Provider for popup login with Gmail Workspace scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Add requested Gmail OAuth scopes
export const GMAIL_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
];

GMAIL_SCOPES.forEach((scope) => {
  googleProvider.addScope(scope);
});

export default app;
