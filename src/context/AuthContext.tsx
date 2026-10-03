/**
 * Authentication Context & useAuth Hook
 * ==============================================================================
 * Manages real Firebase Authentication state, Google Sign-in popup with Gmail OAuth,
 * session monitoring, admin role verification, and persistent founder device credentials.
 * Once unlocked via the secret passphrase or authorized Google account, credentials
 * are remembered on this device so you don't have to re-enter the code every time.
 * ==============================================================================
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  UserCredential,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const ADMIN_EMAILS = [
  'asstudioofficial001@gmail.com',
  'asbusinessofficial01@gmail.com',
  'sahina724462s@gmail.com',
];

export const SECRET_ADMIN_CODE = '2926 means Ayan';
const SECRET_STORAGE_KEY = 'as_studio_founder_persistent_auth';
const SECRET_DEVICE_KEY = 'as_studio_founder_device_id';
const GMAIL_TOKEN_KEY = 'as_studio_gmail_token';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSecretCodeAdmin: boolean;
  gmailAccessToken: string | null;
  signInWithGoogle: () => Promise<UserCredential>;
  connectGmail: () => Promise<string | null>;
  loginWithSecretCode: (code: string, rememberDevice?: boolean) => boolean;
  signOut: () => Promise<void>;
  forgetDevice: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [gmailAccessToken, setGmailAccessToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(GMAIL_TOKEN_KEY) || sessionStorage.getItem(GMAIL_TOKEN_KEY);
    }
    return null;
  });

  // Persistent founder authorization check from localStorage
  const [isSecretCodeAdmin, setIsSecretCodeAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SECRET_STORAGE_KEY) || sessionStorage.getItem(SECRET_STORAGE_KEY);
      return stored === 'true' || stored === 'authorized_founder_token';
    }
    return false;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const googleCred = GoogleAuthProvider.credentialFromResult(credential);
      const token = googleCred?.accessToken || null;
      if (token) {
        setGmailAccessToken(token);
        if (typeof window !== 'undefined') {
          localStorage.setItem(GMAIL_TOKEN_KEY, token);
        }
      }
      return credential;
    } catch (error) {
      console.error('Google Sign-in error:', error);
      throw error;
    }
  };

  const connectGmail = async (): Promise<string | null> => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const googleCred = GoogleAuthProvider.credentialFromResult(credential);
      const token = googleCred?.accessToken || null;
      if (token) {
        setGmailAccessToken(token);
        if (typeof window !== 'undefined') {
          localStorage.setItem(GMAIL_TOKEN_KEY, token);
        }
      }
      return token;
    } catch (error) {
      console.error('Gmail OAuth connection error:', error);
      throw error;
    }
  };

  const loginWithSecretCode = (inputCode: string, rememberDevice: boolean = true): boolean => {
    const normalizedInput = inputCode.trim().toLowerCase();
    const normalizedTarget = SECRET_ADMIN_CODE.toLowerCase();

    if (normalizedInput === normalizedTarget) {
      setIsSecretCodeAdmin(true);
      if (typeof window !== 'undefined') {
        if (rememberDevice) {
          localStorage.setItem(SECRET_STORAGE_KEY, 'authorized_founder_token');
          localStorage.setItem(SECRET_DEVICE_KEY, `as_founder_${Date.now()}`);
        } else {
          sessionStorage.setItem(SECRET_STORAGE_KEY, 'true');
        }
      }
      return true;
    }
    return false;
  };

  const forgetDevice = (): void => {
    setIsSecretCodeAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SECRET_STORAGE_KEY);
      localStorage.removeItem(SECRET_DEVICE_KEY);
      sessionStorage.removeItem(SECRET_STORAGE_KEY);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsSecretCodeAdmin(false);
    setGmailAccessToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SECRET_STORAGE_KEY);
      localStorage.removeItem(SECRET_DEVICE_KEY);
      localStorage.removeItem(GMAIL_TOKEN_KEY);
      sessionStorage.removeItem(SECRET_STORAGE_KEY);
      sessionStorage.removeItem(GMAIL_TOKEN_KEY);
    }
    try {
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isEmailAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));
  const isAdmin = isEmailAdmin || isSecretCodeAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isSecretCodeAdmin,
        gmailAccessToken,
        signInWithGoogle,
        connectGmail,
        loginWithSecretCode,
        signOut,
        forgetDevice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}
