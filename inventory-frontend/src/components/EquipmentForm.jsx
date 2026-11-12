import { useState } from 'react';
import { STATUSES, CONDITIONS, label } from '../constants.js';

const blank = {
  name: '', category: '', serialNumber: '', modelNumber: '', manufacturer: '',
  purchaseDate: '', purchasePrice: '', warrantyUntil: '', location: '', status: 'AVAILABLE',
  condition: 'GOOD', assignedTo: '', lastMaintenance: '', nextMaintenance: '',
};

export default function EquipmentForm({ initial, categories = [], onSave, onClose }) {
  const [f, setF] = useState(() => {
    const base = { ...blank };
    if (initial) Object.keys(blank).forEach((k) => { base[k] = initial[k] ?? blank[k]; });
    if (!base.category) base.category = categories.find((c) => c.active)?.name ?? '';
    return base;
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // active categories, plus the item's current one even if it was deactivated later
  const categoryOptions = [...new Set([
    ...categories.filter((c) => c.active).map((c) => c.name),
    ...(f.category ? [f.category] : []),
  ])];

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const text = (k, l, type = 'text', extra = {}) => (
    <label>
      {l}{extra.required && <span className="req"> *</span>}
      <input type={type} value={f[k] ?? ''} onChange={set(k)} {...extra} />
    </label>
  );
  const select = (k, l, opts, fmt = (x) => x) => (
    <label>
      {l}
      <select value={f[k]} onChange={set(k)}>
        {opts.map((o) => <option key={o} value={o}>{fmt(o)}</option>)}
      </select>
    </label>
  );

  const validate = () => {
    if (!f.name.trim()) return 'Equipment name is required.';
    if (!f.category) return 'Select a category.';
    if (f.purchasePrice !== '' && Number(f.purchasePrice) < 0) return 'Purchase price cannot be negative.';
    if (f.purchaseDate && f.warrantyUntil && f.warrantyUntil < f.purchaseDate)
      return 'Warranty end date cannot be before the purchase date.';
    if (f.lastMaintenance && f.nextMaintenance && f.nextMaintenance < f.lastMaintenance)
      return 'Next maintenance cannot be before the last maintenance date.';
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setErr(problem);
    setBusy(true); setErr('');
    try {
      await onSave({ ...f, purchasePrice: Number(f.purchasePrice || 0) });
    } catch (x) {
      setErr(x.message);
      setBusy(false);
    }
  };

  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <h3>{initial ? `Edit ${initial.id}` : 'Add equipment'}</h3>
        {err && <div className="alert" style={{ marginBottom: 14 }}>{err}</div>}
        <div className="grid">
          {text('name', 'Equipment name', 'text', { required: true, maxLength: 150 })}
          {select('category', 'Category', categoryOptions)}
          {text('serialNumber', 'Serial number', 'text', { maxLength: 100 })}
          {text('modelNumber', 'Model number', 'text', { maxLength: 100 })}
          {text('manufacturer', 'Manufacturer', 'text', { maxLength: 100 })}
          {text('location', 'Location', 'text', { maxLength: 150 })}
          {text('purchaseDate', 'Purchase date', 'date')}
          {text('purchasePrice', 'Purchase price (₹)', 'number', { min: 0, step: '0.01' })}
          {text('warrantyUntil', 'Warranty until', 'date')}
          {text('assignedTo', 'Assigned to', 'text', { maxLength: 150 })}
          {select('status', 'Status', STATUSES, label)}
          {select('condition', 'Condition', CONDITIONS, label)}
          {text('lastMaintenance', 'Last maintenance', 'date')}
          {text('nextMaintenance', 'Next maintenance', 'date')}
        </div>
        <div className="actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}