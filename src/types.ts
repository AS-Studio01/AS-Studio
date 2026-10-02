export type PageType = 'home' | 'work' | 'services' | 'process' | 'contact';

export interface Project {
  id: string;
  name: string;
  category: string;
  badge: string;
  isConcept: boolean;
  description: string;
  buttonText: string;
  tags?: string[];
  turnaround?: string;
  conceptDetails: {
    overview: string;
    keyDeliverables: string[];
    focusAreas: string[];
    structureBreakdown: string[];
  };
}

export interface EnquiryFormData {
  name: string;
  businessName: string;
  contactInfo: string;
  helpDetails: string;
}

