import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Sparkles,
  Trophy,
  Calendar,
  CheckCircle,
  TrendingUp,
  Star,
  ChevronRight,
  Target,
  ArrowRight,
  Sun,
  Moon,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Habit } from '../../types';
import { getTodayDateString } from '../../utils/storage';

export const HabitsTab: React.FC = () => {
  const {
    habits,
    toggleHabitDate,
    toggleHabitFavorite,
    setEditingHabit,
    setHabitModalOpen,
    setActiveTab,
    triggerCelebration,
    profile,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Past 7 days calculation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const offset = 6 - i;
    const dateStr = getTodayDateString(-offset);
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return {
      dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dayNumber: d.getDate(),
      isToday: offset === 0,
    };
  });

  // Past 28 days for Month Contribution Heatmap
  const monthSquares = Array.from({ length: 28 }, (_, i) => {
    const offset = 27 - i;
    const dateStr = getTodayDateString(-offset);
    const completedCountOnDate = habits.filter((h) => h.completedDates.includes(dateStr)).length;
    return {
      dateStr,
      count: completedCountOnDate,
    };
  });

  const filteredHabits = habits.filter(
    (h) => filterCategory === 'All' || h.category === filterCategory
  );

  const totalStreakDays = habits.reduce((acc, h) => acc + h.streak, 0);
  const highestStreak = Math.max(...habits.map((h) => h.bestStreak), 0);

  return (
    <div className="flex-1 p-4 pb-24 max-w-2xl mx-auto w-full space-y-4 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Habit Streaks & Goals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {habits.length} active habits • {totalStreakDays} combined streak days
          </p>
        </div>

        <button
          onClick={() => {
            setEditingHabit(null);
            setHabitModalOpen(true);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-500/20 hover:bg-amber-600 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          New Habit
        </button>
      </div>

      {/* Motivational Milestone Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-300/50 dark:border-amber-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{profile.streakDays} Day Master Streak!</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                🔥 Active
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              Highest all-time streak is {highestStreak} days. Keep pushing today!
            </p>
          </div>
        </div>

        <button
          onClick={() => triggerCelebration()}
          className="hidden sm:flex text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
        >
          Celebrate 🎉
        </button>
      </div>

      {/* 28-Day Consistency Heatmap Grid */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            4-Week Consistency Heatmap
          </span>
          <span className="text-[10px] text-slate-400">Darker = More habits checked</span>
        </div>

        <div className="grid grid-cols-7 gap-1 pt-1">
          {monthSquares.map((sq, idx) => {
            const intensity = sq.count === 0 ? 'bg-slate-100 dark:bg-slate-700/60' :
              sq.count === 1 ? 'bg-amber-200 dark:bg-amber-800/60' :
              sq.count === 2 ? 'bg-amber-400 dark:bg-amber-600' :
              'bg-amber-500 dark:bg-amber-500 shadow-xs';
            return (
              <div
                key={idx}
                title={`${sq.dateStr}: ${sq.count} habits completed`}
                className={`h-5 rounded-md ${intensity} transition-colors cursor-pointer hover:scale-105`}
              />
            );
          })}
        </div>
      </div>

      {/* Habit Weekly Grids */}
      <div className="space-y-3">
        {filteredHabits.map((habit) => {
          return (
            <div
              key={habit.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              {/* Title & Streak Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
                    style={{ backgroundColor: habit.color }}
                  >
                    <Flame className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {habit.title}
                      {habit.favorite && (
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      )}
                    </h3>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {habit.category} • {habit.frequency} • {habit.timeOfDay}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {habit.streak}d
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      Best: {habit.bestStreak}d
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setEditingHabit(habit);
                      setHabitModalOpen(true);
                    }}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 7-Day Interactive Grid */}
              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {last7Days.map((day) => {
                  const isDone = habit.completedDates.includes(day.dateStr);
                  return (
                    <button
                      key={day.dateStr}
                      onClick={() => toggleHabitDate(habit.id, day.dateStr)}
                      className={`flex flex-col items-center py-2 px-1 rounded-2xl border transition-all ${
                        isDone
                          ? 'text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-400 hover:border-slate-300'
                      }`}
                      style={{
                        backgroundColor: isDone ? habit.color : undefined,
                        borderColor: isDone ? habit.color : undefined,
                      }}
                    >
                      <span className="text-[9px] font-bold uppercase">{day.dayName}</span>
                      <span className="text-xs font-extrabold mt-0.5">
                        {isDone ? '✓' : day.dayNumber}
                      </span>
                      {day.isToday && (
                        <span
                          className={`w-1 h-1 rounded-full mt-1 ${
                            isDone ? 'bg-white' : 'bg-blue-600'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal Blueprint Teaser */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Need a 30-Day Goal Roadmap?
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Let AI break down big ambitions into atomic daily habits.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('ai')}
          className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1 hover:underline"
        >
          Break Down <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
