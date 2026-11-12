import { useState } from 'react';
import { inr } from '../constants.js';

// local date as yyyy-MM-dd (toISOString() would use UTC and can be a day off early in the morning in India)
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

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

/** Add or edit a supplier. */
export function SupplierModal({ record, onSave, onClose }) {
  const [f, setF] = useState({
    name: record?.name ?? '', contactPerson: record?.contactPerson ?? '', phone: record?.phone ?? '',
    email: record?.email ?? '', taxId: record?.taxId ?? '', address: record?.address ?? '',
    active: record?.active ?? true,
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const { busy, err, run } = useSubmit(() => onSave(f));

  const submit = (e) => run(e,
    !f.name.trim() ? 'Supplier name is required.'
      : f.email && !/^\S+@\S+\.\S+$/.test(f.email) ? 'Enter a valid email address.' : '');

  return (
    <Shell title={record ? `Edit ${record.name}` : 'Add supplier'} err={err} busy={busy}
           submitText="Save" onSubmit={submit} onClose={onClose}>
      <div className="grid">
        <label>Supplier name<span className="req"> *</span>
          <input value={f.name} maxLength={150} onChange={set('name')} />
        </label>
        <label>Contact person
          <input value={f.contactPerson} maxLength={150} onChange={set('contactPerson')} />
        </label>
        <label>Phone
          <input value={f.phone} maxLength={30} onChange={set('phone')} />
        </label>
        <label>Email
          <input type="email" value={f.email} maxLength={150} onChange={set('email')} />
        </label>
        <label>GSTIN / tax ID
          <input value={f.taxId} maxLength={30} onChange={set('taxId')} />
        </label>
        {record && (
          <label>Status
            <select value={String(f.active)} onChange={(e) => setF({ ...f, active: e.target.value === 'true' })}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>
        )}
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        <span>Address</span>
        <input value={f.address} maxLength={255} onChange={set('address')} />
      </label>
    </Shell>
  );
}

const blankLine = { itemId: '', quantity: '', unitPrice: '' };

/** Create a draft order, or edit one. `prefill` = lines to start with (e.g. low-stock suggestions). */
export function OrderModal({ record, suppliers, stockItems, suggestions, prefill, onSave, onClose }) {
  const today = todayIso();
  const [f, setF] = useState({
    supplierId: record?.supplierId ?? '',
    orderDate: record?.orderDate ?? today,
    expectedDate: record?.expectedDate ?? '',
    notes: record?.notes ?? '',
    lines: record
      ? record.lines.map((l) => ({ itemId: l.itemId, quantity: String(l.orderedQty), unitPrice: String(l.unitPrice) }))
      : (prefill?.length ? prefill : [{ ...blankLine }]),
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setLine = (i, patch) => setF({ ...f, lines: f.lines.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
  const pickItem = (i) => (e) => {
    const item = stockItems.find((s) => s.id === e.target.value);
    setLine(i, { itemId: e.target.value, unitPrice: f.lines[i].unitPrice || (item ? String(item.unitPrice) : '') });
  };

  const usable = suppliers.filter((s) => s.active || s.id === record?.supplierId);
  const items = stockItems.filter((s) => s.active);
  const chosen = new Set(f.lines.map((l) => l.itemId));
  const missing = (suggestions || []).filter((s) => !chosen.has(s.itemId));
  const total = f.lines.reduce((t, l) => t + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0), 0);

  const addSuggestions = () => setF({
    ...f,
    lines: [
      ...f.lines.filter((l) => l.itemId),
      ...missing.map((s) => ({ itemId: s.itemId, quantity: String(s.suggestedQty), unitPrice: String(s.unitPrice) })),
    ],
  });

  const { busy, err, run } = useSubmit(() => onSave({
    supplierId: f.supplierId, orderDate: f.orderDate, expectedDate: f.expectedDate, notes: f.notes,
    lines: f.lines.map((l) => ({
      itemId: l.itemId, quantity: Number(l.quantity), unitPrice: l.unitPrice === '' ? null : Number(l.unitPrice),
    })),
  }));

  const lineProblem = () => {
    const seen = new Set();
    for (const l of f.lines) {
      if (!l.itemId) return 'Select an item on every line (or remove the empty line).';
      if (seen.has(l.itemId)) return `${l.itemId} is listed twice. Combine the quantities into one line.`;
      seen.add(l.itemId);
      if (!Number.isInteger(Number(l.quantity)) || Number(l.quantity) < 1) return `Enter a whole-number quantity for ${l.itemId}.`;
      if (l.unitPrice !== '' && Number(l.unitPrice) < 0) return `Price for ${l.itemId} cannot be negative.`;
    }
    return '';
  };

  const submit = (e) => run(e,
    !f.supplierId ? 'Select the supplier.'
      : f.orderDate > today ? 'Order date cannot be in the future.'
        : f.expectedDate && f.expectedDate < f.orderDate ? 'Expected delivery cannot be before the order date.'
          : lineProblem());

  return (
    <Shell title={record ? `Edit ${record.id}` : 'New purchase order'} err={err} busy={busy}
           submitText="Save draft" onSubmit={submit} onClose={onClose} width={760}>
      <div className="grid">
        <label>Supplier<span className="req"> *</span>
          <select value={f.supplierId} onChange={set('supplierId')}>
            <option value="">{usable.length ? 'Select supplier…' : 'Add a supplier first'}</option>
            {usable.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
          </select>
        </label>
        <label>Order date
          <input type="date" value={f.orderDate} max={today} onChange={set('orderDate')} />
        </label>
        <label>Expected delivery
          <input type="date" value={f.expectedDate} min={f.orderDate || undefined} onChange={set('expectedDate')} />
        </label>
      </div>

      <div className="line-head"><span>Item</span><span>Quantity</span><span>Price (₹)</span><span /></div>
      {f.lines.map((l, i) => (
        <div className="line-row" key={i}>
          <select value={l.itemId} onChange={pickItem(i)}>
            <option value="">Select item…</option>
            {items.map((s) => <option key={s.id} value={s.id}>{s.id} — {s.name} ({s.quantity} {s.unit} in stock)</option>)}
          </select>
          <input type="number" min="1" step="1" placeholder="Qty" value={l.quantity}
                 onChange={(e) => setLine(i, { quantity: e.target.value })} />
          <input type="number" min="0" step="0.01" placeholder="Unit price" value={l.unitPrice}
                 onChange={(e) => setLine(i, { unitPrice: e.target.value })} />
          <button type="button" className="btn-secondary" title="Remove line" disabled={f.lines.length === 1}
                  onClick={() => setF({ ...f, lines: f.lines.filter((_, j) => j !== i) })}>
            <i className="fas fa-trash" />
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
        <button type="button" className="btn-secondary" onClick={() => setF({ ...f, lines: [...f.lines, { ...blankLine }] })}>
          <i className="fas fa-plus" /> Add item
        </button>
        {missing.length > 0 && (
          <button type="button" className="btn-secondary" onClick={addSuggestions}>
            <i className="fas fa-triangle-exclamation" /> Add {missing.length} low-stock item{missing.length === 1 ? '' : 's'}
          </button>
        )}
        <span className="po-total">Order total: {inr(total)}</span>
      </div>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        <span>Notes</span>
        <input value={f.notes} maxLength={500} onChange={set('notes')} placeholder="Delivery instructions, payment terms…" />
      </label>
    </Shell>
  );
}

/** Goods arrive: quantities per line, supplier invoice number. */
export function ReceiveModal({ record, onSave, onClose }) {
  const today = todayIso();
  const pending = record.lines.filter((l) => l.pendingQty > 0);
  const [qty, setQty] = useState(Object.fromEntries(pending.map((l) => [l.lineId, String(l.pendingQty)])));
  const [f, setF] = useState({ receivedDate: today, invoiceNo: '', remarks: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const { busy, err, run } = useSubmit(() => onSave({
    ...f,
    lines: pending.filter((l) => Number(qty[l.lineId]) > 0)
      .map((l) => ({ lineId: l.lineId, quantity: Number(qty[l.lineId]) })),
  }));

  const problem = () => {
    let any = false;
    for (const l of pending) {
      const n = Number(qty[l.lineId] || 0);
      if (!Number.isInteger(n) || n < 0) return `Enter a whole number for ${l.itemName}.`;
      if (n > l.pendingQty) return `${l.itemName}: only ${l.pendingQty} ${l.unit} still pending.`;
      if (n > 0) any = true;
    }
    if (!any) return 'Enter the quantity received for at least one item.';
    if (!f.receivedDate) return 'Received date is required.';
    if (f.receivedDate > today) return 'Received date cannot be in the future.';
    if (f.receivedDate < record.orderDate) return 'Received date cannot be before the order date.';
    return '';
  };

  return (
    <Shell title={`Receive goods — ${record.id}`} err={err} busy={busy} submitText="Add to stock"
           onSubmit={(e) => run(e, problem())} onClose={onClose} width={700}>
      <p className="muted" style={{ marginBottom: 12 }}>
        From <b>{record.supplierName}</b>. The quantities you enter are added to stock straight away.
      </p>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Item</th><th>Ordered</th><th>Received</th><th>Pending</th><th>Receive now</th></tr></thead>
          <tbody>
            {pending.map((l) => (
              <tr key={l.lineId}>
                <td>{l.itemName}<div className="muted">{l.itemId}</div></td>
                <td>{l.orderedQty} {l.unit}</td>
                <td>{l.receivedQty}</td>
                <td><b>{l.pendingQty}</b></td>
                <td>
                  <input type="number" min="0" max={l.pendingQty} step="1" style={{ width: 90 }}
                         value={qty[l.lineId]} onChange={(e) => setQty({ ...qty, [l.lineId]: e.target.value })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <label>Received on
          <input type="date" value={f.receivedDate} min={record.orderDate} max={today} onChange={set('receivedDate')} />
        </label>
        <label>Supplier invoice / challan no.
          <input value={f.invoiceNo} maxLength={60} onChange={set('invoiceNo')} />
        </label>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        <span>Remarks</span>
        <input value={f.remarks} maxLength={200} onChange={set('remarks')} placeholder="e.g. 2 boxes arrived damaged" />
      </label>
    </Shell>
  );
}