import React, { useState, useEffect } from 'react';
import { X, Check, Package, DollarSign, Store, Tag, Sparkles, Trash2 } from 'lucide-react';
import { ShoppingCategory, ShoppingItem } from '../types';

interface EditItemModalProps {
  isOpen: boolean;
  item: ShoppingItem | null;
  onClose: () => void;
  onSave: (updatedItem: ShoppingItem) => void;
  onDelete?: (id: string) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<ShoppingCategory>('food_fresh');
  const [subcategory, setSubcategory] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('unit');
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [suggestedStore, setSuggestedStore] = useState<string>('Supermarket / Grocery');
  const [aisle, setAisle] = useState<string>('General');
  const [priority, setPriority] = useState<'must-have' | 'recommended' | 'optional'>('recommended');
  const [portionExplanation, setPortionExplanation] = useState<string>('');

  // Populate form fields when item changes
  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setSubcategory(item.subcategory || '');
      setQuantity(item.quantity);
      setUnit(item.unit);
      const uPrice = item.unitPrice || (item.quantity > 0 ? item.estimatedPrice / item.quantity : item.estimatedPrice);
      setUnitPrice(Number(uPrice.toFixed(2)));
      setEstimatedPrice(item.estimatedPrice);
      setSuggestedStore(item.suggestedStore || 'Supermarket / Grocery');
      setAisle(item.aisle || 'General');
      setPriority(item.priority || 'recommended');
      setPortionExplanation(item.portionExplanation || '');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  // Handle Quantity change -> recalculate estimated total
  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, newQty);
    setQuantity(validQty);
    const newTotal = Number((unitPrice * validQty).toFixed(2));
    setEstimatedPrice(newTotal);
  };

  // Handle Unit Price change -> recalculate estimated total
  const handleUnitPriceChange = (newUnitP: number) => {
    const validUnitP = Math.max(0, newUnitP);
    setUnitPrice(validUnitP);
    const newTotal = Number((validUnitP * quantity).toFixed(2));
    setEstimatedPrice(newTotal);
  };

  // Handle Total Estimated Price change -> recalculate unit price
  const handleEstimatedPriceChange = (newEstTotal: number) => {
    const validTotal = Math.max(0, newEstTotal);
    setEstimatedPrice(validTotal);
    const newUnitP = quantity > 0 ? Number((validTotal / quantity).toFixed(2)) : validTotal;
    setUnitPrice(newUnitP);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: ShoppingItem = {
      ...item,
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || 'General',
      quantity: Math.max(1, quantity),
      unit: unit.trim() || 'unit',
      unitPrice: Number(unitPrice.toFixed(2)),
      estimatedPrice: Number(estimatedPrice.toFixed(2)),
      suggestedStore: suggestedStore.trim() || 'Supermarket / Grocery',
      aisle: aisle.trim() || 'General',
      priority,
      portionExplanation: portionExplanation.trim(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-xl w-full p-6 sm:p-7 shadow-2xl border-2 border-black animate-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black text-[#C5A059] flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#8C6D2B]">
                  Update Provision
                </span>
                <span className="text-[9px] font-mono uppercase bg-black/5 px-1.5 py-0.2 border border-black/10">
                  Auto-Recalculates Budget
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1a1a1a] truncate max-w-sm">
                Edit {item.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-black/40 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
              Item / Provision Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. USDA Prime Flank Steak, Fresh Limes"
              className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black font-serif italic text-black font-medium"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
                Budget Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ShoppingCategory)}
                className="w-full px-3 py-2 text-xs font-serif bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black"
              >
                <option value="food_fresh">Food & Fresh Ingredients</option>
                <option value="beverages_bar">Beverages & Bar</option>
                <option value="decor_atmosphere">Decor & Atmosphere</option>
                <option value="tableware_disposables">Tableware & Paper Goods</option>
                <option value="logistics_essentials">Logistics & Essentials</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
                Subcategory
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Proteins, Mixers, Garnishes"
                className="w-full px-3 py-2 text-xs font-serif bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Quantity, Unit, Unit Price, Total Price */}
          <div className="bg-[#FAF9F6] p-3.5 border border-black/15 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#8C6D2B] font-bold pb-1 border-b border-black/10">
              <span>Portion & Pricing Math</span>
              <span>Total = Qty × Unit Price</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Quantity */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-black/60 mb-1">
                  Quantity
                </label>
                <div className="flex items-center border border-black/20 bg-white">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-2 py-1 bg-black/5 hover:bg-black hover:text-white text-xs font-bold transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-full text-center py-1 text-xs font-mono font-bold text-black focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-2 py-1 bg-black/5 hover:bg-black hover:text-white text-xs font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-black/60 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="lbs, bottles, cans"
                  className="w-full px-2.5 py-1.5 text-xs font-serif bg-white border border-black/20 focus:outline-none focus:border-black"
                />
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-black/60 mb-1">
                  Unit Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-black/40 font-mono">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={unitPrice}
                    onChange={(e) => handleUnitPriceChange(parseFloat(e.target.value) || 0)}
                    className="w-full pl-5 pr-2 py-1.5 text-xs font-mono font-bold bg-white border border-black/20 focus:outline-none focus:border-black text-black"
                  />
                </div>
              </div>

              {/* Total Estimated Price */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8C6D2B] mb-1">
                  Item Total ($)
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[#8C6D2B] font-mono font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={estimatedPrice}
                    onChange={(e) => handleEstimatedPriceChange(parseFloat(e.target.value) || 0)}
                    className="w-full pl-5 pr-2 py-1.5 text-xs font-mono font-black bg-white border-2 border-black focus:outline-none text-[#8C6D2B]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Store, Aisle & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
                Suggested Store
              </label>
              <select
                value={suggestedStore}
                onChange={(e) => setSuggestedStore(e.target.value)}
                className="w-full px-2.5 py-2 text-xs font-serif bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black"
              >
                <option value="Supermarket / Grocery">Supermarket / Grocery</option>
                <option value="Costco / Wholesale">Costco / Wholesale</option>
                <option value="Trader Joe’s">Trader Joe’s</option>
                <option value="Liquor Store">Liquor Store</option>
                <option value="Party Store / Amazon">Party Store / Amazon</option>
                <option value="Target / Retail">Target / Retail</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
                Aisle / Department
              </label>
              <input
                type="text"
                value={aisle}
                onChange={(e) => setAisle(e.target.value)}
                placeholder="e.g. Meat & Seafood"
                className="w-full px-2.5 py-2 text-xs font-serif bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'must-have' | 'recommended' | 'optional')}
                className="w-full px-2.5 py-2 text-xs font-serif bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black"
              >
                <option value="must-have">Must-Have</option>
                <option value="recommended">Recommended</option>
                <option value="optional">Optional / Extra</option>
              </select>
            </div>
          </div>

          {/* Portion Calculation Note */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
              Portion Formula / Rationale
            </label>
            <input
              type="text"
              value={portionExplanation}
              onChange={(e) => setPortionExplanation(e.target.value)}
              placeholder="e.g. 0.5 lb per guest + 15% buffer for meat shrinkage"
              className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black font-serif italic text-stone-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-black/10">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(item.id);
                  onClose();
                }}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Item</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black/60 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-black uppercase tracking-[0.18em] text-white bg-black hover:bg-[#C5A059] hover:text-black border-2 border-black transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Recalculate</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
