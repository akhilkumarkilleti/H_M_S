import { useTheme, toggleTheme } from '../theme.js';

export default function ThemeToggle({ className = 'icon-btn' }) {
  const dark = useTheme() === 'dark';
  const text = dark ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button type="button" className={className} onClick={toggleTheme} title={text} aria-label={text}>
      <i className={`fas ${dark ? 'fa-sun' : 'fa-moon'}`} />
    </button>
  );
}