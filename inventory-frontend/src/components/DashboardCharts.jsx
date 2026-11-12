import { useState } from 'react';

const R = 70;                       // circle radius
const C = 2 * Math.PI * R;          // circle length
const GAP = 2;                      // small gap between segments

/**
 * Donut chart used on the Dashboard.
 * data: [{ key, label, value, color }]
 */
export function DonutChart({ data = [], centerValue, centerLabel, onSelect }) {
  const [active, setActive] = useState(null);
  const total = data.reduce((t, d) => t + d.value, 0);
  const shown = data.filter((d) => d.value > 0);

  let offset = 0;
  const arcs = shown.map((d) => {
    const len = (d.value / total) * C;
    const arc = { ...d, len, offset };
    offset += len;
    return arc;
  });

  return (
    <div className="dx-donut-wrap">
      <svg className="dx-donut" viewBox="0 0 200 200" role="img"
        aria-label={`Chart: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}>
        <circle cx="100" cy="100" r={R} fill="none" stroke="var(--g100)" strokeWidth="26" />
        {arcs.map((a) => (
          <circle
            key={a.key}
            className="dx-seg"
            cx="100" cy="100" r={R} fill="none"
            stroke={a.color}
            strokeWidth={active === a.key ? 30 : 26}
            strokeDasharray={`${Math.max(a.len - (arcs.length > 1 ? GAP : 0), 0.1)} ${C}`}
            strokeDashoffset={-a.offset}
            transform="rotate(-90 100 100)"
            onMouseEnter={() => setActive(a.key)}
            onMouseLeave={() => setActive(null)}
            onClick={() => onSelect && onSelect(a.key)}
          >
            <title>{`${a.label}: ${a.value}`}</title>
          </circle>
        ))}
        <text x="100" y="104" textAnchor="middle" className="dx-donut-v">{centerValue ?? total}</text>
        <text x="100" y="124" textAnchor="middle" className="dx-donut-l">{centerLabel}</text>
      </svg>

      <div className="dx-legend">
        {data.map((d) => (
          <button
            key={d.key}
            type="button"
            className={active === d.key ? 'on' : ''}
            onMouseEnter={() => setActive(d.key)}
            onMouseLeave={() => setActive(null)}
            onClick={() => onSelect && onSelect(d.key)}
          >
            <span className="dx-dot" style={{ background: d.color }} />
            {d.label}
            <b>{d.value}</b>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Horizontal bar list used on the Dashboard.
 * items: [{ key, label, value }]
 */
export function BarList({ items = [], onSelect }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="dx-bars">
      {items.map((i) => (
        <button
          key={i.key}
          type="button"
          className="dx-bar-row"
          onClick={() => onSelect && onSelect(i.key)}
        >
          <div className="dx-bar-top"><span>{i.label}</span><b>{i.value}</b></div>
          <div className="dx-bar-track">
            <div className="dx-bar-fill" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
        </button>
      ))}
    </div>
  );
}