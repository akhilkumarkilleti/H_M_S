import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { changePasswordApi } from '../api.js';
import { label } from '../constants.js';

export default function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ current: '', next: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setOk('');
    try {
      await changePasswordApi(f.current, f.next);
      setOk('Password changed. Signing you out…');
      setTimeout(async () => { await logout(); nav('/login'); }, 1200);
    } catch (x) { setErr(x.message); }
  };

  return (
    <>
      <div className="page-head"><h2>My Profile</h2></div>
      <div className="panel" style={{ padding: 24, maxWidth: 520 }}>
        <dl className="details">
          {[['Name', user.fullName], ['Employee ID', user.employeeId], ['Email', user.email], ['Phone', user.phone], ['Role', label(user.role)], ['Department', user.department]].map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <h3 style={{ margin: '24px 0 12px' }}>Change password</h3>
        <form className="form" onSubmit={submit} style={{ marginTop: 0 }}>
          {err && <div className="alert">{err}</div>}
          {ok && <div className="alert ok">{ok}</div>}
          <label>Current password<input type="password" required value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} /></label>
          <label>New password (8+ chars, letters and numbers)<input type="password" required value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} /></label>
          <button className="btn-primary">Update password</button>
        </form>
      </div>
    </>
  );
}
