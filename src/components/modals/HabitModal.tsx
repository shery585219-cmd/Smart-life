import React, { useState, useEffect } from 'react';
import {
  X,
  Flame,
  Sun,
  Moon,
  Coffee,
  Sparkles,
  BookOpen,
  Heart,
  Dumbbell,
  Clock,
  Trash2,
  Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category, Habit } from '../../types';

const CATEGORIES: Category[] = ['Health', 'Personal', 'Home', 'School', 'Work', 'Finance'];

const ICONS = [
  { id: 'Sun', label: 'Sun', Icon: Sun },
  { id: 'Flame', label: 'Flame', Icon: Flame },
  { id: 'BookOpen', label: 'Book', Icon: BookOpen },
  { id: 'Sparkles', label: 'Sparkles', Icon: Sparkles },
  { id: 'Heart', label: 'Heart', Icon: Heart },
  { id: 'Dumbbell', label: 'Exercise', Icon: Dumbbell },
  { id: 'Coffee', label: 'Coffee', Icon: Coffee },
  { id: 'Moon', label: 'Sleep', Icon: Moon },
];

const COLORS = [
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#EF4444', // Red
];

export const HabitModal: React.FC = () => {
  const {
    habitModalOpen,
    setHabitModalOpen,
    editingHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    habits,
    profile,
    setProModalOpen,
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Health');
  const [icon, setIcon] = useState('Sun');
  const [color, setColor] = useState('#F59E0B');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekends'>('daily');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(7);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title);
      setCategory(editingHabit.category);
      setIcon(editingHabit.icon);
      setColor(editingHabit.color);
      setFrequency(editingHabit.frequency);
      setTargetDaysPerWeek(editingHabit.targetDaysPerWeek);
      setTimeOfDay(editingHabit.timeOfDay);
      setReminderTime(editingHabit.reminderTime || '08:00');
      setFavorite(!!editingHabit.favorite);
    } else {
      setTitle('');
      setCategory('Health');
      setIcon('Sun');
      setColor('#F59E0B');
      setFrequency('daily');
      setTargetDaysPerWeek(7);
      setTimeOfDay('morning');
      setReminderTime('08:00');
      setFavorite(false);
    }
  }, [editingHabit, habitModalOpen]);

  if (!habitModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Freemium restriction check: Free users can create up to 4 habits
    if (!editingHabit && !profile.isPro && habits.length >= 4) {
      setHabitModalOpen(false);
      setProModalOpen(true);
      return;
    }

    if (editingHabit) {
      updateHabit({
        ...editingHabit,
        title: title.trim(),
        category,
        icon,
        color,
        frequency,
        targetDaysPerWeek,
        timeOfDay,
        reminderTime,
        favorite,
      });
    } else {
      addHabit({
        title: title.trim(),
        category,
        icon,
        color,
        frequency,
        targetDaysPerWeek,
        timeOfDay,
        reminderTime,
        favorite,
      });
    }
    setHabitModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingHabit ? 'Edit Habit' : 'Build New Habit'}
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
            onClick={() => setHabitModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 10 pages reading, Morning run, Drink 2L water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Choose Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ICONS.map((item) => {
                const ItemIcon = item.Icon;
                const isSelected = icon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIcon(item.id)}
                    className={`h-11 rounded-2xl flex items-center justify-center border transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 scale-105'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ItemIcon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color theme */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency & Time of Day */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="daily">Every Day</option>
                <option value="weekdays">Weekdays Only (Mon-Fri)</option>
                <option value="weekends">Weekends Only (Sat-Sun)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time of Day
              </label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>
          </div>

          {/* Reminder Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Daily Reminder Prompt
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            {editingHabit ? (
              <button
                type="button"
                onClick={() => {
                  deleteHabit(editingHabit.id);
                  setHabitModalOpen(false);
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
                onClick={() => setHabitModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/25 transition active:scale-95"
              >
                {editingHabit ? 'Save Changes' : 'Start Habit Streak'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
