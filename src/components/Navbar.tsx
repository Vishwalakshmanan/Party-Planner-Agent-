import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  Plus,
  ShoppingCart,
  Share2,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  Mic,
  MicOff,
  Bot,
} from 'lucide-react';
import { PartyPlan } from '../types';

interface NavbarProps {
  currentPlan: PartyPlan;
  onOpenWizard: () => void;
  onOpenPresets: () => void;
  onOpenExport: () => void;
  onOpenCheckout: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  isInStoreMode: boolean;
  onToggleInStoreMode: () => void;
  isVoiceListening?: boolean;
  onToggleVoiceListening?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPlan,
  onOpenWizard,
  onOpenPresets,
  onOpenExport,
  onOpenCheckout,
  onToggleChat,
  isChatOpen,
  isInStoreMode,
  onToggleInStoreMode,
  isVoiceListening = false,
  onToggleVoiceListening,
}) => {
  const purchasedCount = currentPlan.shoppingList.filter((i) => i.isPurchased).length;
  const totalCount = currentPlan.shoppingList.length;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 bg-[#1a1a1a] text-[#C5A059] flex items-center justify-center font-serif font-black text-lg shadow-xs border border-black">
              C
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-[#1a1a1a] tracking-tight text-xl">
                  CymbalMart
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 bg-[#C5A059]/15 text-[#8C6D2B] border border-[#C5A059]/30">
                  Party Planner
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-black/50 hidden sm:block truncate max-w-xs">
                {currentPlan.profile.title}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Define / Edit Event Button */}
            <button
              id="btn-define-event"
              onClick={onOpenWizard}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-[10px] tracking-[0.15em] font-bold uppercase text-[#1a1a1a] bg-[#E8E6E1] hover:bg-[#1a1a1a] hover:text-white border border-black/10 transition-colors"
              title="1. Define Party Type, Budget, Guests & Requests"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C6D2B]" />
              <span className="hidden md:inline">1. Define Event</span>
            </button>

            {/* Presets Button */}
            <button
              id="btn-party-presets"
              onClick={onOpenPresets}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-[10px] tracking-[0.15em] font-bold uppercase text-[#1a1a1a] bg-[#E8E6E1] hover:bg-[#1a1a1a] hover:text-white border border-black/10 transition-colors"
              title="Browse Preset Event Blueprints"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Blueprints</span>
            </button>

            {/* In-Store Mode Toggle */}
            <button
              id="btn-in-store-mode"
              onClick={onToggleInStoreMode}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 text-[10px] tracking-[0.15em] font-bold uppercase transition-all border ${
                isInStoreMode
                  ? 'bg-[#1a1a1a] text-[#C5A059] border-black'
                  : 'bg-white text-[#1a1a1a] hover:bg-[#E8E6E1] border-black/20'
              }`}
              title="Aisle-by-Aisle In-Store Shopping Checklist"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">
                {isInStoreMode ? 'Exit Store View' : 'In-Store View'}
              </span>
              <span className="px-1.5 py-0.5 text-[9px] bg-black/10 font-mono">
                {purchasedCount}/{totalCount}
              </span>
            </button>

            {/* Hands-Free Voice Control Toggle */}
            {onToggleVoiceListening && (
              <button
                id="btn-voice-control-toggle"
                onClick={onToggleVoiceListening}
                className={`inline-flex items-center space-x-1.5 px-3 py-2 text-[10px] tracking-[0.15em] font-black uppercase transition-all border ${
                  isVoiceListening
                    ? 'bg-red-600 text-white border-red-500 shadow-md animate-pulse'
                    : 'bg-stone-900 text-[#C5A059] hover:bg-black hover:text-white border-black'
                }`}
                title={isVoiceListening ? 'Hands-Free Voice Listening is Active' : 'Enable Hands-Free Voice Control'}
              >
                {isVoiceListening ? (
                  <Mic className="w-3.5 h-3.5 animate-pulse text-white" />
                ) : (
                  <MicOff className="w-3.5 h-3.5 text-[#C5A059]" />
                )}
                <span className="hidden xl:inline">
                  {isVoiceListening ? 'Listening...' : 'Voice Control'}
                </span>
              </button>
            )}

            {/* Checkout & Finalize Button */}
            <button
              id="btn-checkout"
              onClick={onOpenCheckout}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-[10px] tracking-[0.2em] font-black uppercase text-white bg-black hover:bg-[#C5A059] hover:text-black border-2 border-black transition-colors shadow-xs"
              title="3. Review Sourcing & Checkout"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Checkout</span>
            </button>

            {/* CymbalMart Assistant Chat Toggle */}
            <button
              id="btn-ai-chat-toggle"
              onClick={onToggleChat}
              className={`relative inline-flex items-center space-x-1.5 px-3.5 py-2 text-[10px] tracking-[0.2em] font-black uppercase transition-all border ${
                isChatOpen
                  ? 'bg-[#C5A059] text-black border-black shadow-xs'
                  : 'bg-[#C5A059] text-black hover:bg-[#1a1a1a] hover:text-[#FAF9F6] border-black'
              }`}
              title="Chat with CymbalMart Assistant"
            >
              <Bot className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">CymbalMart Assistant</span>
              <span className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-white absolute -top-0.5 -right-0.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


