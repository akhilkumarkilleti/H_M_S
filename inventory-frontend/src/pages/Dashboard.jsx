import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { dashboardApi } from '../api.js';
import {
  STATUSES, canBuy, canEditEquipment, canEditStock, canManageAssignments, inr, label,
} from '../constants.js';
import { BarList, DonutChart } from '../components/DashboardCharts.jsx';
const STATUS_COLORS = {
  AVAILABLE: '#22c55e', IN_USE: '#3b82f6', UNDER_MAINTENANCE: '#f59e0b', DAMAGED: '#ef4444',
  LOST: '#8b5cf6', RETIRED: '#9ca3af', DISPOSED: '#4b5563',
};
const ALERT_STYLE = {
  DANGER: ['fa-circle-exclamation', 'red', 'danger'],
  WARN: ['fa-triangle-exclamation', 'yellow', 'warn'],
  INFO: ['fa-circle-info', 'blue', 'info'],
};
const ACTIVITY_STYLE = {
  STOCK: ['fa-boxes', 'green'], MAINTENANCE: ['fa-tools', 'yellow'],
  ASSIGNMENT: ['fa-user-check', 'purple'], PURCHASE: ['fa-truck', 'blue'],
};
const REPORT_ROLES = ['ADMIN', 'INVENTORY_MANAGER', 'STORE_KEEPER', 'MAINTENANCE_ENGINEER'];

