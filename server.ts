import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.GEMINI_API_KEY });
});

// Generate Full Party Plan & Shopping List
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Party profile is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in server environment.',
      });
    }

    const prompt = `You are a World-Class Party Planner and Expert Event Shopping Agent.
Generate a comprehensive, accurately portioned, itemized party shopping plan based on the following details:

Event Details:
- Title: ${profile.title || 'Party Celebration'}
- Event Type: ${profile.eventType || 'Party'}
- Theme: ${profile.theme || 'Festive'}
- Adults Count: ${profile.adultsCount}
- Kids Count: ${profile.kidsCount || 0}
- Duration: ${profile.durationHours} hours
- Target Budget: $${profile.targetBudget}
- Budget Tier: ${profile.budgetTier} (budget = cost-conscious wholesale/DIY, balanced = great quality/value mix, premium = artisanal/high-end)
- Dietary Restrictions: ${(profile.dietaryRestrictions || []).join(', ') || 'None specified'}
- Venue: ${profile.venueType || 'backyard'}
- Kitchen/Amenities: ${(profile.kitchenAmenities || []).join(', ') || 'Standard'}
- Vibe / Notes: ${profile.vibeNotes || 'Fun, seamless, memorable'}

CRITICAL SHOPPING & PORTIONING FORMULAS TO APPLY:
1. Meat/Protein: 0.5-0.6 lb cooked per adult, 0.3 lb per kid.
2. Appetizers: 3-4 pieces/hour per person for cocktail events; 4-6 total pieces per person for dinner/buffets.
3. Drinks/Alcohol: 2 drinks first hour + 1 drink each subsequent hour per drinking adult.
4. Non-Alcoholic / Kids Drinks: 1-2 drinks per hour per person.
5. Ice: 1.5 - 2 lbs of ice per guest in warm weather or for chilling cans + clean ice for glasses.
6. Tableware: 2 plates per guest (main + dessert), 3-4 napkins per guest, 2 cups per guest.
7. Realistic 2026 Retail Pricing: Ensure item prices match current realistic grocery/party store costs. Total estimated sum should come reasonably close to target budget ($${profile.targetBudget}).

Return a structured JSON output with:
- shoppingList: Array of detailed items categorized across:
  - 'food_fresh' (Proteins, produce, bakery, dairy, snacks)
  - 'beverages_bar' (Alcohol, mixers, sodas, water, ice, garnishes)
  - 'decor_atmosphere' (Banners, lighting, centerpieces, theme props)
  - 'tableware_disposables' (Plates, cups, cutlery, napkins, serving tongs)
  - 'logistics_essentials' (Trash bags, grill fuel, bug spray, wet wipes)
  Each item must have: id, name, category, subcategory, quantity (number), unit (string), portionExplanation (concise math basis), estimatedPrice (number in USD), unitPrice (number), suggestedStore (e.g. 'Costco / Wholesale', 'Supermarket / Grocery', 'Trader Joe’s', 'Party Store / Amazon', 'Liquor Store', 'Target / Retail'), aisle, isPurchased (false), priority ('must-have' | 'recommended' | 'optional'), alternatives (array of 1-2 cheaper or dietary options with name, estimatedPrice, savings, reason).
- menuHighlights: 3-5 courses (course: 'Appetizer' | 'Main' | 'Side' | 'Dessert', dish, tags, description).
- signatureDrink: (name, description, ingredients, isAlcoholic, prepTip, mocktailAlternative).
- portionGuidelines: 4-6 key metrics (metric, recommendedAmount, calculationBasis, category: 'food' | 'drink' | 'supplies').
- smartTips: 4-5 expert host tips (prep-ahead advice, ice saving hacks, crowd flow).
- timeline: 5 schedule milestones ('3_days_before', '1_day_before', 'morning_of', '2_hours_before', 'during_party' with task, category, completed: false, tips).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shoppingList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description:
                      'One of: food_fresh, beverages_bar, decor_atmosphere, tableware_disposables, logistics_essentials',
                  },
                  subcategory: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  portionExplanation: { type: Type.STRING },
                  estimatedPrice: { type: Type.NUMBER },
                  unitPrice: { type: Type.NUMBER },
                  suggestedStore: { type: Type.STRING },
                  aisle: { type: Type.STRING },
                  priority: { type: Type.STRING, description: 'must-have, recommended, or optional' },
                  alternatives: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        estimatedPrice: { type: Type.NUMBER },
                        savings: { type: Type.NUMBER },
                        reason: { type: Type.STRING },
                      },
                      required: ['name', 'estimatedPrice', 'savings', 'reason'],
                    },
                  },
                },
                required: [
                  'id',
                  'name',
                  'category',
                  'subcategory',
                  'quantity',
                  'unit',
                  'portionExplanation',
                  'estimatedPrice',
                  'unitPrice',
                  'suggestedStore',
                  'aisle',
                  'priority',
                ],
              },
            },
            menuHighlights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  course: { type: Type.STRING },
                  dish: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING },
                },
                required: ['course', 'dish', 'tags', 'description'],
              },
            },
            signatureDrink: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                isAlcoholic: { type: Type.BOOLEAN },
                prepTip: { type: Type.STRING },
                mocktailAlternative: { type: Type.STRING },
              },
              required: ['name', 'description', 'ingredients', 'isAlcoholic', 'prepTip'],
            },
            portionGuidelines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  recommendedAmount: { type: Type.STRING },
                  calculationBasis: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ['metric', 'recommendedAmount', 'calculationBasis', 'category'],
              },
            },
            smartTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  task: { type: Type.STRING },
                  category: { type: Type.STRING },
                  tips: { type: Type.STRING },
                },
                required: ['id', 'timeframe', 'task', 'category'],
              },
            },
          },
          required: [
            'shoppingList',
            'menuHighlights',
            'signatureDrink',
            'portionGuidelines',
            'smartTips',
            'timeline',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');

    // Ensure IDs and isPurchased flags
    const shoppingList = (parsed.shoppingList || []).map((item: any, idx: number) => ({
      ...item,
      id: item.id || `item_${Date.now()}_${idx}`,
      isPurchased: false,
    }));

    const timeline = (parsed.timeline || []).map((task: any, idx: number) => ({
      ...task,
      id: task.id || `task_${Date.now()}_${idx}`,
      completed: false,
    }));

    // Calculate breakdown
    let foodEstimated = 0;
    let beveragesEstimated = 0;
    let decorEstimated = 0;
    let tablewareEstimated = 0;
    let logisticsEstimated = 0;

    for (const item of shoppingList) {
      const price = Number(item.estimatedPrice) || 0;
      if (item.category === 'food_fresh') foodEstimated += price;
      else if (item.category === 'beverages_bar') beveragesEstimated += price;
      else if (item.category === 'decor_atmosphere') decorEstimated += price;
      else if (item.category === 'tableware_disposables') tablewareEstimated += price;
      else logisticsEstimated += price;
    }

    const totalEstimated =
      foodEstimated + beveragesEstimated + decorEstimated + tablewareEstimated + logisticsEstimated;
    const budgetRemaining = Math.max(0, (profile.targetBudget || 0) - totalEstimated);

    const fullPlan = {
      profile,
      shoppingList,
      menuHighlights: parsed.menuHighlights || [],
      portionGuidelines: parsed.portionGuidelines || [],
      signatureDrink: parsed.signatureDrink || {
        name: 'Signature Party Punch',
        description: 'Refreshing fruit punch with citrus and sparkling water',
        ingredients: ['Fruit Juice', 'Ginger Ale', 'Fresh Fruit'],
        isAlcoholic: false,
        prepTip: 'Chill all ingredients prior to mixing in punch bowl',
      },
      smartTips: parsed.smartTips || [],
      timeline,
      budgetBreakdown: {
        foodEstimated: Number(foodEstimated.toFixed(2)),
        beveragesEstimated: Number(beveragesEstimated.toFixed(2)),
        decorEstimated: Number(decorEstimated.toFixed(2)),
        tablewareEstimated: Number(tablewareEstimated.toFixed(2)),
        logisticsEstimated: Number(logisticsEstimated.toFixed(2)),
        totalEstimated: Number(totalEstimated.toFixed(2)),
        budgetRemaining: Number(budgetRemaining.toFixed(2)),
      },
    };

    res.json(fullPlan);
  } catch (err: any) {
    console.error('Error generating party plan:', err);
    res.status(500).json({ error: err.message || 'Failed to generate party plan' });
  }
});

// Interactive Shopping Agent Chat Assistant: CymbalMart Assistant
app.post('/api/chat-agent', async (req, res) => {
  try {
    const { message, currentPlan, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured.',
      });
    }

    const systemInstruction = `You are "CymbalMart Assistant", the friendly, knowledgeable, and efficient AI party planning concierge and shopping copilot for CymbalMart.
