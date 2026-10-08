import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Send,
  Loader2,
  Calendar,
  Target,
  FileText,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, DailySummary, GoalRoadmap } from '../../types';
import { soundFx } from '../../utils/audio';

export const AiTab: React.FC = () => {
  const {
    tasks,
    habits,
    profile,
    setSchedule,
    addBulkTasks,
    setAiIdeaModalOpen,
    speakText,
    triggerCelebration,
    updateProfile,
    setProModalOpen,
  } = useApp();

  const [aiMode, setAiMode] = useState<'chat' | 'schedule' | 'goals' | 'summary'>('chat');
  const [isListening, setIsListening] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hi ${profile.name.split(' ')[0]}! I'm your SmartLife AI. Need help time-blocking your day, organizing school or work, breaking down big goals, or beating procrastination? Ask me anything!`,
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Goal Breakdown State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTimeframe, setGoalTimeframe] = useState('30 days');
  const [goalRoadmap, setGoalRoadmap] = useState<GoalRoadmap | null>(null);
  const [goalLoading, setGoalLoading] = useState(false);

  // Daily Summary State
  const [journalNotes, setJournalNotes] = useState('');
  const [summaryData, setSummaryData] = useState<DailySummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Handle Chat Submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    if (!profile.isPro && profile.aiCreditsLeft <= 0) {
      setProModalOpen(true);
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content,
          })),
          context: {
            userName: profile.name,
            persona: profile.persona,
            pendingTasksCount: tasks.filter((t) => !t.completed).length,
            activeHabitsCount: habits.length,
            currentStreak: profile.streakDays,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'Here to help you stay organized!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        soundFx.playTap();

        if (!profile.isPro) {
          updateProfile({ aiCreditsLeft: Math.max(0, profile.aiCreditsLeft - 1) });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Goal Breakdown
  const handleBreakdownGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    setGoalLoading(true);
    try {
      const res = await fetch('/api/ai/goal-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: goalTitle.trim(),
          timeframe: goalTimeframe,
          persona: profile.persona,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGoalRoadmap({
          id: `goal-${Date.now()}`,
          title: goalTitle,
          timeframe: goalTimeframe,
          progressPercent: 0,
          dailyHabitSuggestion: data.dailyHabitSuggestion,
          milestones: data.milestones || [],
          createdAt: new Date().toISOString(),
        });
        soundFx.playSuccess();
        triggerCelebration();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGoalLoading(false);
    }
  };

  // Handle Daily Summary
  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const completedTasks = tasks.filter((t) => t.completed).map((t) => t.title);
      const completedHabits = habits
        .filter((h) => h.completedDates.includes(new Date().toISOString().split('T')[0]))
        .map((h) => h.title);

      const res = await fetch('/api/ai/summarize-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTasks,
          completedHabits,
          notes: journalNotes,
          date: 'today',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSummaryData({
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          highlight: data.highlight || 'Great work today!',
          summary: data.summary || 'Consistent progress made.',
          score: data.score || 85,
          strengths: data.strengths || ['Daily consistency', 'Focus'],
          nextDaySuggestion: data.nextDaySuggestion || 'Keep the momentum going.',
        });
        soundFx.playStreakMilestone();
        triggerCelebration();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 pb-24 max-w-2xl mx-auto w-full space-y-4 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            SmartLife AI Assistant
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {profile.isPro ? 'Unlimited Pro Access' : `${profile.aiCreditsLeft} queries left today`}
          </p>
        </div>

        <button
          onClick={() => setAiIdeaModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-500/20 transition active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Idea to Tasks
        </button>
      </div>

      {/* Mode Sub-navigation */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-semibold">
        {[
          { id: 'chat', label: 'Chat & Advice', icon: MessageSquare },
          { id: 'goals', label: 'Goal Architect', icon: Target },
          { id: 'summary', label: 'Day Summary', icon: Award },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = aiMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setAiMode(item.id as any);
                soundFx.playTap();
              }}
              className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Chat Mode */}
      {aiMode === 'chat' && (
        <div className="space-y-3">
          {/* Messages Container */}
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto p-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                    AI
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed relative group ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-xs whitespace-pre-wrap'
                  }`}
                >
                  {m.content}

                  {m.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => speakText(m.content)}
                      title="Read aloud"
                      className="absolute bottom-1.5 right-1.5 p-1 rounded-md text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 opacity-60 hover:opacity-100 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400 pl-2">
                <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                SmartLife AI is thinking...
              </div>
            )}
          </div>

          {/* Quick Chat Starters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              "How should I organize my study time today?",
              "Help me stop procrastinating on my task",
              "Suggest 3 quick energizing breaks",
              "How to build a morning routine I stick to?",
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => setChatInput(p)}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-400 whitespace-nowrap transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input Bar with Dictation */}
          <form onSubmit={handleSendChat} className="relative flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={isListening ? 'Listening to voice...' : 'Ask anything or request advice...'}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className={`w-full pl-4 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-800 border text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
                  isListening
                    ? 'border-rose-500 ring-2 ring-rose-400/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
                    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                    const recognition = new SpeechRecognition();
                    recognition.onstart = () => setIsListening(true);
                    recognition.onend = () => setIsListening(false);
                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript;
                      setChatInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
                    };
                    recognition.start();
                  } else {
                    alert('Speech recognition is not supported in this browser.');
                  }
                }}
                className={`absolute right-2 top-2.5 p-1 rounded-xl transition ${
                  isListening
                    ? 'text-rose-500 animate-pulse bg-rose-50 dark:bg-rose-950/60'
                    : 'text-slate-400 hover:text-violet-600'
                }`}
                title="Voice Dictation"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={!chatInput.trim() || chatLoading}
              className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center disabled:opacity-40 transition active:scale-90 shrink-0 shadow-md shadow-violet-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 2. Goal Architect Mode */}
      {aiMode === 'goals' && (
        <div className="space-y-4">
          <form onSubmit={handleBreakdownGoal} className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                What goal do you want to achieve?
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Read 4 books, Ace biology midterm, Run a 5K race"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Timeframe
                </label>
                <select
                  value={goalTimeframe}
                  onChange={(e) => setGoalTimeframe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                >
                  <option value="14 days">14 Days Sprint</option>
                  <option value="30 days">30 Days Challenge</option>
                  <option value="60 days">60 Days Habit Lock</option>
                  <option value="90 days">Quarterly Milestone</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={goalLoading || !goalTitle.trim()}
                  className="w-full py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 transition active:scale-98 shadow-xs"
                >
                  {goalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Architect Plan
                </button>
              </div>
            </div>
          </form>

          {/* Goal Roadmap Display */}
          {goalRoadmap && (
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {goalRoadmap.title}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Roadmap for {goalRoadmap.timeframe}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-black">
                  Roadmap
                </span>
              </div>

              {goalRoadmap.dailyHabitSuggestion && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold">Daily Micro-Habit: </span>
                    {goalRoadmap.dailyHabitSuggestion}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-1">
                {goalRoadmap.milestones.map((m, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {m.phase}: {m.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {m.description}
                    </p>
                    {m.keyActions && (
                      <div className="pt-1 space-y-0.5">
                        {m.keyActions.map((act, aIdx) => (
                          <div key={aIdx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <span className="text-violet-500 font-bold">✓</span>
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Daily Summary Mode */}
      {aiMode === 'summary' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Daily Reflections & Evening Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="What went well today? What felt challenging?"
                value={journalNotes}
                onChange={(e) => setJournalNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
              />
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={summaryLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50 transition active:scale-98"
            >
              {summaryLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Synthesizing Daily Wins...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  Generate AI Daily Summary & Score
                </>
              )}
            </button>
          </div>

          {/* Summary Card Result */}
          {summaryData && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-violet-950 text-white shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                    {summaryData.date} Recap
                  </span>
                  <h3 className="text-base font-black mt-0.5">
                    {summaryData.highlight}
                  </h3>
                </div>

                <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
                  <span className="text-base font-black text-amber-300">{summaryData.score}</span>
                  <span className="text-[8px] text-blue-200 uppercase font-semibold">Score</span>
                </div>
              </div>

              <p className="text-xs text-blue-100/90 leading-relaxed bg-white/5 p-3 rounded-2xl">
                {summaryData.summary}
              </p>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Key Strengths Shown:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {summaryData.strengths.map((str, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/15 font-semibold text-emerald-300"
                    >
                      ★ {str}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-300/30 text-xs text-amber-200">
                <span className="font-bold">Next Day Focus: </span>
                {summaryData.nextDaySuggestion}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
