import { ActivityLog } from './types';
import { auth } from './firebase';

const LOCAL_STORAGE_KEY = 'as_studio_activity_logs';

export async function logActivity(
  action: string,
  details: Record<string, any> = {},
  type: ActivityLog['type'] = 'system_event'
): Promise<void> {
  const user = auth.currentUser;
  const logEntry: ActivityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    action,
    details,
    userId: user?.uid,
    userEmail: user?.email || undefined,
    timestamp: new Date().toISOString(),
    type,
  };

  try {
    const existing = getStoredLogs();
    existing.unshift(logEntry);
    // Keep last 100 entries locally
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.warn('Could not persist activity log to localStorage:', err);
  }
}

export function getStoredLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ActivityLog[];
  } catch {
    return [];
  }
}
