import { PartyPlan } from '../types';

export const PRESET_PARTIES: Record<string, PartyPlan> = {
  fiesta_taco_bar: {
    profile: {
      id: 'plan_fiesta_01',
      title: "Summer Taco Bar & Margarita Fiesta",
      eventType: "Birthday / Casual Gathering",
      theme: "Vibrant Mexican Fiesta",
      adultsCount: 16,
      kidsCount: 4,
      durationHours: 4,
      targetBudget: 320,
      budgetTier: 'balanced',
      dietaryRestrictions: ["Gluten-Free options", "Vegetarian friendly"],
      venueType: "backyard",
      kitchenAmenities: ["Grill", "Full Kitchen", "Refrigerator/Freezer"],
      vibeNotes: "Festive, colorful papel picado, easy self-serve taco bar, upbeat Latin music",
      createdAt: new Date().toISOString()
    },
    menuHighlights: [
      {
        course: "Appetizer",
        dish: "Fresh Guacamole & Roasted Tomato Salsa with Lime Tortilla Chips",
        tags: ["Gluten-Free", "Vegetarian", "Crowd Favorite"],
        description: "Made-from-scratch creamy avocado dip with heirloom tomato salsa."
      },
      {
        course: "Main",
        dish: "Slow-Cooked Citrus Carnitas & Marinated Cilantro Lime Chicken",
        tags: ["High Protein", "Gluten-Free"],
        description: "Juicy shredded pork shoulder and tender grilled chicken thighs for street tacos."
      },
      {
        course: "Side",
        dish: "Cotija Street Corn Salad (Esquites) & Seasoned Black Beans",
        tags: ["Vegetarian", "Gluten-Free"],
        description: "Smoky sweet corn tossed with lime, cotija cheese, chili powder, and cilantro."
      },
      {
        course: "Dessert",
        dish: "Cinnamon Sugar Churro Bites with Mexican Chocolate Dip",
        tags: ["Sweet", "Finger Food"],
        description: "Crispy warm bite-sized churros dusted in cinnamon sugar."
      }
    ],
    signatureDrink: {
      name: "Sparkling Paloma & Hibiscus Agua Fresca",
      description: "Tequila, fresh ruby red grapefruit juice, lime, and club soda with salted rim.",
      ingredients: ["Blanco Tequila (750ml)", "Ruby Red Grapefruit Juice", "Limes", "Club Soda / Squirt", "Dried Hibiscus Flowers", "Agave Nectar"],
      isAlcoholic: true,
      prepTip: "Batch the citrus and agave mix in a large dispenser 2 hours before; let guests add tequila or club soda.",
      mocktailAlternative: "Hibiscus Agua Fresca with Lime & Sparkling Water"
    },
    portionGuidelines: [
      {
        metric: "Meat / Protein",
        recommendedAmount: "10-12 lbs total",
        calculationBasis: "0.5 lb cooked meat per adult (16 * 0.5 = 8 lbs) + 0.3 lb per kid (4 * 0.3 = 1.2 lbs) + 2 lb buffer",
        category: "food"
      },
      {
        metric: "Tortillas",
        recommendedAmount: "60-70 tortillas",
        calculationBasis: "3-4 small street tortillas per guest",
        category: "food"
      },
      {
        metric: "Drinks & Cocktails",
        recommendedAmount: "60-80 servings",
        calculationBasis: "2 drinks first hour + 1 drink each subsequent hour (3-4 drinks per adult for 4 hrs)",
        category: "drink"
      },
      {
        metric: "Ice Supply",
        recommendedAmount: "30-35 lbs (3 large bags)",
        calculationBasis: "1.5 lbs of ice per guest for chilling cans and making shaken drinks",
        category: "drink"
      },
      {
        metric: "Plates & Napkins",
        recommendedAmount: "40 heavy-duty plates, 80 napkins",
        calculationBasis: "2 plates per guest (tacos + dessert) & 4 napkins per guest",
        category: "supplies"
      }
    ],
    shoppingList: [
      // FOOD
      {
        id: 'fiesta_item_1',
        name: 'Boneless Pork Shoulder (Boston Butt)',
        category: 'food_fresh',
        subcategory: 'Proteins',
        quantity: 6,
        unit: 'lbs',
        portionExplanation: 'Provides ~4 lbs cooked carnitas (approx 0.25 lb per guest)',
        estimatedPrice: 22.50,
        unitPrice: 3.75,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Meat & Poultry',
        isPurchased: false,
        priority: 'must-have',
        alternatives: [
          { name: 'Pork Loin Roast', estimatedPrice: 18.00, savings: 4.50, reason: 'Leaner cut, slightly lower cost' }
        ]
      },
      {
        id: 'fiesta_item_2',
        name: 'Boneless Skinless Chicken Thighs',
        category: 'food_fresh',
        subcategory: 'Proteins',
        quantity: 5,
        unit: 'lbs',
        portionExplanation: 'Juicy taco protein (~0.25 lb per guest for chicken tacos)',
        estimatedPrice: 16.50,
        unitPrice: 3.30,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Meat & Poultry',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_3',
        name: 'Hass Avocados (Pack of 8-10)',
        category: 'food_fresh',
        subcategory: 'Produce',
        quantity: 2,
        unit: 'bags',
        portionExplanation: '16 avocados for 4 generous bowls of guacamole and salsa bar topping',
        estimatedPrice: 13.98,
        unitPrice: 6.99,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Fresh Produce',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_4',
        name: 'Fresh Limes (Bulk Mesh Bag)',
        category: 'food_fresh',
        subcategory: 'Produce',
        quantity: 2,
        unit: 'bags',
        portionExplanation: '~24-30 limes for marinades, guacamole, taco wedges, and margarita rimming',
        estimatedPrice: 7.98,
        unitPrice: 3.99,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Fresh Produce',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_5',
        name: 'White Corn Street Tortillas (30-pack)',
        category: 'food_fresh',
        subcategory: 'Bakery',
        quantity: 3,
        unit: 'packs',
        portionExplanation: '90 tortillas total (allow 4 tacos per adult, 2-3 per kid)',
        estimatedPrice: 8.97,
        unitPrice: 2.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Tortilla / Bread Aisle',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_6',
        name: 'Cotija & Shredded Mexican Cheese Blend',
        category: 'food_fresh',
        subcategory: 'Dairy & Deli',
        quantity: 3,
        unit: 'lbs',
        portionExplanation: 'Crumbled cotija for street corn + shredded cheese for kids tacos',
        estimatedPrice: 11.49,
        unitPrice: 3.83,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Dairy & Cheese',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_7',
        name: 'Tortilla Chips (Restaurant Style Bulk)',
        category: 'food_fresh',
        subcategory: 'Pantry & Snacks',
        quantity: 3,
        unit: 'large bags',
        portionExplanation: 'Plentiful dipping for guacamole, queso, and fresh salsa',
        estimatedPrice: 11.97,
        unitPrice: 3.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Snack Aisle',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_8',
        name: 'Sweet Corn, Cilantro, Red Onions & Jalapeños',
        category: 'food_fresh',
        subcategory: 'Produce',
        quantity: 1,
        unit: 'basket',
        portionExplanation: 'Produce for street corn salad, fresh pico de gallo, and marinades',
        estimatedPrice: 12.50,
        unitPrice: 12.50,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Fresh Produce',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_9',
        name: 'Frozen Mini Churros with Cinnamon Sugar',
        category: 'food_fresh',
        subcategory: 'Frozen / Bakery',
        quantity: 2,
        unit: 'boxes',
        portionExplanation: '40 mini churro bites (2 per guest)',
        estimatedPrice: 10.98,
        unitPrice: 5.49,
        suggestedStore: 'Trader Joe’s',
        aisle: 'Frozen Desserts',
        isPurchased: false,
        priority: 'recommended'
      },

      // BEVERAGES
      {
        id: 'fiesta_item_10',
        name: '100% Blue Agave Blanco Tequila (750ml)',
        category: 'beverages_bar',
        subcategory: 'Spirits',
        quantity: 2,
        unit: 'bottles',
        portionExplanation: '~32 cocktail pours (2 oz per cocktail)',
        estimatedPrice: 42.00,
        unitPrice: 21.00,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Liquor Department',
        isPurchased: false,
        priority: 'must-have',
        alternatives: [
          { name: 'Cimarron Blanco Tequila', estimatedPrice: 34.00, savings: 8.00, reason: 'Great quality bar-pour staple at lower price' }
        ]
      },
      {
        id: 'fiesta_item_11',
        name: 'Mexican Lager (Modelo / Corona 24-pack)',
        category: 'beverages_bar',
        subcategory: 'Beer',
        quantity: 1,
        unit: 'pack (24 cans)',
        portionExplanation: '~1.5 beers per adult guest',
        estimatedPrice: 26.99,
        unitPrice: 26.99,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Beer Aisle',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_12',
        name: 'Grapefruit Soda / Club Soda (12-pack)',
        category: 'beverages_bar',
        subcategory: 'Mixers',
        quantity: 2,
        unit: 'packs',
        portionExplanation: 'Mixer for Palomas and non-alcoholic refreshing spritzers',
        estimatedPrice: 11.98,
        unitPrice: 5.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Beverage Aisle',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_13',
        name: 'Jarritos Mexican Sodas Assorted (12-pack)',
        category: 'beverages_bar',
        subcategory: 'Non-Alcoholic',
        quantity: 1,
        unit: 'pack (12 bottles)',
        portionExplanation: 'Fun colorful drinks for kids and non-drinkers (Tamarind, Mandarin, Lime)',
        estimatedPrice: 12.49,
        unitPrice: 12.49,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Hispanic Foods / Soda',
        isPurchased: false,
        priority: 'recommended'
      },
      {
        id: 'fiesta_item_14',
        name: 'Party Ice Bags (10-12 lbs each)',
        category: 'beverages_bar',
        subcategory: 'Ice & Chilling',
        quantity: 3,
        unit: 'bags',
        portionExplanation: '1 bag for cooler beverage chilling, 2 bags clean ice for glasses/dispenser',
        estimatedPrice: 8.97,
        unitPrice: 2.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Front Freezer',
        isPurchased: false,
        priority: 'must-have'
      },

      // DECOR
      {
        id: 'fiesta_item_15',
        name: 'Mexican Fiesta Papel Picado Banner Garland (5-pack)',
        category: 'decor_atmosphere',
        subcategory: 'Banners & Hanging',
        quantity: 1,
        unit: 'set',
        portionExplanation: '60 ft of vibrant weatherproof fiesta bunting for patio / fence',
        estimatedPrice: 12.99,
        unitPrice: 12.99,
        suggestedStore: 'Party Store / Amazon',
        aisle: 'Party Decor',
        isPurchased: false,
        priority: 'recommended'
      },
      {
        id: 'fiesta_item_16',
        name: 'Bright Serape Table Runner (2-pack)',
        category: 'decor_atmosphere',
        subcategory: 'Table Styling',
        quantity: 1,
        unit: 'pack',
        portionExplanation: 'Adds instant festive color across taco buffet & bar tables',
        estimatedPrice: 13.50,
        unitPrice: 13.50,
        suggestedStore: 'Party Store / Amazon',
        aisle: 'Table Linens',
        isPurchased: false,
        priority: 'recommended'
      },

      // TABLEWARE
      {
        id: 'fiesta_item_17',
        name: 'Heavy-Duty Compostable Palm Leaf / Sugar Cane Plates (50ct)',
        category: 'tableware_disposables',
        subcategory: 'Plates',
        quantity: 1,
        unit: 'pack',
        portionExplanation: 'Sturdy leak-proof plates for heavy taco & salsa servings (2 per guest)',
        estimatedPrice: 15.99,
        unitPrice: 15.99,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Paper Goods',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_18',
        name: 'Fiesta Cocktail Napkins & Cutlery Pack',
        category: 'tableware_disposables',
        subcategory: 'Napkins & Utensils',
        quantity: 1,
        unit: 'set',
        portionExplanation: '100 colorful napkins + 40 forks/spoons',
        estimatedPrice: 9.99,
        unitPrice: 9.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Paper Goods',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'fiesta_item_19',
        name: 'Clear Tumbler Cups 12oz (50ct)',
        category: 'tableware_disposables',
        subcategory: 'Cups',
        quantity: 1,
        unit: 'pack',
        portionExplanation: 'Cocktail and drink cups with sharpie for guest name writing',
        estimatedPrice: 7.99,
        unitPrice: 7.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Paper Goods',
        isPurchased: false,
        priority: 'must-have'
      },

      // LOGISTICS
      {
        id: 'fiesta_item_20',
        name: 'Heavy-Duty 30-Gallon Trash Bags & Disinfecting Wipes',
        category: 'logistics_essentials',
        subcategory: 'Cleanup',
        quantity: 1,
        unit: 'pack',
        portionExplanation: 'Post-taco cleanup station and easy guest disposal bins',
        estimatedPrice: 8.49,
        unitPrice: 8.49,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Cleaning Supplies',
        isPurchased: false,
        priority: 'must-have'
      }
    ],
    budgetBreakdown: {
      foodEstimated: 114.89,
      beveragesEstimated: 102.43,
      decorEstimated: 26.49,
      tablewareEstimated: 33.97,
      logisticsEstimated: 8.49,
      totalEstimated: 286.27,
      budgetRemaining: 33.73
    },
    smartTips: [
      "Keep carnitas warm in a slow cooker / chafing dish set on 'Warm' so guests can build tacos all afternoon.",
      "Label vegan/dairy-free items with cute chalkboard mini-cards so guests with dietary restrictions feel welcomed.",
      "Set out a silver Sharpie marker next to the cups so guests write their name once and reuse their cup all day.",
      "Batch the Margarita/Paloma base the night before (citrus + agave) in glass carafes for 30-second pour efficiency."
    ],
    timeline: [
      {
        id: 'task_1',
        timeframe: '3_days_before',
        task: 'Purchase shelf-stable items (tequila, canned sodas, paper goods, papel picado banner, chips)',
        category: 'shopping',
        completed: false,
        tips: 'Get dry goods early so fridge space isn’t cluttered.'
      },
      {
        id: 'task_2',
        timeframe: '1_day_before',
        task: 'Buy fresh meats, produce (avocados, limes, cilantro). Marinate chicken thighs and slow-cook carnitas.',
        category: 'prep',
        completed: false,
        tips: 'Carnitas taste even more flavorful after resting overnight in juices!'
      },
      {
        id: 'task_3',
        timeframe: 'morning_of',
        task: 'Pick up 3 bags of ice. Hang papel picado banners and set out table runners.',
        category: 'decor',
        completed: false
      },
      {
        id: 'task_4',
        timeframe: '2_hours_before',
        task: 'Whip fresh guacamole, grill street corn, reheat carnitas in slow cooker, and fill drink coolers with ice & beers.',
        category: 'prep',
        completed: false
      },
      {
        id: 'task_5',
        timeframe: 'during_party',
        task: 'Warm up street tortillas in foil packets on grill or oven; play Spotify Fiesta playlist and relax!',
        category: 'hosting',
        completed: false
      }
    ]
  },

  backyard_bbq: {
    profile: {
      id: 'plan_bbq_02',
      title: "All-American Backyard Smokehouse BBQ",
      eventType: "Cookout / Family Reunion",
      theme: "Classic Southern BBQ & Lawn Games",
      adultsCount: 20,
      kidsCount: 8,
      durationHours: 5,
      targetBudget: 450,
      budgetTier: 'balanced',
      dietaryRestrictions: ["Vegetarian option (veggie burgers)", "Nut-Free"],
      venueType: "backyard",
      kitchenAmenities: ["Grill", "Full Kitchen", "Refrigerator/Freezer"],
      vibeNotes: "Smoky BBQ aroma, cold craft beer, lemonade stand for kids, lawn games (cornhole, bocce)",
      createdAt: new Date().toISOString()
    },
    menuHighlights: [
      {
        course: "Main",
        dish: "Smoked Pulled Pork Sliders & Flame-Grilled Angus Burgers",
        tags: ["Crowd Pleaser", "Smoky"],
        description: "Tender pulled pork with tangy Carolina slaw and charbroiled burgers."
      },
      {
        course: "Main",
        dish: "Grilled Black Bean & Sweet Potato Veggie Burgers",
        tags: ["Vegetarian"],
        description: "Flavorful seasoned patties grilled separately for vegetarian guests."
      },
      {
        course: "Side",
        dish: "Four-Cheese Baked Mac & Cheese & Brown Sugar Baked Beans",
        tags: ["Comfort Food"],
        description: "Creamy bubbling macaroni with cheddar and smoky bacon-infused baked beans."
      },
      {
        course: "Side",
        dish: "Crisp Apple Cider Vinegar Coleslaw & Watermelon Slices",
        tags: ["Fresh", "Gluten-Free"],
        description: "Crunchy refreshing sides that cut through rich barbecue flavors."
      },
      {
        course: "Dessert",
        dish: "Cast-Iron S'mores Dip with Graham Crackers & Peach Cobbler",
        tags: ["Sweet", "Fire Pit Vibe"],
        description: "Melted chocolate topped with toasted marshmallows for dipping."
      }
    ],
    signatureDrink: {
      name: "Bourbon Peach Sweet Tea & Strawberry Lemonade",
      description: "Southern sweet iced tea spiked with Kentucky bourbon and fresh muddled peaches.",
      ingredients: ["Bourbon Whiskey (750ml)", "Black Tea Bags", "Fresh Peaches", "Lemons", "Mint Sprigs", "Simple Syrup"],
      isAlcoholic: true,
      prepTip: "Brew 2 gallons of sweet tea in advance. Keep one dispenser non-alcoholic for kids and family!",
      mocktailAlternative: "Sparkling Strawberry Lemonade with Fresh Mint"
    },
    portionGuidelines: [
      {
        metric: "BBQ Meats (Pork + Burger Patties)",
        recommendedAmount: "16-18 lbs total",
        calculationBasis: "0.6 lb per adult (12 lbs) + 0.35 lb per kid (3 lbs) + 2 lbs extra",
        category: "food"
      },
      {
        metric: "Slider & Burger Buns",
        recommendedAmount: "45-50 buns",
        calculationBasis: "Allow 1.5 burgers or 2.5 sliders per guest",
        category: "food"
      },
      {
        metric: "Sides & Macaroni",
        recommendedAmount: "2 large catering pans (approx 12-14 lbs)",
        calculationBasis: "4-5 oz side per guest per side dish",
        category: "food"
      },
      {
        metric: "Beer, Seltzers & Sodas",
        recommendedAmount: "70-90 cans total",
        calculationBasis: "1 drink per hour for 5 hours across 20 adults + kids drinks",
        category: "drink"
      },
      {
        metric: "Ice Supply",
        recommendedAmount: "40 lbs (4 bags)",
        calculationBasis: "Large outdoor coolers in summer heat require 20 lbs for cooling cans + 20 lbs for drink glasses",
        category: "drink"
      }
    ],
    shoppingList: [
      {
        id: 'bbq_item_1',
        name: 'Pork Shoulder for Pulled Pork (8-10 lbs)',
        category: 'food_fresh',
        subcategory: 'Proteins',
        quantity: 1,
        unit: 'whole roast',
        portionExplanation: 'Yields ~6 lbs pulled pork for 30+ sliders',
        estimatedPrice: 28.50,
        unitPrice: 28.50,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Meat Department',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_2',
        name: 'Ground Beef 80/20 Angus Patties (Pack of 18)',
        category: 'food_fresh',
        subcategory: 'Proteins',
        quantity: 1,
        unit: 'pack',
        portionExplanation: 'Juicy 1/3 lb burgers for guests who want classic grilled burgers',
        estimatedPrice: 24.99,
        unitPrice: 24.99,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Meat Department',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_3',
        name: 'Veggie Burger Patties (6-pack)',
        category: 'food_fresh',
        subcategory: 'Proteins',
        quantity: 1,
        unit: 'box',
        portionExplanation: 'Dedicated vegetarian option for non-meat eaters',
        estimatedPrice: 7.99,
        unitPrice: 7.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Frozen Vegetarian',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_4',
        name: 'Hawaiian Sweet Slider Buns & Brioche Hamburger Buns',
        category: 'food_fresh',
        subcategory: 'Bakery',
        quantity: 3,
        unit: 'packs',
        portionExplanation: '24 slider rolls + 16 brioche burger buns',
        estimatedPrice: 13.47,
        unitPrice: 4.49,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Bakery / Bread',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_5',
        name: 'Elbow Macaroni, Cheddar, Gruyère & Heavy Cream',
        category: 'food_fresh',
        subcategory: 'Dairy & Pantry',
        quantity: 1,
        unit: 'bundle',
        portionExplanation: 'Ingredients for deep-dish 4-cheese baked macaroni',
        estimatedPrice: 18.50,
        unitPrice: 18.50,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Dairy & Pasta',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_6',
        name: 'Whole Seedless Watermelon & Sweet Yellow Corn (12 ears)',
        category: 'food_fresh',
        subcategory: 'Produce',
        quantity: 1,
        unit: 'set',
        portionExplanation: 'Grilled corn on the cob with butter + chilled watermelon wedges',
        estimatedPrice: 14.99,
        unitPrice: 14.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Fresh Produce',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_7',
        name: 'BBQ Sauce Trio (Sweet Baby Ray’s, Carolina Gold, Spicy)',
        category: 'food_fresh',
        subcategory: 'Condiments',
        quantity: 3,
        unit: 'bottles',
        portionExplanation: 'Sauce flight bar for guests to customize sliders',
        estimatedPrice: 10.50,
        unitPrice: 3.50,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Condiments & Sauces',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_8',
        name: 'Kentucky Straight Bourbon (750ml)',
        category: 'beverages_bar',
        subcategory: 'Spirits',
        quantity: 1,
        unit: 'bottle',
        portionExplanation: 'For spiked peach iced tea cocktails (~16 drinks)',
        estimatedPrice: 28.00,
        unitPrice: 28.00,
        suggestedStore: 'Liquor Store',
        aisle: 'Whiskey Aisle',
        isPurchased: false,
        priority: 'recommended'
      },
      {
        id: 'bbq_item_9',
        name: 'Craft IPA & Light Lager Variety Pack (24 cans)',
        category: 'beverages_bar',
        subcategory: 'Beer',
        quantity: 2,
        unit: 'packs (48 cans total)',
        portionExplanation: '2-3 beers per adult for 5 hour cookout',
        estimatedPrice: 58.00,
        unitPrice: 29.00,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Beer Section',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_10',
        name: 'Lemonade & Iced Tea Concentrates (3 Gallons)',
        category: 'beverages_bar',
        subcategory: 'Non-Alcoholic',
        quantity: 2,
        unit: 'jugs',
        portionExplanation: 'Non-alcoholic hydration for kids and adults in the sun',
        estimatedPrice: 11.98,
        unitPrice: 5.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Beverages',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_11',
        name: 'Party Ice (10lb Bags)',
        category: 'beverages_bar',
        subcategory: 'Ice',
        quantity: 4,
        unit: 'bags',
        portionExplanation: '40 lbs total for outdoor cooler ice baths and glasses',
        estimatedPrice: 11.96,
        unitPrice: 2.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Front Freezer',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_12',
        name: 'Red Gingham Tablecloths & Rustic Wooden Cutlery Set',
        category: 'decor_atmosphere',
        subcategory: 'Table Styling',
        quantity: 1,
        unit: 'set',
        portionExplanation: '3 wipeable picnic tablecloths + 100 compostable wooden forks/knives',
        estimatedPrice: 16.99,
        unitPrice: 16.99,
        suggestedStore: 'Party Store / Amazon',
        aisle: 'BBQ Supplies',
        isPurchased: false,
        priority: 'recommended'
      },
      {
        id: 'bbq_item_13',
        name: 'Hard-wearing Red Plastic Cups (16oz 100ct) + Sharpie',
        category: 'tableware_disposables',
        subcategory: 'Cups',
        quantity: 1,
        unit: 'pack',
        portionExplanation: 'Classic BBQ cups for draft beer and lemonade',
        estimatedPrice: 9.99,
        unitPrice: 9.99,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Paper Goods',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_14',
        name: 'Heavy-Duty 3-Compartment BBQ Paper Plates (100ct)',
        category: 'tableware_disposables',
        subcategory: 'Plates',
        quantity: 1,
        unit: 'pack',
        portionExplanation: 'Compartment plates prevent baked bean juices from soaking burger buns!',
        estimatedPrice: 16.50,
        unitPrice: 16.50,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Paper Goods',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_15',
        name: 'Grill Charcoal / Propane Tank Refill & Hickory Wood Chunks',
        category: 'logistics_essentials',
        subcategory: 'Fuel & Grill Gear',
        quantity: 1,
        unit: 'set',
        portionExplanation: 'Sufficient fuel for 5 hours of continuous smoking & high-heat grilling',
        estimatedPrice: 24.50,
        unitPrice: 24.50,
        suggestedStore: 'Target / Retail',
        aisle: 'Outdoor / Hardware',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'bbq_item_16',
        name: 'Citronella Mosquito Candles & Outdoor Trash Liners',
        category: 'logistics_essentials',
        subcategory: 'Backyard Comfort',
        quantity: 1,
        unit: 'pack',
        portionExplanation: 'Keeps bugs away from food table into the evening',
        estimatedPrice: 14.99,
        unitPrice: 14.99,
        suggestedStore: 'Target / Retail',
        aisle: 'Garden / Cleaning',
        isPurchased: false,
        priority: 'recommended'
      }
    ],
    budgetBreakdown: {
      foodEstimated: 128.94,
      beveragesEstimated: 109.94,
      decorEstimated: 16.99,
      tablewareEstimated: 26.49,
      logisticsEstimated: 39.49,
      totalEstimated: 321.85,
      budgetRemaining: 128.15
    },
    smartTips: [
      "Use 3-compartment paper plates: it prevents baked bean sauce or slaw vinaigrette from making burger buns soggy.",
      "Rub and season pork shoulder 24 hours prior; smoke or slow-cook overnight on low heat (225°F) for foolproof tender results.",
      "Separate grill zones: reserve the top warming rack or a dedicated foil pan for veggie burgers to avoid meat contact."
    ],
    timeline: [
      {
        id: 'bbq_task_1',
        timeframe: '3_days_before',
        task: 'Confirm propane tank fill or buy 20lb charcoal + smoking wood chunks. Order lawn games / paper goods.',
        category: 'shopping',
        completed: false
      },
      {
        id: 'bbq_task_2',
        timeframe: '1_day_before',
        task: 'Dry brine pork shoulder and prepare BBQ dry rub. Bake the 4-cheese mac and cheese (reheat day-of). Slice watermelon.',
        category: 'prep',
        completed: false
      },
      {
        id: 'bbq_task_3',
        timeframe: 'morning_of',
        task: 'Start smoking pork shoulder (or finish in slow cooker). Pick up 4 bags of ice. Fill drink cooler with beer and seltzers.',
        category: 'prep',
        completed: false
      },
      {
        id: 'bbq_task_4',
        timeframe: '2_hours_before',
        task: 'Set up lawn games (Cornhole, Bocce), wipe picnic tables, mix peach sweet tea, prep burger toppings platter.',
        category: 'decor',
        completed: false
      },
      {
        id: 'bbq_task_5',
        timeframe: 'during_party',
        task: 'Fire up grill for burgers on guest demand. Shred pulled pork and toss with warm sauce. Enjoy the sun!',
        category: 'hosting',
        completed: false
      }
    ]
  },

  cocktail_tapas: {
    profile: {
      id: 'plan_cocktail_03',
      title: "Chic Cocktail & Tapas Soirée",
      eventType: "Evening Soirée / Milestone Celebration",
      theme: "Modern Lounge & Small Bites",
      adultsCount: 14,
      kidsCount: 0,
      durationHours: 3.5,
      targetBudget: 380,
      budgetTier: 'premium',
      dietaryRestrictions: ["Vegetarian selections", "Nut-Free"],
      venueType: "indoor_home",
      kitchenAmenities: ["Full Kitchen", "Refrigerator/Freezer", "Oven"],
      vibeNotes: "Dim mood lighting, jazz playlist, elevated charcuterie grazing board, craft cocktails, gourmet hors d'oeuvres",
      createdAt: new Date().toISOString()
    },
    menuHighlights: [
      {
        course: "Appetizer",
        dish: "Artisanal Charcuterie & Cheese Grazing Board",
        tags: ["Gourmet", "Self-Serve"],
        description: "Prosciutto di Parma, Spanish chorizo, aged Manchego, Brie, honeycomb, fig jam, and artisanal crackers."
      },
      {
        course: "Appetizer",
        dish: "Prosciutto-Wrapped Asparagus & Crostini with Whipped Goat Cheese & Truffle Honey",
        tags: ["Warm Bites", "Finger Food"],
        description: "Crispy savory spears and creamy crostini drizzled with black truffle honey."
      },
      {
        course: "Appetizer",
        dish: "Garlic Butter Jumbo Shrimp Skewers (Gambas al Ajillo)",
        tags: ["Seafood", "Gluten-Free"],
        description: "Sautéed Gulf shrimp with chili flakes, lemon zest, garlic, and fresh parsley."
      },
      {
        course: "Dessert",
        dish: "Dark Chocolate Espresso Ganache Tartlets & Fresh Berries",
        tags: ["Decadent", "Bite-Sized"],
        description: "Rich mini tartlets paired with organic blackberries and raspberries."
      }
    ],
    signatureDrink: {
      name: "Smoked Rosemary French 75 & Espresso Martini",
      description: "Botanical Gin, fresh lemon juice, simple syrup, topped with Prosecco and torched rosemary sprig.",
      ingredients: ["London Dry Gin (750ml)", "Prosecco DOC (2 bottles)", "Vodka (750ml)", "Espresso / Coffee Liqueur", "Fresh Lemons", "Fresh Rosemary"],
      isAlcoholic: true,
      prepTip: "Torch rosemary sprigs with a culinary torch right before serving for theatrical aromatic aroma.",
      mocktailAlternative: "Sparkling Lemon-Rosemary French Mocktail with Non-Alcoholic Sparkling Wine"
    },
    portionGuidelines: [
      {
        metric: "Heavy Hors d'oeuvres / Small Bites",
        recommendedAmount: "12-14 bites per guest (170-195 total bites)",
        calculationBasis: "Since no seated dinner is served, evening cocktail events require 3-4 bites per hour per guest",
        category: "food"
      },
      {
        metric: "Charcuterie & Cheese",
        recommendedAmount: "3.5 lbs cured meats + 3.5 lbs cheeses",
        calculationBasis: "4 oz cheese + 4 oz cured meat per adult for grazing boards",
        category: "food"
      },
      {
        metric: "Wine & Sparkling Prosecco",
        recommendedAmount: "6-8 bottles",
        calculationBasis: "1 bottle per 2 guests (~4-5 glasses per bottle)",
        category: "drink"
      },
      {
        metric: "Cocktail Ice",
        recommendedAmount: "20 lbs (premium clear cocktail ice if possible)",
        calculationBasis: "Shaken martinis and highball drinks",
        category: "drink"
      }
    ],
    shoppingList: [
      {
        id: 'tapas_item_1',
        name: 'Artisanal Charcuterie Trio (Prosciutto, Salami, Jamón)',
        category: 'food_fresh',
        subcategory: 'Deli & Charcuterie',
        quantity: 3,
        unit: 'packs (2 lbs total)',
        portionExplanation: 'Thin-sliced gourmet cured meats for styling on grazing boards',
        estimatedPrice: 24.99,
        unitPrice: 8.33,
        suggestedStore: 'Trader Joe’s',
        aisle: 'Deli & Cheese',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'tapas_item_2',
        name: 'Specialty Cheese Selection (Truffle Gouda, Brie, Manchego, Chèvre)',
        category: 'food_fresh',
        subcategory: 'Cheese',
        quantity: 4,
        unit: 'wedges (~2.5 lbs total)',
        portionExplanation: 'Varied textures: soft, bloomy, semi-firm, and aged cheeses',
        estimatedPrice: 28.50,
        unitPrice: 7.12,
        suggestedStore: 'Trader Joe’s',
        aisle: 'Artisan Cheese',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'tapas_item_3',
        name: 'Peeled & Deveined Wild Jumbo Shrimp (2 lbs)',
        category: 'food_fresh',
        subcategory: 'Seafood',
        quantity: 2,
        unit: 'lbs',
        portionExplanation: '~32 jumbo shrimp for garlic herb tapas skewers (2 per guest)',
        estimatedPrice: 21.98,
        unitPrice: 10.99,
        suggestedStore: 'Costco / Wholesale',
        aisle: 'Seafood',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'tapas_item_4',
        name: 'Artisanal Sourdough Baguette, Seed Crackers & Fig Jam',
        category: 'food_fresh',
        subcategory: 'Bakery & Pantry',
        quantity: 1,
        unit: 'bundle',
        portionExplanation: 'Crostini base, gluten-free seed crackers, and sweet fruit spreads',
        estimatedPrice: 14.50,
        unitPrice: 14.50,
        suggestedStore: 'Trader Joe’s',
        aisle: 'Bakery & Crackers',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'tapas_item_5',
        name: 'Gourmet Mini Tartlet Pastry Shells & 70% Dark Chocolate',
        category: 'food_fresh',
        subcategory: 'Dessert',
        quantity: 1,
        unit: 'kit',
        portionExplanation: '24 mini dark chocolate ganache tarts topped with sea salt flakes',
        estimatedPrice: 12.99,
        unitPrice: 12.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Baking Aisle',
        isPurchased: false,
        priority: 'recommended'
      },
      {
        id: 'tapas_item_6',
        name: 'Botanical Craft Gin (750ml)',
        category: 'beverages_bar',
        subcategory: 'Spirits',
        quantity: 1,
        unit: 'bottle',
        portionExplanation: 'Empress 1908 or Hendrick’s for floral French 75 cocktails',
        estimatedPrice: 34.99,
        unitPrice: 34.99,
        suggestedStore: 'Liquor Store',
        aisle: 'Gin Department',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'tapas_item_7',
        name: 'Prosecco Superiore DOCG (750ml)',
        category: 'beverages_bar',
        subcategory: 'Wine & Champagne',
        quantity: 3,
        unit: 'bottles',
        portionExplanation: 'Bubbles for cocktail topping and welcome champagne toast',
        estimatedPrice: 41.97,
        unitPrice: 13.99,
        suggestedStore: 'Trader Joe’s',
        aisle: 'Wine & Champagne',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'tapas_item_8',
        name: 'Vodka & Coffee Liqueur (Kahlúa / Mr Black)',
        category: 'beverages_bar',
        subcategory: 'Spirits',
        quantity: 1,
        unit: 'bundle',
        portionExplanation: 'For shaken Espresso Martinis as evening wind-down drink',
        estimatedPrice: 38.00,
        unitPrice: 38.00,
        suggestedStore: 'Liquor Store',
        aisle: 'Spirits',
        isPurchased: false,
        priority: 'recommended'
      },
      {
        id: 'tapas_item_9',
        name: 'Fresh Lemons, Fresh Rosemary & Cocktail Cherries',
        category: 'beverages_bar',
        subcategory: 'Bar Garnish',
        quantity: 1,
        unit: 'set',
        portionExplanation: 'Aromatic garnishes, twists, and torched rosemary sprigs',
        estimatedPrice: 9.50,
        unitPrice: 9.50,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Produce & Mixers',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'tapas_item_10',
        name: 'Pure Cocktail Ice (10 lbs)',
        category: 'beverages_bar',
        subcategory: 'Ice',
        quantity: 2,
        unit: 'bags',
        portionExplanation: 'Shaking ice for martini shakers and chilling wine buckets',
        estimatedPrice: 5.98,
        unitPrice: 2.99,
        suggestedStore: 'Supermarket / Grocery',
        aisle: 'Freezer',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'tapas_item_11',
        name: 'Matte Black Cocktail Napkins (100ct) & Bamboo Skewers',
        category: 'tableware_disposables',
        subcategory: 'Napkins & Picks',
        quantity: 1,
        unit: 'pack',
        portionExplanation: 'Sleek modern cocktail napkins and knot picks for appetizers',
        estimatedPrice: 8.99,
        unitPrice: 8.99,
        suggestedStore: 'Party Store / Amazon',
        aisle: 'Cocktail Supplies',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'tapas_item_12',
        name: 'Elegant Stemless Flutes / Coupe Glasses (or Clear Acrylic)',
        category: 'tableware_disposables',
        subcategory: 'Glassware',
        quantity: 1,
        unit: 'pack (24ct)',
        portionExplanation: 'Chic cocktail presentation for French 75 and bubbly',
        estimatedPrice: 18.50,
        unitPrice: 18.50,
        suggestedStore: 'Party Store / Amazon',
        aisle: 'Party Barware',
        isPurchased: false,
        priority: 'must-have'
      },
      {
        id: 'tapas_item_13',
        name: 'Taper Candles, Glass Votives & Eucalyptus Garland',
        category: 'decor_atmosphere',
        subcategory: 'Centerpieces',
        quantity: 1,
        unit: 'set',
        portionExplanation: 'Warm ambient glow for food table and cocktail bar',
        estimatedPrice: 22.00,
        unitPrice: 22.00,
        suggestedStore: 'Target / Retail',
        aisle: 'Home Decor',
        isPurchased: false,
        priority: 'recommended'
      }
    ],
    budgetBreakdown: {
      foodEstimated: 102.97,
      beveragesEstimated: 130.44,
      decorEstimated: 22.00,
      tablewareEstimated: 27.49,
      logisticsEstimated: 0.00,
      totalEstimated: 282.90,
      budgetRemaining: 97.10
    },
    smartTips: [
      "Arrange the charcuterie board with the 'river' technique: place cheese wedges first, fold salami into ribbons, then fill gaps with berries, nuts, and crackers.",
      "Pre-juice all lemons and pre-make simple syrup into squeeze bottles 4 hours in advance so shaking cocktails takes under 45 seconds.",
      "Chill coupe glasses in the freezer 30 minutes before guests arrive for a frosty, high-end speakeasy feel."
    ],
    timeline: [
      {
        id: 'tapas_task_1',
        timeframe: '3_days_before',
        task: 'Buy spirits, Prosecco, specialty crackers, candles, and cocktail picks.',
        category: 'shopping',
        completed: false
      },
      {
        id: 'tapas_task_2',
        timeframe: '1_day_before',
        task: 'Bake mini chocolate ganache tartlets. Make simple syrup and batch cold-brew espresso.',
        category: 'prep',
        completed: false
      },
      {
        id: 'tapas_task_3',
        timeframe: 'morning_of',
        task: 'Assemble the charcuterie board (cover tightly with plastic wrap and chill). Cut lemon garnishes and rosemary.',
        category: 'prep',
        completed: false
      },
      {
        id: 'tapas_task_4',
        timeframe: '2_hours_before',
        task: 'Light candles, queue jazz playlist, place wine bottles in ice buckets, and toast crostini baguettes.',
        category: 'decor',
        completed: false
      },
      {
        id: 'tapas_task_5',
        timeframe: 'during_party',
        task: 'Warm garlic shrimp skewers in oven for 4 minutes right as guests settle in; shake French 75 welcome drinks.',
        category: 'hosting',
        completed: false
      }
    ]
  }
};
