import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import AuthShell from '../components/AuthShell.jsx';
import { ROLES, label } from '../constants.js';

export default function Register() {
  const { register } = useAuth();
  const [f, setF] = useState({ fullName: '', employeeId: '', phone: '', email: '', role: 'STORE_KEEPER', department: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/\d/.test(f.password))
      return setErr('Password must be 8+ characters with letters and numbers');
    if (f.password !== f.confirm) return setErr('Passwords do not match');
    setBusy(true);
    try {
      const { confirm, ...payload } = f;
      setDone(await register(payload));
    } catch (x) { setErr(x.message); }
    finally { setBusy(false); }
  };

  if (done) return (
    <AuthShell title="Registration received" subtitle="">
      <div className="alert ok">
        {done.status === 'ACTIVE'
          ? `Welcome, ${done.fullName}! You are the first user, so your account is an active ADMIN account.`
          : `Thanks, ${done.fullName}. Your account is waiting for administrator approval. You can sign in once it is approved.`}
      </div>
      <p className="center"><Link className="btn-primary" to="/login">Go to sign in</Link></p>
    </AuthShell>
  );

  return (
    <AuthShell title="Create account" subtitle="An administrator must approve new accounts.">
      <form onSubmit={submit} className="form">
        {err && <div className="alert">{err}</div>}
        <label>Full name<input required minLength={3} value={f.fullName} onChange={set('fullName')} /></label>
        <label>Employee ID<input required value={f.employeeId} onChange={set('employeeId')} /></label>
        <label>Phone<input required placeholder="10–15 digits" value={f.phone} onChange={set('phone')} /></label>
        <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
        <label>Role
          <select value={f.role} onChange={set('role')}>{ROLES.filter((r) => r !== 'ADMIN').map((r) => <option key={r} value={r}>{label(r)}</option>)}</select>
        </label>
        <label>Department<input required value={f.department} onChange={set('department')} /></label>
        <label>Password<input type="password" required value={f.password} onChange={set('password')} /></label>
        <label>Confirm password<input type="password" required value={f.confirm} onChange={set('confirm')} /></label>
        <button className="btn-primary" disabled={busy}>{busy ? 'Submitting…' : 'Register'}</button>
      </form>
      <p className="muted center">Already registered? <Link to="/login">Sign in</Link></p>
    </AuthShell>
  );
}
