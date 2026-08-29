import React, { useState, useMemo, useEffect } from 'react';
import {
  Check,
  Store,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ListFilter,
  DollarSign,
  PartyPopper,
  Edit3,
  Plus,
  Minus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ShoppingItem } from '../types';
import { EditItemModal } from './EditItemModal';

interface InStoreShopperModeProps {
  items: ShoppingItem[];
  onTogglePurchased: (id: string) => void;
  onUpdateQuantity?: (id: string, delta: number) => void;
  onUpdateItemPrice?: (id: string, newPrice: number) => void;
  onUpdateItem?: (updatedItem: ShoppingItem) => void;
  onDeleteItem?: (id: string) => void;
  onExit: () => void;
}

export const InStoreShopperMode: React.FC<InStoreShopperModeProps> = ({
  items,
  onTogglePurchased,
  onUpdateQuantity,
  onUpdateItemPrice,
  onUpdateItem,
  onDeleteItem,
  onExit,
}) => {
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [activeStoreFilter, setActiveStoreFilter] = useState<string>('all');
  const [editingItemModal, setEditingItemModal] = useState<ShoppingItem | null>(null);

  const totalCount = items.length;
  const purchasedCount = items.filter((i) => i.isPurchased).length;
  const isAllPurchased = totalCount > 0 && purchasedCount === totalCount;

  // Trigger celebration confetti when 100% complete
  useEffect(() => {
    if (isAllPurchased) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isAllPurchased]);

  // Stores list
  const stores = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i.suggestedStore || 'General Grocery'));
    return Array.from(set);
  }, [items]);

  // Group items by Store -> Aisle
  const groupedByStore = useMemo(() => {
    const storeMap: Record<string, Record<string, ShoppingItem[]>> = {};

    items.forEach((item) => {
      if (hideCompleted && item.isPurchased) return;
      if (activeStoreFilter !== 'all' && item.suggestedStore !== activeStoreFilter) return;

      const store = item.suggestedStore || 'General Grocery';
      const aisle = item.aisle || item.subcategory || 'General';

      if (!storeMap[store]) storeMap[store] = {};
      if (!storeMap[store][aisle]) storeMap[store][aisle] = [];

      storeMap[store][aisle].push(item);
    });

    return storeMap;
  }, [items, hideCompleted, activeStoreFilter]);

  // Cart financial totals
  const totalCartSpent = items
    .filter((i) => i.isPurchased)
    .reduce((s, i) => s + i.estimatedPrice, 0);

  const totalCartRemaining = items
    .filter((i) => !i.isPurchased)
    .reduce((s, i) => s + i.estimatedPrice, 0);

  return (
    <div className="min-h-[85vh] bg-[#141414] text-white pb-16">
      {/* Sticky Top Shopper HUD Header */}
      <div className="sticky top-18 z-20 bg-[#1a1a1a]/95 backdrop-blur-md border-b-2 border-black px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={onExit}
              className="p-2 bg-[#2a2a2a] hover:bg-[#C5A059] hover:text-black text-white transition-colors border border-white/10"
              title="Return to standard view"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A059]">
                  In-Store Navigator
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-white/10 text-white font-mono">
                  {purchasedCount}/{totalCount} Items
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-serif italic">Curated aisle-by-aisle route</p>
            </div>
          </div>

          {/* Running Totals */}
          <div className="text-right">
            <div className="text-sm sm:text-base font-serif italic font-bold text-white">
              ${totalCartSpent.toFixed(2)}{' '}
              <span className="text-[10px] uppercase font-sans tracking-wider text-white/50 not-italic">in cart</span>
            </div>
            <div className="text-[10px] text-[#C5A059] font-mono font-bold uppercase tracking-wider">
              ${totalCartRemaining.toFixed(2)} remaining
            </div>
          </div>
        </div>

        {/* Store filter pills & Hide completed toggle */}
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 mt-3 pt-2 border-t border-white/10 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setActiveStoreFilter('all')}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap transition-colors border ${
                activeStoreFilter === 'all'
                  ? 'bg-[#C5A059] text-black border-[#C5A059]'
                  : 'bg-[#2a2a2a] text-white/70 hover:bg-[#333] border-white/10'
              }`}
            >
              All Stores ({stores.length})
            </button>
            {stores.map((st) => (
              <button
                key={st}
                onClick={() => setActiveStoreFilter(st)}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap transition-colors border ${
                  activeStoreFilter === st
                    ? 'bg-[#C5A059] text-black border-[#C5A059]'
                    : 'bg-[#2a2a2a] text-white/70 hover:bg-[#333] border-white/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap flex items-center space-x-1.5 transition-colors border ${
              hideCompleted
                ? 'bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/40'
                : 'bg-[#2a2a2a] text-white/60 hover:text-white border-white/10'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{hideCompleted ? 'Showing Remaining' : 'Show All'}</span>
          </button>
        </div>
      </div>

      {/* Main Checklist Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {isAllPurchased && (
          <div className="bg-[#1a1a1a] border-2 border-[#C5A059] p-6 text-center shadow-2xl animate-in fade-in">
            <div className="w-12 h-12 bg-[#C5A059] text-black mx-auto flex items-center justify-center mb-3">
              <PartyPopper className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-light text-white">All Party Provisions Procured</h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-md mx-auto font-serif italic">
              You’ve secured every single item on your sourcing dossier. Total expenditure: $
              {totalCartSpent.toFixed(2)}. The stage is set for an extraordinary gathering.
            </p>
          </div>
        )}

        {Object.keys(groupedByStore).length === 0 ? (
          <div className="text-center py-16 text-white/40 text-xs uppercase tracking-widest font-bold">
            No remaining provisions to display for the selected sourcing venue.
          </div>
        ) : (
          Object.entries(groupedByStore).map(([storeName, aisles]) => (
            <div key={storeName} className="space-y-4">
              {/* Store Header Banner */}
              <div className="flex items-center space-x-2.5 text-white bg-[#1f1f1f] px-4 py-3 border border-white/15">
                <Store className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-base tracking-tight text-white">{storeName}</h3>
              </div>

              {/* Aisles */}
              <div className="space-y-4 pl-1 sm:pl-3">
                {Object.entries(aisles).map(([aisleName, aisleItems]) => (
                  <div key={aisleName} className="space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C5A059] pl-1 flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-[#C5A059]" />
                      {aisleName}
                    </div>

                    {/* Aisle items list */}
                    <div className="space-y-2">
                      {aisleItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onTogglePurchased(item.id)}
                          className={`cursor-pointer p-4 border transition-all flex items-center justify-between gap-3 select-none ${
                            item.isPurchased
                              ? 'bg-[#181818] border-white/5 opacity-40'
                              : 'bg-[#1f1f1f] border-white/15 hover:border-[#C5A059] hover:bg-[#252525]'
                          }`}
                        >
                          <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                            {/* Big touch checkbox */}
                            <div
                              className={`w-6 h-6 flex items-center justify-center border transition-all shrink-0 ${
                                item.isPurchased
                                  ? 'bg-[#C5A059] border-[#C5A059] text-black font-bold'
                                  : 'border-white/30 bg-black/40'
                              }`}
                            >
                              {item.isPurchased && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>

                            {/* Item name and portion quantity */}
                            <div className="min-w-0 flex-1">
                              <div
                                className={`text-sm sm:text-base font-serif font-bold text-white tracking-tight truncate ${
                                  item.isPurchased ? 'line-through text-white/40' : ''
                                }`}
                              >
                                {item.name}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs text-white/50 mt-1">
                                {onUpdateQuantity ? (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center space-x-1 bg-black/60 border border-white/20 px-1 py-0.5"
                                  >
                                    <button
                                      onClick={() => onUpdateQuantity(item.id, -1)}
                                      className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 text-xs font-bold"
                                    >
                                      -
                                    </button>
                                    <span className="font-mono font-bold text-[#C5A059] px-1 text-[11px]">
                                      {item.quantity} {item.unit}
                                    </span>
                                    <button
                                      onClick={() => onUpdateQuantity(item.id, 1)}
                                      className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 text-xs font-bold"
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <span className="font-mono font-bold text-[#C5A059]">
                                    {item.quantity} {item.unit}
                                  </span>
                                )}
                                <span>•</span>
                                <span className="truncate font-serif italic text-white/70 text-[11px]">
                                  {item.portionExplanation || item.subcategory}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Price Tag & Edit Button */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-2 shrink-0"
                          >
                            <div className="text-right">
                              <div className="text-sm sm:text-base font-serif italic font-bold text-white">
                                ${item.estimatedPrice.toFixed(2)}
                              </div>
                              <span className="text-[9px] uppercase tracking-wider text-white/40">
                                {item.priority}
                              </span>
                            </div>

                            {onUpdateItem && (
                              <button
                                onClick={() => setEditingItemModal(item)}
                                className="p-1.5 bg-[#2a2a2a] hover:bg-[#C5A059] hover:text-black text-white/70 border border-white/10 transition-colors"
                                title="Edit item or in-store price"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

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
            if (onDeleteItem) {
              onDeleteItem(id);
            }
            setEditingItemModal(null);
          }}
        />
      )}
    </div>
  );
};

