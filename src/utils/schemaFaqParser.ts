/**
 * Schema.org FAQPage Parser & Synchronizer
 * Dynamically extracts structured Q&As from index.html JSON-LD schema
 * ensuring 100% synchronization between search engine indexing and visual UI.
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
    id: 'faq-schema-1',
    question: 'Do I get full source code ownership of my website?',
    answer: 'Yes, 100%. You receive a clean GitHub repository or production zip with complete rights. No proprietary builder lock-in, no hostage code, and no monthly mandatory platform fees.',
    category: 'guarantees',
    highlight: '100% Full Source Handover',
  },
  {
    id: 'faq-schema-2',
    question: 'How does live phone staging work before launch?',
    answer: 'Before final payment or domain launch, we deploy your site to a private staging URL. You can open and test it directly on your own smartphone to verify typography, speed, and responsiveness.',
    category: 'process',
    highlight: 'Real Device Staging',
  },
  {
    id: 'faq-schema-3',
    question: 'Is pricing negotiable for independent budgets?',
    answer: 'Yes. We understand local practices and independent businesses have varied constraints. We tailor the scope to meet your budget without imposing rigid corporate agency minimums.',
    category: 'pricing',
    highlight: 'Budget-Adaptive Scope',
  },
  {
    id: 'faq-schema-4',
    question: 'What is the typical turnaround sprint duration?',
    answer: 'Focused landing pages launch in 5–7 business days. Full multi-page business websites launch in 10–14 business days.',
    category: 'process',
    highlight: 'Turnaround: 5–14 Business Days',
  },
  {
    id: 'faq-schema-5',
    question: 'What communication channels does AS Studio use?',
    answer: 'We communicate directly via Telegram (@AS_Studio_official01) and Gmail (asbusinessofficial01@gmail.com) with concise sprint updates and live staging links. WhatsApp is disabled.',
    category: 'support',
    highlight: 'Telegram & Gmail Direct',
  },
  {
    id: 'faq-schema-6',
    question: 'What does the 30-day post-launch warranty include?',
    answer: 'Every delivered website includes 30 days of complimentary technical warranty covering bug fixes, responsive screen adjustments, and minor copy updates with zero additional fees.',
    category: 'guarantees',
    highlight: '30-Day Free Warranty',
  },
  {
    id: 'faq-schema-7',
    question: 'What preparation do I need before our sprint begins?',
    answer: 'Only your core business summary, services, and any existing logos or photos. If you do not have photos or text ready, we curate high-fidelity visuals and write conversion headlines for you.',
    category: 'process',
    highlight: 'Zero Complex Prep Required',
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
            let highlight = 'Verified Trust';

            if (question.toLowerCase().includes('code') || question.toLowerCase().includes('warranty')) {
              category = 'guarantees';
              highlight = question.toLowerCase().includes('warranty') ? '30-Day Free Warranty' : '100% Code Handover';
            } else if (question.toLowerCase().includes('price') || question.toLowerCase().includes('cost')) {
              category = 'pricing';
              highlight = 'Negotiable & Transparent';
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
