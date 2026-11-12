import { useEffect, useState } from 'react';
import { stockApi } from '../api.js';
import { label } from '../constants.js';

const when = (iso) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

function useSubmit(action) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const run = async (e, problem) => {
    e.preventDefault();
    if (problem) return setErr(problem);
    setBusy(true); setErr('');
    try { await action(); }                       // the page closes the modal on success
    catch (x) { setErr(x.message); setBusy(false); }
  };
  return { busy, err, run };
}

function Shell({ title, err, busy, submitText, onSubmit, onClose, width = 620, children }) {
  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={onSubmit} style={{ maxWidth: width }}>
        <h3>{title}</h3>
        {err && <div className="alert" style={{ marginBottom: 14 }}>{err}</div>}
        {children}
        <div className="actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : submitText}</button>
        </div>
      </form>
    </div>
  );
}

const UNITS = ['pcs', 'box', 'pack', 'strip', 'vial', 'bottle', 'ml', 'litre', 'kg', 'pair', 'roll', 'set'];
const wholeNumber = (v) => v !== '' && Number.isInteger(Number(v)) && Number(v) >= 0;

/** Add a new stock item, or edit one. Quantity can only change through movements. */
export function ItemModal({ item, categories, onSave, onClose }) {
  const editing = Boolean(item);
  const [f, setF] = useState({
    name: item?.name ?? '', category: item?.category ?? '', unit: item?.unit ?? '',
    openingQuantity: '0', reorderLevel: item ? String(item.reorderLevel) : '0',
    unitPrice: item ? String(item.unitPrice) : '0', expiryDate: item?.expiryDate ?? '',
    location: item?.location ?? '', active: item?.active ?? true,
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const { busy, err, run } = useSubmit(() => {
    const body = {
      name: f.name.trim(), category: f.category.trim(), unit: f.unit.trim(),
      reorderLevel: Number(f.reorderLevel), unitPrice: Number(f.unitPrice),
      expiryDate: f.expiryDate, location: f.location,        // empty text clears the value on update
    };
    if (editing) body.active = f.active; else body.openingQuantity = Number(f.openingQuantity);
    return onSave(body);
  });

  const submit = (e) => run(e,
    !f.name.trim() ? 'Item name is required.'
      : !f.category.trim() ? 'Category is required.'
        : !f.unit.trim() ? 'Unit is required (for example pcs, box, ml).'
          : !editing && !wholeNumber(f.openingQuantity) ? 'Opening quantity must be a whole number, 0 or more.'
            : !wholeNumber(f.reorderLevel) ? 'Reorder level must be a whole number, 0 or more.'
              : f.unitPrice === '' || Number(f.unitPrice) < 0 ? 'Unit price cannot be negative.' : '');

  return (
    <Shell title={editing ? `Edit ${item.name}` : 'Add stock item'} err={err} busy={busy}
           submitText={editing ? 'Save changes' : 'Add item'} onSubmit={submit} onClose={onClose}>
      <div className="grid">
        <label>Item name<span className="req"> *</span>
          <input value={f.name} maxLength={150} onChange={set('name')} />
        </label>
        <label>Category<span className="req"> *</span>
          <input list="stock-categories" value={f.category} maxLength={60} onChange={set('category')} />
          <datalist id="stock-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </label>
        <label>Unit<span className="req"> *</span>
          <input list="stock-units" value={f.unit} maxLength={30} onChange={set('unit')} />
          <datalist id="stock-units">{UNITS.map((u) => <option key={u} value={u} />)}</datalist>
        </label>
        {!editing && (
          <label>Opening quantity
            <input type="number" min="0" step="1" value={f.openingQuantity} onChange={set('openingQuantity')} />
          </label>
        )}
        <label>Reorder level
          <input type="number" min="0" step="1" value={f.reorderLevel} onChange={set('reorderLevel')} />
        </label>
        <label>Unit price (₹)
          <input type="number" min="0" step="0.01" value={f.unitPrice} onChange={set('unitPrice')} />
        </label>
        <label>Expiry date
          <input type="date" value={f.expiryDate} onChange={set('expiryDate')} />
        </label>
        <label>Storage location
          <input value={f.location} maxLength={150} placeholder="e.g. Main store, Rack B2" onChange={set('location')} />
        </label>
        {editing && (
          <label>Status
            <select value={String(f.active)} onChange={(e) => setF({ ...f, active: e.target.value === 'true' })}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>
        )}
      </div>
      {editing
        ? <p className="muted" style={{ marginTop: 12 }}>Current quantity is {item.quantity} {item.unit}. To change it, record a stock movement.</p>
        : <p className="muted" style={{ marginTop: 12 }}>An opening quantity above 0 is recorded as “Opening stock”.</p>}
    </Shell>
  );
}

const TYPES = ['RECEIVED', 'ISSUED', 'RETURNED', 'TRANSFERRED'];
const REF_HINT = {
  RECEIVED: 'Supplier, PO or invoice number', ISSUED: 'Issue slip number',
  RETURNED: 'Return slip number', TRANSFERRED: 'Transfer slip number',
};

/** Receive, issue, return or transfer stock. */
export function MovementModal({ item, initialType, departments, onSave, onClose }) {
  const [f, setF] = useState({ type: initialType, quantity: '', fromDepartment: '', toDepartment: '', reference: '', remarks: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const needsFrom = f.type === 'RETURNED' || f.type === 'TRANSFERRED';
  const needsTo = f.type === 'ISSUED' || f.type === 'TRANSFERRED';
  const outgoing = f.type === 'ISSUED' || f.type === 'TRANSFERRED';
  const n = Number(f.quantity);
  const valid = Number.isInteger(n) && n >= 1;
  const after = !valid ? null : f.type === 'ISSUED' ? item.quantity - n
    : f.type === 'TRANSFERRED' ? item.quantity : item.quantity + n;

  const { busy, err, run } = useSubmit(() => onSave({
    type: f.type, quantity: n,
    fromDepartment: needsFrom ? f.fromDepartment : '', toDepartment: needsTo ? f.toDepartment : '',
    reference: f.reference, remarks: f.remarks,
  }));

  const submit = (e) => run(e,
    !valid ? 'Enter a whole-number quantity of 1 or more.'
      : needsFrom && !f.fromDepartment.trim() ? (f.type === 'RETURNED' ? 'Enter the department the stock is returned from.' : 'Enter the “from” department.')
        : needsTo && !f.toDepartment.trim() ? (f.type === 'ISSUED' ? 'Enter the department the stock is issued to.' : 'Enter the “to” department.')
          : f.type === 'TRANSFERRED' && f.fromDepartment.trim().toLowerCase() === f.toDepartment.trim().toLowerCase() ? '“From” and “to” departments must be different.'
            : outgoing && n > item.quantity ? `Not enough stock. Only ${item.quantity} ${item.unit} available.`
              : f.type === 'ISSUED' && item.expiryStatus === 'EXPIRED' ? 'This item has expired and cannot be issued.' : '');

  return (
    <Shell title={`Record movement — ${item.name}`} err={err} busy={busy} submitText="Record" onSubmit={submit} onClose={onClose} width={560}>
      <p className="muted" style={{ marginBottom: 12 }}>
        {item.id} · current stock <b>{item.quantity} {item.unit}</b>
        {after != null && f.type !== 'TRANSFERRED' && <> → after this: <b className={after < 0 ? 'neg' : ''}>{after} {item.unit}</b></>}
      </p>
      <div className="grid">
        <label>Movement
          <select value={f.type} onChange={set('type')}>{TYPES.map((t) => <option key={t} value={t}>{label(t)}</option>)}</select>
        </label>
        <label>Quantity ({item.unit})<span className="req"> *</span>
          <input type="number" min="1" step="1" value={f.quantity} onChange={set('quantity')} autoFocus />
        </label>
        {needsFrom && (
          <label>From department<span className="req"> *</span>
            <input list="stock-depts" value={f.fromDepartment} maxLength={100} onChange={set('fromDepartment')} />
          </label>
        )}
        {needsTo && (
          <label>To department<span className="req"> *</span>
            <input list="stock-depts" value={f.toDepartment} maxLength={100} onChange={set('toDepartment')} />
          </label>
        )}
        <datalist id="stock-depts">{departments.map((d) => <option key={d} value={d} />)}</datalist>
        <label>Reference
          <input value={f.reference} maxLength={100} placeholder={REF_HINT[f.type]} onChange={set('reference')} />
        </label>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        <span>Remarks</span>
        <input value={f.remarks} maxLength={255} onChange={set('remarks')} />
      </label>
    </Shell>
  );
}

/** Movement history of one item. */
export function HistoryModal({ item, onClose }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { stockApi.itemMovements(item.id).then(setRows).catch((e) => setErr(e.message)); }, [item.id]);

  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 860 }}>
        <h3>{item.name} <span className="muted">{item.id} · now {item.quantity} {item.unit}</span></h3>
        {err && <div className="alert">{err}</div>}
        {!rows && !err && <p className="muted">Loading history…</p>}
        {rows && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>When</th><th>Movement</th><th>Qty</th><th>Stock after</th><th>From</th><th>To</th><th>Reference</th><th>By</th></tr></thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id}>
                    <td>{when(m.createdAt)}</td>
                    <td><span className={`badge ${m.type}`}>{label(m.type)}</span></td>
                    <td>{m.quantity}</td><td>{m.quantityAfter}</td>
                    <td>{m.fromDepartment || '—'}</td><td>{m.toDepartment || '—'}</td>
                    <td>{m.reference || '—'}{m.remarks && <div className="muted">{m.remarks}</div>}</td>
                    <td>{m.performedBy}</td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan="8" className="empty">No movements yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
        <p className="muted" style={{ marginTop: 10 }}>Shows the latest 200 movements of this item.</p>
        <div className="actions"><button className="btn-primary" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}