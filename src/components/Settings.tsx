import { TimerSettings } from '../types/timer';

interface SettingsProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

export const Settings = ({ settings, onSettingsChange }: SettingsProps) => {
  const handleWorkDurationChange = (value: number) => {
    onSettingsChange({ ...settings, workDuration: value });
  };

  const handleBreakDurationChange = (value: number) => {
    onSettingsChange({ ...settings, breakDuration: value });
  };

  const handleSoundToggle = () => {
    onSettingsChange({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  return (
    <div className="settings">
      <div>
        <small>Work (min)</small>
        <div className="input-inline">
          <input
            type="number"
            min="1"
            value={settings.workDuration}
            onChange={(e) => handleWorkDurationChange(parseInt(e.target.value) || 1)}
          />
          <span className="muted">min</span>
        </div>
      </div>
      <div>
        <small>Break (min)</small>
        <div className="input-inline">
          <input
            type="number"
            min="1"
            value={settings.breakDuration}
            onChange={(e) => handleBreakDurationChange(parseInt(e.target.value) || 1)}
          />
          <span className="muted">min</span>
        </div>
      </div>
      <div>
        <small>Sound</small>
        <div className="input-inline">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={handleSoundToggle}
          />
        </div>
      </div>
    </div>
  );
};
