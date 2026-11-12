import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import ThemeToggle from '../components/ThemeToggle.jsx';

const FEATURES = [
  ['fa-stethoscope', 'A register you can search', 'Find a device by ID, name, serial number or location. Filter by category and status, sort any column and export the list to CSV.'],
  ['fa-bell', 'Alerts before things lapse', 'The dashboard lists overdue maintenance, services due in the next 30 days and warranties ending within 60 days.'],
  ['fa-qrcode', 'QR labels for every device', 'Print a label for one device or for a whole filtered list. Scanning the code opens that device\u2019s record.'],
  ['fa-chart-pie', 'A dashboard that reads at a glance', 'Equipment by status and by category, inventory value and maintenance counts, all on one page.'],
  ['fa-tags', 'Categories you control', 'Inventory managers add, rename or deactivate categories. Renaming updates every record that uses it.'],
  ['fa-user-shield', 'Access that an admin approves', 'New accounts wait for approval. Repeated failed sign-ins lock an account until an admin unlocks it.'],
];

const STEPS = [
  ['Register', 'Use your employee ID, email and role. The first account created becomes the administrator.'],
  ['Wait for approval', 'An administrator reviews the request in User Management and approves or rejects it.'],
  ['Sign in', 'Use your email or employee ID. You land on the dashboard.'],
];

const ROLES = [
  ['Administrator', 'Everything below, plus approving users and resetting passwords.'],
  ['Inventory manager', 'Add, edit and delete equipment. Manage categories.'],
  ['Store keeper', 'Add and edit equipment.'],
  ['Maintenance engineer', 'Add and edit equipment.'],
  ['Doctor and nurse staff', 'View equipment, the dashboard and alerts. Print labels.'],
];

function AssetTag() {
  const url = `${window.location.origin}/equipment?q=EQ-0042`;
  return (
    <figure className="tag-wrap" aria-label="Example equipment record">
      <div className="tag">
        <div className="tag-top">
          <span className="mono tag-id">EQ-0042</span>
          <span className="badge IN_USE">In Use</span>
        </div>
        <h3>Ventilator</h3>
        <p className="muted">ICU Equipment</p>
        <div className="tag-body">
          <dl>
            <div><dt>Location</dt><dd>ICU, Bay 3</dd></div>
            <div><dt>Condition</dt><dd>Good</dd></div>
            <div><dt>Next service</dt><dd>In 12 days</dd></div>
          </dl>
          <QRCodeSVG value={url} size={88} level="M" marginSize={0} bgColor="#ffffff" fgColor="#000000" className="tag-qr" />
        </div>
        <span className="badge UNDER_MAINTENANCE tag-warn"><i className="fas fa-shield-halved" /> Warranty ends soon</span>
      </div>
      <figcaption className="muted">Sample record. Labels like this print straight from the Equipment page.</figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-wrap lp-nav-in">
          <div className="brand" style={{ margin: 0 }}>
            <span className="brand-icon"><i className="fas fa-heartbeat" /></span><h1>Med<span>Care</span></h1>
          </div>
          <nav className="lp-links" aria-label="Page sections">
            <a href="#features">Features</a>
            <a href="#access">Getting access</a>
            <a href="#roles">Roles</a>
          </nav>
          <div className="lp-nav-actions">
            <ThemeToggle className="icon-btn theme-btn" />
            <Link className="btn-secondary" to="/login">Sign in</Link>
            <Link className="btn-primary lp-hide-sm" to="/register">Register</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="lp-hero">
          <div className="lp-wrap lp-hero-in">
            <div className="lp-hero-copy">
              <h2 className="lp-h1">Every device accounted for. Every service on schedule.</h2>
              <p className="lp-lead">
                MedCare is the equipment register for your hospital: where each device is, who has it,
                what condition it is in and when it is next due for service.
              </p>
              <div className="lp-cta">
                <Link className="btn-primary lp-btn" to="/login">Sign in</Link>
                <Link className="btn-secondary lp-btn" to="/register">Create an account</Link>
              </div>
              <p className="muted">An administrator approves every new account before it can be used.</p>
            </div>
            <AssetTag />
          </div>
        </section>

        <section id="features" className="lp-section">
          <div className="lp-wrap lp-split">
            <div className="lp-split-head">
              <h2>Made for the daily work of an equipment store</h2>
              <p className="muted lp-body">
                Stock, assignments, maintenance logs, purchase orders and reports are next on the build list.
                What is listed here works today.
              </p>
            </div>
            <ul className="lp-features">
              {FEATURES.map(([icon, title, text]) => (
                <li key={title}>
                  <span className="lp-ico"><i className={`fas ${icon}`} /></span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="access" className="lp-section lp-alt">
          <div className="lp-wrap">
            <h2>Getting access takes three steps</h2>
            <ol className="lp-steps">
              {STEPS.map(([title, text], i) => (
                <li key={title}>
                  <span className="lp-step-n">{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="roles" className="lp-section">
          <div className="lp-wrap lp-split">
            <div className="lp-split-head">
              <h2>Everyone sees what they need to do their job</h2>
              <p className="muted lp-body">You choose a role when you register. An administrator can review it before approving your account.</p>
            </div>
            <div className="panel table-wrap lp-roles">
              <table>
                <thead><tr><th>Role</th><th>What it can do</th></tr></thead>
                <tbody>
                  {ROLES.map(([role, can]) => (
                    <tr key={role}><td><b>{role}</b></td><td className="wrap">{can}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="lp-final">
          <div className="lp-wrap lp-final-in">
            <h2>See what is due this week</h2>
            <div className="lp-cta">
              <Link className="btn-primary lp-btn lp-on-blue" to="/login">Sign in</Link>
              <Link className="btn-secondary lp-btn" to="/register">Create an account</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-foot">
        <div className="lp-wrap lp-foot-in">
          <span><b>MedCare</b> Equipment Inventory</span>
          <span className="muted">&copy; {new Date().getFullYear()} MedCare</span>
        </div>
      </footer>
    </div>
  );
}