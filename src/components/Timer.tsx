import { useTimer } from '../hooks/useTimer';
import { TimerSettings } from '../types/timer';

interface TimerProps {
  settings: TimerSettings;
}

export const Timer = ({ settings }: TimerProps) => {
  const { state, start, pause, reset, formatTime } = useTimer(settings);

  return (
    <div>
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
        <div className="muted">Offline-ready • Minimal</div>
      </div>
    </div>
  );
};
