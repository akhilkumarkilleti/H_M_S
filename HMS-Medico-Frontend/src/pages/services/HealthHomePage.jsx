import React from "react";
import { useNavigate } from "react-router-dom";

export default function HealthHomePage() {
  const navigate = useNavigate();

  const homeServices = [
    {
      icon: "👨‍⚕️",
      title: "Doctor Home Visits",
      description:
        "Consult qualified doctors from the comfort of your home for medical evaluation, treatment advice, follow-up care, and routine health concerns.",
      features: [
        "General physician visits",
        "Medical assessment",
        "Treatment guidance",
        "Follow-up consultation",
      ],
    },
    {
      icon: "👩‍⚕️",
      title: "Home Nursing Care",
      description:
        "Professional nursing support at home for patients who require regular monitoring, wound care, medication assistance, or recovery support.",
      features: [
        "Skilled nursing",
        "Wound dressing",
        "Vital monitoring",
        "Medication assistance",
      ],
    },
    {
      icon: "🧑‍🦽",
      title: "Physiotherapy at Home",
      description:
        "Personalized physiotherapy sessions at home to support mobility, strength, rehabilitation, and recovery after injury or surgery.",
      features: [
        "Mobility exercises",
        "Post-surgical rehabilitation",
        "Pain management",
        "Strength training",
      ],
    },
    {
      icon: "👵",
      title: "Elderly Care",
      description:
        "Dedicated home-based support for senior citizens, helping them manage daily healthcare needs while maintaining comfort and independence.",
      features: [
        "Senior health monitoring",
        "Daily activity support",
        "Medication reminders",
        "Regular health checks",
      ],
    },
    {
      icon: "🏥",
      title: "Post-Surgical Care",
      description:
        "Structured recovery support at home following surgery, helping patients manage wound care, medications, mobility, and follow-up requirements.",
      features: [
        "Post-operative monitoring",
        "Wound care",
        "Medication support",
        "Recovery guidance",
      ],
    },
    {
      icon: "💊",
      title: "Medication Support",
      description:
        "Home-based assistance for patients who need help following prescribed medication schedules and managing routine treatment requirements.",
      features: [
        "Medication reminders",
        "Prescription guidance",
        "Treatment schedule support",
        "Caregiver assistance",
      ],
    },
    {
      icon: "🔬",
      title: "Home Diagnostics",
      description:
        "Convenient diagnostic sample collection at home for selected laboratory investigations, helping patients avoid unnecessary travel.",
      features: [
        "Sample collection",
        "Routine laboratory tests",
        "Health monitoring",
        "Digital report access",
      ],
    },
    {
      icon: "🩺",
      title: "Chronic Disease Care",
      description:
        "Ongoing home healthcare support for patients managing long-term conditions that require regular monitoring and coordinated care.",
      features: [
        "Health monitoring",
        "Regular assessments",
        "Treatment support",
        "Care coordination",
      ],
    },
    {
      icon: "🫁",
      title: "Respiratory Care",
      description:
        "Home-based support for patients requiring respiratory monitoring, prescribed respiratory therapies, and assistance during recovery.",
      features: [
        "Respiratory monitoring",
        "Oxygen support guidance",
        "Breathing exercises",
        "Recovery support",
      ],
    },
    {
      icon: "❤️",
      title: "Cardiac Home Care",
      description:
        "Supportive home healthcare for selected cardiac patients following hospital treatment or during ongoing recovery and monitoring.",
      features: [
        "Vital monitoring",
        "Recovery support",
        "Lifestyle guidance",
        "Follow-up coordination",
      ],
    },
    {
      icon: "🧠",
      title: "Neurological Home Care",
      description:
        "Home-based assistance for patients recovering from neurological conditions, including mobility support and coordinated rehabilitation.",
      features: [
        "Neurological monitoring",
        "Mobility support",
        "Rehabilitation",
        "Caregiver guidance",
      ],
    },
    {
      icon: "🧑‍🍼",
      title: "Mother & Baby Care",
      description:
        "Postnatal support at home for mothers and newborns, including basic health monitoring, recovery assistance, and care guidance.",
      features: [
        "Postnatal support",
        "Mother care",
        "Newborn care guidance",
        "Feeding support",
      ],
    },
  ];

  const benefits = [
    {
      icon: "🏠",
      title: "Care at Home",
      text: "Receive appropriate healthcare support without unnecessary hospital visits.",
    },
    {
      icon: "👨‍⚕️",
      title: "Qualified Professionals",
      text: "Connect with healthcare professionals based on your individual care requirements.",
    },
    {
      icon: "🕐",
      title: "Flexible Scheduling",
      text: "Arrange home visits and services according to availability and patient needs.",
    },
    {
      icon: "❤️",
      title: "Patient-Centered Care",
      text: "Care plans are designed around comfort, safety, recovery, and individual needs.",
    },
  ];

  const careJourney = [
    {
      number: "01",
      title: "Request Care",
      text: "Tell us about your healthcare needs and the type of home service you require.",
    },
    {
      number: "02",
      title: "Care Assessment",
      text: "Our healthcare team reviews your requirements and identifies suitable services.",
    },
    {
      number: "03",
      title: "Schedule Visit",
      text: "A suitable healthcare professional and visit schedule are arranged.",
    },
    {
      number: "04",
      title: "Receive Care",
      text: "Get appropriate healthcare support in the comfort and privacy of your home.",
    },
  ];

  return (
    <div className="health-home-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .health-home-page {
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

        .health-home-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .health-home-hero {
          position: relative;
          overflow: hidden;
          padding: 78px 20px 85px;
          text-align: center;
          color: white;
          background:
            linear-gradient(
              135deg,
              #075985 0%,
              #0284c7 48%,
              #0f766e 100%
            );
        }

        .health-home-hero::before {
          content: "";
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          top: -170px;
          left: -80px;
        }

        .health-home-hero::after {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          right: -100px;
          bottom: -150px;
        }

        .health-home-hero-content {
          position: relative;
          z-index: 1;
          max-width: 850px;
          margin: 0 auto;
        }

        .health-home-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 15px;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 30px;
          background: rgba(255,255,255,0.10);
          color: #e0f2fe;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .health-home-hero h1 {
          margin: 18px 0 15px;
          font-size: clamp(36px, 5vw, 54px);
          line-height: 1.1;
          font-weight: 800;
        }

        .health-home-hero p {
          max-width: 780px;
          margin: 0 auto;
          color: #e0f2fe;
          font-size: 16px;
          line-height: 1.8;
        }

        .health-home-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 29px;
        }

        .health-home-hero-button {
          min-height: 45px;
          padding: 0 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .health-home-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #0369a1;
        }

        .health-home-hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 9px 22px rgba(0,0,0,0.16);
        }

        .health-home-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.55);
          background: transparent;
          color: white;
        }

        .health-home-hero-button.secondary:hover {
          background: rgba(255,255,255,0.1);
        }

        /* =========================================
           CONTAINER
        ========================================= */

        .health-home-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 58px 0 80px;
        }

        /* =========================================
           SECTION HEADING
        ========================================= */

        .health-home-section-heading {
          margin-bottom: 40px;
          text-align: center;
        }

        .health-home-section-heading h2 {
          margin: 0 0 12px;
          color: #173550;
          font-size: 30px;
          font-weight: 800;
        }

        .health-home-section-heading p {
          max-width: 760px;
          margin: 0 auto;
          color: #738392;
          font-size: 15px;
          line-height: 1.8;
        }

        /* =========================================
           INTRO
        ========================================= */

        .health-home-intro {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 25px;
          margin-bottom: 58px;
        }

        .health-home-intro-content,
        .health-home-intro-side {
          padding: 31px;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          background: white;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .health-home-intro-content h2 {
          margin: 0 0 14px;
          color: #173550;
          font-size: 27px;
        }

        .health-home-intro-content p {
          margin: 0 0 13px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.8;
        }

        .health-home-intro-content p:last-child {
          margin-bottom: 0;
        }

        .health-home-intro-side {
          background: linear-gradient(
            145deg,
            #eaf8f8,
            #ffffff
          );
        }

        .health-home-intro-side h3 {
          margin: 0 0 19px;
          color: #173550;
          font-size: 20px;
        }

        .health-home-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 17px;
        }

        .health-home-highlight:last-child {
          margin-bottom: 0;
        }

        .health-home-highlight-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #dff4f3;
          font-size: 17px;
        }

        .health-home-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #29465e;
          font-size: 13px;
        }

        .health-home-highlight span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================================
           BENEFITS
        ========================================= */

        .health-home-benefits {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 17px;
          margin-bottom: 60px;
        }

        .health-home-benefit {
          padding: 24px 20px;
          text-align: center;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
          background: white;
          box-shadow: 0 7px 25px rgba(30,60,80,0.04);
          transition: all 0.25s ease;
        }

        .health-home-benefit:hover {
          transform: translateY(-4px);
          box-shadow: 0 13px 30px rgba(30,60,80,0.08);
        }

        .health-home-benefit-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 13px;
          border-radius: 13px;
          background: #eaf8f8;
          font-size: 25px;
        }

        .health-home-benefit h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 15px;
        }

        .health-home-benefit p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.65;
        }

        /* =========================================
           SERVICES
        ========================================= */

        .health-home-services {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .health-home-service {
          position: relative;
          overflow: hidden;
          padding: 27px;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          background: white;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .health-home-service::before {
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

        .health-home-service:hover {
          transform: translateY(-4px);
          border-color: #cfe4e6;
          box-shadow: 0 15px 35px rgba(30,60,80,0.09);
        }

        .health-home-service:hover::before {
          transform: scaleY(1);
        }

        .health-home-service-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 17px;
        }

        .health-home-service-icon {
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

        .health-home-service h3 {
          margin: 0;
          color: #18364f;
          font-size: 19px;
          line-height: 1.25;
        }

        .health-home-service p {
          margin: 0 0 18px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .health-home-feature-title {
          margin-bottom: 11px;
          color: #334d62;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .health-home-feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 9px 14px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .health-home-feature-list li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5d7282;
          font-size: 12px;
        }

        .health-home-check {
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
           WHO CAN BENEFIT
        ========================================= */

        .health-home-who {
          margin-top: 60px;
        }

        .health-home-who-box {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .health-home-who-card {
          padding: 25px;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
          background: white;
          box-shadow: 0 7px 25px rgba(30,60,80,0.04);
        }

        .health-home-who-card-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 13px;
          border-radius: 11px;
          background: #edf7fc;
          font-size: 22px;
        }

        .health-home-who-card h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 16px;
        }

        .health-home-who-card p {
          margin: 0;
          color: #738392;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           CARE JOURNEY
        ========================================= */

        .health-home-care-section {
          margin-top: 60px;
        }

        .health-home-care-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .health-home-care-step {
          padding: 29px 22px;
          text-align: center;
          border-right: 1px solid #edf1f3;
        }

        .health-home-care-step:last-child {
          border-right: none;
        }

        .health-home-step-number {
          width: 39px;
          height: 39px;
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

        .health-home-care-step h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 15px;
        }

        .health-home-care-step p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           CTA
        ========================================= */

        .health-home-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-top: 52px;
          padding: 36px;
          border-radius: 16px;
          color: white;
          background: linear-gradient(
            135deg,
            #102d45,
            #164b63
          );
        }

        .health-home-cta h2 {
          margin: 0 0 9px;
          font-size: 25px;
        }

        .health-home-cta p {
          max-width: 700px;
          margin: 0;
          color: #bcd1dd;
          font-size: 14px;
          line-height: 1.7;
        }

        .health-home-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .health-home-cta-button {
          min-height: 43px;
          padding: 0 19px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .health-home-cta-button.primary {
          border: 1px solid #159c9d;
          background: #159c9d;
          color: white;
        }

        .health-home-cta-button.primary:hover {
          background: #0e8183;
        }

        .health-home-cta-button.secondary {
          border: 1px solid #557587;
          background: transparent;
          color: white;
        }

        .health-home-cta-button.secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        /* =========================================
           EMERGENCY
        ========================================= */

        .health-home-emergency {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 22px;
          padding: 25px 30px;
          border: 1px solid #fee2e2;
          border-radius: 14px;
          background: #fff5f5;
        }

        .health-home-emergency-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .health-home-emergency-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: #fee2e2;
          font-size: 23px;
        }

        .health-home-emergency h3 {
          margin: 0 0 5px;
          color: #991b1b;
          font-size: 17px;
        }

        .health-home-emergency p {
          margin: 0;
          color: #9f5b5b;
          font-size: 12px;
          line-height: 1.5;
        }

        .health-home-emergency-button {
          min-height: 40px;
          padding: 0 17px;
          border: none;
          border-radius: 7px;
          background: #dc2626;
          color: white;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .health-home-emergency-button:hover {
          background: #b91c1c;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 950px) {
          .health-home-intro {
            grid-template-columns: 1fr;
          }

          .health-home-benefits {
            grid-template-columns: repeat(2, 1fr);
          }

          .health-home-services {
            grid-template-columns: 1fr;
          }

          .health-home-who-box {
            grid-template-columns: repeat(2, 1fr);
          }

          .health-home-care-box {
            grid-template-columns: repeat(2, 1fr);
          }

          .health-home-care-step:nth-child(2) {
            border-right: none;
          }

          .health-home-care-step:nth-child(-n + 2) {
            border-bottom: 1px solid #edf1f3;
          }

          .health-home-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 600px) {
          .health-home-hero {
            padding: 55px 18px;
          }

          .health-home-hero h1 {
            font-size: 35px;
          }

          .health-home-hero p {
            font-size: 14px;
          }

          .health-home-container {
            width: 92%;
            padding: 42px 0 60px;
          }

          .health-home-section-heading h2 {
            font-size: 26px;
          }

          .health-home-intro-content,
          .health-home-intro-side {
            padding: 23px;
          }

          .health-home-benefits {
            grid-template-columns: 1fr;
          }

          .health-home-service {
            padding: 22px;
          }

          .health-home-who-box {
            grid-template-columns: 1fr;
          }

          .health-home-care-box {
            grid-template-columns: 1fr;
          }

          .health-home-care-step {
            border-right: none !important;
            border-bottom: 1px solid #edf1f3;
          }

          .health-home-care-step:last-child {
            border-bottom: none;
          }

          .health-home-cta {
            padding: 27px 22px;
          }

          .health-home-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .health-home-cta-button {
            width: 100%;
          }

          .health-home-emergency {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .health-home-emergency-button {
            width: 100%;
          }
        }
      `}</style>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="health-home-hero">
        <div className="health-home-hero-content">
          <span className="health-home-badge">
            Home Healthcare Services
          </span>

          <h1>Healthcare at Your Home</h1>

          <p>
            Access professional healthcare support from the comfort
            of your home. MediCo provides home-based medical,
            nursing, rehabilitation, monitoring, and recovery
            services designed around the needs of patients and
            their families.
          </p>

          <div className="health-home-hero-actions">
            <button
              className="health-home-hero-button primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Doctor
            </button>


          </div>
        </div>
      </section>

      <main className="health-home-container">

        {/* =====================================================
            INTRODUCTION
        ===================================================== */}

        <section className="health-home-intro">
          <div className="health-home-intro-content">
            <h2>Comprehensive Home Healthcare</h2>

            <p>
              Home healthcare allows patients to receive appropriate
              medical and supportive services without having to
              travel to a hospital or clinic for every healthcare
              requirement.
            </p>

            <p>
              MediCo's home healthcare services are designed to
              support patients during recovery, rehabilitation,
              chronic disease management, elderly care, post-surgical
              care, and other situations where care at home may be
              appropriate.
            </p>

            <p>
              Depending on the patient's requirements, home services
              may include doctor consultations, nursing care,
              physiotherapy, diagnostic sample collection, medication
              support, health monitoring, and coordinated follow-up
              care.
            </p>

            <p>
              Home healthcare does not replace emergency hospital
              treatment. Patients experiencing serious or rapidly
              worsening symptoms should seek immediate emergency
              medical attention.
            </p>
          </div>

          <div className="health-home-intro-side">
            <h3>Home Healthcare Includes</h3>

            <div className="health-home-highlight">
              <div className="health-home-highlight-icon">
                👨‍⚕️
              </div>

              <div>
                <strong>Medical Visits</strong>
                <span>
                  Qualified healthcare professionals can provide
                  appropriate home-based consultations and follow-up.
                </span>
              </div>
            </div>

            <div className="health-home-highlight">
              <div className="health-home-highlight-icon">
                🩺
              </div>

              <div>
                <strong>Nursing Support</strong>
                <span>
                  Nursing assistance for monitoring, wound care,
                  medication support, and recovery.
                </span>
              </div>
            </div>

            <div className="health-home-highlight">
              <div className="health-home-highlight-icon">
                🧑‍🦽
              </div>

              <div>
                <strong>Rehabilitation</strong>
                <span>
                  Physiotherapy and mobility support can help patients
                  work toward functional recovery.
                </span>
              </div>
            </div>

            <div className="health-home-highlight">
              <div className="health-home-highlight-icon">
                🔬
              </div>

              <div>
                <strong>Home Diagnostics</strong>
                <span>
                  Selected laboratory samples can be collected at home
                  for eligible investigations.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            BENEFITS
        ===================================================== */}

        <section>
          <div className="health-home-section-heading">
            <h2>Why Choose Home Healthcare?</h2>

            <p>
              Home-based care can provide convenience and continuity
              for patients who need ongoing healthcare support.
            </p>
          </div>

          <div className="health-home-benefits">
            {benefits.map((benefit) => (
              <article
                className="health-home-benefit"
                key={benefit.title}
              >
                <div className="health-home-benefit-icon">
                  {benefit.icon}
                </div>

                <h3>{benefit.title}</h3>

                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================================
            SERVICES
        ===================================================== */}

        <section>
          <div className="health-home-section-heading">
            <h2>Our Home Healthcare Services</h2>

            <p>
              Explore the different healthcare services that may be
              available for eligible patients at home.
            </p>
          </div>

          <div className="health-home-services">
            {homeServices.map((service) => (
              <article
                className="health-home-service"
                key={service.title}
              >
                <div className="health-home-service-top">
                  <div className="health-home-service-icon">
                    {service.icon}
                  </div>

                  <h3>{service.title}</h3>
                </div>

                <p>{service.description}</p>

                <div className="health-home-feature-title">
                  Service Includes
                </div>

                <ul className="health-home-feature-list">
                  {service.features.map((feature) => (
                    <li key={feature}>
                      <span className="health-home-check">
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

        {/* =====================================================
            WHO CAN BENEFIT
        ===================================================== */}

        <section className="health-home-who">
          <div className="health-home-section-heading">
            <h2>Who May Benefit From Home Healthcare?</h2>

            <p>
              Home-based healthcare can be useful for different
              patient groups depending on their medical condition
              and care requirements.
            </p>
          </div>

          <div className="health-home-who-box">
            <article className="health-home-who-card">
              <div className="health-home-who-card-icon">
                👴
              </div>

              <h3>Senior Citizens</h3>

              <p>
                Older adults who need assistance with routine
                healthcare monitoring, mobility, medications, or
                daily health needs.
              </p>
            </article>

            <article className="health-home-who-card">
              <div className="health-home-who-card-icon">
                🏥
              </div>

              <h3>Post-Hospital Patients</h3>

              <p>
                Patients returning home after hospitalization who
                require appropriate follow-up, monitoring, or
                recovery support.
              </p>
            </article>

            <article className="health-home-who-card">
              <div className="health-home-who-card-icon">
                🧑‍🦽
              </div>

              <h3>Recovery & Rehabilitation</h3>

              <p>
                Patients recovering from injuries, surgery, or
                illness who may benefit from physiotherapy and
                structured rehabilitation.
              </p>
            </article>

            <article className="health-home-who-card">
              <div className="health-home-who-card-icon">
                ❤️
              </div>

              <h3>Chronic Conditions</h3>

              <p>
                Patients requiring ongoing monitoring and support
                while managing selected long-term health conditions.
              </p>
            </article>

            <article className="health-home-who-card">
              <div className="health-home-who-card-icon">
                👩‍🍼
              </div>

              <h3>Mother & Baby</h3>

              <p>
                Mothers and newborns who require appropriate
                postnatal support and healthcare guidance at home.
              </p>
            </article>

            <article className="health-home-who-card">
              <div className="health-home-who-card-icon">
                👨‍👩‍👧
              </div>

              <h3>Family Caregivers</h3>

              <p>
                Families who need professional guidance and support
                while caring for a loved one at home.
              </p>
            </article>
          </div>
        </section>

        {/* =====================================================
            CARE JOURNEY
        ===================================================== */}

        <section className="health-home-care-section">
          <div className="health-home-section-heading">
            <h2>Your Home Care Journey</h2>

            <p>
              A simple process for arranging appropriate home
              healthcare support.
            </p>
          </div>

          <div className="health-home-care-box">
            {careJourney.map((step) => (
              <div
                className="health-home-care-step"
                key={step.number}
              >
                <div className="health-home-step-number">
                  {step.number}
                </div>

                <h3>{step.title}</h3>

                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            IMPORTANT INFORMATION
        ===================================================== */}

        <section className="health-home-cta">
          <div>
            <h2>Need Healthcare at Home?</h2>

            <p>
              Tell us about your healthcare requirements and connect
              with the appropriate MediCo healthcare service. Home
              visits and services are subject to availability,
              clinical suitability, and service coverage.
            </p>
          </div>

          <div className="health-home-cta-actions">
            <button
              className="health-home-cta-button primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Doctor
            </button>

            <button
              className="health-home-cta-button secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </section>

        {/* =====================================================
            EMERGENCY
        ===================================================== */}

        <section className="health-home-emergency">
          <div className="health-home-emergency-content">
            <div className="health-home-emergency-icon">
              🚑
            </div>

            <div>
              <h3>Medical Emergency?</h3>

              <p>
                Home healthcare is not a substitute for emergency
                medical treatment. For severe or life-threatening
                symptoms, seek immediate emergency medical care.
              </p>
            </div>
          </div>

          <button
            className="health-home-emergency-button"
            onClick={() =>
              navigate("/services/emergency")
            }
          >
            Emergency Services
          </button>
        </section>

      </main>
    </div>
  );
}
