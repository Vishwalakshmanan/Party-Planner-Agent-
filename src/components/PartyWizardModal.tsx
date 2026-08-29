import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Users,
  Clock,
  DollarSign,
  MapPin,
  Utensils,
  Check,
  Loader2,
  Calendar,
} from 'lucide-react';
import { BudgetTier, PartyProfile, VenueType } from '../types';

interface PartyWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGeneratePlan: (profile: PartyProfile) => Promise<void>;
}

export const PartyWizardModal: React.FC<PartyWizardModalProps> = ({
  isOpen,
  onClose,
  onGeneratePlan,
}) => {
  const [title, setTitle] = useState<string>('Weekend Celebration Gathering');
  const [eventType, setEventType] = useState<string>('Casual Gathering / Birthday');
  const [theme, setTheme] = useState<string>('Mediterranean Mezze & Sangria');
  const [adultsCount, setAdultsCount] = useState<number>(14);
  const [kidsCount, setKidsCount] = useState<number>(2);
  const [durationHours, setDurationHours] = useState<number>(4);
  const [targetBudget, setTargetBudget] = useState<number>(350);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('balanced');
  const [venueType, setVenueType] = useState<VenueType>('backyard');
  const [dietary, setDietary] = useState<string[]>(['Vegetarian friendly']);
  const [amenities, setAmenities] = useState<string[]>(['Grill', 'Refrigerator/Freezer']);
  const [vibeNotes, setVibeNotes] = useState<string>(
    'Easy self-serve grazing, lively playlist, signature chilled cocktail'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const dietaryOptions = [
    'Vegetarian friendly',
    'Vegan options',
    'Gluten-Free options',
    'Dairy-Free options',
    'Nut-Free / Allergy Safe',
    'Halal options',
    'Kosher options',
  ];

  const amenityOptions = [
    'Grill',
    'Full Kitchen',
    'Refrigerator/Freezer',
    'Oven',
    'Microwave',
    'Ice Machine',
    'Coolers / Ice Chests',
  ];

  const toggleDietary = (opt: string) => {
    if (dietary.includes(opt)) {
      setDietary(dietary.filter((d) => d !== opt));
    } else {
      setDietary([...dietary, opt]);
    }
  };

  const toggleAmenity = (opt: string) => {
    if (amenities.includes(opt)) {
      setAmenities(amenities.filter((a) => a !== opt));
    } else {
      setAmenities([...amenities, opt]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    const profile: PartyProfile = {
      id: `plan_${Date.now()}`,
      title: title.trim() || 'Custom Party Plan',
      eventType,
      theme: theme.trim() || 'Festive Gathering',
      adultsCount: Math.max(1, adultsCount),
      kidsCount: Math.max(0, kidsCount),
      durationHours: Math.max(1, durationHours),
      targetBudget: Math.max(50, targetBudget),
      budgetTier,
      dietaryRestrictions: dietary,
      venueType,
      kitchenAmenities: amenities,
      vibeNotes: vibeNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    setIsGenerating(true);
    try {
      await onGeneratePlan(profile);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-black animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black text-[#C5A059] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[#1a1a1a] tracking-tight">
                Curate Event Blueprint
              </h3>
              <p className="text-[10px] uppercase font-mono tracking-wider text-black/50">
                AI Agent calculates exact portions, menus, timelines, and provision lists
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 text-black/40 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 py-4 space-y-5 pr-1">
          {/* Party Title & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">Event Designation</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midsummer Rooftop Soirée"
                className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black font-serif italic text-black"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
                Event Category
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black font-serif text-black"
              >
                <option value="Birthday / Casual Gathering">Birthday Celebration</option>
                <option value="Cookout / Backyard BBQ">Backyard BBQ / Cookout</option>
                <option value="Cocktail Soirée / Wine Night">Cocktail Soirée / Wine Night</option>
                <option value="Game Night / Casual Buffet">Game Night / Pizza Buffet</option>
                <option value="Dinner Party / Gourmet Tasting">Sit-Down Dinner Party</option>
                <option value="Baby / Bridal Shower">Baby / Bridal Shower</option>
                <option value="Kids Themed Birthday">Kids Themed Birthday</option>
                <option value="Holiday / Seasonal Gathering">Holiday / Seasonal Celebration</option>
                <option value="Custom Party">Custom Gathering</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
              Culinary Motif / Aesthetic Direction
            </label>
            <input
              type="text"
              required
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. Coastal Mezze & Chilled Sangria, Tuscan Harvest, Street Tacos & Margaritas"
              className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black font-serif italic text-black"
            />
          </div>

          {/* Headcount, Duration & Budget */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF9F6] p-4 border border-black/15">
            <div>
              <label className="block text-[9px] font-bold text-black/60 uppercase tracking-wider">
                Adults (18+)
              </label>
              <input
                type="number"
                min="1"
                max="200"
                required
                value={adultsCount}
                onChange={(e) => setAdultsCount(parseInt(e.target.value) || 1)}
                className="w-full mt-1 px-3 py-1.5 text-sm font-bold bg-white border border-black/20 text-black font-mono"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-black/60 uppercase tracking-wider">Kids / Youths</label>
              <input
                type="number"
                min="0"
                max="100"
                value={kidsCount}
                onChange={(e) => setKidsCount(parseInt(e.target.value) || 0)}
                className="w-full mt-1 px-3 py-1.5 text-sm font-bold bg-white border border-black/20 text-black font-mono"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-black/60 uppercase tracking-wider">
                Duration (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={durationHours}
                onChange={(e) => setDurationHours(parseInt(e.target.value) || 1)}
                className="w-full mt-1 px-3 py-1.5 text-sm font-bold bg-white border border-black/20 text-black font-mono"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-black/60 uppercase tracking-wider">
                Budget Target ($)
              </label>
              <input
                type="number"
                min="50"
                step="25"
                required
                value={targetBudget}
                onChange={(e) => setTargetBudget(parseInt(e.target.value) || 50)}
                className="w-full mt-1 px-3 py-1.5 text-sm font-bold bg-white border border-black/20 text-[#8C6D2B] font-mono"
              />
            </div>
          </div>

          {/* Budget Tier & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">Sourcing Tier</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['budget', 'balanced', 'premium'] as BudgetTier[]).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setBudgetTier(tier)}
                    className={`py-2 px-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                      budgetTier === tier
                        ? 'bg-black text-[#FAF9F6] border-black shadow-xs'
                        : 'bg-[#FAF9F6] text-black/70 border-black/20 hover:bg-black hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1.5">Setting / Venue</label>
              <select
                value={venueType}
                onChange={(e) => setVenueType(e.target.value as VenueType)}
                className="w-full px-3.5 py-2 text-xs font-serif bg-[#FAF9F6] border border-black/20"
              >
                <option value="backyard">Backyard Garden / Patio</option>
                <option value="indoor_home">Indoor Residence / Dining Salon</option>
                <option value="park">Public Park / Outdoor Pavilion</option>
                <option value="rented_venue">Rented Event Gallery / Club Room</option>
                <option value="beach">Beach / Waterfront</option>
                <option value="office">Studio / Workplace</option>
              </select>
            </div>
          </div>

          {/* Dietary Restrictions Checkboxes */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-2">
              Dietary Inclusivity & Safeguards
            </label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((opt) => {
                const isSelected = dietary.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleDietary(opt)}
                    className={`px-3 py-1.5 text-xs font-serif flex items-center space-x-1.5 transition-all border ${
                      isSelected
                        ? 'bg-black text-[#FAF9F6] border-black shadow-2xs'
                        : 'bg-[#FAF9F6] text-stone-700 border-black/15 hover:border-black'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A059] stroke-[3]" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kitchen Amenities */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-2">
              Culinary Gear & Refrigeration Facilities
            </label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((opt) => {
                const isSelected = amenities.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleAmenity(opt)}
                    className={`px-3 py-1.5 text-xs font-serif flex items-center space-x-1.5 transition-all border ${
                      isSelected
                        ? 'bg-[#C5A059] text-black border-[#C5A059] font-semibold'
                        : 'bg-[#FAF9F6] text-stone-700 border-black/15 hover:border-black'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vibe / Special Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 mb-1">
              Curatorial Atmosphere & Special Directives
            </label>
            <textarea
              rows={2}
              value={vibeNotes}
              onChange={(e) => setVibeNotes(e.target.value)}
              placeholder="e.g. Effortless self-serve grazing, ambient vinyl playlist, chilled sparkling aperitifs..."
              className="w-full px-3.5 py-2 text-xs bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black font-serif italic text-black"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 px-6 bg-black hover:bg-[#C5A059] hover:text-black text-white font-bold text-xs uppercase tracking-[0.2em] border-2 border-black flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                  <span>Synthesizing Curated Blueprint & Sourcing Schedule...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Generate Complete Gathering Blueprint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

