import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { equipmentApi, maintenanceApi } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { MAINT_TYPES, canManageMaintenance, inr, label } from '../constants.js';
import { CompleteModal, RepairModal, ScheduleModal } from '../components/MaintenanceModals.jsx';

const TABS = [
  ['', 'All'], ['SCHEDULED', 'Scheduled'], ['IN_PROGRESS', 'In progress'],
  ['OVERDUE', 'Overdue'], ['COMPLETED', 'Completed'], ['CANCELLED', 'Cancelled'],
];

export default function Maintenance() {
  const { user } = useAuth();
  const canManage = canManageMaintenance(user.role);
  const [params] = useSearchParams();

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(params.get('tab') || '');
  const [type, setType] = useState('');
  const [q, setQ] = useState(params.get('q') || '');
  const [modal, setModal] = useState(null);   // { kind: 'schedule' | 'repair' | 'complete' | 'view', record? }
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const refresh = async () => {
    try {
      const [r, s, e] = await Promise.all([maintenanceApi.list(), maintenanceApi.summary(), equipmentApi.list()]);
      setRecords(r); setSummary(s); setEquipment(e);
    } catch (x) { setError(x.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  const shown = useMemo(() => records.filter((m) => {
    const tabOk = !tab || (tab === 'OVERDUE' ? m.overdue : m.status === tab);
    const text = `${m.id} ${m.equipmentId} ${m.equipmentName} ${m.assignedTo ?? ''} ${m.description}`.toLowerCase();
    return tabOk && (!type || m.type === type) && (!q || text.includes(q.toLowerCase()));
  }), [records, tab, type, q]);

  const tabCount = (t) => (t === '' ? records.length
    : t === 'OVERDUE' ? records.filter((m) => m.overdue).length
      : records.filter((m) => m.status === t).length);

  const done = async (message) => { setModal(null); setError(''); setMsg(message); await refresh(); };
  const run = async (fn, okMessage) => {
    setError(''); setMsg('');
    try { await fn(); setMsg(okMessage); await refresh(); }
    catch (e) { setError(e.message); }
  };

  const start = (m) => run(() => maintenanceApi.start(m.id), `${m.id} started. ${m.equipmentName} is now Under Maintenance.`);
  const cancel = (m) => {
    if (!confirm(`Cancel ${m.id} for ${m.equipmentName}?`)) return;
    run(() => maintenanceApi.cancel(m.id), `${m.id} was cancelled.`);
  };

  const saveSchedule = async (data) => {
    if (modal.record) await maintenanceApi.update(modal.record.id, data);
    else await maintenanceApi.create(data);
    await done(modal.record ? `${modal.record.id} updated.` : 'Maintenance scheduled.');
  };
  const saveRepair = async (data) => {
    const created = await maintenanceApi.repair(data);
    await done(`Repair request ${created.id} sent.`);
  };
  const saveComplete = async (data) => {
    await maintenanceApi.complete(modal.record.id, data);
    await done(`${modal.record.id} completed.`);
  };

  const cards = summary ? [
    ['Scheduled', summary.scheduled, 'fa-calendar-check', 'blue'],
    ['In progress', summary.inProgress, 'fa-tools', 'yellow'],
    ['Overdue', summary.overdue, 'fa-hourglass-end', 'red'],
    ['Due in 7 days', summary.dueNext7Days, 'fa-calendar-alt', 'orange'],
    ['Open repair requests', summary.openRepairs, 'fa-screwdriver-wrench', 'pink'],
    ['Completed this month', summary.completedThisMonth, 'fa-check-circle', 'green'],
    ['Cost this month', inr(summary.costThisMonth), 'fa-indian-rupee-sign', 'teal'],
  ] : [];

  const m = modal?.record;

  return (
    <>
      <div className="page-head">
        <h2>Maintenance</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => setModal({ kind: 'repair' })}>
            <i className="fas fa-screwdriver-wrench" /> Report a repair
          </button>
          {canManage && (
            <button className="btn-primary" onClick={() => setModal({ kind: 'schedule' })}>
              <i className="fas fa-plus-circle" /> Schedule maintenance
            </button>
          )}
        </div>
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

      <div className="toolbar">
        {TABS.map(([k, l]) => (
          <button key={k || 'all'} className={tab === k ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab(k)}>
            {l} ({tabCount(k)})
          </button>
        ))}
      </div>
      <div className="toolbar">
        <input placeholder="Search job, equipment, technician, description…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {MAINT_TYPES.map((t) => <option key={t} value={t}>{label(t)}</option>)}
        </select>
      </div>

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr><th>Job</th><th>Equipment</th><th>Type</th><th>Priority</th><th>Scheduled</th><th>Status</th><th>Assigned to</th><th>Cost</th><th /></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="9" className="empty">Loading maintenance…</td></tr>}
            {!loading && shown.map((r) => (
              <tr key={r.id}>
                <td><b>{r.id}</b></td>
                <td>{r.equipmentName}<div className="muted">{r.equipmentId}</div></td>
                <td>{label(r.type)}</td>
                <td><span className={`badge p-${r.priority}`}>{label(r.priority)}</span></td>
                <td>{r.scheduledDate}</td>
                <td>
                  <span className={`badge ${r.status}`}>{label(r.status)}</span>
                  {r.overdue && <span className="badge OVERDUE" style={{ marginLeft: 6 }}>Overdue</span>}
                </td>
                <td>{r.assignedTo || '—'}</td>
                <td>{r.cost != null ? inr(r.cost) : '—'}</td>
                <td className="row-actions">
                  <button title="View" onClick={() => setModal({ kind: 'view', record: r })}><i className="fas fa-eye" /></button>
                  {canManage && r.status === 'SCHEDULED' && <>
                    <button title="Start work" onClick={() => start(r)}><i className="fas fa-play" /></button>
                    <button title="Complete" onClick={() => setModal({ kind: 'complete', record: r })}><i className="fas fa-check" /></button>
                    <button title="Edit" onClick={() => setModal({ kind: 'schedule', record: r })}><i className="fas fa-edit" /></button>
                    <button title="Cancel" onClick={() => cancel(r)}><i className="fas fa-ban" /></button>
                  </>}
                  {canManage && r.status === 'IN_PROGRESS' && <>
                    <button title="Complete" onClick={() => setModal({ kind: 'complete', record: r })}><i className="fas fa-check" /></button>
                    <button title="Cancel" onClick={() => cancel(r)}><i className="fas fa-ban" /></button>
                  </>}
                </td>
              </tr>
            ))}
            {!loading && !shown.length && <tr><td colSpan="9" className="empty">No maintenance jobs found.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal?.kind === 'schedule' && <ScheduleModal record={m} equipment={equipment} onSave={saveSchedule} onClose={() => setModal(null)} />}
      {modal?.kind === 'repair' && <RepairModal equipment={equipment} onSave={saveRepair} onClose={() => setModal(null)} />}
      {modal?.kind === 'complete' && <CompleteModal record={m} onSave={saveComplete} onClose={() => setModal(null)} />}

      {modal?.kind === 'view' && (
        <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: 580 }}>
            <h3>{m.id} <span className="muted">{label(m.type)}</span></h3>
            <dl className="details">
              {[
                ['Equipment', `${m.equipmentName} (${m.equipmentId})`], ['Location', m.equipmentLocation],
                ['Priority', label(m.priority)], ['Status', label(m.status) + (m.overdue ? ' · Overdue' : '')],
                ['Scheduled for', m.scheduledDate], ['Started', m.startedDate], ['Completed', m.completedDate],
                ['Assigned to', m.assignedTo], ['Cost', m.cost != null ? inr(m.cost) : null],
                ['Requested by', m.requestedBy], ['Created', m.createdAt?.replace('T', ' ').slice(0, 16)],
              ].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || '—'}</dd></div>)}
              <div style={{ gridColumn: '1 / -1' }}><dt>Work to be done / fault</dt><dd>{m.description}</dd></div>
              <div style={{ gridColumn: '1 / -1' }}><dt>Notes</dt><dd>{m.notes || '—'}</dd></div>
            </dl>
            <div className="actions">
              <button className="btn-secondary" onClick={() => { setQ(m.equipmentId); setTab(''); setModal(null); }}>
                All jobs for {m.equipmentId}
              </button>
              <button className="btn-primary" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}