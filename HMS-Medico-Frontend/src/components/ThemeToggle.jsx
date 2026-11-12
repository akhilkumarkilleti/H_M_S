import { useTheme } from "../theme";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <circle cx="12" cy="12" r="4.4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="1.8" x2="12" y2="4.4" />
        <line x1="12" y1="19.6" x2="12" y2="22.2" />
        <line x1="1.8" y1="12" x2="4.4" y2="12" />
        <line x1="19.6" y1="12" x2="22.2" y2="12" />
        <line x1="4.8" y1="4.8" x2="6.6" y2="6.6" />
        <line x1="17.4" y1="17.4" x2="19.2" y2="19.2" />
        <line x1="4.8" y1="19.2" x2="6.6" y2="17.4" />
        <line x1="17.4" y1="6.6" x2="19.2" y2="4.8" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M20.4 14.2A8.6 8.6 0 0 1 9.8 3.6a8.6 8.6 0 1 0 10.6 10.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ThemeToggle({ floating = false, className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={[
        "theme-toggle",
        floating ? "theme-toggle-floating" : "",
        isDark ? "is-dark" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-hint theme-toggle-hint-sun">
          <SunIcon />
        </span>
        <span className="theme-toggle-hint theme-toggle-hint-moon">
          <MoonIcon />
        </span>
        <span className="theme-toggle-knob">
          <span className="theme-toggle-knob-icon">
            {isDark ? <MoonIcon /> : <SunIcon />}
          </span>
        </span>
      </span>
    </button>
  );
}