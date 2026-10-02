import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQProps {
  onNavigateToContact?: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  highlight?: string;
}

export function FAQ({ onNavigateToContact }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>('q1');

  const faqs: FAQItem[] = [
    {
      id: 'q1',
      question: 'How does your pricing work? Is it negotiable for small businesses and founders?',
      answer: 'Yes, our pricing is fully negotiable and adaptable to your budget. We work with local clinics, family cafes, home decor studios, and independent founders, so we tailor the scope to meet what you can comfortably invest. There are no rigid corporate minimums.',
      highlight: 'Negotiable & Budget-Adaptive',
    },
    {
      id: 'q2',
      question: 'How long does it typically take to design and launch my website?',
      answer: 'Most projects are completed within 5 to 14 business days. High-impact landing pages take 5–7 days, while comprehensive multi-page websites take 10–14 days. We work in focused, uninterrupted sprints so you get working interactive previews early.',
      highlight: 'Turnaround: 5–14 Business Days',
    },
    {
      id: 'q3',
      question: 'Will I own 100% of the website, code, and digital assets?',
      answer: 'Yes, 100%. Upon project completion, we hand over complete production source code, clean styling assets, and configuration. You own all intellectual property with zero proprietary builder lock-in and zero monthly platform hostage fees.',
      highlight: '100% Full IP & Source Handover',
    },
    {
      id: 'q4',
      question: 'What do I need to prepare before we begin work?',
      answer: 'Just your high-level business summary, the services or products you provide, and any logos or photos you currently have. If you do not have professional photos or finished copy, we curate aesthetic visuals and write clear, high-converting headlines for you.',
      highlight: 'Zero Complex Prep Required',
    },
    {
      id: 'q5',
      question: 'Can I test the website live on my smartphone before launch?',
      answer: 'Yes. Before any final payment or public rollout, you receive a private live staging URL. You can test all touch interactions, load speeds, and layouts on your actual smartphone and tablet to ensure complete satisfaction.',
      highlight: 'Live Staging on Your Phone',
    },
    {
      id: 'q6',
      question: 'Which communication methods do you use during the project?',
      answer: 'We communicate directly via Telegram (@AS_Studio_official01) and Gmail (asbusinessofficial01@gmail.com). We provide concise written updates, screenshots, and live previews without wasting your time in unnecessary meetings. (Please note WhatsApp is currently disabled).',
      highlight: 'Direct Telegram & Gmail Access',
    },
    {
      id: 'q7',
      question: 'What happens if I need adjustments after the website goes live?',
      answer: 'Every website includes our complimentary 30-Day Post-Launch Warranty. If you notice any technical issue, need a minor text adjustment, or want guidance updating content, we handle it promptly at zero additional charge.',
      highlight: '30-Day Free Technical Warranty',
    },
  ];

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-24 sm:py-32 border-b border-[#E7E2DA] dark:border-[#27272A] bg-[#FAF8F5] dark:bg-[#0E0E10] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#18181B] border border-[#DDD7CD] dark:border-[#27272A] text-xs font-bold font-mono uppercase tracking-wider text-[#0047AB] dark:text-[#3B82F6]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#121212] dark:text-white">
            Common questions answered upfront.
          </h2>

          <p className="text-sm sm:text-base text-[#4A4641] dark:text-[#D4D4D8] font-medium leading-relaxed">
            Everything you need to know about working with AS Studio, from negotiable pricing to source code delivery.
          </p>
        </div>

        {/* Collapsible Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white/90 dark:bg-[#18181B]/90 border border-[#DDD7CD] dark:border-[#27272A] overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-5 sm:px-7 sm:py-6 text-left flex items-center justify-between gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-[#121212] dark:text-white tracking-tight">
                    {faq.question}
                  </span>
                  <span className="p-1 rounded-full glass-btn text-[#0047AB] dark:text-[#3B82F6] shrink-0">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-1 text-sm text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed border-t border-[#F0EBE1] dark:border-[#222226]">
                        <p className="font-medium mb-3">{faq.answer}</p>
                        {faq.highlight && (
                          <div className="inline-block px-2.5 py-1 text-[11px] font-mono font-bold bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-[#0047AB] dark:text-[#3B82F6]">
                            ✓ {faq.highlight}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Quiet support footer */}
        {onNavigateToContact && (
          <div className="mt-12 p-6 sm:p-7 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
            <div>
              <span className="text-xs uppercase font-mono font-bold text-[#736E66] dark:text-[#A1A1AA] block">
                Want to discuss custom budget options?
              </span>
              <span className="text-sm font-bold text-[#121212] dark:text-white">
                Share your target budget on Telegram or email — we tailor the plan to match.
              </span>
            </div>
            <button
              onClick={onNavigateToContact}
              className="glass-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shrink-0"
            >
              <span>Discuss pricing & budget</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
