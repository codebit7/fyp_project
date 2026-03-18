import { useState, useEffect, useRef } from 'react';
import { audioStreamService } from '../services/websocket/audioStreamService';

interface RecorderState {
  isRecording: boolean;
  isConnected: boolean;
  mistakes: string[];
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetMistakes: () => void;
}

/** Fallback mistakes shown when WebSocket backend is not running */
const DEMO_MISTAKES = [
  "Pronunciation: 'Ra' should be heavier",
  "Tajweed: Missing Ghunnah on 'Noon'",
  "Makhraj: 'Ha' should be from the middle of the throat",
  'Rhythm: Slightly too fast here',
  "Vowel: 'Kasra' was too short",
];

/**
 * useRecorder
 *
 * Wraps the AudioStreamService to expose simple boolean flags and
 * a running list of mistake messages.  When the WebSocket server is
 * unavailable the hook falls back to a demo simulation so the UI
 * still works in development.
 */
export const useRecorder = (): RecorderState => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const demoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Register WebSocket callbacks once on mount
  useEffect(() => {
    audioStreamService.setCallbacks(
      (result) => {
        setMistakes((prev) => [...prev, result.message].slice(-3));
      },
      (connected) => {
        setIsConnected(connected);
      }
    );
  }, []);

  const startRecording = async (): Promise<void> => {
    setMistakes([]);
    setIsRecording(true);

    try {
      await audioStreamService.startStreaming();
    } catch {
      // Backend not available – run demo simulation instead
      console.warn('useRecorder: WebSocket unavailable, running demo mode');
      runDemoSimulation();
    }
  };

  const stopRecording = (): void => {
    audioStreamService.stopStreaming();
    clearDemoSimulation();
    setIsRecording(false);
    setIsConnected(false);
  };

  const resetMistakes = (): void => {
    setMistakes([]);
  };

  // ─── Demo simulation helpers ───────────────────────────────────────────────

  const runDemoSimulation = (): void => {
    demoIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.7) {
        const mistake = DEMO_MISTAKES[Math.floor(Math.random() * DEMO_MISTAKES.length)];
        setMistakes((prev) => [...prev, mistake].slice(-3));
      }
    }, 3000);
  };

  const clearDemoSimulation = (): void => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      audioStreamService.stopStreaming();
      clearDemoSimulation();
    };
  }, []);

  return { isRecording, isConnected, mistakes, startRecording, stopRecording, resetMistakes };
};
