export type BudgetTier = 'budget' | 'balanced' | 'premium';

export type VenueType = 'backyard' | 'indoor_home' | 'park' | 'rented_venue' | 'beach' | 'office';

export interface PartyProfile {
  id: string;
  title: string;
  eventType: string;
  theme: string;
  adultsCount: number;
  kidsCount: number;
  durationHours: number;
  targetBudget: number;
  budgetTier: BudgetTier;
  dietaryRestrictions: string[];
  venueType: VenueType;
  kitchenAmenities: string[];
  vibeNotes: string;
  createdAt: string;
}

export type ShoppingCategory =
  | 'food_fresh'
  | 'beverages_bar'
  | 'decor_atmosphere'
  | 'tableware_disposables'
  | 'logistics_essentials';

export interface ItemAlternative {
  name: string;
  estimatedPrice: number;
  savings: number;
  reason: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: ShoppingCategory;
  subcategory: string;
  quantity: number;
  unit: string;
  portionExplanation: string;
  estimatedPrice: number;
  unitPrice: number;
  suggestedStore: string;
  aisle: string;
  isPurchased: boolean;
  priority: 'must-have' | 'recommended' | 'optional';
  alternatives?: ItemAlternative[];
  notes?: string;
}

export interface PortionGuideline {
  metric: string;
  recommendedAmount: string;
  calculationBasis: string;
  category: 'food' | 'drink' | 'supplies';
  iconType?: string;
}

export interface PartyScheduleTask {
  id: string;
  timeframe: '3_days_before' | '1_day_before' | 'morning_of' | '2_hours_before' | 'during_party';
  task: string;
  category: 'shopping' | 'prep' | 'decor' | 'hosting';
  completed: boolean;
  tips?: string;
}

export interface MenuHighlight {
  course: 'Appetizer' | 'Main' | 'Side' | 'Dessert' | 'Beverage';
  dish: string;
  tags: string[];
  description: string;
}

export interface SignatureDrink {
  name: string;
  description: string;
  ingredients: string[];
  isAlcoholic: boolean;
  prepTip: string;
  mocktailAlternative?: string;
}

export interface BudgetBreakdown {
  foodEstimated: number;
  beveragesEstimated: number;
  decorEstimated: number;
  tablewareEstimated: number;
  logisticsEstimated: number;
  totalEstimated: number;
  budgetRemaining: number;
}

export interface PartyPlan {
  profile: PartyProfile;
  shoppingList: ShoppingItem[];
  menuHighlights: MenuHighlight[];
  portionGuidelines: PortionGuideline[];
  signatureDrink: SignatureDrink;
  budgetBreakdown: BudgetBreakdown;
  smartTips: string[];
  timeline: PartyScheduleTask[];
}

export interface ChatAgentAction {
  type:
    | 'add_item'
    | 'remove_item'
    | 'update_quantity'
    | 'optimize_budget'
    | 'navigate'
    | 'open_checkout'
    | 'open_wizard'
    | 'open_presets'
    | 'toggle_in_store'
    | 'recalibrate_guests'
    | 'toggle_purchased';
  item?: Partial<ShoppingItem>;
  itemIdOrName?: string;
  quantity?: number;
  delta?: number;
  tab?: 'shopping' | 'portions' | 'timeline' | 'menu';
  adults?: number;
  kids?: number;
  adultsCount?: number;
  kidsCount?: number;
  durationHours?: number;
  description?: string;
}

export interface ChatAgentResponse {
  reply: string;
  spokenReply?: string;
  action?: ChatAgentAction | null;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  spokenReply?: string;
  appliedAction?: {
    type: string;
    description: string;
  };
}
