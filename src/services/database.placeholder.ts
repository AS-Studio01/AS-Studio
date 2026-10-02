/**
 * DATABASE SERVICE PLACEHOLDER
 * ==============================================================================
 * This is a ready-to-replace placeholder module for Database Storage.
 * When you are ready to configure a database, you can replace the dummy
 * functions below with your real PostgreSQL (Drizzle/Prisma/pg), Cloud SQL,
 * Supabase, or Firestore database client.
 * ==============================================================================
 */

export interface DatabaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInquiryRecord extends DatabaseRecord {
  clientName: string;
  businessName: string;
  contactChannel: string;
  scopeSummary: string;
  targetBudget?: string;
  source: 'website_contact_form' | 'ai_chat_assistant' | 'direct_inquiry';
  status: 'new' | 'in_review' | 'contacted' | 'completed';
}

export interface DatabasePlaceholderConfig {
  dialect: 'postgres' | 'cloudsql' | 'supabase' | 'firestore' | 'placeholder';
  connectionUri: string;
  isConfigured: boolean;
}

export const DATABASE_PLACEHOLDER_CONFIG: DatabasePlaceholderConfig = {
  dialect: 'placeholder',
  connectionUri: import.meta.env.VITE_DATABASE_URL || 'postgresql://user:password@localhost:5432/as_studio_db',
  isConfigured: false, // Switch to true once your database is connected
};

// Internal in-memory storage simulation for development preview
const memoryInquiryStore: ProjectInquiryRecord[] = [];

/**
 * Connect to database
 * PLACEHOLDER: Replace with your actual pool.connect(), drizzle(), or initializeApp()
 */
export async function connectDatabase(): Promise<{ connected: boolean; message: string }> {
  console.info('[DATABASE PLACEHOLDER] connectDatabase called with URI:', DATABASE_PLACEHOLDER_CONFIG.connectionUri);
  return {
    connected: true,
    message: 'Database placeholder ready in memory simulation mode. Replace with real DB connection when ready.',
  };
}

/**
 * Save new project inquiry
 * PLACEHOLDER: Replace with your ORM / SQL query (e.g., db.insert(inquiries).values(...))
 */
export async function saveProjectInquiry(
  inquiry: Omit<ProjectInquiryRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<ProjectInquiryRecord> {
  console.info('[DATABASE PLACEHOLDER] saveProjectInquiry called with payload:', inquiry);

  const newRecord: ProjectInquiryRecord = {
    ...inquiry,
    id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'new',
  };

  memoryInquiryStore.unshift(newRecord);
  return newRecord;
}

/**
 * Retrieve inquiries
 * PLACEHOLDER: Replace with your actual query (e.g. db.select().from(inquiries)...)
 */
export async function getProjectInquiries(statusFilter?: ProjectInquiryRecord['status']): Promise<ProjectInquiryRecord[]> {
  console.info('[DATABASE PLACEHOLDER] getProjectInquiries called with filter:', statusFilter);
  if (statusFilter) {
    return memoryInquiryStore.filter((item) => item.status === statusFilter);
  }
  return [...memoryInquiryStore];
}

/**
 * Check database health
 */
export async function checkDatabaseHealth(): Promise<{ status: 'healthy' | 'unreachable'; latencyMs: number }> {
  return {
    status: 'healthy',
    latencyMs: 12,
  };
}
