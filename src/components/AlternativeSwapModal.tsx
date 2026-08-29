import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingDown, Check, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { ItemAlternative, ShoppingItem } from '../types';
import { fetchItemSubstitutions } from '../services/api';

interface AlternativeSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShoppingItem | null;
  partyTheme: string;
  budgetTier: string;
  onApplySwap: (originalItemId: string, swap: ItemAlternative) => void;
}

export const AlternativeSwapModal: React.FC<AlternativeSwapModalProps> = ({
  isOpen,
  onClose,
  item,
  partyTheme,
  budgetTier,
  onApplySwap,
}) => {
  const [alternatives, setAlternatives] = useState<ItemAlternative[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && item) {
      if (item.alternatives && item.alternatives.length > 0) {
        setAlternatives(item.alternatives);
      } else {
        loadSubstitutions();
      }
    }
  }, [isOpen, item]);

  const loadSubstitutions = async () => {
    if (!item) return;
    setIsLoading(true);
    try {
      const results = await fetchItemSubstitutions(item, partyTheme, budgetTier);
      setAlternatives(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full p-6 shadow-2xl border-2 border-black animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-black text-[#C5A059] flex items-center justify-center font-bold">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1a1a1a]">
                Ingredient & Provision Substitutions
              </h3>
              <p className="text-[10px] font-serif italic text-stone-500">Value optimization & dietary alternatives</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-black/40 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Item Card */}
        <div className="mt-4 bg-[#FAF9F6] p-4 border border-black/15">
          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/50">
            Selected Cart Item
          </div>
          <div className="flex items-center justify-between mt-1">
            <div>
              <h4 className="text-base font-serif font-bold text-[#1a1a1a]">{item.name}</h4>
              <p className="text-xs text-stone-500 font-mono">
                {item.quantity} {item.unit} • {item.suggestedStore}
              </p>
            </div>
            <div className="text-right">
              <div className="text-base font-serif italic font-bold text-[#1a1a1a]">
                ${item.estimatedPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Alternatives List */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#1a1a1a] px-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-black/60">Curated Substitutions:</span>
            <button
              onClick={loadSubstitutions}
              disabled={isLoading}
              className="text-[#C5A059] hover:text-black flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider disabled:opacity-40 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-stone-500 text-xs flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#C5A059]" />
              <span className="font-serif italic text-xs">Analyzing ingredient pricing & culinary equivalents...</span>
            </div>
          ) : alternatives.length === 0 ? (
            <div className="text-center py-8 text-xs font-serif italic text-stone-500">
              No direct substitutions found. Try regenerating recommendations.
            </div>
          ) : (
            alternatives.map((alt, idx) => {
              const hasSavings = alt.savings > 0;

              return (
                <div
                  key={idx}
                  className="bg-white p-4 border border-black/15 hover:border-black shadow-xs transition-all flex flex-col justify-between space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-sm font-serif font-bold text-[#1a1a1a]">{alt.name}</h5>
                      <p className="text-xs font-serif italic text-stone-600 mt-1 leading-relaxed">{alt.reason}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-serif italic font-bold text-[#1a1a1a]">
                        ${alt.estimatedPrice.toFixed(2)}
                      </div>
                      {hasSavings && (
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#8C6D2B] bg-[#C5A059]/15 px-1.5 py-0.5 border border-[#C5A059]/30 mt-0.5">
                          Save ${alt.savings.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-black/10 flex justify-end">
                    <button
                      onClick={() => {
                        onApplySwap(item.id, alt);
                        onClose();
                      }}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-black hover:bg-[#C5A059] hover:text-black text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                      <span>Swap into Cart</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

