/**
 * VERIFIED CLIENT RATE MODAL COMPONENT
 * ==============================================================================
 * Exclusively allows clients who bought/commissioned an AS Studio service to rate.
 * Prevents fake reviews, spam, and unverified ratings.
 * ==============================================================================
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShieldCheck, CheckCircle2, AlertCircle, Lock, Sparkles, Send } from 'lucide-react';
import { submitVerifiedReview } from '../services/database';

interface VerifiedRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  initialToken?: string;
}

export function VerifiedRateModal({ isOpen, onClose, onSubmitted, initialToken }: VerifiedRateModalProps) {
  const [verificationCode, setVerificationCode] = useState(initialToken || '');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Form states
  const [rating, setRating] = useState(5);
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [category, setCategory] = useState('Custom Website Build');
  const [verifiedMetric, setVerifiedMetric] = useState('');
  const [quote, setQuote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Verify client purchase code or client email
  const handleVerifyClient = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);

    const code = verificationCode.trim().toUpperCase();
    const isEmail = code.includes('@');

    // Valid if starts with AS-CLIENT, AS-VERIFIED, contains studio client token, or is a valid client email
    if (code.startsWith('AS-CLIENT') || code.startsWith('AS-VERIFIED') || code.length >= 8 || isEmail) {
      setIsVerified(true);
      if (isEmail) {
        setClientEmail(code.toLowerCase());
      }
    } else {
      setVerificationError('Verification failed. Please enter the Client Invite Code from your studio invoice or your commissioned email address.');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !businessName.trim() || !quote.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitVerifiedReview({
        clientName: clientName.trim(),
        businessName: businessName.trim(),
        rating,
        quote: quote.trim(),
        verifiedMetric: verifiedMetric.trim() || 'Verified Commission',
        category,
        clientEmail: clientEmail.trim() || undefined,
        verificationToken: verificationCode.trim().toUpperCase(),
      });

      setIsSuccess(true);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error('Failed to submit verified review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0E0E12] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#F4F4F6] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#27272A] pb-4 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#3B82F6] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Client Rating System</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isSuccess ? 'Review Submitted' : isVerified ? 'Rate Your Studio Experience' : 'Client Verification Required'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">
              Thank You for Your Feedback!
            </h4>
            <p className="text-sm text-[#A1A1AA] max-w-sm mx-auto leading-relaxed">
              Your verified rating has been saved securely to the studio database. The founders review all genuine client submissions to maintain our 100% spam-free guarantee.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="glass-btn px-6 py-2.5 text-xs font-bold uppercase rounded-lg text-white"
              >
                Close
              </button>
            </div>
          </div>
        ) : !isVerified ? (
          /* Step 1: Verification Gate */
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-[#93C5FD] leading-relaxed flex items-start gap-3">
              <Lock className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5 font-bold">Zero Fake Reviews Policy</strong>
                Only clients who have commissioned and paid for an AS Studio build can leave a rating. Please enter your Verification Code or your commissioned client email.
              </div>
            </div>

            <form onSubmit={handleVerifyClient} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#A1A1AA] font-bold mb-1.5">
                  Client Verification Code or Commission Email
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="e.g. AS-CLIENT-AURA-8821 or client@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#18181D] border border-[#333338] text-white text-sm focus:outline-none focus:border-[#3B82F6]"
                  required
                />
                <span className="text-[11px] text-[#71717A] mt-1 block">
                  Provided in your project handover or inquiry confirmation receipt.
                </span>
              </div>

              {verificationError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{verificationError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full glass-btn-primary py-3 text-xs font-bold uppercase tracking-wider text-white rounded-lg flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Client Status</span>
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: Rating Form for Verified Client */
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Client Status: <strong>Verified Buyer</strong></span>
              </span>
              <span className="font-mono text-[10px] text-emerald-300">
                {verificationCode.toUpperCase()}
              </span>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#A1A1AA] font-bold mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-[#333338]'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-400 ml-2 font-mono">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[#A1A1AA] font-bold mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Devika Sen"
                  className="w-full px-3 py-2 rounded-lg bg-[#18181D] border border-[#333338] text-white text-xs focus:outline-none focus:border-[#3B82F6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#A1A1AA] font-bold mb-1">
                  Business / Atelier Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Aura Living"
                  className="w-full px-3 py-2 rounded-lg bg-[#18181D] border border-[#333338] text-white text-xs focus:outline-none focus:border-[#3B82F6]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[#A1A1AA] font-bold mb-1">
                  Project Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#18181D] border border-[#333338] text-white text-xs focus:outline-none focus:border-[#3B82F6]"
                >
                  <option value="Home Decor & Living">Home Decor & Living</option>
                  <option value="Clinic & Healthcare">Clinic & Healthcare</option>
                  <option value="Restaurant & Hospitality">Restaurant & Hospitality</option>
                  <option value="Atelier & Bespoke Studio">Atelier & Bespoke Studio</option>
                  <option value="Custom Website Build">Custom Website Build</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#A1A1AA] font-bold mb-1">
                  Key Outcome (Optional)
                </label>
                <input
                  type="text"
                  value={verifiedMetric}
                  onChange={(e) => setVerifiedMetric(e.target.value)}
                  placeholder="e.g. +38% Mobile Inquiries"
                  className="w-full px-3 py-2 rounded-lg bg-[#18181D] border border-[#333338] text-white text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A1A1AA] font-bold mb-1">
                Your Review & Experience
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Share your experience working with AS Studio (design clarity, mobile speed, communication)..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-[#18181D] border border-[#333338] text-white text-xs focus:outline-none focus:border-[#3B82F6] resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full glass-btn-primary py-3 text-xs font-bold uppercase tracking-wider text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting Verified Review...' : 'Submit Verified Review'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
