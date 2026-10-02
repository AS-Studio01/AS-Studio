/**
 * Central Service Integrations & Placeholders
 * ==============================================================================
 * This hub exposes ready-to-replace modules for Authentication, Database, and Gmail.
 * Replace the internal implementations in each file when you are ready to connect
 * live credentials and databases.
 * ==============================================================================
 */

export * from './auth.placeholder';
export * from './database.placeholder';
export * from './gmail.placeholder';

export function getIntegrationsPlaceholderStatus() {
  return {
    authentication: {
      status: 'placeholder',
      provider: 'Ready for Firebase / Supabase / OAuth',
    },
    database: {
      status: 'placeholder',
      dialect: 'Ready for PostgreSQL / Cloud SQL / Supabase / Firestore',
    },
    gmail: {
      status: 'placeholder',
      service: 'Ready for Google Workspace Gmail API / SMTP',
    },
  };
}
