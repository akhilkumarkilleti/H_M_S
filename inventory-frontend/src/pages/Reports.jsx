import { useEffect, useMemo, useState } from 'react';
import { reportApi } from '../api.js';
import { inr, label } from '../constants.js';

// ----- small helpers (local dates: toISOString() would use UTC and can be a day off early in the morning in India)
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return iso(d); };
const today = () => iso(new Date());

const PRESETS = [
  ['Last 7 days', () => [daysAgo(6), today()]],
  ['Last 30 days', () => [daysAgo(29), today()]],
  ['Last 90 days', () => [daysAgo(89), today()]],
  ['This month', () => { const d = new Date(); return [iso(new Date(d.getFullYear(), d.getMonth(), 1)), today()]; }],
  ['This year', () => [iso(new Date(new Date().getFullYear(), 0, 1)), today()]],
];

const isNumeric = (c) => c.type === 'int' || c.type === 'money';
const show = (c, v) => (v == null || v === '' ? '—'
  : c.type === 'money' ? inr(v)
    : c.type === 'int' ? Number(v).toLocaleString('en-IN')
      : c.type === 'status' ? <span className={`badge ${v}`}>{label(String(v))}</span>
        : String(v));
const plain = (c, v) => (v == null ? '' : c.type === 'status' ? label(String(v)) : v);
const stat = (s) => (s.type === 'money' ? inr(s.value) : s.type === 'int' ? Number(s.value).toLocaleString('en-IN') : String(s.value));

const PAGE = 200;

