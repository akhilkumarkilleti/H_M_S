import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";

const treatmentDetails = {
  "blood-cancer": ["Blood Cancer", "Care for blood cancers", "A specialist team coordinates evaluation and care planning for blood cancers, including leukemia, lymphoma, and myeloma.", "Blood and marrow assessment", "Specialist-led care planning", "Ongoing review and support"],
  "breast-cancer": ["Breast Cancer", "Breast cancer care", "A coordinated service for breast cancer assessment, treatment discussions, and follow-up support.", "Breast clinic assessment", "Individual care planning", "Recovery and follow-up support"],
  "lung-cancer": ["Lung Cancer", "Lung cancer care", "A multidisciplinary service supporting people through lung cancer evaluation and discussions about appropriate care options.", "Respiratory and oncology review", "Diagnostic coordination", "Care and follow-up planning"],
  "liver-cancer": ["Liver Cancer", "Liver cancer care", "Specialist evaluation and coordinated planning for people with liver cancer, taking overall liver health into account.", "Liver and imaging review", "Multidisciplinary planning", "Continued monitoring and support"],
  "brain-cancer": ["Brain Cancer", "Brain cancer care", "A coordinated service for brain tumour assessment, specialist consultation, and care planning with patients and families.", "Neurology and imaging review", "Neurosurgery and oncology consultation", "Recovery and follow-up planning"],
  cardiology: ["Cardiology", "Cardiology services", "Evaluation and ongoing care planning for heart and circulation concerns, guided by the patient's needs.", "Cardiology consultation", "Diagnostic coordination", "Ongoing heart health review"],
  "heart-surgery": ["Heart Surgery", "Heart surgery services", "Specialist consultation and preparation for patients who may need a heart or chest procedure.", "Surgical specialist review", "Pre-procedure planning", "Recovery and follow-up support"],
  "vascular-sciences": ["Vascular Sciences", "Vascular care", "Assessment and coordinated care planning for conditions affecting blood vessels and circulation.", "Vascular specialist consultation", "Diagnostic review", "Care and monitoring plan"],
  neurosurgery: ["Neurosurgery", "Neurosurgery services", "Specialist assessment for conditions that may require surgery involving the brain, spine, or nervous system.", "Neurosurgical consultation", "Imaging and case review", "Procedure and recovery planning"],
  "brain-spine": ["Brain & Spine", "Brain and spine care", "Coordinated specialist care for brain and spine conditions, from evaluation through recovery planning.", "Neurology and spine assessment", "Diagnostic coordination", "Rehabilitation and follow-up planning"],
  "knee-replacement": ["Knee Replacement", "Knee replacement care", "Orthopedic evaluation and planning for people considering knee replacement due to pain or reduced mobility.", "Joint and mobility assessment", "Surgical consultation", "Rehabilitation planning"],
  "hip-replacement": ["Hip Replacement", "Hip replacement care", "Orthopedic consultation and recovery planning for people considering hip replacement.", "Hip and mobility assessment", "Surgical consultation", "Rehabilitation planning"],
  "shoulder-surgery": ["Shoulder Surgery", "Shoulder surgery services", "Assessment and treatment planning for shoulder conditions that may need a surgical opinion.", "Shoulder specialist review", "Imaging and procedure discussion", "Recovery planning"],
  "spine-care": ["Spine Care", "Spine care services", "Assessment and coordinated care planning for back, neck, and spine concerns.", "Spine specialist consultation", "Diagnostic review", "Rehabilitation and follow-up planning"],
  "sports-injury": ["Sports Injury", "Sports injury care", "Orthopedic assessment and recovery planning for injuries affecting movement, joints, and soft tissues.", "Injury and movement assessment", "Personalized recovery planning", "Return-to-activity guidance"],
  "kidney-transplant": ["Kidney Transplant", "Kidney transplant services", "Transplant specialists coordinate assessment and planning for people exploring kidney transplantation.", "Transplant suitability assessment", "Donor and recipient coordination", "Long-term follow-up planning"],
  "liver-transplant": ["Liver Transplant", "Liver transplant services", "A specialist team coordinates transplant evaluation, preparation, and follow-up for appropriate patients.", "Liver and transplant assessment", "Multidisciplinary planning", "Post-transplant follow-up planning"],
  "living-donor-transplant": ["Living Donor Transplant", "Living donor transplant services", "Guidance and coordinated evaluation for transplant recipients and potential living donors.", "Recipient and donor assessment", "Evaluation coordination", "Care and follow-up planning"],
  "transplant-follow-up": ["Transplant Follow-up", "Transplant follow-up care", "Continuing specialist review and support after transplantation, coordinated around each patient's care plan.", "Scheduled specialist reviews", "Health and medication monitoring", "Ongoing support and coordination"],
};

export default function TreatmentDetailPage() {
  const { treatment } = useParams();
  const detail = treatmentDetails[treatment];

  if (!detail) return <Navigate to="/hospitaltreatments" replace />;

  const [title, heading, description, focusOne, focusTwo, focusThree] = detail;
  const focusAreas = [focusOne, focusTwo, focusThree];

  return (
    <main className="treatment-detail-page" style={{ color: "var(--td-text, #183247)", background: "var(--td-bg, #f6fafb)", minHeight: "70vh", padding: "64px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <Link to="/hospitaltreatments" style={{ color: "var(--td-accent, #087e8b)", fontWeight: 600, textDecoration: "none" }}>
          ← All treatments
        </Link>
        <section style={{ marginTop: 28, padding: "48px", borderRadius: 24, background: "var(--td-hero, linear-gradient(135deg, #e3f5f4, #f1f6fb))" }}>
          <p style={{ color: "var(--td-accent, #087e8b)", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>MediCo specialist care</p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", margin: "12px 0" }}>{heading}</h1>
          <p style={{ maxWidth: 760, fontSize: 18, lineHeight: 1.7 }}>{description}</p>
        </section>
        <section style={{ padding: "42px 0" }}>
          <h2>How we support {title.toLowerCase()} care</h2>
          <p style={{ maxWidth: 780, lineHeight: 1.7 }}>Your care team will discuss your needs, explain relevant options, and coordinate next steps with you. The right plan depends on an individual clinical assessment.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginTop: 24 }}>
            {focusAreas.map((focus, index) => (
              <article key={focus} style={{ background: "var(--td-surface, #ffffff)", borderRadius: 16, padding: 24, boxShadow: "var(--td-shadow, 0 8px 28px rgba(24,50,71,.08))" }}>
                <span style={{ color: "var(--td-accent, #087e8b)", fontWeight: 700 }}>0{index + 1}</span>
                <h3>{focus}</h3>
                <p style={{ lineHeight: 1.6 }}>Discuss this part of your care with the relevant specialist team and get guidance tailored to your needs.</p>
              </article>
            ))}
          </div>
        </section>
        <Link to="/finddoctors" style={{ display: "inline-block", background: "#087e8b", color: "white", borderRadius: 10, padding: "14px 22px", textDecoration: "none", fontWeight: 700 }}>Find a doctor</Link>
      </div>
    </main>
  );
}
