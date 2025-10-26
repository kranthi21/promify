import { useTimer } from '../hooks/useTimer';
import { TimerSettings } from '../types/timer';
import { CircularProgress } from './CircularProgress';

interface TimerProps {
  settings: TimerSettings;
  selectedEventTitle?: string;
  onSessionComplete?: (cycles: number, totalTime: number) => void;
}

export const Timer = ({ settings, selectedEventTitle, onSessionComplete }: TimerProps) => {
  const { state, start, pause, reset, formatTime } = useTimer(settings, onSessionComplete);

  const totalSeconds = state.isWork
    ? settings.workDuration * 60
    : settings.breakDuration * 60;
  const progress = (state.remaining / totalSeconds) * 100;

  return (
    <div>
      {selectedEventTitle && (
        <div className="current-event">
          <span className="event-label">Working on:</span>
          <span className="event-name">{selectedEventTitle}</span>
        </div>
      )}

      <div className="timer-container">
        <CircularProgress progress={progress} isWork={state.isWork} />
        <div className="timer">{formatTime(state.remaining)}</div>
      </div>

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
