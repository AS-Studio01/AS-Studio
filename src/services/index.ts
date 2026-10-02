/**
 * CENTRAL SERVICE INTEGRATIONS
 * ==============================================================================
 * Real connected Firebase Firestore, Firebase Authentication, and Gmail dispatch.
 * ==============================================================================
 */

export * from './firebase';
export * from './auth';
export * from './database';
export * from './gmail';

export function getIntegrationsStatus() {
  return {
    authentication: {
      status: 'active',
      provider: 'Firebase Authentication (Google Sign-In Popup & Sessions)',
    },
    database: {
      status: 'active',
      dialect: 'Cloud Firestore Enterprise (Database ID: ai-studio-asstudio-41a6a92f-f1d4-4ac0-9bd3-9e54c726d708)',
    },
    gmail: {
      status: 'active',
      service: 'Google Workspace Gmail Dispatcher (Official Sender: asbusinessofficial01@gmail.com)',
    },
  };
}
