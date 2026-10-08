import React, { useState } from 'react';
import {
  X,
  Search,
  CheckSquare,
  Flame,
  ShoppingBag,
  Star,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SearchModal: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    tasks,
    habits,
    shoppingItems,
    toggleTaskComplete,
    toggleShoppingItem,
    setEditingTask,
    setTaskModalOpen,
    setActiveTab,
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'habits' | 'shopping'>('all');

  if (!searchOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedTasks = tasks.filter(
    (t) =>
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q))
  );

  const matchedHabits = habits.filter(
    (h) => !q || h.title.toLowerCase().includes(q) || h.category.toLowerCase().includes(q)
  );

  const matchedShopping = shoppingItems.filter(
    (s) => !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
  );

  const totalResults =
    (filterType === 'all' || filterType === 'tasks' ? matchedTasks.length : 0) +
    (filterType === 'all' || filterType === 'habits' ? matchedHabits.length : 0) +
    (filterType === 'all' || filterType === 'shopping' ? matchedShopping.length : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 mt-10">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search tasks, habits, grocery items, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 p-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          {(['all', 'tasks', 'habits', 'shopping'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full font-semibold capitalize transition ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {totalResults === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No results found for "{query}". Try a different search term.
            </div>
          ) : (
            <>
              {/* Tasks Results */}
              {(filterType === 'all' || filterType === 'tasks') && matchedTasks.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                    Tasks ({matchedTasks.length})
                  </h3>
                  <div className="space-y-1.5">
                    {matchedTasks.slice(0, 6).map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition text-xs border border-slate-100 dark:border-slate-700"
                      >
                        <button
                          onClick={() => toggleTaskComplete(t.id)}
                          className="flex items-center gap-2.5 text-left flex-1"
                        >
                          <CheckCircle
                            className={`w-4 h-4 shrink-0 ${
                              t.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                          <div>
                            <div
                              className={`font-semibold ${
                                t.completed
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {t.title}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {t.category} • Due {t.dueDate}
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setEditingTask(t);
                            setTaskModalOpen(true);
                            setSearchOpen(false);
                          }}
                          className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold px-2 py-1 rounded hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Habits Results */}
              {(filterType === 'all' || filterType === 'habits') && matchedHabits.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Habits ({matchedHabits.length})
                  </h3>
                  <div className="space-y-1.5">
                    {matchedHabits.slice(0, 4).map((h) => (
                      <div
                        key={h.id}
                        onClick={() => {
                          setActiveTab('habits');
                          setSearchOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition text-xs cursor-pointer border border-slate-100 dark:border-slate-700"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {h.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {h.category} • Streak: {h.streak} days
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shopping Results */}
              {(filterType === 'all' || filterType === 'shopping') && matchedShopping.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                    Shopping Items ({matchedShopping.length})
                  </h3>
                  <div className="space-y-1.5">
                    {matchedShopping.slice(0, 4).map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs border border-slate-100 dark:border-slate-700"
                      >
                        <button
                          onClick={() => toggleShoppingItem(s.id)}
                          className="flex items-center gap-2.5 text-left flex-1"
                        >
                          <CheckCircle
                            className={`w-4 h-4 shrink-0 ${
                              s.completed ? 'text-emerald-500' : 'text-slate-300'
                            }`}
                          />
                          <span
                            className={`font-semibold ${
                              s.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {s.name} ({s.quantity})
                          </span>
                        </button>
                        <span className="text-[10px] text-slate-400">{s.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
