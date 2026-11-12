import { Fragment, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { equipmentApi } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { STATUSES, inr, label, canEditEquipment, canDeleteEquipment } from '../constants.js';
import { useCategories } from '../useCategories.js';
import EquipmentForm from '../components/EquipmentForm.jsx';
import LabelSheet from '../components/LabelSheet.jsx';
import { today, daysFromNow, isOverdue } from '../equipmentUtils.js';
import { groupByCategory } from '../groupByCategory.js';

const PAGE_SIZE = 10;

const COLUMNS = [
  ['id', 'ID'], ['name', 'Name'], ['category', 'Category'], ['location', 'Location'],
  ['assignedTo', 'Assigned to'], ['status', 'Status'], ['condition', 'Condition'],
  ['nextMaintenance', 'Next maint.'], ['purchasePrice', 'Price'],
];

const DETAIL_FIELDS = [
  ['category', 'Category'], ['serialNumber', 'Serial number'], ['modelNumber', 'Model number'],
  ['manufacturer', 'Manufacturer'], ['purchaseDate', 'Purchase date'], ['purchasePrice', 'Purchase price'],
  ['warrantyUntil', 'Warranty until'], ['location', 'Location'], ['status', 'Status'],
  ['condition', 'Condition'], ['assignedTo', 'Assigned to'], ['lastMaintenance', 'Last maintenance'],
  ['nextMaintenance', 'Next maintenance'],
];

const CSV_COLUMNS = ['id', 'name', 'category', 'serialNumber', 'modelNumber', 'manufacturer', 'purchaseDate',
  'purchasePrice', 'warrantyUntil', 'location', 'status', 'condition', 'assignedTo', 'lastMaintenance', 'nextMaintenance'];

function warrantyFlag(e) {
  if (!e.warrantyUntil) return null;
  if (e.warrantyUntil < today()) return ['Warranty expired', 'DAMAGED'];
  if (e.warrantyUntil <= daysFromNow(60)) return ['Warranty ends soon', 'UNDER_MAINTENANCE'];
  return null;
}

export default function Equipment() {
  const { user } = useAuth();
  const canEdit = canEditEquipment(user.role);
  const canDelete = canDeleteEquipment(user.role);
  const categories = useCategories();

  const [params] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(params.get('q') ?? '');
  const [status, setStatus] = useState('');
  const [cat, setCat] = useState('');
  const [sort, setSort] = useState({ key: 'id', dir: 'asc' });
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [viewing, setViewing] = useState(null);
  const [labels, setLabels] = useState(null); // null | array of items to print
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [grouped, setGrouped] = useState(true);          // category dropdown sections on/off
  const [open, setOpen] = useState(() => new Set());      // categories currently expanded

  const refresh = async () => {
    try { setItems(await equipmentApi.list()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);
  useEffect(() => { setPage(1); }, [q, status, cat]);

  const filtered = useMemo(() => items.filter((e) =>
    (!status || e.status === status) && (!cat || e.category === cat) &&
    (!q || `${e.id} ${e.name} ${e.serialNumber ?? ''} ${e.location ?? ''}`.toLowerCase().includes(q.toLowerCase()))
  ), [items, q, status, cat]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const x = a[sort.key] ?? '', y = b[sort.key] ?? '';
    const r = typeof x === 'number' && typeof y === 'number'
      ? x - y
      : String(x).localeCompare(String(y), undefined, { numeric: true });
    return sort.dir === 'asc' ? r : -r;
  }), [filtered, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const groups = useMemo(() => groupByCategory(sorted), [sorted]);
  const isOpen = (c) => !!q || open.has(c);               // searching opens every category
  const toggleCat = (c) => setOpen((s) => { const n = new Set(s); if (n.has(c)) n.delete(c); else n.add(c); return n; });

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  // The form shows its own errors, so save() just throws on failure.
  const save = async (data) => {
    const isNew = editing === 'new';
    if (isNew) await equipmentApi.create(data); else await equipmentApi.update(editing.id, data);
    setError(''); setMsg(isNew ? 'Equipment added.' : 'Equipment updated.');
    setEditing(null);
    await refresh();
  };

  const run = async (fn, okMessage) => {
    setError(''); setMsg('');
    try { await fn(); setMsg(okMessage); await refresh(); }
    catch (e) { setError(e.message); }
  };

  const retire = (e) => {
    if (!confirm(`Deactivate ${e.name}? It will be marked RETIRED.`)) return;
    run(() => equipmentApi.update(e.id, { status: 'RETIRED' }), `${e.name} was retired.`);
  };
  const del = (e) => {
    if (!confirm(`Permanently delete ${e.name}? This cannot be undone.`)) return;
    run(() => equipmentApi.remove(e.id), `${e.name} was deleted.`);
  };

  const exportCsv = () => {
    // a leading = + - @ can be run as a formula in Excel, so prefix it with '
    const esc = (v) => {
      let s = String(v ?? '');
      if (/^[=+\-@]/.test(s)) s = "'" + s;
      return `"${s.replace(/"/g, '""')}"`;
    };
    const csv = [CSV_COLUMNS.join(','), ...sorted.map((e) => CSV_COLUMNS.map((c) => esc(e[c])).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = `equipment-${today()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const fmt = (k, v) => {
    if (v === null || v === undefined || v === '') return '—';
    if (k === 'purchasePrice') return inr(v);
    if (k === 'status' || k === 'condition') return label(String(v));
    return v;
  };

  return (
    <>
      <div className="page-head">
        <h2>Equipment</h2>
        {canEdit && (
          <button className="btn-primary" onClick={() => setEditing('new')}>
            <i className="fas fa-plus-circle" /> Add equipment
          </button>
        )}
      </div>

      <div className="toolbar">
        <input placeholder="Search ID, name, serial, location…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}{c.active ? '' : ' (inactive)'}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
        <button className="btn-secondary" onClick={exportCsv} disabled={!sorted.length}>
          <i className="fas fa-download" /> Export CSV
        </button>
        <button className="btn-secondary" onClick={() => setLabels(sorted)} disabled={!sorted.length}>
          <i className="fas fa-qrcode" /> Print labels
        </button>
        <button className="btn-secondary" onClick={() => setGrouped(!grouped)}>
          <i className={`fas fa-${grouped ? 'list' : 'layer-group'}`} /> {grouped ? 'Show as table' : 'Group by category'}
        </button>
        {grouped && (
          <button className="btn-secondary" onClick={() => setOpen(open.size ? new Set() : new Set(groups.map(([c]) => c)))}>
            {open.size ? 'Collapse all' : 'Expand all'}
          </button>
        )}
      </div>

      {error && <div className="alert" style={{ marginBottom: 12 }}>{error}</div>}
      {msg && <div className="alert ok" style={{ marginBottom: 12 }}>{msg}</div>}

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              {COLUMNS.map(([k, l]) => (
                <th key={k} className="sortable" onClick={() => toggleSort(k)}>
                  {l}{sort.key === k ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="10" className="empty">Loading equipment…</td></tr>}
            {!loading && (grouped ? groups : [[null, rows]]).map(([g, list]) => (
              <Fragment key={g ?? 'all'}>
                {g !== null && (
                  <tr className="cat-row" onClick={() => toggleCat(g)}>
                    <td colSpan={10}>
                      <i className={`fas fa-chevron-${isOpen(g) ? 'down' : 'right'}`} />
                      <b>{g}</b> <span className="muted">({list.length} item{list.length === 1 ? '' : 's'})</span>
                    </td>
                  </tr>
                )}
                {(g === null || isOpen(g)) && list.map((e) => {
              const w = warrantyFlag(e);
              return (
                <tr key={e.id}>
                  <td><b>{e.id}</b></td>
                  <td>
                    {e.name}
                    {w && <span className={`badge ${w[1]} sub-badge`}>{w[0]}</span>}
                  </td>
                  <td>{e.category}</td>
                  <td>{e.location || '—'}</td>
                  <td>{e.assignedTo || '—'}</td>
                  <td><span className={`badge ${e.status}`}>{label(e.status)}</span></td>
                  <td>{label(e.condition || '—')}</td>
                  <td className={isOverdue(e) ? 'overdue' : ''}>
                    {e.nextMaintenance || '—'}{isOverdue(e) ? ' (overdue)' : ''}
                  </td>
                  <td>{inr(e.purchasePrice)}</td>
                  <td className="row-actions">
                    <button title="View" onClick={() => setViewing(e)}><i className="fas fa-eye" /></button>
                    <button title="Print label" onClick={() => setLabels([e])}><i className="fas fa-qrcode" /></button>
                    {canEdit && <button title="Edit" onClick={() => setEditing(e)}><i className="fas fa-edit" /></button>}
                    {canEdit && !['RETIRED', 'DISPOSED'].includes(e.status) && (
                      <button title="Deactivate" onClick={() => retire(e)}><i className="fas fa-ban" /></button>
                    )}
                    {canDelete && <button title="Delete" onClick={() => del(e)}><i className="fas fa-trash" /></button>}
                  </td>
                </tr>
              );
                })}
              </Fragment>
            ))}
            {!loading && !sorted.length && <tr><td colSpan="10" className="empty">No equipment found.</td></tr>}
          </tbody>
        </table>

        <div className="pager">
          <span className="muted">
            {sorted.length} item{sorted.length === 1 ? '' : 's'}{sorted.length !== items.length ? ` (of ${items.length})` : ''}
          </span>
          {!grouped && (
            <div>
              <button className="btn-secondary" disabled={current <= 1} onClick={() => setPage(current - 1)}>Previous</button>
              <span className="muted">Page {current} of {pages}</span>
              <button className="btn-secondary" disabled={current >= pages} onClick={() => setPage(current + 1)}>Next</button>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <EquipmentForm
          categories={categories}
          initial={editing === 'new' ? null : editing}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}

      {labels && <LabelSheet items={labels} onClose={() => setLabels(null)} />}

      {viewing && (
        <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && setViewing(null)}>
          <div className="modal">
            <h3>{viewing.name} <span className="muted">{viewing.id}</span></h3>
            {warrantyFlag(viewing) && (
              <div className="alert" style={{ marginBottom: 14 }}>{warrantyFlag(viewing)[0]} ({viewing.warrantyUntil})</div>
            )}
            <dl className="details">
              {DETAIL_FIELDS.map(([k, l]) => (
                <div key={k}><dt>{l}</dt><dd>{fmt(k, viewing[k])}</dd></div>
              ))}
            </dl>
            <div className="actions">
              <button className="btn-secondary" onClick={() => { setLabels([viewing]); setViewing(null); }}>
                <i className="fas fa-qrcode" /> Print label
              </button>
              <button className="btn-secondary" onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}