import { useSyncExternalStore } from 'react';

const KEY = 'hms-theme';
const listeners = new Set();
let current = 'light';

function readInitial() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* storage unavailable */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const apply = () => { document.documentElement.dataset.theme = current; };

/** Call once before the first render so the page never flashes the wrong theme. */
export function initTheme() { current = readInitial(); apply(); }

export function setTheme(next) {
  current = next;
  try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
  apply();
  listeners.forEach((l) => l());
}
export const toggleTheme = () => setTheme(current === 'dark' ? 'light' : 'dark');

const subscribe = (cb) => { listeners.add(cb); return () => listeners.delete(cb); };
export const useTheme = () => useSyncExternalStore(subscribe, () => current);