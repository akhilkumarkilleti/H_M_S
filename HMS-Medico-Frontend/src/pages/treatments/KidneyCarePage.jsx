import React from "react";
import { useNavigate } from "react-router-dom";

export default function KidneyCarePage() {
  const navigate = useNavigate();

  const kidneyServices = [
    {
      title: "Kidney Consultation",
      icon: "🫘",
      description:
        "Comprehensive evaluation and management of kidney conditions, urinary problems, abnormal kidney function, and related health concerns.",
      features: [
        "Kidney health assessment",
        "Medical history review",
        "Treatment planning",
        "Long-term follow-up",
      ],
    },
    {
      title: "Chronic Kidney Disease",
      icon: "🩺",
      description:
        "Specialized care for chronic kidney disease with a focus on slowing disease progression, managing complications, and protecting kidney function.",
      features: [
        "Kidney function monitoring",
        "Blood pressure management",
        "Dietary guidance",
        "Disease progression monitoring",
      ],
    },
    {
      title: "Kidney Stones",
      icon: "💧",
      description:
        "Diagnosis and treatment of kidney stones, including evaluation of stone size, location, symptoms, and risk of recurrence.",
      features: [
        "Stone evaluation",
        "Pain management",
        "Stone removal planning",
        "Prevention guidance",
      ],
    },
    {
      title: "Dialysis Care",
      icon: "⚕️",
      description:
        "Support and medical management for patients who require dialysis because their kidneys are unable to adequately remove waste and excess fluid.",
      features: [
        "Dialysis evaluation",
        "Treatment monitoring",
        "Access care",
        "Complication management",
      ],
    },
    {
      title: "Kidney Transplant Care",
      icon: "❤️",
      description:
        "Specialist evaluation and ongoing medical support for eligible patients before and after kidney transplantation.",
      features: [
        "Transplant evaluation",
        "Pre-transplant assessment",
        "Post-transplant monitoring",
        "Medication management",
      ],
    },
    {
      title: "Urinary & Kidney Disorders",
      icon: "🔬",
      description:
        "Evaluation and treatment of a wide range of conditions affecting kidney function and the urinary system.",
      features: [
        "Urinary problems",
        "Kidney infections",
        "Protein in urine",
        "Blood in urine",
      ],
    },
  ];

  const kidneyConditions = [
    {
      title: "Chronic Kidney Disease",
      icon: "🫘",
      description:
        "A long-term condition in which the kidneys gradually lose their ability to filter waste and excess fluid from the blood.",
    },
    {
      title: "Kidney Stones",
      icon: "💎",
      description:
        "Hard deposits that can form inside the kidneys and may cause severe pain, urinary symptoms, or obstruction.",
    },
    {
      title: "Kidney Infection",
      icon: "🦠",
      description:
        "An infection affecting the kidneys that may cause fever, pain, urinary symptoms, and other systemic symptoms.",
    },
    {
      title: "Acute Kidney Injury",
      icon: "⚠️",
      description:
        "A sudden reduction in kidney function that can occur because of illness, dehydration, medications, obstruction, or other causes.",
    },
    {
      title: "Polycystic Kidney Disease",
      icon: "🧬",
      description:
        "An inherited condition in which multiple cysts develop in the kidneys and can affect kidney function over time.",
    },
    {
      title: "Glomerular Diseases",
      icon: "🔬",
      description:
        "Conditions affecting the kidney's filtering units that may lead to protein or blood in the urine and reduced kidney function.",
    },
  ];

  const symptoms = [
    "Swelling around the eyes, hands, ankles, or feet",
    "Changes in urination frequency or amount",
    "Blood in the urine",
    "Foamy or unusually bubbly urine",
    "Persistent fatigue or weakness",
    "Nausea or loss of appetite",
    "Pain in the side or lower back",
    "High blood pressure",
    "Difficulty concentrating",
    "Shortness of breath or fluid-related symptoms",
  ];

  const diagnosis = [
    {
      number: "01",
      title: "Blood Tests",
      description:
        "Blood tests can help evaluate kidney function by measuring markers such as creatinine and estimating kidney filtration.",
    },
    {
      number: "02",
      title: "Urine Tests",
      description:
        "Urine testing can identify blood, protein, infection, and other abnormalities that may indicate kidney problems.",
    },
    {
      number: "03",
      title: "Ultrasound & Imaging",
      description:
        "Imaging studies can evaluate kidney size, structure, stones, cysts, obstruction, and other abnormalities.",
    },
    {
      number: "04",
      title: "Kidney Biopsy",
      description:
        "In selected cases, a small kidney tissue sample may be examined to determine the cause and type of kidney disease.",
    },
  ];

  const treatments = [
    {
      title: "Medication Management",
      icon: "💊",
      description:
        "Medicines may be prescribed to control blood pressure, manage symptoms, treat infections, or address specific kidney conditions.",
    },
    {
      title: "Diet & Lifestyle",
      icon: "🥗",
      description:
        "Individualized nutrition, fluid, physical activity, and lifestyle recommendations may help protect kidney function.",
    },
    {
      title: "Kidney Stone Treatment",
      icon: "💎",
      description:
        "Depending on the stone, treatment may include hydration, medicines, monitoring, procedures, or surgical removal.",
    },
    {
      title: "Dialysis",
      icon: "⚕️",
      description:
        "Dialysis can help remove waste products and excess fluid from the blood when kidney function becomes severely reduced.",
    },
  ];

  return (
    <div className="kidney-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .kidney-page {
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

        .kidney-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .kidney-hero {
          background:
            linear-gradient(
              135deg,
              #075985 0%,
              #0284c7 48%,
              #0f766e 100%
            );
          color: white;
          padding: 78px 20px;
          text-align: center;
        }

        .kidney-hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 15px;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 30px;
          background: rgba(255,255,255,0.10);
          color: #e0f2fe;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .kidney-hero h1 {
          margin: 18px 0 14px;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 800;
          line-height: 1.1;
        }

        .kidney-hero p {
          max-width: 820px;
          margin: 0 auto;
          color: #e0f2fe;
          font-size: 16px;
          line-height: 1.8;
        }

        .kidney-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .kidney-hero-button {
          min-height: 44px;
          padding: 0 21px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .kidney-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #0369a1;
        }

        .kidney-hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .kidney-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.6);
          background: transparent;
          color: white;
        }

        .kidney-hero-button.secondary:hover {
          background: rgba(255,255,255,0.10);
        }

        /* =========================================
           CONTAINER
        ========================================= */

        .kidney-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 55px 0 80px;
        }

        .kidney-section-heading {
          text-align: center;
          margin-bottom: 40px;
        }

        .kidney-section-heading h2 {
          margin: 0 0 12px;
          color: #173550;
          font-size: 30px;
          font-weight: 800;
        }

        .kidney-section-heading p {
          max-width: 780px;
          margin: 0 auto;
          color: #738392;
          font-size: 15px;
          line-height: 1.8;
        }

        /* =========================================
           INTRO
        ========================================= */

        .kidney-intro {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 25px;
          margin-bottom: 55px;
        }

        .kidney-intro-content,
        .kidney-intro-side {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .kidney-intro-content h2 {
          margin: 0 0 14px;
          color: #173550;
          font-size: 27px;
        }

        .kidney-intro-content p {
          margin: 0 0 13px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.8;
        }

        .kidney-intro-content p:last-child {
          margin-bottom: 0;
        }

        .kidney-intro-side {
          background:
            linear-gradient(
              145deg,
              #eaf8f8,
              #ffffff
            );
        }

        .kidney-intro-side h3 {
          margin: 0 0 18px;
          color: #173550;
          font-size: 20px;
        }

        .kidney-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .kidney-highlight:last-child {
          margin-bottom: 0;
        }

        .kidney-highlight-icon {
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #dff4f3;
          color: #159c9d;
          font-size: 17px;
        }

        .kidney-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #29465e;
          font-size: 13px;
        }

        .kidney-highlight span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================================
           CONDITIONS
        ========================================= */

        .kidney-conditions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 60px;
        }

        .kidney-condition {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          padding: 25px;
          transition: 0.25s ease;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .kidney-condition:hover {
          transform: translateY(-4px);
          border-color: #cfe4e6;
          box-shadow: 0 15px 35px rgba(30,60,80,0.09);
        }

        .kidney-condition-icon {
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #eaf8f8;
          font-size: 27px;
          margin-bottom: 18px;
        }

        .kidney-condition h3 {
          margin: 0 0 10px;
          color: #18364f;
          font-size: 19px;
        }

        .kidney-condition p {
          margin: 0;
          color: #687a89;
          font-size: 13px;
          line-height: 1.7;
        }

        /* =========================================
           SYMPTOMS
        ========================================= */

        .kidney-symptoms-section {
          margin-bottom: 60px;
        }

        .kidney-symptoms-box {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 32px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .kidney-symptoms-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 25px;
        }

        .kidney-symptom {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px;
          background: #f7fafc;
          border-radius: 9px;
          color: #566d7d;
          font-size: 13px;
        }

        .kidney-symptom-check {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e2f6f4;
          color: #159c9d;
          font-size: 11px;
          font-weight: 800;
        }

        /* =========================================
           SERVICES
        ========================================= */

        .kidney-services {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .kidney-service {
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

        .kidney-service::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
          background: #159c9d;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.25s ease;
        }

        .kidney-service:hover {
          transform: translateY(-4px);
          border-color: #cfe4e6;
          box-shadow: 0 15px 35px rgba(30,60,80,0.09);
        }

        .kidney-service:hover::before {
          transform: scaleY(1);
        }

        .kidney-service-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 17px;
        }

        .kidney-service-icon {
          width: 62px;
          height: 62px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #eaf8f8;
          font-size: 29px;
        }

        .kidney-service h3 {
          margin: 0;
          color: #18364f;
          font-size: 20px;
          line-height: 1.25;
        }

        .kidney-service p {
          margin: 0 0 18px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .kidney-feature-title {
          margin-bottom: 11px;
          color: #334d62;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .kidney-feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .kidney-feature-list li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5d7282;
          font-size: 12px;
        }

        .kidney-check {
          width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #e7f7f5;
          color: #159c9d;
          font-size: 9px;
          font-weight: 800;
        }

        /* =========================================
           DIAGNOSIS
        ========================================= */

        .kidney-diagnosis-section {
          margin-top: 60px;
        }

        .kidney-diagnosis-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .kidney-diagnosis-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
          padding: 25px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .kidney-diagnosis-card span {
          color: #159c9d;
          font-size: 12px;
          font-weight: 800;
        }

        .kidney-diagnosis-card h3 {
          margin: 15px 0 10px;
          color: #27445a;
          font-size: 17px;
        }

        .kidney-diagnosis-card p {
          margin: 0;
          color: #718392;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           TREATMENT
        ========================================= */

        .kidney-treatment-section {
          margin-top: 60px;
        }

        .kidney-treatment-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .kidney-treatment-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          padding: 26px;
          transition: 0.25s ease;
        }

        .kidney-treatment-card:hover {
          transform: translateY(-4px);
          border-color: #159c9d;
          box-shadow: 0 12px 30px rgba(30,60,80,0.08);
        }

        .kidney-treatment-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e4f7f6;
          font-size: 24px;
        }

        .kidney-treatment-card h3 {
          margin: 20px 0 10px;
          color: #27445a;
          font-size: 17px;
        }

        .kidney-treatment-card p {
          margin: 0;
          color: #718392;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           KIDNEY HEALTH
        ========================================= */

        .kidney-health-section {
          margin-top: 60px;
        }

        .kidney-health-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .kidney-health-item {
          padding: 28px 22px;
          text-align: center;
          border-right: 1px solid #edf1f3;
        }

        .kidney-health-item:last-child {
          border-right: none;
        }

        .kidney-health-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 13px;
          border-radius: 50%;
          background: #e8f7f7;
          color: #159c9d;
          font-size: 13px;
          font-weight: 800;
        }

        .kidney-health-item h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 15px;
        }

        .kidney-health-item p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           CTA
        ========================================= */

        .kidney-cta {
          margin-top: 55px;
          padding: 36px;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #102d45,
              #164b63
            );
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .kidney-cta h2 {
          margin: 0 0 9px;
          font-size: 25px;
        }

        .kidney-cta p {
          max-width: 700px;
          margin: 0;
          color: #bcd1dd;
          font-size: 14px;
          line-height: 1.7;
        }

        .kidney-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .kidney-cta-button {
          min-height: 43px;
          padding: 0 18px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .kidney-cta-button.primary {
          border: 1px solid #159c9d;
          background: #159c9d;
          color: white;
        }

        .kidney-cta-button.primary:hover {
          background: #0e8183;
        }

        .kidney-cta-button.secondary {
          border: 1px solid #557587;
          background: transparent;
          color: white;
        }

        .kidney-cta-button.secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        /* =========================================
           EMERGENCY
        ========================================= */

        .kidney-emergency {
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

        .kidney-emergency-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .kidney-emergency-icon {
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

        .kidney-emergency h3 {
          margin: 0 0 5px;
          color: #991b1b;
          font-size: 17px;
        }

        .kidney-emergency p {
          margin: 0;
          color: #9f5b5b;
          font-size: 12px;
          line-height: 1.6;
        }

        .kidney-emergency-button {
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

        .kidney-emergency-button:hover {
          background: #b91c1c;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 1000px) {
          .kidney-conditions {
            grid-template-columns: repeat(2, 1fr);
          }

          .kidney-diagnosis-grid,
          .kidney-treatment-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .kidney-health-box {
            grid-template-columns: repeat(2, 1fr);
          }

          .kidney-health-item:nth-child(2) {
            border-right: none;
          }

          .kidney-health-item:nth-child(-n + 2) {
            border-bottom: 1px solid #edf1f3;
          }
        }

        @media (max-width: 900px) {
          .kidney-intro {
            grid-template-columns: 1fr;
          }

          .kidney-services {
            grid-template-columns: 1fr;
          }

          .kidney-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 650px) {
          .kidney-hero {
            padding: 55px 18px;
          }

          .kidney-hero h1 {
            font-size: 35px;
          }

          .kidney-hero p {
            font-size: 14px;
          }

          .kidney-container {
            width: 92%;
            padding: 40px 0 60px;
          }

          .kidney-section-heading h2 {
            font-size: 26px;
          }

          .kidney-intro-content,
          .kidney-intro-side {
            padding: 23px;
          }

          .kidney-conditions,
          .kidney-diagnosis-grid,
          .kidney-treatment-grid,
          .kidney-symptoms-list {
            grid-template-columns: 1fr;
          }

          .kidney-service {
            padding: 22px;
          }

          .kidney-health-box {
            grid-template-columns: 1fr;
          }

          .kidney-health-item {
            border-right: none !important;
            border-bottom: 1px solid #edf1f3;
          }

          .kidney-health-item:last-child {
            border-bottom: none;
          }

          .kidney-cta {
            padding: 27px 22px;
          }

          .kidney-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .kidney-cta-button {
            width: 100%;
          }

          .kidney-emergency {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .kidney-emergency-button {
            width: 100%;
          }
        }
      `}</style>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="kidney-hero">
        <span className="kidney-hero-badge">
          Kidney & Renal Care
        </span>

        <h1>Comprehensive Kidney Care</h1>

        <p>
          Specialized care for kidney health, kidney diseases,
          urinary problems, kidney stones, chronic kidney disease,
          dialysis, and transplant-related care through evaluation,
          diagnosis, treatment, and long-term follow-up.
        </p>

        <div className="kidney-hero-actions">
          <button
            className="kidney-hero-button primary"
            onClick={() => navigate("/finddoctors")}
          >
            Find a Kidney Specialist
          </button>

          <button
            className="kidney-hero-button secondary"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </section>

      <main className="kidney-container">

        {/* =========================================
            INTRO
        ========================================= */}

        <section className="kidney-intro">
          <div className="kidney-intro-content">
            <h2>Understanding Kidney Health</h2>

            <p>
              The kidneys are two important organs that filter waste
              products and excess fluid from the blood. They also play
              an important role in maintaining fluid balance, blood
              pressure, electrolyte levels, and other functions in the
              body.
            </p>

            <p>
              Kidney problems can develop suddenly or gradually.
              Some kidney conditions may cause noticeable symptoms,
              while others can progress without obvious warning signs.
            </p>

            <p>
              At MediCo, kidney care focuses on early evaluation,
              accurate diagnosis, personalized treatment, prevention
              of complications, and long-term monitoring when needed.
            </p>
          </div>

          <div className="kidney-intro-side">
            <h3>Kidney Care Includes</h3>

            <div className="kidney-highlight">
              <div className="kidney-highlight-icon">
                🫘
              </div>

              <div>
                <strong>Kidney Function</strong>
                <span>
                  Assessment of kidney health and filtering function.
                </span>
              </div>
            </div>

            <div className="kidney-highlight">
              <div className="kidney-highlight-icon">
                🩺
              </div>

              <div>
                <strong>Specialist Consultation</strong>
                <span>
                  Detailed evaluation and individualized treatment
                  planning.
                </span>
              </div>
            </div>

            <div className="kidney-highlight">
              <div className="kidney-highlight-icon">
                🔬
              </div>

              <div>
                <strong>Diagnostic Support</strong>
                <span>
                  Blood, urine, imaging, and other appropriate
                  investigations.
                </span>
              </div>
            </div>

            <div className="kidney-highlight">
              <div className="kidney-highlight-icon">
                ❤️
              </div>

              <div>
                <strong>Long-Term Kidney Care</strong>
                <span>
                  Monitoring, prevention, treatment, and recovery
                  support.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            KIDNEY CONDITIONS
        ========================================= */}

        <section>
          <div className="kidney-section-heading">
            <h2>Common Kidney Conditions</h2>

            <p>
              Kidney conditions can have different causes and may
              require different approaches to diagnosis and treatment.
            </p>
          </div>

          <div className="kidney-conditions">
            {kidneyConditions.map((condition) => (
              <article
                className="kidney-condition"
                key={condition.title}
              >
                <div className="kidney-condition-icon">
                  {condition.icon}
                </div>

                <h3>{condition.title}</h3>

                <p>{condition.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================
            SYMPTOMS
        ========================================= */}

        <section className="kidney-symptoms-section">
          <div className="kidney-section-heading">
            <h2>Signs & Symptoms of Kidney Problems</h2>

            <p>
              Symptoms can vary depending on the type and severity
              of the kidney condition. Some kidney diseases may not
              cause symptoms during their early stages.
            </p>
          </div>

          <div className="kidney-symptoms-box">
            <div className="kidney-symptoms-list">
              {symptoms.map((symptom) => (
                <div
                  className="kidney-symptom"
                  key={symptom}
                >
                  <span className="kidney-symptom-check">
                    ✓
                  </span>

                  {symptom}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SERVICES
        ========================================= */}

        <section>
          <div className="kidney-section-heading">
            <h2>Kidney Care Services</h2>

            <p>
              Explore specialized kidney services available through
              the MediCo healthcare network.
            </p>
          </div>

          <div className="kidney-services">
            {kidneyServices.map((service) => (
              <article
                className="kidney-service"
                key={service.title}
              >
                <div className="kidney-service-top">
                  <div className="kidney-service-icon">
                    {service.icon}
                  </div>

                  <h3>{service.title}</h3>
                </div>

                <p>{service.description}</p>

                <div className="kidney-feature-title">
                  Care Includes
                </div>

                <ul className="kidney-feature-list">
                  {service.features.map((feature) => (
                    <li key={feature}>
                      <span className="kidney-check">
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
            DIAGNOSIS
        ========================================= */}

        <section className="kidney-diagnosis-section">
          <div className="kidney-section-heading">
            <h2>How Kidney Problems Are Diagnosed</h2>

            <p>
              Doctors may use blood tests, urine testing, imaging,
              and other investigations to understand kidney function
              and identify the underlying condition.
            </p>
          </div>

          <div className="kidney-diagnosis-grid">
            {diagnosis.map((item) => (
              <article
                className="kidney-diagnosis-card"
                key={item.number}
              >
                <span>{item.number}</span>

                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================
            TREATMENT
        ========================================= */}

        <section className="kidney-treatment-section">
          <div className="kidney-section-heading">
            <h2>Kidney Treatment Options</h2>

            <p>
              Treatment depends on the specific kidney condition,
              severity of disease, kidney function, and overall health.
            </p>
          </div>

          <div className="kidney-treatment-grid">
            {treatments.map((treatment) => (
              <article
                className="kidney-treatment-card"
                key={treatment.title}
              >
                <div className="kidney-treatment-icon">
                  {treatment.icon}
                </div>

                <h3>{treatment.title}</h3>

                <p>{treatment.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================
            KIDNEY HEALTH
        ========================================= */}

        <section className="kidney-health-section">
          <div className="kidney-section-heading">
            <h2>Protect Your Kidney Health</h2>

            <p>
              Healthy lifestyle choices and management of medical
              conditions can support kidney health and reduce the
              risk of kidney problems.
            </p>
          </div>

          <div className="kidney-health-box">
            <div className="kidney-health-item">
              <div className="kidney-health-number">
                01
              </div>

              <h3>Manage Blood Pressure</h3>

              <p>
                Regular monitoring and appropriate treatment of high
                blood pressure can help protect kidney function.
              </p>
            </div>

            <div className="kidney-health-item">
              <div className="kidney-health-number">
                02
              </div>

              <h3>Control Blood Sugar</h3>

              <p>
                Good diabetes management can reduce the risk of
                diabetes-related kidney damage.
              </p>
            </div>

            <div className="kidney-health-item">
              <div className="kidney-health-number">
                03
              </div>

              <h3>Stay Active</h3>

              <p>
                Regular physical activity and maintaining a healthy
                weight support overall cardiovascular and kidney health.
              </p>
            </div>

            <div className="kidney-health-item">
              <div className="kidney-health-number">
                04
              </div>

              <h3>Regular Checkups</h3>

              <p>
                People at increased risk may benefit from regular
                medical evaluation and kidney function testing.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            CTA
        ========================================= */}

        <section className="kidney-cta">
          <div>
            <h2>Need Kidney Care?</h2>

            <p>
              Connect with a qualified kidney specialist to discuss
              your symptoms, kidney health, test results, or ongoing
              treatment needs.
            </p>
          </div>

          <div className="kidney-cta-actions">
            <button
              className="kidney-cta-button primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Doctor
            </button>

            <button
              className="kidney-cta-button secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </section>

        {/* =========================================
            EMERGENCY
        ========================================= */}

        <section className="kidney-emergency">
          <div className="kidney-emergency-content">
            <div className="kidney-emergency-icon">
              🚑
            </div>

            <div>
              <h3>Medical Emergency?</h3>

              <p>
                Severe side or back pain, inability to urinate,
                significant blood in urine, severe weakness,
                breathing difficulty, or other serious symptoms
                may require urgent medical evaluation.
              </p>
            </div>
          </div>

          <button
            className="kidney-emergency-button"
            onClick={() => navigate("/services/emergency")}
          >
            Emergency Services
          </button>
        </section>

      </main>
    </div>
  );
}
