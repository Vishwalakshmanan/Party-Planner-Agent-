import React, { useState } from 'react';
import { X, Plus, Package } from 'lucide-react';
import { ShoppingCategory, ShoppingItem } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'isPurchased'>) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAddItem }) => {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<ShoppingCategory>('food_fresh');
  const [subcategory, setSubcategory] = useState<string>('Produce & Fresh');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('pack');
  const [portionExplanation, setPortionExplanation] = useState<string>('');
  const [estimatedPrice, setEstimatedPrice] = useState<number>(10.0);
  const [suggestedStore, setSuggestedStore] = useState<string>('Supermarket / Grocery');
  const [aisle, setAisle] = useState<string>('Produce');
  const [priority, setPriority] = useState<'must-have' | 'recommended' | 'optional'>('must-have');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || 'General',
      quantity: Math.max(1, quantity),
      unit: unit.trim() || 'unit',
      portionExplanation: portionExplanation.trim() || 'Custom item added by host',
      estimatedPrice: Math.max(0, estimatedPrice),
      unitPrice: Number((estimatedPrice / Math.max(1, quantity)).toFixed(2)),
      suggestedStore: suggestedStore.trim() || 'Supermarket / Grocery',
      aisle: aisle.trim() || 'General Aisle',
      priority,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full p-6 shadow-2xl border-2 border-black animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-black text-[#C5A059] flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1a1a1a]">Add Provision to Sourcing List</h3>
              <p className="text-[10px] uppercase font-mono tracking-wider text-black/50">Custom ingredients, bar additions, or supplies</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-black/40 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">Provision Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maldon Smoked Sea Salt, Prosecco Superiore DOCG"
              className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black font-serif italic text-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ShoppingCategory)}
                className="w-full px-3 py-2 text-xs font-serif bg-[#FAF9F6] border border-black/20"
              >
                <option value="food_fresh">Food & Fresh</option>
                <option value="beverages_bar">Beverages & Bar</option>
                <option value="decor_atmosphere">Decor & Atmosphere</option>
                <option value="tableware_disposables">Tableware & Paper</option>
                <option value="logistics_essentials">Logistics & Essentials</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">Subcategory</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Artisanal Cheese, Aperitifs"
                className="w-full px-3 py-2 text-xs font-serif bg-[#FAF9F6] border border-black/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-1.5 text-xs font-bold bg-[#FAF9F6] border border-black/20 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. bottles, packs"
                className="w-full px-3 py-1.5 text-xs font-serif bg-[#FAF9F6] border border-black/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">Est. Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-bold bg-[#FAF9F6] border border-black/20 text-[#8C6D2B] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">Suggested Store</label>
              <select
                value={suggestedStore}
                onChange={(e) => setSuggestedStore(e.target.value)}
                className="w-full px-3 py-2 text-xs font-serif bg-[#FAF9F6] border border-black/20"
              >
                <option value="Costco / Wholesale">Costco / Wholesale</option>
                <option value="Supermarket / Grocery">Supermarket / Grocery</option>
                <option value="Trader Joe’s">Trader Joe’s</option>
                <option value="Party Store / Amazon">Party Store / Amazon</option>
                <option value="Liquor Store">Liquor Store</option>
                <option value="Target / Retail">Target / Retail</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">Aisle / Dept</label>
              <input
                type="text"
                value={aisle}
                onChange={(e) => setAisle(e.target.value)}
                placeholder="e.g. Specialty Imports"
                className="w-full px-3 py-2 text-xs font-serif bg-[#FAF9F6] border border-black/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
              Portion Math / Curatorial Note
            </label>
            <input
              type="text"
              value={portionExplanation}
              onChange={(e) => setPortionExplanation(e.target.value)}
              placeholder="e.g. 1 unit per 6 guests for finishing garnish"
              className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-black/20 font-serif italic"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2 border-t border-black/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black/60 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-[#C5A059] hover:text-black border border-black transition-colors"
            >
              Append to Cart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

