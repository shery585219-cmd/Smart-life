import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Filter,
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Star,
  Tag,
  AlertCircle,
  Search,
  Sparkles,
  ChevronDown,
  Trash2,
  ChevronRight,
  LayoutList,
  Columns3,
  Grid2X2,
  Repeat,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category, Priority, Task, TaskStatus } from '../../types';
import { getTodayDateString } from '../../utils/storage';

export const TasksTab: React.FC = () => {
  const {
    tasks,
    toggleTaskComplete,
    setTaskStatus,
    toggleTaskFavorite,
    deleteTask,
    setEditingTask,
    setTaskModalOpen,
    setAiIdeaModalOpen,
    addTask,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'matrix'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'favorites'>('all');
  const [quickInput, setQuickInput] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const categories: (Category | 'All')[] = [
    'All',
    'Work',
    'School',
    'Home',
    'Personal',
    'Health',
    'Finance',
  ];

  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    if (filterStatus === 'pending' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (filterStatus === 'favorites' && !t.favorite) return false;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    addTask({
      title: quickInput.trim(),
      category: (selectedCategory === 'All' ? 'Personal' : selectedCategory) as Category,
      priority: 'medium',
      status: 'todo',
      completed: false,
      dueDate: getTodayDateString(),
      dueTime: '12:00',
      estimatedMinutes: 30,
      subtasks: [],
    });
    setQuickInput('');
  };

  return (
    <div className="flex-1 p-4 pb-24 max-w-2xl mx-auto w-full space-y-4 animate-in fade-in">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Tasks & Workspace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {pendingCount} active • {completedCount} completed
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode switcher */}
          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Kanban Board View"
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Eisenhower Matrix View"
            >
              <Grid2X2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setAiIdeaModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-xs font-bold shadow-xs hover:bg-violet-100 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Breakdown
          </button>

          <button
            onClick={() => {
              setEditingTask(null);
              setTaskModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleQuickAdd} className="relative">
        <input
          type="text"
          placeholder="Quick add a task (press Enter)..."
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          className="w-full pl-4 pr-11 py-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!quickInput.trim()}
          className="absolute right-2 top-2 w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-40 transition active:scale-90"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 1. LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-semibold">
            {(['all', 'pending', 'completed', 'favorites'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 py-1.5 rounded-xl capitalize transition ${
                  filterStatus === status
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-1">
            {filteredTasks.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-500" />
                No tasks found in this view.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isExpanded = expandedTaskId === task.id;
                const hasSubtasks = task.subtasks && task.subtasks.length > 0;
                const completedSubs = task.subtasks.filter((s) => s.completed).length;

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

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold leading-snug ${
                              task.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 flex-wrap">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                            {task.category}
                          </span>

                          <span className="flex items-center gap-0.5">
                            <Calendar className="w-3 h-3" />
                            {task.dueDate}
                          </span>

                          {task.dueTime && (
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {task.dueTime}
                            </span>
                          )}

                          {task.recurrence && task.recurrence !== 'none' && (
                            <span className="flex items-center gap-0.5 text-indigo-500 font-semibold">
                              <Repeat className="w-3 h-3" /> {task.recurrence}
                            </span>
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
                              {completedSubs}/{task.subtasks.length} subtasks
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleTaskFavorite(task.id)}
                          className="p-1 text-slate-300 hover:text-amber-500 transition"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              task.favorite ? 'text-amber-500 fill-amber-500' : ''
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setTaskModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        {hasSubtasks && (
                          <button
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                            className="p-1 text-slate-400"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && hasSubtasks && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5 pl-7">
                        {task.subtasks.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                          >
                            <span className={sub.completed ? 'text-emerald-500' : 'text-slate-400'}>
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
      )}

      {/* 2. KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Column: To Do */}
          <div className="p-3 rounded-3xl bg-slate-100 dark:bg-slate-800/60 space-y-2">
            <div className="flex items-center justify-between pb-1 px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                To Do ({tasks.filter((t) => !t.completed && t.status !== 'in_progress').length})
              </span>
            </div>
            <div className="space-y-2">
              {tasks
                .filter((t) => !t.completed && t.status !== 'in_progress')
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{t.category}</span>
                      <button
                        onClick={() => setTaskStatus(t.id, 'in_progress')}
                        className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold"
                      >
                        Start →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="p-3 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 space-y-2 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center justify-between pb-1 px-1">
              <span className="text-xs font-black uppercase tracking-wider text-blue-800 dark:text-blue-300">
                In Progress ({tasks.filter((t) => !t.completed && t.status === 'in_progress').length})
              </span>
            </div>
            <div className="space-y-2">
              {tasks
                .filter((t) => !t.completed && t.status === 'in_progress')
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 shadow-xs space-y-2"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>~{t.estimatedMinutes || 30}m</span>
                      <button
                        onClick={() => setTaskStatus(t.id, 'completed')}
                        className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold"
                      >
                        Complete ✓
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Column: Done */}
          <div className="p-3 rounded-3xl bg-slate-100 dark:bg-slate-800/60 space-y-2">
            <div className="flex items-center justify-between pb-1 px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Done ({tasks.filter((t) => t.completed).length})
              </span>
            </div>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.completed)
                .slice(0, 5)
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-70"
                  >
                    <div className="text-xs font-bold line-through text-slate-400">{t.title}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. EISENHOWER MATRIX VIEW */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Q1: Urgent & High (Do First) */}
          <div className="p-3.5 rounded-3xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-2">
            <span className="text-xs font-black text-rose-800 dark:text-rose-300 uppercase tracking-wider block">
              1. DO FIRST (Urgent & Important)
            </span>
            <div className="space-y-1.5">
              {tasks
                .filter((t) => !t.completed && (t.priority === 'urgent' || t.priority === 'high'))
                .map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTaskComplete(t.id)}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900 text-xs font-bold text-slate-800 dark:text-white shadow-xs cursor-pointer hover:border-rose-400 flex items-center justify-between"
                  >
                    <span>{t.title}</span>
                    <span className="text-[10px] text-rose-500">{t.dueTime || 'Today'}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Q2: Important Not Urgent (Schedule) */}
          <div className="p-3.5 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2">
            <span className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-wider block">
              2. SCHEDULE (Strategic / Growth)
            </span>
            <div className="space-y-1.5">
              {tasks
                .filter((t) => !t.completed && t.priority === 'medium')
                .map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTaskComplete(t.id)}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900 text-xs font-bold text-slate-800 dark:text-white shadow-xs cursor-pointer hover:border-blue-400 flex items-center justify-between"
                  >
                    <span>{t.title}</span>
                    <span className="text-[10px] text-blue-500">~{t.estimatedMinutes}m</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Q3: Urgent Not Important (Delegate/Quick) */}
          <div className="p-3.5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
            <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
              3. QUICK WINS / DELEGATE
            </span>
            <div className="space-y-1.5">
              {tasks
                .filter((t) => !t.completed && t.priority === 'low')
                .map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTaskComplete(t.id)}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900 text-xs font-bold text-slate-800 dark:text-white shadow-xs cursor-pointer hover:border-amber-400"
                  >
                    {t.title}
                  </div>
                ))}
            </div>
          </div>

          {/* Q4: Done Archive */}
          <div className="p-3.5 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              4. COMPLETED VICTORIES
            </span>
            <div className="space-y-1.5">
              {tasks
                .filter((t) => t.completed)
                .slice(0, 4)
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-400 line-through"
                  >
                    {t.title}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
