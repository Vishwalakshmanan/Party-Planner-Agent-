import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { PlanOverviewHeader } from './components/PlanOverviewHeader';
import { ShoppingListTab } from './components/ShoppingListTab';
import { InStoreShopperMode } from './components/InStoreShopperMode';
import { PortionCalculatorView } from './components/PortionCalculatorView';
import { TimelinePrepTab } from './components/TimelinePrepTab';
import { MenuAndCocktailsTab } from './components/MenuAndCocktailsTab';
import { PartyWizardModal } from './components/PartyWizardModal';
import { PresetsModal } from './components/PresetsModal';
import { AddItemModal } from './components/AddItemModal';
import { AlternativeSwapModal } from './components/AlternativeSwapModal';
import { ExportShareModal } from './components/ExportShareModal';
import { CymbalCheckoutModal } from './components/CymbalCheckoutModal';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { HandsFreeVoiceOverlay } from './components/HandsFreeVoiceOverlay';
import { useVoiceControl } from './hooks/useVoiceControl';
import { PRESET_PARTIES } from './data/presetParties';
import {
  AgentChatMessage,
  ChatAgentAction,
  ItemAlternative,
  PartyPlan,
  PartyProfile,
  PartyScheduleTask,
  ShoppingItem,
} from './types';
import { generatePartyPlanApi, sendAgentChatMessage } from './services/api';

const LOCAL_STORAGE_KEY = 'party_planner_active_plan_v1';

