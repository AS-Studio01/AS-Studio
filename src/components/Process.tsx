export function Process() {
  const steps = [
    {
      step: '01',
      title: 'Brief',
      description: 'Tell us about your business, audience and main goal.',
      details: 'A focused discussion on what your business provides, who your customer is, and what action you want them to take.',
    },
    {
      step: '02',
      title: 'Direction',
      description: 'We create a clear page structure and visual direction.',
      details: 'We map out content sections, typographic hierarchy, and clean mobile-first layouts before writing production code.',
    },
    {
      step: '03',
      title: 'Build',
      description: 'You receive a working preview before launch.',
      details: 'Fast, responsive development. You can click through every interaction on your actual phone and browser.',
    },
    {
      step: '04',
      title: 'Launch',
      description: 'Final checks, handover and source-code delivery.',
      details: 'Cross-browser validation, domain setup, full ownership of code and assets with no proprietary platform lock-in.',
    },
  ];

  return (
    <section id="process" className="py-24 sm:py-32 border-b border-[#E7E2DA] dark:border-[#27272A] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="max-w-xl mb-16">
          <span className="text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold block mb-2 font-mono">
            Methodology
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#121212] dark:text-white">
            A clear process
          </h2>
        </div>

        {/* Four numbered steps in a clean layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] p-7 sm:p-8 flex flex-col justify-between hover:border-[#121212] dark:hover:border-white transition-colors shadow-sm"
            >
              <div>
                {/* Step number */}
                <div className="text-xs font-mono font-black text-[#0047AB] dark:text-[#3B82F6] tracking-widest mb-6">
                  {item.step}
                </div>

                {/* Step title */}
                <h3 className="text-xl font-black tracking-tight text-[#121212] dark:text-white mb-3">
                  {item.title}
                </h3>

                {/* Step exact description */}
                <p className="text-sm font-bold text-[#2E2B27] dark:text-[#E4E4E7] leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Subdued process context */}
              <p className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA] leading-relaxed pt-4 border-t border-[#F0EBE1] dark:border-[#27272A]">
                {item.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
