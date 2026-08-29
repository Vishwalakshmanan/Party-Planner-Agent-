import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Sparkles,
  Store,
  Tag,
  Check,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Info,
  DollarSign,
  Layers,
  ArrowUpDown,
  Edit3,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { ShoppingCategory, ShoppingItem } from '../types';
import { EditItemModal } from './EditItemModal';

interface ShoppingListTabProps {
  items: ShoppingItem[];
  targetBudget?: number;
  onTogglePurchased: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onUpdateItemPrice: (id: string, newPrice: number) => void;
  onUpdateItem?: (updatedItem: ShoppingItem) => void;
  onDeleteItem: (id: string) => void;
  onOpenAddItemModal: () => void;
  onOpenSwapModal: (item: ShoppingItem) => void;
  onMarkAllPurchased: (status: boolean) => void;
  onOpenCheckout?: () => void;
  onOptimizeBudget?: () => void;
}

export const ShoppingListTab: React.FC<ShoppingListTabProps> = ({
  items,
  targetBudget = 300,
  onTogglePurchased,
  onUpdateQuantity,
  onUpdateItemPrice,
  onUpdateItem,
  onDeleteItem,
  onOpenAddItemModal,
  onOpenSwapModal,
  onMarkAllPurchased,
  onOpenCheckout,
  onOptimizeBudget,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [editingItemModal, setEditingItemModal] = useState<ShoppingItem | null>(null);

  // Categories config
  const categories: { id: string; label: string; icon: string; categoryKey?: ShoppingCategory }[] = [
    { id: 'all', label: 'All Items', icon: '🛒' },
    { id: 'food_fresh', label: 'Food & Fresh', icon: '🥩', categoryKey: 'food_fresh' },
    { id: 'beverages_bar', label: 'Drinks & Bar', icon: '🍹', categoryKey: 'beverages_bar' },
    { id: 'tableware_disposables', label: 'Tableware', icon: '🍽️', categoryKey: 'tableware_disposables' },
    { id: 'decor_atmosphere', label: 'Decor', icon: '🎈', categoryKey: 'decor_atmosphere' },
    { id: 'logistics_essentials', label: 'Logistics', icon: '🧊', categoryKey: 'logistics_essentials' },
  ];

  // Stores available
  const availableStores = useMemo(() => {
    const stores = new Set<string>();
    items.forEach((i) => {
      if (i.suggestedStore) stores.add(i.suggestedStore);
    });
    return Array.from(stores);
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Store filter
      if (selectedStore !== 'all' && item.suggestedStore !== selectedStore) {
        return false;
      }
      // Priority filter
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchSub = (item.subcategory || '').toLowerCase().includes(q);
        const matchStore = (item.suggestedStore || '').toLowerCase().includes(q);
        const matchAisle = (item.aisle || '').toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchStore && !matchAisle) return false;
      }
      return true;
    });
  }, [items, selectedCategory, selectedStore, selectedPriority, searchQuery]);

  // Category counts & subtotals - automatically recalculated
  const categoryStats = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {
      all: { count: items.length, total: items.reduce((s, i) => s + i.estimatedPrice, 0) },
    };

    categories.forEach((cat) => {
      if (cat.categoryKey) {
        const catItems = items.filter((i) => i.category === cat.categoryKey);
        map[cat.id] = {
          count: catItems.length,
          total: catItems.reduce((s, i) => s + i.estimatedPrice, 0),
        };
      }
    });

    return map;
  }, [items]);

  const handleStartEditPrice = (item: ShoppingItem) => {
    setEditingPriceId(item.id);
    setTempPrice(item.estimatedPrice.toString());
  };

  const handleSavePrice = (id: string) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val >= 0) {
      onUpdateItemPrice(id, val);
    }
    setEditingPriceId(null);
  };

  const currentTotal = items.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const isOver = currentTotal > targetBudget;
  const diff = Math.abs(currentTotal - targetBudget);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* CUJ Step 2 & 3: Budget Alignment Banner with Live Automatic Recalculation Indicator */}
      <div className="bg-[#1a1a1a] text-[#FAF9F6] p-4 sm:p-5 border border-black shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-10 h-10 flex items-center justify-center font-bold text-sm shrink-0 border ${
              isOver
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-[#C5A059] text-black border-[#C5A059]'
            }`}
          >
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C5A059]">
                Step 2: Live Budget Ledger
              </span>
              <span
                className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 border ${
                  isOver
                    ? 'bg-rose-900/40 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {isOver ? `+$${diff.toFixed(2)} Over Target` : `$${diff.toFixed(2)} Under Budget`}
              </span>
              <span className="inline-flex items-center text-[9px] font-mono uppercase bg-white/10 px-1.5 py-0.2 text-stone-300">
                <RefreshCw className="w-2.5 h-2.5 mr-1 text-[#C5A059]" />
                Auto-Recalculating
              </span>
            </div>
            <div className="text-sm sm:text-base font-serif italic text-white mt-0.5">
              Current Shopping Total:{' '}
              <strong className="not-italic font-mono text-white font-bold">
                ${currentTotal.toFixed(2)}
              </strong>{' '}
              / Target:{' '}
              <span className="font-mono text-white/70">${targetBudget.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions: Auto-Optimize & Checkout */}
        <div className="flex items-center space-x-2.5 shrink-0 flex-wrap gap-y-2">
          {onOptimizeBudget && (
            <button
              onClick={onOptimizeBudget}
              className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#C5A059] hover:text-black text-white text-[10px] font-bold uppercase tracking-wider transition-colors border border-white/20 flex items-center space-x-1.5"
              title="1-Click AI Budget Optimization & Store-Brand Swaps"
            >
              <TrendingDown className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Auto-Align Budget</span>
            </button>
          )}

          {onOpenCheckout && (
            <button
              onClick={onOpenCheckout}
              className="px-4 py-2 bg-[#C5A059] hover:bg-white text-black text-[10px] font-black uppercase tracking-[0.18em] transition-colors border border-[#C5A059] flex items-center space-x-1.5 shadow-sm"
              title="Finalize Plan & Checkout via Curbside or Delivery"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Refine & Checkout →</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Header with Live Subtotals */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const stats = categoryStats[cat.id] || { count: 0, total: 0 };
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-[#1a1a1a] text-white border-black shadow-xs'
                  : 'bg-white text-[#1a1a1a] border-black/15 hover:bg-[#E8E6E1]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 font-mono font-bold ${
                  isActive ? 'bg-[#C5A059] text-black' : 'bg-black/5 text-black'
                }`}
              >
                ${stats.total.toFixed(0)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search, Filters, Add Item */}
      <div className="bg-white p-4 border border-black/15 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, stores (e.g. Costco, Trader Joe's), or aisles..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-black/15 focus:outline-none focus:border-black focus:bg-white transition-all text-[#1a1a1a] font-medium"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Store Filter */}
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider bg-[#FAF9F6] border border-black/15 text-[#1a1a1a] focus:outline-none focus:border-black"
          >
            <option value="all">All Sourcing Venues</option>
            {availableStores.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider bg-[#FAF9F6] border border-black/15 text-[#1a1a1a] focus:outline-none focus:border-black"
          >
            <option value="all">All Priorities</option>
            <option value="must-have">Must-Have</option>
            <option value="recommended">Recommended</option>
            <option value="optional">Optional / Extra</option>
          </select>

          {/* Add Custom Item Button */}
          <button
            id="btn-add-custom-item"
            onClick={onOpenAddItemModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-[#1a1a1a] hover:bg-[#C5A059] hover:text-black border border-black transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Item List Header & Subtotal Info */}
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-black/50 px-1 border-b border-black/10 pb-2">
        <span>
          Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> provisions
        </span>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onMarkAllPurchased(true)}
            className="text-black hover:text-[#C5A059] font-bold transition-colors"
          >
            Check All
          </button>
          <span>•</span>
          <button
            onClick={() => onMarkAllPurchased(false)}
            className="text-black hover:text-[#C5A059] font-bold transition-colors"
          >
            Uncheck All
          </button>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-black/15 p-12 text-center">
          <div className="w-10 h-10 bg-[#E8E6E1] text-[#1a1a1a] mx-auto flex items-center justify-center mb-3">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#1a1a1a]">No matching provisions found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting the sourcing venue filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedStore('all');
              setSelectedPriority('all');
            }}
            className="mt-4 px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isEditing = editingPriceId === item.id;
            const priorityBadges: Record<string, string> = {
              'must-have': 'bg-black text-white border-black',
              recommended: 'bg-[#C5A059]/15 text-[#8C6D2B] border-[#C5A059]/40',
              optional: 'bg-[#E8E6E1] text-stone-600 border-black/10',
            };

            return (
              <div
                key={item.id}
                className={`bg-white border transition-all duration-200 p-5 flex flex-col justify-between ${
                  item.isPurchased
                    ? 'border-black/10 bg-[#FAF9F6] opacity-60'
                    : 'border-black/15 hover:border-black shadow-xs'
                }`}
              >
                <div>
                  {/* Top row: Checkbox, Name, Store badge, Priority & Quick Edit */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3 flex-1">
                      {/* Checkbox */}
                      <button
                        onClick={() => onTogglePurchased(item.id)}
                        className={`mt-0.5 w-5 h-5 flex items-center justify-center transition-colors border ${
                          item.isPurchased
                            ? 'bg-[#1a1a1a] text-[#C5A059] border-black'
                            : 'border-black/30 bg-[#FAF9F6] hover:border-black'
                        }`}
                        title={item.isPurchased ? 'Mark as unpurchased' : 'Mark as purchased'}
                      >
                        {item.isPurchased && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      {/* Name & Subcategory */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-base font-serif font-bold text-[#1a1a1a] leading-tight ${
                              item.isPurchased ? 'line-through opacity-50' : ''
                            }`}
                          >
                            {item.name}
                          </h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-black/50">
                            {item.subcategory}
                          </span>
                          <span className="text-black/20">•</span>
                          <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#E8E6E1] text-[#1a1a1a] border border-black/10">
                            <Store className="w-2.5 h-2.5 mr-1 text-[#C5A059]" />
                            {item.suggestedStore}
                          </span>
                          {item.aisle && (
                            <span className="text-[9px] font-mono text-black/60 bg-[#FAF9F6] px-1.5 py-0.5 border border-black/10">
                              {item.aisle}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Priority Badge & Edit button */}
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-[9px] font-black uppercase tracking-[0.18em] px-2 py-0.5 border whitespace-nowrap ${
                          priorityBadges[item.priority] || priorityBadges['recommended']
                        }`}
                      >
                        {item.priority.replace('-', ' ')}
                      </span>
                      <button
                        onClick={() => setEditingItemModal(item)}
                        className="p-1 text-black/60 hover:text-black hover:bg-black/5 border border-black/10 transition-colors"
                        title="Edit provision details (Name, Qty, Price, Aisle, Category)"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Portioning Explanation Box */}
                  {item.portionExplanation && (
                    <div className="mt-3 bg-[#FAF9F6] p-2.5 border border-black/10 flex items-start space-x-2 text-xs text-stone-600">
                      <Info className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed font-serif italic text-stone-700">
                        <strong className="not-italic font-sans text-[10px] uppercase tracking-wider font-bold text-black mr-1">
                          Portion Formula:
                        </strong>
                        {item.portionExplanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Row: Quantity Stepper, Price, Alternative Swap, Delete */}
                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between gap-2">
                  {/* Quantity Stepper with Auto-Recalculating Price */}
                  <div className="flex items-center space-x-1.5 bg-[#FAF9F6] border border-black/15 p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-black hover:bg-[#1a1a1a] hover:text-white transition-colors text-xs"
                      title="Decrease quantity (auto-updates total and budget)"
                    >
                      -
                    </button>
                    <span
                      onClick={() => setEditingItemModal(item)}
                      className="text-xs font-bold font-mono text-black px-1 min-w-[40px] text-center cursor-pointer hover:underline"
                      title="Click to edit quantity & unit"
                    >
                      {item.quantity} {item.unit}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-black hover:bg-[#1a1a1a] hover:text-white transition-colors text-xs"
                      title="Increase quantity (auto-updates total and budget)"
                    >
                      +
                    </button>
                  </div>

                  {/* Price display & Inline Editor */}
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-bold text-stone-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSavePrice(item.id)}
                          className="w-16 px-1.5 py-0.5 text-xs font-bold bg-white border-2 border-black focus:outline-none font-mono"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePrice(item.id)}
                          className="px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEditPrice(item)}
                        className="group text-right text-xs hover:bg-[#FAF9F6] px-1.5 py-0.5 transition-colors border border-transparent hover:border-black/10"
                        title="Click to edit item price & automatically recalculate budget"
                      >
                        <div className="font-serif italic font-bold text-[#1a1a1a] text-sm group-hover:text-[#C5A059]">
                          ${item.estimatedPrice.toFixed(2)}
                        </div>
                        <div className="text-[9px] font-mono text-black/50">
                          (${item.unitPrice ? item.unitPrice.toFixed(2) : '—'} / {item.unit})
                        </div>
                      </button>
                    )}

                    {/* AI Alternative / Swap Button */}
                    <button
                      onClick={() => onOpenSwapModal(item)}
                      className="p-1.5 text-black bg-[#C5A059]/20 hover:bg-[#C5A059] hover:text-black border border-[#C5A059]/40 transition-colors"
                      title="View AI Substitutions & Budget Swaps"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-black/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove item and recalculate budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItemModal && (
        <EditItemModal
          isOpen={!!editingItemModal}
          item={editingItemModal}
          onClose={() => setEditingItemModal(null)}
          onSave={(updated) => {
            if (onUpdateItem) {
              onUpdateItem(updated);
            }
            setEditingItemModal(null);
          }}
          onDelete={(id) => {
            onDeleteItem(id);
            setEditingItemModal(null);
          }}
        />
      )}
    </div>
  );
};

