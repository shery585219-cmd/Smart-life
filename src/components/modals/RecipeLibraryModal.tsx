import React from 'react';
import { X, ChefHat, Plus, Check, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShoppingItem } from '../../types';

interface Recipe {
  id: string;
  title: string;
  prepTime: string;
  category: string;
  imageEmoji: string;
  ingredients: { name: string; quantity: string; category: ShoppingItem['category']; estimatedPrice: number }[];
}

const RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Mediterranean Quinoa Power Bowl',
    prepTime: '20 min',
    category: 'Healthy Lunch',
    imageEmoji: '🥗',
    ingredients: [
      { name: 'Organic Quinoa', quantity: '1 box', category: 'Pantry', estimatedPrice: 3.99 },
      { name: 'Cherry Tomatoes', quantity: '1 pint', category: 'Produce', estimatedPrice: 2.99 },
      { name: 'Cucumbers', quantity: '2 pcs', category: 'Produce', estimatedPrice: 1.5 },
      { name: 'Kalamata Olives', quantity: '1 jar', category: 'Pantry', estimatedPrice: 3.49 },
      { name: 'Feta Cheese', quantity: '1 block', category: 'Dairy & Eggs', estimatedPrice: 4.25 },
    ],
  },
  {
    id: 'rec-2',
    title: 'Creamy Garlic & Spinach Pasta',
    prepTime: '25 min',
    category: 'Quick Dinner',
    imageEmoji: '🍝',
    ingredients: [
      { name: 'Fettuccine Pasta', quantity: '1 box (16oz)', category: 'Pantry', estimatedPrice: 1.99 },
      { name: 'Baby Spinach', quantity: '1 bag', category: 'Produce', estimatedPrice: 2.49 },
      { name: 'Heavy Cream or Oat Cream', quantity: '1 pint', category: 'Dairy & Eggs', estimatedPrice: 3.25 },
      { name: 'Fresh Garlic Head', quantity: '1 pc', category: 'Produce', estimatedPrice: 0.75 },
      { name: 'Parmesan Cheese', quantity: '1 wedge', category: 'Dairy & Eggs', estimatedPrice: 4.99 },
    ],
  },
  {
    id: 'rec-3',
    title: 'Energizing Berry Breakfast Smoothie Bowl',
    prepTime: '10 min',
    category: 'Breakfast',
    imageEmoji: '🍓',
    ingredients: [
      { name: 'Frozen Wild Berries', quantity: '1 bag', category: 'Pantry', estimatedPrice: 3.99 },
      { name: 'Bananas', quantity: '1 bunch', category: 'Produce', estimatedPrice: 1.25 },
      { name: 'Greek Yogurt', quantity: '32 oz', category: 'Dairy & Eggs', estimatedPrice: 4.5 },
      { name: 'Chia Seeds', quantity: '1 bag', category: 'Pantry', estimatedPrice: 4.99 },
      { name: 'Almond Granola', quantity: '1 bag', category: 'Bakery', estimatedPrice: 4.2 },
    ],
  },
  {
    id: 'rec-4',
    title: 'Family Fiesta Chicken Fajitas',
    prepTime: '30 min',
    category: 'Family Dinner',
    imageEmoji: '🌮',
    ingredients: [
      { name: 'Chicken Breast Strips', quantity: '1.5 lbs', category: 'Meat & Seafood', estimatedPrice: 8.5 },
      { name: 'Bell Peppers (Trio)', quantity: '3 pcs', category: 'Produce', estimatedPrice: 3.99 },
      { name: 'Yellow Onions', quantity: '2 pcs', category: 'Produce', estimatedPrice: 1.25 },
      { name: 'Tortillas', quantity: '1 pack (10ct)', category: 'Bakery', estimatedPrice: 2.99 },
      { name: 'Fresh Cilantro & Limes', quantity: '1 bunch', category: 'Produce', estimatedPrice: 1.5 },
    ],
  },
];

export const RecipeLibraryModal: React.FC = () => {
  const { recipeLibraryOpen, setRecipeLibraryOpen, addBulkShoppingItems, setActiveTab } = useApp();

  if (!recipeLibraryOpen) return null;

  const handleAddRecipeToShopping = (recipe: Recipe) => {
    addBulkShoppingItems(
      recipe.ingredients.map((ing) => ({
        name: ing.name,
        quantity: ing.quantity,
        category: ing.category,
        estimatedPrice: ing.estimatedPrice,
        completed: false,
      }))
    );
    setRecipeLibraryOpen(false);
    setActiveTab('shopping');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Curated Recipe Inspiration
              </h2>
              <p className="text-[10px] text-slate-400">
                1-tap import all ingredients to your SmartLife Shopping List
              </p>
            </div>
          </div>
          <button
            onClick={() => setRecipeLibraryOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipe Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {RECIPES.map((recipe) => (
            <div
              key={recipe.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{recipe.imageEmoji}</span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {recipe.prepTime}
                      </span>
                      <span>•</span>
                      <span>{recipe.category}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAddRecipeToShopping(recipe)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition active:scale-95 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add All Ingredients
                </button>
              </div>

              {/* Ingredients preview chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {recipe.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-medium"
                  >
                    {ing.name} ({ing.quantity})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
