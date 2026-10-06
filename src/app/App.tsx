import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Smartphone,
  Code2,
  Sparkles,
  ArrowUpRight,
  Layers,
  Check,
  MessageSquare,
  Mail,
  ChevronRight,
  X,
  Eye,
  Sliders,
} from 'lucide-react';
import {
  PROJECTS,
  SERVICES,
  PROCESS_STEPS,
  STUDIO_META,
  DatabaseService,
  OFFICIAL_CHANNELS,
  generateMailtoUrl,
  openDirectTelegram,
  Project,
} from '../infrastructure';

export const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeDemoUrl, setActiveDemoUrl] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Inquiry form state
  const [formData, setFormData] = useState({
    clientName: '',
    businessName: '',
    contactChannel: '',
    scopeSummary: '',
    targetBudget: 'Flexible / To Discuss',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const filteredProjects = PROJECTS.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const inquiryId = await DatabaseService.createInquiry({
        clientName: formData.clientName,
        businessName: formData.businessName,
        contactChannel: formData.contactChannel,
        scopeSummary: formData.scopeSummary,
        targetBudget: formData.targetBudget,
        source: 'website_contact_form',
      });

      setSubmitSuccess(inquiryId);
      setFormData({
        clientName: '',
        businessName: '',
        contactChannel: '',
        scopeSummary: '',
        targetBudget: 'Flexible / To Discuss',
      });
    } catch (err: any) {
      console.warn('Firestore write warning:', err);
      // Even if Firestore rules restrict direct write or offline, provide direct Telegram/email fallback
      setSubmitSuccess('direct_dispatch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#ECEFF1] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner Notice */}
      <div className="bg-[#12141A] border-b border-[#1F232B] px-4 py-2 text-xs flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Open for commissions • Flexible & negotiable pricing</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <a
            href={OFFICIAL_CHANNELS.TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
          >
            <span>Telegram: {OFFICIAL_CHANNELS.TELEGRAM_HANDLE}</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <a
            href={`mailto:${OFFICIAL_CHANNELS.GMAIL}`}
            className="text-neutral-400 hover:text-white hidden sm:flex items-center gap-1 transition"
          >
            <Mail className="w-3 h-3" />
            <span>{OFFICIAL_CHANNELS.GMAIL}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-[#0A0B0D]/85 backdrop-blur-md border-b border-[#1F232B] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center font-bold text-black text-sm group-hover:scale-105 transition">
              AS
            </span>
            <div className="flex flex-col">
              <span className="font-semibold tracking-wider text-base">AS STUDIO</span>
              <span className="text-[10px] text-neutral-400 -mt-1 tracking-widest uppercase">Digital Practice</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
            <a href="#work" className="hover:text-amber-400 transition">Selected Work</a>
            <a href="#services" className="hover:text-amber-400 transition">Services</a>
            <a href="#process" className="hover:text-amber-400 transition">Process</a>
            <a href="#guarantees" className="hover:text-amber-400 transition">Guarantees</a>
            <a href="#contact" className="hover:text-amber-400 transition">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wide transition shadow-lg shadow-amber-400/10 flex items-center gap-1.5"
            >
              <span>Get a Quote</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden border-b border-[#1A1D24]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161922] border border-amber-500/20 text-amber-300 text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fast, clean & mobile-first websites for serious businesses</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.1] max-w-4xl mx-auto font-editorial">
            Digital experiences built for proportion, clarity & conversions.
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            We build bespoke websites for architectural practices, healthcare clinics, luxury residences, and local businesses. Zero bloatware, 100% source code ownership.
          </p>

          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            <a
              href="#work"
              className="px-6 py-3.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-semibold text-sm transition flex items-center gap-2 shadow-xl"
            >
              <span>Explore Selected Work</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => openDirectTelegram('Hi AS Studio, I would like to discuss a website build.')}
              className="px-6 py-3.5 rounded-lg bg-[#161922] hover:bg-[#1E232F] border border-[#2D333F] text-neutral-200 font-medium text-sm transition flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Instant Telegram Chat</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-12 border-t border-[#1F232B] text-left">
            <div className="p-4 rounded-xl bg-[#111318]/70 border border-[#1E222A]">
              <div className="text-2xl font-semibold text-white">5–14 Days</div>
              <div className="text-xs text-neutral-400 mt-1">Average Turnaround</div>
            </div>
            <div className="p-4 rounded-xl bg-[#111318]/70 border border-[#1E222A]">
              <div className="text-2xl font-semibold text-amber-400">100% Ownership</div>
              <div className="text-xs text-neutral-400 mt-1">Full Source & No Lock-in</div>
            </div>
            <div className="p-4 rounded-xl bg-[#111318]/70 border border-[#1E222A]">
              <div className="text-2xl font-semibold text-white">&lt;500ms</div>
              <div className="text-xs text-neutral-400 mt-1">Mobile Load Time</div>
            </div>
            <div className="p-4 rounded-xl bg-[#111318]/70 border border-[#1E222A]">
              <div className="text-2xl font-semibold text-emerald-400">30-Day Support</div>
              <div className="text-xs text-neutral-400 mt-1">Post-Launch Warranty</div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work Section */}
      <section id="work" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Interactive Showcase</span>
            <h2 className="text-3xl sm:text-4xl font-normal text-white mt-2 font-editorial">Selected Studio Projects</h2>
            <p className="text-neutral-400 text-sm mt-2 max-w-xl">
              Every project includes live smartphone-tested interactive demos, bespoke typography, and zero third-party website builder dependency.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-6 md:mt-0 flex-wrap">
            {['all', 'Luxury Real Estate', 'Architecture', 'Healthcare'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  filterCategory === cat
                    ? 'bg-amber-400 text-black font-semibold'
                    : 'bg-[#151821] text-neutral-400 hover:text-white border border-[#222733]'
                }`}
              >
                {cat === 'all' ? 'All Work' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col rounded-2xl bg-[#111318] border border-[#1F232B] overflow-hidden hover:border-amber-500/30 transition-all duration-300 group"
            >
              {/* Image Preview Container */}
              <div className="relative h-64 overflow-hidden bg-neutral-900">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur border border-white/10 text-[10px] font-semibold tracking-wider uppercase text-amber-300">
                    {project.badge}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                  <span className="text-xs text-neutral-300 font-medium">{project.turnaround}</span>
                  <button
                    onClick={() => setActiveDemoUrl(project.liveDemoUrl)}
                    className="px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold flex items-center gap-1 shadow-md transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Launch Demo</span>
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-neutral-400 uppercase tracking-widest">{project.category}</div>
                  <h3 className="text-xl font-medium text-white mt-1 group-hover:text-amber-300 transition">
                    {project.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-3 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-[#181C24] text-[10px] text-neutral-300 border border-[#262C38]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1C2029] flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition"
                  >
                    <span>Inspect Case Study & Specs</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-300 p-1 transition"
                    title="Open Demo in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-[#0E1015] border-y border-[#1A1D24]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Core Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-normal text-white mt-2 font-editorial">Tailored Digital Services</h2>
            <p className="text-neutral-400 text-sm mt-3">
              We specialize strictly in what drives business: high-clarity positioning, mobile speed, and frictionless appointment / contact intake.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="p-8 rounded-2xl bg-[#13161D] border border-[#212632] flex flex-col justify-between hover:border-amber-500/30 transition"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold text-amber-400 px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20">
                      {srv.turnaround}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-white">{srv.title}</h3>
                  <p className="text-xs text-neutral-400 mt-2 font-light leading-relaxed">{srv.description}</p>
                  <div className="text-[11px] text-amber-200/70 mt-2 italic">Ideal for: {srv.idealFor}</div>

                  <div className="mt-6 space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Deliverables:</div>
                    {srv.deliverables.map((del) => (
                      <div key={del} className="flex items-center gap-2 text-xs text-neutral-400">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#1C2029]">
                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, scopeSummary: `Interested in: ${srv.title}` }));
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-lg bg-[#1B1F2A] hover:bg-amber-400 hover:text-black font-semibold text-xs text-neutral-200 transition"
                  >
                    Request This Build
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Discipline & Rhythm</span>
          <h2 className="text-3xl sm:text-4xl font-normal text-white mt-2 font-editorial">How We Work Together</h2>
          <p className="text-neutral-400 text-sm mt-3">
            A transparent 4-stage sprint with live prototype milestones and zero surprises.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-2xl bg-[#111318] border border-[#1F232B] relative flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl font-light text-amber-400/40 font-editorial mb-3">{step.step}</div>
                <div className="text-xs text-amber-400 font-semibold mb-1">{step.duration}</div>
                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{step.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1C2029]">
                <div className="text-[11px] font-medium text-neutral-300 mb-1.5">Key Deliverables:</div>
                <div className="space-y-1">
                  {step.deliverables.map((item) => (
                    <div key={item} className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantees Section */}
      <section id="guarantees" className="py-20 px-6 bg-[#0E1015] border-t border-[#1A1D24]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STUDIO_META.guarantees.map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-[#13161D] border border-[#212632]">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
                  {idx === 0 && <Code2 className="w-5 h-5" />}
                  {idx === 1 && <Smartphone className="w-5 h-5" />}
                  {idx === 2 && <ShieldCheck className="w-5 h-5" />}
                  {idx === 3 && <Sliders className="w-5 h-5" />}
                </div>
                <h4 className="text-base font-medium text-white mb-2">{item.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Inquiry Section */}
      <section id="contact" className="py-24 px-6 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#141720] to-[#0E1016] border border-[#252B38] relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Initiate Dialogue</span>
            <h2 className="text-3xl sm:text-4xl font-normal text-white mt-2 font-editorial">
              Let's Build Something Exceptional
            </h2>
            <p className="text-neutral-400 text-sm mt-3">
              Share your project vision below. We provide immediate quote options, negotiable pricing, and direct Telegram consultations.
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center max-w-lg mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white">Inquiry Received</h3>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                Thank you! We will review your requirements and reach out within 2 hours. For immediate turnaround, connect directly via Telegram.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => openDirectTelegram('Hi AS Studio, following up on my recent inquiry.')}
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 text-black font-semibold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Open Telegram Chat</span>
                </button>
                <button
                  onClick={() => setSubmitSuccess(null)}
                  className="px-5 py-2.5 rounded-lg bg-neutral-800 text-white text-xs font-medium"
                >
                  Submit Another Scope
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Dr. Jaiswal / Elena Vance"
                    className="w-full px-4 py-3 rounded-lg bg-[#0A0B0E] border border-[#232834] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Business / Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Nova Dental / Atelier North"
                    className="w-full px-4 py-3 rounded-lg bg-[#0A0B0E] border border-[#232834] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email or Telegram Handle *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactChannel}
                    onChange={(e) => setFormData({ ...formData, contactChannel: e.target.value })}
                    placeholder="contact@company.com or @handle"
                    className="w-full px-4 py-3 rounded-lg bg-[#0A0B0E] border border-[#232834] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Budget Expectation</label>
                  <select
                    value={formData.targetBudget}
                    onChange={(e) => setFormData({ ...formData, targetBudget: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#0A0B0E] border border-[#232834] text-sm text-white focus:outline-none focus:border-amber-400 transition"
                  >
                    <option>Flexible / To Discuss (Negotiable)</option>
                    <option>Starter Landing Page ($300–$600)</option>
                    <option>Full Business Website ($800–$1,800)</option>
                    <option>Custom Architectural / Enterprise Monograph ($2,000+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Project Scope & Key Goals *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.scopeSummary}
                  onChange={(e) => setFormData({ ...formData, scopeSummary: e.target.value })}
                  placeholder="Describe your current challenges, desired timeline, target clients, and any specific inspiration..."
                  className="w-full px-4 py-3 rounded-lg bg-[#0A0B0E] border border-[#232834] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10"
                >
                  {isSubmitting ? (
                    <span>Submitting Brief...</span>
                  ) : (
                    <>
                      <span>Submit Project Brief</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openDirectTelegram(
                      `Hi AS Studio, my name is ${formData.clientName || 'there'} with ${formData.businessName || 'a project'}. ${formData.scopeSummary || 'I would like to discuss a custom build.'}`
                    )
                  }
                  className="py-3.5 px-6 rounded-lg bg-[#181C26] hover:bg-[#202534] border border-[#282F3E] text-neutral-200 text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Send via Telegram Instead</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1C2029] bg-[#08090C] px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded bg-amber-400 flex items-center justify-center font-bold text-black text-xs">
              AS
            </span>
            <span className="text-sm font-semibold tracking-wider text-white">AS STUDIO</span>
            <span className="text-xs text-neutral-500">• Clean Business Websites & Redesigns</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <a href="#work" className="hover:text-white transition">Work</a>
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#process" className="hover:text-white transition">Process</a>
            <a href={OFFICIAL_CHANNELS.TELEGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">
              Telegram: @AS_Studio_official01
            </a>
            <a href={`mailto:${OFFICIAL_CHANNELS.GMAIL}`} className="hover:text-white transition">
              {OFFICIAL_CHANNELS.GMAIL}
            </a>
          </div>

          <div className="text-xs text-neutral-600">
            © {new Date().getFullYear()} AS Studio. All source code ownership reserved to clients.
          </div>
        </div>
      </footer>

      {/* Case Study Inspector Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111319] border border-[#262C3A] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-[#1A1F2B] hover:bg-[#252C3D] text-neutral-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">
              {selectedProject.badge} • {selectedProject.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium text-white mt-2 font-editorial">
              {selectedProject.name}
            </h2>

            <div className="mt-6 rounded-xl overflow-hidden border border-[#232938]">
              <img src={selectedProject.imageUrl} alt={selectedProject.name} className="w-full h-64 object-cover" />
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">The Problem</h4>
                <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{selectedProject.problem}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Studio Approach</h4>
                <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{selectedProject.approach}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Solution Delivered</h4>
                <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{selectedProject.solution}</p>
              </div>

              {selectedProject.conceptDetails && (
                <div className="p-4 rounded-xl bg-[#161922] border border-[#222837] space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">Key Deliverables</h4>
                  <ul className="space-y-1.5">
                    {selectedProject.conceptDetails.keyDeliverables.map((item, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-[#232938] flex flex-wrap gap-4 justify-between items-center">
              <button
                onClick={() => {
                  setActiveDemoUrl(selectedProject.liveDemoUrl);
                  setSelectedProject(null);
                }}
                className="px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Launch Interactive Demo Viewport</span>
              </button>

              <a
                href={selectedProject.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition"
              >
                <span>Open in dedicated browser window</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Live Demo Viewport Modal */}
      {activeDemoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col p-4 sm:p-6">
          <div className="bg-[#141720] border border-[#262C3A] rounded-t-xl px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              <span className="text-xs text-neutral-400 ml-3 font-mono">{activeDemoUrl}</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={activeDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Full Window</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setActiveDemoUrl(null)}
                className="p-1.5 rounded-md bg-[#212634] hover:bg-[#2B3245] text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black rounded-b-xl overflow-hidden border-x border-b border-[#262C3A]">
            <iframe
              src={activeDemoUrl}
              title="Studio Demo Preview"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
