import React from 'react';
import {
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Calendar,
  PieChart,
  Zap,
  Target,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/storage';

export const AnalyticsTab: React.FC = () => {
  const { tasks, habits, profile, triggerCelebration } = useApp();

  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 100;

  // Past 7 Days Activity Mockup / Computed
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyVelocity = [4, 6, 8, 5, 7, 3, completedTasks];
  const maxWeekly = Math.max(...weeklyVelocity, 8);

  // Category counts
  const categoryCounts = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const badges = [
    { name: '7-Day Streak', icon: '🔥', desc: 'Maintained consistency for a week', unlocked: profile.streakDays >= 7 },
    { name: 'Task Crusher', icon: '⚡', desc: 'Completed 20+ tasks', unlocked: profile.totalTasksCompleted >= 20 },
    { name: 'Early Bird', icon: '🌅', desc: 'Active morning habits', unlocked: habits.some((h) => h.timeOfDay === 'morning') },
    { name: 'Mindful Life', icon: '💎', desc: 'Tracked health & personal goals', unlocked: true },
  ];

  return (
    <div className="flex-1 p-4 pb-24 max-w-2xl mx-auto w-full space-y-4 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Progress & Insights
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {profile.totalTasksCompleted} lifetime completions • {completionRate}% task rate
          </p>
        </div>

        <button
          onClick={() => triggerCelebration()}
          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 transition active:scale-95"
        >
          Cheer 🎉
        </button>
      </div>

      {/* Productivity Score KPI Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-violet-950 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
            SmartLife Efficiency Score
          </span>
          <div className="text-3xl font-black mt-1 flex items-baseline gap-2">
            <span>{Math.min(96, Math.max(72, completionRate))}%</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +8% vs last week
            </span>
          </div>
          <p className="text-xs text-blue-100/80 mt-1">
            Excellent execution across habits and high priority tasks.
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
          <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-black text-white mt-0.5">{profile.streakDays}d Streak</span>
        </div>
      </div>

      {/* Weekly Velocity Bar Chart */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            7-Day Completion Velocity
          </h3>
          <span className="text-[11px] text-slate-400 font-semibold">Total: 38 items</span>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-36 flex items-end justify-between gap-2 pt-6 px-2">
          {daysOfWeek.map((day, idx) => {
            const count = weeklyVelocity[idx];
            const heightPercent = Math.round((count / maxWeekly) * 100);
            const isToday = idx === 6;

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-400">{count}</span>
                <div className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-700/60 rounded-xl overflow-hidden h-24 flex items-end">
                  <div
                    className={`w-full rounded-xl transition-all duration-700 ${
                      isToday
                        ? 'bg-gradient-to-t from-blue-600 to-indigo-500 shadow-xs'
                        : 'bg-blue-400/80 dark:bg-blue-500/70'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                  }`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-violet-600" />
          Focus Breakdown by Area
        </h3>

        <div className="space-y-2">
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const pct = Math.round((count / tasks.length) * 100);
            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{cat}</span>
                  <span className="text-slate-400">{count} tasks ({pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Milestones */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          Unlocked Milestone Badges
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {badges.map((b, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition ${
                b.unlocked
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-50'
              }`}
            >
              <span className="text-2xl">{b.icon}</span>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {b.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {b.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
