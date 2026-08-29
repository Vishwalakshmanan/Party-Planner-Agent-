import React from 'react';
import { X, Sparkles, Compass, Users, DollarSign, ArrowRight, Check } from 'lucide-react';
import { PRESET_PARTIES } from '../data/presetParties';
import { PartyPlan } from '../types';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId: string;
  onSelectPreset: (plan: PartyPlan) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  currentPlanId,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const presets = Object.values(PRESET_PARTIES);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-black animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-black text-[#C5A059] flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1a1a1a]">Curated Gathering Archives</h3>
              <p className="text-[10px] uppercase font-mono tracking-wider text-black/50">
                Editorial menus, portion calculations, and provision lists ready to deploy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-black/40 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets List */}
        <div className="overflow-y-auto flex-1 py-4 space-y-3.5 pr-1">
          {presets.map((preset) => {
            const isCurrent = preset.profile.id === currentPlanId;
            const totalGuests =
              preset.profile.adultsCount + (preset.profile.kidsCount || 0);

            return (
              <div
                key={preset.profile.id}
                className={`p-5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'border-2 border-black bg-[#FAF9F6] shadow-sm'
                    : 'border border-black/15 hover:border-black bg-white'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black text-[#FAF9F6]">
                      {preset.profile.theme}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-black/40">
                      {preset.profile.venueType}
                    </span>
                  </div>

                  <h4 className="text-base font-serif font-bold text-[#1a1a1a] tracking-tight">
                    {preset.profile.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-stone-600 font-serif">
                    <span className="flex items-center gap-1 font-semibold text-black">
                      <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                      {totalGuests} Guests
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-[#8C6D2B]">
                      <DollarSign className="w-3.5 h-3.5 text-[#C5A059]" />${preset.profile.targetBudget} Target
                    </span>
                    <span>•</span>
                    <span className="text-stone-500 italic">
                      {preset.shoppingList.length} curated provisions
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center space-x-1.5 border border-black ${
                    isCurrent
                      ? 'bg-[#C5A059] text-black border-[#C5A059]'
                      : 'bg-black hover:bg-[#C5A059] hover:text-black text-white'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Active Edition</span>
                    </>
                  ) : (
                    <>
                      <span>Deploy Edition</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

