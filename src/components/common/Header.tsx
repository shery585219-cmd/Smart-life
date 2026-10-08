import React, { useState } from 'react';
import {
  Bell,
  Search,
  Sparkles,
  Flame,
  Settings,
  ShieldCheck,
  CheckCircle2,
  X,
  Crown,
  Smartphone,
  Maximize2,
  Trophy,
  Printer,
  Gift,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    profile,
    updateProfile,
    reminders,
    dismissReminder,
    setSearchOpen,
    setProModalOpen,
    setSettingsModalOpen,
    setRewardsModalOpen,
    setPlannerPrintOpen,
    triggerCelebration,
  } = useApp();

  const [showRemindersMenu, setShowRemindersMenu] = useState(false);

  const personaLabel =
    profile.persona === 'kid'
      ? 'Explorer'
      : profile.persona === 'teen'
      ? 'Student'
      : 'Pro';

  const personaBadgeColor =
    profile.persona === 'kid'
      ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
      : profile.persona === 'teen'
      ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
      : 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300';

  const unreadReminders = reminders.filter((r) => !r.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 transition-colors">
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Left: Branding & Persona badge */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-extrabold text-xl tracking-tight">
              S
            </div>
            {profile.isPro && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] text-amber-950 font-black">
                ★
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                SmartLife
              </h1>
              <span
                className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full border ${personaBadgeColor}`}
              >
                {personaLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5">
          {/* Level / Quests Button */}
          <button
            onClick={() => setRewardsModalOpen(true)}
            title={`Level ${profile.level} (${profile.xp} XP)`}
            aria-label="View quests and rewards"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-300/70 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 text-xs font-bold transition hover:scale-105 active:scale-95"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Lv.{profile.level}</span>
          </button>

          {/* Streak Flame */}
          <button
            onClick={() => triggerCelebration()}
            title={`${profile.streakDays} Day Streak!`}
            aria-label="View streak info"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-300/60 dark:border-amber-600/40 text-amber-600 dark:text-amber-400 text-xs font-bold transition hover:scale-105 active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse-subtle" />
            <span>{profile.streakDays}d</span>
          </button>

          {/* Printable Sheet */}
          <button
            onClick={() => setPlannerPrintOpen(true)}
            title="Print or export Daily Planner sheet"
            aria-label="Print daily planner"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition active:scale-95 hidden sm:flex"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search items"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition active:scale-95"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Reminder Bell */}
          <div className="relative">
            <button
              onClick={() => setShowRemindersMenu(!showRemindersMenu)}
              aria-label="Notifications & Reminders"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition relative active:scale-95"
            >
              <Bell className="w-4 h-4" />
              {unreadReminders > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-ping" />
              )}
              {unreadReminders > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Reminders Dropdown Popup */}
            {showRemindersMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Reminders & Alerts
                  </h3>
                  <button
                    onClick={() => setShowRemindersMenu(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {reminders.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-500 opacity-80" />
                      All caught up! No active alerts.
                    </div>
                  ) : (
                    reminders.map((rem) => (
                      <div
                        key={rem.id}
                        className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-100">
                            {rem.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {rem.time} • {rem.category}
                          </div>
                        </div>
                        <button
                          onClick={() => dismissReminder(rem.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pro Badge / Upgrade */}
          {profile.isPro ? (
            <button
              onClick={() => setProModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-sm shadow-amber-500/20 hover:brightness-105 active:scale-95"
            >
              <Crown className="w-3 h-3" />
              <span>PRO</span>
            </button>
          ) : (
            <button
              onClick={() => setProModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95 transition"
            >
              <Sparkles className="w-3 h-3" />
              <span>Free</span>
            </button>
          )}

          {/* Toggle Device Frame View (Mobile Shell vs Full screen) */}
          <button
            onClick={() =>
              updateProfile({
                settings: {
                  ...profile.settings,
                  mobileFrameView: !profile.settings.mobileFrameView,
                },
              })
            }
            title={profile.settings.mobileFrameView ? 'Switch to Full Screen layout' : 'Switch to Phone Mockup frame'}
            aria-label="Toggle Phone Frame View"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition active:scale-95"
          >
            {profile.settings.mobileFrameView ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Smartphone className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            aria-label="Settings and Profile"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
