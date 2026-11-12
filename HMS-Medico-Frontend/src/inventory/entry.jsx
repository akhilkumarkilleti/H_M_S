import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { initTheme } from './theme.js';
import './styles.css';

initTheme();

export default function InventoryEntry() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL + 'inventory'}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}