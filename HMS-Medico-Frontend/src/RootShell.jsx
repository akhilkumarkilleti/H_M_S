import { lazy, Suspense } from 'react';
import App from './App.jsx';

const InventoryEntry = lazy(() => import('./inventory/entry.jsx'));

export default function RootShell() {
  const base = import.meta.env.BASE_URL;
  if (window.location.pathname.startsWith(base + 'inventory')) {
    return (
      <Suspense fallback={null}>
        <InventoryEntry />
      </Suspense>
    );
  }
  return <App />;
}