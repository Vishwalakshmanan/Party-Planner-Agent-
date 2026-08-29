import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Lightbulb,
  DollarSign,
  Minimize2,
  Trash2,
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { AgentChatMessage, ChatAgentAction, PartyPlan } from '../types';
import { sendAgentChatMessage } from '../services/api';

interface AgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PartyPlan;
  messages: AgentChatMessage[];
  onAddMessage: (msg: AgentChatMessage) => void;
  onClearHistory: () => void;
  onExecuteAction?: (action: ChatAgentAction) => void;
  onSpeak?: (text: string) => void;
  isVoiceListening?: boolean;
  onToggleVoiceListening?: () => void;
}

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  isOpen,
  onClose,
  currentPlan,
  messages,
  onAddMessage,
  onClearHistory,
  onExecuteAction,
  onSpeak,
  isVoiceListening,
  onToggleVoiceListening,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const quickPrompts = [
    'How can I trim $30-$50 from this budget without compromising quality?',
    'Provide the exact ice and cooler refrigeration blueprint',
    'Add 5 lbs chicken wings and 2 bags of ice',
    'How can I adapt this menu for 3 vegan / gluten-free guests?',
    'Recommend sommelier-curated value wine and craft beer ratios',
    'Recalibrate portions for 20 guests',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: AgentChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onAddMessage(userMsg);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendAgentChatMessage(text, currentPlan, messages);
      const agentMsg: AgentChatMessage = {
        id: `msg_${Date.now() + 1}`,
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
                  ? 'Initiated checkout flow'
                  : 'Executed plan update',
            }
          : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onAddMessage(agentMsg);

      // Trigger text-to-speech if available
      if (onSpeak && response.spokenReply) {
        onSpeak(response.spokenReply);
      }

      // Execute structured action in parent app
      if (onExecuteAction && response.action) {
        onExecuteAction(response.action);
      }
    } catch (err: any) {
      const errorMsg: AgentChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'agent',
        text: 'Apologies, I encountered an issue consulting the CymbalMart product catalog. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onAddMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l-2 border-black flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 bg-[#1a1a1a] text-white flex items-center justify-between border-b-2 border-black">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-[#C5A059] text-black flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              CymbalMart Assistant
            </h3>
            <p className="text-[10px] uppercase font-mono tracking-wider text-white/50">
              AI Retail Concierge • {currentPlan.profile.title}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {onToggleVoiceListening && (
            <button
              onClick={onToggleVoiceListening}
              className={`p-1.5 border transition-all ${
                isVoiceListening
                  ? 'bg-red-600 border-red-400 text-white animate-pulse'
                  : 'bg-white/10 border-white/20 text-[#C5A059] hover:bg-white/20'
              }`}
              title={isVoiceListening ? 'Stop Voice Control' : 'Start Voice Control'}
            >
              {isVoiceListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onClearHistory}
            className="p-1.5 text-white/60 hover:text-white transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]">
        {messages.length === 0 ? (
          <div className="text-center py-6 px-2 space-y-4">
            <div className="w-12 h-12 bg-black text-[#C5A059] mx-auto flex items-center justify-center border border-black shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#1a1a1a]">
                Hello! I am your CymbalMart Assistant.
              </h4>
              <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto font-serif italic">
                Ask me to trim your budget, add/remove items, recalculate guest portions, optimize store routes, or take voice orders hands-free.
              </p>
            </div>

            {/* Quick Prompt Pills */}
            <div className="space-y-2 text-left pt-2">
              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-black/50 px-1">
                Suggested Assistant Requests:
              </div>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-3 bg-white hover:bg-black hover:text-white border border-black/15 text-xs font-serif transition-colors shadow-2xs flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{prompt}</span>
                  <Sparkles className="w-3 h-3 text-[#C5A059] shrink-0 opacity-70 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-6 h-6 bg-black text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] p-3.5 text-xs sm:text-sm leading-relaxed border ${
                    isUser
                      ? 'bg-[#1a1a1a] text-white border-black'
                      : 'bg-white text-[#1a1a1a] border-black/15 font-serif'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Action execution badge */}
                  {msg.appliedAction && (
                    <div className="mt-2 pt-2 border-t border-black/10 flex items-center space-x-1.5 text-[10px] text-emerald-800 font-sans font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{msg.appliedAction.description}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5">
                    {!isUser && onSpeak && (
                      <button
                        onClick={() => onSpeak(msg.spokenReply || msg.text)}
                        className="text-[10px] font-sans text-stone-500 hover:text-black flex items-center space-x-1"
                        title="Read out loud"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    )}
                    <div
                      className={`text-[9px] font-mono ml-auto ${
                        isUser ? 'text-white/40' : 'text-black/40'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>

                {isUser && (
                  <div className="w-6 h-6 bg-[#C5A059] text-black flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-6 h-6 bg-black text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-black/15 p-3 flex items-center space-x-1.5">
              <span className="text-[11px] font-serif italic text-stone-600 mr-2">
                CymbalMart Assistant is reviewing inventory...
              </span>
              <div className="w-1.5 h-1.5 bg-[#C5A059] animate-bounce" />
              <div
                className="w-1.5 h-1.5 bg-[#C5A059] animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="w-1.5 h-1.5 bg-[#C5A059] animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3.5 bg-white border-t-2 border-black">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask CymbalMart Assistant or speak hands-free..."
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-black/20 focus:outline-none focus:border-black font-serif italic text-black"
          />

          {onToggleVoiceListening && (
            <button
              type="button"
              onClick={onToggleVoiceListening}
              className={`p-2.5 border transition-all ${
                isVoiceListening
                  ? 'bg-red-600 border-red-400 text-white animate-pulse'
                  : 'bg-[#E8E6E1] hover:bg-black hover:text-white text-black border-black/20'
              }`}
              title={isVoiceListening ? 'Stop Voice Input' : 'Voice Input'}
            >
              {isVoiceListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          )}

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-black hover:bg-[#C5A059] hover:text-black disabled:opacity-30 text-white transition-colors border border-black"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};


