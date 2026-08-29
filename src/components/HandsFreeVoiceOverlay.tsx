import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  ChevronUp,
  ChevronDown,
  Radio,
  ShoppingBag,
  Sliders,
  DollarSign,
  HelpCircle,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { PartyPlan } from '../types';

interface HandsFreeVoiceOverlayProps {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  isContinuous: boolean;
  isMuted: boolean;
  isSupported: boolean;
  errorMessage: string | null;
  currentPlan: PartyPlan;
  onToggleListening: () => void;
  onToggleContinuous: () => void;
  onToggleMute: () => void;
  onExecuteCommand: (command: string) => void;
  onOpenAssistantChat: () => void;
}

export const HandsFreeVoiceOverlay: React.FC<HandsFreeVoiceOverlayProps> = ({
  isListening,
  isSpeaking,
  transcript,
  interimTranscript,
  isContinuous,
  isMuted,
  isSupported,
  errorMessage,
  currentPlan,
  onToggleListening,
  onToggleContinuous,
  onToggleMute,
  onExecuteCommand,
  onOpenAssistantChat,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showCommandsGuide, setShowCommandsGuide] = useState<boolean>(false);

  const voiceSuggestions = [
    { label: 'Add 2 bags of ice', query: 'Add 2 bags of ice' },
    { label: 'Add 5 lbs chicken wings', query: 'Add 5 lbs chicken wings' },
    { label: 'Trim $35 from budget', query: 'Trim $35 from this budget' },
    { label: 'Recalculate for 18 guests', query: 'Recalibrate portions for 18 guests' },
    { label: 'Switch to In-Store mode', query: 'Switch to in-store shopper mode' },
    { label: 'Show portion guidelines', query: 'Show portion guidelines' },
    { label: 'Proceed to checkout', query: 'Take me to checkout' },
  ];

  if (!isSupported) {
    return null;
  }

  return (
    <aside aria-label="Hands-free voice assistant controls" className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)] sm:max-w-md">
      {/* Minimized Pill */}
      {!isExpanded ? (
        <div className="flex items-center space-x-2 bg-[#1a1a1a] text-white p-2 border-2 border-black shadow-2xl">
          <button
            onClick={onToggleListening}
            className={`w-9 h-9 flex items-center justify-center border transition-all ${
              isListening
                ? 'bg-red-600 border-red-400 text-white animate-pulse'
                : 'bg-black border-white/20 text-[#C5A059] hover:bg-white/10'
            }`}
            title={isListening ? 'Mute Mic' : 'Start Voice Control'}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-white/50" />}
          </button>

          <div
            onClick={() => setIsExpanded(true)}
            className="cursor-pointer px-2 flex items-center space-x-2"
          >
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C5A059] flex items-center space-x-1">
                <span>CymbalMart Voice</span>
                {isListening && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <p className="text-[11px] font-serif text-white/70 truncate max-w-[140px]">
                {isListening ? (transcript || 'Listening hands-free...') : 'Voice mode idle'}
              </p>
            </div>
            <ChevronUp className="w-4 h-4 text-white/50" />
          </div>
        </div>
      ) : (
        /* Expanded Voice Control HUD */
        <div className="bg-[#1a1a1a] text-white border-2 border-black shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
          {/* Header */}
          <div className="p-3 bg-black flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`} />
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059] flex items-center gap-1.5">
                  <Radio className="w-3 h-3" />
                  Hands-Free Voice Control
                </span>
                <span className="text-[9px] text-white/50 block font-mono">
                  CymbalMart AI Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={onToggleMute}
                className={`p-1.5 border transition-colors ${
                  isMuted
                    ? 'bg-red-950/60 border-red-700 text-red-300'
                    : 'bg-white/5 border-white/10 text-white/80 hover:text-white'
                }`}
                title={isMuted ? 'Unmute spoken voice' : 'Mute spoken voice'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setShowCommandsGuide(!showCommandsGuide)}
                className={`p-1.5 border transition-colors ${
                  showCommandsGuide
                    ? 'bg-[#C5A059] text-black border-[#C5A059]'
                    : 'bg-white/5 border-white/10 text-white/80 hover:text-white'
                }`}
                title="Voice Command Examples"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 bg-white/5 border border-white/10 text-white/80 hover:text-white transition-colors"
                title="Minimize voice widget"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Audio Waveform & Status */}
          <div className="p-3.5 space-y-3 bg-[#141414]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  id="btn-voice-mic-main"
                  onClick={onToggleListening}
                  className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 border transition-all ${
                    isListening
                      ? 'bg-red-600 hover:bg-red-700 text-white border-red-400 shadow-md animate-pulse'
                      : 'bg-[#C5A059] hover:bg-[#b08e4c] text-black border-black font-bold'
                  }`}
                >
                  {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Listening...' : 'Turn On Mic'}</span>
                </button>

                {/* Hands-Free continuous toggle */}
                <button
                  onClick={onToggleContinuous}
                  className={`text-[9px] uppercase tracking-wider px-2 py-1 border transition-colors ${
                    isContinuous
                      ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                  }`}
                  title="Keep microphone active continuously without clicking"
                >
                  Continuous: {isContinuous ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Audio Wave Bars */}
              {isListening && (
                <div className="flex items-end space-x-0.5 h-5 px-1">
                  <span className="w-1 bg-[#C5A059] rounded-xs animate-[bounce_0.6s_infinite_100ms] h-2" />
                  <span className="w-1 bg-[#C5A059] rounded-xs animate-[bounce_0.6s_infinite_200ms] h-4" />
                  <span className="w-1 bg-[#C5A059] rounded-xs animate-[bounce_0.6s_infinite_300ms] h-5" />
                  <span className="w-1 bg-[#C5A059] rounded-xs animate-[bounce_0.6s_infinite_150ms] h-3" />
                  <span className="w-1 bg-[#C5A059] rounded-xs animate-[bounce_0.6s_infinite_250ms] h-4" />
                </div>
              )}
            </div>

            {/* Live Transcription Box */}
            <div className="p-2.5 bg-black/70 border border-white/15 min-h-[46px] flex flex-col justify-center">
              {transcript || interimTranscript ? (
                <div className="text-xs font-serif italic text-white/95">
                  <span>"{transcript || interimTranscript}"</span>
                  {interimTranscript && (
                    <span className="text-[#C5A059] opacity-80">...</span>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-white/40 font-serif italic flex items-center space-x-1.5">
                  <Sparkles className="w-3 h-3 text-[#C5A059]/70 shrink-0" />
                  <span>
                    {isListening
                      ? 'Say any command (e.g. "Add 3 bags of ice", "Trim budget", "Checkout")...'
                      : 'Microphone is paused. Click "Turn On Mic" to begin hands-free control.'}
                  </span>
                </div>
              )}
            </div>

            {/* Speaking feedback indicator */}
            {isSpeaking && (
              <div className="flex items-center space-x-2 text-[10px] text-[#C5A059] bg-black/40 px-2 py-1 border border-[#C5A059]/30">
                <Volume2 className="w-3 h-3 animate-pulse shrink-0" />
                <span className="truncate font-sans font-medium">
                  CymbalMart Assistant is speaking response...
                </span>
              </div>
            )}

            {/* Error or Notice */}
            {errorMessage && (
              <div className="text-[10px] text-amber-300 bg-amber-950/50 p-2 border border-amber-800/80">
                {errorMessage}
              </div>
            )}

            {/* Quick Command Guide / Suggestions */}
            {showCommandsGuide && (
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="text-[9px] uppercase font-black tracking-[0.2em] text-[#C5A059]">
                  Hands-Free Voice Capabilities:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {voiceSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => onExecuteCommand(s.query)}
                      className="text-left px-2 py-1.5 bg-white/5 hover:bg-[#C5A059] hover:text-black border border-white/10 text-[10px] font-mono transition-colors truncate"
                    >
                      🗣️ "{s.label}"
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-3 py-2 bg-black border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
            <button
              onClick={onOpenAssistantChat}
              className="text-[#C5A059] hover:underline font-serif italic flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span>Open Full Chat History</span>
            </button>
            <span className="font-mono text-[9px] text-white/40">
              Hands-Free Ready
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
