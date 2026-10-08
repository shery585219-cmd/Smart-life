import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, DollarSign, Tag, Trash2, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShoppingItem } from '../../types';

const SHOPPING_CATEGORIES: ShoppingItem['category'][] = [
  'Produce',
  'Dairy & Eggs',
  'Bakery',
  'Meat & Seafood',
  'Pantry',
  'Beverages',
  'Snacks',
  'Household',
];

export const ShoppingModal: React.FC = () => {
  const {
    shoppingModalOpen,
    setShoppingModalOpen,
    editingShoppingItem,
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
  } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ShoppingItem['category']>('Produce');
  const [quantity, setQuantity] = useState('1');
  const [estimatedPrice, setEstimatedPrice] = useState<number | ''>('');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (editingShoppingItem) {
      setName(editingShoppingItem.name);
      setCategory(editingShoppingItem.category);
      setQuantity(editingShoppingItem.quantity);
      setEstimatedPrice(editingShoppingItem.estimatedPrice ?? '');
      setFavorite(!!editingShoppingItem.favorite);
    } else {
      setName('');
      setCategory('Produce');
      setQuantity('1');
      setEstimatedPrice('');
      setFavorite(false);
    }
  }, [editingShoppingItem, shoppingModalOpen]);

  if (!shoppingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingShoppingItem) {
      updateShoppingItem({
        ...editingShoppingItem,
        name: name.trim(),
        category,
        quantity: quantity.trim() || '1',
        estimatedPrice: estimatedPrice === '' ? undefined : Number(estimatedPrice),
        favorite,
      });
    } else {
      addShoppingItem({
        name: name.trim(),
        category,
        quantity: quantity.trim() || '1',
        estimatedPrice: estimatedPrice === '' ? undefined : Number(estimatedPrice),
        completed: false,
        favorite,
      });
    }
    setShoppingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingShoppingItem ? 'Edit Item' : 'Add Shopping Item'}
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
            onClick={() => setShoppingModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Avocados, Almond Milk"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
            >
              {SHOPPING_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantity / Size
              </label>
              <input
                type="text"
                placeholder="e.g. 2 pcs, 1 bottle"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Est. Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 4.99"
                value={estimatedPrice}
                onChange={(e) =>
                  setEstimatedPrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            {editingShoppingItem ? (
              <button
                type="button"
                onClick={() => {
                  deleteShoppingItem(editingShoppingItem.id);
                  setShoppingModalOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShoppingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/25 transition active:scale-95"
              >
                {editingShoppingItem ? 'Save Item' : 'Add to List'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
