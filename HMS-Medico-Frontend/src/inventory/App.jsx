import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Equipment from './pages/Equipment.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import Profile from './pages/Profile.jsx';
import Categories from './pages/Categories.jsx';
import Stock from './pages/Stock.jsx';
import Maintenance from './pages/Maintenance.jsx';
import Assignments from './pages/Assignments.jsx';
import PurchaseOrders from './pages/PurchaseOrders.jsx';
import Reports from './pages/Reports.jsx';

/**
 * "/" is the public Home page for visitors and the app (dashboard) for signed-in users.
 * Any other app URL sends visitors to sign in, then brings them back (e.g. after scanning a QR label).
 */
function Root() {
  const { user } = useAuth();
  const loc = useLocation();
  if (user) return <Layout />;
  if (loc.pathname === '/') return <Home />;
  return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
}

function GuestOnly({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  return user ? <Navigate to={loc.state?.from || '/'} replace /> : children;
}

function AdminOnly({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
      <Route path="/" element={<Root />}>
        <Route index element={<Dashboard />} />
        <Route path="equipment" element={<Equipment />} />
        <Route path="categories" element={<Categories />} />
        <Route path="stock" element={<Stock />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="purchase-orders" element={<PurchaseOrders />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin/users" element={<AdminOnly><AdminUsers /></AdminOnly>} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}