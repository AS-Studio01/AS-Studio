/**
 * ACTIVITY LOG SERVICE
 * ==============================================================================
 * Tracks recent changes made to the site content and system configurations
 * for auditability, governance, and transparency in the SecretAdminPanel.
 * Stored persistently in browser localStorage and dispatched via custom events.
 * ==============================================================================
 */

export interface ActivityLogItem {
  id: string;
  timestamp: string; // ISO 8601 string
  action: string;
  details: string;
  section: 'brand' | 'services' | 'theme' | 'seo' | 'legal' | 'process' | 'general' | 'auth';
  author: string;
  status: 'success' | 'info' | 'warning';
}

const ACTIVITY_LOG_STORAGE_KEY = 'as_studio_site_activity_logs';
export const ACTIVITY_LOG_EVENT = 'as_studio_activity_logged';

const DEFAULT_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-001',
    timestamp: '2026-10-02T18:45:00.000Z',
    action: 'Terms of Service Updated',
    details: 'Applied official Terms of Service (Last updated: 02 October 2026) including 14 formal articles, liability limits, and India jurisdiction.',
    section: 'legal',
    author: 'Founder (Ayan)',
    status: 'success',
  },
  {
    id: 'log-002',
    timestamp: '2026-10-02T18:30:00.000Z',
    action: 'Privacy Policy Updated',
    details: 'Applied official Privacy Policy (Last updated: 02 October 2026) including 12 comprehensive sections, AI tool disclosure, and 30-day legal claim window.',
    section: 'legal',
    author: 'Founder (Ayan)',
    status: 'success',
  },
  {
    id: 'log-003',
    timestamp: '2026-10-01T14:15:00.000Z',
    action: 'Site Content Initialized',
    details: 'Loaded default studio portfolio, responsive mobile-first showcase, pricing packages, and SEO meta tags.',
    section: 'general',
    author: 'System',
    status: 'info',
  },
];

/**
 * Retrieve current activity logs from persistent storage.
 */
export function getActivityLogs(): ActivityLogItem[] {
  if (typeof window === 'undefined') return DEFAULT_ACTIVITY_LOGS;

  try {
    const raw = localStorage.getItem(ACTIVITY_LOG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVITY_LOG_STORAGE_KEY, JSON.stringify(DEFAULT_ACTIVITY_LOGS));
      return DEFAULT_ACTIVITY_LOGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_ACTIVITY_LOGS;
  } catch (e) {
    console.warn('[ActivityLog] Failed to parse activity logs:', e);
    return DEFAULT_ACTIVITY_LOGS;
  }
}

/**
 * Record a new change event to the audit log.
 */
export function logSiteActivity(
  entry: Omit<ActivityLogItem, 'id' | 'timestamp'>
): ActivityLogItem {
  const newLog: ActivityLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getActivityLogs();
      const updated = [newLog, ...existing].slice(0, 60); // Keep latest 60 audit items
      localStorage.setItem(ACTIVITY_LOG_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(ACTIVITY_LOG_EVENT, { detail: newLog }));
    } catch (e) {
      console.warn('[ActivityLog] Could not persist log:', e);
    }
  }

  return newLog;
}

/**
 * Clear all activity logs from storage.
 */
export function clearActivityLogs(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ACTIVITY_LOG_STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent(ACTIVITY_LOG_EVENT));
    } catch (e) {
      console.warn('[ActivityLog] Could not clear logs:', e);
    }
  }
}
