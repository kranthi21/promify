import { useTimer } from '../hooks/useTimer';
import { TimerSettings } from '../types/timer';

interface TimerProps {
  settings: TimerSettings;
  selectedEventTitle?: string;
  onSessionComplete?: (cycles: number, totalTime: number) => void;
}

export const Timer = ({ settings, selectedEventTitle, onSessionComplete }: TimerProps) => {
  const { state, start, pause, reset, formatTime } = useTimer(settings, onSessionComplete);

  return (
    <div>
      {selectedEventTitle && (
        <div className="current-event">
          <span className="event-label">Working on:</span>
          <span className="event-name">{selectedEventTitle}</span>
        </div>
      )}

      <div className="timer">{formatTime(state.remaining)}</div>

      <div className="controls">
        <button onClick={start} disabled={state.isRunning}>
          Start
        </button>
        <button onClick={pause} disabled={!state.isRunning}>
          Pause
        </button>
        <button onClick={reset}>Reset</button>
      </div>

      <div className="footer">
        <div className="cycle">
          Cycles: <span>{state.cycles}</span>
        </div>
        <div className="muted">Focus • Track • Achieve</div>
      </div>
    </div>
  );
};
