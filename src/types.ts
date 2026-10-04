export type PageType = 'home' | 'work' | 'services' | 'process' | 'track' | 'contact';

export interface Project {
  id: string;
  name: string;
  category: string;
  badge: string;
  isConcept: boolean;
  projectType?: 'Studio Concept' | 'Client Project';
  description: string;
  buttonText: string;
  tags?: string[];
  turnaround?: string;
  accentColor?: string;
  liveDemoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  enabled?: boolean;
  order?: number;
  problem?: string;
  approach?: string;
  solution?: string;
  deliverables?: string[];
  servicesInvolved?: string[];
  ctaText?: string;
  conceptDetails: {
    overview: string;
    keyDeliverables: string[];
    focusAreas: string[];
    structureBreakdown: string[];
  };
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  idealFor: string;
  turnaround?: string;
  problemSolved?: string;
  whatItIncludes?: string[];
  icon?: string; // 'armchair' | 'stethoscope' | 'coffee' | 'sparkles' | 'globe' | 'layout' | 'code' | 'zap' | 'search' | 'shield'
  accentColor?: string;
  features?: string[];
  ctaText?: string;
  enabled?: boolean;
  order?: number;
}


export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  description: string;
  details: string;
  duration?: string;
  deliverables?: string[];
  enabled?: boolean;
  order?: number;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  businessName: string;
  role: string;
  quote: string;
  rating: number; // 1-5
  outcome?: string;
  serviceType?: string;
  verified: boolean;
  enabled: boolean;
  date?: string;
  order?: number;
}

export type ClientProjectStatus = 
  | 'discovery'
  | 'planning'
  | 'design'
  | 'development'
  | 'review'
  | 'launch'
  | 'completed';

export interface ClientProject {
  id: string;
  clientUid: string;
  clientEmail: string;
  clientName?: string;
  businessName: string;
  title: string;
  projectType: string;
  status: ClientProjectStatus;
  progress: number; // 0 - 100
  currentSprint?: string;
  nextMilestone?: string;
  deadline?: string;
  recentUpdate?: string;
  timeline?: string;
  deliverables?: string[];
  notes?: string;
  liveStagingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryFormData {
  name: string;
  businessName: string;
  contactInfo: string;
  helpDetails: string;
}
