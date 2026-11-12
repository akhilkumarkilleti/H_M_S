import { useState } from 'react';
import { CONDITIONS, label } from '../constants.js';

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

function Shell({ title, err, busy, submitText, onSubmit, onClose, children }) {
  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={onSubmit} style={{ maxWidth: 600 }}>
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

const blankTarget = { assigneeType: 'DEPARTMENT', department: '', staffId: '', location: '' };

/** "Who gets it": a department, or a doctor / staff member. Shared by Assign and Transfer. */
function TargetFields({ f, setF, assignees }) {
  const departments = [...new Set(assignees.map((a) => a.department).filter(Boolean))].sort();
  const isStaff = f.assigneeType === 'STAFF';

  const pickStaff = (e) => {
    const staff = assignees.find((a) => String(a.id) === e.target.value);
    setF({ ...f, staffId: e.target.value, department: f.department || staff?.department || '' });
  };

  return (
    <>
      <label>Assign to
        <select value={f.assigneeType} onChange={(e) => setF({ ...f, assigneeType: e.target.value, staffId: '' })}>
          <option value="DEPARTMENT">A department</option>
          <option value="STAFF">A doctor / staff member</option>
        </select>
      </label>
      {isStaff && (
        <label>Doctor / staff member<span className="req"> *</span>
          <select value={f.staffId} onChange={pickStaff}>
            <option value="">Select person…</option>
            {assignees.map((a) => (
              <option key={a.id} value={a.id}>{a.fullName} — {label(a.role)}{a.department ? ` (${a.department})` : ''}</option>
            ))}
          </select>
        </label>
      )}
      <label>Department{!isStaff && <span className="req"> *</span>}
        <input list="dept-options" value={f.department} maxLength={100}
               placeholder={isStaff ? 'Defaults to the person’s department' : 'e.g. Cardiology'}
               onChange={(e) => setF({ ...f, department: e.target.value })} />
        <datalist id="dept-options">{departments.map((d) => <option key={d} value={d} />)}</datalist>
      </label>
      <label>Room / ward / bed
        <input value={f.location} maxLength={150} placeholder="e.g. ICU Bed 4"
               onChange={(e) => setF({ ...f, location: e.target.value })} />
      </label>
    </>
  );
}

const targetProblem = (f) =>
  f.assigneeType === 'STAFF' && !f.staffId ? 'Select the doctor / staff member.'
    : f.assigneeType === 'DEPARTMENT' && !f.department.trim() ? 'Enter the department.' : '';

const targetPayload = (f) => ({
  assigneeType: f.assigneeType,
  department: f.department,
  staffId: f.assigneeType === 'STAFF' ? Number(f.staffId) : null,
  location: f.location,
});

/** Give an available item to a department or person. */
export function AssignModal({ equipment, assignees, onSave, onClose }) {
  const today = todayIso();
  const [f, setF] = useState({ equipmentId: '', ...blankTarget, assignedDate: today, expectedReturnDate: '', remarks: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const available = equipment.filter((e) => e.status === 'AVAILABLE');
  const { busy, err, run } = useSubmit(() =>
    onSave({ equipmentId: f.equipmentId, ...targetPayload(f), assignedDate: f.assignedDate,
      expectedReturnDate: f.expectedReturnDate, remarks: f.remarks }));

  const submit = (e) => run(e,
    !f.equipmentId ? 'Select the equipment.'
      : targetProblem(f)
        || (f.assignedDate > today ? 'Assigned date cannot be in the future.'
          : f.expectedReturnDate && f.expectedReturnDate < f.assignedDate ? 'Expected return cannot be before the assigned date.' : ''));

  return (
    <Shell title="Assign equipment" err={err} busy={busy} submitText="Assign" onSubmit={submit} onClose={onClose}>
      <div className="grid">
        <label>Equipment<span className="req"> *</span>
          <select value={f.equipmentId} onChange={set('equipmentId')}>
            <option value="">{available.length ? 'Select available equipment…' : 'No equipment is available'}</option>
            {available.map((e) => (
              <option key={e.id} value={e.id}>{e.id} — {e.name}{e.location ? ` (${e.location})` : ''}</option>
            ))}
          </select>
        </label>
        <TargetFields f={f} setF={setF} assignees={assignees} />
        <label>Assigned on
          <input type="date" value={f.assignedDate} max={today} onChange={set('assignedDate')} />
        </label>
        <label>Expected return
          <input type="date" value={f.expectedReturnDate} min={f.assignedDate || undefined} onChange={set('expectedReturnDate')} />
        </label>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        <span>Purpose / remarks</span>
        <input value={f.remarks} maxLength={255} onChange={set('remarks')} />
      </label>
    </Shell>
  );
}

/** Hand an item that is already out to someone else. */
export function TransferModal({ record, assignees, onSave, onClose }) {
  const today = todayIso();
  const [f, setF] = useState({ ...blankTarget, assignedDate: today, expectedReturnDate: '', remarks: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const { busy, err, run } = useSubmit(() =>
    onSave({ ...targetPayload(f), assignedDate: f.assignedDate, expectedReturnDate: f.expectedReturnDate, remarks: f.remarks }));

  const submit = (e) => run(e,
    targetProblem(f)
      || (f.assignedDate > today ? 'Transfer date cannot be in the future.'
        : f.assignedDate < record.assignedDate ? 'Transfer date cannot be before the current assignment started.'
          : f.expectedReturnDate && f.expectedReturnDate < f.assignedDate ? 'Expected return cannot be before the transfer date.' : ''));

  return (
    <Shell title={`Transfer ${record.equipmentName}`} err={err} busy={busy} submitText="Transfer" onSubmit={submit} onClose={onClose}>
      <p className="muted" style={{ marginBottom: 14 }}>
        Now with <b>{record.staffName || record.department}</b>
        {record.staffName ? ` (${record.department})` : ''}{record.location ? ` · ${record.location}` : ''}
        {' '}since {record.assignedDate}.
      </p>
      <div className="grid">
        <TargetFields f={f} setF={setF} assignees={assignees} />
        <label>Transfer date
          <input type="date" value={f.assignedDate} min={record.assignedDate} max={today} onChange={set('assignedDate')} />
        </label>
        <label>Expected return
          <input type="date" value={f.expectedReturnDate} min={f.assignedDate || undefined} onChange={set('expectedReturnDate')} />
        </label>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        <span>Remarks</span>
        <input value={f.remarks} maxLength={255} onChange={set('remarks')} />
      </label>
    </Shell>
  );
}

/** Take an item back. */
export function ReturnModal({ record, onSave, onClose }) {
  const today = todayIso();
  const [f, setF] = useState({ returnedDate: today, condition: '', equipmentStatus: '', returnLocation: '', notes: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const { busy, err, run } = useSubmit(() => onSave(f));

  const submit = (e) => run(e,
    !f.returnedDate ? 'Return date is required.'
      : f.returnedDate > today ? 'Return date cannot be in the future.'
        : f.returnedDate < record.assignedDate ? 'Return date cannot be before the assigned date.' : '');

  return (
    <Shell title={`Return ${record.equipmentName}`} err={err} busy={busy} submitText="Mark returned" onSubmit={submit} onClose={onClose}>
      <p className="muted" style={{ marginBottom: 14 }}>
        {record.equipmentId} · with <b>{record.staffName || record.department}</b> since {record.assignedDate}.
      </p>
      <div className="grid">
        <label>Returned on<span className="req"> *</span>
          <input type="date" value={f.returnedDate} min={record.assignedDate} max={today} onChange={set('returnedDate')} />
        </label>
        <label>Condition on return
          <select value={f.condition} onChange={set('condition')}>
            <option value="">Keep current</option>
            {CONDITIONS.map((c) => <option key={c} value={c}>{label(c)}</option>)}
          </select>
        </label>
        <label>Equipment status after return
          <select value={f.equipmentStatus} onChange={set('equipmentStatus')}>
            <option value="">Available</option>
            <option value="DAMAGED">Damaged</option>
          </select>
        </label>
        <label>Kept at now
          <input value={f.returnLocation} maxLength={150} placeholder="e.g. Store room" onChange={set('returnLocation')} />
        </label>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        <span>Notes</span>
        <textarea value={f.notes} maxLength={500} rows={3} onChange={set('notes')} />
      </label>
    </Shell>
  );
}