export default function App() {
  // Initialize plan from localStorage if available, otherwise preset
  const [currentPlan, setCurrentPlan] = useState<PartyPlan>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved party plan from localStorage:', e);
    }
    return PRESET_PARTIES.fiesta_taco_bar || Object.values(PRESET_PARTIES)[0];
  });

  const [activeTab, setActiveTab] = useState<
    'shopping' | 'instore' | 'portions' | 'timeline' | 'menu'
  >('shopping');

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [swapModalItem, setSwapModalItem] = useState<ShoppingItem | null>(null);

  // Chat message history
  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'agent',
      text: `👋 Welcome to CymbalMart Party Planner! I'm your CymbalMart Assistant. I've configured a curated, budget-conscious plan for "${currentPlan.profile.title}". You can talk to me hands-free via voice or chat to adjust portions, add/remove grocery items, optimize store aisles, or checkout!`,
      spokenReply: `Welcome to CymbalMart Party Planner! I am your assistant and ready for hands-free voice commands.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Helper to recompute budget breakdown when shopping list items change
  const computeBudgetBreakdown = useCallback((
    items: ShoppingItem[],
    targetBudget: number
  ): PartyPlan['budgetBreakdown'] => {
    let food = 0;
    let beverages = 0;
    let decor = 0;
    let tableware = 0;
    let logistics = 0;

    items.forEach((item) => {
      const price = item.estimatedPrice || 0;
      switch (item.category) {
        case 'food_fresh':
          food += price;
          break;
        case 'beverages_bar':
          beverages += price;
          break;
        case 'decor_atmosphere':
          decor += price;
          break;
        case 'tableware_disposables':
          tableware += price;
          break;
        case 'logistics_essentials':
          logistics += price;
          break;
      }
    });

    const totalEstimated = food + beverages + decor + tableware + logistics;
    const budgetRemaining = Number((targetBudget - totalEstimated).toFixed(2));

    return {
      foodEstimated: Number(food.toFixed(2)),
      beveragesEstimated: Number(beverages.toFixed(2)),
      decorEstimated: Number(decor.toFixed(2)),
      tablewareEstimated: Number(tableware.toFixed(2)),
      logisticsEstimated: Number(logistics.toFixed(2)),
      totalEstimated: Number(totalEstimated.toFixed(2)),
      budgetRemaining,
    };
  }, []);

  // 1-Click AI Budget Optimization
  const handleOptimizeBudget = useCallback(() => {
    let savedDollars = 0;
    setCurrentPlan((prev) => {
      const updatedList = prev.shoppingList.map((item) => {
        if (item.alternatives && item.alternatives.length > 0) {
          const cheaperAlt = item.alternatives.find((a) => a.savings > 0);
          if (cheaperAlt) {
            savedDollars += cheaperAlt.savings;
            return {
              ...item,
              name: cheaperAlt.name,
              estimatedPrice: cheaperAlt.estimatedPrice,
              unitPrice: Number((cheaperAlt.estimatedPrice / Math.max(1, item.quantity)).toFixed(2)),
              portionExplanation: `Cymbal Select value substitution (${cheaperAlt.reason})`,
            };
          }
        }
        return item;
      });

      const newBreakdown = computeBudgetBreakdown(updatedList, prev.profile.targetBudget);
      return {
        ...prev,
        shoppingList: updatedList,
        budgetBreakdown: newBreakdown,
      };
    });

    setChatMessages((prev) => [
      ...prev,
      {
        id: `opt_${Date.now()}`,
        sender: 'agent',
        text: `⚡ Budget Alignment Complete! Sourced Cymbal Select store-brand alternatives. Recalculated your budget totals.`,
        spokenReply: `Budget alignment complete! Sourced store-brand savings and recalculated budget totals.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [computeBudgetBreakdown]);

  // Recalibrate shopping list portions based on adjusted guest headcount and hours
  const handleRecalibratePortions = useCallback((
    newAdults: number,
    newKids: number,
    newHours: number,
    _eaterStyle: 'moderate' | 'heavy' = 'moderate'
  ) => {
    setCurrentPlan((prev) => {
      const prevTotal = (prev.profile.adultsCount || 10) + (prev.profile.kidsCount || 0);
      const nextTotal = newAdults + newKids;
      const guestRatio = prevTotal > 0 ? nextTotal / prevTotal : 1;

      const updatedList = prev.shoppingList.map((item) => {
        if (['food_fresh', 'beverages_bar', 'tableware_disposables', 'logistics_essentials'].includes(item.category)) {
          const scaledQty = Math.max(1, Math.round(item.quantity * guestRatio));
          const unitP = item.unitPrice || (item.quantity > 0 ? item.estimatedPrice / item.quantity : item.estimatedPrice);
          const newPrice = Number((unitP * scaledQty).toFixed(2));
          return {
            ...item,
            quantity: scaledQty,
            estimatedPrice: newPrice,
            unitPrice: unitP,
            portionExplanation: item.portionExplanation
              ? `${item.portionExplanation} (Recalibrated for ${nextTotal} guests)`
              : undefined,
          };
        }
        return item;
      });

      const updatedProfile = {
        ...prev.profile,
        adultsCount: newAdults,
        kidsCount: newKids,
        durationHours: newHours,
      };

      return {
        ...prev,
        profile: updatedProfile,
        shoppingList: updatedList,
        budgetBreakdown: computeBudgetBreakdown(updatedList, updatedProfile.targetBudget),
      };
    });

    setChatMessages((prev) => [
      ...prev,
      {
        id: `recalib_${Date.now()}`,
        sender: 'agent',
        text: `⚖️ Recalibrated provisions for ${newAdults} adults, ${newKids} kids (${newHours}h gathering). Automatically updated provision quantities and recomputed budget totals.`,
        spokenReply: `Recalibrated portions for ${newAdults + newKids} guests and recalculated budget totals.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [computeBudgetBreakdown]);

  // Action dispatcher from CymbalMart Assistant or Voice Control
  const handleExecuteAction = useCallback((action: ChatAgentAction) => {
    if (!action || !action.type) return;

    switch (action.type) {
      case 'add_item': {
        if (action.item && action.item.name) {
          const itemPayload = action.item;
          const newItem: ShoppingItem = {
            id: `item_voice_${Date.now()}`,
            name: itemPayload.name,
            category: itemPayload.category || 'food_fresh',
            subcategory: itemPayload.subcategory || 'Provisions',
            quantity: itemPayload.quantity || 1,
            unit: itemPayload.unit || 'unit',
            estimatedPrice: itemPayload.estimatedPrice || 6.99,
            unitPrice: itemPayload.unitPrice || itemPayload.estimatedPrice || 6.99,
            suggestedStore: itemPayload.suggestedStore || 'CymbalMart Supercenter',
            aisle: itemPayload.aisle || 'Aisle 4 - Grocery & Provisions',
            priority: itemPayload.priority || 'recommended',
            isPurchased: false,
            portionExplanation: 'Added via CymbalMart Assistant hands-free voice command',
          };

          setCurrentPlan((prev) => {
            const updatedList = [newItem, ...prev.shoppingList];
            return {
              ...prev,
              shoppingList: updatedList,
              budgetBreakdown: computeBudgetBreakdown(updatedList, prev.profile.targetBudget),
            };
          });
        }
        break;
      }

      case 'remove_item': {
        if (action.itemIdOrName) {
          const term = action.itemIdOrName.toLowerCase();
          setCurrentPlan((prev) => {
            const updatedList = prev.shoppingList.filter(
              (i) => i.id !== action.itemIdOrName && !i.name.toLowerCase().includes(term)
            );
            return {
              ...prev,
              shoppingList: updatedList,
              budgetBreakdown: computeBudgetBreakdown(updatedList, prev.profile.targetBudget),
            };
          });
        }
        break;
      }

      case 'update_quantity': {
        if (action.itemIdOrName && action.quantity) {
          const term = action.itemIdOrName.toLowerCase();
          const targetQty = Math.max(1, action.quantity);
          setCurrentPlan((prev) => {
            const updatedList = prev.shoppingList.map((item) => {
              if (item.id === action.itemIdOrName || item.name.toLowerCase().includes(term)) {
                const unitP = item.unitPrice || item.estimatedPrice / Math.max(1, item.quantity);
                return {
                  ...item,
                  quantity: targetQty,
                  estimatedPrice: Number((unitP * targetQty).toFixed(2)),
                };
              }
              return item;
            });
            return {
              ...prev,
              shoppingList: updatedList,
              budgetBreakdown: computeBudgetBreakdown(updatedList, prev.profile.targetBudget),
            };
          });
        }
        break;
      }

      case 'navigate': {
        if (action.tab) {
          setActiveTab(action.tab);
        }
        break;
      }

      case 'toggle_in_store': {
        setActiveTab((prev) => (prev === 'instore' ? 'shopping' : 'instore'));
        break;
      }

      case 'optimize_budget': {
        handleOptimizeBudget();
        break;
      }

      case 'recalibrate_guests': {
        if (action.adultsCount) {
          handleRecalibratePortions(
            action.adultsCount,
            action.kidsCount ?? currentPlan.profile.kidsCount ?? 0,
            action.durationHours ?? currentPlan.profile.durationHours ?? 4,
            'moderate'
          );
        }
        break;
      }

      case 'open_checkout': {
        setIsCheckoutOpen(true);
        break;
      }

      case 'open_wizard': {
        setIsWizardOpen(true);
        break;
      }
    }
  }, [computeBudgetBreakdown, currentPlan.profile.durationHours, currentPlan.profile.kidsCount, handleOptimizeBudget, handleRecalibratePortions]);

  // Voice Command processing function
  const handleExecuteVoiceCommand = useCallback(async (commandText: string) => {
    const cleanCommand = commandText.trim();
    if (!cleanCommand) return;

    // Add user message to chat history
    const userMsg: AgentChatMessage = {
      id: `msg_voice_${Date.now()}`,
      sender: 'user',
      text: cleanCommand,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const response = await sendAgentChatMessage(cleanCommand, currentPlan, chatMessages);

      const agentMsg: AgentChatMessage = {
        id: `msg_voice_${Date.now() + 1}`,
        sender: 'agent',
        text: response.reply,
        spokenReply: response.spokenReply,
        appliedAction: response.action
          ? {
              type: response.action.type,
              description:
                response.action.type === 'add_item'
                  ? `Added ${response.action.item?.name || 'item'} to shopping list`
                  : response.action.type === 'remove_item'
                  ? `Removed ${response.action.itemIdOrName || 'item'}`
                  : response.action.type === 'navigate'
                  ? `Navigated to ${response.action.tab} view`
                  : response.action.type === 'open_checkout'
                  ? 'Opened checkout pass'
                  : 'Executed action',
            }
          : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, agentMsg]);

      // Speak response if voice output is active
      if (response.spokenReply) {
        voiceControl.speakText(response.spokenReply);
      }

      // Execute action
      if (response.action) {
        handleExecuteAction(response.action);
      }
    } catch (err) {
      console.warn('Voice command processing error:', err);
      const fallbackMsg: AgentChatMessage = {
        id: `msg_voice_${Date.now() + 1}`,
        sender: 'agent',
        text: 'I heard your request and updated your plan details.',
        spokenReply: 'I have updated your shopping plan.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
      voiceControl.speakText('I have updated your shopping plan.');
    }
  }, [chatMessages, currentPlan, handleExecuteAction]);

  // Voice control hook initialization
  const voiceControl = useVoiceControl({
    onCommandRecognized: (cmd) => {
      handleExecuteVoiceCommand(cmd);
    },
    enableSpeechOutput: true,
  });

  // Persist plan state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentPlan));
    } catch (e) {
      console.warn('Failed to persist party plan to localStorage:', e);
    }
  }, [currentPlan]);

  // Toggle item purchased
  const handleTogglePurchased = (id: string) => {
    setCurrentPlan((prev) => {
      const updatedList = prev.shoppingList.map((item) =>
        item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
      );
      return {
        ...prev,
        shoppingList: updatedList,
      };
    });
  };

  // Stepper update quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCurrentPlan((prev) => {
      const updatedList = prev.shoppingList.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          const unitP = item.unitPrice || item.estimatedPrice / item.quantity;
          const newPrice = Number((unitP * newQty).toFixed(2));
          return {
            ...item,
            quantity: newQty,
            estimatedPrice: newPrice,
            unitPrice: unitP,
          };
        }
        return item;
      });

      return {
        ...prev,
        shoppingList: updatedList,
        budgetBreakdown: computeBudgetBreakdown(updatedList, prev.profile.targetBudget),
      };
    });
  };

  // Update item custom price
  const handleUpdateItemPrice = (id: string, newPrice: number) => {
    setCurrentPlan((prev) => {
      const updatedList = prev.shoppingList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            estimatedPrice: newPrice,
            unitPrice: Number((newPrice / Math.max(1, item.quantity)).toFixed(2)),
          };
        }
        return item;
      });

      return {
        ...prev,
        shoppingList: updatedList,
        budgetBreakdown: computeBudgetBreakdown(updatedList, prev.profile.targetBudget),
      };
    });
  };

  // Full item update (Name, Quantity, Unit, Price, Store, Category, Aisle, Priority)
  const handleUpdateItem = (updatedItem: ShoppingItem) => {
    setCurrentPlan((prev) => {
      const updatedList = prev.shoppingList.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      return {
        ...prev,
        shoppingList: updatedList,
        budgetBreakdown: computeBudgetBreakdown(updatedList, prev.profile.targetBudget),
      };
    });
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setCurrentPlan((prev) => {
      const updatedList = prev.shoppingList.filter((item) => item.id !== id);
      return {
        ...prev,
        shoppingList: updatedList,
        budgetBreakdown: computeBudgetBreakdown(updatedList, prev.profile.targetBudget),
      };
    });
  };

  // Add custom item
  const handleAddItem = (itemData: Omit<ShoppingItem, 'id' | 'isPurchased'>) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: `item_custom_${Date.now()}`,
      isPurchased: false,
    };

    setCurrentPlan((prev) => {
      const updatedList = [newItem, ...prev.shoppingList];
      return {
        ...prev,
        shoppingList: updatedList,
        budgetBreakdown: computeBudgetBreakdown(updatedList, prev.profile.targetBudget),
      };
    });
  };

  // Mark all purchased or unpurchased
  const handleMarkAllPurchased = (status: boolean) => {
    setCurrentPlan((prev) => ({
      ...prev,
      shoppingList: prev.shoppingList.map((i) => ({ ...i, isPurchased: status })),
    }));
  };

  // Apply swap alternative from AI
  const handleApplySwap = (originalItemId: string, swap: ItemAlternative) => {
    setCurrentPlan((prev) => {
      const updatedList = prev.shoppingList.map((item) => {
        if (item.id === originalItemId) {
          return {
            ...item,
            name: swap.name,
            estimatedPrice: swap.estimatedPrice,
            unitPrice: Number((swap.estimatedPrice / Math.max(1, item.quantity)).toFixed(2)),
            portionExplanation: `Swapped alternative: ${swap.reason}`,
          };
        }
        return item;
      });

      return {
        ...prev,
        shoppingList: updatedList,
        budgetBreakdown: computeBudgetBreakdown(updatedList, prev.profile.targetBudget),
      };
    });

    setChatMessages((prev) => [
      ...prev,
      {
        id: `swap_notice_${Date.now()}`,
        sender: 'agent',
        text: `✨ Applied substitution: Swapped into your cart "${swap.name}" ($${swap.estimatedPrice.toFixed(
          2
        )}). Rationale: ${swap.reason}`,
        spokenReply: `Swapped ${swap.name} into your shopping list.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Toggle timeline prep task
  const handleToggleTimelineTask = (taskId: string) => {
    setCurrentPlan((prev) => ({
      ...prev,
      timeline: prev.timeline.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    }));
  };

  // Add custom prep task
  const handleAddTimelineTask = (taskData: Omit<PartyScheduleTask, 'id' | 'completed'>) => {
    const newTask: PartyScheduleTask = {
      ...taskData,
      id: `task_custom_${Date.now()}`,
      completed: false,
    };
    setCurrentPlan((prev) => ({
      ...prev,
      timeline: [...prev.timeline, newTask],
    }));
  };

  // Generate new party plan via AI
  const handleGenerateNewPlan = async (profile: PartyProfile) => {
    const newPlan = await generatePartyPlanApi(profile);
    setCurrentPlan(newPlan);
    setActiveTab('shopping');

    // Add notification in chat
    setChatMessages((prev) => [
      ...prev,
      {
        id: `gen_${Date.now()}`,
        sender: 'agent',
        text: `🎉 Created a brand new party shopping plan for "${profile.title}"! I've calculated portions for ${
          profile.adultsCount + (profile.kidsCount || 0)
        } guests, created a curated menu, and organized ${newPlan.shoppingList.length} provisions by CymbalMart store aisles.`,
        spokenReply: `Created a brand new party shopping plan for ${profile.title}. Ready for review!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Select blueprint preset
  const handleSelectPreset = (preset: PartyPlan) => {
    setCurrentPlan(preset);
    setActiveTab('shopping');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#C5A059] selection:text-white">
      {/* Top Application Bar */}
      <Navbar
        currentPlan={currentPlan}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onToggleChat={() => setIsChatDrawerOpen(!isChatDrawerOpen)}
        isChatOpen={isChatDrawerOpen}
        isInStoreMode={activeTab === 'instore'}
        onToggleInStoreMode={() => setActiveTab(activeTab === 'instore' ? 'shopping' : 'instore')}
        isVoiceListening={voiceControl.isListening}
        onToggleVoiceListening={voiceControl.toggleListening}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* If In-Store mode is active, show the dark HUD shopper view */}
        {activeTab === 'instore' ? (
          <InStoreShopperMode
            items={currentPlan.shoppingList}
            onTogglePurchased={handleTogglePurchased}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdateItemPrice={handleUpdateItemPrice}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onExit={() => setActiveTab('shopping')}
          />
        ) : (
          <>
            {/* Header with quick stats & tab navigation */}
            <PlanOverviewHeader
              currentPlan={currentPlan}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onOpenWizard={() => setIsWizardOpen(true)}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onOptimizeBudget={handleOptimizeBudget}
            />

            {/* Tab Views */}
            {activeTab === 'shopping' && (
              <ShoppingListTab
                items={currentPlan.shoppingList}
                targetBudget={currentPlan.profile.targetBudget}
                onTogglePurchased={handleTogglePurchased}
                onUpdateQuantity={handleUpdateQuantity}
                onUpdateItemPrice={handleUpdateItemPrice}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onOpenAddItemModal={() => setIsAddItemOpen(true)}
                onOpenSwapModal={(item) => setSwapModalItem(item)}
                onMarkAllPurchased={handleMarkAllPurchased}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                onOptimizeBudget={handleOptimizeBudget}
              />
            )}

            {activeTab === 'portions' && (
              <PortionCalculatorView
                currentPlan={currentPlan}
                onApplyPortionScaling={handleRecalibratePortions}
              />
            )}

            {activeTab === 'timeline' && (
              <TimelinePrepTab
                timeline={currentPlan.timeline}
                onToggleTask={handleToggleTimelineTask}
                onAddTask={handleAddTimelineTask}
              />
            )}

            {activeTab === 'menu' && (
              <MenuAndCocktailsTab currentPlan={currentPlan} />
            )}
          </>
        )}
      </main>

      {/* Hands-Free Voice Control HUD Overlay */}
      <HandsFreeVoiceOverlay
        isListening={voiceControl.isListening}
        isSpeaking={voiceControl.isSpeaking}
        transcript={voiceControl.transcript}
        interimTranscript={voiceControl.interimTranscript}
        isContinuous={voiceControl.isContinuous}
        isMuted={voiceControl.isMuted}
        isSupported={voiceControl.isSupported}
        errorMessage={voiceControl.errorMessage}
        currentPlan={currentPlan}
        onToggleListening={voiceControl.toggleListening}
        onToggleContinuous={() => voiceControl.setIsContinuous(!voiceControl.isContinuous)}
        onToggleMute={() => voiceControl.setIsMuted(!voiceControl.isMuted)}
        onExecuteCommand={handleExecuteVoiceCommand}
        onOpenAssistantChat={() => setIsChatDrawerOpen(true)}
      />

      {/* Modals & Slide-out Drawers */}
      <PartyWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onGeneratePlan={handleGenerateNewPlan}
      />

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        currentPlanId={currentPlan.profile.id}
        onSelectPreset={handleSelectPreset}
      />

      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAddItem={handleAddItem}
      />

      <AlternativeSwapModal
        isOpen={!!swapModalItem}
        onClose={() => setSwapModalItem(null)}
        item={swapModalItem}
        partyTheme={currentPlan.profile.theme}
        budgetTier={currentPlan.profile.budgetTier}
        onApplySwap={handleApplySwap}
      />

      <ExportShareModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        currentPlan={currentPlan}
      />

      <CymbalCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        currentPlan={currentPlan}
        onLaunchInStoreMode={() => {
          setIsCheckoutOpen(false);
          setActiveTab('instore');
        }}
      />

      {/* AI Assistant Chat Drawer */}
      <AgentChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        currentPlan={currentPlan}
        messages={chatMessages}
        onAddMessage={(msg) => setChatMessages((prev) => [...prev, msg])}
        onClearHistory={() => setChatMessages([])}
        onExecuteAction={handleExecuteAction}
        onSpeak={voiceControl.speakText}
        isVoiceListening={voiceControl.isListening}
        onToggleVoiceListening={voiceControl.toggleListening}
      />
    </div>
  );
}

