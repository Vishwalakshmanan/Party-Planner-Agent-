import { ChatAgentAction, ChatAgentResponse, ItemAlternative, PartyPlan, PartyProfile, ShoppingItem } from '../types';
import { PRESET_PARTIES } from '../data/presetParties';

export async function generatePartyPlanApi(profile: PartyProfile): Promise<PartyPlan> {
  try {
    const res = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('API call failed, generating localized party plan:', err);
    return generateFallbackPlan(profile);
  }
}

export async function sendAgentChatMessage(
  message: string,
  currentPlan: PartyPlan,
  history: any[] = []
): Promise<ChatAgentResponse> {
  try {
    const res = await fetch('/api/chat-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, currentPlan, history }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    const data = await res.json();
    return {
      reply: data.reply || `I'm here to help you coordinate your ${currentPlan.profile.title || 'party'} at CymbalMart!`,
      spokenReply: data.spokenReply || data.reply?.replace(/[*#_`]/g, '').slice(0, 150) || 'Done.',
      action: data.action || null,
    };
  } catch (err: any) {
    console.warn('CymbalMart Assistant chat fallback response triggered:', err);
    return generateFallbackChatResponse(message, currentPlan);
  }
}

export async function fetchItemSubstitutions(
  item: ShoppingItem,
  partyTheme: string,
  budgetTier: string
): Promise<ItemAlternative[]> {
  try {
    const res = await fetch('/api/suggest-substitutions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, partyTheme, budgetTier }),
    });

    if (!res.ok) throw new Error('Failed to fetch substitutions');
    const data = await res.json();
    return data.alternatives || [];
  } catch (err) {
    console.warn('Using fallback substitutions:', err);
    return [
      {
        name: `Store-Brand / Bulk ${item.name}`,
        estimatedPrice: Number((item.estimatedPrice * 0.75).toFixed(2)),
        savings: Number((item.estimatedPrice * 0.25).toFixed(2)),
        reason: 'Swapping to supermarket store-brand or bulk packaging saves ~25% with comparable quality.',
      },
      {
        name: `Alternative ${item.subcategory} Selection`,
        estimatedPrice: Number((item.estimatedPrice * 0.85).toFixed(2)),
        savings: Number((item.estimatedPrice * 0.15).toFixed(2)),
        reason: 'Slightly lighter portion or seasonal produce substitution.',
      },
    ];
  }
}

// Resilient fallback party generator
function generateFallbackPlan(profile: PartyProfile): PartyPlan {
  const totalGuests = (profile.adultsCount || 10) + (profile.kidsCount || 0);
  const isBudget = profile.budgetTier === 'budget';
  const multiplier = totalGuests / 15;

  const meatLbs = Math.ceil(profile.adultsCount * 0.5 + (profile.kidsCount || 0) * 0.25);
  const drinkServings = profile.adultsCount * Math.max(2, profile.durationHours);
  const iceBags = Math.max(2, Math.ceil(totalGuests * 0.18));

  const items: ShoppingItem[] = [
    {
      id: `item_${Date.now()}_1`,
      name: `${profile.theme} Signature Protein / Main Dishes`,
      category: 'food_fresh',
      subcategory: 'Proteins',
      quantity: meatLbs,
      unit: 'lbs',
      portionExplanation: `0.5 lb/adult (${profile.adultsCount} adults) + 0.25 lb/kid (${profile.kidsCount || 0} kids)`,
      estimatedPrice: Number((meatLbs * (isBudget ? 3.8 : 5.2)).toFixed(2)),
      unitPrice: isBudget ? 3.8 : 5.2,
      suggestedStore: 'Costco / Wholesale',
      aisle: 'Meat & Poultry',
      isPurchased: false,
      priority: 'must-have',
    },
    {
      id: `item_${Date.now()}_2`,
      name: 'Fresh Seasoned Salad & Side Dishes',
      category: 'food_fresh',
      subcategory: 'Produce & Deli',
      quantity: Math.ceil(multiplier * 2),
      unit: 'large platters',
      portionExplanation: '4 oz side portion per guest',
      estimatedPrice: Number((multiplier * 16.5).toFixed(2)),
      unitPrice: 16.5,
      suggestedStore: 'Supermarket / Grocery',
      aisle: 'Deli & Prepared',
      isPurchased: false,
      priority: 'must-have',
    },
    {
      id: `item_${Date.now()}_3`,
      name: 'Appetizers & Finger Food Grazing Platter',
      category: 'food_fresh',
      subcategory: 'Appetizers',
      quantity: Math.ceil(totalGuests * 3),
      unit: 'pieces/bites',
      portionExplanation: '3 appetizer bites per guest before main course',
      estimatedPrice: Number((totalGuests * 1.8).toFixed(2)),
      unitPrice: 1.8,
      suggestedStore: 'Trader Joe’s',
      aisle: 'Appetizers & Snacks',
      isPurchased: false,
      priority: 'must-have',
    },
    {
      id: `item_${Date.now()}_4`,
      name: 'Artisan Bread / Buns & Dips Assortment',
      category: 'food_fresh',
      subcategory: 'Bakery',
      quantity: Math.ceil(totalGuests * 1.5),
      unit: 'rolls/pieces',
      portionExplanation: '1.5 rolls per guest',
      estimatedPrice: Number((multiplier * 12).toFixed(2)),
      unitPrice: 12,
      suggestedStore: 'Supermarket / Grocery',
      aisle: 'Bakery',
      isPurchased: false,
      priority: 'must-have',
    },
    {
      id: `item_${Date.now()}_5`,
      name: 'Celebration Dessert / Mini Pastry Bites',
      category: 'food_fresh',
      subcategory: 'Dessert',
      quantity: Math.ceil(totalGuests * 2),
      unit: 'servings',
      portionExplanation: '2 sweet dessert portions per person',
      estimatedPrice: Number((totalGuests * 1.5).toFixed(2)),
      unitPrice: 1.5,
      suggestedStore: 'Supermarket / Grocery',
      aisle: 'Bakery / Desserts',
      isPurchased: false,
      priority: 'recommended',
    },
    {
      id: `item_${Date.now()}_6`,
      name: 'Craft Beer, Wine & Hard Seltzers (Variety Pack)',
      category: 'beverages_bar',
      subcategory: 'Alcohol',
      quantity: Math.ceil(profile.adultsCount * 2.5),
      unit: 'cans/glasses',
      portionExplanation: '2.5 drinks per adult across event duration',
      estimatedPrice: Number((profile.adultsCount * 4.2).toFixed(2)),
      unitPrice: 4.2,
      suggestedStore: 'Costco / Wholesale',
      aisle: 'Beer & Wine',
      isPurchased: false,
      priority: 'must-have',
    },
    {
      id: `item_${Date.now()}_7`,
      name: 'Signature Mocktail / Sparkling Sodas & Juices',
      category: 'beverages_bar',
      subcategory: 'Non-Alcoholic',
      quantity: Math.ceil(totalGuests * 1.5),
      unit: 'cans/bottles',
      portionExplanation: 'Hydration for kids and non-alcoholic guests',
      estimatedPrice: Number((totalGuests * 1.25).toFixed(2)),
      unitPrice: 1.25,
      suggestedStore: 'Supermarket / Grocery',
      aisle: 'Beverages',
      isPurchased: false,
      priority: 'must-have',
    },
    {
      id: `item_${Date.now()}_8`,
      name: 'Party Ice Bags (10-12 lbs each)',
      category: 'beverages_bar',
      subcategory: 'Ice & Cooling',
      quantity: iceBags,
      unit: 'bags',
      portionExplanation: '1.5 lbs of ice per person for drinks + cooler chilling',
      estimatedPrice: Number((iceBags * 2.99).toFixed(2)),
      unitPrice: 2.99,
      suggestedStore: 'Supermarket / Grocery',
      aisle: 'Front Freezer',
      isPurchased: false,
      priority: 'must-have',
    },
    {
      id: `item_${Date.now()}_9`,
      name: 'Thematic Banners, Balloons & Table Runner',
      category: 'decor_atmosphere',
      subcategory: 'Theme Decor',
      quantity: 1,
      unit: 'set',
      portionExplanation: 'Creates focal point at buffet and entry area',
      estimatedPrice: isBudget ? 18.0 : 28.5,
      unitPrice: isBudget ? 18.0 : 28.5,
      suggestedStore: 'Party Store / Amazon',
      aisle: 'Party Decor',
      isPurchased: false,
      priority: 'recommended',
    },
    {
      id: `item_${Date.now()}_10`,
      name: 'Heavy-Duty Plates & Cutlery Kit (50-pack)',
      category: 'tableware_disposables',
      subcategory: 'Plates & Cutlery',
      quantity: Math.ceil(totalGuests / 25),
      unit: 'packs',
      portionExplanation: '2 sturdy plates per guest (main + dessert)',
      estimatedPrice: Number((Math.ceil(totalGuests / 25) * 14.99).toFixed(2)),
      unitPrice: 14.99,
      suggestedStore: 'Costco / Wholesale',
      aisle: 'Paper Goods',
      isPurchased: false,
      priority: 'must-have',
    },
    {
      id: `item_${Date.now()}_11`,
      name: 'Party Cups & Cocktail Napkins (100ct)',
      category: 'tableware_disposables',
      subcategory: 'Cups & Napkins',
      quantity: 1,
      unit: 'pack',
      portionExplanation: '3-4 napkins per guest + cups with Sharpie marker',
      estimatedPrice: 9.99,
      unitPrice: 9.99,
      suggestedStore: 'Supermarket / Grocery',
      aisle: 'Paper Goods',
      isPurchased: false,
      priority: 'must-have',
    },
    {
      id: `item_${Date.now()}_12`,
      name: 'Heavy Trash Liners & Sanitizing Wipes',
      category: 'logistics_essentials',
      subcategory: 'Cleanup & Disposal',
      quantity: 1,
      unit: 'pack',
      portionExplanation: 'Easy station for fast party cleanup',
      estimatedPrice: 7.99,
      unitPrice: 7.99,
      suggestedStore: 'Supermarket / Grocery',
      aisle: 'Household Cleaners',
      isPurchased: false,
      priority: 'must-have',
    },
  ];

  let foodEstimated = 0;
  let beveragesEstimated = 0;
  let decorEstimated = 0;
  let tablewareEstimated = 0;
  let logisticsEstimated = 0;

  for (const item of items) {
    if (item.category === 'food_fresh') foodEstimated += item.estimatedPrice;
    else if (item.category === 'beverages_bar') beveragesEstimated += item.estimatedPrice;
    else if (item.category === 'decor_atmosphere') decorEstimated += item.estimatedPrice;
    else if (item.category === 'tableware_disposables') tablewareEstimated += item.estimatedPrice;
    else logisticsEstimated += item.estimatedPrice;
  }

  const totalEstimated =
    foodEstimated + beveragesEstimated + decorEstimated + tablewareEstimated + logisticsEstimated;

  return {
    profile,
    shoppingList: items,
    menuHighlights: [
      {
        course: 'Main',
        dish: `Signature ${profile.theme} Feast`,
        tags: ['Crowd Favorite', 'High Protein'],
        description: 'Seasoned main course tailored for generous crowd-pleasing portions.',
      },
      {
        course: 'Side',
        dish: 'Garden Harvest Salad & Warm Bread Basket',
        tags: ['Vegetarian', 'Fresh'],
        description: 'Crisp greens with house vinaigrette and warm buttered bread.',
      },
      {
        course: 'Dessert',
        dish: 'Bite-Sized Celebration Dessert Duo',
        tags: ['Sweet', 'Easy Grazing'],
        description: 'Delightful bite-sized treats to finish the event on a high note.',
      },
    ],
    portionGuidelines: [
      {
        metric: 'Main Protein',
        recommendedAmount: `${meatLbs} lbs total`,
        calculationBasis: '0.5 lb cooked meat per adult + 0.25 lb per child',
        category: 'food',
      },
      {
        metric: 'Total Beverages',
        recommendedAmount: `${drinkServings} drink servings`,
        calculationBasis: '2 drinks 1st hour + 1 drink each subsequent hour',
        category: 'drink',
      },
      {
        metric: 'Ice Supply',
        recommendedAmount: `${iceBags * 10} lbs (${iceBags} bags)`,
        calculationBasis: '1.5-2 lbs ice per person for drinks and ice cooler baths',
        category: 'drink',
      },
      {
        metric: 'Tableware Units',
        recommendedAmount: `${totalGuests * 2} plates, ${totalGuests * 3} napkins`,
        calculationBasis: '2 plates per guest (main + dessert) and 3-4 napkins per guest',
        category: 'supplies',
      },
    ],
    signatureDrink: {
      name: `${profile.theme} Sunset Punch`,
      description: 'Refreshing citrus punch with sparkling bubbles and fresh fruit garnish.',
      ingredients: ['Fruit Juice Medley', 'Club Soda / Ginger Ale', 'Fresh Mint & Citrus Slices'],
      isAlcoholic: false,
      prepTip: 'Mix juice base in a drink dispenser; keep sparkling soda on ice for instant effervescence.',
    },
    budgetBreakdown: {
      foodEstimated: Number(foodEstimated.toFixed(2)),
      beveragesEstimated: Number(beveragesEstimated.toFixed(2)),
      decorEstimated: Number(decorEstimated.toFixed(2)),
      tablewareEstimated: Number(tablewareEstimated.toFixed(2)),
      logisticsEstimated: Number(logisticsEstimated.toFixed(2)),
      totalEstimated: Number(totalEstimated.toFixed(2)),
      budgetRemaining: Math.max(0, Number((profile.targetBudget - totalEstimated).toFixed(2))),
    },
    smartTips: [
      'Write guest names on drink cups with a metallic marker to cut down on half-drunk abandoned cups by 50%.',
      'Batch cocktail/mocktail bases in large pitchers or dispensers 2-3 hours in advance so you can enjoy hosting.',
      'Set out ice in two separate containers: one for cooling bottled cans, and one with a dedicated scoop for clean drinking glasses.',
      'Organize food in a linear buffet line with napkins & cutlery at the END so guests aren’t fumbling with forks while scooping.',
    ],
    timeline: [
      {
        id: 'task_1',
        timeframe: '3_days_before',
        task: 'Purchase dry goods, canned sodas, beer/wine, paper tableware, and decorations.',
        category: 'shopping',
        completed: false,
      },
      {
        id: 'task_2',
        timeframe: '1_day_before',
        task: 'Buy fresh meats & produce. Marinate proteins and batch sauces or salad dressings.',
        category: 'prep',
        completed: false,
      },
      {
        id: 'task_3',
        timeframe: 'morning_of',
        task: 'Pick up ice bags. Hang banners, set out table runners, and assemble serving ware.',
        category: 'decor',
        completed: false,
      },
      {
        id: 'task_4',
        timeframe: '2_hours_before',
        task: 'Chill drinks in coolers with ice. Warm main dishes, slice lemons/limes, and queue music playlist.',
        category: 'prep',
        completed: false,
      },
      {
        id: 'task_5',
        timeframe: 'during_party',
        task: 'Greet guests, pour signature welcome punch, and enjoy your celebration!',
        category: 'hosting',
        completed: false,
      },
    ],
  };
}

function generateFallbackChatResponse(query: string, currentPlan: PartyPlan): ChatAgentResponse {
  const lower = query.toLowerCase();

  // Voice action detection for offline / local mode
  if (lower.startsWith('add ') || lower.includes('add to list') || lower.includes('add ')) {
    const rawItem = query.replace(/^(please |could you |can you )?add /i, '').replace(/ to (my |the )?shopping list/i, '').trim();
    if (rawItem) {
      return {
        reply: `✅ **Added to Shopping List**: "${rawItem}". I've appended this item and recalculated your budget.`,
        spokenReply: `Added ${rawItem} to your shopping list and updated your budget.`,
        action: {
          type: 'add_item',
          item: {
            name: rawItem.charAt(0).toUpperCase() + rawItem.slice(1),
            category: 'food_fresh',
            quantity: 1,
            unit: 'unit',
            estimatedPrice: 8.99,
            aisle: 'Grocery / General',
            priority: 'recommended',
          },
        },
      };
    }
  }

  if (lower.includes('checkout') || lower.includes('pay') || lower.includes('place order')) {
    return {
      reply: `🛒 **Opening Checkout**: Ready to review your sourcing routes and finalize your CymbalMart shopping order.`,
      spokenReply: `Opening checkout and pickup pass for your order.`,
      action: { type: 'open_checkout' },
    };
  }

  if (lower.includes('in-store') || lower.includes('store mode') || lower.includes('aisle mode')) {
    return {
      reply: `🚶 **In-Store Shopping View**: Switched to aisle-by-aisle mobile shopping view.`,
      spokenReply: `Switched to in-store aisle shopping mode.`,
      action: { type: 'toggle_in_store' },
    };
  }

  if (lower.includes('portion') || lower.includes('calculator') || lower.includes('how much food')) {
    return {
      reply: `⚖️ **Portion Calculator**: Navigating to the culinary portion blueprint.`,
      spokenReply: `Opening the portion calculator.`,
      action: { type: 'navigate', tab: 'portions' },
    };
  }

  if (lower.includes('timeline') || lower.includes('schedule') || lower.includes('prep plan')) {
    return {
      reply: `⏱️ **Prep Timeline**: Here is your schedule countdown for prep, shopping, and hosting.`,
      spokenReply: `Navigating to prep timeline.`,
      action: { type: 'navigate', tab: 'timeline' },
    };
  }

  if (lower.includes('menu') || lower.includes('dish') || lower.includes('recipes')) {
    return {
      reply: `🍽️ **Menu Highlights**: Viewing signature dishes and cocktail recipe cards.`,
      spokenReply: `Showing your party menu and signature drink.`,
      action: { type: 'navigate', tab: 'menu' },
    };
  }

  if (lower.includes('budget') || lower.includes('cut') || lower.includes('save') || lower.includes('cheap')) {
    return {
      reply: `### 💡 CymbalMart Budget-Cutting Recommendations:
1. **Swap to Wholesale Store-Brands**: Buying generic/Costco brands for paper goods and basic mixers saves **~$15-$25** immediately.
2. **Batch Signature Punch over Full Open Bar**: A dedicated signature cocktail/mocktail punch dispenser reduces individual spirit bottle variety costs by **~$35-$50**.
3. **Bulk Protein Preparation**: Opting for slow-cooked shredded meats (pork shoulder/chicken thighs) costs **~$3.50/lb** vs premium steaks/burgers at **~$8-$12/lb**, saving over **$40** for 15+ guests.`,
      spokenReply: `Here are 3 ways to save: switch to store brands for paper goods, batch a signature punch, and buy bulk protein.`,
      action: { type: 'optimize_budget' },
    };
  }

  if (lower.includes('ice') || lower.includes('drink')) {
    const adults = currentPlan.profile.adultsCount || 12;
    const hours = currentPlan.profile.durationHours || 4;
    return {
      reply: `### 🧊 Drink & Ice Portion Formula:
- **Ice Requirement**: Calculate **1.5 lbs of ice per person** (${Math.ceil(adults * 1.5)} lbs total = **${Math.ceil((adults * 1.5) / 10)} large 10lb bags**). One bag for the drink cooler bath and two clean bags for drinking glasses.
- **Beverage Volume**: For a ${hours}-hour party, plan on **${adults * Math.max(3, hours)} total drinks** (2 drinks the first hour, 1 drink each hour after).`,
      spokenReply: `For ${adults} guests, you need ${Math.ceil(adults * 1.5)} pounds of ice and about ${adults * Math.max(3, hours)} drinks total.`,
    };
  }

  if (lower.includes('gluten') || lower.includes('vegan') || lower.includes('dietary')) {
    return {
      reply: `### 🥗 Dietary Inclusivity Tips:
- **Gluten-Free**: Provide corn tortillas or GF crackers in a clearly labeled separate basket.
- **Vegan/Dairy-Free**: Keep cheeses, dressings, and dips on the side rather than pre-mixed into salads or main dishes.
- **Allergy Safety**: Mark distinct serving spoons for allergen-friendly dishes to prevent cross-contamination.`,
      spokenReply: `Keep cheeses and sauces on the side, offer gluten-free crackers, and label allergen-free spoons.`,
    };
  }

  return {
    reply: `Here are recommendations from **CymbalMart Assistant** for **${currentPlan.profile.title}**:
- You currently have **${currentPlan.shoppingList.length} items** in your shopping plan with an estimated total of **$${currentPlan.budgetBreakdown.totalEstimated}** against your **$${currentPlan.profile.targetBudget}** budget.
- **Pro Shopping Tip**: Group your shopping into two waves: Wave 1 (3 days out) for shelf-stable goods, liquor, and decor; Wave 2 (morning before) for fresh meats, produce, and fresh ice bags.`,
    spokenReply: `You have ${currentPlan.shoppingList.length} items totalling $${currentPlan.budgetBreakdown.totalEstimated}. You are on track for your budget!`,
  };
}
