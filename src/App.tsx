import { useState } from 'react';
import { Timer } from './components/Timer';
import { Settings } from './components/Settings';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { TimerSettings } from './types/timer';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 25,
    breakDuration: 5,
    soundEnabled: true,
  });

  return (
    <div className="wrap">
      <div className="card">
        <div className="title">
          <h2>Pomify</h2>
          <div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>

        <Timer settings={settings} />

        <Settings settings={settings} onSettingsChange={setSettings} />

        <div style={{ marginTop: '14px' }}>
          <div className="ad-placeholder">Ad Banner Placeholder</div>
        </div>
      </div>
    </div>
  );
}

export default App;
