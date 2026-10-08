import React from 'react';
import { X, Printer, Download, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/storage';

export const PrintDailyPlannerModal: React.FC = () => {
  const { plannerPrintOpen, setPlannerPrintOpen, tasks, habits, schedule, profile } = useApp();

  if (!plannerPrintOpen) return null;

  const todayStr = getTodayDateString();
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr || !t.completed).slice(0, 8);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textPlan = `
=============================================
SMARTLIFE DAILY PLANNER - ${new Date().toLocaleDateString()}
User: ${profile.name} (${profile.persona.toUpperCase()})
Streak: ${profile.streakDays} Days
=============================================

TODAY'S TIME-BLOCKED SCHEDULE:
${schedule.map((s) => `[ ] ${s.time} - ${s.title} (${s.type})`).join('\n')}

TOP PRIORITY TASKS:
${todayTasks.map((t) => `[${t.completed ? 'X' : ' '}] ${t.title} [${t.priority.toUpperCase()}] (~${t.estimatedMinutes || 30}m)`).join('\n')}

DAILY HABITS TO COMPLETE:
${habits.map((h) => `[${h.completedDates.includes(todayStr) ? 'X' : ' '}] ${h.title} (${h.timeOfDay})`).join('\n')}

NOTES & REFLECTIONS:
_________________________________________________________________
_________________________________________________________________
`.trim();

    const blob = new Blob([textPlan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartlife-daily-planner-${todayStr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Printable Daily Planner Sheet
            </h2>
          </div>
          <button
            onClick={() => setPlannerPrintOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Paper Preview */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 dark:bg-slate-950 font-sans text-xs">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-start">
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  SmartLife Daily Docket
                </h1>
                <p className="text-[11px] text-slate-400">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  {profile.name}
                </span>
                <span className="block text-[10px] text-amber-500 font-semibold">
                  🔥 {profile.streakDays} Day Streak
                </span>
              </div>
            </div>

            {/* Time blocks */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Time-Blocked Schedule
              </h3>
              <div className="space-y-1.5">
                {schedule.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 text-xs border-b border-slate-100 dark:border-slate-800/80 pb-1"
                  >
                    <span className="w-24 font-mono font-bold text-slate-500 text-[10px]">
                      {s.time}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex-1">
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Tasks */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Top Priority Tasks
              </h3>
              <div className="space-y-1.5">
                {todayTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span className="text-slate-300">☐</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {t.title}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">{t.category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Habit tracker */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Habit Check-ins
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {habits.map((h) => (
                  <div key={h.id} className="flex items-center gap-2">
                    <span className="text-slate-300">☐</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {h.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={handleDownloadText}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download TXT
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Planner
          </button>
        </div>
      </div>
    </div>
  );
};
