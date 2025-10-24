import { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <button
      className="toggle"
      onClick={onToggle}
      aria-label="toggle theme"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
};
