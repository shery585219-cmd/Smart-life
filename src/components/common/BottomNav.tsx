import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Sparkles,
  ShoppingBag,
  Flame,
  Plus,
  BrainCircuit,
  Timer,
  X,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audio';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setTaskModalOpen,
    setEditingTask,
    setHabitModalOpen,
    setEditingHabit,
    setShoppingModalOpen,
    setEditingShoppingItem,
    setAiIdeaModalOpen,
    setPomodoroModalOpen,
    triggerHaptic,
  } = useApp();

  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

  const handleTabClick = (tab: any) => {
    soundFx.playTap();
    triggerHaptic();
    setActiveTab(tab);
    setQuickMenuOpen(false);
  };

  const navItems = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'habits', label: 'Habits', icon: Flame },
    { id: 'shopping', label: 'Shop', icon: ShoppingBag },
    { id: 'ai', label: 'AI Helper', icon: BrainCircuit, badge: 'AI' },
  ];

  return (
    <>
      {/* Quick Action Floating Menu Backdrop */}
      {quickMenuOpen && (
        <div
          onClick={() => setQuickMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity animate-in fade-in"
        />
      )}

      {/* Quick Action Menu Modal / Sheet */}
      {quickMenuOpen && (
        <div className="fixed bottom-22 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 z-50 animate-in zoom-in-95 slide-in-from-bottom-6 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Quick Action
            </span>
            <button
              onClick={() => setQuickMenuOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-3">
            {/* New Task */}
            <button
              onClick={() => {
                setEditingTask(null);
                setTaskModalOpen(true);
                setQuickMenuOpen(false);
                soundFx.playTap();
              }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 text-left transition active:scale-98"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold">New Task</div>
                <div className="text-[10px] text-blue-600/70 dark:text-blue-400">School, work, life</div>
              </div>
            </button>

            {/* AI Idea to Tasks */}
            <button
              onClick={() => {
                setAiIdeaModalOpen(true);
                setQuickMenuOpen(false);
                soundFx.playTap();
              }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/60 border border-violet-200/60 dark:border-violet-800/60 text-left transition active:scale-98"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold">Idea to Tasks</div>
                <div className="text-[10px] text-violet-600/70 dark:text-violet-400">AI auto-plan</div>
              </div>
            </button>

            {/* New Habit */}
            <button
              onClick={() => {
                setEditingHabit(null);
                setHabitModalOpen(true);
                setQuickMenuOpen(false);
                soundFx.playTap();
              }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/60 dark:border-amber-800/60 text-left transition active:scale-98"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold">New Habit</div>
                <div className="text-[10px] text-amber-600/70 dark:text-amber-400">Build your streak</div>
              </div>
            </button>

            {/* Shopping Item */}
            <button
              onClick={() => {
                setEditingShoppingItem(null);
                setShoppingModalOpen(true);
                setQuickMenuOpen(false);
                soundFx.playTap();
              }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-800/60 text-left transition active:scale-98"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold">Shopping Item</div>
                <div className="text-[10px] text-emerald-600/70 dark:text-emerald-400">Groceries & items</div>
              </div>
            </button>

            {/* Focus Pomodoro */}
            <button
              onClick={() => {
                setPomodoroModalOpen(true);
                setQuickMenuOpen(false);
                soundFx.playTap();
              }}
              className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800/60 transition active:scale-98 text-xs font-bold"
            >
              <Timer className="w-4 h-4 text-rose-600" />
              <span>Launch Focus Pomodoro Timer</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav
        aria-label="Bottom Navigation"
        className="sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 px-3 py-2 pb-5 md:pb-2 transition-colors"
      >
        <div className="flex items-center justify-between max-w-lg mx-auto relative">
          {/* First 2 tabs */}
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                <span className="text-[11px] leading-tight">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
                )}
              </button>
            );
          })}

          {/* Central Floating Plus Button */}
          <div className="relative -top-3">
            <button
              onClick={() => {
                soundFx.playTap();
                triggerHaptic();
                setQuickMenuOpen(!quickMenuOpen);
              }}
              aria-label="Add new item"
              className={`w-13 h-13 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform active:scale-90 hover:scale-105 ${
                quickMenuOpen ? 'rotate-45' : 'rotate-0'
              }`}
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Last 3 tabs */}
          {navItems.slice(2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 text-[8px] font-black px-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-tight">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
