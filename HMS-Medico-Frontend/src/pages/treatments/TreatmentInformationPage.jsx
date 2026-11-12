import React from "react";
import { Link } from "react-router-dom";

const styles = `
  .treatment-info { color:#243c4d; background:#fff; font-family:inherit; }
  .treatment-info * { box-sizing:border-box; }
  .ti-hero { padding:74px 24px; color:#fff; background:linear-gradient(120deg,#123b52,#087e8b); }
  .ti-hero-inner,.ti-container { width:min(1160px,92%); margin:0 auto; }
  .ti-badge { display:inline-block; padding:8px 13px; border:1px solid #ffffff55; border-radius:30px; font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
  .ti-hero h1 { max-width:850px; margin:20px 0 12px; font-size:clamp(36px,5vw,58px); line-height:1.08; }
  .ti-hero p { max-width:800px; margin:0; color:#e0f2f1; font-size:17px; line-height:1.75; }
  .ti-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:26px; }
  .ti-button { display:inline-flex; align-items:center; justify-content:center; min-height:46px; padding:0 20px; border-radius:8px; background:#fff; color:#075b69; font-weight:700; text-decoration:none; }
  .ti-button.secondary { border:1px solid #ffffff88; background:transparent; color:#fff; }
  .ti-container { padding:42px 0 68px; }
  .ti-overview { display:grid; grid-template-columns:1.6fr 1fr; gap:20px; }
  .ti-panel,.ti-card { padding:25px; border:1px solid #e7edf0; border-radius:14px; background:#fff; box-shadow:0 8px 24px #1832470a; }
  .ti-panel h2,.ti-section h2 { margin:0 0 12px; color:#173a50; font-size:27px; }
  .ti-panel p,.ti-section-intro,.ti-card p { color:#617381; font-size:14px; line-height:1.75; }
  .ti-highlight { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #edf1f3; }
  .ti-highlight:last-child { border-bottom:0; }
  .ti-highlight-mark { display:grid; width:34px; height:34px; flex:none; place-items:center; border-radius:10px; background:#e5f5f4; color:#087e8b; font-weight:800; }
  .ti-highlight strong,.ti-highlight span { display:block; }
  .ti-highlight strong { margin-bottom:4px; color:#26465a; font-size:14px; }
  .ti-highlight span { color:#71818d; font-size:12px; line-height:1.6; }
  .ti-section { padding:46px 0 0; }
  .ti-eyebrow { display:block; margin-bottom:8px; color:#07808b; font-size:11px; font-weight:800; letter-spacing:.12em; }
  .ti-section-intro { max-width:820px; margin:0 0 20px; }
  .ti-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; }
  .ti-card { padding:21px; }
  .ti-card h3 { margin:10px 0 6px; color:#29475a; font-size:17px; }
  .ti-card p { margin:0; font-size:13px; }
  .ti-number { color:#07808b; font-size:12px; font-weight:800; }
  .ti-list { margin:12px 0 0; padding:0; list-style:none; }
  .ti-list li { display:flex; gap:9px; padding:7px 0; color:#536978; font-size:13px; line-height:1.5; }
  .ti-list li::before { content:'✓'; color:#07808b; font-weight:800; }
  .ti-soft { padding:30px; border:1px solid #dceeed; border-radius:16px; background:#f2f9f9; }
  .ti-soft .ti-card { background:#fff; }
  .ti-note { margin-top:38px; padding:23px 26px; border:1px solid #dbeafe; border-left:4px solid #0284c7; border-radius:12px; background:#f0f9ff; }
  .ti-note h3 { margin:0 0 7px; color:#075985; font-size:17px; }
  .ti-note p { margin:0; color:#587386; font-size:13px; line-height:1.75; }
  .ti-cta { display:flex; align-items:center; justify-content:space-between; gap:24px; margin-top:25px; padding:30px; border-radius:16px; background:linear-gradient(135deg,#123b52,#087e8b); color:white; }
  .ti-cta h2 { margin:0 0 7px; font-size:24px; }
  .ti-cta p { max-width:700px; margin:0; color:#d5eeed; font-size:13px; line-height:1.7; }
  .ti-emergency { margin-top:18px; padding:20px 24px; border:1px solid #fee2e2; border-radius:13px; background:#fff5f5; }
  .ti-emergency h3 { margin:0 0 6px; color:#991b1b; font-size:16px; }
  .ti-emergency p { margin:0; color:#865f5f; font-size:13px; line-height:1.65; }
  .ti-back { display:inline-block; margin-bottom:20px; color:#087e8b; font-size:13px; font-weight:700; text-decoration:none; }
  @media(max-width:850px){.ti-overview{grid-template-columns:1fr}.ti-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ti-cta{align-items:flex-start;flex-direction:column}}
  @media(max-width:580px){.ti-hero{padding:55px 0}.ti-grid{grid-template-columns:1fr}.ti-container{padding-top:30px}.ti-soft{padding:18px}.ti-panel{padding:21px}.ti-cta{padding:24px}}
`;

