import { ShieldCheck, Smartphone, Lock, MessageSquare, Zap, Wrench } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface TestimonialsProps {
  onOpenRateModal?: () => void;
}

export function Testimonials({ onOpenRateModal }: TestimonialsProps) {
  const { content } = useSiteContent();
  const section = content.sections.testimonials;

  const expectations = [
    {
      icon: Smartphone,
      title: 'Working Phone Previews',
      description: 'You test the actual responsive website directly on your personal phone before public domain launch or final payment.',
    },
    {
      icon: Lock,
      title: 'Clear Handover',
      description: 'The agreed production files, access and handover materials are provided according to the project scope.',
    },
    {
      icon: MessageSquare,
      title: 'Direct Founder Communication',
      description: 'Direct collaboration via Telegram and Gmail with concise updates and clear staging milestones. No account manager layers.',
    },
    {
      icon: Zap,
      title: 'Performance-minded builds',
      description: 'Layouts and assets are kept purposeful, with performance checked during the real build rather than promised with unverified numbers.',
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Scoped Pricing',
      description: 'Project scope determines the final investment. Every proposal is scoped transparently according to your actual business requirements.',
    },
    {
      icon: Wrench,
      title: 'Post-Launch Technical Support',
      description: 'Complimentary 30-day technical support for implementation issues and bug fixes related to the delivered scope.',
    },
  ];

  return (
    <section id="approach" className="py-20 sm:py-28 border-b border-[#E5E2D9] dark:border-white/[0.08] bg-[#FFFFFF] dark:bg-[#0A0A0E] relative transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 sm:mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-2">
            {section.eyebrow || 'Our Commitments'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#090A0D] dark:text-white mb-4">
            {section.title || 'What clients can expect from every engagement.'}
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563] dark:text-[#D4D4D8] leading-relaxed">
            {section.description || 'Honest commitments, working previews on your phone, and zero proprietary platform lock-in.'}
          </p>
        </div>

        {/* 6 Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expectations.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 sm:p-7 rounded-2xl bg-[#FAF9F5] dark:bg-[#121218] border border-[#E5E2D9] dark:border-white/[0.08] hover:border-[#0047AB] dark:hover:border-white/20 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#18181B] dark:text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E2D9] dark:border-white/[0.06] text-[10px] font-mono text-[#6B7280] dark:text-[#71717A] uppercase tracking-wider">
                  Commitment 0{index + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Verification Link for Real Project Holders */}
        {onOpenRateModal && (
          <div className="mt-10 pt-6 border-t border-[#E5E2D9] dark:border-white/[0.06] flex items-center justify-between text-xs text-[#6B7280] dark:text-[#71717A] font-mono">
            <span>Client verification system for commissioned projects</span>
            <button
              onClick={onOpenRateModal}
              className="text-[#52525B] hover:text-[#090A0D] dark:text-[#A1A1AA] dark:hover:text-white transition-colors underline"
            >
              Verify commissioned project →
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

