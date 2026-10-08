import React, { useState } from 'react';
import {
  CheckCircle,
  Circle,
  Flame,
  Plus,
  Sparkles,
  Clock,
  Calendar,
  CheckSquare,
  Timer,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  BrainCircuit,
  ShoppingBag,
  Star,
  Tag,
  ArrowRight,
  Sun,
  Coffee,
  AlertCircle,
  Volume2,
  Trophy,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, PERSONA_PRESETS } from '../../utils/storage';
import { soundFx } from '../../utils/audio';
import { CurrentFocusWidget } from '../common/CurrentFocusWidget';
import { AmbientSoundPlayer } from '../common/AmbientSoundPlayer';

export const TodayTab: React.FC = () => {
  const {
    tasks,
    toggleTaskComplete,
    toggleTaskFavorite,
    habits,
    toggleHabitDate,
    schedule,
    setSchedule,
    profile,
    quests,
    claimQuest,
    setRewardsModalOpen,
    setTaskModalOpen,
    setEditingTask,
    setHabitModalOpen,
    setAiIdeaModalOpen,
    setPomodoroModalOpen,
    setActiveTab,
    shoppingItems,
    speakText,
    triggerCelebration,
  } = useApp();

  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [rebalancing, setRebalancing] = useState(false);

  const todayStr = getTodayDateString();

  // Filter tasks for today
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr || !t.completed);
  const completedTodayTasks = todayTasks.filter((t) => t.completed).length;
  const taskProgressPercent =
    todayTasks.length > 0 ? Math.round((completedTodayTasks / todayTasks.length) * 100) : 100;

  // Filter habits for today
  const habitsDoneToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const habitProgressPercent =
    habits.length > 0 ? Math.round((habitsDoneToday / habits.length) * 100) : 100;

  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const personaQuote =
    PERSONA_PRESETS[profile.persona]?.quote || 'Make today calm, productive, and meaningful.';

  // Rebalance schedule with AI
  const handleRebalanceSchedule = async () => {
    setRebalancing(true);
    try {
      const res = await fetch('/api/ai/daily-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: todayTasks.filter((t) => !t.completed),
          habits: habits.filter((h) => !h.completedDates.includes(todayStr)),
          persona: profile.persona,
          wakeTime: profile.settings.wakeTime,
          bedTime: profile.settings.bedTime,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.schedule && data.schedule.length > 0) {
          setSchedule(
            data.schedule.map((item: any, idx: number) => ({
              id: `sc-ai-${Date.now()}-${idx}`,
              time: item.time,
              title: item.title,
              type: item.type || 'task',
              tip: item.tip,
              completed: false,
            }))
          );
          soundFx.playSuccess();
          triggerCelebration();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRebalancing(false);
    }
  };

  const pendingShoppingCount = shoppingItems.filter((s) => !s.completed).length;

  return (
    <div className="flex-1 p-4 pb-24 max-w-2xl mx-auto w-full space-y-5 animate-in fade-in">
      {/* Hero Greeting Card */}
      <div className="relative p-5 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20 overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              {greeting}, {profile.name.split(' ')[0]}
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
              Ready to win today?
            </h2>
            <p className="text-xs text-blue-100/90 mt-1 max-w-sm italic">
              "{personaQuote}"
            </p>
          </div>

          {/* Quick Streak Flame */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/20">
            <Flame className="w-6 h-6 mx-auto text-amber-300 fill-amber-300 animate-pulse-subtle" />
            <span className="text-xs font-black block mt-0.5">{profile.streakDays} Days</span>
            <span className="text-[9px] text-blue-200">Streak</span>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/15 relative z-10">
          <div className="bg-black/15 rounded-2xl p-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
              <span className="text-blue-100">Tasks</span>
              <span className="font-bold">{completedTodayTasks}/{todayTasks.length}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-black/15 rounded-2xl p-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
              <span className="text-blue-100">Habits</span>
              <span className="font-bold">{habitsDoneToday}/{habits.length}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${habitProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Focus Countdown Widget */}
      <CurrentFocusWidget />

      {/* Focus Audio Ambience Bar */}
      <AmbientSoundPlayer />

      {/* Daily Quests Gamification Sneak Peek */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Level {profile.level} Quests</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold">
                {profile.xp} XP
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {quests.filter((q) => q.claimed).length}/{quests.length} daily goals completed
            </p>
          </div>
        </div>

        <button
          onClick={() => setRewardsModalOpen(true)}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
        >
          View Rewards <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Power Actions Bar */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => {
            setEditingTask(null);
            setTaskModalOpen(true);
          }}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center text-center transition hover:scale-102 active:scale-95 group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition">
            <CheckSquare className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">New Task</span>
        </button>

        <button
          onClick={() => setAiIdeaModalOpen(true)}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center text-center transition hover:scale-102 active:scale-95 group"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-1 group-hover:bg-violet-600 group-hover:text-white transition">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">AI Plan</span>
        </button>

        <button
          onClick={() => setPomodoroModalOpen(true)}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center text-center transition hover:scale-102 active:scale-95 group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1 group-hover:bg-rose-600 group-hover:text-white transition">
            <Timer className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Focus 25m</span>
        </button>

        <button
          onClick={() => setActiveTab('shopping')}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center text-center transition hover:scale-102 active:scale-95 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1 group-hover:bg-emerald-600 group-hover:text-white transition relative">
            <ShoppingBag className="w-4 h-4" />
            {pendingShoppingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                {pendingShoppingCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Shop List</span>
        </button>
      </div>

      {/* Daily Habits Streak Checklist */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Daily Habits Streak ({habitsDoneToday}/{habits.length})
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('habits')}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline"
          >
            All Habits <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {habits.map((habit) => {
            const isCompletedToday = habit.completedDates.includes(todayStr);
            return (
              <div
                key={habit.id}
                onClick={() => toggleHabitDate(habit.id, todayStr)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCompletedToday
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 shadow-xs'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-transform ${
                      isCompletedToday ? 'scale-110 shadow-sm' : ''
                    }`}
                    style={{
                      backgroundColor: isCompletedToday ? habit.color : `${habit.color}20`,
                      color: isCompletedToday ? '#FFFFFF' : habit.color,
                    }}
                  >
                    {isCompletedToday ? '✓' : <Flame className="w-4 h-4 fill-current" />}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        isCompletedToday
                          ? 'text-slate-900 dark:text-white line-through opacity-85'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {habit.title}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span>{habit.timeOfDay}</span> •{' '}
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {habit.streak}d streak
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isCompletedToday
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isCompletedToday && <span className="text-xs font-black">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Priority Tasks Checklist */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Today's Key Tasks ({todayTasks.filter((t) => !t.completed).length} pending)
            </h3>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setTaskModalOpen(true);
            }}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>

        <div className="space-y-2">
          {todayTasks.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                You're all clear for today!
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Take a breather, read a book, or plan tomorrow with AI.
              </p>
            </div>
          ) : (
            todayTasks.map((task) => {
              const isExpanded = expandedTaskId === task.id;
              const hasSubtasks = task.subtasks && task.subtasks.length > 0;
              const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-75'
                      : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Completion Checkbox */}
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-blue-500" />
                      )}
                    </button>

                    {/* Task Title & Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs font-bold leading-snug ${
                            task.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </span>

                        {task.favorite && (
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 flex-wrap">
                        <span className="font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                          {task.category}
                        </span>

                        {task.dueTime && (
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {task.dueTime}
                          </span>
                        )}

                        {task.estimatedMinutes && (
                          <span>~{task.estimatedMinutes}m</span>
                        )}

                        <span
                          className={`font-bold uppercase px-1.5 py-0.2 rounded ${
                            task.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : task.priority === 'high'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {hasSubtasks && (
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {completedSubtasks}/{task.subtasks.length} subtasks
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Edit & Expand Subtasks */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setTaskModalOpen(true);
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {hasSubtasks && (
                        <button
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Subtasks List */}
                  {isExpanded && hasSubtasks && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5 pl-7">
                      {task.subtasks.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <span
                            className={
                              sub.completed ? 'text-emerald-500 font-bold' : 'text-slate-400'
                            }
                          >
                            {sub.completed ? '✓' : '○'}
                          </span>
                          <span className={sub.completed ? 'line-through text-slate-400' : ''}>
                            {sub.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Today's Smart Time-Block Schedule Timeline */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Today's Optimal Schedule
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const text = `Here is your day: ${schedule.slice(0, 4).map((s) => `${s.time}: ${s.title}`).join('. ')}`;
                speakText(text);
              }}
              title="Read schedule aloud"
              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRebalanceSchedule}
              disabled={rebalancing}
              className="text-[11px] font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1 hover:underline disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              {rebalancing ? 'Optimizing...' : 'AI Rebalance'}
            </button>
          </div>
        </div>

        <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-700">
          {schedule.slice(0, 5).map((block) => (
            <div
              key={block.id}
              className="relative pl-7 flex items-start justify-between gap-2 text-xs"
            >
              <div
                className={`absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${
                  block.type === 'break'
                    ? 'bg-teal-400'
                    : block.type === 'habit'
                    ? 'bg-amber-400'
                    : 'bg-blue-600'
                }`}
              />

              <div>
                <span className="font-mono text-[10px] text-slate-400 block font-semibold">
                  {block.time}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {block.title}
                </span>
                {block.tip && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                    Tip: {block.tip}
                  </p>
                )}
              </div>

              <span
                className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                  block.type === 'break'
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                    : block.type === 'habit'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}
              >
                {block.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
