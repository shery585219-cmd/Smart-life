import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Sparkles,
  CheckCircle,
  Circle,
  DollarSign,
  Trash2,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Loader2,
  Star,
  ChefHat,
  Home,
  PackageCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShoppingItem } from '../../types';
import { soundFx } from '../../utils/audio';

export const ShoppingTab: React.FC = () => {
  const {
    shoppingItems,
    toggleShoppingItem,
    togglePantryItem,
    clearCompletedShopping,
    setShoppingModalOpen,
    setEditingShoppingItem,
    addBulkShoppingItems,
    setRecipeLibraryOpen,
    triggerCelebration,
    profile,
  } = useApp();

  const [aiMealPrompt, setAiMealPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [copiedList, setCopiedList] = useState(false);
  const [showAiBox, setShowAiBox] = useState(false);
  const [activeView, setActiveView] = useState<'shopping' | 'pantry'>('shopping');

  // Supermarket Aisle Categories
  const categories: ShoppingItem['category'][] = [
    'Produce',
    'Dairy & Eggs',
    'Bakery',
    'Meat & Seafood',
    'Pantry',
    'Beverages',
    'Snacks',
    'Household',
  ];

  const shoppingList = shoppingItems.filter((i) => !i.inPantry);
  const pantryList = shoppingItems.filter((i) => !!i.inPantry);

  const displayedItems = activeView === 'shopping' ? shoppingList : pantryList;

  const pendingItems = shoppingList.filter((i) => !i.completed);
  const completedItems = shoppingList.filter((i) => i.completed);

  // Calculate estimated total for active shopping items
  const estimatedTotal = shoppingList
    .filter((i) => !i.completed && i.estimatedPrice)
    .reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  // Generate grocery list with AI
  const handleGenerateAiList = async () => {
    if (!aiMealPrompt.trim()) return;
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/smart-shopping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputPrompt: aiMealPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          addBulkShoppingItems(
            data.items.map((it: any) => ({
              name: it.name,
              category: it.category || 'Pantry',
              quantity: it.quantity || '1',
              estimatedPrice: it.estimatedPrice,
              completed: false,
              inPantry: false,
            }))
          );
          setAiMealPrompt('');
          setShowAiBox(false);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyList = () => {
    const lines = [
      '🛒 SmartLife Shopping List:',
      ...pendingItems.map((i) => `- [ ] ${i.name} (${i.quantity}) [${i.category}]`),
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(lines);
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2000);
    }
  };

  return (
    <div className="flex-1 p-4 pb-24 max-w-2xl mx-auto w-full space-y-4 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Shopping & Pantry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {pendingItems.length} items to buy • Est. ${estimatedTotal.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setRecipeLibraryOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition active:scale-95"
            title="Browse recipe meal planner"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Recipes</span>
          </button>

          <button
            onClick={() => setShowAiBox(!showAiBox)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-xs font-bold hover:bg-violet-100 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Recipe</span>
          </button>

          <button
            onClick={() => {
              setEditingShoppingItem(null);
              setShoppingModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>

      {/* View Switcher: Grocery Cart vs In-Pantry Stock */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveView('shopping')}
          className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeView === 'shopping'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shopping Cart ({pendingItems.length})</span>
        </button>

        <button
          onClick={() => setActiveView('pantry')}
          className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeView === 'pantry'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>In Pantry / Stocked ({pantryList.length})</span>
        </button>
      </div>

      {/* AI Recipe Generator Box */}
      {showAiBox && (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-teal-500/10 border border-violet-200 dark:border-violet-800 space-y-2.5 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-900 dark:text-violet-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-600" />
              Generate Ingredients from Recipe or Dish Idea
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Avocado toast with poached eggs, or BBQ party for 6"
              value={aiMealPrompt}
              onChange={(e) => setAiMealPrompt(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={handleGenerateAiList}
              disabled={aiLoading || !aiMealPrompt.trim()}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Summary Banner */}
      {activeView === 'shopping' && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Estimated Basket Total: ${estimatedTotal.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">
                {pendingItems.length} to buy • {completedItems.length} in cart
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyList}
              title="Copy list to clipboard"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition text-xs font-semibold flex items-center gap-1"
            >
              {copiedList ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedList ? 'Copied' : 'Share'}</span>
            </button>

            {completedItems.length > 0 && (
              <button
                onClick={clearCompletedShopping}
                title="Clear completed items"
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Done</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Categorized List */}
      <div className="space-y-4">
        {displayedItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <PackageCheck className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-500" />
            {activeView === 'shopping' ? 'All shopping items checked off!' : 'No items currently in pantry.'}
          </div>
        ) : (
          categories.map((cat) => {
            const itemsInCat = displayedItems.filter((i) => i.category === cat);
            if (itemsInCat.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
                  {cat} ({itemsInCat.filter((i) => !i.completed).length})
                </h3>

                <div className="space-y-1.5">
                  {itemsInCat.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        item.completed
                          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                          : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-800 shadow-xs'
                      }`}
                    >
                      <button
                        onClick={() => toggleShoppingItem(item.id)}
                        className="flex items-center gap-3 text-left flex-1 min-w-0"
                      >
                        {item.completed ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-emerald-500 shrink-0" />
                        )}

                        <div className="min-w-0">
                          <span
                            className={`text-xs font-bold block truncate ${
                              item.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Qty: {item.quantity}
                            {item.estimatedPrice ? ` • ~$${item.estimatedPrice.toFixed(2)}` : ''}
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePantryItem(item.id)}
                          title={item.inPantry ? 'Move to Shopping List' : 'Move to Pantry'}
                          className={`p-1.5 rounded-lg text-xs font-bold transition ${
                            item.inPantry
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950'
                              : 'text-slate-400 hover:text-emerald-600'
                          }`}
                        >
                          <Home className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingShoppingItem(item);
                            setShoppingModalOpen(true);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
