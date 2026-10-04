/**
 * Schema.org FAQPage Parser & Synchronizer
 * Dynamically extracts structured Q&As from index.html JSON-LD schema
 * keeping structured content aligned between search engine indexing and visual UI.
 */

export interface SchemaFAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'guarantees' | 'pricing' | 'process' | 'support';
  highlight?: string;
}

const FALLBACK_SCHEMA_FAQS: SchemaFAQItem[] = [
  {
    id: 'faq-include',
    question: 'What does a website project include?',
    answer: 'Every project includes custom UI/UX design, clean responsive development, mobile optimization, core on-page SEO setup, speed optimization, contact forms, live staging for testing on your phone, domain connection, and a clear production handover.',
    category: 'guarantees',
    highlight: 'Design, Build & Handover',
  },
  {
    id: 'faq-redesign',
    question: 'Can you redesign an existing website?',
    answer: 'Yes. We specialize in transforming slow, outdated, or confusing websites into clean, modern, and mobile-friendly digital experiences that represent your business properly with clearer structure and responsive presentation.',
    category: 'process',
    highlight: 'Full Modern Overhauls',
  },
  {
    id: 'faq-seo',
    question: 'Are the websites SEO-ready?',
    answer: 'Yes. All websites are built with semantic HTML5, clean URL structures, performance-conscious implementation, meta tags, OpenGraph sharing cards, XML sitemaps, and Schema.org structured data markup ready for Google indexing.',
    category: 'guarantees',
    highlight: 'Semantic & Schema Ready',
  },
  {
    id: 'faq-payment',
    question: 'How does the payment process work?',
    answer: 'We work with clear, milestone-based payments tied to deliverables. Projects typically start with a 50% deposit to commence sprint discovery and design, with the remaining 50% due only after you review and approve the live staging site on your smartphone.',
    category: 'pricing',
    highlight: 'Milestone-Based & Transparent',
  },
  {
    id: 'faq-after-launch',
    question: 'What happens after launch?',
    answer: 'We connect your custom domain, ensure SSL security certificates are active, submit your sitemap to search consoles, provide the agreed production files and access, and offer post-launch support where included in the project scope covering any fixes on the delivered scope.',
    category: 'support',
    highlight: 'Post-Launch Support',
  },
  {
    id: 'faq-maintenance',
    question: 'Do you provide maintenance and updates?',
    answer: 'Yes. Beyond any included post-launch support period, we offer lightweight ongoing maintenance plans or ad-hoc support hours for updates, new pages, speed checks, and technical adjustments whenever your business needs them.',
    category: 'support',
    highlight: 'Ongoing Support Available',
  },
];

export function extractFaqsFromJsonLd(): {
  faqs: SchemaFAQItem[];
  isDynamic: boolean;
  schemaType: string;
} {
  if (typeof document === 'undefined') {
    return { faqs: FALLBACK_SCHEMA_FAQS, isDynamic: false, schemaType: 'FAQPage' };
  }

  try {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      const text = scripts[i].textContent || '';
      if (!text.includes('FAQPage')) continue;

      const parsed = JSON.parse(text);
      const graph = parsed['@graph'] || [parsed];
      const faqEntity = graph.find(
        (node: Record<string, unknown>) => node['@type'] === 'FAQPage' || node['@type'] === 'https://schema.org/FAQPage'
      );

      if (faqEntity && Array.isArray(faqEntity.mainEntity) && faqEntity.mainEntity.length > 0) {
        const dynamicFaqs: SchemaFAQItem[] = faqEntity.mainEntity.map(
          (item: { name: string; acceptedAnswer?: { text: string } }, index: number) => {
            const question = item.name || '';
            const answer = item.acceptedAnswer?.text || '';
            let category: SchemaFAQItem['category'] = 'process';
            let highlight = 'Clear Process';

            if (question.toLowerCase().includes('code') || question.toLowerCase().includes('warranty')) {
              category = 'guarantees';
              highlight = question.toLowerCase().includes('warranty') ? '30-Day Support' : 'Project Handover';
            } else if (question.toLowerCase().includes('price') || question.toLowerCase().includes('cost')) {
              category = 'pricing';
              highlight = 'Scope-Based Pricing';
            } else if (question.toLowerCase().includes('communication') || question.toLowerCase().includes('support')) {
              category = 'support';
              highlight = 'Direct Founder Contact';
            } else if (question.toLowerCase().includes('staging') || question.toLowerCase().includes('phone')) {
              category = 'process';
              highlight = 'Live Phone Staging';
            }

            return {
              id: `schema-faq-${index + 1}`,
              question,
              answer,
              category,
              highlight,
            };
          }
        );

        return { faqs: dynamicFaqs, isDynamic: true, schemaType: 'Schema.org FAQPage' };
      }
    }
  } catch (error) {
    console.warn('[FAQ] Failed parsing JSON-LD schema, falling back to default schema data:', error);
  }

  return { faqs: FALLBACK_SCHEMA_FAQS, isDynamic: false, schemaType: 'Schema.org FAQPage' };
}
