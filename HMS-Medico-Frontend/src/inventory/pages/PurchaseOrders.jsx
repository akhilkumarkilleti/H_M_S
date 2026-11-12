import { useEffect, useMemo, useState } from 'react';
import { purchaseApi, stockApi, supplierApi } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { canBuy, canViewPurchasing, inr, label } from '../constants.js';
import { OrderModal, ReceiveModal, SupplierModal } from '../components/PurchaseModals.jsx';

const TABS = [
  ['', 'All'], ['DRAFT', 'Draft'], ['OPEN', 'Open'], ['OVERDUE', 'Overdue'],
  ['RECEIVED', 'Received'], ['CLOSED', 'Closed / cancelled'],
];
const inTab = (p, t) => !t
  || (t === 'OPEN' ? p.status === 'ORDERED' || p.status === 'PARTIALLY_RECEIVED'
    : t === 'OVERDUE' ? p.overdue
      : t === 'CLOSED' ? p.status === 'CLOSED' || p.status === 'CANCELLED'
        : p.status === t);

export default function PurchaseOrders() {
  const { user } = useAuth();
  const allowed = canViewPurchasing(user.role);
  const buyer = canBuy(user.role);

  const [view, setView] = useState('orders');          // 'orders' | 'suppliers'
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(null);            // { kind: 'order' | 'receive' | 'supplier' | 'view', record?, prefill? }
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const refresh = async () => {
    try {
      const [o, s, sup, items, sug] = await Promise.all([
        purchaseApi.list(), purchaseApi.summary(), supplierApi.list(), stockApi.items(), purchaseApi.suggestions(),
      ]);
      setOrders(o); setSummary(s); setSuppliers(sup); setStockItems(items); setSuggestions(sug);
    } catch (x) { setError(x.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (allowed) refresh(); else setLoading(false); }, [allowed]);

  const shown = useMemo(() => orders.filter((p) => {
    const text = `${p.id} ${p.supplierName} ${p.supplierId} ${p.lines.map((l) => l.itemName).join(' ')}`.toLowerCase();
    return inTab(p, tab) && (!q || text.includes(q.toLowerCase()));
  }), [orders, tab, q]);

  const shownSuppliers = useMemo(() => suppliers.filter((s) =>
    !q || `${s.id} ${s.name} ${s.contactPerson ?? ''} ${s.phone ?? ''}`.toLowerCase().includes(q.toLowerCase())), [suppliers, q]);

  const done = async (message) => { setModal(null); setError(''); setMsg(message); await refresh(); };
  const run = async (fn, okMessage) => {
    setError(''); setMsg('');
    try { await fn(); setMsg(okMessage); await refresh(); }
    catch (e) { setError(e.message); }
  };

  const openView = async (p) => {
    try { setModal({ kind: 'view', record: await purchaseApi.get(p.id) }); } catch (e) { setError(e.message); }
  };
  const openReceive = async (p) => {
    try { setModal({ kind: 'receive', record: await purchaseApi.get(p.id) }); } catch (e) { setError(e.message); }
  };

  const place = (p) => {
    if (!confirm(`Place ${p.id} with ${p.supplierName}? It can no longer be edited.`)) return;
    run(() => purchaseApi.place(p.id), `${p.id} placed with ${p.supplierName}.`);
  };
  const close = (p) => {
    if (!confirm(`Close ${p.id}? The ${p.pendingQty} pending item(s) will no longer be expected.`)) return;
    run(() => purchaseApi.close(p.id), `${p.id} closed.`);
  };
  const cancel = (p) => {
    if (!confirm(`Cancel ${p.id}?`)) return;
    run(() => purchaseApi.cancel(p.id), `${p.id} cancelled.`);
  };
  const remove = (p) => {
    if (!confirm(`Delete draft ${p.id}?`)) return;
    run(() => purchaseApi.remove(p.id), `${p.id} deleted.`);
  };

  const saveOrder = async (data) => {
    const saved = modal.record ? await purchaseApi.update(modal.record.id, data) : await purchaseApi.create(data);
    await done(`${saved.id} saved as draft.`);
  };
  const saveReceive = async (data) => {
    const saved = await purchaseApi.receive(modal.record.id, data);
    await done(`Goods added to stock. ${saved.id} is now ${label(saved.status)}.`);
  };
  const saveSupplier = async (data) => {
    const saved = modal.record ? await supplierApi.update(modal.record.id, data) : await supplierApi.create(data);
    await done(`${saved.name} saved.`);
  };

  if (!allowed) {
    return (
      <>
        <div className="page-head"><h2>Purchase Orders</h2></div>
        <div className="panel" style={{ padding: 24 }}>
          Purchase orders and supplier prices are available to administrators, inventory managers and store keepers.
        </div>
      </>
    );
  }

  const cards = summary ? [
    ['Draft orders', summary.draft, 'fa-file-pen', 'blue'],
    ['Placed', summary.ordered, 'fa-paper-plane', 'purple'],
    ['Partially received', summary.partiallyReceived, 'fa-box-open', 'yellow'],
    ['Overdue', summary.overdue, 'fa-hourglass-end', 'red'],
    ['Waiting to arrive', inr(summary.pendingValue), 'fa-truck', 'orange'],
    ['Received this month', inr(summary.receivedThisMonth), 'fa-indian-rupee-sign', 'green'],
  ] : [];

  const m = modal?.record;
  const prefill = suggestions.map((s) => ({ itemId: s.itemId, quantity: String(s.suggestedQty), unitPrice: String(s.unitPrice) }));

  return (
    <>
      <div className="page-head">
        <h2>Purchase Orders</h2>
        {buyer && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => setModal({ kind: 'supplier' })}>
              <i className="fas fa-building" /> Add supplier
            </button>
            <button className="btn-primary" onClick={() => setModal({ kind: 'order' })}>
              <i className="fas fa-plus-circle" /> New purchase order
            </button>
          </div>
        )}
      </div>

      {error && <div className="alert" style={{ marginBottom: 12 }}>{error}</div>}
      {msg && <div className="alert ok" style={{ marginBottom: 12 }}>{msg}</div>}

      {summary && (
        <div className="stats" style={{ marginBottom: 20 }}>
          {cards.map(([l, n, icon, color]) => (
            <div className="stat" key={l}>
              <span className={`stat-icon ${color}`}><i className={`fas ${icon}`} /></span>
              <div className="stat-n">{n}</div><div className="muted">{l}</div>
            </div>
          ))}
        </div>
      )}

      {buyer && suggestions.length > 0 && (
        <div className="panel suggest">
          <div>
            <b><i className="fas fa-triangle-exclamation" /> {suggestions.length} item{suggestions.length === 1 ? ' is' : 's are'} low on stock and not on order</b>
            <div className="muted">{suggestions.slice(0, 4).map((s) => s.name).join(', ')}{suggestions.length > 4 ? '…' : ''}</div>
          </div>
          <button className="btn-primary" onClick={() => setModal({ kind: 'order', prefill })}>Create order from low stock</button>
        </div>
      )}

      <div className="toolbar">
        <button className={view === 'orders' ? 'btn-primary' : 'btn-secondary'} onClick={() => { setView('orders'); setQ(''); }}>
          Purchase orders ({orders.length})
        </button>
        <button className={view === 'suppliers' ? 'btn-primary' : 'btn-secondary'} onClick={() => { setView('suppliers'); setQ(''); }}>
          Suppliers ({suppliers.length})
        </button>
      </div>

      {view === 'orders' && (
        <div className="toolbar">
          {TABS.map(([k, l]) => (
            <button key={k || 'all'} className={tab === k ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab(k)}>
              {l} ({orders.filter((p) => inTab(p, k)).length})
            </button>
          ))}
        </div>
      )}
      <div className="toolbar">
        <input placeholder={view === 'orders' ? 'Search PO number, supplier, item…' : 'Search supplier name, contact, phone…'}
               value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {view === 'orders' && (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr><th>PO</th><th>Supplier</th><th>Ordered</th><th>Expected</th><th>Received</th><th>Total</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="8" className="empty">Loading purchase orders…</td></tr>}
              {!loading && shown.map((p) => (
                <tr key={p.id}>
                  <td><b>{p.id}</b></td>
                  <td>{p.supplierName}<div className="muted">{p.supplierId}</div></td>
                  <td>{p.orderDate}</td>
                  <td>{p.expectedDate || '—'}</td>
                  <td style={{ minWidth: 120 }}>
                    {p.receivedQty} / {p.orderedQty}
                    <div className="progress"><i style={{ width: `${p.orderedQty ? (p.receivedQty / p.orderedQty) * 100 : 0}%` }} /></div>
                  </td>
                  <td>{inr(p.totalAmount)}</td>
                  <td>
                    <span className={`badge ${p.status}`}>{label(p.status)}</span>
                    {p.overdue && <span className="badge OVERDUE" style={{ marginLeft: 6 }}>Overdue</span>}
                  </td>
                  <td className="row-actions">
                    <button title="View" onClick={() => openView(p)}><i className="fas fa-eye" /></button>
                    {buyer && p.status === 'DRAFT' && <>
                      <button title="Edit" onClick={() => setModal({ kind: 'order', record: p })}><i className="fas fa-edit" /></button>
                      <button title="Place order" onClick={() => place(p)}><i className="fas fa-paper-plane" /></button>
                    </>}
                    {(p.status === 'ORDERED' || p.status === 'PARTIALLY_RECEIVED') &&
                      <button title="Receive goods" onClick={() => openReceive(p)}><i className="fas fa-box-open" /></button>}
                    {buyer && p.status === 'PARTIALLY_RECEIVED' &&
                      <button title="Close short" onClick={() => close(p)}><i className="fas fa-flag-checkered" /></button>}
                    {buyer && (p.status === 'DRAFT' || p.status === 'ORDERED') &&
                      <button title="Cancel" onClick={() => cancel(p)}><i className="fas fa-ban" /></button>}
                    {buyer && p.status === 'DRAFT' &&
                      <button title="Delete draft" onClick={() => remove(p)}><i className="fas fa-trash" /></button>}
                  </td>
                </tr>
              ))}
              {!loading && !shown.length && <tr><td colSpan="8" className="empty">No purchase orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {view === 'suppliers' && (
        <div className="panel table-wrap">
          <table>
            <thead><tr><th>Code</th><th>Supplier</th><th>Contact</th><th>Phone</th><th>Email</th><th>GSTIN</th><th>Status</th><th /></tr></thead>
            <tbody>
              {shownSuppliers.map((s) => (
                <tr key={s.id}>
                  <td><b>{s.id}</b></td><td>{s.name}</td><td>{s.contactPerson || '—'}</td><td>{s.phone || '—'}</td>
                  <td>{s.email || '—'}</td><td>{s.taxId || '—'}</td>
                  <td><span className={`badge ${s.active ? 'COMPLETED' : 'CANCELLED'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="row-actions">
                    {buyer && <button title="Edit" onClick={() => setModal({ kind: 'supplier', record: s })}><i className="fas fa-edit" /></button>}
                  </td>
                </tr>
              ))}
              {!loading && !shownSuppliers.length && <tr><td colSpan="8" className="empty">No suppliers found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal?.kind === 'supplier' && <SupplierModal record={m} onSave={saveSupplier} onClose={() => setModal(null)} />}
      {modal?.kind === 'order' && (
        <OrderModal record={m} prefill={modal.prefill} suppliers={suppliers} stockItems={stockItems}
                    suggestions={suggestions} onSave={saveOrder} onClose={() => setModal(null)} />
      )}
      {modal?.kind === 'receive' && <ReceiveModal record={m} onSave={saveReceive} onClose={() => setModal(null)} />}

      {modal?.kind === 'view' && (
        <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: 760 }}>
            <h3>{m.id} <span className={`badge ${m.status}`}>{label(m.status)}</span>{m.overdue && <span className="badge OVERDUE" style={{ marginLeft: 6 }}>Overdue</span>}</h3>
            <dl className="details" style={{ marginBottom: 16 }}>
              {[
                ['Supplier', `${m.supplierName} (${m.supplierId})`], ['Created by', m.createdBy],
                ['Order date', m.orderDate], ['Expected delivery', m.expectedDate],
                ['Order total', inr(m.totalAmount)], ['Received value', inr(m.receivedAmount)],
              ].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || '—'}</dd></div>)}
              <div style={{ gridColumn: '1 / -1' }}><dt>Notes</dt><dd>{m.notes || '—'}</dd></div>
            </dl>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Item</th><th>Ordered</th><th>Received</th><th>Pending</th><th>Price</th><th>Total</th></tr></thead>
                <tbody>
                  {m.lines.map((l) => (
                    <tr key={l.lineId}>
                      <td>{l.itemName}<div className="muted">{l.itemId}</div></td>
                      <td>{l.orderedQty} {l.unit}</td><td>{l.receivedQty}</td><td>{l.pendingQty}</td>
                      <td>{inr(l.unitPrice)}</td><td>{inr(l.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h4 style={{ margin: '18px 0 8px' }}>Goods received</h4>
            {m.receipts.length ? (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Date</th><th>Item</th><th>Qty</th><th>Invoice</th><th>By</th><th>Remarks</th></tr></thead>
                  <tbody>
                    {m.receipts.map((r, i) => (
                      <tr key={i}><td>{r.receivedDate}</td><td>{r.itemName}</td><td>{r.quantity}</td>
                        <td>{r.invoiceNo || '—'}</td><td>{r.receivedBy}</td><td>{r.remarks || '—'}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="muted">Nothing received yet.</p>}
            <div className="actions"><button className="btn-primary" onClick={() => setModal(null)}>Close</button></div>
          </div>
        </div>
      )}
    </>
  );
}