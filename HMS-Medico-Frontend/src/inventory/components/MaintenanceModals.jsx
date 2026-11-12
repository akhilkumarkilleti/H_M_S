import { useState } from 'react';
import { MAINT_TYPES, PRIORITIES, CONDITIONS, label } from '../constants.js';

// local date as yyyy-MM-dd (toISOString() would use UTC and can be a day off early in the morning in India)
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const serviceable = (e) => !['RETIRED', 'DISPOSED', 'LOST'].includes(e.status);

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
      <form className="modal" onSubmit={onSubmit} style={{ maxWidth: 580 }}>
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

function EquipmentSelect({ value, onChange, equipment, disabled, current }) {
  const options = equipment.filter(serviceable);
  return (
    <label>
      Equipment<span className="req"> *</span>
      <select value={value} onChange={onChange} disabled={disabled}>
        <option value="">Select equipment…</option>
        {current && !options.some((e) => e.id === current.equipmentId) &&
          <option value={current.equipmentId}>{current.equipmentId} — {current.equipmentName}</option>}
        {options.map((e) => (
          <option key={e.id} value={e.id}>{e.id} — {e.name}{e.location ? ` (${e.location})` : ''}</option>
        ))}
      </select>
    </label>
  );
}

/** Schedule new work, or edit work that is still SCHEDULED. */
export function ScheduleModal({ record, equipment, onSave, onClose }) {
  const [f, setF] = useState({
    equipmentId: record?.equipmentId ?? '',
    type: record?.type ?? 'PREVENTIVE',
    priority: record?.priority ?? 'MEDIUM',
    scheduledDate: record?.scheduledDate ?? '',
    assignedTo: record?.assignedTo ?? '',
    description: record?.description ?? '',
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const { busy, err, run } = useSubmit(() => onSave(f));

  const submit = (e) => run(e,
    !f.equipmentId ? 'Select the equipment.'
      : !f.scheduledDate ? 'Scheduled date is required.'
        : !f.description.trim() ? 'Describe the work to be done.' : '');

  return (
    <Shell title={record ? `Edit ${record.id}` : 'Schedule maintenance'} err={err} busy={busy}
           submitText="Save" onSubmit={submit} onClose={onClose}>
      <div className="grid">
        <EquipmentSelect value={f.equipmentId} onChange={set('equipmentId')} equipment={equipment}
                         disabled={Boolean(record)} current={record} />
        <label>Type
          <select value={f.type} onChange={set('type')}>{MAINT_TYPES.map((t) => <option key={t} value={t}>{label(t)}</option>)}</select>
        </label>
        <label>Scheduled date<span className="req"> *</span>
          <input type="date" value={f.scheduledDate} onChange={set('scheduledDate')} />
        </label>
        <label>Priority
          <select value={f.priority} onChange={set('priority')}>{PRIORITIES.map((p) => <option key={p} value={p}>{label(p)}</option>)}</select>
        </label>
        <label>Assigned to (technician / vendor)
          <input value={f.assignedTo} maxLength={150} onChange={set('assignedTo')} />
        </label>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        <span>Work to be done<span className="req"> *</span></span>
        <textarea value={f.description} maxLength={500} rows={3} onChange={set('description')} />
      </label>
    </Shell>
  );
}

/** Fault report — any logged-in user. */
export function RepairModal({ equipment, onSave, onClose }) {
  const [f, setF] = useState({ equipmentId: '', priority: 'MEDIUM', description: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const { busy, err, run } = useSubmit(() => onSave(f));

  const submit = (e) => run(e,
    !f.equipmentId ? 'Select the equipment that has the problem.'
      : !f.description.trim() ? 'Describe what is wrong.' : '');

  return (
    <Shell title="Report a repair" err={err} busy={busy} submitText="Send request" onSubmit={submit} onClose={onClose}>
      <div className="grid">
        <EquipmentSelect value={f.equipmentId} onChange={set('equipmentId')} equipment={equipment} />
        <label>Priority
          <select value={f.priority} onChange={set('priority')}>{PRIORITIES.map((p) => <option key={p} value={p}>{label(p)}</option>)}</select>
        </label>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        <span>What is wrong?<span className="req"> *</span></span>
        <textarea value={f.description} maxLength={500} rows={4} onChange={set('description')}
                  placeholder="e.g. Screen flickers and the machine restarts during use" />
      </label>
    </Shell>
  );
}

/** Finish a job: cost, notes, next due date, and what happens to the equipment. */
export function CompleteModal({ record, onSave, onClose }) {
  const today = todayIso();
  const [f, setF] = useState({
    completedDate: today, cost: '', notes: '', nextMaintenanceDate: '', condition: '', equipmentStatus: '',
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const { busy, err, run } = useSubmit(() =>
    onSave({ ...f, cost: f.cost === '' ? null : Number(f.cost) }));

  const submit = (e) => run(e,
    !f.completedDate ? 'Completion date is required.'
      : f.completedDate > today ? 'Completion date cannot be in the future.'
        : record.startedDate && f.completedDate < record.startedDate ? 'Completion date cannot be before the start date.'
          : f.cost !== '' && Number(f.cost) < 0 ? 'Cost cannot be negative.'
            : f.nextMaintenanceDate && f.nextMaintenanceDate <= f.completedDate ? 'Next maintenance date must be after the completion date.' : '');

  return (
    <Shell title={`Complete ${record.id}`} err={err} busy={busy} submitText="Mark completed" onSubmit={submit} onClose={onClose}>
      <p className="muted" style={{ marginBottom: 14 }}>
        {record.equipmentName} ({record.equipmentId}) — {record.description}
      </p>
      <div className="grid">
        <label>Completed on<span className="req"> *</span>
          <input type="date" value={f.completedDate} min={record.startedDate || undefined} max={today} onChange={set('completedDate')} />
        </label>
        <label>Cost (₹)
          <input type="number" min="0" step="0.01" value={f.cost} onChange={set('cost')} />
        </label>
        <label>Next maintenance due
          <input type="date" value={f.nextMaintenanceDate} min={f.completedDate || undefined} onChange={set('nextMaintenanceDate')} />
        </label>
        <label>Equipment condition now
          <select value={f.condition} onChange={set('condition')}>
            <option value="">Keep current</option>
            {CONDITIONS.map((c) => <option key={c} value={c}>{label(c)}</option>)}
          </select>
        </label>
        <label>Equipment status after work
          <select value={f.equipmentStatus} onChange={set('equipmentStatus')}>
            <option value="">Automatic</option>
            {['AVAILABLE', 'IN_USE', 'DAMAGED', 'RETIRED'].map((s) => <option key={s} value={s}>{label(s)}</option>)}
          </select>
        </label>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        <span>Work done / notes</span>
        <textarea value={f.notes} maxLength={1000} rows={3} onChange={set('notes')} />
      </label>
      <p className="muted" style={{ marginTop: 10 }}>
        {record.status === 'IN_PROGRESS'
          ? 'Automatic puts the equipment back to the status it had before the job started. '
          : ''}
        Leaving “Next maintenance due” empty clears an old due date that this job has now served.
      </p>
    </Shell>
  );
}