/**
 * Authentication Context & useAuth Hook
 * ==============================================================================
 * Manages Firebase Authentication state, persistent client and founder sessions,
 * passwordless client email access, and founder device credentials.
 * 
 * Works 100% seamlessly on Vercel (as-studio-delta.vercel.app), localhost,
 * and AI Studio preview without requiring Google OAuth domain whitelisting.
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
export const ADMIN_AUTH_STATE_KEY = 'as_studio_admin_auth_state';
export const ADMIN_USER_ID_KEY = 'as_studio_admin_user_id';
export const ADMIN_REMEMBER_KEY = 'as_studio_admin_remember';
export const CLIENT_AUTH_KEY = 'as_studio_client_session';
const SECRET_STORAGE_KEY = 'as_studio_founder_persistent_auth';
const SECRET_DEVICE_KEY = 'as_studio_founder_device_id';
const GMAIL_TOKEN_KEY = 'as_studio_gmail_token';

export interface StudioUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: StudioUser | User | null;
  loading: boolean;
  isAdmin: boolean;
  isSecretCodeAdmin: boolean;
  gmailAccessToken: string | null;
  signInWithGoogle: (remember?: boolean) => Promise<UserCredential>;
  loginWithEmail: (email: string, name?: string, remember?: boolean) => StudioUser;
  connectGmail: () => Promise<string | null>;
  loginWithSecretCode: (code: string, rememberDevice?: boolean) => boolean;
  signOut: () => Promise<void>;
  forgetDevice: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  // Restore client or admin user from persistent storage on boot
  const [user, setUser] = useState<StudioUser | User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const clientSaved = localStorage.getItem(CLIENT_AUTH_KEY) || sessionStorage.getItem(CLIENT_AUTH_KEY);
        if (clientSaved) {
          const parsed = JSON.parse(clientSaved);
          if (parsed?.user) return parsed.user;
        }
        const adminSaved = localStorage.getItem(ADMIN_AUTH_STATE_KEY) || sessionStorage.getItem(ADMIN_AUTH_STATE_KEY);
        if (adminSaved) {
          const parsed = JSON.parse(adminSaved);
          if (parsed?.isAuthenticated && parsed?.email) {
            return {
              uid: parsed.userId || 'admin_user',
              email: parsed.email,
              displayName: parsed.email.split('@')[0],
              photoURL: null,
            };
          }
        }
      } catch (e) {}
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [gmailAccessToken, setGmailAccessToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(GMAIL_TOKEN_KEY) || sessionStorage.getItem(GMAIL_TOKEN_KEY);
    }
    return null;
  });

  // Persistent founder authorization check from localStorage or sessionStorage
  const [isSecretCodeAdmin, setIsSecretCodeAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // 1. Check persistent auth state object in localStorage
      const localAuthState = localStorage.getItem(ADMIN_AUTH_STATE_KEY);
      if (localAuthState) {
        try {
          const parsed = JSON.parse(localAuthState);
          if (parsed && parsed.isAuthenticated && (parsed.role === 'admin' || parsed.userId)) {
            return true;
          }
        } catch (e) {
          // ignore parsing error
        }
      }

      // 2. Check session storage auth state
      const sessionAuthState = sessionStorage.getItem(ADMIN_AUTH_STATE_KEY);
      if (sessionAuthState) {
        try {
          const parsed = JSON.parse(sessionAuthState);
          if (parsed && parsed.isAuthenticated) return true;
        } catch (e) {}
      }

      // 3. Fallback checks for stored token or device key
      const stored =
        localStorage.getItem(SECRET_STORAGE_KEY) ||
        sessionStorage.getItem(SECRET_STORAGE_KEY) ||
        localStorage.getItem('as_studio_admin_unlocked') ||
        localStorage.getItem(ADMIN_USER_ID_KEY);
      const hasDeviceKey = Boolean(localStorage.getItem(SECRET_DEVICE_KEY));
      return Boolean(stored === 'true' || stored === 'authorized_founder_token' || hasDeviceKey || stored);
    }
    return false;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // If user is logged in via Google and is admin, persist auth state according to remember setting
        if (firebaseUser?.email && ADMIN_EMAILS.includes(firebaseUser.email.toLowerCase())) {
          const remember = localStorage.getItem(ADMIN_REMEMBER_KEY) !== 'false';
          const payload = {
            isAuthenticated: true,
            userId: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'admin',
            method: 'google_oauth',
            lastLogin: new Date().toISOString(),
            rememberMe: remember,
          };
          if (remember && typeof window !== 'undefined') {
            localStorage.setItem(ADMIN_AUTH_STATE_KEY, JSON.stringify(payload));
            localStorage.setItem(ADMIN_USER_ID_KEY, firebaseUser.uid);
            localStorage.setItem(ADMIN_REMEMBER_KEY, 'true');
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (remember: boolean = true): Promise<UserCredential> => {
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

      if (credential.user?.email && ADMIN_EMAILS.includes(credential.user.email.toLowerCase())) {
        const payload = {
          isAuthenticated: true,
          userId: credential.user.uid,
          email: credential.user.email,
          role: 'admin',
          method: 'google_oauth',
          lastLogin: new Date().toISOString(),
          rememberMe: remember,
        };
        if (remember && typeof window !== 'undefined') {
          localStorage.setItem(ADMIN_AUTH_STATE_KEY, JSON.stringify(payload));
          localStorage.setItem(ADMIN_USER_ID_KEY, credential.user.uid);
          localStorage.setItem(ADMIN_REMEMBER_KEY, 'true');
        }
      }

      return credential;
    } catch (error) {
      console.error('Google Sign-in error:', error);
      throw error;
    }
  };

  /**
   * Direct Client & Founder Email Login (Zero-popup, 100% reliable on Vercel)
   */
  const loginWithEmail = (email: string, name?: string, remember: boolean = true): StudioUser => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminEmail = ADMIN_EMAILS.includes(cleanEmail);
    const displayName = name || cleanEmail.split('@')[0];
    const safeId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const uid = isAdminEmail ? `founder_${safeId}` : `client_${safeId}`;

    const studioUser: StudioUser = {
      uid,
      email: cleanEmail,
      displayName,
      photoURL: null,
    };

    setUser(studioUser);

    if (isAdminEmail) {
      setIsSecretCodeAdmin(true);
      const authPayload = {
        isAuthenticated: true,
        userId: uid,
        email: cleanEmail,
        role: 'admin',
        method: 'email_direct',
        lastLogin: new Date().toISOString(),
        rememberMe: remember,
      };
      if (typeof window !== 'undefined') {
        if (remember) {
          localStorage.setItem(ADMIN_AUTH_STATE_KEY, JSON.stringify(authPayload));
          localStorage.setItem(ADMIN_USER_ID_KEY, uid);
          localStorage.setItem(ADMIN_REMEMBER_KEY, 'true');
          localStorage.setItem(SECRET_STORAGE_KEY, 'authorized_founder_token');
          localStorage.setItem('as_studio_admin_unlocked', 'true');
        } else {
          sessionStorage.setItem(ADMIN_AUTH_STATE_KEY, JSON.stringify(authPayload));
          sessionStorage.setItem(ADMIN_USER_ID_KEY, uid);
        }
      }
    } else {
      const clientPayload = {
        user: studioUser,
        lastLogin: new Date().toISOString(),
        rememberMe: remember,
      };
      if (typeof window !== 'undefined') {
        if (remember) {
          localStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify(clientPayload));
        } else {
          sessionStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify(clientPayload));
        }
      }
    }

    return studioUser;
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

    const isMatch =
      normalizedInput === normalizedTarget ||
      normalizedInput === '2926' ||
      normalizedInput === 'ayan' ||
      normalizedInput === '2926 means ayan' ||
      normalizedInput.includes('2926') ||
      normalizedInput.includes('ayan');

    if (isMatch) {
      setIsSecretCodeAdmin(true);
      const authPayload = {
        isAuthenticated: true,
        userId: 'founder_ayan_2926',
        email: 'sahina724462s@gmail.com',
        role: 'admin',
        method: 'secret_passphrase',
        lastLogin: new Date().toISOString(),
        rememberMe: Boolean(rememberDevice),
      };

      // Set user object for immediate UI consistency
      setUser({
        uid: 'founder_ayan_2926',
        email: 'sahina724462s@gmail.com',
        displayName: 'Sahina / Ayan',
        photoURL: null,
      });

      if (typeof window !== 'undefined') {
        if (rememberDevice) {
          localStorage.setItem(ADMIN_AUTH_STATE_KEY, JSON.stringify(authPayload));
          localStorage.setItem(ADMIN_USER_ID_KEY, 'founder_ayan_2926');
          localStorage.setItem(ADMIN_REMEMBER_KEY, 'true');
          localStorage.setItem(SECRET_STORAGE_KEY, 'authorized_founder_token');
          localStorage.setItem('as_studio_admin_unlocked', 'true');
          localStorage.setItem(SECRET_DEVICE_KEY, 'founder_ayan_verified_device');
        } else {
          sessionStorage.setItem(ADMIN_AUTH_STATE_KEY, JSON.stringify(authPayload));
          sessionStorage.setItem(SECRET_STORAGE_KEY, 'authorized_founder_token');
          sessionStorage.setItem('as_studio_admin_unlocked', 'true');
          localStorage.removeItem(ADMIN_AUTH_STATE_KEY);
          localStorage.removeItem(ADMIN_USER_ID_KEY);
          localStorage.removeItem(ADMIN_REMEMBER_KEY);
          localStorage.removeItem(SECRET_STORAGE_KEY);
          localStorage.removeItem('as_studio_admin_unlocked');
          localStorage.removeItem(SECRET_DEVICE_KEY);
        }
      }
      return true;
    }
    return false;
  };

  const forgetDevice = (): void => {
    setIsSecretCodeAdmin(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_AUTH_STATE_KEY);
      localStorage.removeItem(ADMIN_USER_ID_KEY);
      localStorage.removeItem(ADMIN_REMEMBER_KEY);
      localStorage.removeItem(CLIENT_AUTH_KEY);
      localStorage.removeItem(SECRET_STORAGE_KEY);
      localStorage.removeItem(SECRET_DEVICE_KEY);
      localStorage.removeItem('as_studio_admin_unlocked');
      sessionStorage.removeItem(ADMIN_AUTH_STATE_KEY);
      sessionStorage.removeItem(CLIENT_AUTH_KEY);
      sessionStorage.removeItem(SECRET_STORAGE_KEY);
      sessionStorage.removeItem('as_studio_admin_unlocked');
    }
  };

  const signOut = async (): Promise<void> => {
    setIsSecretCodeAdmin(false);
    setUser(null);
    setGmailAccessToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_AUTH_STATE_KEY);
      localStorage.removeItem(ADMIN_USER_ID_KEY);
      localStorage.removeItem(ADMIN_REMEMBER_KEY);
      localStorage.removeItem(CLIENT_AUTH_KEY);
      localStorage.removeItem(SECRET_STORAGE_KEY);
      localStorage.removeItem(SECRET_DEVICE_KEY);
      localStorage.removeItem('as_studio_admin_unlocked');
      localStorage.removeItem(GMAIL_TOKEN_KEY);
      sessionStorage.removeItem(ADMIN_AUTH_STATE_KEY);
      sessionStorage.removeItem(CLIENT_AUTH_KEY);
      sessionStorage.removeItem(SECRET_STORAGE_KEY);
      sessionStorage.removeItem('as_studio_admin_unlocked');
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
        loginWithEmail,
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
