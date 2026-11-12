import React from "react";
import { useNavigate } from "react-router-dom";

export default function MaternityCarePage() {
  const navigate = useNavigate();

  const maternityServices = [
    {
      title: "Antenatal Care",
      icon: "🤰",
      description:
        "Comprehensive pregnancy care designed to monitor the health of the mother and baby throughout pregnancy and identify potential concerns early.",
      features: [
        "Regular pregnancy checkups",
        "Maternal health monitoring",
        "Fetal growth monitoring",
        "Pregnancy screening",
      ],
    },
    {
      title: "High-Risk Pregnancy Care",
      icon: "❤️",
      description:
        "Specialized care for pregnancies that require closer monitoring because of maternal health conditions, pregnancy complications, or other risk factors.",
      features: [
        "High-risk assessment",
        "Specialist monitoring",
        "Pregnancy complication management",
        "Individualized care plans",
      ],
    },
    {
      title: "Normal Delivery Care",
      icon: "👶",
      description:
        "Supportive maternity care for vaginal delivery, including monitoring of the mother and baby throughout labor and delivery.",
      features: [
        "Labor monitoring",
        "Fetal monitoring",
        "Pain management support",
        "Post-delivery observation",
      ],
    },
    {
      title: "Cesarean Delivery",
      icon: "🏥",
      description:
        "Planned and emergency cesarean delivery services when surgical delivery is recommended for the safety of the mother or baby.",
      features: [
        "Cesarean evaluation",
        "Planned C-section",
        "Emergency C-section",
        "Post-operative care",
      ],
    },
    {
      title: "Postnatal Care",
      icon: "💗",
      description:
        "Care and support for mothers after delivery, focusing on recovery, breastfeeding, nutrition, emotional wellbeing, and newborn care.",
      features: [
        "Mother's recovery",
        "Breastfeeding guidance",
        "Postpartum assessment",
        "Newborn care education",
      ],
    },
    {
      title: "Newborn Care",
      icon: "🍼",
      description:
        "Essential care for newborn babies including initial assessment, feeding support, monitoring, and guidance for parents.",
      features: [
        "Newborn assessment",
        "Feeding support",
        "Growth monitoring",
        "Parent education",
      ],
    },
  ];

  const pregnancyStages = [
    {
      number: "01",
      title: "First Trimester",
      description:
        "The early stage of pregnancy when the pregnancy is confirmed, initial assessments are performed, and important developmental changes begin.",
    },
    {
      number: "02",
      title: "Second Trimester",
      description:
        "A period of continued fetal growth and development with routine antenatal visits and recommended pregnancy screening.",
    },
    {
      number: "03",
      title: "Third Trimester",
      description:
        "The final stage of pregnancy focused on monitoring maternal and fetal wellbeing and preparing for labor and delivery.",
    },
    {
      number: "04",
      title: "Delivery & Recovery",
      description:
        "Care during labor and delivery followed by monitoring, recovery support, breastfeeding guidance, and newborn care.",
    },
  ];

  const antenatalChecks = [
    "Blood pressure monitoring",
    "Weight and nutritional assessment",
    "Fetal growth monitoring",
    "Routine blood investigations",
    "Urine testing when recommended",
    "Pregnancy ultrasound when indicated",
    "Screening for pregnancy-related conditions",
    "Discussion of symptoms and concerns",
  ];

  const warningSigns = [
    "Heavy vaginal bleeding",
    "Severe abdominal or pelvic pain",
    "Severe headache or vision changes",
    "Sudden swelling of the face or hands",
    "Fluid leakage from the vagina",
    "Reduced or unusual fetal movement later in pregnancy",
    "Difficulty breathing or chest pain",
    "Fever or feeling seriously unwell",
  ];

  return (
    <div className="maternity-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .maternity-page {
          min-height: 100vh;
          background: #f8fafc;
          color: #243b53;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }

        .maternity-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .maternity-hero {
          position: relative;
          overflow: hidden;
          padding: 78px 20px;
          text-align: center;
          color: white;
          background:
            linear-gradient(
              135deg,
              #9f315f 0%,
              #c05278 48%,
              #8f477e 100%
            );
        }

        .maternity-hero::before {
          content: "";
          position: absolute;
          width: 320px;
          height: 320px;
          top: -170px;
          left: -100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }

        .maternity-hero::after {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          right: -120px;
          bottom: -180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }

        .maternity-hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: auto;
        }

        .maternity-hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 15px;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 30px;
          background: rgba(255,255,255,0.10);
          color: #ffe9f1;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .maternity-hero h1 {
          margin: 18px 0 15px;
          font-size: clamp(36px, 5vw, 54px);
          font-weight: 800;
          line-height: 1.1;
        }

        .maternity-hero p {
          max-width: 780px;
          margin: 0 auto;
          color: #ffe9f1;
          font-size: 16px;
          line-height: 1.8;
        }

        .maternity-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .maternity-hero-button {
          min-height: 45px;
          padding: 0 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .maternity-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #a03360;
        }

        .maternity-hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.16);
        }

        .maternity-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.6);
          background: transparent;
          color: white;
        }

        .maternity-hero-button.secondary:hover {
          background: rgba(255,255,255,0.12);
        }

        /* =========================================
           MAIN CONTAINER
        ========================================= */

        .maternity-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 55px 0 80px;
        }

        .maternity-section-heading {
          text-align: center;
          margin-bottom: 40px;
        }

        .maternity-section-heading span {
          display: block;
          margin-bottom: 8px;
          color: #b13e69;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.3px;
          text-transform: uppercase;
        }

        .maternity-section-heading h2 {
          margin: 0 0 12px;
          color: #263f56;
          font-size: 30px;
          font-weight: 800;
        }

        .maternity-section-heading p {
          max-width: 760px;
          margin: 0 auto;
          color: #748493;
          font-size: 15px;
          line-height: 1.8;
        }

        /* =========================================
           INTRO
        ========================================= */

        .maternity-intro {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 25px;
          margin-bottom: 60px;
        }

        .maternity-intro-content,
        .maternity-intro-side {
          padding: 32px;
          background: white;
          border: 1px solid #e6eaf0;
          border-radius: 16px;
          box-shadow: 0 7px 25px rgba(40,60,80,0.045);
        }

        .maternity-intro-content h2 {
          margin: 0 0 15px;
          color: #263f56;
          font-size: 27px;
        }

        .maternity-intro-content p {
          margin: 0 0 14px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.85;
        }

        .maternity-intro-content p:last-child {
          margin-bottom: 0;
        }

        .maternity-intro-side {
          background: linear-gradient(
            145deg,
            #fff0f5,
            #ffffff
          );
        }

        .maternity-intro-side h3 {
          margin: 0 0 20px;
          color: #263f56;
          font-size: 20px;
        }

        .maternity-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 17px;
        }

        .maternity-highlight:last-child {
          margin-bottom: 0;
        }

        .maternity-highlight-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #ffe4ed;
          font-size: 17px;
        }

        .maternity-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #324b60;
          font-size: 13px;
        }

        .maternity-highlight span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.55;
        }

        /* =========================================
           SERVICES
        ========================================= */

        .maternity-services {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .maternity-service {
          position: relative;
          overflow: hidden;
          padding: 27px;
          background: white;
          border: 1px solid #e5eaf0;
          border-radius: 15px;
          box-shadow: 0 7px 25px rgba(40,60,80,0.045);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .maternity-service::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
          background: #c05278;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.25s ease;
        }

        .maternity-service:hover {
          transform: translateY(-4px);
          border-color: #efc8d5;
          box-shadow: 0 15px 35px rgba(40,60,80,0.09);
        }

        .maternity-service:hover::before {
          transform: scaleY(1);
        }

        .maternity-service-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 17px;
        }

        .maternity-service-icon {
          width: 62px;
          height: 62px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: #fff0f5;
          font-size: 29px;
        }

        .maternity-service h3 {
          margin: 0;
          color: #293f53;
          font-size: 20px;
          line-height: 1.25;
        }

        .maternity-service p {
          margin: 0 0 18px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .maternity-feature-title {
          margin-bottom: 11px;
          color: #344c60;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .maternity-feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .maternity-feature-list li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #607484;
          font-size: 12px;
        }

        .maternity-check {
          width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #ffe7ef;
          color: #b13e69;
          font-size: 9px;
          font-weight: 800;
        }

        /* =========================================
           PREGNANCY STAGES
        ========================================= */

        .maternity-stages-section {
          margin-top: 65px;
        }

        .maternity-stages {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: white;
          border: 1px solid #e5eaf0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(40,60,80,0.045);
        }

        .maternity-stage {
          padding: 29px 22px;
          text-align: center;
          border-right: 1px solid #edf0f3;
        }

        .maternity-stage:last-child {
          border-right: none;
        }

        .maternity-stage-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          border-radius: 50%;
          background: #ffe7ef;
          color: #b13e69;
          font-size: 12px;
          font-weight: 800;
        }

        .maternity-stage h3 {
          margin: 0 0 9px;
          color: #30495e;
          font-size: 15px;
        }

        .maternity-stage p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.65;
        }

        /* =========================================
           ANTENATAL CARE
        ========================================= */

        .maternity-antenatal {
          margin-top: 65px;
        }

        .maternity-antenatal-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 25px;
        }

        .maternity-antenatal-info {
          padding: 32px;
          border-radius: 16px;
          color: white;
          background: linear-gradient(
            145deg,
            #873d62,
            #b44d73
          );
        }

        .maternity-antenatal-info h3 {
          margin: 0 0 15px;
          font-size: 24px;
        }

        .maternity-antenatal-info p {
          margin: 0;
          color: #ffe7ef;
          font-size: 13px;
          line-height: 1.8;
        }

        .maternity-antenatal-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .maternity-antenatal-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 17px;
          background: white;
          border: 1px solid #e5eaf0;
          border-radius: 10px;
          color: #596e7e;
          font-size: 12px;
          box-shadow: 0 5px 18px rgba(40,60,80,0.035);
        }

        .maternity-antenatal-item span {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #ffe7ef;
          color: #b13e69;
          font-size: 10px;
          font-weight: 800;
        }

        /* =========================================
           DELIVERY CARE
        ========================================= */

        .maternity-delivery-section {
          margin-top: 65px;
        }

        .maternity-delivery-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .maternity-delivery-card {
          padding: 30px;
          background: white;
          border: 1px solid #e5eaf0;
          border-radius: 15px;
          box-shadow: 0 7px 25px rgba(40,60,80,0.045);
        }

        .maternity-delivery-card-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          border-radius: 12px;
          background: #fff0f5;
          font-size: 24px;
        }

        .maternity-delivery-card h3 {
          margin: 0 0 12px;
          color: #2d465b;
          font-size: 20px;
        }

        .maternity-delivery-card p {
          margin: 0;
          color: #6d7f8d;
          font-size: 13px;
          line-height: 1.75;
        }

        /* =========================================
           POSTNATAL
        ========================================= */

        .maternity-postnatal {
          margin-top: 65px;
          padding: 45px 35px;
          border-radius: 17px;
          background: #fff5f8;
          border: 1px solid #f3dbe4;
        }

        .maternity-postnatal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-top: 30px;
        }

        .maternity-postnatal-card {
          padding: 23px;
          background: white;
          border-radius: 12px;
          border: 1px solid #f0e3e8;
        }

        .maternity-postnatal-card h3 {
          margin: 0 0 9px;
          color: #334b5e;
          font-size: 16px;
        }

        .maternity-postnatal-card p {
          margin: 0;
          color: #72818e;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           WARNING SIGNS
        ========================================= */

        .maternity-warning {
          margin-top: 65px;
        }

        .maternity-warning-box {
          padding: 30px;
          border: 1px solid #fee2e2;
          border-radius: 16px;
          background: #fff7f7;
        }

        .maternity-warning-box h3 {
          margin: 0 0 8px;
          color: #991b1b;
          font-size: 21px;
        }

        .maternity-warning-box > p {
          margin: 0 0 23px;
          color: #9a6262;
          font-size: 13px;
          line-height: 1.7;
        }

        .maternity-warning-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px 30px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .maternity-warning-list li {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #7b5555;
          font-size: 12px;
        }

        .maternity-warning-list li span {
          width: 21px;
          height: 21px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #fee2e2;
          color: #dc2626;
          font-size: 10px;
          font-weight: 800;
        }

        /* =========================================
           CTA
        ========================================= */

        .maternity-cta {
          margin-top: 55px;
          padding: 38px;
          border-radius: 17px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #6d2d50,
              #9f3e65
            );
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .maternity-cta h2 {
          margin: 0 0 9px;
          font-size: 26px;
        }

        .maternity-cta p {
          max-width: 700px;
          margin: 0;
          color: #f6dce7;
          font-size: 14px;
          line-height: 1.7;
        }

        .maternity-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .maternity-cta-button {
          min-height: 44px;
          padding: 0 19px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .maternity-cta-button.primary {
          border: 1px solid white;
          background: white;
          color: #94395f;
        }

        .maternity-cta-button.primary:hover {
          transform: translateY(-2px);
        }

        .maternity-cta-button.secondary {
          border: 1px solid rgba(255,255,255,0.5);
          background: transparent;
          color: white;
        }

        .maternity-cta-button.secondary:hover {
          background: rgba(255,255,255,0.1);
        }

        /* =========================================
           EMERGENCY
        ========================================= */

        .maternity-emergency {
          margin-top: 22px;
          padding: 25px 30px;
          border: 1px solid #fee2e2;
          border-radius: 14px;
          background: #fff5f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .maternity-emergency-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .maternity-emergency-icon {
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

        .maternity-emergency h3 {
          margin: 0 0 5px;
          color: #991b1b;
          font-size: 17px;
        }

        .maternity-emergency p {
          margin: 0;
          color: #9f5b5b;
          font-size: 12px;
        }

        .maternity-emergency-button {
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

        .maternity-emergency-button:hover {
          background: #b91c1c;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 950px) {
          .maternity-intro {
            grid-template-columns: 1fr;
          }

          .maternity-services {
            grid-template-columns: 1fr;
          }

          .maternity-stages {
            grid-template-columns: repeat(2, 1fr);
          }

          .maternity-stage:nth-child(2) {
            border-right: none;
          }

          .maternity-stage:nth-child(-n + 2) {
            border-bottom: 1px solid #edf0f3;
          }

          .maternity-antenatal-grid {
            grid-template-columns: 1fr;
          }

          .maternity-postnatal-grid {
            grid-template-columns: 1fr;
          }

          .maternity-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 650px) {
          .maternity-hero {
            padding: 58px 18px;
          }

          .maternity-hero h1 {
            font-size: 36px;
          }

          .maternity-hero p {
            font-size: 14px;
          }

          .maternity-container {
            width: 92%;
            padding: 40px 0 60px;
          }

          .maternity-section-heading h2 {
            font-size: 26px;
          }

          .maternity-intro-content,
          .maternity-intro-side {
            padding: 24px;
          }

          .maternity-service {
            padding: 23px;
          }

          .maternity-stages {
            grid-template-columns: 1fr;
          }

          .maternity-stage {
            border-right: none !important;
            border-bottom: 1px solid #edf0f3;
          }

          .maternity-stage:last-child {
            border-bottom: none;
          }

          .maternity-antenatal-list {
            grid-template-columns: 1fr;
          }

          .maternity-delivery-grid {
            grid-template-columns: 1fr;
          }

          .maternity-postnatal {
            padding: 30px 22px;
          }

          .maternity-warning-list {
            grid-template-columns: 1fr;
          }

          .maternity-cta {
            padding: 28px 22px;
          }

          .maternity-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .maternity-cta-button {
            width: 100%;
          }

          .maternity-emergency {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .maternity-emergency-button {
            width: 100%;
          }
        }
      `}</style>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="maternity-hero">
        <div className="maternity-hero-content">
          <span className="maternity-hero-badge">
            Maternity & Women's Health
          </span>

          <h1>Complete Maternity Care</h1>

          <p>
            Compassionate, comprehensive care for mothers and babies
            throughout pregnancy, labor, delivery, recovery, and the
            early newborn period. Our maternity services are designed
            to support healthy pregnancies and informed family care.
          </p>

          <div className="maternity-hero-actions">
            <button
              className="maternity-hero-button primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find an Obstetrician
            </button>

            <button
              className="maternity-hero-button secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <main className="maternity-container">

        {/* =========================================
            INTRODUCTION
        ========================================= */}

        <section className="maternity-intro">
          <div className="maternity-intro-content">
            <h2>Comprehensive Pregnancy & Maternity Care</h2>

            <p>
              Maternity care includes medical support before, during,
              and after childbirth. Regular pregnancy care helps
              healthcare professionals monitor the wellbeing of both
              mother and baby and identify concerns that may require
              additional evaluation.
            </p>

            <p>
              At MediCo, maternity care can include antenatal
              consultations, pregnancy monitoring, management of
              pregnancy-related concerns, labor and delivery support,
              postnatal care, breastfeeding guidance, and newborn
              support.
            </p>

            <p>
              Every pregnancy is different. The frequency of visits,
              investigations, delivery planning, and treatment may
              depend on the mother's health, pregnancy history, stage
              of pregnancy, and individual medical needs.
            </p>
          </div>

          <div className="maternity-intro-side">
            <h3>Our Maternity Care Focus</h3>

            <div className="maternity-highlight">
              <div className="maternity-highlight-icon">
                🤰
              </div>

              <div>
                <strong>Healthy Pregnancy</strong>
                <span>
                  Regular monitoring and guidance throughout pregnancy.
                </span>
              </div>
            </div>

            <div className="maternity-highlight">
              <div className="maternity-highlight-icon">
                👩‍⚕️
              </div>

              <div>
                <strong>Specialist Support</strong>
                <span>
                  Access to obstetric and maternity healthcare
                  professionals.
                </span>
              </div>
            </div>

            <div className="maternity-highlight">
              <div className="maternity-highlight-icon">
                👶
              </div>

              <div>
                <strong>Mother & Baby Care</strong>
                <span>
                  Coordinated care for maternal and newborn wellbeing.
                </span>
              </div>
            </div>

            <div className="maternity-highlight">
              <div className="maternity-highlight-icon">
                💗
              </div>

              <div>
                <strong>Emotional Support</strong>
                <span>
                  Education and support for pregnancy, delivery, and
                  postpartum recovery.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SERVICES
        ========================================= */}

        <section>
          <div className="maternity-section-heading">
            <span>Maternity Services</span>

            <h2>Complete Care for Mother & Baby</h2>

            <p>
              Explore the maternity services available for pregnancy,
              delivery, postpartum recovery, and newborn care.
            </p>
          </div>

          <div className="maternity-services">
            {maternityServices.map((service) => (
              <article
                className="maternity-service"
                key={service.title}
              >
                <div className="maternity-service-top">
                  <div className="maternity-service-icon">
                    {service.icon}
                  </div>

                  <h3>{service.title}</h3>
                </div>

                <p>{service.description}</p>

                <div className="maternity-feature-title">
                  Care Includes
                </div>

                <ul className="maternity-feature-list">
                  {service.features.map((feature) => (
                    <li key={feature}>
                      <span className="maternity-check">
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
            PREGNANCY STAGES
        ========================================= */}

        <section className="maternity-stages-section">
          <div className="maternity-section-heading">
            <span>Pregnancy Journey</span>

            <h2>Understanding the Stages of Pregnancy</h2>

            <p>
              Pregnancy care changes as the pregnancy progresses.
              Regular appointments help monitor maternal and fetal
              wellbeing at each stage.
            </p>
          </div>

          <div className="maternity-stages">
            {pregnancyStages.map((stage) => (
              <div
                className="maternity-stage"
                key={stage.number}
              >
                <div className="maternity-stage-number">
                  {stage.number}
                </div>

                <h3>{stage.title}</h3>

                <p>{stage.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            ANTENATAL CARE
        ========================================= */}

        <section className="maternity-antenatal">
          <div className="maternity-section-heading">
            <span>Antenatal Care</span>

            <h2>Regular Pregnancy Monitoring</h2>

            <p>
              Antenatal care helps healthcare professionals monitor
              pregnancy and provide guidance based on the mother's
              individual health and pregnancy needs.
            </p>
          </div>

          <div className="maternity-antenatal-grid">
            <div className="maternity-antenatal-info">
              <h3>Why Antenatal Visits Matter</h3>

              <p>
                Regular pregnancy visits provide an opportunity to
                assess maternal health, monitor fetal development,
                discuss nutrition and lifestyle, perform recommended
                screening, and identify symptoms or conditions that
                may need additional attention.
              </p>

              <p style={{ marginTop: "15px" }}>
                The number and timing of visits and investigations can
                vary depending on pregnancy history, health conditions,
                and clinical recommendations.
              </p>
            </div>

            <div className="maternity-antenatal-list">
              {antenatalChecks.map((item) => (
                <div
                  className="maternity-antenatal-item"
                  key={item}
                >
                  <span>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            DELIVERY
        ========================================= */}

        <section className="maternity-delivery-section">
          <div className="maternity-section-heading">
            <span>Labor & Delivery</span>

            <h2>Delivery Care Options</h2>

            <p>
              Delivery planning is based on the mother's health,
              pregnancy progress, fetal wellbeing, previous pregnancy
              history, and clinical circumstances.
            </p>
          </div>

          <div className="maternity-delivery-grid">
            <div className="maternity-delivery-card">
              <div className="maternity-delivery-card-icon">
                👶
              </div>

              <h3>Vaginal Delivery</h3>

              <p>
                Vaginal delivery may be appropriate when pregnancy and
                labor progress normally and there are no medical
                reasons requiring surgical delivery. During labor,
                maternal and fetal wellbeing are monitored and
                appropriate support is provided.
              </p>
            </div>

            <div className="maternity-delivery-card">
              <div className="maternity-delivery-card-icon">
                🏥
              </div>

              <h3>Cesarean Delivery</h3>

              <p>
                A cesarean delivery involves delivering the baby through
                surgery. It may be planned or performed urgently when
                clinical circumstances make surgical delivery the
                safer option for the mother or baby.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            POSTNATAL CARE
        ========================================= */}

        <section className="maternity-postnatal">
          <div className="maternity-section-heading">
            <span>After Delivery</span>

            <h2>Postnatal & Newborn Care</h2>

            <p>
              Care continues after childbirth with attention to the
              mother's physical recovery, emotional wellbeing,
              breastfeeding, and newborn health.
            </p>
          </div>

          <div className="maternity-postnatal-grid">
            <div className="maternity-postnatal-card">
              <h3>Mother's Recovery</h3>

              <p>
                Post-delivery assessment can help monitor recovery,
                bleeding, pain, wound healing when applicable, and
                other postpartum concerns.
              </p>
            </div>

            <div className="maternity-postnatal-card">
              <h3>Breastfeeding Support</h3>

              <p>
                Mothers can receive guidance on breastfeeding,
                positioning, feeding frequency, and common early
                feeding concerns.
              </p>
            </div>

            <div className="maternity-postnatal-card">
              <h3>Emotional Wellbeing</h3>

              <p>
                Emotional changes can occur after childbirth.
                Healthcare professionals can provide support and
                recommend further evaluation when needed.
              </p>
            </div>

            <div className="maternity-postnatal-card">
              <h3>Newborn Assessment</h3>

              <p>
                Newborn care includes appropriate assessment,
                monitoring, feeding support, and guidance for parents.
              </p>
            </div>

            <div className="maternity-postnatal-card">
              <h3>Nutrition & Recovery</h3>

              <p>
                Mothers can receive advice regarding nutrition,
                hydration, rest, activity, and recovery following
                childbirth.
              </p>
            </div>

            <div className="maternity-postnatal-card">
              <h3>Follow-Up Care</h3>

              <p>
                Follow-up visits help assess maternal recovery,
                newborn wellbeing, breastfeeding, and ongoing
                healthcare needs.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            WARNING SIGNS
        ========================================= */}

        <section className="maternity-warning">
          <div className="maternity-section-heading">
            <span>Important Information</span>

            <h2>Pregnancy Warning Signs</h2>

            <p>
              Some symptoms during pregnancy or after delivery require
              prompt medical evaluation.
            </p>
          </div>

          <div className="maternity-warning-box">
            <h3>Seek Medical Attention for Concerning Symptoms</h3>

            <p>
              If you experience severe, sudden, or concerning symptoms
              during pregnancy or after delivery, contact your
              healthcare provider or seek urgent medical attention.
            </p>

            <ul className="maternity-warning-list">
              {warningSigns.map((sign) => (
                <li key={sign}>
                  <span>!</span>
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =========================================
            CTA
        ========================================= */}

        <section className="maternity-cta">
          <div>
            <h2>Planning Your Pregnancy Care?</h2>

            <p>
              Connect with a qualified maternity healthcare
              professional to discuss pregnancy care, delivery
              planning, or postpartum support.
            </p>
          </div>

          <div className="maternity-cta-actions">
            <button
              className="maternity-cta-button primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Doctor
            </button>

            <button
              className="maternity-cta-button secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </section>

        {/* =========================================
            EMERGENCY
        ========================================= */}

        <section className="maternity-emergency">
          <div className="maternity-emergency-content">
            <div className="maternity-emergency-icon">
              🚑
            </div>

            <div>
              <h3>Pregnancy or Maternity Emergency?</h3>

              <p>
                For severe bleeding, severe pain, breathing difficulty,
                loss of consciousness, or another serious emergency,
                seek immediate medical attention.
              </p>
            </div>
          </div>

          <button
            className="maternity-emergency-button"
            onClick={() => navigate("/services/emergency")}
          >
            Emergency Services
          </button>
        </section>

      </main>
    </div>
  );
}
