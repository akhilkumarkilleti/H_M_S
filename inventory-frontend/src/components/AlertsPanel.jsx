import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { buildAlerts } from '../equipmentUtils.js';

const SHOW = 6;

function Group({ title, icon, rows }) {
  const shown = rows.slice(0, SHOW);
  return (
    <div className="alert-group">
      <h4><i className={`fas ${icon}`} /> {title} <span className="muted">({rows.length})</span></h4>
      {!rows.length && <p className="muted alert-none">Nothing to act on.</p>}
      {shown.map(({ e, level, when }) => (
        <Link key={`${e.id}-${title}`} to={`/equipment?q=${encodeURIComponent(e.id)}`} className={`alert-row ${level}`}>
          <span className="alert-main">
            <b>{e.name}</b>
            <small><span className="mono">{e.id}</span>{e.location ? <span className="alert-loc">{e.location}</span> : null}</small>
          </span>
          <span className="alert-when">{when}</span>
        </Link>
      ))}
      {rows.length > SHOW && (
        <Link className="alert-more" to="/equipment">{rows.length - SHOW} more in Equipment</Link>
      )}
    </div>
  );
}

export default function AlertsPanel({ items, loading }) {
  const { maintenance, warranty } = useMemo(() => buildAlerts(items), [items]);
  const total = maintenance.length + warranty.length;

  return (
    <section className="panel alerts" aria-labelledby="alerts-title">
      <div className="panel-title">
        <h3 id="alerts-title"><i className="fas fa-bell" /> Needs attention</h3>
        {!loading && <span className={`count-pill ${total ? 'has' : ''}`}>{total}</span>}
      </div>
      {loading && <p className="muted">Checking equipment…</p>}
      {!loading && total === 0 && (
        <div className="all-clear">
          <i className="fas fa-circle-check" />
          <span>All clear. No overdue maintenance, nothing due in the next 30 days and no warranties ending within 60 days.</span>
        </div>
      )}
      {!loading && total > 0 && (
        <div className="alerts-grid">
          <Group title="Maintenance" icon="fa-tools" rows={maintenance} />
          <Group title="Warranty" icon="fa-shield-halved" rows={warranty} />
        </div>
      )}
    </section>
  );
}