import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import AuthShell from '../components/AuthShell.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ identifier: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await login(f.identifier, f.password); nav(loc.state?.from || '/'); }
    catch (x) { setErr(x.message); }
    finally { setBusy(false); }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in with your email or employee ID.">
      <form onSubmit={submit} className="form">
        {err && <div className="alert">{err}</div>}
        <label>Email or Employee ID<input required autoFocus value={f.identifier} onChange={(e) => setF({ ...f, identifier: e.target.value })} /></label>
        <label>Password<input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        <button className="btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="muted center">New staff member? <Link to="/register">Register</Link></p>
    </AuthShell>
  );
}