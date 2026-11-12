import React from "react";
import { useNavigate } from "react-router-dom";

export default function GastroenterologyPage() {
  const navigate = useNavigate();

  const gastroServices = [
    {
      title: "Gastroenterology Consultation",
      icon: "🩺",
      description:
        "Comprehensive evaluation and management of conditions affecting the digestive system, including the esophagus, stomach, intestines, liver, gallbladder, and pancreas.",
      features: [
        "Digestive health assessment",
        "Medical history review",
        "Specialist consultation",
        "Personalized treatment planning",
      ],
    },
    {
      title: "Endoscopy Services",
      icon: "🔬",
      description:
        "Advanced endoscopic evaluation to examine the digestive tract and help identify inflammation, ulcers, bleeding, polyps, and other abnormalities.",
      features: [
        "Upper GI endoscopy",
        "Colonoscopy",
        "Biopsy evaluation",
        "Polyp assessment",
      ],
    },
    {
      title: "Liver Care",
      icon: "🧡",
      description:
        "Specialized evaluation and management of liver conditions, including fatty liver disease, hepatitis, cirrhosis, and other liver-related disorders.",
      features: [
        "Liver function assessment",
        "Fatty liver management",
        "Hepatitis evaluation",
        "Cirrhosis monitoring",
      ],
    },
    {
      title: "Stomach & Intestinal Care",
      icon: "🫃",
      description:
        "Diagnosis and treatment of common and complex conditions affecting the stomach, small intestine, and large intestine.",
      features: [
        "Acidity and reflux care",
        "Gastritis management",
        "IBS management",
        "Inflammatory bowel disease care",
      ],
    },
    {
      title: "Pancreas & Gallbladder Care",
      icon: "🩻",
      description:
        "Evaluation and management of disorders involving the pancreas and gallbladder, including pancreatitis and gallstone-related conditions.",
      features: [
        "Gallstone evaluation",
        "Pancreatitis care",
        "Gallbladder assessment",
        "Pancreatic evaluation",
      ],
    },
    {
      title: "Colorectal Care",
      icon: "🧬",
      description:
        "Specialized assessment of conditions affecting the colon and rectum, including bowel disorders, polyps, bleeding, and colorectal disease.",
      features: [
        "Colonoscopy evaluation",
        "Bowel disorder management",
        "Polyp detection",
        "Colorectal screening",
      ],
    },
  ];

  const digestiveConditions = [
    {
      title: "Acid Reflux & GERD",
      icon: "🔥",
      description:
        "A condition in which stomach contents flow back into the esophagus, potentially causing heartburn, regurgitation, and other symptoms.",
    },
    {
      title: "Gastritis & Ulcers",
      icon: "🫃",
      description:
        "Inflammation or sores affecting the stomach lining that may cause abdominal discomfort, nausea, or other digestive symptoms.",
    },
    {
      title: "Irritable Bowel Syndrome",
      icon: "🔄",
      description:
        "A common digestive disorder that may cause abdominal pain, bloating, constipation, diarrhea, or changes in bowel habits.",
    },
    {
      title: "Inflammatory Bowel Disease",
      icon: "🩺",
      description:
        "Long-term inflammatory conditions such as Crohn's disease and ulcerative colitis that affect the digestive tract.",
    },
    {
      title: "Gallstones",
      icon: "🟡",
      description:
        "Hardened deposits that can form in the gallbladder and may cause abdominal pain or digestive complications.",
    },
    {
      title: "Fatty Liver Disease",
      icon: "🧡",
      description:
        "A condition involving excess fat accumulation in the liver that may require lifestyle changes, monitoring, and medical management.",
    },
    {
      title: "Hepatitis",
      icon: "🦠",
      description:
        "Inflammation of the liver that can have different causes and may require evaluation, monitoring, and treatment.",
    },
    {
      title: "Pancreatitis",
      icon: "⚕️",
      description:
        "Inflammation of the pancreas that can cause significant abdominal pain and requires appropriate medical evaluation.",
    },
  ];

  const symptoms = [
    "Persistent abdominal pain",
    "Frequent heartburn or acid reflux",
    "Persistent bloating or gas",
    "Nausea or repeated vomiting",
    "Persistent diarrhea or constipation",
    "Blood in stool or black stools",
    "Difficulty swallowing",
    "Unexplained weight loss",
    "Yellowing of the skin or eyes",
    "Changes in bowel habits",
  ];

  return (
    <div className="gastro-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .gastro-page {
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

        .gastro-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .gastro-hero {
          background:
            linear-gradient(
              135deg,
              #075985 0%,
              #0284c7 48%,
              #0f766e 100%
            );
          color: white;
          padding: 75px 20px;
          text-align: center;
        }

        .gastro-hero-badge {
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

        .gastro-hero h1 {
          margin: 18px 0 14px;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 800;
          line-height: 1.1;
        }

        .gastro-hero p {
          max-width: 800px;
          margin: 0 auto;
          color: #e0f2fe;
          font-size: 16px;
          line-height: 1.8;
        }

        .gastro-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .gastro-hero-button {
          min-height: 44px;
          padding: 0 21px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .gastro-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #0369a1;
        }

        .gastro-hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .gastro-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.6);
          background: transparent;
          color: white;
        }

        .gastro-hero-button.secondary:hover {
          background: rgba(255,255,255,0.10);
        }

        /* =========================================
           MAIN
        ========================================= */

        .gastro-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 55px 0 80px;
        }

        .gastro-section-heading {
          text-align: center;
          margin-bottom: 40px;
        }

        .gastro-section-heading h2 {
          margin: 0 0 12px;
          color: #173550;
          font-size: 30px;
          font-weight: 800;
        }

        .gastro-section-heading p {
          max-width: 780px;
          margin: 0 auto;
          color: #738392;
          font-size: 15px;
          line-height: 1.8;
        }

        /* =========================================
           INTRO
        ========================================= */

        .gastro-intro {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 25px;
          margin-bottom: 55px;
        }

        .gastro-intro-content,
        .gastro-intro-side {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .gastro-intro-content h2 {
          margin: 0 0 14px;
          color: #173550;
          font-size: 27px;
        }

        .gastro-intro-content p {
          margin: 0 0 13px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.8;
        }

        .gastro-intro-content p:last-child {
          margin-bottom: 0;
        }

        .gastro-intro-side {
          background:
            linear-gradient(
              145deg,
              #eaf8f8,
              #ffffff
            );
        }

        .gastro-intro-side h3 {
          margin: 0 0 18px;
          color: #173550;
          font-size: 20px;
        }

        .gastro-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .gastro-highlight:last-child {
          margin-bottom: 0;
        }

        .gastro-highlight-icon {
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

        .gastro-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #29465e;
          font-size: 13px;
        }

        .gastro-highlight span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================================
           CONDITIONS
        ========================================= */

        .gastro-conditions-section {
          margin-bottom: 60px;
        }

        .gastro-conditions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .gastro-condition {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
          padding: 23px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.04);
          transition: 0.25s ease;
        }

        .gastro-condition:hover {
          transform: translateY(-4px);
          border-color: #cfe4e6;
          box-shadow: 0 14px 30px rgba(30,60,80,0.08);
        }

        .gastro-condition-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 17px;
          border-radius: 12px;
          background: #eaf8f8;
          font-size: 24px;
        }

        .gastro-condition h3 {
          margin: 0 0 10px;
          color: #18364f;
          font-size: 17px;
        }

        .gastro-condition p {
          margin: 0;
          color: #71818e;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           SERVICES
        ========================================= */

        .gastro-services {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .gastro-service {
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

        .gastro-service::before {
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

        .gastro-service:hover {
          transform: translateY(-4px);
          border-color: #cfe4e6;
          box-shadow: 0 15px 35px rgba(30,60,80,0.09);
        }

        .gastro-service:hover::before {
          transform: scaleY(1);
        }

        .gastro-service-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 17px;
        }

        .gastro-service-icon {
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

        .gastro-service h3 {
          margin: 0;
          color: #18364f;
          font-size: 20px;
          line-height: 1.25;
        }

        .gastro-service p {
          margin: 0 0 18px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .gastro-feature-title {
          margin-bottom: 11px;
          color: #334d62;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .gastro-feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .gastro-feature-list li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5d7282;
          font-size: 12px;
        }

        .gastro-check {
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
           SYMPTOMS
        ========================================= */

        .gastro-symptoms-section {
          margin-top: 60px;
        }

        .gastro-symptoms-box {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .gastro-symptoms-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px 25px;
        }

        .gastro-symptom {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px;
          background: #f7fafc;
          border-radius: 8px;
          color: #526a7a;
          font-size: 13px;
        }

        .gastro-symptom-check {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e5f7f5;
          color: #159c9d;
          font-weight: 800;
        }

        /* =========================================
           DIAGNOSTICS
        ========================================= */

        .gastro-diagnostics-section {
          margin-top: 60px;
        }

        .gastro-diagnostics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .gastro-diagnostic {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
          padding: 25px;
          text-align: center;
        }

        .gastro-diagnostic-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          border-radius: 50%;
          background: #e8f7f7;
          color: #159c9d;
          font-size: 12px;
          font-weight: 800;
        }

        .gastro-diagnostic h3 {
          margin: 0 0 9px;
          color: #29465e;
          font-size: 15px;
        }

        .gastro-diagnostic p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           CARE PROCESS
        ========================================= */

        .gastro-care-section {
          margin-top: 60px;
        }

        .gastro-care-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .gastro-care-step {
          padding: 28px 22px;
          text-align: center;
          border-right: 1px solid #edf1f3;
        }

        .gastro-care-step:last-child {
          border-right: none;
        }

        .gastro-step-number {
          width: 38px;
          height: 38px;
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

        .gastro-care-step h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 15px;
        }

        .gastro-care-step p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           PREVENTION
        ========================================= */

        .gastro-prevention {
          margin-top: 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }

        .gastro-prevention-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .gastro-prevention-card h2 {
          margin: 0 0 15px;
          color: #173550;
          font-size: 23px;
        }

        .gastro-prevention-card p {
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .gastro-prevention-list {
          padding: 0;
          margin: 18px 0 0;
          list-style: none;
        }

        .gastro-prevention-list li {
          display: flex;
          gap: 9px;
          margin-bottom: 12px;
          color: #607686;
          font-size: 13px;
        }

        .gastro-prevention-list span {
          color: #159c9d;
          font-weight: 800;
        }

        /* =========================================
           CTA
        ========================================= */

        .gastro-cta {
          margin-top: 55px;
          padding: 35px;
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

        .gastro-cta h2 {
          margin: 0 0 9px;
          font-size: 25px;
        }

        .gastro-cta p {
          max-width: 700px;
          margin: 0;
          color: #bcd1dd;
          font-size: 14px;
          line-height: 1.7;
        }

        .gastro-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .gastro-cta-button {
          min-height: 43px;
          padding: 0 18px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .gastro-cta-button.primary {
          border: 1px solid #159c9d;
          background: #159c9d;
          color: white;
        }

        .gastro-cta-button.primary:hover {
          background: #0e8183;
        }

        .gastro-cta-button.secondary {
          border: 1px solid #557587;
          background: transparent;
          color: white;
        }

        .gastro-cta-button.secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        /* =========================================
           EMERGENCY
        ========================================= */

        .gastro-emergency {
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

        .gastro-emergency-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .gastro-emergency-icon {
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

        .gastro-emergency h3 {
          margin: 0 0 5px;
          color: #991b1b;
          font-size: 17px;
        }

        .gastro-emergency p {
          margin: 0;
          color: #9f5b5b;
          font-size: 12px;
        }

        .gastro-emergency-button {
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

        .gastro-emergency-button:hover {
          background: #b91c1c;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 1000px) {
          .gastro-conditions {
            grid-template-columns: repeat(2, 1fr);
          }

          .gastro-diagnostics {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 900px) {
          .gastro-intro {
            grid-template-columns: 1fr;
          }

          .gastro-services {
            grid-template-columns: 1fr;
          }

          .gastro-care-box {
            grid-template-columns: repeat(2, 1fr);
          }

          .gastro-care-step:nth-child(2) {
            border-right: none;
          }

          .gastro-care-step:nth-child(-n + 2) {
            border-bottom: 1px solid #edf1f3;
          }

          .gastro-prevention {
            grid-template-columns: 1fr;
          }

          .gastro-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 600px) {
          .gastro-hero {
            padding: 55px 18px;
          }

          .gastro-hero h1 {
            font-size: 35px;
          }

          .gastro-hero p {
            font-size: 14px;
          }

          .gastro-container {
            width: 92%;
            padding: 40px 0 60px;
          }

          .gastro-section-heading h2 {
            font-size: 26px;
          }

          .gastro-intro-content,
          .gastro-intro-side {
            padding: 23px;
          }

          .gastro-conditions {
            grid-template-columns: 1fr;
          }

          .gastro-service {
            padding: 22px;
          }

          .gastro-symptoms-list {
            grid-template-columns: 1fr;
          }

          .gastro-diagnostics {
            grid-template-columns: 1fr;
          }

          .gastro-care-box {
            grid-template-columns: 1fr;
          }

          .gastro-care-step {
            border-right: none !important;
            border-bottom: 1px solid #edf1f3;
          }

          .gastro-care-step:last-child {
            border-bottom: none;
          }

          .gastro-cta {
            padding: 27px 22px;
          }

          .gastro-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .gastro-cta-button {
            width: 100%;
          }

          .gastro-emergency {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .gastro-emergency-button {
            width: 100%;
          }
        }
      `}</style>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="gastro-hero">
        <span className="gastro-hero-badge">
          Gastroenterology & Digestive Health
        </span>

        <h1>Gastroenterology Care</h1>

        <p>
          Comprehensive care for the digestive system, including the
          esophagus, stomach, intestines, liver, gallbladder, and pancreas.
          Our specialists provide evaluation, diagnosis, treatment,
          prevention, and long-term digestive health management.
        </p>

        <div className="gastro-hero-actions">
          <button
            className="gastro-hero-button primary"
            onClick={() => navigate("/finddoctors")}
          >
            Find a Gastroenterologist
          </button>

          <button
            className="gastro-hero-button secondary"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </section>

      <main className="gastro-container">

        {/* =========================================
            INTRODUCTION
        ========================================= */}

        <section className="gastro-intro">
          <div className="gastro-intro-content">
            <h2>Comprehensive Digestive Health Care</h2>

            <p>
              Gastroenterology is the medical specialty focused on the
              digestive system and the organs responsible for digestion,
              nutrient absorption, and waste elimination.
            </p>

            <p>
              The digestive system includes the esophagus, stomach,
              small intestine, large intestine, rectum, anus, liver,
              gallbladder, and pancreas. Problems affecting these organs
              can cause symptoms ranging from occasional discomfort to
              complex long-term conditions.
            </p>

            <p>
              At MediCo, our gastroenterology services are designed to
              provide comprehensive assessment, appropriate diagnostic
              testing, individualized treatment, and continued follow-up
              care.
            </p>

            <p>
              Our specialists can help patients understand digestive
              symptoms and determine whether additional evaluation,
              lifestyle changes, medication, procedures, or long-term
              monitoring may be appropriate.
            </p>
          </div>

          <div className="gastro-intro-side">
            <h3>Digestive Health Includes</h3>

            <div className="gastro-highlight">
              <div className="gastro-highlight-icon">🫃</div>

              <div>
                <strong>Stomach & Intestines</strong>

                <span>
                  Evaluation and treatment of common and complex digestive
                  disorders.
                </span>
              </div>
            </div>

            <div className="gastro-highlight">
              <div className="gastro-highlight-icon">🧡</div>

              <div>
                <strong>Liver & Gallbladder</strong>

                <span>
                  Assessment of liver diseases, gallstones, and related
                  digestive conditions.
                </span>
              </div>
            </div>

            <div className="gastro-highlight">
              <div className="gastro-highlight-icon">🔬</div>

              <div>
                <strong>Diagnostic Procedures</strong>

                <span>
                  Endoscopy, colonoscopy, laboratory testing, and imaging
                  when clinically appropriate.
                </span>
              </div>
            </div>

            <div className="gastro-highlight">
              <div className="gastro-highlight-icon">❤️</div>

              <div>
                <strong>Preventive Care</strong>

                <span>
                  Screening, lifestyle guidance, monitoring, and long-term
                  digestive health support.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CONDITIONS
        ========================================= */}

        <section className="gastro-conditions-section">
          <div className="gastro-section-heading">
            <h2>Digestive Conditions We Treat</h2>

            <p>
              Gastroenterology covers a wide range of conditions involving
              the digestive tract and related organs.
            </p>
          </div>

          <div className="gastro-conditions">
            {digestiveConditions.map((condition) => (
              <article
                className="gastro-condition"
                key={condition.title}
              >
                <div className="gastro-condition-icon">
                  {condition.icon}
                </div>

                <h3>{condition.title}</h3>

                <p>{condition.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================
            SERVICES
        ========================================= */}

        <section>
          <div className="gastro-section-heading">
            <h2>Gastroenterology Services</h2>

            <p>
              Explore the range of digestive health services available
              through the MediCo healthcare network.
            </p>
          </div>

          <div className="gastro-services">
            {gastroServices.map((service) => (
              <article
                className="gastro-service"
                key={service.title}
              >
                <div className="gastro-service-top">
                  <div className="gastro-service-icon">
                    {service.icon}
                  </div>

                  <h3>{service.title}</h3>
                </div>

                <p>{service.description}</p>

                <div className="gastro-feature-title">
                  Care Includes
                </div>

                <ul className="gastro-feature-list">
                  {service.features.map((feature) => (
                    <li key={feature}>
                      <span className="gastro-check">✓</span>

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

        <section className="gastro-symptoms-section">
          <div className="gastro-section-heading">
            <h2>Common Digestive Symptoms</h2>

            <p>
              Persistent or concerning digestive symptoms may require
              medical evaluation. Symptoms can have many different causes,
              so a specialist assessment may be appropriate.
            </p>
          </div>

          <div className="gastro-symptoms-box">
            <div className="gastro-symptoms-list">
              {symptoms.map((symptom) => (
                <div
                  className="gastro-symptom"
                  key={symptom}
                >
                  <span className="gastro-symptom-check">
                    ✓
                  </span>

                  {symptom}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            DIAGNOSIS
        ========================================= */}

        <section className="gastro-diagnostics-section">
          <div className="gastro-section-heading">
            <h2>How Digestive Conditions Are Evaluated</h2>

            <p>
              Depending on symptoms and medical history, your doctor may
              recommend one or more diagnostic approaches.
            </p>
          </div>

          <div className="gastro-diagnostics">
            <div className="gastro-diagnostic">
              <div className="gastro-diagnostic-number">
                01
              </div>

              <h3>Medical Consultation</h3>

              <p>
                Review of symptoms, medical history, medications,
                lifestyle, and family history.
              </p>
            </div>

            <div className="gastro-diagnostic">
              <div className="gastro-diagnostic-number">
                02
              </div>

              <h3>Laboratory Tests</h3>

              <p>
                Blood, stool, or other laboratory tests may help evaluate
                digestive and liver-related problems.
              </p>
            </div>

            <div className="gastro-diagnostic">
              <div className="gastro-diagnostic-number">
                03
              </div>

              <h3>Endoscopy & Imaging</h3>

              <p>
                Endoscopy, ultrasound, CT, MRI, or other imaging may be
                recommended when appropriate.
              </p>
            </div>

            <div className="gastro-diagnostic">
              <div className="gastro-diagnostic-number">
                04
              </div>

              <h3>Biopsy & Further Testing</h3>

              <p>
                Tissue sampling or additional investigations may be used
                when a more detailed diagnosis is required.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            CARE JOURNEY
        ========================================= */}

        <section className="gastro-care-section">
          <div className="gastro-section-heading">
            <h2>Your Gastroenterology Care Journey</h2>

            <p>
              A structured approach helps patients move from evaluation
              to diagnosis, treatment, and continued digestive health care.
            </p>
          </div>

          <div className="gastro-care-box">
            <div className="gastro-care-step">
              <div className="gastro-step-number">
                01
              </div>

              <h3>Consultation</h3>

              <p>
                Discuss your symptoms, medical history, lifestyle,
                medications, and concerns with a specialist.
              </p>
            </div>

            <div className="gastro-care-step">
              <div className="gastro-step-number">
                02
              </div>

              <h3>Evaluation</h3>

              <p>
                Appropriate examinations, laboratory tests, imaging,
                or endoscopic procedures may be considered.
              </p>
            </div>

            <div className="gastro-care-step">
              <div className="gastro-step-number">
                03
              </div>

              <h3>Treatment</h3>

              <p>
                Receive an individualized care plan based on the
                underlying condition and healthcare needs.
              </p>
            </div>

            <div className="gastro-care-step">
              <div className="gastro-step-number">
                04
              </div>

              <h3>Follow-Up</h3>

              <p>
                Continued monitoring, lifestyle guidance, screening,
                and follow-up care when required.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            PREVENTION
        ========================================= */}

        <section className="gastro-prevention">
          <div className="gastro-prevention-card">
            <h2>Digestive Health & Prevention</h2>

            <p>
              Maintaining healthy daily habits can support digestive
              health. Preventive care is especially important for people
              with persistent symptoms, family history, or known digestive
              conditions.
            </p>

            <ul className="gastro-prevention-list">
              <li>
                <span>✓</span>
                Maintain a balanced and varied diet.
              </li>

              <li>
                <span>✓</span>
                Stay physically active according to your health needs.
              </li>

              <li>
                <span>✓</span>
                Maintain appropriate hydration.
              </li>

              <li>
                <span>✓</span>
                Avoid smoking and limit alcohol consumption.
              </li>

              <li>
                <span>✓</span>
                Follow recommended screening and medical checkups.
              </li>
            </ul>
          </div>

          <div className="gastro-prevention-card">
            <h2>When to See a Specialist</h2>

            <p>
              Consider discussing persistent or recurring digestive
              symptoms with a healthcare professional, particularly when
              symptoms interfere with daily activities or are accompanied
              by concerning changes.
            </p>

            <ul className="gastro-prevention-list">
              <li>
                <span>✓</span>
                Symptoms continue despite basic measures.
              </li>

              <li>
                <span>✓</span>
                Repeated abdominal discomfort or digestive problems occur.
              </li>

              <li>
                <span>✓</span>
                There are unexplained changes in bowel habits.
              </li>

              <li>
                <span>✓</span>
                There is unexplained weight loss or persistent fatigue.
              </li>

              <li>
                <span>✓</span>
                Your doctor recommends specialist evaluation or screening.
              </li>
            </ul>
          </div>
        </section>

        {/* =========================================
            CTA
        ========================================= */}

        <section className="gastro-cta">
          <div>
            <h2>Need Digestive Health Care?</h2>

            <p>
              Connect with a qualified gastroenterologist to discuss
              digestive symptoms, diagnostic options, treatment, and
              preventive care.
            </p>
          </div>

          <div className="gastro-cta-actions">
            <button
              className="gastro-cta-button primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Doctor
            </button>

            <button
              className="gastro-cta-button secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </section>

        {/* =========================================
            EMERGENCY
        ========================================= */}

        <section className="gastro-emergency">
          <div className="gastro-emergency-content">
            <div className="gastro-emergency-icon">
              🚑
            </div>

            <div>
              <h3>Medical Emergency?</h3>

              <p>
                Severe abdominal pain, significant bleeding, repeated
                vomiting, fainting, or other serious symptoms may require
                immediate medical attention.
              </p>
            </div>
          </div>

          <button
            className="gastro-emergency-button"
            onClick={() => navigate("/services/emergency")}
          >
            Emergency Services
          </button>
        </section>

      </main>
    </div>
  );
}
