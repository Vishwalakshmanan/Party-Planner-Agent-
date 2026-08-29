import React from 'react';
import {
  Wine,
  Utensils,
  Sparkles,
  GlassWater,
  CheckCircle2,
  Lightbulb,
  Tag,
  ChefHat,
  Flame,
} from 'lucide-react';
import { PartyPlan } from '../types';

interface MenuAndCocktailsTabProps {
  currentPlan: PartyPlan;
}

export const MenuAndCocktailsTab: React.FC<MenuAndCocktailsTabProps> = ({ currentPlan }) => {
  const { menuHighlights, signatureDrink, smartTips, profile } = currentPlan;

  const courseColors: Record<string, string> = {
    Appetizer: 'bg-black text-[#FAF9F6] border-black',
    Main: 'bg-[#C5A059] text-black border-[#C5A059]',
    Side: 'bg-[#FAF9F6] text-black border-black/30',
    Dessert: 'bg-black/10 text-black border-black/20',
    Beverage: 'bg-[#C5A059]/20 text-[#8C6D2B] border-[#C5A059]/40',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Signature Cocktail / Mocktail Spotlight */}
      {signatureDrink && (
        <div className="bg-[#1a1a1a] border-2 border-black p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] mb-2">
              <Wine className="w-3.5 h-3.5" />
              <span>Signature Beverage Spotlight</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-light font-serif tracking-tight text-white">
              {signatureDrink.name}
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-2 font-serif italic leading-relaxed">
              {signatureDrink.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/15">
              {/* Ingredients */}
              <div className="bg-[#242424] p-4 border border-white/10">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">
                  Key Ingredients & Proportions
                </h4>
                <ul className="space-y-1.5 text-xs text-white/90 font-serif">
                  {signatureDrink.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-[#C5A059]" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Host Batching Tip & Mocktail Option */}
              <div className="space-y-3">
                <div className="bg-[#242424] p-4 border border-white/10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Batching Protocol
                  </h4>
                  <p className="text-xs text-white/80 font-serif italic leading-relaxed">{signatureDrink.prepTip}</p>
                </div>

                {signatureDrink.mocktailAlternative && (
                  <div className="bg-black/40 p-3 border border-white/15 text-xs font-serif">
                    <strong className="text-[#C5A059] font-sans text-[10px] uppercase tracking-wider block mb-0.5">Temperance Alternative:</strong>
                    <span className="text-white/90 italic">{signatureDrink.mocktailAlternative}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Courses Grid */}
      <div>
        <div className="flex items-center space-x-2 mb-4 border-b border-black/10 pb-3">
          <ChefHat className="w-4 h-4 text-[#C5A059]" />
          <h3 className="text-base font-serif font-bold text-[#1a1a1a] tracking-tight">
            Curated Menu & Courses — {profile.theme}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuHighlights.map((menu, idx) => {
            const courseColor = courseColors[menu.course] || courseColors['Main'];

            return (
              <div
                key={idx}
                className="bg-white p-5 border border-black/15 hover:border-black shadow-xs flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 border ${courseColor}`}
                    >
                      {menu.course}
                    </span>

                    <div className="flex flex-wrap gap-1">
                      {menu.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] px-2 py-0.5 bg-[#FAF9F6] text-black/60 border border-black/10 uppercase tracking-wider font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h4 className="text-lg font-serif font-bold text-[#1a1a1a]">{menu.dish}</h4>
                  <p className="text-xs font-serif italic text-stone-600 mt-2 leading-relaxed">{menu.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Host Tips Deck */}
      {smartTips && smartTips.length > 0 && (
        <div className="bg-white border-2 border-black p-6 sm:p-8">
          <div className="flex items-center space-x-2 mb-4 border-b border-black/10 pb-3">
            <Lightbulb className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-base font-serif font-bold text-[#1a1a1a]">
              Host Etiquette & Operational Insights
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {smartTips.map((tip, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F6] p-4 border border-black/10 flex items-start space-x-3"
              >
                <div className="w-5 h-5 bg-black text-[#C5A059] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs font-serif italic text-stone-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

