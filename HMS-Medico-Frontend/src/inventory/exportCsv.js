// Downloads rows as a CSV file (opens correctly in Excel, including the rupee sign).
// columns: [[key, 'Heading'], ...]   rows: array of objects
export function downloadCsv(filename, columns, rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [columns.map(([, head]) => esc(head)).join(',')];
  rows.forEach((r) => lines.push(columns.map(([key]) => esc(r[key])).join(',')));
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}