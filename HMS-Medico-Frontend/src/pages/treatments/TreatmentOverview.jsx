import React from "react";
import { Link } from "react-router-dom";

export default function TreatmentOverview({ title, subtitle, description, services, approach }) {
  return (
    <main style={{ color: "#183247", background: "#f6fafb", minHeight: "70vh", padding: "64px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <Link to="/hospitaltreatments" style={{ color: "#087e8b", fontWeight: 600, textDecoration: "none" }}>
          ← All treatments
        </Link>
        <section style={{ marginTop: 28, padding: "48px", borderRadius: 24, background: "linear-gradient(135deg, #e3f5f4, #f1f6fb)" }}>
          <p style={{ color: "#087e8b", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>MediCo specialist care</p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", margin: "12px 0" }}>{title}</h1>
          <h2 style={{ marginTop: 0 }}>{subtitle}</h2>
          <p style={{ maxWidth: 760, fontSize: 18, lineHeight: 1.7 }}>{description}</p>
        </section>
        <section style={{ padding: "42px 0" }}>
          <h2>Care and services</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginTop: 24 }}>
            {services.map((service, index) => (
              <article key={service.title} style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 8px 28px rgba(24,50,71,.08)" }}>
                <span style={{ color: "#087e8b", fontWeight: 700 }}>0{index + 1}</span>
                <h3>{service.title}</h3>
                <p style={{ lineHeight: 1.6 }}>{service.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section style={{ background: "white", padding: 28, borderRadius: 16, marginBottom: 28 }}>
          <h2>Your care journey</h2>
          <p style={{ lineHeight: 1.7 }}>{approach}</p>
          <p style={{ lineHeight: 1.7 }}>Your specialist will explain the options relevant to your diagnosis and help coordinate next steps around your individual needs.</p>
        </section>
        <Link to="/finddoctors" style={{ display: "inline-block", background: "#087e8b", color: "white", borderRadius: 10, padding: "14px 22px", textDecoration: "none", fontWeight: 700 }}>Find a doctor</Link>
      </div>
    </main>
  );
}
