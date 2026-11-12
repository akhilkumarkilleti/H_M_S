import { useEffect, useState } from 'react';
import { categoryApi } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { canManageCategories } from '../constants.js';

const blank = { name: '', description: '', active: true };

export default function Categories() {
  const { user } = useAuth();
  const canManage = canManageCategories(user.role);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | category
  const [form, setForm] = useState(blank);
  const [formErr, setFormErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const refresh = async () => {
    try { setItems(await categoryApi.list()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  const openForm = (c) => {
    setEditing(c);
    setForm(c === 'new' ? blank : { name: c.name, description: c.description ?? '', active: c.active });
    setFormErr('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormErr('Category name is required.');
    setBusy(true); setFormErr('');
    try {
      if (editing === 'new') await categoryApi.create(form);
      else await categoryApi.update(editing.id, form);
      setError(''); setMsg(editing === 'new' ? 'Category added.' : 'Category updated.');
      setEditing(null);
      await refresh();
    } catch (x) { setFormErr(x.message); }
    setBusy(false);
  };

  const run = async (fn, okMessage) => {
    setError(''); setMsg('');
    try { await fn(); setMsg(okMessage); await refresh(); }
    catch (e) { setError(e.message); }
  };

  const toggle = (c) =>
    run(() => categoryApi.update(c.id, { name: c.name, description: c.description, active: !c.active }),
      `${c.name} is now ${c.active ? 'inactive' : 'active'}.`);

  const del = (c) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    run(() => categoryApi.remove(c.id), `${c.name} was deleted.`);
  };

  return (
    <>
      <div className="page-head">
        <h2>Equipment Categories</h2>
        {canManage && (
          <button className="btn-primary" onClick={() => openForm('new')}>
            <i className="fas fa-plus-circle" /> Add category
          </button>
        )}
      </div>

      {error && <div className="alert" style={{ marginBottom: 12 }}>{error}</div>}
      {msg && <div className="alert ok" style={{ marginBottom: 12 }}>{msg}</div>}

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Description</th><th>Status</th><th>Equipment</th>{canManage && <th />}</tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="5" className="empty">Loading categories…</td></tr>}
            {!loading && items.map((c) => (
              <tr key={c.id}>
                <td><b>{c.name}</b></td>
                <td>{c.description || '—'}</td>
                <td><span className={`badge ${c.active ? 'u-ACTIVE' : 'u-DISABLED'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                <td>{c.equipmentCount}</td>
                {canManage && (
                  <td className="row-actions">
                    <button title="Edit" onClick={() => openForm(c)}><i className="fas fa-edit" /></button>
                    <button title={c.active ? 'Deactivate' : 'Activate'} onClick={() => toggle(c)}>
                      <i className={`fas ${c.active ? 'fa-ban' : 'fa-check'}`} />
                    </button>
                    <button title="Delete" onClick={() => del(c)}><i className="fas fa-trash" /></button>
                  </td>
                )}
              </tr>
            ))}
            {!loading && !items.length && <tr><td colSpan="5" className="empty">No categories yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form className="modal" onSubmit={submit} style={{ maxWidth: 460 }}>
            <h3>{editing === 'new' ? 'Add category' : `Edit ${editing.name}`}</h3>
            {formErr && <div className="alert" style={{ marginBottom: 14 }}>{formErr}</div>}
            <div className="form" style={{ marginTop: 0 }}>
              <label>
                Name<span className="req"> *</span>
                <input value={form.name} maxLength={60} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label>
                Description
                <input value={form.description} maxLength={255} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <label style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Active (can be chosen for new equipment)
              </label>
              {editing !== 'new' && editing.equipmentCount > 0 && editing.name !== form.name.trim() && (
                <div className="muted">Renaming also updates {editing.equipmentCount} equipment record(s).</div>
              )}
            </div>
            <div className="actions">
              <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}