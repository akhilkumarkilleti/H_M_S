import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeartCardioPage() {
  const navigate = useNavigate();

  const heartConditions = [
    {
      title: "Coronary Artery Disease",
      icon: "❤️",
      description:
        "A condition in which the blood vessels supplying the heart become narrowed or blocked, reducing blood flow to the heart muscle.",
      features: [
        "Chest pain evaluation",
        "Risk assessment",
        "ECG and cardiac testing",
        "Medication management",
      ],
    },
    {
      title: "Heart Attack",
      icon: "🚨",
      description:
        "A medical emergency that occurs when blood flow to part of the heart muscle is significantly reduced or blocked.",
      features: [
        "Emergency assessment",
        "Cardiac monitoring",
        "Urgent treatment",
        "Recovery planning",
      ],
    },
    {
      title: "Heart Failure",
      icon: "💓",
      description:
        "A condition where the heart cannot pump blood as effectively as the body requires, often causing fatigue and shortness of breath.",
      features: [
        "Heart function assessment",
        "Medication management",
        "Lifestyle guidance",
        "Long-term monitoring",
      ],
    },
    {
      title: "Arrhythmia",
      icon: "⚡",
      description:
        "Abnormal heart rhythms that may cause the heart to beat too quickly, too slowly, or irregularly.",
      features: [
        "ECG evaluation",
        "Rhythm monitoring",
        "Medication management",
        "Specialist consultation",
      ],
    },
    {
      title: "Valvular Heart Disease",
      icon: "🫀",
      description:
        "Conditions affecting one or more of the heart valves, which control the direction of blood flow through the heart.",
      features: [
        "Valve assessment",
        "Echocardiography",
        "Treatment planning",
        "Surgical evaluation",
      ],
    },
    {
      title: "Hypertension & Heart Health",
      icon: "🩺",
      description:
        "Long-term high blood pressure can place additional strain on the heart and increase the risk of cardiovascular disease.",
      features: [
        "Blood pressure monitoring",
        "Cardiovascular risk assessment",
        "Lifestyle counseling",
        "Preventive care",
      ],
    },
  ];

  const symptoms = [
    "Chest pain or pressure",
    "Shortness of breath",
    "Fast or irregular heartbeat",
    "Unusual tiredness",
    "Dizziness or fainting",
    "Swelling in the legs or ankles",
    "Reduced ability to exercise",
    "Pain spreading to the arm, neck, jaw, or back",
  ];

  const diagnosticTests = [
    {
      number: "01",
      title: "Electrocardiogram",
      description:
        "An ECG records the electrical activity of the heart and can help identify abnormal rhythms and other cardiac problems.",
    },
    {
      number: "02",
      title: "Echocardiogram",
      description:
        "An ultrasound examination that provides images of the heart chambers, valves, and pumping function.",
    },
    {
      number: "03",
      title: "Stress Testing",
      description:
        "Heart function may be evaluated during controlled physical activity or with medication when appropriate.",
    },
    {
      number: "04",
      title: "Blood Tests",
      description:
        "Laboratory tests can provide information about cardiovascular risk factors and may help evaluate certain heart problems.",
    },
  ];

  const treatments = [
    {
      title: "Lifestyle Management",
      icon: "🥗",
      description:
        "Healthy eating, regular physical activity, weight management, avoiding tobacco, and other lifestyle measures can support cardiovascular health.",
    },
    {
      title: "Medications",
      icon: "💊",
      description:
        "Depending on the condition, medicines may be prescribed to control blood pressure, cholesterol, heart rhythm, or other cardiovascular problems.",
    },
    {
      title: "Cardiac Procedures",
      icon: "🩺",
      description:
        "Certain heart conditions may require procedures such as catheter-based treatments or other minimally invasive interventions.",
    },
    {
      title: "Cardiac Surgery",
      icon: "🏥",
      description:
        "Some complex cardiovascular conditions may require surgical treatment following specialist evaluation.",
    },
  ];

  return (
    <div className="heart-cardio-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .heart-cardio-page {
          min-height: 100vh;
          background: #f7fafc;
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

        .heart-cardio-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .heart-hero {
          background:
            linear-gradient(
              135deg,
              #7f1d1d 0%,
              #dc2626 48%,
              #be123c 100%
            );
          color: white;
          padding: 75px 20px;
          text-align: center;
        }

        .heart-hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 15px;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 30px;
          background: rgba(255,255,255,0.10);
          color: #ffe4e6;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .heart-hero h1 {
          margin: 18px 0 14px;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 800;
          line-height: 1.1;
        }

        .heart-hero p {
          max-width: 800px;
          margin: 0 auto;
          color: #ffe4e6;
          font-size: 16px;
          line-height: 1.8;
        }

        .heart-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .heart-hero-button {
          min-height: 44px;
          padding: 0 21px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .heart-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #b91c1c;
        }

        .heart-hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .heart-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.6);
          background: transparent;
          color: white;
        }

        .heart-hero-button.secondary:hover {
          background: rgba(255,255,255,0.10);
        }

        /* =========================================
           MAIN CONTAINER
        ========================================= */

        .heart-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 55px 0 80px;
        }

        .heart-section-heading {
          text-align: center;
          margin-bottom: 40px;
        }

        .heart-section-heading h2 {
          margin: 0 0 12px;
          color: #173550;
          font-size: 30px;
          font-weight: 800;
        }

        .heart-section-heading p {
          max-width: 780px;
          margin: 0 auto;
          color: #738392;
          font-size: 15px;
          line-height: 1.8;
        }

        /* =========================================
           HEART OVERVIEW
        ========================================= */

        .heart-overview {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 25px;
          margin-bottom: 55px;
        }

        .heart-overview-content,
        .heart-overview-side {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(60,30,30,0.045);
        }

        .heart-overview-content h2 {
          margin: 0 0 14px;
          color: #173550;
          font-size: 27px;
        }

        .heart-overview-content p {
          margin: 0 0 14px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.8;
        }

        .heart-overview-content p:last-child {
          margin-bottom: 0;
        }

        .heart-overview-side {
          background:
            linear-gradient(
              145deg,
              #fff1f2,
              #ffffff
            );
        }

        .heart-overview-side h3 {
          margin: 0 0 18px;
          color: #173550;
          font-size: 20px;
        }

        .heart-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 17px;
        }

        .heart-highlight:last-child {
          margin-bottom: 0;
        }

        .heart-highlight-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #ffe4e6;
          color: #dc2626;
          font-size: 17px;
        }

        .heart-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #29465e;
          font-size: 13px;
        }

        .heart-highlight span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================================
           HEART ANATOMY
        ========================================= */

        .heart-anatomy {
          margin-bottom: 55px;
        }

        .heart-anatomy-box {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 25px;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(60,30,30,0.045);
        }

        .heart-anatomy-visual {
          min-height: 330px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle,
              #fff1f2 0%,
              #ffe4e6 45%,
              #fff7f7 100%
            );
        }

        .heart-large-icon {
          width: 190px;
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: white;
          box-shadow: 0 15px 45px rgba(185,28,28,0.15);
          font-size: 100px;
        }

        .heart-anatomy-content {
          padding: 35px;
        }

        .heart-anatomy-content h3 {
          margin: 0 0 15px;
          color: #173550;
          font-size: 24px;
        }

        .heart-anatomy-content p {
          color: #687a89;
          font-size: 14px;
          line-height: 1.8;
          margin-bottom: 22px;
        }

        .heart-anatomy-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .heart-anatomy-list li {
          padding: 12px;
          border-radius: 8px;
          background: #fff7f7;
          color: #526a7c;
          font-size: 12px;
        }

        .heart-anatomy-list strong {
          display: block;
          color: #b91c1c;
          margin-bottom: 3px;
        }

        /* =========================================
           CONDITIONS
        ========================================= */

        .heart-conditions-section {
          margin-top: 10px;
        }

        .heart-conditions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .heart-condition {
          position: relative;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          padding: 26px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(60,30,30,0.045);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .heart-condition::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #dc2626;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.25s ease;
        }

        .heart-condition:hover {
          transform: translateY(-4px);
          border-color: #f3c4c8;
          box-shadow: 0 15px 35px rgba(60,30,30,0.09);
        }

        .heart-condition:hover::before {
          transform: scaleY(1);
        }

        .heart-condition-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 17px;
        }

        .heart-condition-icon {
          width: 62px;
          height: 62px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #fff0f1;
          font-size: 29px;
        }

        .heart-condition h3 {
          margin: 0;
          color: #18364f;
          font-size: 20px;
          line-height: 1.25;
        }

        .heart-condition p {
          margin: 0 0 18px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .heart-feature-title {
          margin-bottom: 11px;
          color: #334d62;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .heart-feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .heart-feature-list li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5d7282;
          font-size: 12px;
        }

        .heart-check {
          width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #fff0f1;
          color: #dc2626;
          font-size: 9px;
          font-weight: 800;
        }

        /* =========================================
           SYMPTOMS
        ========================================= */

        .heart-symptoms-section {
          margin-top: 60px;
        }

        .heart-symptoms-box {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 32px;
          box-shadow: 0 7px 25px rgba(60,30,30,0.045);
        }

        .heart-symptoms-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 13px 25px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .heart-symptom {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 15px;
          border-radius: 9px;
          background: #fff7f7;
          color: #526a7c;
          font-size: 13px;
        }

        .heart-symptom-icon {
          width: 27px;
          height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #ffe4e6;
          color: #dc2626;
          font-size: 12px;
          font-weight: 800;
        }

        /* =========================================
           DIAGNOSIS
        ========================================= */

        .heart-diagnosis-section {
          margin-top: 60px;
        }

        .heart-diagnosis-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .heart-diagnosis-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
          padding: 26px;
          box-shadow: 0 7px 25px rgba(60,30,30,0.04);
        }

        .heart-diagnosis-card span {
          color: #dc2626;
          font-size: 12px;
          font-weight: 800;
        }

        .heart-diagnosis-card h3 {
          margin: 17px 0 10px;
          color: #173550;
          font-size: 17px;
        }

        .heart-diagnosis-card p {
          margin: 0;
          color: #718392;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           TREATMENTS
        ========================================= */

        .heart-treatment-section {
          margin-top: 60px;
        }

        .heart-treatment-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .heart-treatment-card {
          padding: 28px;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          transition: 0.25s ease;
        }

        .heart-treatment-card:hover {
          transform: translateY(-4px);
          border-color: #f3c4c8;
          box-shadow: 0 12px 30px rgba(60,30,30,0.08);
        }

        .heart-treatment-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff0f1;
          font-size: 23px;
        }

        .heart-treatment-card h3 {
          margin: 20px 0 10px;
          color: #173550;
          font-size: 17px;
        }

        .heart-treatment-card p {
          margin: 0;
          color: #718392;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           PREVENTION
        ========================================= */

        .heart-prevention {
          margin-top: 60px;
        }

        .heart-prevention-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(60,30,30,0.045);
        }

        .heart-prevention-item {
          padding: 28px 22px;
          text-align: center;
          border-right: 1px solid #edf1f3;
        }

        .heart-prevention-item:last-child {
          border-right: none;
        }

        .heart-prevention-icon {
          width: 45px;
          height: 45px;
          margin: 0 auto 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff0f1;
          font-size: 21px;
        }

        .heart-prevention-item h3 {
          margin: 0 0 8px;
          color: #29445a;
          font-size: 15px;
        }

        .heart-prevention-item p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           CARE JOURNEY
        ========================================= */

        .heart-care-section {
          margin-top: 60px;
        }

        .heart-care-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(60,30,30,0.045);
        }

        .heart-care-step {
          padding: 28px 22px;
          text-align: center;
          border-right: 1px solid #edf1f3;
        }

        .heart-care-step:last-child {
          border-right: none;
        }

        .heart-step-number {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 13px;
          border-radius: 50%;
          background: #fff0f1;
          color: #dc2626;
          font-size: 12px;
          font-weight: 800;
        }

        .heart-care-step h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 15px;
        }

        .heart-care-step p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           CTA
        ========================================= */

        .heart-cta {
          margin-top: 55px;
          padding: 35px;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #450a0a,
              #7f1d1d
            );
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .heart-cta h2 {
          margin: 0 0 9px;
          font-size: 25px;
        }

        .heart-cta p {
          max-width: 700px;
          margin: 0;
          color: #fecaca;
          font-size: 14px;
          line-height: 1.7;
        }

        .heart-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .heart-cta-button {
          min-height: 43px;
          padding: 0 18px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .heart-cta-button.primary {
          border: 1px solid #dc2626;
          background: #dc2626;
          color: white;
        }

        .heart-cta-button.primary:hover {
          background: #b91c1c;
        }

        .heart-cta-button.secondary {
          border: 1px solid #9f5b5b;
          background: transparent;
          color: white;
        }

        .heart-cta-button.secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        /* =========================================
           EMERGENCY
        ========================================= */

        .heart-emergency {
          margin-top: 22px;
          padding: 25px 30px;
          border-radius: 14px;
          background: #fff5f5;
          border: 1px solid #fee2e2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .heart-emergency-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .heart-emergency-icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #fee2e2;
          font-size: 23px;
        }

        .heart-emergency h3 {
          margin: 0 0 5px;
          color: #991b1b;
          font-size: 17px;
        }

        .heart-emergency p {
          margin: 0;
          color: #9f5b5b;
          font-size: 12px;
          line-height: 1.5;
        }

        .heart-emergency-button {
          min-height: 40px;
          padding: 0 17px;
          border: none;
          border-radius: 7px;
          background: #dc2626;
          color: white;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .heart-emergency-button:hover {
          background: #b91c1c;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 950px) {
          .heart-overview,
          .heart-anatomy-box {
            grid-template-columns: 1fr;
          }

          .heart-conditions {
            grid-template-columns: 1fr;
          }

          .heart-diagnosis-grid,
          .heart-treatment-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .heart-prevention-box,
          .heart-care-box {
            grid-template-columns: repeat(2, 1fr);
          }

          .heart-prevention-item:nth-child(2),
          .heart-care-step:nth-child(2) {
            border-right: none;
          }

          .heart-prevention-item:nth-child(-n + 2),
          .heart-care-step:nth-child(-n + 2) {
            border-bottom: 1px solid #edf1f3;
          }

          .heart-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 650px) {
          .heart-hero {
            padding: 55px 18px;
          }

          .heart-hero h1 {
            font-size: 35px;
          }

          .heart-hero p {
            font-size: 14px;
          }

          .heart-container {
            width: 92%;
            padding: 40px 0 60px;
          }

          .heart-section-heading h2 {
            font-size: 26px;
          }

          .heart-overview-content,
          .heart-overview-side,
          .heart-anatomy-content {
            padding: 23px;
          }

          .heart-condition {
            padding: 22px;
          }

          .heart-anatomy-list {
            grid-template-columns: 1fr;
          }

          .heart-symptoms-list {
            grid-template-columns: 1fr;
          }

          .heart-diagnosis-grid,
          .heart-treatment-grid,
          .heart-prevention-box,
          .heart-care-box {
            grid-template-columns: 1fr;
          }

          .heart-prevention-item,
          .heart-care-step {
            border-right: none !important;
            border-bottom: 1px solid #edf1f3;
          }

          .heart-prevention-item:last-child,
          .heart-care-step:last-child {
            border-bottom: none;
          }

          .heart-cta {
            padding: 27px 22px;
          }

          .heart-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .heart-cta-button {
            width: 100%;
          }

          .heart-emergency {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .heart-emergency-button {
            width: 100%;
          }
        }
      `}</style>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="heart-hero">
        <span className="heart-hero-badge">
          Cardiology & Heart Care
        </span>

        <h1>Heart & Cardiology Care</h1>

        <p>
          Comprehensive cardiovascular care for prevention, diagnosis,
          treatment, and long-term management of heart and blood vessel
          conditions, supported by specialist consultation and advanced
          cardiac evaluation.
        </p>

        <div className="heart-hero-actions">
          <button
            className="heart-hero-button primary"
            onClick={() => navigate("/finddoctors")}
          >
            Find a Cardiologist
          </button>

          <button
            className="heart-hero-button secondary"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </section>

      <main className="heart-container">

        {/* =========================================
            OVERVIEW
        ========================================= */}

        <section className="heart-overview">
          <div className="heart-overview-content">
            <h2>Understanding Heart Health</h2>

            <p>
              The cardiovascular system includes the heart and blood
              vessels that circulate blood throughout the body. The
              heart continuously pumps oxygen and nutrients to tissues
              while carrying waste products away.
            </p>

            <p>
              Cardiovascular diseases can affect the heart muscle,
              coronary arteries, valves, electrical system, or blood
              vessels. Some conditions develop gradually, while others
              can require urgent medical attention.
            </p>

            <p>
              At MediCo, cardiovascular care focuses on prevention,
              early evaluation, accurate diagnosis, individualized
              treatment, and long-term monitoring.
            </p>
          </div>

          <div className="heart-overview-side">
            <h3>Comprehensive Heart Care</h3>

            <div className="heart-highlight">
              <div className="heart-highlight-icon">❤️</div>

              <div>
                <strong>Preventive Cardiology</strong>

                <span>
                  Assessment of cardiovascular risk and healthy-heart
                  strategies.
                </span>
              </div>
            </div>

            <div className="heart-highlight">
              <div className="heart-highlight-icon">🩺</div>

              <div>
                <strong>Cardiac Evaluation</strong>

                <span>
                  Specialist assessment and appropriate diagnostic testing.
                </span>
              </div>
            </div>

            <div className="heart-highlight">
              <div className="heart-highlight-icon">📈</div>

              <div>
                <strong>Heart Monitoring</strong>

                <span>
                  Evaluation of heart rhythm, blood pressure, and heart
                  function.
                </span>
              </div>
            </div>

            <div className="heart-highlight">
              <div className="heart-highlight-icon">💗</div>

              <div>
                <strong>Long-Term Care</strong>

                <span>
                  Ongoing treatment, monitoring, recovery, and prevention.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            HEART ANATOMY
        ========================================= */}

        <section className="heart-anatomy">
          <div className="heart-section-heading">
            <h2>Understanding the Heart</h2>

            <p>
              The heart is a muscular organ that pumps blood through
              the lungs and the rest of the body.
            </p>
          </div>

          <div className="heart-anatomy-box">
            <div className="heart-anatomy-visual">
              <div className="heart-large-icon">
                ❤️
              </div>
            </div>

            <div className="heart-anatomy-content">
              <h3>How the Heart Works</h3>

              <p>
                The heart has four chambers and several valves that
                help direct blood through the heart. The right side
                sends blood toward the lungs for oxygenation, while
                the left side pumps oxygen-rich blood throughout the
                body.
              </p>

              <ul className="heart-anatomy-list">
                <li>
                  <strong>Right Atrium</strong>
                  Receives blood returning from the body.
                </li>

                <li>
                  <strong>Right Ventricle</strong>
                  Pumps blood toward the lungs.
                </li>

                <li>
                  <strong>Left Atrium</strong>
                  Receives oxygen-rich blood from the lungs.
                </li>

                <li>
                  <strong>Left Ventricle</strong>
                  Pumps oxygen-rich blood throughout the body.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================
            CONDITIONS
        ========================================= */}

        <section className="heart-conditions-section">
          <div className="heart-section-heading">
            <h2>Common Heart Conditions</h2>

            <p>
              Explore some of the cardiovascular conditions that may
              require medical evaluation, treatment, and ongoing care.
            </p>
          </div>

          <div className="heart-conditions">
            {heartConditions.map((condition) => (
              <article
                className="heart-condition"
                key={condition.title}
              >
                <div className="heart-condition-top">
                  <div className="heart-condition-icon">
                    {condition.icon}
                  </div>

                  <h3>{condition.title}</h3>
                </div>

                <p>{condition.description}</p>

                <div className="heart-feature-title">
                  Care Includes
                </div>

                <ul className="heart-feature-list">
                  {condition.features.map((feature) => (
                    <li key={feature}>
                      <span className="heart-check">
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

        {/* =========================================
            SYMPTOMS
        ========================================= */}

        <section className="heart-symptoms-section">
          <div className="heart-section-heading">
            <h2>Common Heart-Related Symptoms</h2>

            <p>
              Cardiovascular symptoms can vary significantly. Some
              symptoms may have causes unrelated to the heart, so
              medical evaluation is important when symptoms are new,
              persistent, or concerning.
            </p>
          </div>

          <div className="heart-symptoms-box">
            <ul className="heart-symptoms-list">
              {symptoms.map((symptom) => (
                <li className="heart-symptom" key={symptom}>
                  <span className="heart-symptom-icon">
                    ✓
                  </span>

                  {symptom}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =========================================
            DIAGNOSIS
        ========================================= */}

        <section className="heart-diagnosis-section">
          <div className="heart-section-heading">
            <h2>Cardiac Diagnosis & Testing</h2>

            <p>
              Depending on symptoms and medical history, a cardiologist
              may recommend one or more tests to understand heart
              function and identify potential cardiovascular problems.
            </p>
          </div>

          <div className="heart-diagnosis-grid">
            {diagnosticTests.map((test) => (
              <article
                className="heart-diagnosis-card"
                key={test.title}
              >
                <span>{test.number}</span>

                <h3>{test.title}</h3>

                <p>{test.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================
            TREATMENTS
        ========================================= */}

        <section className="heart-treatment-section">
          <div className="heart-section-heading">
            <h2>Heart Treatment Options</h2>

            <p>
              Cardiovascular treatment depends on the specific
              condition, its severity, risk factors, and the patient's
              overall health.
            </p>
          </div>

          <div className="heart-treatment-grid">
            {treatments.map((treatment) => (
              <article
                className="heart-treatment-card"
                key={treatment.title}
              >
                <div className="heart-treatment-icon">
                  {treatment.icon}
                </div>

                <h3>{treatment.title}</h3>

                <p>{treatment.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================
            PREVENTION
        ========================================= */}

        <section className="heart-prevention">
          <div className="heart-section-heading">
            <h2>Protect Your Heart</h2>

            <p>
              Many cardiovascular risk factors can be addressed
              through healthy lifestyle choices and regular medical
              care.
            </p>
          </div>

          <div className="heart-prevention-box">
            <div className="heart-prevention-item">
              <div className="heart-prevention-icon">
                🥗
              </div>

              <h3>Healthy Diet</h3>

              <p>
                Choose a balanced diet that supports healthy blood
                pressure and cholesterol levels.
              </p>
            </div>

            <div className="heart-prevention-item">
              <div className="heart-prevention-icon">
                🏃
              </div>

              <h3>Stay Active</h3>

              <p>
                Regular physical activity can support cardiovascular
                fitness and overall health.
              </p>
            </div>

            <div className="heart-prevention-item">
              <div className="heart-prevention-icon">
                🚭
              </div>

              <h3>Avoid Tobacco</h3>

              <p>
                Avoiding tobacco products can reduce cardiovascular
                and blood vessel risks.
              </p>
            </div>

            <div className="heart-prevention-item">
              <div className="heart-prevention-icon">
                🩺
              </div>

              <h3>Regular Checkups</h3>

              <p>
                Monitor blood pressure, cholesterol, diabetes, and
                other cardiovascular risk factors.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            CARE JOURNEY
        ========================================= */}

        <section className="heart-care-section">
          <div className="heart-section-heading">
            <h2>Your Heart Care Journey</h2>

            <p>
              A structured approach to cardiovascular evaluation,
              treatment, recovery, and ongoing prevention.
            </p>
          </div>

          <div className="heart-care-box">
            <div className="heart-care-step">
              <div className="heart-step-number">
                01
              </div>

              <h3>Consultation</h3>

              <p>
                Discuss symptoms, medical history, lifestyle, and
                cardiovascular risk factors.
              </p>
            </div>

            <div className="heart-care-step">
              <div className="heart-step-number">
                02
              </div>

              <h3>Diagnosis</h3>

              <p>
                Complete appropriate examinations and cardiac
                diagnostic tests.
              </p>
            </div>

            <div className="heart-care-step">
              <div className="heart-step-number">
                03
              </div>

              <h3>Treatment</h3>

              <p>
                Develop a personalized treatment and cardiovascular
                care plan.
              </p>
            </div>

            <div className="heart-care-step">
              <div className="heart-step-number">
                04
              </div>

              <h3>Follow-Up</h3>

              <p>
                Continue monitoring, recovery, prevention, and long-term
                heart health management.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            CTA
        ========================================= */}

        <section className="heart-cta">
          <div>
            <h2>Need Heart or Cardiology Care?</h2>

            <p>
              Connect with a qualified cardiologist to discuss your
              symptoms, cardiovascular risk, diagnostic options, and
              appropriate treatment.
            </p>
          </div>

          <div className="heart-cta-actions">
            <button
              className="heart-cta-button primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Cardiologist
            </button>

            <button
              className="heart-cta-button secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </section>

        {/* =========================================
            EMERGENCY
        ========================================= */}

        <section className="heart-emergency">
          <div className="heart-emergency-content">
            <div className="heart-emergency-icon">
              🚑
            </div>

            <div>
              <h3>Possible Heart Emergency?</h3>

              <p>
                Severe or persistent chest pain, severe difficulty
                breathing, fainting, or other serious symptoms may
                require immediate medical attention.
              </p>
            </div>
          </div>

          <button
            className="heart-emergency-button"
            onClick={() => navigate("/services/emergency")}
          >
            Emergency Services
          </button>
        </section>

      </main>
    </div>
  );
}
