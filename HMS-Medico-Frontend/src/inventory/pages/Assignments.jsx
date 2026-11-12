import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { assignmentApi, equipmentApi } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { canManageAssignments, label } from '../constants.js';
import { AssignModal, ReturnModal, TransferModal } from '../components/AssignmentModals.jsx';

const TABS = [['ACTIVE', 'Active'], ['OVERDUE', 'Overdue'], ['HISTORY', 'History'], ['', 'All']];

export default function Assignments() {
  const { user } = useAuth();
  const canManage = canManageAssignments(user.role);
  const [params] = useSearchParams();

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(params.get('tab') ?? 'ACTIVE');
  const [q, setQ] = useState(params.get('q') || '');
  const [modal, setModal] = useState(null);   // { kind: 'assign' | 'return' | 'transfer' | 'view', record? }
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const refresh = async () => {
    try {
      const [r, s, e, a] = await Promise.all([
        assignmentApi.list(), assignmentApi.summary(), equipmentApi.list(), assignmentApi.assignees(),
      ]);
      setRecords(r); setSummary(s); setEquipment(e); setAssignees(a);
    } catch (x) { setError(x.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  const inTab = (a, t) => !t || (t === 'ACTIVE' ? a.status === 'ACTIVE'
    : t === 'OVERDUE' ? a.overdue : a.status !== 'ACTIVE');

  const shown = useMemo(() => records.filter((a) => {
    const text = `${a.id} ${a.equipmentId} ${a.equipmentName} ${a.department} ${a.staffName ?? ''} ${a.location ?? ''}`.toLowerCase();
    return inTab(a, tab) && (!q || text.includes(q.toLowerCase()));
  }), [records, tab, q]);

  const done = async (message) => { setModal(null); setError(''); setMsg(message); await refresh(); };

  const saveAssign = async (data) => {
    const a = await assignmentApi.create(data);
    await done(`${a.equipmentName} assigned to ${a.staffName || a.department} (${a.id}).`);
  };
  const saveTransfer = async (data) => {
    const a = await assignmentApi.transfer(modal.record.id, data);
    await done(`${a.equipmentName} transferred to ${a.staffName || a.department} (${a.id}).`);
  };
  const saveReturn = async (data) => {
    await assignmentApi.returnEquipment(modal.record.id, data);
    await done(`${modal.record.equipmentName} returned.`);
  };

  const cards = summary ? [
    ['Active assignments', summary.active, 'fa-user-check', 'purple'],
    ['Overdue returns', summary.overdueReturns, 'fa-hourglass-end', 'red'],
    ['Due back in 7 days', summary.dueNext7Days, 'fa-calendar-alt', 'orange'],
    ['Available to assign', summary.availableEquipment, 'fa-check-circle', 'green'],
    ['Returned this month', summary.returnedThisMonth, 'fa-rotate-left', 'blue'],
  ] : [];

  const m = modal?.record;

  return (
    <>
      <div className="page-head">
        <h2>Equipment Assignment</h2>
        {canManage && (
          <button className="btn-primary" onClick={() => setModal({ kind: 'assign' })}>
            <i className="fas fa-plus-circle" /> Assign equipment
          </button>
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

      {summary?.departments?.length > 0 && (
        <div className="panel" style={{ padding: 16, marginBottom: 16 }}>
          <div className="muted" style={{ marginBottom: 10 }}>Where the equipment is right now — click a department to filter</div>
          <div className="dept-chips">
            {summary.departments.map((d) => (
              <button key={d.department} className={`dept-chip ${q === d.department ? 'on' : ''}`}
                      onClick={() => { setQ(q === d.department ? '' : d.department); setTab('ACTIVE'); }}>
                {d.department} <b>{d.count}</b>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="toolbar">
        {TABS.map(([k, l]) => (
          <button key={k || 'all'} className={tab === k ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab(k)}>
            {l} ({records.filter((a) => inTab(a, k)).length})
          </button>
        ))}
      </div>
      <div className="toolbar">
        <input placeholder="Search equipment, department, person, location…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr><th>Assignment</th><th>Equipment</th><th>Assigned to</th><th>Location</th><th>Since</th><th>Expected return</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="8" className="empty">Loading assignments…</td></tr>}
            {!loading && shown.map((a) => (
              <tr key={a.id}>
                <td><b>{a.id}</b></td>
                <td>{a.equipmentName}<div className="muted">{a.equipmentId}</div></td>
                <td>{a.staffName || a.department}{a.staffName && <div className="muted">{a.department}</div>}</td>
                <td>{a.location || '—'}</td>
                <td>{a.assignedDate}<div className="muted">{a.daysOut} day{a.daysOut === 1 ? '' : 's'}</div></td>
                <td>{a.expectedReturnDate || '—'}</td>
                <td>
                  <span className={`badge ${a.status}`}>{label(a.status)}</span>
                  {a.overdue && <span className="badge OVERDUE" style={{ marginLeft: 6 }}>Overdue</span>}
                </td>
                <td className="row-actions">
                  <button title="View" onClick={() => setModal({ kind: 'view', record: a })}><i className="fas fa-eye" /></button>
                  {canManage && a.status === 'ACTIVE' && <>
                    <button title="Transfer" onClick={() => setModal({ kind: 'transfer', record: a })}><i className="fas fa-right-left" /></button>
                    <button title="Return" onClick={() => setModal({ kind: 'return', record: a })}><i className="fas fa-rotate-left" /></button>
                  </>}
                </td>
              </tr>
            ))}
            {!loading && !shown.length && <tr><td colSpan="8" className="empty">No assignments found.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal?.kind === 'assign' && <AssignModal equipment={equipment} assignees={assignees} onSave={saveAssign} onClose={() => setModal(null)} />}
      {modal?.kind === 'transfer' && <TransferModal record={m} assignees={assignees} onSave={saveTransfer} onClose={() => setModal(null)} />}
      {modal?.kind === 'return' && <ReturnModal record={m} onSave={saveReturn} onClose={() => setModal(null)} />}

      {modal?.kind === 'view' && (
        <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: 600 }}>
            <h3>{m.id} <span className="muted">{m.equipmentName}</span></h3>
            <dl className="details">
              {[
                ['Equipment', `${m.equipmentName} (${m.equipmentId})`], ['Category', m.equipmentCategory],
                ['Assigned to', m.staffName ? `${m.staffName} (${label(m.assigneeType)})` : `${m.department} (${label(m.assigneeType)})`],
                ['Department', m.department], ['Location', m.location],
                ['Status', label(m.status) + (m.overdue ? ' · Overdue' : '')],
                ['Assigned on', m.assignedDate], ['Expected return', m.expectedReturnDate],
                [m.status === 'TRANSFERRED' ? 'Transferred on' : 'Returned on', m.returnedDate],
                ['Days out', String(m.daysOut)], ['Assigned by', m.assignedBy], ['Closed by', m.returnedBy],
                ['Condition on return', m.returnCondition ? label(m.returnCondition) : null],
              ].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || '—'}</dd></div>)}
              <div style={{ gridColumn: '1 / -1' }}><dt>Remarks</dt><dd>{m.remarks || '—'}</dd></div>
              <div style={{ gridColumn: '1 / -1' }}><dt>Return notes</dt><dd>{m.returnNotes || '—'}</dd></div>
            </dl>
            <div className="actions">
              <button className="btn-secondary" onClick={() => { setQ(m.equipmentId); setTab(''); setModal(null); }}>
                Full history of {m.equipmentId}
              </button>
              <button className="btn-primary" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}