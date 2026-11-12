import React from "react";
import { Link } from "react-router-dom";

const services = [
  { icon: "🧪", title: "Laboratory Testing", description: "Routine and doctor-requested tests, with results reviewed in the context of your care.", examples: "Blood counts, glucose, lipid, liver, kidney and thyroid tests" },
  { icon: "🩺", title: "Preventive Checkups", description: "Health screening packages that bring common tests together for a planned assessment.", examples: "Basic, comprehensive and executive health checkups" },
  { icon: "📄", title: "Coordinated Results", description: "Your care team can use diagnostic results to plan follow-up and explain the next steps.", examples: "Bring previous reports and your current medicine list when you visit" },
];

export default function MaxLabDiagnosticsPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.container}>
          <span style={styles.eyebrow}>MEDI MAX LAB · DIAGNOSTICS</span>
          <h1 style={styles.heroHeading}>Diagnostic services to support your care</h1>
          <p>Access laboratory testing and preventive health checkups with guidance from your healthcare team. Your clinician can help choose the tests that fit your needs.</p>
          <div style={styles.actions}>
            <Link to="/healthallcheckups" style={styles.primary}>Explore Health Checkups</Link>
            <Link to="/finddoctors" style={styles.secondary}>Find a Doctor</Link>
          </div>
        </div>
      </section>
      <section style={styles.container}>
        <div style={styles.intro}>
          <span style={styles.sectionLabel}>OUR DIAGNOSTICS</span>
          <h2>Testing and screening, connected to your care</h2>
          <p>Testing depends on your symptoms, health history and clinician's advice. Please confirm availability, preparation instructions and appointment details with the hospital before your visit.</p>
        </div>
        <div style={styles.grid}>
          {services.map((service) => (
            <article key={service.title} style={styles.card}>
              <div style={styles.icon}>{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div style={styles.examples}>{service.examples}</div>
            </article>
          ))}
        </div>
        <aside style={styles.note}>
          <strong>Before a test</strong>
          <p>Follow the preparation instructions given for your specific test. Some tests may require fasting or a scheduled collection time; do not change medicines unless your clinician tells you to.</p>
        </aside>
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: "70vh", background: "#f5f9fb", color: "#203b4d", fontFamily: "Arial, Helvetica, sans-serif" },
  container: { width: "min(1120px, 92%)", margin: "0 auto" },
  hero: { padding: "76px 0", color: "#fff", background: "linear-gradient(120deg, #123b52, #087e8b)" },
  heroHeading: { maxWidth: 780, margin: "18px 0 12px", fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.08 },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: ".12em", color: "#a8e5df" },
  heroTitle: { fontSize: 52 },
  actions: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 },
  primary: { display: "inline-flex", padding: "13px 19px", borderRadius: 8, background: "#fff", color: "#075b69", fontWeight: 700, textDecoration: "none" },
  secondary: { display: "inline-flex", padding: "12px 19px", border: "1px solid #ffffff88", borderRadius: 8, color: "#fff", fontWeight: 700, textDecoration: "none" },
  intro: { padding: "46px 0 20px", maxWidth: 780 },
  sectionLabel: { color: "#087e8b", fontSize: 11, fontWeight: 800, letterSpacing: ".12em" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, paddingBottom: 28 },
  card: { padding: 24, border: "1px solid #e3ebef", borderRadius: 14, background: "#fff", boxShadow: "0 8px 24px #1832470a" },
  icon: { fontSize: 30 },
  examples: { marginTop: 14, paddingTop: 12, borderTop: "1px solid #edf1f3", color: "#087e8b", fontSize: 13, fontWeight: 700, lineHeight: 1.6 },
  note: { margin: "0 0 58px", padding: 22, borderLeft: "4px solid #0284c7", borderRadius: 10, background: "#eff8fc" },
};
