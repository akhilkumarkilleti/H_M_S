import { Fragment, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { stockApi } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { canDeleteStock, canEditStock, inr, label } from '../constants.js';
import { HistoryModal, ItemModal, MovementModal } from '../components/StockModals.jsx';
import { downloadCsv } from '../exportCsv.js';
import { groupByCategory } from '../groupByCategory.js';

const PAGE_SIZE = 15;
const DEFAULT_DEPARTMENTS = ['Pharmacy', 'Laboratory', 'ICU', 'Emergency', 'Operation Theatre', 'General Ward', 'Cardiology', 'Radiology', 'Store'];
const STATUS_FILTERS = [
  ['', 'All active items'], ['IN_STOCK', 'In stock'], ['LOW_STOCK', 'Low stock'], ['OUT_OF_STOCK', 'Out of stock'],
  ['EXPIRING_SOON', 'Expiring soon'], ['EXPIRED', 'Expired'], ['INACTIVE', 'Inactive'],
];
const COLUMNS = [
  ['id', 'Code'], ['name', 'Item'], ['category', 'Category'], ['quantity', 'Quantity'], ['reorderLevel', 'Reorder at'],
  ['unitPrice', 'Unit price'], ['value', 'Value'], ['stockStatus', 'Status'], ['expiryDate', 'Expiry'], ['location', 'Location'],
];
const NUMERIC = ['quantity', 'reorderLevel', 'unitPrice', 'value'];
const when = (iso) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export default function Stock() {
  const { user } = useAuth();
  const canEdit = canEditStock(user.role);
  const canDelete = canDeleteStock(user.role);
  const [params] = useSearchParams();

  const [grouped, setGrouped] = useState(true);          // category dropdown sections on/off
  const [open, setOpen] = useState(() => new Set());      // categories currently expanded
  const [view, setView] = useState('items');           // 'items' | 'movements'
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(params.get('q') || '');
  const [status, setStatus] = useState(params.get('status') || '');
  const [cat, setCat] = useState('');
  const [mType, setMType] = useState('');
  const [sort, setSort] = useState({ key: 'id', dir: 1 });
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);            // { kind: 'item' | 'move' | 'history', item?, type? }
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const refresh = async () => {
    try {
      const [i, s, m] = await Promise.all([stockApi.items(), stockApi.summary(), stockApi.movements()]);
      setItems(i.map((x) => ({ ...x, value: x.quantity * Number(x.unitPrice) })));
      setSummary(s); setMovements(m);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);
  useEffect(() => { setPage(1); }, [q, status, cat, sort, view, mType]);

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))].sort(), [items]);
  const departments = useMemo(() => {
    const seen = new Set(DEFAULT_DEPARTMENTS);
    movements.forEach((m) => { if (m.fromDepartment) seen.add(m.fromDepartment); if (m.toDepartment) seen.add(m.toDepartment); });
    return [...seen].sort();
  }, [movements]);

  const matches = (i, s) => (s === 'INACTIVE' ? !i.active
    : i.active && (!s || i.stockStatus === s || i.expiryStatus === s));
  const counts = useMemo(() => Object.fromEntries(STATUS_FILTERS.map(([k]) => [k, items.filter((i) => matches(i, k)).length])), [items]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const rows = items.filter((i) => matches(i, status) && (!cat || i.category === cat)
      && (!needle || `${i.id} ${i.name} ${i.category} ${i.location ?? ''}`.toLowerCase().includes(needle)));
    return rows.sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      if (x == null && y == null) return 0;
      if (x == null) return 1;
      if (y == null) return -1;
      return (NUMERIC.includes(sort.key) ? Number(x) - Number(y) : String(x).localeCompare(String(y))) * sort.dir;
    });
  }, [items, q, status, cat, sort]);

  const shownMoves = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return movements.filter((m) => (!mType || m.type === mType)
      && (!needle || `${m.itemId} ${m.itemName} ${m.reference ?? ''} ${m.fromDepartment ?? ''} ${m.toDepartment ?? ''} ${m.performedBy}`.toLowerCase().includes(needle)));
  }, [movements, q, mType]);

  const list = view === 'items' ? shown : shownMoves;

  const groups = useMemo(() => groupByCategory(shown), [shown]);
  const isGrouped = view === 'items' && grouped;
  const isOpen = (c) => !!q || open.has(c);                // searching opens every category
  const toggleCat = (c) => setOpen((s) => { const n = new Set(s); if (n.has(c)) n.delete(c); else n.add(c); return n; });

  const exportList = () => {
    const t = new Date(), p2 = (n) => String(n).padStart(2, '0');   // local date (UTC could be a day off in India)
    const day = `${t.getFullYear()}-${p2(t.getMonth() + 1)}-${p2(t.getDate())}`;
    if (view === 'items') downloadCsv(`stock-items-${day}.csv`, COLUMNS, shown);
    else downloadCsv(`stock-movements-${day}.csv`, [
      ['createdAt', 'Date'], ['itemId', 'Item code'], ['itemName', 'Item'], ['type', 'Type'], ['quantity', 'Quantity'],
      ['unit', 'Unit'], ['quantityAfter', 'Quantity after'], ['fromDepartment', 'From'], ['toDepartment', 'To'],
      ['reference', 'Reference'], ['performedBy', 'By'],
    ], shownMoves);
  };
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const slice = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const done = async (message) => { setModal(null); setError(''); setMsg(message); await refresh(); };
  const sortBy = (k) => setSort((s) => (s.key === k ? { key: k, dir: -s.dir } : { key: k, dir: 1 }));

  const saveItem = async (data) => {
    const saved = modal.item ? await stockApi.update(modal.item.id, data) : await stockApi.create(data);
    await done(`${saved.name} saved (${saved.id}).`);
  };
  const saveMove = async (data) => {
    const m = await stockApi.move(modal.item.id, data);
    await done(`${label(m.type)} ${m.quantity} ${m.unit} of ${m.itemName}. Stock is now ${m.quantityAfter} ${m.unit}.`);
  };
  const remove = async (i) => {
    if (!confirm(`Delete ${i.name}? This cannot be undone.`)) return;
    setError(''); setMsg('');
    try { await stockApi.remove(i.id); setMsg(`${i.name} deleted.`); await refresh(); }
    catch (e) { setError(e.message); }
  };

  const cards = summary ? [
    ['Active items', summary.totalItems, 'fa-boxes', 'blue', ''],
    ['In stock', summary.inStock, 'fa-check-circle', 'green', 'IN_STOCK'],
    ['Low stock', summary.lowStock, 'fa-triangle-exclamation', 'yellow', 'LOW_STOCK'],
    ['Out of stock', summary.outOfStock, 'fa-ban', 'red', 'OUT_OF_STOCK'],
    ['Expiring soon', summary.expiringSoon, 'fa-hourglass-half', 'orange', 'EXPIRING_SOON'],
    ['Expired', summary.expired, 'fa-calendar-xmark', 'pink', 'EXPIRED'],
    ['Stock value', inr(summary.totalValue), 'fa-indian-rupee-sign', 'teal', null],
  ] : [];

  const move = (item, type) => setModal({ kind: 'move', item, type });
  const m = modal?.item;

  return (
    <>
      <div className="page-head">
        <h2>Stock Management</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" disabled={!list.length} onClick={exportList}>
            <i className="fas fa-file-csv" /> Export CSV
          </button>
          {canEdit && (
            <button className="btn-primary" onClick={() => setModal({ kind: 'item' })}>
              <i className="fas fa-plus-circle" /> Add stock item
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert" style={{ marginBottom: 12 }}>{error}</div>}
      {msg && <div className="alert ok" style={{ marginBottom: 12 }}>{msg}</div>}

      {summary && (
        <div className="stats" style={{ marginBottom: 20 }}>
          {cards.map(([l, n, icon, color, filter]) => (
            <div className={`stat ${filter != null ? 'clickable' : ''}`} key={l}
                 onClick={filter != null ? () => { setView('items'); setStatus(filter); } : undefined}>
              <span className={`stat-icon ${color}`}><i className={`fas ${icon}`} /></span>
              <div className="stat-n">{n}</div><div className="muted">{l}</div>
            </div>
          ))}
        </div>
      )}

      <div className="toolbar">
        <button className={view === 'items' ? 'btn-primary' : 'btn-secondary'} onClick={() => setView('items')}>
          Items ({items.filter((i) => i.active).length})
        </button>
        <button className={view === 'movements' ? 'btn-primary' : 'btn-secondary'} onClick={() => setView('movements')}>
          Movements (latest {movements.length})
        </button>
      </div>

      <div className="toolbar">
        <input placeholder={view === 'items' ? 'Search code, item, category, location…' : 'Search item, reference, department, person…'}
               value={q} onChange={(e) => setQ(e.target.value)} />
        {view === 'items' && <>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_FILTERS.map(([k, l]) => <option key={k} value={k}>{l} ({counts[k] ?? 0})</option>)}
          </select>
          <button className="btn-secondary" onClick={() => setGrouped(!grouped)}>
            <i className={`fas fa-${grouped ? 'list' : 'layer-group'}`} /> {grouped ? 'Show as table' : 'Group by category'}
          </button>
          {grouped && (
            <button className="btn-secondary" onClick={() => setOpen(open.size ? new Set() : new Set(groups.map(([c]) => c)))}>
              {open.size ? 'Collapse all' : 'Expand all'}
            </button>
          )}
        </>}
        {view === 'movements' && (
          <select value={mType} onChange={(e) => setMType(e.target.value)}>
            <option value="">All movements</option>
            {['RECEIVED', 'ISSUED', 'RETURNED', 'TRANSFERRED'].map((t) => <option key={t} value={t}>{label(t)}</option>)}
          </select>
        )}
      </div>

      <div className="panel">
        <div className="table-wrap">
          {view === 'items' ? (
            <table>
              <thead>
                <tr>
                  {COLUMNS.map(([k, l]) => (
                    <th key={k} className="sortable" onClick={() => sortBy(k)}>
                      {l}{sort.key === k && <i className={`fas fa-arrow-${sort.dir === 1 ? 'up' : 'down'}`} style={{ marginLeft: 6, fontSize: 10 }} />}
                    </th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={COLUMNS.length + 1} className="empty">Loading stock…</td></tr>}
                {!loading && (isGrouped ? groups : [[null, slice]]).map(([g, rows]) => (
                  <Fragment key={g ?? 'all'}>
                    {g !== null && (
                  <tr className="cat-row" onClick={() => toggleCat(g)}>
                    <td colSpan={COLUMNS.length + 1}>
                      <i className={`fas fa-chevron-${isOpen(g) ? 'down' : 'right'}`} />
                      <b>{g}</b> <span className="muted">({rows.length} item{rows.length === 1 ? '' : 's'})</span>
                    </td>
                  </tr>
                )}
                    {(g === null || isOpen(g)) && rows.map((i) => (
                  <tr key={i.id}>
                    <td><b>{i.id}</b></td>
                    <td>{i.name}</td>
                    <td>{i.category}</td>
                    <td style={{ minWidth: 110 }}>
                      <b>{i.quantity}</b> {i.unit}
                      <div className={`progress ${i.stockStatus === 'OUT_OF_STOCK' ? 'out' : i.stockStatus === 'LOW_STOCK' ? 'low' : ''}`}>
                        <i style={{ width: `${Math.min(100, (i.quantity / Math.max(i.reorderLevel * 2, 1)) * 100)}%` }} />
                      </div>
                    </td>
                    <td>{i.reorderLevel}</td>
                    <td>{inr(i.unitPrice)}</td>
                    <td>{inr(i.value)}</td>
                    <td>
                      {i.active ? <span className={`badge ${i.stockStatus}`}>{label(i.stockStatus)}</span>
                        : <span className="badge CANCELLED">Inactive</span>}
                    </td>
                    <td>
                      {i.expiryDate || '—'}
                      {(i.expiryStatus === 'EXPIRED' || i.expiryStatus === 'EXPIRING_SOON') &&
                        <div><span className={`badge ${i.expiryStatus}`}>{label(i.expiryStatus)}</span></div>}
                    </td>
                    <td>{i.location || '—'}</td>
                    <td className="row-actions">
                      {canEdit && i.active && <>
                        <button title="Receive stock" onClick={() => move(i, 'RECEIVED')}><i className="fas fa-arrow-down" /></button>
                        <button title="Issue stock" onClick={() => move(i, 'ISSUED')}><i className="fas fa-arrow-up" /></button>
                      </>}
                      <button title="History" onClick={() => setModal({ kind: 'history', item: i })}><i className="fas fa-clock-rotate-left" /></button>
                      {canEdit && <button title="Edit" onClick={() => setModal({ kind: 'item', item: i })}><i className="fas fa-edit" /></button>}
                      {canDelete && <button title="Delete" onClick={() => remove(i)}><i className="fas fa-trash" /></button>}
                    </td>
                  </tr>
                    ))}
                  </Fragment>
                ))}
                {!loading && !list.length && <tr><td colSpan={COLUMNS.length + 1} className="empty">No stock items found.</td></tr>}
              </tbody>
            </table>
          ) : (
            <table>
              <thead><tr><th>When</th><th>Item</th><th>Movement</th><th>Qty</th><th>Stock after</th><th>From</th><th>To</th><th>Reference</th><th>By</th></tr></thead>
              <tbody>
                {slice.map((x) => (
                  <tr key={x.id}>
                    <td>{when(x.createdAt)}</td>
                    <td>{x.itemName}<div className="muted">{x.itemId}</div></td>
                    <td><span className={`badge ${x.type}`}>{label(x.type)}</span></td>
                    <td>{x.quantity} {x.unit}</td><td>{x.quantityAfter}</td>
                    <td>{x.fromDepartment || '—'}</td><td>{x.toDepartment || '—'}</td>
                    <td>{x.reference || '—'}{x.remarks && <div className="muted">{x.remarks}</div>}</td>
                    <td>{x.performedBy}</td>
                  </tr>
                ))}
                {!slice.length && <tr><td colSpan="9" className="empty">No movements found.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
        <div className="pager">
          <span className="muted">{list.length} {view === 'items' ? 'item' : 'movement'}{list.length === 1 ? '' : 's'}</span>
          {!isGrouped && (
            <div>
              <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
              <span className="muted">Page {page} of {pages}</span>
              <button className="btn-secondary" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </div>
      </div>

      {modal?.kind === 'item' && <ItemModal item={m} categories={categories} onSave={saveItem} onClose={() => setModal(null)} />}
      {modal?.kind === 'move' && <MovementModal item={m} initialType={modal.type} departments={departments} onSave={saveMove} onClose={() => setModal(null)} />}
      {modal?.kind === 'history' && <HistoryModal item={m} onClose={() => setModal(null)} />}
    </>
  );
}