const greeting = (h) => (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
const ago = (iso) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};
const daysLeft = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((new Date(y, m - 1, d) - t) / 864e5);
};
const relDays = (n) => (n < 0 ? `${-n} day${n === -1 ? '' : 's'} overdue` : n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : `in ${n} days`);

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());

  const load = useCallback(async (manual = false) => {
    if (manual === true) setRefreshing(true);
    try { setD(await dashboardApi.get()); setError(''); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  // first load, refresh every minute, and keep the greeting / clock current
  useEffect(() => {
    load();
    const refresh = setInterval(() => load(), 60000);
    const clock = setInterval(() => setNow(new Date()), 30000);
    return () => { clearInterval(refresh); clearInterval(clock); };
  }, [load]);

  const firstName = (user?.fullName || user?.email || 'there').split(' ')[0];

  const quick = [
    canEditEquipment(user.role) && ['/equipment', 'fa-plus-circle', 'Add equipment'],
    ['/maintenance', 'fa-screwdriver-wrench', 'Report a repair'],
    canManageAssignments(user.role) && ['/assignments', 'fa-user-check', 'Assign equipment'],
    canEditStock(user.role) && ['/stock', 'fa-boxes', 'Stock movement'],
    canBuy(user.role) && ['/purchase-orders', 'fa-truck', 'Purchase order'],
    REPORT_ROLES.includes(user.role) && ['/reports', 'fa-chart-bar', 'Reports'],
  ].filter(Boolean);

  const eq = d?.equipment, mt = d?.maintenance, as = d?.assignments, st = d?.stock, po = d?.purchasing;
  const kpis = d ? [
    { l: 'Total equipment', n: eq.total, i: 'fa-stethoscope', c: 'blue', to: '/equipment', hint: `${eq.utilization}% utilization` },
    { l: 'Available', n: eq.byStatus.AVAILABLE, i: 'fa-check-circle', c: 'green', to: '/equipment?status=AVAILABLE', hint: 'Ready to assign' },
    { l: 'In use', n: eq.byStatus.IN_USE, i: 'fa-user-check', c: 'purple', to: '/assignments', hint: `${as.active} active assignments` },
    { l: 'Under maintenance', n: eq.byStatus.UNDER_MAINTENANCE, i: 'fa-tools', c: 'yellow', to: '/maintenance?tab=IN_PROGRESS', hint: `${mt.inProgress} job${mt.inProgress === 1 ? '' : 's'} in progress` },
    { l: 'Damaged', n: eq.byStatus.DAMAGED, i: 'fa-heart-crack', c: 'red', to: '/equipment?status=DAMAGED', hint: eq.byStatus.DAMAGED ? 'Needs attention' : 'Nothing damaged' },
    { l: 'Maintenance overdue', n: mt.overdue, i: 'fa-hourglass-end', c: 'pink', to: '/maintenance?tab=OVERDUE', hint: `${mt.dueNext7Days} due this week` },
    { l: 'Overdue returns', n: as.overdueReturns, i: 'fa-rotate-left', c: 'orange', to: '/assignments?tab=OVERDUE', hint: `${as.dueNext7Days} due back this week` },
    { l: 'Low / out of stock', n: st.lowStock + st.outOfStock, i: 'fa-triangle-exclamation', c: 'yellow', to: '/stock?status=LOW_STOCK', hint: `${st.outOfStock} out of stock` },
    po && { l: 'Waiting to arrive', n: inr(po.pendingValue), i: 'fa-truck', c: 'teal', to: '/purchase-orders', hint: `${po.ordered + po.partiallyReceived} open order${po.ordered + po.partiallyReceived === 1 ? '' : 's'}` },
    eq.value != null && { l: 'Equipment value', n: inr(eq.value), i: 'fa-indian-rupee-sign', c: 'teal', to: null, hint: 'Excludes lost, retired, disposed' },
  ].filter(Boolean) : [];

  return (
    <>
      {/* HERO */}
      <section className="dx-hero">
        <div>
          <h2>{greeting(now.getHours())}, {firstName}</h2>
          <p>Here is what needs your attention today.</p>
          <div className="dx-meta">
            <span className="dx-chip"><i className="fas fa-calendar-day" /> {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="dx-chip"><i className="fas fa-clock" /> {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            {user?.role && <span className="dx-chip"><i className="fas fa-id-badge" /> {label(user.role)}</span>}
            {d && <span className="dx-chip"><i className="fas fa-rotate" /> Updated {d.generatedAt.slice(11)}</span>}
          </div>
        </div>
        <button className="dx-glass" onClick={() => load(true)} disabled={refreshing}>
          <i className={`fas fa-rotate ${refreshing ? 'dx-spin' : ''}`} /> Refresh
        </button>
      </section>

      {error && <div className="alert" style={{ marginBottom: 16 }}>{error}</div>}

      {/* KPI CARDS */}
      <div className="dx-kpis">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div className="dx-skeleton" key={i} />)
          : kpis.map((k) => {
              const body = (
                <>
                  <div className="dx-kpi-top">
                    <span className={`stat-icon ${k.c}`} style={{ marginBottom: 0 }}><i className={`fas ${k.i}`} /></span>
                    {k.to && <i className="fas fa-arrow-right dx-go" />}
                  </div>
                  <div className="dx-kpi-n">{k.n}</div>
                  <div className="dx-kpi-l">{k.l}</div>
                  <div className="dx-kpi-h">{k.hint}</div>
                </>
              );
              return k.to
                ? <Link key={k.l} className="dx-kpi" to={k.to}>{body}</Link>
                : <div key={k.l} className="dx-kpi">{body}</div>;
            })}
      </div>

      {d && eq.total === 0 && (
        <div className="dx-card dx-empty">
          <i className="fas fa-box-open" />
          <h3>No equipment yet</h3>
          <p className="muted">Add your first piece of equipment to see charts, alerts and reminders here.</p>
          <Link className="btn-primary" to="/equipment">Go to Equipment</Link>
        </div>
      )}

      {d && eq.total > 0 && (
        <>
          {/* CHARTS */}
          <div className="dx-row">
            <div className="dx-card">
              <div className="dx-head">
                <h3><i className="fas fa-chart-pie" /> Equipment by status</h3>
                <span className="dx-pill info">{eq.utilization}% utilization</span>
              </div>
              <DonutChart
                data={STATUSES.map((s) => ({ key: s, label: label(s), value: eq.byStatus[s] ?? 0, color: STATUS_COLORS[s] }))}
                centerValue={eq.total}
                centerLabel="Total"
                onSelect={(s) => nav(`/equipment?status=${s}`)}
              />
            </div>
            <div className="dx-card">
              <div className="dx-head"><h3><i className="fas fa-layer-group" /> Active equipment by category</h3></div>
              <BarList
                items={eq.byCategory.map((c) => ({ key: c.label, label: c.label, value: c.count }))}
                onSelect={(c) => nav(`/equipment?category=${encodeURIComponent(c)}`)}
              />
              {!eq.byCategory.length && <p className="muted">No active equipment.</p>}
            </div>
          </div>

          {/* ALERTS + UPCOMING MAINTENANCE */}
          <div className="dx-row wide">
            <div className="dx-card">
              <div className="dx-head">
                <h3><i className="fas fa-bell" /> Needs attention</h3>
                <span className="dx-pill info">{d.alerts.length}</span>
              </div>
              <div className="dx-rows">
                {d.alerts.map((a) => {
                  const [icon, color, pill] = ALERT_STYLE[a.level];
                  return (
                    <Link className="dx-item" key={a.title} to={a.link}>
                      <span className={`dx-ico ${color}`}><i className={`fas ${icon}`} /></span>
                      <span className="dx-main"><span className="dx-t">{a.title}</span><span className="dx-s">{a.detail}</span></span>
                      <span className={`dx-pill ${pill}`}>{label(a.level)}</span>
                    </Link>
                  );
                })}
                {!d.alerts.length && <div className="dx-none"><i className="fas fa-circle-check" /> Everything looks good. Nothing needs attention.</div>}
              </div>
            </div>

            <div className="dx-card">
              <div className="dx-head">
                <h3><i className="fas fa-calendar-check" /> Upcoming maintenance</h3>
                <Link to="/maintenance">View all</Link>
              </div>
              <div className="dx-rows">
                {d.upcomingMaintenance.map((m) => {
                  const n = daysLeft(m.scheduledDate);
                  return (
                    <Link className="dx-item" key={m.id} to={`/maintenance?q=${encodeURIComponent(m.equipmentId)}`}>
                      <span className="dx-ico blue"><i className="fas fa-wrench" /></span>
                      <span className="dx-main"><span className="dx-t">{m.equipmentName}</span><span className="dx-s">{m.id} · {label(m.type)} · {m.scheduledDate}</span></span>
                      <span className={`dx-pill ${n < 0 ? 'danger' : n <= 7 ? 'warn' : 'info'}`}>{relDays(n)}</span>
                    </Link>
                  );
                })}
                {!d.upcomingMaintenance.length && <div className="dx-none">No scheduled maintenance.</div>}
              </div>
            </div>
          </div>
        </>
      )}

      {d && (
        <>
          {/* LOW STOCK + ACTIVITY */}
          <div className="dx-row">
            <div className="dx-card">
              <div className="dx-head">
                <h3><i className="fas fa-boxes" /> Stock to reorder</h3>
                <Link to="/stock?status=LOW_STOCK">View all</Link>
              </div>
              <div className="dx-rows">
                {d.lowStock.map((s) => (
                  <Link className="dx-item" key={s.id} to={`/stock?q=${encodeURIComponent(s.id)}`}>
                    <span className={`dx-ico ${s.stockStatus === 'OUT_OF_STOCK' ? 'red' : 'yellow'}`}><i className="fas fa-box" /></span>
                    <span className="dx-main"><span className="dx-t">{s.name}</span><span className="dx-s">{s.quantity} {s.unit} left · reorder at {s.reorderLevel}</span></span>
                    <span className={`badge ${s.stockStatus}`}>{label(s.stockStatus)}</span>
                  </Link>
                ))}
                {!d.lowStock.length && <div className="dx-none"><i className="fas fa-circle-check" /> All stock is above its reorder level.</div>}
              </div>
            </div>

            <div className="dx-card">
              <div className="dx-head"><h3><i className="fas fa-clock-rotate-left" /> Recent activity</h3></div>
              <div className="dx-rows">
                {d.activity.map((a, i) => {
                  const [icon, color] = ACTIVITY_STYLE[a.kind];
                  return (
                    <Link className="dx-item" key={i} to={a.link}>
                      <span className={`dx-ico ${color}`}><i className={`fas ${icon}`} /></span>
                      <span className="dx-main"><span className="dx-t">{a.text}</span></span>
                      <span className="dx-s dx-when">{ago(a.at)}</span>
                    </Link>
                  );
                })}
                {!d.activity.length && <div className="dx-none">No activity yet.</div>}
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="dx-card">
            <div className="dx-head"><h3><i className="fas fa-bolt" /> Quick actions</h3></div>
            <div className="dx-quick">
              {quick.map(([to, icon, text]) => <Link key={to} to={to}><i className={`fas ${icon}`} />{text}</Link>)}
            </div>
          </div>
        </>
      )}
    </>
  );
}