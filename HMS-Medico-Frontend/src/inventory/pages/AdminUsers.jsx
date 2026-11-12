import { useEffect, useState } from 'react';
import { adminApi } from '../api.js';
import { label } from '../constants.js';

const TABS = ['PENDING', 'ACTIVE', 'REJECTED', 'DISABLED', ''];

export default function AdminUsers() {
  const [tab, setTab] = useState('PENDING');
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => adminApi.list(tab).then(setUsers).catch((e) => setErr(e.message));
  useEffect(() => { setErr(''); load(); }, [tab]);

  const act = async (u, action) => {
    setErr(''); setMsg('');
    try { await adminApi.act(u.id, action); setMsg(`${u.fullName}: ${action} done`); load(); }
    catch (e) { setErr(e.message); }
  };
  const reset = async (u) => {
    const pw = prompt(`New password for ${u.fullName} (8+ chars, letters and numbers):`);
    if (!pw) return;
    try { await adminApi.resetPassword(u.id, pw); setMsg(`Password reset for ${u.fullName}`); }
    catch (e) { setErr(e.message); }
  };

  return (
    <>
      <div className="page-head"><h2>User Management</h2></div>
      <div className="toolbar">
        {TABS.map((t) => (
          <button key={t || 'all'} className={tab === t ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab(t)}>{t ? label(t) : 'All'}</button>
        ))}
      </div>
      {err && <div className="alert">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}
      <div className="panel table-wrap" style={{ marginTop: 12 }}>
        <table>
          <thead><tr><th>Name</th><th>Employee ID</th><th>Email</th><th>Phone</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><b>{u.fullName}</b></td><td>{u.employeeId}</td><td>{u.email}</td><td>{u.phone}</td>
                <td>{label(u.role)}</td><td>{u.department}</td>
                <td>
                  <span className={`badge u-${u.status}`}>{label(u.status)}</span>
                  {u.locked && <span className="badge u-REJECTED" style={{ marginLeft: 6 }}>Locked</span>}
                </td>
                <td className="row-actions">
                  {u.status !== 'ACTIVE' && <button title="Approve" onClick={() => act(u, 'approve')}><i className="fas fa-check" /></button>}
                  {u.status === 'PENDING' && <button title="Reject" onClick={() => act(u, 'reject')}><i className="fas fa-xmark" /></button>}
                  {u.status === 'ACTIVE' && <button title="Disable" onClick={() => act(u, 'disable')}><i className="fas fa-ban" /></button>}
                  {u.locked && <button title="Unlock (too many failed logins)" onClick={() => act(u, 'unlock')}><i className="fas fa-lock-open" /></button>}
                  <button title="Reset password" onClick={() => reset(u)}><i className="fas fa-key" /></button>
                </td>
              </tr>
            ))}
            {!users.length && <tr><td colSpan="8" className="empty">No users in this list.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}