You interact directly with customers to guide them through party planning, portion calculations, budget optimization, grocery item modifications, timeline scheduling, and hands-free shopping.

Current Party Context:
Title: ${currentPlan?.profile?.title || 'Celebration'}
Theme: ${currentPlan?.profile?.theme || 'General'}
Guests: ${currentPlan?.profile?.adultsCount || 12} adults, ${currentPlan?.profile?.kidsCount || 0} kids (Duration: ${currentPlan?.profile?.durationHours || 4} hours)
Target Budget: $${currentPlan?.profile?.targetBudget || 250}
Current Cart Estimated Total: $${currentPlan?.budgetBreakdown?.totalEstimated || 0}
Current Items Count: ${(currentPlan?.shoppingList || []).length}
Shopping Items: ${(currentPlan?.shoppingList || []).map((i: any) => `${i.name} (Qty: ${i.quantity} ${i.unit}, $${i.estimatedPrice})`).join('; ')}

GUIDELINES:
1. Provide warm, concise, and expert guidance.
2. When the customer asks to take an action (such as adding an item, removing an item, changing guest count, navigating to a view, optimizing budget, or starting checkout), return a structured action alongside your reply.
3. Keep spokenReply concise and natural for Text-to-Speech (1-2 sentences).
4. Format your text reply in clean markdown.

