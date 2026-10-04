import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle, ArrowRight, ShieldCheck, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import { extractFaqsFromJsonLd, SchemaFAQItem } from '../utils/schemaFaqParser';

interface FAQProps {
  onNavigateToContact?: () => void;
}

export function FAQ({ onNavigateToContact }: FAQProps) {
  const [faqs, setFaqs] = useState<SchemaFAQItem[]>([]);
  const [isSchemaSynced, setIsSchemaSynced] = useState(false);
  const [schemaType, setSchemaType] = useState('Schema.org FAQPage');
  const [openId, setOpenId] = useState<string | null>('schema-faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Load dynamically from JSON-LD on mount
  useEffect(() => {
    const result = extractFaqsFromJsonLd();
    setFaqs(result.faqs);
    setIsSchemaSynced(result.isDynamic);
    setSchemaType(result.schemaType);
    if (result.faqs.length > 0) {
      setOpenId(result.faqs[0].id);
    }
  }, []);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'guarantees', label: 'Guarantees & Code' },
    { id: 'pricing', label: 'Pricing & Budget' },
    { id: 'process', label: 'Process & Staging' },
    { id: 'support', label: 'Channels & Support' },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        (faq.highlight && faq.highlight.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section 
      id="faq" 
      aria-label="Frequently Asked Questions"
      className="py-24 sm:py-32 border-b border-[#E7E2DA] dark:border-[#27272A] bg-[#FAF8F5] dark:bg-[#0E0E10] transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#18181B] border border-[#DDD7CD] dark:border-[#27272A] text-xs font-bold font-mono uppercase tracking-wider text-[#0047AB] dark:text-[#3B82F6]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#121212] dark:text-white">
            Common questions answered upfront.
          </h2>

          <p className="text-sm sm:text-base text-[#4A4641] dark:text-[#D4D4D8] font-medium leading-relaxed">
            Everything you need to know about working with AS Studio, from project scope and timelines to final handover.
          </p>

          {/* Dynamic JSON-LD Schema Trust Indicator */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-[11px] font-mono text-[#0047AB] dark:text-[#60A5FA]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                Synced with <strong>{schemaType}</strong> for search engines & client transparency
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls: Search & Category Pills */}
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search common questions (pricing, ownership, staging, timeline)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] rounded-lg text-xs sm:text-sm text-[#121212] dark:text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0047AB] dark:focus:border-[#3B82F6] transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#0047AB] dark:bg-[#3B82F6] text-white shadow-xs'
                    : 'bg-white dark:bg-[#18181B] text-[#52525B] dark:text-[#A1A1AA] border border-[#DDD7CD] dark:border-[#27272A] hover:text-[#0047AB] dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Accordion (Dynamically populated from JSON-LD) */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-white/50 dark:bg-[#18181B]/50 border border-[#DDD7CD] dark:border-[#27272A] rounded-xl text-xs sm:text-sm text-[#71717A]">
              No questions found matching &ldquo;{searchQuery}&rdquo;. Try another search keyword.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white/90 dark:bg-[#18181B]/90 border border-[#DDD7CD] dark:border-[#27272A] overflow-hidden transition-all duration-200 shadow-sm rounded-lg"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-5 sm:px-7 sm:py-5.5 text-left flex items-center justify-between gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
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
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-1 text-xs sm:text-sm text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed border-t border-[#F0EBE1] dark:border-[#222226]">
                          <p className="font-medium mb-3">{faq.answer}</p>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {faq.highlight && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-[#0047AB] dark:text-[#60A5FA] rounded">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>{faq.highlight}</span>
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#71717A] font-mono">
                              <Sparkles className="w-2.5 h-2.5 text-[#3B82F6]" />
                              <span>Verified Schema.org FAQ</span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Quiet support footer */}
        {onNavigateToContact && (
          <div className="mt-12 p-6 sm:p-7 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
            <div>
              <span className="text-xs uppercase font-mono font-bold text-[#736E66] dark:text-[#A1A1AA] block">
                Have a question not listed here?
              </span>
              <span className="text-sm font-bold text-[#121212] dark:text-white">
                Chat with our AI assistant in the bottom-right or send a quick message directly on Telegram.
              </span>
            </div>
            <button
              onClick={onNavigateToContact}
              className="glass-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shrink-0"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
