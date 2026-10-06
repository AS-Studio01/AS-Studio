import { db } from './firebase';
import { submitInquiry, getInquiries, updateInquiryStatus } from './firestore';
import { Inquiry, InquiryStatus } from './types';
import { logActivity } from './activityLog';

export class DatabaseService {
  static async createInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const id = await submitInquiry(data);
      await logActivity('inquiry_submitted', {
        inquiryId: id,
        clientName: data.clientName,
        businessName: data.businessName,
        channel: data.contactChannel,
      }, 'inquiry_submitted');
      return id;
    } catch (error) {
      console.error('Failed to create inquiry:', error);
      throw error;
    }
  }

  static async listInquiries(): Promise<Inquiry[]> {
    return await getInquiries();
  }

  static async updateStatus(inquiryId: string, status: InquiryStatus): Promise<void> {
    await updateInquiryStatus(inquiryId, status);
    await logActivity('status_changed', { inquiryId, status }, 'status_changed');
  }
}

export default DatabaseService;
