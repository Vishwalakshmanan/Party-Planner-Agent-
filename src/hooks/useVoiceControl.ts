import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API interface declarations
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export interface UseVoiceControlOptions {
  onTranscriptReceived?: (transcript: string) => void;
  onCommandRecognized?: (command: string) => void;
  enableSpeechOutput?: boolean;
}

export function useVoiceControl({
  onTranscriptReceived,
  onCommandRecognized,
  enableSpeechOutput = true,
}: UseVoiceControlOptions = {}) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isContinuous, setIsContinuous] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const shouldListenRef = useRef<boolean>(false);
  const onCommandRef = useRef(onCommandRecognized);
  const onTranscriptRef = useRef(onTranscriptReceived);

  useEffect(() => {
    onCommandRef.current = onCommandRecognized;
    onTranscriptRef.current = onTranscriptReceived;
  }, [onCommandRecognized, onTranscriptReceived]);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            finalTranscript += text;
          } else {
            currentInterim += text;
          }
        }

        setInterimTranscript(currentInterim);

        if (finalTranscript.trim()) {
          const cleanFinal = finalTranscript.trim();
          setTranscript(cleanFinal);
          setInterimTranscript('');
          if (onTranscriptRef.current) {
            onTranscriptRef.current(cleanFinal);
          }
          if (onCommandRef.current) {
            onCommandRef.current(cleanFinal);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition status/error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions.');
          shouldListenRef.current = false;
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Normal timeout when no speech is detected in interval
        } else {
          setErrorMessage(`Speech recognition notice: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // If continuous mode is enabled and user hasn't explicitly stopped, restart
        if (shouldListenRef.current && isContinuous) {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error('Failed to initialize speech recognition:', err);
      setIsSupported(false);
    }

    return () => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isContinuous]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setErrorMessage('Speech recognition is not supported in this browser environment.');
      return;
    }
    shouldListenRef.current = true;
    setErrorMessage(null);
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e: any) {
      // Already running
      setIsListening(true);
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Text to Speech
  const speakText = useCallback(
    (text: string) => {
      if (isMuted || !enableSpeechOutput || typeof window === 'undefined' || !window.speechSynthesis) {
        return;
      }

      try {
        window.speechSynthesis.cancel(); // stop current utterance
        const cleanText = text.replace(/[*#_`]/g, '').trim();
        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
        setIsSpeaking(false);
      }
    },
    [isMuted, enableSpeechOutput]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    isSupported,
    isContinuous,
    setIsContinuous,
    isMuted,
    setIsMuted,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    speakText,
    stopSpeaking,
  };
}
