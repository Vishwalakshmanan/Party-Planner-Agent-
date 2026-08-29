import React from 'react';
import {
  Users,
  Clock,
  MapPin,
  DollarSign,
  Utensils,
  Wine,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Package,
  ShoppingBag,
  SlidersHorizontal,
  TrendingDown,
} from 'lucide-react';
import { PartyPlan } from '../types';

interface PlanOverviewHeaderProps {
  currentPlan: PartyPlan;
  activeTab: 'shopping' | 'instore' | 'portions' | 'timeline' | 'menu';
  onSelectTab: (tab: 'shopping' | 'instore' | 'portions' | 'timeline' | 'menu') => void;
  onOpenWizard: () => void;
  onOpenCheckout?: () => void;
  onOptimizeBudget?: () => void;
}

export const PlanOverviewHeader: React.FC<PlanOverviewHeaderProps> = ({
  currentPlan,
  activeTab,
  onSelectTab,
  onOpenWizard,
  onOpenCheckout,
  onOptimizeBudget,
}) => {
  const { profile, budgetBreakdown, shoppingList } = currentPlan;
  const totalGuests = profile.adultsCount + (profile.kidsCount || 0);

  const totalSpent = shoppingList
    .filter((i) => i.isPurchased)
    .reduce((sum, item) => sum + item.estimatedPrice, 0);

  const targetBudget = profile.targetBudget || 1;
  const estimatedTotal = budgetBreakdown.totalEstimated;
  const budgetRatio = (estimatedTotal / targetBudget) * 100;
  const isOverBudget = estimatedTotal > targetBudget;
  const costPerGuest = totalGuests > 0 ? estimatedTotal / totalGuests : 0;

  const purchasedCount = shoppingList.filter((i) => i.isPurchased).length;
  const purchasedProgress = shoppingList.length
    ? Math.round((purchasedCount / shoppingList.length) * 100)
    : 0;

  // Venue format text
  const venueLabels: Record<string, string> = {
    backyard: 'Backyard / Outdoor',
    indoor_home: 'Home / Living Room',
    park: 'Public Park / Pavilion',
    rented_venue: 'Rented Hall / Event Space',
    beach: 'Beach / Lakeside',
    office: 'Office / Workplace',
  };

  return (
    <div className="bg-[#FAF9F6] border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Critical User Journey (CUJ) Step Guide for Busy Hosts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-6 pb-5 border-b border-black/15">
          {/* Step 1: Define Event */}
          <button
            onClick={onOpenWizard}
            className="p-3 text-left bg-white border border-black/15 hover:border-black transition-all group flex items-start space-x-2.5 shadow-2xs"
          >
            <div className="w-6 h-6 bg-black text-[#C5A059] flex items-center justify-center text-[11px] font-mono font-bold shrink-0 mt-0.5">
              1
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D2B] font-bold">
                  Step 1: Define Event
                </span>
                <span className="text-[9px] uppercase font-bold text-black/40 group-hover:text-black">
                  Edit ✎
                </span>
              </div>
              <p className="text-xs font-serif font-bold text-[#1a1a1a] truncate">
                {profile.eventType} • {totalGuests} Guests
              </p>
              <p className="text-[10px] text-stone-500 font-sans truncate">
                ${targetBudget} Target • {profile.theme}
              </p>
            </div>
          </button>

          {/* Step 2: Review List */}
          <button
            onClick={() => onSelectTab('shopping')}
            className={`p-3 text-left border transition-all flex items-start space-x-2.5 ${
              activeTab === 'shopping'
                ? 'bg-[#1a1a1a] text-white border-black shadow-xs'
                : 'bg-white text-black border-black/15 hover:border-black'
            }`}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center text-[11px] font-mono font-bold shrink-0 mt-0.5 ${
                activeTab === 'shopping' ? 'bg-[#C5A059] text-black' : 'bg-black text-[#C5A059]'
              }`}
            >
              2
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                    activeTab === 'shopping' ? 'text-[#C5A059]' : 'text-[#8C6D2B]'
                  }`}
                >
                  Step 2: Review List & Budget
                </span>
                <span className="text-[9px] uppercase font-bold opacity-60">
                  {shoppingList.length} Items
                </span>
              </div>
              <p className="text-xs font-serif font-bold truncate">
                ${estimatedTotal.toFixed(2)} Estimated (${costPerGuest.toFixed(2)}/guest)
              </p>
              <p
                className={`text-[10px] truncate ${
                  activeTab === 'shopping' ? 'text-stone-300' : 'text-stone-500'
                }`}
              >
                Portions aligned & store-aisle routed
              </p>
            </div>
          </button>

          {/* Step 3: Refine & Checkout */}
          <button
            onClick={() => (onOpenCheckout ? onOpenCheckout() : onSelectTab('shopping'))}
            className="p-3 text-left bg-white border border-black/15 hover:border-black transition-all group flex items-start space-x-2.5 shadow-2xs"
          >
            <div className="w-6 h-6 bg-[#C5A059] text-black flex items-center justify-center text-[11px] font-mono font-black shrink-0 mt-0.5">
              3
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D2B] font-bold">
                  Step 3: Refine & Checkout
                </span>
                <span className="text-[9px] uppercase font-bold text-[#8C6D2B] group-hover:underline">
                  Finalize →
                </span>
              </div>
              <p className="text-xs font-serif font-bold text-[#1a1a1a] truncate">
                Curbside, Delivery & In-Store HUD
              </p>
              <p className="text-[10px] text-stone-500 font-sans truncate">
                Cymbal Select swaps & club member savings
              </p>
            </div>
          </button>
        </div>

        {/* Main Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] bg-[#1a1a1a] text-white">
                {profile.eventType}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] bg-[#E8E6E1] text-[#1a1a1a] border border-black/10">
                {venueLabels[profile.venueType] || profile.venueType}
              </span>
              <button
                onClick={onOpenWizard}
                className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2B] hover:underline ml-1"
              >
                ✎ Change Parameters
              </button>
            </div>

            <h1 className="text-3xl sm:text-5xl font-light font-serif tracking-tight text-[#1a1a1a] leading-[1.1]">
              {profile.title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="italic text-[#C5A059] font-normal">
                {profile.title.split(' ').slice(-1)}
              </span>
            </h1>

            {/* Sub-text notes */}
            <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed max-w-xl">
              {profile.vibeNotes ||
                `CymbalMart party shopping plan for ${profile.title}. Calculated portion formulas include meat shrinkage, beverage pacing, and aisle-by-aisle organization.`}
            </p>

            {/* Quick Metadata Bar */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-5 mt-3.5 text-xs font-semibold text-black/70">
              <div className="flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>
                  <strong>{totalGuests} Guests</strong> ({profile.adultsCount} Adults
                  {profile.kidsCount ? `, ${profile.kidsCount} Kids` : ''})
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{profile.durationHours} Hours Duration</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>${costPerGuest.toFixed(2)} / guest</span>
              </div>
            </div>
          </div>

          {/* Budget Health Card in Editorial Look */}
          <div className="bg-[#1a1a1a] text-[#FAF9F6] p-5 min-w-[290px] sm:min-w-[340px] border border-black shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase opacity-50 mb-2 font-bold">
              <span>Financial Ledger</span>
              <span>{profile.budgetTier}</span>
            </div>

            <div className="flex justify-between items-baseline mb-2">
              <div className="text-2xl sm:text-3xl font-serif italic text-white">
                ${estimatedTotal.toFixed(2)}
              </div>
              <div className="text-[11px] tracking-wider uppercase opacity-60 font-mono">
                / ${targetBudget.toFixed(2)} Target
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 overflow-hidden my-1">
              <div
                className={`h-full transition-all duration-500 ${
                  isOverBudget ? 'bg-rose-400' : 'bg-[#C5A059]'
                }`}
                style={{ width: `${Math.min(100, budgetRatio)}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10 text-[10px] uppercase tracking-wider font-semibold">
              <span className={isOverBudget ? 'text-rose-400' : 'text-[#C5A059]'}>
                {isOverBudget
                  ? `Over by $${(estimatedTotal - targetBudget).toFixed(2)}`
                  : `$${budgetBreakdown.budgetRemaining.toFixed(2)} Cushion`}
              </span>
              <span className="opacity-60">
                Purchased: ${totalSpent.toFixed(0)} ({purchasedProgress}%)
              </span>
            </div>

            {/* If over budget or wanting to optimize, offer quick action */}
            {isOverBudget && onOptimizeBudget && (
              <button
                onClick={onOptimizeBudget}
                className="mt-3 w-full py-1.5 px-2 bg-[#C5A059] hover:bg-white text-black text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
              >
                <TrendingDown className="w-3 h-3" />
                <span>Auto-Align to $${targetBudget} Target</span>
              </button>
            )}
          </div>
        </div>

        {/* Dietary Considerations */}
        {profile.dietaryRestrictions && profile.dietaryRestrictions.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs border-t border-black/10 pt-3">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold opacity-50">
              Dietary Profile:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.dietaryRestrictions.map((diet, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-[#E8E6E1] text-[#1a1a1a] border border-black/15"
                >
                  ✓ {diet}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 mt-6 overflow-x-auto border-t-2 border-black pt-4 scrollbar-none">
          <button
            id="tab-shopping"
            onClick={() => onSelectTab('shopping')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase font-bold transition-all whitespace-nowrap border ${
              activeTab === 'shopping'
                ? 'bg-[#1a1a1a] text-white border-black shadow-xs'
                : 'bg-transparent text-black/70 hover:text-black hover:bg-[#E8E6E1] border-transparent'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Shopping Cart</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.2 font-mono ${
                activeTab === 'shopping'
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-black/10 text-black'
              }`}
            >
              {shoppingList.length}
            </span>
          </button>

          <button
            id="tab-instore"
            onClick={() => onSelectTab('instore')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase font-bold transition-all whitespace-nowrap border ${
              activeTab === 'instore'
                ? 'bg-[#1a1a1a] text-[#C5A059] border-black shadow-xs'
                : 'bg-transparent text-black/70 hover:text-black hover:bg-[#E8E6E1] border-transparent'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>In-Store Route</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.2 font-mono ${
                activeTab === 'instore'
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-black/10 text-black'
              }`}
            >
              {purchasedCount}/{shoppingList.length}
            </span>
          </button>

          <button
            id="tab-portions"
            onClick={() => onSelectTab('portions')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase font-bold transition-all whitespace-nowrap border ${
              activeTab === 'portions'
                ? 'bg-[#1a1a1a] text-white border-black shadow-xs'
                : 'bg-transparent text-black/70 hover:text-black hover:bg-[#E8E6E1] border-transparent'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Portion Math</span>
          </button>

          <button
            id="tab-timeline"
            onClick={() => onSelectTab('timeline')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase font-bold transition-all whitespace-nowrap border ${
              activeTab === 'timeline'
                ? 'bg-[#1a1a1a] text-white border-black shadow-xs'
                : 'bg-transparent text-black/70 hover:text-black hover:bg-[#E8E6E1] border-transparent'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Prep Timeline</span>
          </button>

          <button
            id="tab-menu"
            onClick={() => onSelectTab('menu')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase font-bold transition-all whitespace-nowrap border ${
              activeTab === 'menu'
                ? 'bg-[#1a1a1a] text-white border-black shadow-xs'
                : 'bg-transparent text-black/70 hover:text-black hover:bg-[#E8E6E1] border-transparent'
            }`}
          >
            <Wine className="w-3.5 h-3.5" />
            <span>Menu & Cocktails</span>
          </button>
        </div>
      </div>
    </div>
  );
};

