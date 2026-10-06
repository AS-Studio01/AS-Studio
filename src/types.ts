export interface ConceptDetails {
  overview: string;
  keyDeliverables: string[];
  focusAreas: string[];
  structureBreakdown: string[];
}

export interface Project {
  id: string;
  name: string;
  category: string;
  badge: string;
  isConcept?: boolean;
  projectType?: string;
  description: string;
  buttonText: string;
  tags: string[];
  turnaround: string;
  accentColor?: string;
  liveDemoUrl: string;
  imageUrl: string;
  featured?: boolean;
  enabled?: boolean;
  order?: number;
  problem: string;
  approach: string;
  solution: string;
  deliverables: string[];
  servicesInvolved: string[];
  ctaText?: string;
  conceptDetails?: ConceptDetails;
}

export type InquirySource = 'website_contact_form' | 'ai_chat_assistant' | 'direct_inquiry';
export type InquiryStatus = 'new' | 'in_review' | 'contacted' | 'completed';

export interface Inquiry {
  id?: string;
  clientName: string;
  businessName: string;
  contactChannel: string;
  scopeSummary: string;
  targetBudget?: string;
  source: InquirySource;
  status: InquiryStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'client' | 'admin';
  createdAt: string;
}

export interface ActivityLog {
  id?: string;
  action: string;
  details?: Record<string, any>;
  userId?: string;
  userEmail?: string;
  timestamp: string;
  type: 'inquiry_submitted' | 'auth_login' | 'status_changed' | 'system_event';
}

export interface ServiceItem {
  id: string;
  title: string;
  turnaround: string;
  idealFor: string;
  description: string;
  deliverables: string[];
  features: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export interface IndustryItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  typicalOutcome: string;
  badge: string;
}

export type Language = 'en' | 'es' | 'de' | 'fr' | 'hi';
export type Theme = 'dark' | 'light';

export interface SiteContent {
  studioName: string;
  tagline: string;
  headline: string;
  subheadline: string;
  supportEmail: string;
  telegramHandle: string;
  telegramUrl: string;
}
