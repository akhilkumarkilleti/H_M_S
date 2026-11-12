import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-top">
        <Link to="/" className="auth-home"><i className="fas fa-house" /> Home</Link>
        <ThemeToggle className="icon-btn theme-btn" />
      </div>
      <div className="auth-card">
        <div className="brand"><span className="brand-icon"><i className="fas fa-heartbeat" /></span><h1>Med<span>Care</span></h1></div>
        <h2>{title}</h2>
        <p className="muted">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}