function CardGrid({ items, checklist = false }) {
  return <div className="ti-grid">{items.map((item, index) => <article className="ti-card" key={item.title}>
    <span className="ti-number">{String(index + 1).padStart(2, "0")}</span>
    <h3>{item.title}</h3><p>{item.description}</p>
    {checklist && item.features && <ul className="ti-list">{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>}
  </article>)}</div>;
}

export default function TreatmentInformationPage({ data }) {
  return <div className="treatment-info"><style>{styles}</style>
    <section className="ti-hero"><div className="ti-hero-inner">
      <span className="ti-badge">{data.specialty}</span><h1>{data.title}</h1><p>{data.hero}</p>
      <div className="ti-actions"><Link className="ti-button" to="/finddoctors">Find a Specialist</Link><Link className="ti-button secondary" to="/hospitaltreatments">Explore Treatments</Link></div>
    </div></section>
    <main className="ti-container"><Link className="ti-back" to="/hospitaltreatments">← All treatments</Link>
      <section className="ti-overview"><article className="ti-panel"><span className="ti-eyebrow">OVERVIEW</span><h2>{data.overviewTitle}</h2>
        {data.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article><aside className="ti-panel"><h2>{data.highlightsTitle}</h2>{data.highlights.map((item, index) => <div className="ti-highlight" key={item.title}><span className="ti-highlight-mark">{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><span>{item.description}</span></div></div>)}</aside></section>
      <section className="ti-section"><span className="ti-eyebrow">UNDERSTANDING THE CONDITION</span><h2>{data.developmentTitle}</h2><p className="ti-section-intro">{data.developmentIntro}</p><CardGrid items={data.development} /></section>
      <section className="ti-section"><span className="ti-eyebrow">TYPES AND AREAS OF CARE</span><h2>{data.typesTitle}</h2><p className="ti-section-intro">{data.typesIntro}</p><CardGrid items={data.types} checklist /></section>
      <section className="ti-section ti-soft"><span className="ti-eyebrow">RISK AND CONTRIBUTING FACTORS</span><h2>{data.factorsTitle}</h2><p className="ti-section-intro">{data.factorsIntro}</p><CardGrid items={data.factors} /></section>
      <section className="ti-section"><span className="ti-eyebrow">WHEN TO SEEK AN ASSESSMENT</span><h2>{data.symptomsTitle}</h2><p className="ti-section-intro">{data.symptomsIntro}</p><CardGrid items={data.symptoms} /></section>
      <section className="ti-section"><span className="ti-eyebrow">DIAGNOSIS</span><h2>{data.diagnosisTitle}</h2><p className="ti-section-intro">{data.diagnosisIntro}</p><CardGrid items={data.diagnosis} /></section>
      <section className="ti-section"><span className="ti-eyebrow">TREATMENT</span><h2>{data.treatmentsTitle}</h2><p className="ti-section-intro">{data.treatmentsIntro}</p><CardGrid items={data.treatments} /></section>
      <section className="ti-section"><span className="ti-eyebrow">PATIENT JOURNEY</span><h2>{data.journeyTitle}</h2><p className="ti-section-intro">{data.journeyIntro}</p><CardGrid items={data.journey} /></section>
      <section className="ti-note"><h3>Important information</h3><p>{data.important}</p></section>
      <section className="ti-cta"><div><h2>{data.ctaTitle}</h2><p>{data.ctaDescription}</p></div><Link className="ti-button" to="/finddoctors">Find a Specialist</Link></section>
      <section className="ti-emergency"><h3>Medical emergency?</h3><p>{data.emergency}</p></section>
    </main>
  </div>;
}
