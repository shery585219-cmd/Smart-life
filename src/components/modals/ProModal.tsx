import React, { useState } from 'react';
import {
  X,
  Crown,
  Check,
  Sparkles,
  Users,
  Copy,
  Gift,
  Share2,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProModal: React.FC = () => {
  const {
    proModalOpen,
    setProModalOpen,
    profile,
    upgradeToPro,
    updateProfile,
    triggerCelebration,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [annualPlan, setAnnualPlan] = useState(true);

  if (!proModalOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const success = upgradeToPro(promoCode);
    if (success) {
      setPromoError(false);
      setPromoCode('');
    } else {
      setPromoError(true);
    }
  };

  const handleCopyReferral = () => {
    const text = `Join SmartLife with my code ${profile.referralCode} for an all-in-one daily assistant! https://smartlife.app/join/${profile.referralCode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const perks = [
    { name: 'Core Tasks & Subtasks', free: 'Unlimited', pro: 'Unlimited' },
    { name: 'Active Habit Trackers', free: 'Up to 4', pro: 'Unlimited' },
    { name: 'AI Assistant Queries', free: '5 / day', pro: 'Unlimited 🚀' },
    { name: 'AI Daily Schedules', free: 'Basic', pro: 'Deep Time-blocking' },
    { name: 'AI Multi-Week Goals', free: '1 Active', pro: 'Unlimited' },
    { name: 'Grocery & Errands Lists', free: 'Standard', pro: 'AI Categorized' },
    { name: 'Themes & Persona Modes', free: 'Included', pro: 'VIP Custom Accents' },
    { name: 'Cloud Backup & JSON Export', free: 'Local only', pro: 'Multi-device Sync' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header Hero Banner */}
        <div className="relative p-6 bg-gradient-to-br from-indigo-900 via-blue-900 to-violet-950 text-white overflow-hidden shrink-0">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" />
          <button
            onClick={() => setProModalOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
              <Crown className="w-3 h-3 fill-amber-950" />
              SmartLife PRO
            </span>
            {profile.isPro && (
              <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Active Member
              </span>
            )}
          </div>

          <h2 className="text-xl font-black tracking-tight leading-snug">
            Unlock Unlimited Superpowers
          </h2>
          <p className="text-xs text-blue-200/90 mt-1">
            Supercharge your productivity, habits, and daily schedules with zero friction.
          </p>

          {/* Pricing Toggle */}
          <div className="mt-4 p-1 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center text-xs font-semibold">
            <button
              onClick={() => setAnnualPlan(true)}
              className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                annualPlan ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80'
              }`}
            >
              <span>Annual ($3.99/mo)</span>
              <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                SAVE 40%
              </span>
            </button>
            <button
              onClick={() => setAnnualPlan(false)}
              className={`flex-1 py-1.5 rounded-xl transition ${
                !annualPlan ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80'
              }`}
            >
              Monthly ($6.99/mo)
            </button>
          </div>
        </div>

        {/* Scrollable Features & Actions */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Comparison table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
            <div className="grid grid-cols-3 bg-slate-50 dark:bg-slate-800/80 p-2.5 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
              <span>Feature</span>
              <span className="text-center text-slate-400">Free</span>
              <span className="text-center text-amber-500">PRO</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {perks.map((p, i) => (
                <div key={i} className="grid grid-cols-3 p-2.5 items-center">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {p.name}
                  </span>
                  <span className="text-center text-slate-500 dark:text-slate-400 text-[11px]">
                    {p.free}
                  </span>
                  <span className="text-center font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                    {p.pro}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Viral Program */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-300/40 dark:border-amber-700/40">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Invite Friends & Get Pro Free
              </h3>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Give a friend 1 month free. When they join, you get 1 free month too! ({profile.friendsReferred} referred so far)
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {profile.referralCode}
              </div>
              <button
                onClick={handleCopyReferral}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center gap-1 hover:opacity-90 transition active:scale-95"
              >
                {copiedLink ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              Have a Promo or Student Code? (Try "STUDENT" or "SMART2026")
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs uppercase tracking-wider"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <span className="text-[10px] text-rose-500 font-semibold block">
                Invalid code. Try "SMART2026" or "STUDENT"!
              </span>
            )}
          </form>

          {/* Action Upgrade Button */}
          {!profile.isPro ? (
            <button
              onClick={() => {
                upgradeToPro();
                triggerCelebration();
              }}
              className="w-full py-3 px-4 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:brightness-110 shadow-lg shadow-indigo-500/25 transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Start 14-Day Free Trial (Then {annualPlan ? '$3.99/mo' : '$6.99/mo'})
            </button>
          ) : (
            <div className="p-3 text-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              ✓ You are enjoying SmartLife PRO with unlimited access.
            </div>
          )}

          <p className="text-[10px] text-slate-400 text-center">
            No annoying ads in any tier. Cancel anytime with 1 click.
          </p>
        </div>
      </div>
    </div>
  );
};
