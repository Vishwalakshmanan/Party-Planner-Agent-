import React, { useState } from 'react';
import {
  Utensils,
  Wine,
  GlassWater,
  Sparkles,
  Calculator,
  Info,
  Beef,
  Cake,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import { PartyPlan, PortionGuideline } from '../types';

interface PortionCalculatorViewProps {
  currentPlan: PartyPlan;
  onApplyPortionScaling?: (adults: number, kids: number, hours: number, eaterStyle: 'moderate' | 'heavy') => void;
}

export const PortionCalculatorView: React.FC<PortionCalculatorViewProps> = ({
  currentPlan,
  onApplyPortionScaling,
}) => {
  const [adults, setAdults] = useState<number>(currentPlan.profile.adultsCount || 12);
  const [kids, setKids] = useState<number>(currentPlan.profile.kidsCount || 0);
  const [hours, setHours] = useState<number>(currentPlan.profile.durationHours || 4);
  const [eaterStyle, setEaterStyle] = useState<'moderate' | 'heavy'>('moderate');
  const [syncApplied, setSyncApplied] = useState<boolean>(false);

  const totalGuests = adults + kids;

  // Math formulas
  const meatPerAdult = eaterStyle === 'heavy' ? 0.65 : 0.5;
  const meatPerKid = 0.25;
  const totalMeatLbs = Math.round((adults * meatPerAdult + kids * meatPerKid) * 10) / 10;

  // Drinks math
  // Adults drink: 2 in 1st hr, 1 each hour after
  const drinksPerAdult = Math.max(2, 2 + (hours - 1));
  const totalAdultDrinks = adults * drinksPerAdult;

  // Split: 50% Beer, 30% Wine, 20% Cocktails/Spirits
  const beerCans = Math.round(totalAdultDrinks * 0.5);
  const wineBottles = Math.ceil((totalAdultDrinks * 0.3) / 5); // 5 glasses per bottle
  const liquorBottles = Math.ceil((totalAdultDrinks * 0.2) / 16); // 16 drinks per 750ml

  // Non alcoholic: 1 drink per person per 1.5 hrs
  const nonAlcoholicDrinks = Math.round(totalGuests * (hours / 1.5));

  // Ice: 1.5 lbs per person
  const iceLbs = Math.round(totalGuests * 1.5);
  const iceBags = Math.ceil(iceLbs / 10);

  // Appetizers (before meal: 4-5 bites; cocktail party: 12-14 bites)
  const isCocktailTheme = currentPlan.profile.eventType.toLowerCase().includes('cocktail');
  const bitesPerPerson = isCocktailTheme ? 12 : 5;
  const totalAppetizerBites = totalGuests * bitesPerPerson;

  // Tableware
  const platesNeeded = Math.ceil(totalGuests * 2);
  const napkinsNeeded = Math.ceil(totalGuests * 4);
  const cupsNeeded = Math.ceil(totalGuests * 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border-2 border-black p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">
              <Calculator className="w-3.5 h-3.5" />
              <span>Volume Calibration Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-serif tracking-tight text-[#1a1a1a]">
              Portion Mathematics & <span className="italic font-normal text-[#C5A059]">Bar Metrics</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl font-serif italic">
              Adjust guest ratios and gathering duration below to recalibrate exact butcher yields, beverage volume,
              ice chilling ratios, and tableware requirements.
            </p>
          </div>

          {/* Interactive Controls Card */}
          <div className="bg-[#FAF9F6] p-4 border border-black/20 shadow-xs flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-black/60">Adults</label>
              <div className="flex items-center space-x-1.5 mt-1">
                <button
                  onClick={() => setAdults(Math.max(2, adults - 2))}
                  className="w-6 h-6 bg-white hover:bg-black hover:text-white border border-black/20 font-bold text-xs transition-colors"
                >
                  -
                </button>
                <span className="font-serif italic font-bold text-base text-black min-w-[28px] text-center">
                  {adults}
                </span>
                <button
                  onClick={() => setAdults(adults + 2)}
                  className="w-6 h-6 bg-white hover:bg-black hover:text-white border border-black/20 font-bold text-xs transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-l border-black/10 pl-4">
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-black/60">Kids</label>
              <div className="flex items-center space-x-1.5 mt-1">
                <button
                  onClick={() => setKids(Math.max(0, kids - 1))}
                  className="w-6 h-6 bg-white hover:bg-black hover:text-white border border-black/20 font-bold text-xs transition-colors"
                >
                  -
                </button>
                <span className="font-serif italic font-bold text-base text-black min-w-[28px] text-center">
                  {kids}
                </span>
                <button
                  onClick={() => setKids(kids + 1)}
                  className="w-6 h-6 bg-white hover:bg-black hover:text-white border border-black/20 font-bold text-xs transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-l border-black/10 pl-4">
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-black/60">
                Duration
              </label>
              <div className="flex items-center space-x-1.5 mt-1">
                <button
                  onClick={() => setHours(Math.max(1, hours - 1))}
                  className="w-6 h-6 bg-white hover:bg-black hover:text-white border border-black/20 font-bold text-xs transition-colors"
                >
                  -
                </button>
                <span className="font-serif italic font-bold text-base text-black min-w-[32px] text-center">
                  {hours}h
                </span>
                <button
                  onClick={() => setHours(hours + 1)}
                  className="w-6 h-6 bg-white hover:bg-black hover:text-white border border-black/20 font-bold text-xs transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-l border-black/10 pl-4">
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-black/60">
                Appetite
              </label>
              <button
                onClick={() => setEaterStyle(eaterStyle === 'moderate' ? 'heavy' : 'moderate')}
                className="mt-1 px-2.5 py-1 bg-[#1a1a1a] hover:bg-[#C5A059] hover:text-black text-[#FAF9F6] font-bold text-[10px] uppercase tracking-wider transition-colors"
              >
                {eaterStyle}
              </button>
            </div>

            {onApplyPortionScaling && (
              <div className="w-full sm:w-auto pt-2 sm:pt-0 sm:border-l sm:border-black/10 sm:pl-4">
                <button
                  onClick={() => {
                    onApplyPortionScaling(adults, kids, hours, eaterStyle);
                    setSyncApplied(true);
                    setTimeout(() => setSyncApplied(false), 3000);
                  }}
                  className={`w-full sm:w-auto px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-all flex items-center justify-center space-x-1.5 border ${
                    syncApplied
                      ? 'bg-emerald-800 text-white border-emerald-900'
                      : 'bg-black hover:bg-[#C5A059] hover:text-black text-white border-black'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{syncApplied ? '✓ List Recalculated!' : 'Sync List & Recalculate'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Calculated Formula Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Protein Card */}
        <div className="bg-white border border-black/15 hover:border-black p-5 shadow-xs flex flex-col justify-between transition-all">
          <div>
            <div className="w-8 h-8 bg-[#1a1a1a] text-[#FAF9F6] flex items-center justify-center mb-3">
              <Beef className="w-4 h-4 text-[#C5A059]" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
              Total Meat & Protein
            </h3>
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1a1a1a] mt-1">
              {totalMeatLbs} <span className="text-sm font-sans uppercase font-bold text-black/40 not-italic">lbs</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-black/10 text-xs text-stone-600 space-y-1">
            <p>
              • <strong>{meatPerAdult} lb</strong> per adult ({adults * meatPerAdult} lbs)
            </p>
            <p>
              • <strong>{meatPerKid} lb</strong> per child ({kids * meatPerKid} lbs)
            </p>
            <p className="text-[10px] font-serif italic text-stone-400">Includes ~20% shrinkage buffer</p>
          </div>
        </div>

        {/* Bar & Alcohol Card */}
        <div className="bg-white border border-black/15 hover:border-black p-5 shadow-xs flex flex-col justify-between transition-all">
          <div>
            <div className="w-8 h-8 bg-[#1a1a1a] text-[#FAF9F6] flex items-center justify-center mb-3">
              <Wine className="w-4 h-4 text-[#C5A059]" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
              Alcohol Servings
            </h3>
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1a1a1a] mt-1">
              {totalAdultDrinks} <span className="text-sm font-sans uppercase font-bold text-black/40 not-italic">drinks</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-black/10 text-xs text-stone-600 space-y-1">
            <p>
              • <strong>{beerCans}</strong> Beer / Seltzer Cans
            </p>
            <p>
              • <strong>{wineBottles}</strong> Wine Bottles (750ml)
            </p>
            <p>
              • <strong>{liquorBottles}</strong> Liquor Bottles (750ml)
            </p>
          </div>
        </div>

        {/* Ice & Water Card */}
        <div className="bg-white border border-black/15 hover:border-black p-5 shadow-xs flex flex-col justify-between transition-all">
          <div>
            <div className="w-8 h-8 bg-[#1a1a1a] text-[#FAF9F6] flex items-center justify-center mb-3">
              <GlassWater className="w-4 h-4 text-[#C5A059]" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
              Ice & Hydration
            </h3>
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1a1a1a] mt-1">
              {iceLbs} <span className="text-sm font-sans uppercase font-bold text-black/40 not-italic">lbs ice</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-black/10 text-xs text-stone-600 space-y-1">
            <p>
              • <strong>{iceBags} large bags</strong> (10-12 lbs each)
            </p>
            <p>
              • <strong>{nonAlcoholicDrinks}</strong> Sodas / Mocktails / Cans
            </p>
            <p className="text-[10px] font-serif italic text-stone-400">1 cooler bath bag + cup service</p>
          </div>
        </div>

        {/* Tableware Card */}
        <div className="bg-white border border-black/15 hover:border-black p-5 shadow-xs flex flex-col justify-between transition-all">
          <div>
            <div className="w-8 h-8 bg-[#1a1a1a] text-[#FAF9F6] flex items-center justify-center mb-3">
              <PackageCheck className="w-4 h-4 text-[#C5A059]" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
              Tableware & Disposables
            </h3>
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1a1a1a] mt-1">
              {platesNeeded} <span className="text-sm font-sans uppercase font-bold text-black/40 not-italic">plates</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-black/10 text-xs text-stone-600 space-y-1">
            <p>
              • <strong>{napkinsNeeded}</strong> Linen-feel Napkins
            </p>
            <p>
              • <strong>{cupsNeeded}</strong> Beverage Glasses / Cups
            </p>
            <p>
              • <strong>{Math.ceil(totalGuests / 10)}</strong> Heavy 30-gal Bags
            </p>
          </div>
        </div>
      </div>

      {/* Plan-Specific Custom Guidelines */}
      {currentPlan.portionGuidelines && currentPlan.portionGuidelines.length > 0 && (
        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2 mb-4 border-b border-black/10 pb-3">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-base font-serif font-bold text-[#1a1a1a]">
              Tailored Event Metrics — {currentPlan.profile.theme}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPlan.portionGuidelines.map((g, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F6] p-4 border border-black/15 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black">{g.metric}</h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C6D2B] bg-[#C5A059]/15 border border-[#C5A059]/30 px-2 py-0.5">
                      {g.category}
                    </span>
                  </div>
                  <div className="text-base font-serif font-bold italic text-black mt-1">
                    {g.recommendedAmount}
                  </div>
                </div>
                <p className="text-xs font-serif italic text-stone-600 mt-2 pt-2 border-t border-black/10">
                  <span className="not-italic font-sans text-[10px] uppercase font-bold text-black/60 mr-1">Formula Basis:</span>
                  {g.calculationBasis}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

