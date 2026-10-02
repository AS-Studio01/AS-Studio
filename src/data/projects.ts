import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'aura-home-decor',
    name: 'Aura Living & Home Decor',
    category: 'Home Decor & Interior Architecture',
    badge: 'Design Concept',
    isConcept: true,
    description: 'A tactile, calm digital showroom for artisanal furniture, architectural lighting, and bespoke interior spaces with instant lookbook inquiries.',
    buttonText: 'View demo preview',
    tags: ['Home Decor', 'Artisanal Furniture', 'Lookbook & Catalogue', 'Lighting Architecture'],
    turnaround: 'Design Exploration',
    conceptDetails: {
      overview: 'An independent design exploration created by AS Studio demonstrating how high-end home decor ateliers, furniture studios, and interior designers can showcase tactile materials, ambient lighting, and bespoke room collections without heavy load times.',
      keyDeliverables: [
        'Curated room-by-room lookbook discovery (Living, Dining, Lighting)',
        'Tactile material & fabric swatch inspector (Oak, Travertine, Linen, Brass)',
        'Direct Telegram inquiry for bespoke architectural sizing',
        'Sub-second image rendering with zero cluttered ecommerce popups',
      ],
      focusAreas: [
        'Discerning homeowners and architects browsing on high-resolution mobile devices',
        'Communicating craftsmanship, texture, and proportions with restraint',
        'Frictionless custom quotation request with one tap',
      ],
      structureBreakdown: [
        'Editorial hero featuring signature sculptural lamp and linen lounge chair',
        'Interactive seasonal lookbook with room filter toggles',
        'Material palette showcase with texture swatches',
        'Studio visit appointments and direct Telegram designer consultation',
      ],
    },
  },
  {
    id: 'nova-dental-care',
    name: 'Nova Dental Care',
    category: 'Clinic Website Redesign',
    badge: 'Independent Concept',
    isConcept: true,
    description: 'A mobile-first clinic concept that makes services, doctor credibility, location and appointment enquiries easier to find.',
    buttonText: 'View demo preview',
    tags: ['Healthcare Triage', 'Local SEO Ready', 'Appointment Priority', 'Doctor Credibility'],
    turnaround: 'Design Exploration',
    conceptDetails: {
      overview: 'An independent design exploration created by AS Studio to demonstrate how local healthcare practices can replace cluttered medical portals with clean, trust-building mobile experiences.',
      keyDeliverables: [
        'Prominent appointment request and direct Telegram triage',
        'Clinician qualification and credential highlight cards',
        'Clear treatment category navigation without dense medical jargon',
        'Integrated clinic hours, directions, and emergency contact notice',
      ],
      focusAreas: [
        'Patients on mobile devices needing immediate booking or location information',
        'Reassuring nervous first-time visitors with understated professionalism',
        'Accessible color contrast and large legible typography',
      ],
      structureBreakdown: [
        'Header with direct emergency line and address indicator',
        'Hero with single primary action: Book Consultation',
        '3 core specializations: Preventive, Orthodontics, Restorative',
        'Verified Google Maps directions link & clinic consultation hours',
      ],
    },
  },
  {
    id: 'mitti-cafe',
    name: 'Mitti Café',
    category: 'Restaurant Landing Page',
    badge: 'Independent Concept',
    isConcept: true,
    description: 'A clean restaurant concept focused on menu discovery, location, WhatsApp reservations and a better mobile experience.',
    buttonText: 'View demo preview',
    tags: ['Hospitality', 'Zero-PDF Menu', 'Table Booking', 'Location-Centric'],
    turnaround: 'Design Exploration',
    conceptDetails: {
      overview: 'An independent concept study showcasing how hospitality venues can drive table bookings and menu exploration without forcing customers to download slow PDF menus.',
      keyDeliverables: [
        'Interactive fast-loading mobile menu without PDF downloads',
        'Direct table reservation and party booking flow',
        'Immediate neighborhood directions and parking guidance',
        'Daily roast & seasonal kitchen specials overview',
      ],
      focusAreas: [
        'Customers standing outside or riding a cab looking for hours and directions',
        'Instant direct chat for reservations during rush hours',
        'Warm, quiet aesthetic celebrating local craft ingredients',
      ],
      structureBreakdown: [
        'One-tap reservation trigger at top viewport',
        'Clean tabbed menu preview: Coffee, Artisanal Bakes, Savories',
        'Google Maps location pinpoint and operating schedule',
        'Social handle & private event hosting enquiry link',
      ],
    },
  },
];
