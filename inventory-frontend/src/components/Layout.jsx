import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const links = [
  ['/', 'fa-chart-pie', 'Dashboard'],
  ['/equipment', 'fa-stethoscope', 'Equipment'],
  ['/stock', 'fa-boxes', 'Stock Management'],
  ['/assignments', 'fa-user-check', 'Assignments'],
  ['/maintenance', 'fa-tools', 'Maintenance'],
  ['/purchase-orders', 'fa-truck', 'Purchase Orders'],
  ['/reports', 'fa-chart-bar', 'Reports'],
  ['/categories', 'fa-tags', 'Categories'],
];

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const name = user?.fullName || user?.email || 'User';

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand"><span className="brand-icon"><i className="fas fa-heartbeat" /></span><h1>Med<span>Care</span></h1></div>
        <nav>
          {[...links, ...(isAdmin ? [['/admin/users', 'fa-users-gear', 'User Management']] : []), ['/profile', 'fa-user-circle', 'My Profile']].map(([to, icon, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>
              <i className={`fas ${icon}`} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="user-card">
          <div className="avatar">{name[0].toUpperCase()}</div>
          <div className="uname">{name}</div>
          <ThemeToggle />
          <button className="icon-btn" title="Logout" onClick={async () => { await logout(); nav('/login'); }}><i className="fas fa-sign-out-alt" /></button>
        </div>
      </aside>
      <main className="main">
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu"><i className="fas fa-bars" /></button>
        <Outlet />
      </main>
    </div>
  );
}