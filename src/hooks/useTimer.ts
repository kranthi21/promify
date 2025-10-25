import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState, TimerSettings } from '../types/timer';
import { playNotificationSound, vibrate } from '../lib/audio';

export const useTimer = (
  settings: TimerSettings,
  onSessionComplete?: (cycles: number, totalTime: number) => void
) => {
  const [state, setState] = useState<TimerState>({
    remaining: settings.workDuration * 60,
    isRunning: false,
    isWork: true,
    cycles: 0,
  });

  const intervalRef = useRef<number | null>(null);
  const totalTimeRef = useRef<number>(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.remaining > 0) {
        if (prev.isWork) {
          totalTimeRef.current += 1;
        }
        return { ...prev, remaining: prev.remaining - 1 };
      } else {
        if (settings.soundEnabled) {
          playNotificationSound();
        }
        vibrate();

        const newCycles = prev.isWork ? prev.cycles + 1 : prev.cycles;
        const nextIsWork = !prev.isWork;
        const nextRemaining = nextIsWork
          ? settings.workDuration * 60
          : settings.breakDuration * 60;

        return {
          ...prev,
          isWork: nextIsWork,
          cycles: newCycles,
          remaining: nextRemaining,
        };
      }
    });
  }, [settings]);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = window.setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, tick]);

  const start = () => {
    setState((prev) => ({ ...prev, isRunning: true }));
  };

  const pause = () => {
    setState((prev) => ({ ...prev, isRunning: false }));
  };

  const reset = () => {
    if (onSessionComplete && state.cycles > 0) {
      onSessionComplete(state.cycles, totalTimeRef.current);
    }

    setState({
      remaining: settings.workDuration * 60,
      isRunning: false,
      isWork: true,
      cycles: 0,
    });
    totalTimeRef.current = 0;
  };

  useEffect(() => {
    if (state.isWork) {
      setState((prev) => ({ ...prev, remaining: settings.workDuration * 60 }));
    } else {
      setState((prev) => ({ ...prev, remaining: settings.breakDuration * 60 }));
    }
  }, [settings.workDuration, settings.breakDuration, state.isWork]);

  return {
    state,
    start,
    pause,
    reset,
    formatTime,
  };
};
