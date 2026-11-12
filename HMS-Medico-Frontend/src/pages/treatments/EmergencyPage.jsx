import React from "react";
import { useNavigate } from "react-router-dom";

export default function EmergencyPage() {
  const navigate = useNavigate();

  const emergencyServices = [
    {
      title: "Emergency Department",
      icon: "🚑",
      description:
        "Immediate medical evaluation and treatment for serious, sudden, or potentially life-threatening conditions.",
      features: [
        "24/7 emergency evaluation",
        "Rapid medical assessment",
        "Urgent treatment",
        "Continuous monitoring",
      ],
    },
    {
      title: "Trauma & Injury Care",
      icon: "🩹",
      description:
        "Comprehensive emergency care for accidents, falls, fractures, burns, wounds, and other traumatic injuries.",
      features: [
        "Accident injuries",
        "Fracture management",
        "Wound treatment",
        "Trauma assessment",
      ],
    },
    {
      title: "Cardiac Emergencies",
      icon: "❤️",
      description:
        "Rapid evaluation and emergency management of chest pain, heart attacks, abnormal heart rhythms, and other cardiac emergencies.",
      features: [
        "Chest pain evaluation",
        "Cardiac monitoring",
        "Emergency ECG",
        "Heart attack management",
      ],
    },
    {
      title: "Stroke Emergencies",
      icon: "🧠",
      description:
        "Time-sensitive evaluation and treatment for sudden neurological symptoms that may indicate a stroke.",
      features: [
        "Rapid neurological assessment",
        "Stroke evaluation",
        "Emergency imaging",
        "Specialist coordination",
      ],
    },
    {
      title: "Respiratory Emergencies",
      icon: "🫁",
      description:
        "Urgent care for severe breathing difficulties, asthma attacks, respiratory infections, and other breathing-related emergencies.",
      features: [
        "Breathing assessment",
        "Oxygen support",
        "Asthma emergencies",
        "Respiratory monitoring",
      ],
    },
    {
      title: "Pediatric Emergencies",
      icon: "👶",
      description:
        "Emergency assessment and treatment for infants, children, and adolescents with sudden or serious medical conditions.",
      features: [
        "Child emergency care",
        "Fever assessment",
        "Injury management",
        "Pediatric monitoring",
      ],
    },
  ];

  const warningSigns = [
    {
      icon: "❤️",
      title: "Severe Chest Pain",
      description:
        "Sudden or severe chest pressure, pain, or discomfort, especially when associated with sweating or breathing difficulty.",
    },
    {
      icon: "🧠",
      title: "Stroke Symptoms",
      description:
        "Sudden weakness, facial drooping, difficulty speaking, confusion, or loss of coordination.",
    },
    {
      icon: "🫁",
      title: "Severe Breathing Difficulty",
      description:
        "Serious difficulty breathing, severe shortness of breath, or bluish lips or skin.",
    },
    {
      icon: "🩸",
      title: "Severe Bleeding",
      description:
        "Heavy bleeding that does not stop with appropriate pressure or bleeding associated with serious injury.",
    },
    {
      icon: "⚡",
      title: "Seizures",
      description:
        "A first-time seizure, prolonged seizure, repeated seizures, or a seizure associated with serious injury requires urgent care.",
    },
    {
      icon: "🚨",
      title: "Loss of Consciousness",
      description:
        "Sudden unconsciousness, inability to wake a person, or significant changes in responsiveness.",
    },
  ];

  const emergencySteps = [
    {
      number: "01",
      title: "Emergency Recognition",
      description:
        "Identify serious or potentially life-threatening symptoms that require immediate medical attention.",
    },
    {
      number: "02",
      title: "Rapid Assessment",
      description:
        "Emergency professionals quickly assess breathing, circulation, consciousness, and other vital signs.",
    },
    {
      number: "03",
      title: "Immediate Treatment",
      description:
        "Urgent treatment and stabilization are provided according to the patient's condition.",
    },
    {
      number: "04",
      title: "Specialist Care",
      description:
        "Patients may be connected with appropriate specialists, procedures, surgery, or intensive care.",
    },
  ];

  const emergencyDepartments = [
    {
      title: "Emergency Medicine",
      icon: "🩺",
      description:
        "Rapid diagnosis, stabilization, and treatment of acute medical conditions.",
    },
    {
      title: "Trauma Care",
      icon: "🏥",
      description:
        "Specialized emergency treatment for serious accidents and physical injuries.",
    },
    {
      title: "Critical Care",
      icon: "💉",
      description:
        "Advanced monitoring and treatment for patients with severe or unstable conditions.",
    },
    {
      title: "Diagnostic Services",
      icon: "🔬",
      description:
        "Urgent laboratory, imaging, and diagnostic services to support emergency decisions.",
    },
  ];

  return (
    <div className="emergency-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .emergency-page {
          min-height: 100vh;
          background: #f6f9fc;
          color: #17324d;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }

        .emergency-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .emergency-hero {
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(
              135deg,
              #991b1b 0%,
              #dc2626 48%,
              #b91c1c 100%
            );
          color: white;
          padding: 78px 20px;
          text-align: center;
        }

        .emergency-hero::before {
          content: "";
          position: absolute;
          width: 360px;
          height: 360px;
          right: -150px;
          top: -170px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }

        .emergency-hero::after {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          left: -120px;
          bottom: -130px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }

        .emergency-hero-content {
          position: relative;
          z-index: 1;
        }

        .emergency-hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 15px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 30px;
          background: rgba(255,255,255,0.1);
          color: #fee2e2;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .emergency-hero h1 {
          margin: 18px 0 15px;
          font-size: clamp(37px, 5vw, 54px);
          font-weight: 800;
          line-height: 1.1;
        }

        .emergency-hero p {
          max-width: 800px;
          margin: 0 auto;
          color: #fee2e2;
          font-size: 16px;
          line-height: 1.8;
        }

        .emergency-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .emergency-hero-button {
          min-height: 46px;
          padding: 0 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .emergency-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #b91c1c;
        }

        .emergency-hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.18);
        }

        .emergency-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.6);
          background: transparent;
          color: white;
        }

        .emergency-hero-button.secondary:hover {
          background: rgba(255,255,255,0.1);
        }

        /* =========================================
           MAIN CONTAINER
        ========================================= */

        .emergency-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 55px 0 80px;
        }

        .emergency-section-heading {
          text-align: center;
          margin-bottom: 40px;
        }

        .emergency-section-heading h2 {
          margin: 0 0 12px;
          color: #173550;
          font-size: 30px;
          font-weight: 800;
        }

        .emergency-section-heading p {
          max-width: 780px;
          margin: 0 auto;
          color: #738392;
          font-size: 15px;
          line-height: 1.8;
        }

        /* =========================================
           IMPORTANT NOTICE
        ========================================= */

        .emergency-notice {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 45px;
          padding: 23px 27px;
          border: 1px solid #fecaca;
          border-radius: 14px;
          background: #fff5f5;
        }

        .emergency-notice-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #fee2e2;
          font-size: 25px;
        }

        .emergency-notice h3 {
          margin: 0 0 5px;
          color: #991b1b;
          font-size: 17px;
        }

        .emergency-notice p {
          margin: 0;
          color: #9f5b5b;
          font-size: 13px;
          line-height: 1.6;
        }

        /* =========================================
           OVERVIEW
        ========================================= */

        .emergency-overview {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 25px;
          margin-bottom: 55px;
        }

        .emergency-overview-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .emergency-overview-card h2 {
          margin: 0 0 15px;
          color: #173550;
          font-size: 27px;
        }

        .emergency-overview-card p {
          margin: 0 0 13px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.8;
        }

        .emergency-overview-card p:last-child {
          margin-bottom: 0;
        }

        .emergency-overview-side {
          background:
            linear-gradient(
              145deg,
              #fff5f5,
              #ffffff
            );
        }

        .emergency-overview-side h3 {
          margin: 0 0 18px;
          color: #173550;
          font-size: 20px;
        }

        .emergency-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .emergency-highlight:last-child {
          margin-bottom: 0;
        }

        .emergency-highlight-icon {
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #fee2e2;
          font-size: 16px;
        }

        .emergency-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #29465e;
          font-size: 13px;
        }

        .emergency-highlight span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================================
           SERVICES
        ========================================= */

        .emergency-services {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .emergency-service {
          position: relative;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          padding: 26px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .emergency-service::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
          background: #dc2626;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.25s ease;
        }

        .emergency-service:hover {
          transform: translateY(-4px);
          border-color: #f5c4c4;
          box-shadow: 0 15px 35px rgba(30,60,80,0.09);
        }

        .emergency-service:hover::before {
          transform: scaleY(1);
        }

        .emergency-service-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 17px;
        }

        .emergency-service-icon {
          width: 62px;
          height: 62px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #fff0f0;
          font-size: 29px;
        }

        .emergency-service h3 {
          margin: 0;
          color: #18364f;
          font-size: 20px;
          line-height: 1.25;
        }

        .emergency-service p {
          margin: 0 0 18px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .emergency-feature-title {
          margin-bottom: 11px;
          color: #334d62;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .emergency-feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .emergency-feature-list li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5d7282;
          font-size: 12px;
        }

        .emergency-check {
          width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #fee2e2;
          color: #dc2626;
          font-size: 9px;
          font-weight: 800;
        }

        /* =========================================
           WARNING SIGNS
        ========================================= */

        .emergency-warning-section {
          margin-top: 60px;
        }

        .emergency-warning-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .emergency-warning-card {
          padding: 25px;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.04);
          transition: 0.25s ease;
        }

        .emergency-warning-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 13px 30px rgba(30,60,80,0.08);
        }

        .emergency-warning-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 17px;
          border-radius: 12px;
          background: #fff0f0;
          font-size: 23px;
        }

        .emergency-warning-card h3 {
          margin: 0 0 9px;
          color: #27445a;
          font-size: 16px;
        }

        .emergency-warning-card p {
          margin: 0;
          color: #788894;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           CARE PROCESS
        ========================================= */

        .emergency-process-section {
          margin-top: 60px;
        }

        .emergency-process-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .emergency-process-step {
          padding: 28px 22px;
          text-align: center;
          border-right: 1px solid #edf1f3;
        }

        .emergency-process-step:last-child {
          border-right: none;
        }

        .emergency-step-number {
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 13px;
          border-radius: 50%;
          background: #fee2e2;
          color: #dc2626;
          font-size: 13px;
          font-weight: 800;
        }

        .emergency-process-step h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 15px;
        }

        .emergency-process-step p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           DEPARTMENTS
        ========================================= */

        .emergency-departments-section {
          margin-top: 60px;
        }

        .emergency-departments {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .emergency-department {
          padding: 26px 22px;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
          text-align: center;
        }

        .emergency-department-icon {
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          border-radius: 13px;
          background: #fff0f0;
          font-size: 25px;
        }

        .emergency-department h3 {
          margin: 0 0 9px;
          color: #27445a;
          font-size: 15px;
        }

        .emergency-department p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.65;
        }

        /* =========================================
           FIRST AID
        ========================================= */

        .emergency-firstaid-section {
          margin-top: 60px;
        }

        .emergency-firstaid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .emergency-firstaid-card {
          padding: 28px;
          border-radius: 14px;
          border: 1px solid #e2e9ee;
          background: white;
        }

        .emergency-firstaid-card.do {
          border-top: 4px solid #16a34a;
        }

        .emergency-firstaid-card.avoid {
          border-top: 4px solid #dc2626;
        }

        .emergency-firstaid-card h3 {
          margin: 0 0 17px;
          color: #27445a;
          font-size: 19px;
        }

        .emergency-firstaid-list {
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .emergency-firstaid-list li {
          display: flex;
          gap: 10px;
          margin-bottom: 13px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.6;
        }

        .emergency-firstaid-list li:last-child {
          margin-bottom: 0;
        }

        .firstaid-good {
          color: #16a34a;
          font-weight: 800;
        }

        .firstaid-bad {
          color: #dc2626;
          font-weight: 800;
        }

        /* =========================================
           CTA
        ========================================= */

        .emergency-cta {
          margin-top: 55px;
          padding: 37px;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #7f1d1d,
              #991b1b
            );
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .emergency-cta h2 {
          margin: 0 0 9px;
          font-size: 26px;
        }

        .emergency-cta p {
          max-width: 700px;
          margin: 0;
          color: #fecaca;
          font-size: 14px;
          line-height: 1.7;
        }

        .emergency-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .emergency-cta-button {
          min-height: 44px;
          padding: 0 19px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .emergency-cta-button.primary {
          border: 1px solid white;
          background: white;
          color: #991b1b;
        }

        .emergency-cta-button.primary:hover {
          background: #fff5f5;
        }

        .emergency-cta-button.secondary {
          border: 1px solid #c77b7b;
          background: transparent;
          color: white;
        }

        .emergency-cta-button.secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        /* =========================================
           FINAL WARNING
        ========================================= */

        .emergency-final-warning {
          margin-top: 22px;
          padding: 23px 27px;
          border-radius: 14px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          text-align: center;
        }

        .emergency-final-warning strong {
          display: block;
          margin-bottom: 6px;
          font-size: 15px;
        }

        .emergency-final-warning p {
          margin: 0;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 950px) {
          .emergency-overview {
            grid-template-columns: 1fr;
          }

          .emergency-services {
            grid-template-columns: 1fr;
          }

          .emergency-warning-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .emergency-process-box {
            grid-template-columns: repeat(2, 1fr);
          }

          .emergency-process-step:nth-child(2) {
            border-right: none;
          }

          .emergency-process-step:nth-child(-n + 2) {
            border-bottom: 1px solid #edf1f3;
          }

          .emergency-departments {
            grid-template-columns: repeat(2, 1fr);
          }

          .emergency-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 650px) {
          .emergency-hero {
            padding: 58px 18px;
          }

          .emergency-hero h1 {
            font-size: 36px;
          }

          .emergency-hero p {
            font-size: 14px;
          }

          .emergency-hero-actions {
            flex-direction: column;
          }

          .emergency-hero-button {
            width: 100%;
          }

          .emergency-container {
            width: 92%;
            padding: 40px 0 60px;
          }

          .emergency-section-heading h2 {
            font-size: 26px;
          }

          .emergency-notice {
            align-items: flex-start;
            padding: 20px;
          }

          .emergency-overview-card {
            padding: 23px;
          }

          .emergency-service {
            padding: 22px;
          }

          .emergency-warning-grid {
            grid-template-columns: 1fr;
          }

          .emergency-process-box {
            grid-template-columns: 1fr;
          }

          .emergency-process-step {
            border-right: none !important;
            border-bottom: 1px solid #edf1f3;
          }

          .emergency-process-step:last-child {
            border-bottom: none;
          }

          .emergency-departments {
            grid-template-columns: 1fr;
          }

          .emergency-firstaid {
            grid-template-columns: 1fr;
          }

          .emergency-cta {
            padding: 28px 22px;
          }

          .emergency-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .emergency-cta-button {
            width: 100%;
          }

          .emergency-final-warning {
            padding: 20px;
          }
        }
      `}</style>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="emergency-hero">
        <div className="emergency-hero-content">
          <span className="emergency-hero-badge">
            24/7 Emergency Medical Care
          </span>

          <h1>Emergency Care</h1>

          <p>
            Fast, coordinated medical attention for serious injuries,
            sudden illnesses, and potentially life-threatening
            conditions. Our emergency care team is prepared to assess,
            stabilize, and coordinate appropriate treatment.
          </p>

          <div className="emergency-hero-actions">
            <button
              className="emergency-hero-button primary"
              onClick={() => navigate("/contact")}
            >
              Contact Emergency Care
            </button>

            <button
              className="emergency-hero-button secondary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Doctor
            </button>
          </div>
        </div>
      </section>

      <main className="emergency-container">

        {/* IMPORTANT NOTICE */}

        <section className="emergency-notice">
          <div className="emergency-notice-icon">
            🚨
          </div>

          <div>
            <h3>Medical Emergency?</h3>

            <p>
              If someone has severe symptoms, is unconscious, is having
              serious difficulty breathing, has severe chest pain, or
              has another potentially life-threatening condition,
              seek emergency medical help immediately.
            </p>
          </div>
        </section>

        {/* OVERVIEW */}

        <section className="emergency-overview">
          <div className="emergency-overview-card">
            <h2>Comprehensive Emergency Care</h2>

            <p>
              Emergency medicine provides rapid evaluation and
              treatment for people who become suddenly ill or injured.
              Emergency conditions can range from serious injuries and
              infections to heart, brain, breathing, and other
              potentially life-threatening problems.
            </p>

            <p>
              At MediCo, emergency care focuses on quickly identifying
              the most urgent problems, stabilizing the patient, and
              coordinating further treatment when specialist or
              hospital care is required.
            </p>

            <p>
              Depending on the patient's condition, care may include
              emergency assessment, monitoring, laboratory testing,
              imaging, medications, procedures, specialist
              consultation, surgery, or critical care.
            </p>
          </div>

          <div className="emergency-overview-card emergency-overview-side">
            <h3>What Emergency Care Provides</h3>

            <div className="emergency-highlight">
              <div className="emergency-highlight-icon">
                🚑
              </div>

              <div>
                <strong>Rapid Response</strong>

                <span>
                  Prompt evaluation of serious or urgent medical
                  conditions.
                </span>
              </div>
            </div>

            <div className="emergency-highlight">
              <div className="emergency-highlight-icon">
                ❤️
              </div>

              <div>
                <strong>Patient Stabilization</strong>

                <span>
                  Immediate support focused on vital functions and
                  patient safety.
                </span>
              </div>
            </div>

            <div className="emergency-highlight">
              <div className="emergency-highlight-icon">
                🔬
              </div>

              <div>
                <strong>Urgent Diagnostics</strong>

                <span>
                  Appropriate testing and imaging to identify serious
                  medical problems.
                </span>
              </div>
            </div>

            <div className="emergency-highlight">
              <div className="emergency-highlight-icon">
                🩺
              </div>

              <div>
                <strong>Specialist Coordination</strong>

                <span>
                  Connection with relevant specialists when advanced
                  treatment is required.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}

        <section>
          <div className="emergency-section-heading">
            <h2>Emergency Services</h2>

            <p>
              Emergency medical services cover a broad range of
              urgent conditions, injuries, and life-threatening
              situations.
            </p>
          </div>

          <div className="emergency-services">
            {emergencyServices.map((service) => (
              <article
                className="emergency-service"
                key={service.title}
              >
                <div className="emergency-service-top">
                  <div className="emergency-service-icon">
                    {service.icon}
                  </div>

                  <h3>{service.title}</h3>
                </div>

                <p>{service.description}</p>

                <div className="emergency-feature-title">
                  Care Includes
                </div>

                <ul className="emergency-feature-list">
                  {service.features.map((feature) => (
                    <li key={feature}>
                      <span className="emergency-check">
                        ✓
                      </span>

                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* WARNING SIGNS */}

        <section className="emergency-warning-section">
          <div className="emergency-section-heading">
            <h2>When to Seek Emergency Care</h2>

            <p>
              Certain symptoms may indicate a serious medical
              emergency and should not be ignored.
            </p>
          </div>

          <div className="emergency-warning-grid">
            {warningSigns.map((warning) => (
              <article
                className="emergency-warning-card"
                key={warning.title}
              >
                <div className="emergency-warning-icon">
                  {warning.icon}
                </div>

                <h3>{warning.title}</h3>

                <p>{warning.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* EMERGENCY PROCESS */}

        <section className="emergency-process-section">
          <div className="emergency-section-heading">
            <h2>Emergency Care Process</h2>

            <p>
              Emergency teams use a structured approach to identify
              urgent problems and provide appropriate treatment as
              quickly as possible.
            </p>
          </div>

          <div className="emergency-process-box">
            {emergencySteps.map((step) => (
              <div
                className="emergency-process-step"
                key={step.number}
              >
                <div className="emergency-step-number">
                  {step.number}
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DEPARTMENTS */}

        <section className="emergency-departments-section">
          <div className="emergency-section-heading">
            <h2>Emergency Care Areas</h2>

            <p>
              Emergency treatment may involve several clinical
              departments and diagnostic services depending on the
              patient's condition.
            </p>
          </div>

          <div className="emergency-departments">
            {emergencyDepartments.map((department) => (
              <article
                className="emergency-department"
                key={department.title}
              >
                <div className="emergency-department-icon">
                  {department.icon}
                </div>

                <h3>{department.title}</h3>

                <p>{department.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FIRST AID */}

        <section className="emergency-firstaid-section">
          <div className="emergency-section-heading">
            <h2>Basic Emergency First Aid Guidance</h2>

            <p>
              Basic first aid can provide temporary support while
              professional emergency medical help is being arranged.
            </p>
          </div>

          <div className="emergency-firstaid">
            <div className="emergency-firstaid-card do">
              <h3>What You Can Do</h3>

              <ul className="emergency-firstaid-list">
                <li>
                  <span className="firstaid-good">✓</span>

                  Stay calm and assess whether the area is safe.
                </li>

                <li>
                  <span className="firstaid-good">✓</span>

                  Contact appropriate emergency medical services for
                  serious or life-threatening conditions.
                </li>

                <li>
                  <span className="firstaid-good">✓</span>

                  If there is severe bleeding, apply firm pressure
                  with a clean cloth or dressing when appropriate.
                </li>

                <li>
                  <span className="firstaid-good">✓</span>

                  Keep the injured or ill person as comfortable and
                  still as possible unless movement is necessary for
                  safety.
                </li>

                <li>
                  <span className="firstaid-good">✓</span>

                  Follow instructions provided by emergency medical
                  professionals.
                </li>
              </ul>
            </div>

            <div className="emergency-firstaid-card avoid">
              <h3>What to Avoid</h3>

              <ul className="emergency-firstaid-list">
                <li>
                  <span className="firstaid-bad">✕</span>

                  Do not delay emergency care when serious symptoms
                  are present.
                </li>

                <li>
                  <span className="firstaid-bad">✕</span>

                  Do not give food, drink, or medication to an
                  unconscious person.
                </li>

                <li>
                  <span className="firstaid-bad">✕</span>

                  Do not move someone with a suspected serious neck
                  or spinal injury unless necessary for safety.
                </li>

                <li>
                  <span className="firstaid-bad">✕</span>

                  Do not attempt procedures you are not trained to
                  perform.
                </li>

                <li>
                  <span className="firstaid-bad">✕</span>

                  Do not rely on online information instead of
                  professional emergency assessment.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="emergency-cta">
          <div>
            <h2>Need Urgent Medical Attention?</h2>

            <p>
              If you are concerned about a serious or sudden medical
              condition, seek professional emergency medical
              assistance immediately.
            </p>
          </div>

          <div className="emergency-cta-actions">
            <button
              className="emergency-cta-button primary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>

            <button
              className="emergency-cta-button secondary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Doctor
            </button>
          </div>
        </section>

        {/* FINAL WARNING */}

        <section className="emergency-final-warning">
          <strong>
            Emergency symptoms require immediate medical attention.
          </strong>

          <p>
            This page provides general health information and is not
            a substitute for professional medical assessment. For a
            life-threatening emergency, contact your local emergency
            medical service or go to the nearest emergency department.
          </p>
        </section>

      </main>
    </div>
  );
}
