import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Inquiry, InquiryStatus } from './types';

const INQUIRIES_COLLECTION = 'inquiries';

export async function submitInquiry(inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const inquiryRef = doc(db, INQUIRIES_COLLECTION, inquiryId);

  const payload: Inquiry = {
    ...inquiryData,
    status: 'new',
    createdAt: new Date().toISOString(),
    source: inquiryData.source || 'website_contact_form',
  };

  await setDoc(inquiryRef, payload);
  return inquiryId;
}

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const q = query(collection(db, INQUIRIES_COLLECTION), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Inquiry),
    }));
  } catch (error) {
    console.warn('Firestore read permission restricted or database unpopulated:', error);
    return [];
  }
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as Inquiry) };
    }
    return null;
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return null;
  }
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  const docRef = doc(db, INQUIRIES_COLLECTION, id);
  await updateDoc(docRef, {
    status,
    updatedAt: new Date().toISOString(),
  });
}
