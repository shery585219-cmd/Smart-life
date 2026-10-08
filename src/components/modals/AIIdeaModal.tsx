import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ListPlus,
  Clock,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audio';

const EXAMPLE_PROMPTS = [
  "Prepare for tomorrow's biology midterm, organize flashcards, and study for 2 hours.",
  "Deep clean apartment: wipe kitchen counters, vacuum living room, take out trash, and fold laundry.",
  "Meal prep Sunday: buy groceries, roast veggies, bake chicken breast, and pack 4 lunch containers.",
  "Weekend family trip: pack suitcases, check tire pressure, charge electronics, and pack road trip snacks.",
];

export const AIIdeaModal: React.FC = () => {
  const {
    aiIdeaModalOpen,
    setAiIdeaModalOpen,
    addBulkTasks,
    profile,
    updateProfile,
    setProModalOpen,
  } = useApp();

  const [inputIdea, setInputIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [parsedTasks, setParsedTasks] = useState<any[]>([]);

  if (!aiIdeaModalOpen) return null;

  const handleGenerate = async () => {
    if (!inputIdea.trim()) return;

    // Credit limit for free tier
    if (!profile.isPro && profile.aiCreditsLeft <= 0) {
      setAiIdeaModalOpen(false);
      setProModalOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/parse-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputIdea,
          persona: profile.persona,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to parse ideas with AI');
      }

      const data = await res.json();
      setSummary(data.summary || 'Tasks extracted successfully');
      setParsedTasks(data.tasks || []);

      if (!profile.isPro) {
        updateProfile({ aiCreditsLeft: Math.max(0, profile.aiCreditsLeft - 1) });
      }

      soundFx.playSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportTasks = () => {
    if (parsedTasks.length === 0) return;

    const toImport = parsedTasks.map((t) => ({
      title: t.title,
      description: `AI generated plan: ${t.category}`,
      category: t.category || 'Personal',
      priority: t.priority || 'medium',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '14:00',
      estimatedMinutes: t.estimatedMinutes || 30,
      subtasks: (t.subtasks || []).map((st: string, idx: number) => ({
        id: `sub-ai-${Date.now()}-${idx}`,
        title: st,
        completed: false,
      })),
    }));

    addBulkTasks(toImport);
    setAiIdeaModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-violet-500/5 to-indigo-500/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                AI Idea to Task List
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Turn thoughts or brain-dumps into organized checklist tasks
              </p>
            </div>
          </div>
          <button
            onClick={() => setAiIdeaModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Text Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              What do you want to accomplish?
            </label>
            <textarea
              rows={3}
              placeholder="Dump your messy thoughts here (e.g. Tomorrow I need to prepare for my math exam, buy groceries, call the dentist...)"
              value={inputIdea}
              onChange={(e) => setInputIdea(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none"
            />
          </div>

          {/* Quick Idea Presets */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Or tap an example prompt:
            </span>
            <div className="space-y-1">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputIdea(ex)}
                  className="w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-600 dark:text-slate-300 hover:text-violet-700 dark:hover:text-violet-300 border border-slate-100 dark:border-slate-800 transition truncate"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !inputIdea.trim()}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-violet-500/25 transition active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing & Structuring...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Transform into Structured Tasks
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Parsed Results Section */}
          {parsedTasks.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Generated {parsedTasks.length} Actionable Tasks
                  </div>
                  {summary && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {summary}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {parsedTasks.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {t.title}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                          t.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-700'
                            : t.priority === 'high'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {t.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        ~{t.estimatedMinutes || 30}m
                      </span>
                    </div>

                    {t.subtasks && t.subtasks.length > 0 && (
                      <div className="pl-2 border-l-2 border-violet-400/40 space-y-0.5 pt-1">
                        {t.subtasks.map((st: string, sIdx: number) => (
                          <div key={sIdx} className="text-[10px] text-slate-600 dark:text-slate-300">
                            • {st}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Import Button */}
              <button
                onClick={handleImportTasks}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25 transition active:scale-98"
              >
                <ListPlus className="w-4 h-4" />
                Add All {parsedTasks.length} to My Tasks
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
