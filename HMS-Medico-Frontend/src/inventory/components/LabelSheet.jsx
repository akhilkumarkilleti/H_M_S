import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';

const PREVIEW_MAX = 12;

/** The QR code opens this item's record in the app (the user must be signed in). */
export const labelUrl = (e) => `${window.location.origin}/equipment?q=${encodeURIComponent(e.id)}`;

export function Label({ e, url }) {
  return (
    <div className="label">
      <QRCodeSVG value={url ?? labelUrl(e)} size={96} level="M" marginSize={0} bgColor="#ffffff" fgColor="#000000" />
      <div className="label-info">
        <span className="label-brand">MedCare</span>
        <b className="label-name">{e.name}</b>
        <span className="label-id">{e.id}</span>
        {e.serialNumber ? <span>S/N {e.serialNumber}</span> : null}
        {e.location ? <span>{e.location}</span> : null}
      </div>
    </div>
  );
}

export default function LabelSheet({ items, onClose }) {
  useEffect(() => {
    const onKey = (ev) => ev.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const many = items.length > 1;
  const extra = items.length - PREVIEW_MAX;

  return (
    <>
      <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal" role="dialog" aria-modal="true" aria-label="Print labels" style={{ maxWidth: 720 }}>
          <h3>Print {many ? `${items.length} labels` : 'label'}</h3>
          <p className="muted">Each label carries a QR code. Scanning it opens the equipment record in MedCare (sign-in required).</p>
          <div className="label-preview">
            {items.slice(0, PREVIEW_MAX).map((e) => <Label key={e.id} e={e} />)}
          </div>
          {extra > 0 && <p className="muted">{extra} more label{extra === 1 ? '' : 's'} will be included when you print.</p>}
          <div className="actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn-primary" onClick={() => window.print()}>
              <i className="fas fa-print" /> Print {many ? `${items.length} labels` : 'label'}
            </button>
          </div>
        </div>
      </div>
      {/* Print-only copy: lives directly under <body> so the print stylesheet can show only this. */}
      {createPortal(
        <div className="print-sheet">{items.map((e) => <Label key={e.id} e={e} />)}</div>,
        document.body,
      )}
    </>
  );
}