// Shared date + status helpers (UI only, no API calls).
export const INACTIVE = ['RETIRED', 'DISPOSED', 'LOST'];

const pad = (n) => String(n).padStart(2, '0');
// Local calendar date as YYYY-MM-DD (toISOString would use UTC and can be a day off).
export const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => isoDate(new Date());
export const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return isoDate(d); };
const dayNumber = (s) => Date.parse(`${String(s).slice(0, 10)}T00:00:00Z`) / 864e5;
export const daysBetween = (from, to) => Math.round(dayNumber(to) - dayNumber(from));

export const isLive = (e) => !INACTIVE.includes(e.status);
export const isOverdue = (e) => !!e.nextMaintenance && e.nextMaintenance < today() && isLive(e);

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

export const MAINT_WINDOW_DAYS = 30;
export const WARRANTY_WINDOW_DAYS = 60;

/** Builds the lists shown in the dashboard alerts panel, most urgent first. */
export function buildAlerts(items) {
  const t = today();
  const maintenance = [];
  const warranty = [];
  for (const e of items) {
    if (!isLive(e)) continue;
    if (e.nextMaintenance) {
      const d = daysBetween(t, e.nextMaintenance);
      if (d < 0) maintenance.push({ e, days: d, level: 'danger', when: `${plural(-d, 'day')} overdue` });
      else if (d <= MAINT_WINDOW_DAYS)
        maintenance.push({ e, days: d, level: 'warn', when: d === 0 ? 'Due today' : `Due in ${plural(d, 'day')}` });
    }
    if (e.warrantyUntil) {
      const d = daysBetween(t, e.warrantyUntil);
      if (d < 0) warranty.push({ e, days: d, level: 'danger', when: `Expired ${plural(-d, 'day')} ago` });
      else if (d <= WARRANTY_WINDOW_DAYS)
        warranty.push({ e, days: d, level: 'warn', when: d === 0 ? 'Ends today' : `Ends in ${plural(d, 'day')}` });
    }
  }
  const byUrgency = (a, b) => a.days - b.days;
  return { maintenance: maintenance.sort(byUrgency), warranty: warranty.sort(byUrgency) };
}