import { label } from '../constants.js';

const STATUS_COLORS = {
  AVAILABLE: '#16a34a', IN_USE: '#2563eb', UNDER_MAINTENANCE: '#d97706',
  DAMAGED: '#dc2626', LOST: '#7c3aed', RETIRED: '#9ca3af', DISPOSED: '#6b7280',
};

const R = 52;
const C = 2 * Math.PI * R;

export function StatusDonut({ items }) {
  const counts = {};
  items.forEach((e) => { counts[e.status] = (counts[e.status] || 0) + 1; });
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = items.length;

  let offset = 0;
  const arcs = rows.map(([status, n]) => {
    const len = (n / total) * C;
    const arc = { status, len, offset };
    offset += len;
    return arc;
  });
  const summary = rows.map(([s, n]) => `${label(s)} ${n}`).join(', ');

  return (
    <section className="panel chart-card" aria-labelledby="status-title">
      <div className="panel-title"><h3 id="status-title"><i className="fas fa-chart-pie" /> Equipment by status</h3></div>
      {!total ? <p className="muted">No equipment yet.</p> : (
        <div className="donut-wrap">
          <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label={`Equipment by status: ${summary}`}>
            <circle cx="70" cy="70" r={R} fill="none" stroke="var(--g100)" strokeWidth="18" />
            {arcs.map(({ status, len, offset: o }) => (
              <circle
                key={status} cx="70" cy="70" r={R} fill="none" stroke={STATUS_COLORS[status] || '#9ca3af'} strokeWidth="18"
                strokeDasharray={`${Math.max(len - (arcs.length > 1 ? 1.5 : 0), 0.1)} ${C}`} strokeDashoffset={-o}
                transform="rotate(-90 70 70)"
              />
            ))}
            <text x="70" y="68" textAnchor="middle" className="donut-n">{total}</text>
            <text x="70" y="86" textAnchor="middle" className="donut-l">items</text>
          </svg>
          <ul className="legend">
            {rows.map(([status, n]) => (
              <li key={status}>
                <span className="swatch" style={{ background: STATUS_COLORS[status] || '#9ca3af' }} />
                <span className="legend-name">{label(status)}</span>
                <b>{n}</b>
                <span className="muted">{Math.round((n / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

const TOP = 7;

export function CategoryBars({ items }) {
  const counts = {};
  items.forEach((e) => { const k = e.category || 'Uncategorized'; counts[k] = (counts[k] || 0) + 1; });
  let rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (rows.length > TOP + 1) {
    const rest = rows.slice(TOP).reduce((t, [, n]) => t + n, 0);
    rows = [...rows.slice(0, TOP), [`Other (${rows.length - TOP} categories)`, rest]];
  }
  const max = Math.max(1, ...rows.map(([, n]) => n));

  return (
    <section className="panel chart-card" aria-labelledby="cat-title">
      <div className="panel-title"><h3 id="cat-title"><i className="fas fa-tags" /> Equipment by category</h3></div>
      {!rows.length ? <p className="muted">No equipment yet.</p> : (
        <ul className="bars">
          {rows.map(([name, n]) => (
            <li key={name}>
              <div className="bar-top"><span>{name}</span><b>{n}</b></div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${(n / max) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}