export default function Reports() {
  const [catalog, setCatalog] = useState(null);       // null = still loading
  const [key, setKey] = useState('');
  const [from, setFrom] = useState(daysAgo(29));
  const [to, setTo] = useState(today());
  const [filter, setFilter] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState({ key: '', dir: 1 });
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    reportApi.catalog()
      .then((c) => { setCatalog(c); if (c.length) setKey(c[0].key); })
      .catch((e) => { setError(e.message); setCatalog([]); });
  }, []);

  const info = catalog?.find((r) => r.key === key);

  // run the report whenever the report or its filters change
  useEffect(() => {
    if (!info) return;
    if (info.dateRange && (!from || !to || from > to)) return;
    let cancelled = false;
    setLoading(true); setError('');
    reportApi.run(key, { from: info.dateRange ? from : '', to: info.dateRange ? to : '', filter })
      .then((d) => { if (!cancelled) { setData(d); setLimit(PAGE); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setData(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [key, from, to, filter, info?.key]);          // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (k) => { setKey(k); setFilter(''); setQ(''); setSort({ key: '', dir: 1 }); setData(null); };
  const sortBy = (k) => setSort((s) => (s.key === k ? { key: k, dir: -s.dir } : { key: k, dir: 1 }));

  const rows = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    let r = needle
      ? data.rows.filter((row) => Object.values(row).some((v) => v != null && String(v).toLowerCase().includes(needle)))
      : data.rows;
    const col = data.columns.find((c) => c.key === sort.key);
    if (col) {
      r = [...r].sort((a, b) => {
        const x = a[col.key], y = b[col.key];
        if (x == null && y == null) return 0;
        if (x == null) return 1;                    // empty values always last
        if (y == null) return -1;
        return (isNumeric(col) ? Number(x) - Number(y) : String(x).localeCompare(String(y))) * sort.dir;
      });
    }
    return r;
  }, [data, q, sort]);

  const exportCsv = () => {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [data.columns.map((c) => esc(c.label)).join(',')];
    rows.forEach((r) => lines.push(data.columns.map((c) => esc(plain(c, r[c.key]))).join(',')));
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });   // BOM so Excel shows ₹ correctly
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${data.key}-report-${today()}.csv`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  if (catalog && !catalog.length) {
    return (
      <>
        <div className="page-head"><h2>Reports</h2></div>
        {error && <div className="alert">{error}</div>}
        <div className="panel" style={{ padding: 24 }}>
          Reports are available to administrators, inventory managers, store keepers and maintenance engineers.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <h2>Reports</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" disabled={!data} onClick={() => window.print()}>
            <i className="fas fa-print" /> Print
          </button>
          <button className="btn-primary" disabled={!data || !rows.length} onClick={exportCsv}>
            <i className="fas fa-file-csv" /> Export CSV
          </button>
        </div>
      </div>

      <div className="report-cards">
        {(catalog || []).map((r) => (
          <button key={r.key} className={`report-card ${r.key === key ? 'on' : ''}`} onClick={() => choose(r.key)}>
            <b>{r.title}</b><span>{r.description}</span>
          </button>
        ))}
      </div>

      {info && (
        <div className="panel report-controls">
          {info.dateRange && <>
            <label>From<input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} /></label>
            <label>To<input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} /></label>
            <div className="presets">
              {PRESETS.map(([name, range]) => (
                <button key={name} className="btn-secondary" onClick={() => { const [f, t] = range(); setFrom(f); setTo(t); }}>{name}</button>
              ))}
            </div>
          </>}
          {info.filterLabel && (
            <label>{info.filterLabel}
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">All</option>
                {info.filterOptions.map((o) => <option key={o} value={o}>{label(o)}</option>)}
              </select>
            </label>
          )}
          <label style={{ flex: 1, minWidth: 180 }}>Search in results
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to narrow the table…" />
          </label>
        </div>
      )}

      {error && <div className="alert" style={{ marginBottom: 12 }}>{error}</div>}

      {data && (
        <div className="print-only">
          <h2>{data.title}</h2>
          <div className="muted">{data.period} · generated {data.generatedAt}</div>
        </div>
      )}

      {data && (
        <div className="stats" style={{ marginBottom: 16 }}>
          {data.summary.map((s) => (
            <div className="stat" key={s.label}><div className="stat-n">{stat(s)}</div><div className="muted">{s.label}</div></div>
          ))}
        </div>
      )}

      {loading && <div className="muted" style={{ marginBottom: 8 }}>Running report…</div>}

      {data && (
        <div className="panel">
          <div className="pager">
            <span className="muted">
              {data.title} · {data.period} · {rows.length.toLocaleString('en-IN')} row{rows.length === 1 ? '' : 's'}
              {q && ` matching “${q}”`} · generated {data.generatedAt}
            </span>
          </div>
          {data.truncated && (
            <div className="alert" style={{ margin: '0 14px 12px' }}>
              This report has more than {data.rows.length.toLocaleString('en-IN')} rows. Only the first
              {' '}{data.rows.length.toLocaleString('en-IN')} are shown and exported. Narrow the period or filter to see the rest.
            </div>
          )}
          <div className="table-wrap report-scroll">
            <table className="report-table">
              <thead>
                <tr>
                  {data.columns.map((c) => (
                    <th key={c.key} className={isNumeric(c) ? 'num' : ''} onClick={() => sortBy(c.key)}>
                      {c.label}{sort.key === c.key && <i className={`fas fa-arrow-${sort.dir === 1 ? 'up' : 'down'}`} style={{ marginLeft: 6, fontSize: 10 }} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, limit).map((r, i) => (
                  <tr key={i}>{data.columns.map((c) => <td key={c.key} className={isNumeric(c) ? 'num' : ''}>{show(c, r[c.key])}</td>)}</tr>
                ))}
                {!rows.length && <tr><td colSpan={data.columns.length} className="empty">No data for these filters.</td></tr>}
              </tbody>
            </table>
          </div>
          {rows.length > limit && (
            <div className="pager report-more">
              <button className="btn-secondary" onClick={() => setLimit(limit + PAGE)}>
                Show {Math.min(PAGE, rows.length - limit)} more ({(rows.length - limit).toLocaleString('en-IN')} left)
              </button>
              <button className="btn-secondary" onClick={() => setLimit(rows.length)}>Show all</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}