Respond with JSON:
{
  "reply": "Conversational markdown response to the customer",
  "spokenReply": "Short, clear verbal feedback suitable for Text-to-Speech audio",
  "action": null OR {
    "type": "add_item" | "remove_item" | "update_quantity" | "optimize_budget" | "navigate" | "open_checkout" | "open_wizard" | "open_presets" | "toggle_in_store" | "recalibrate_guests" | "toggle_purchased",
    "item": { "name": string, "category": string, "quantity": number, "unit": string, "estimatedPrice": number, "aisle": string, "priority": string }, // for add_item
    "itemIdOrName": string, // for remove_item or toggle_purchased
    "delta": number, // for update_quantity
    "tab": "shopping" | "portions" | "timeline" | "menu", // for navigate
    "adults": number, // for recalibrate_guests
    "kids": number // for recalibrate_guests
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Customer Query: "${message}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({
      reply: parsed.reply || `I'm here to help with your ${currentPlan?.profile?.title || 'party'}!`,
      spokenReply: parsed.spokenReply || parsed.reply?.slice(0, 140) || 'Here is what I found for your gathering.',
      action: parsed.action || null,
    });
  } catch (err: any) {
    console.error('Error in CymbalMart Assistant chat:', err);
    res.status(500).json({ error: err.message || 'Failed to process chat message' });
  }
});

// Suggest Item Substitutions / Budget Cuts
app.post('/api/suggest-substitutions', async (req, res) => {
  try {
    const { item, partyTheme, budgetTier } = req.body;
    if (!item) {
      return res.status(400).json({ error: 'Item is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }

    const prompt = `Given this shopping list item:
Name: "${item.name}"
Category: "${item.category}"
Current Price: $${item.estimatedPrice} (Quantity: ${item.quantity} ${item.unit})
Party Theme: "${partyTheme || 'Party'}"
Budget Mode: "${budgetTier || 'balanced'}"

Suggest 3 smart alternative options (e.g. Budget saver, Dietary/Gluten-Free/Vegan swap, or Store-brand alternative).
Return a JSON array of alternatives with:
- name: string
- estimatedPrice: number
- savings: number (positive if cheaper, negative if upgrade)
- reason: string (why this swap works and how it affects guests/taste)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              estimatedPrice: { type: Type.NUMBER },
              savings: { type: Type.NUMBER },
              reason: { type: Type.STRING },
            },
            required: ['name', 'estimatedPrice', 'savings', 'reason'],
          },
        },
      },
    });

    const alternatives = JSON.parse(response.text?.trim() || '[]');
    res.json({ alternatives });
  } catch (err: any) {
    console.error('Error suggesting substitutions:', err);
    res.status(500).json({ error: err.message || 'Failed to suggest substitutions' });
  }
});

// Vite Middleware for Dev and Production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Party Planner Shopping Agent running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
