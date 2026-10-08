import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle,
  Bell,
  Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category, Priority, Task } from '../../types';
import { getTodayDateString } from '../../utils/storage';

const CATEGORIES: Category[] = [
  'Work',
  'School',
  'Home',
  'Personal',
  'Health',
  'Shopping',
  'Finance',
];

const PRIORITIES: { id: Priority; label: string; color: string }[] = [
  { id: 'low', label: 'Low', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'medium', label: 'Med', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  { id: 'high', label: 'High', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  { id: 'urgent', label: 'Urgent', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
];

export const TaskModal: React.FC = () => {
  const {
    taskModalOpen,
    setTaskModalOpen,
    editingTask,
    addTask,
    updateTask,
    deleteTask,
    profile,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [dueTime, setDueTime] = useState('12:00');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [reminderSet, setReminderSet] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly'>('none');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '12:00');
      setEstimatedMinutes(editingTask.estimatedMinutes || 30);
      setReminderSet(!!editingTask.reminderSet);
      setFavorite(!!editingTask.favorite);
      setRecurrence(editingTask.recurrence || 'none');
      setSubtasks(editingTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory(profile.persona === 'kid' ? 'School' : profile.persona === 'teen' ? 'School' : 'Work');
      setPriority('medium');
      setDueDate(getTodayDateString());
      setDueTime('12:00');
      setEstimatedMinutes(30);
      setReminderSet(false);
      setFavorite(false);
      setRecurrence('none');
      setSubtasks([]);
    }
    setNewSubtaskText('');
  }, [editingTask, taskModalOpen, profile.persona]);

  if (!taskModalOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `sub-${Date.now()}`, title: newSubtaskText.trim(), completed: false },
    ]);
    setNewSubtaskText('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        dueDate,
        dueTime,
        estimatedMinutes,
        reminderSet,
        favorite,
        recurrence,
        subtasks,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        completed: false,
        dueDate,
        dueTime,
        estimatedMinutes,
        reminderSet,
        favorite,
        recurrence,
        subtasks,
      });
    }
    setTaskModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
            <button
              type="button"
              onClick={() => setFavorite(!favorite)}
              aria-label="Toggle favorite"
              className={`p-1 rounded-full transition ${
                favorite ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'
              }`}
            >
              <Star className={`w-4 h-4 ${favorite ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
          <button
            onClick={() => setTaskModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Finish science assignment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes & Details (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add key links, steps or reminders..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />
          </div>

          {/* Category Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                    category === cat
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              Priority
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`py-1.5 text-xs font-semibold rounded-xl text-center border transition ${
                    priority === p.id
                      ? `${p.color} border-current shadow-xs`
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date, Time & Estimated Minutes */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Est. Min
              </label>
              <input
                type="number"
                min={5}
                step={5}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10) || 15)}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Recurrence Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Repeat Schedule
            </label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
            >
              <option value="none">Does not repeat (One-time)</option>
              <option value="daily">Repeats Daily</option>
              <option value="weekdays">Repeats Weekdays (Mon-Fri)</option>
              <option value="weekly">Repeats Weekly</option>
              <option value="monthly">Repeats Monthly</option>
            </select>
          </div>

          {/* Reminder Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Notify me with chime
                </div>
                <div className="text-[10px] text-slate-400">
                  Audio & visual alert at due time
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReminderSet(!reminderSet)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                reminderSet ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  reminderSet ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Subtasks Checklist */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Subtasks Checklist ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </label>
            <div className="space-y-1.5 mb-2">
              {subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-100 dark:border-slate-700"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(sub.id)}
                    className="flex items-center gap-2 text-left flex-1"
                  >
                    <CheckCircle
                      className={`w-4 h-4 ${
                        sub.completed
                          ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                    <span
                      className={
                        sub.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }
                    >
                      {sub.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="text-slate-300 hover:text-rose-500 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            {editingTask ? (
              <button
                type="button"
                onClick={() => {
                  deleteTask(editingTask.id);
                  setTaskModalOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTaskModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition active:scale-95"
              >
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
