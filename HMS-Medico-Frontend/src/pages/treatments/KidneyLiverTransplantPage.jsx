import React from "react";
import { useNavigate } from "react-router-dom";

export default function KidneyLiverTransplantPage() {
  const navigate = useNavigate();

  const kidneyServices = [
    {
      icon: "🫘",
      title: "Kidney Transplant Evaluation",
      description:
        "Comprehensive assessment for patients with advanced or end-stage kidney disease to determine whether transplantation may be an appropriate treatment option.",
      features: [
        "Medical evaluation",
        "Blood and tissue testing",
        "Imaging studies",
        "Donor-recipient assessment",
      ],
    },
    {
      icon: "🤝",
      title: "Living Donor Kidney Transplant",
      description:
        "A healthy eligible person may donate one kidney after completing a detailed medical and psychosocial evaluation.",
      features: [
        "Living donor evaluation",
        "Compatibility testing",
        "Donor counselling",
        "Recipient preparation",
      ],
    },
    {
      icon: "🧪",
      title: "Kidney Matching & Compatibility",
      description:
        "Transplant teams evaluate blood group, tissue compatibility and other medical factors before transplantation.",
      features: [
        "Blood group testing",
        "Tissue typing",
        "Crossmatching",
        "Immunological assessment",
      ],
    },
    {
      icon: "💊",
      title: "Post-Kidney Transplant Care",
      description:
        "Long-term follow-up focuses on kidney function, medicines, infection prevention and monitoring for rejection.",
      features: [
        "Kidney function monitoring",
        "Anti-rejection medicines",
        "Infection monitoring",
        "Regular follow-up",
      ],
    },
  ];

  const liverServices = [
    {
      icon: "🫀",
      title: "Liver Transplant Evaluation",
      description:
        "Detailed evaluation for patients with advanced liver disease, liver failure or selected liver cancers where transplantation may be considered.",
      features: [
        "Liver function assessment",
        "Imaging",
        "Blood investigations",
        "Overall health evaluation",
      ],
    },
    {
      icon: "🤲",
      title: "Living Donor Liver Transplant",
      description:
        "A medically suitable living donor can donate a portion of the liver. The donor and recipient are evaluated independently by the transplant team.",
      features: [
        "Donor screening",
        "Liver volume assessment",
        "Compatibility evaluation",
        "Independent donor counselling",
      ],
    },
    {
      icon: "🏥",
      title: "Liver Failure Management",
      description:
        "Specialist care for patients with advanced liver disease while evaluating treatment options and transplant suitability.",
      features: [
        "Cirrhosis assessment",
        "Liver failure care",
        "Complication management",
        "Transplant planning",
      ],
    },
    {
      icon: "🔬",
      title: "Post-Liver Transplant Care",
      description:
        "Long-term monitoring helps assess liver function, medication levels, infection risk and possible complications.",
      features: [
        "Liver function tests",
        "Medication monitoring",
        "Rejection surveillance",
        "Long-term follow-up",
      ],
    },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Initial Consultation",
      text:
        "The transplant team reviews the patient's medical history, current condition, previous treatments and overall health.",
    },
    {
      number: "02",
      title: "Detailed Evaluation",
      text:
        "Blood tests, imaging, organ-specific investigations and other assessments help determine transplant suitability.",
    },
    {
      number: "03",
      title: "Donor Assessment",
      text:
        "When living donation is considered, the donor undergoes a separate and extensive medical and psychological evaluation.",
    },
    {
      number: "04",
      title: "Matching & Planning",
      text:
        "The team assesses compatibility and develops an individualized surgical and medical plan.",
    },
    {
      number: "05",
      title: "Transplant Surgery",
      text:
        "The diseased organ is treated or replaced according to the transplant procedure selected by the specialist team.",
    },
    {
      number: "06",
      title: "Recovery & Follow-Up",
      text:
        "After surgery, patients require regular monitoring, prescribed medicines and long-term transplant follow-up.",
    },
  ];

  const faqs = [
    {
      question: "Who may need a kidney transplant?",
      answer:
        "Kidney transplantation may be considered for people with advanced or end-stage kidney disease when the kidneys can no longer adequately perform their functions. The transplant team determines suitability after detailed evaluation.",
    },
    {
      question: "Who may need a liver transplant?",
      answer:
        "A liver transplant may be considered for selected patients with severe chronic liver disease, liver failure and certain other serious liver conditions when other treatments are no longer sufficient.",
    },
    {
      question: "Can a living person donate a kidney?",
      answer:
        "Yes. A medically suitable living person can donate one kidney. Because donation involves major surgery, the donor must undergo extensive medical and psychological evaluation before approval.",
    },
    {
      question: "Can part of a liver be donated?",
      answer:
        "Yes. In living-donor liver transplantation, a medically suitable donor can donate a portion of the liver. The donor and recipient are carefully evaluated before surgery.",
    },
    {
      question: "What happens if a donor is not a match?",
      answer:
        "If a living donor is not compatible, the transplant team may discuss other options. Depending on the circumstances and applicable programs, paired donation or other transplant pathways may be considered.",
    },
    {
      question: "Will transplant patients need medicines afterward?",
      answer:
        "Most transplant recipients require anti-rejection medicines after transplantation. These medicines suppress the immune response and require careful monitoring because they can increase susceptibility to infections and have other side effects.",
    },
    {
      question: "Is transplant surgery completely risk-free?",
      answer:
        "No. Transplantation is major surgery and carries surgical, infectious, immunological and organ-specific risks. The transplant team should explain the individual's expected benefits and risks before treatment.",
    },
    {
      question: "How long does recovery take?",
      answer:
        "Recovery varies according to the organ transplanted, surgical technique, general health and complications. Your transplant team will provide individualized instructions about hospital stay, activity, diet, medicines and follow-up.",
    },
  ];

  return (
    <div className="klt-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .klt-page {
          min-height: 100vh;
          background: #f5f9fc;
          color: #17344d;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }

        .klt-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .klt-hero {
          position: relative;
          overflow: hidden;
          padding: 78px 20px;
          text-align: center;
          color: #fff;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(255,255,255,.13),
              transparent 28%
            ),
            radial-gradient(
              circle at 85% 80%,
              rgba(45,212,191,.18),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #075985,
              #087da7 52%,
              #0f766e
            );
        }

        .klt-hero::after {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          right: -100px;
          top: -100px;
          border-radius: 50%;
          background: rgba(255,255,255,.06);
        }

        .klt-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }

        .klt-badge {
          display: inline-flex;
          padding: 7px 15px;
          border: 1px solid rgba(255,255,255,.35);
          border-radius: 30px;
          background: rgba(255,255,255,.10);
          color: #dff7ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .klt-hero h1 {
          margin: 18px 0 15px;
          font-size: clamp(35px, 5vw, 54px);
          line-height: 1.08;
          font-weight: 850;
        }

        .klt-hero p {
          max-width: 800px;
          margin: 0 auto;
          color: #d9f2fb;
          font-size: 15px;
          line-height: 1.85;
        }

        .klt-hero-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 29px;
        }

        .klt-hero-btn {
          min-height: 45px;
          padding: 0 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: .25s ease;
        }

        .klt-hero-btn.primary {
          border: 1px solid white;
          background: white;
          color: #075985;
        }

        .klt-hero-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,.16);
        }

        .klt-hero-btn.secondary {
          border: 1px solid rgba(255,255,255,.55);
          background: transparent;
          color: white;
        }

        .klt-hero-btn.secondary:hover {
          background: rgba(255,255,255,.10);
        }

        /* =========================================
           CONTAINER
        ========================================= */

        .klt-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 58px 0 80px;
        }

        .klt-heading {
          text-align: center;
          margin-bottom: 38px;
        }

        .klt-heading h2 {
          margin: 0 0 11px;
          color: #173750;
          font-size: 30px;
          font-weight: 850;
        }

        .klt-heading p {
          max-width: 790px;
          margin: 0 auto;
          color: #71818e;
          font-size: 14px;
          line-height: 1.8;
        }

        /* =========================================
           INTRO
        ========================================= */

        .klt-intro {
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 22px;
          margin-bottom: 58px;
        }

        .klt-intro-main,
        .klt-intro-side {
          background: white;
          border: 1px solid #e1e9ee;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 8px 26px rgba(28,57,77,.045);
        }

        .klt-intro-main h2 {
          margin: 0 0 14px;
          color: #173750;
          font-size: 27px;
        }

        .klt-intro-main p {
          margin: 0 0 14px;
          color: #687b89;
          font-size: 14px;
          line-height: 1.85;
        }

        .klt-intro-main p:last-child {
          margin-bottom: 0;
        }

        .klt-intro-side {
          background:
            linear-gradient(
              145deg,
              #eaf8f8,
              #ffffff
            );
        }

        .klt-intro-side h3 {
          margin: 0 0 18px;
          color: #183c55;
          font-size: 20px;
        }

        .klt-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 17px;
        }

        .klt-highlight:last-child {
          margin-bottom: 0;
        }

        .klt-highlight-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #dff5f3;
          font-size: 17px;
        }

        .klt-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #29485d;
          font-size: 13px;
        }

        .klt-highlight span {
          color: #778894;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================================
           ORGAN CARDS
        ========================================= */

        .klt-organ-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
          margin-bottom: 60px;
        }

        .klt-organ-card {
          background: white;
          border: 1px solid #e0e9ee;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 8px 26px rgba(28,57,77,.045);
        }

        .klt-organ-card.kidney {
          border-top: 4px solid #0284c7;
        }

        .klt-organ-card.liver {
          border-top: 4px solid #0f9b8e;
        }

        .klt-organ-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 18px;
        }

        .klt-organ-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: #eaf7fb;
          font-size: 28px;
        }

        .liver .klt-organ-icon {
          background: #e7f7f3;
        }

        .klt-organ-card h3 {
          margin: 0 0 4px;
          color: #193951;
          font-size: 22px;
        }

        .klt-organ-label {
          color: #6e8492;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .7px;
          text-transform: uppercase;
        }

        .klt-organ-card > p {
          margin: 0 0 20px;
          color: #687b89;
          font-size: 13px;
          line-height: 1.75;
        }

        .klt-organ-card ul {
          padding: 0;
          margin: 0;
          list-style: none;
          display: grid;
          gap: 9px;
        }

        .klt-organ-card li {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          color: #526b7b;
          font-size: 12px;
          line-height: 1.55;
        }

        .klt-check {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #e5f6f4;
          color: #0f9187;
          font-size: 10px;
          font-weight: 900;
        }

        /* =========================================
           SERVICES
        ========================================= */

        .klt-services {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 60px;
        }

        .klt-service {
          background: white;
          border: 1px solid #e0e8ee;
          border-radius: 14px;
          padding: 25px;
          transition: .25s ease;
        }

        .klt-service:hover {
          transform: translateY(-4px);
          border-color: #c8e1e8;
          box-shadow: 0 14px 32px rgba(25,65,85,.08);
        }

        .klt-service-top {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 14px;
        }

        .klt-service-icon {
          width: 51px;
          height: 51px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #eef8fb;
          font-size: 25px;
        }

        .klt-service h3 {
          margin: 0;
          color: #1c3c54;
          font-size: 18px;
        }

        .klt-service p {
          margin: 0 0 15px;
          color: #6c7d89;
          font-size: 13px;
          line-height: 1.7;
        }

        .klt-service ul {
          padding: 0;
          margin: 0;
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .klt-service li {
          padding: 7px 10px;
          border-radius: 6px;
          background: #f2f8fa;
          color: #567181;
          font-size: 11px;
        }

        /* =========================================
           DONATION SECTION
        ========================================= */

        .klt-donation-section {
          margin-bottom: 60px;
        }

        .klt-donation-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .klt-donation-card {
          padding: 25px;
          background: white;
          border: 1px solid #e0e8ee;
          border-radius: 14px;
        }

        .klt-donation-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          margin-bottom: 15px;
          border-radius: 11px;
          background: #edf8f8;
          font-size: 23px;
        }

        .klt-donation-card h3 {
          margin: 0 0 9px;
          color: #24445a;
          font-size: 17px;
        }

        .klt-donation-card p {
          margin: 0;
          color: #70818d;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           PROCESS
        ========================================= */

        .klt-process {
          margin-bottom: 60px;
        }

        .klt-process-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .klt-process-card {
          position: relative;
          padding: 25px;
          background: white;
          border: 1px solid #e1e9ee;
          border-radius: 14px;
        }

        .klt-process-number {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          margin-bottom: 14px;
          border-radius: 50%;
          background: #e8f7f7;
          color: #108d88;
          font-size: 12px;
          font-weight: 900;
        }

        .klt-process-card h3 {
          margin: 0 0 8px;
          color: #28465b;
          font-size: 16px;
        }

        .klt-process-card p {
          margin: 0;
          color: #73828d;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           BENEFITS / RISKS
        ========================================= */

        .klt-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 60px;
        }

        .klt-info-box {
          padding: 28px;
          border-radius: 15px;
          background: white;
          border: 1px solid #e1e9ee;
        }

        .klt-info-box.benefits {
          background: linear-gradient(145deg,#effafa,#fff);
        }

        .klt-info-box.risks {
          background: linear-gradient(145deg,#fff8f7,#fff);
        }

        .klt-info-box h3 {
          margin: 0 0 17px;
          color: #24455b;
          font-size: 20px;
        }

        .klt-info-box ul {
          padding: 0;
          margin: 0;
          list-style: none;
          display: grid;
          gap: 12px;
        }

        .klt-info-box li {
          display: flex;
          gap: 9px;
          color: #667985;
          font-size: 12px;
          line-height: 1.65;
        }

        .klt-info-box li span {
          flex-shrink: 0;
          font-weight: 900;
        }

        .benefits li span {
          color: #0f938a;
        }

        .risks li span {
          color: #d66a61;
        }

        /* =========================================
           AFTERCARE
        ========================================= */

        .klt-aftercare {
          margin-bottom: 60px;
        }

        .klt-aftercare-box {
          padding: 30px;
          border-radius: 16px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #12344c,
              #15566b
            );
        }

        .klt-aftercare-box h2 {
          margin: 0 0 11px;
          font-size: 25px;
        }

        .klt-aftercare-box > p {
          max-width: 850px;
          margin: 0 0 22px;
          color: #c8dbe4;
          font-size: 13px;
          line-height: 1.75;
        }

        .klt-aftercare-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .klt-aftercare-item {
          padding: 17px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 10px;
          background: rgba(255,255,255,.06);
        }

        .klt-aftercare-item strong {
          display: block;
          margin-bottom: 5px;
          font-size: 12px;
        }

        .klt-aftercare-item span {
          color: #b8ced8;
          font-size: 11px;
          line-height: 1.5;
        }

        /* =========================================
           FAQ
        ========================================= */

        .klt-faq {
          margin-bottom: 55px;
        }

        .klt-faq-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .klt-faq-item {
          padding: 22px;
          background: white;
          border: 1px solid #e0e8ed;
          border-radius: 12px;
        }

        .klt-faq-item h3 {
          margin: 0 0 9px;
          color: #24445a;
          font-size: 15px;
        }

        .klt-faq-item p {
          margin: 0;
          color: #71818c;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           CTA
        ========================================= */

        .klt-cta {
          padding: 34px;
          border-radius: 16px;
          background: #eaf7f8;
          border: 1px solid #d5ebec;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
        }

        .klt-cta h2 {
          margin: 0 0 8px;
          color: #183b52;
          font-size: 24px;
        }

        .klt-cta p {
          margin: 0;
          color: #657b88;
          font-size: 13px;
          line-height: 1.7;
        }

        .klt-cta-actions {
          display: flex;
          gap: 9px;
          flex-shrink: 0;
        }

        .klt-cta-btn {
          min-height: 43px;
          padding: 0 17px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
        }

        .klt-cta-btn.primary {
          border: 1px solid #087da1;
          background: #087da1;
          color: white;
        }

        .klt-cta-btn.secondary {
          border: 1px solid #b7cdd5;
          background: white;
          color: #245269;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 950px) {
          .klt-intro,
          .klt-info-grid {
            grid-template-columns: 1fr;
          }

          .klt-organ-grid,
          .klt-services {
            grid-template-columns: 1fr;
          }

          .klt-process-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .klt-donation-grid {
            grid-template-columns: 1fr;
          }

          .klt-aftercare-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .klt-faq-list {
            grid-template-columns: 1fr;
          }

          .klt-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 600px) {
          .klt-hero {
            padding: 55px 18px;
          }

          .klt-hero h1 {
            font-size: 35px;
          }

          .klt-container {
            width: 92%;
            padding: 42px 0 60px;
          }

          .klt-intro-main,
          .klt-intro-side,
          .klt-organ-card,
          .klt-service,
          .klt-info-box {
            padding: 22px;
          }

          .klt-process-grid,
          .klt-aftercare-grid {
            grid-template-columns: 1fr;
          }

          .klt-cta {
            padding: 25px 21px;
          }

          .klt-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .klt-cta-btn {
            width: 100%;
          }
        }
      `}</style>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="klt-hero">
        <div className="klt-hero-inner">
          <span className="klt-badge">
            Transplant & Organ Care
          </span>

          <h1>Kidney & Liver Transplant</h1>

          <p>
            Comprehensive transplant care for patients with advanced
            kidney or liver disease, including transplant evaluation,
            living-donor assessment, compatibility testing, surgery
            planning, post-transplant treatment and long-term follow-up.
          </p>

          <div className="klt-hero-actions">
            <button
              className="klt-hero-btn primary"
              onClick={() => navigate("/finddoctors")}
            >
              Consult a Specialist
            </button>

            <button
              className="klt-hero-btn secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Transplant Team
            </button>
          </div>
        </div>
      </section>

      <main className="klt-container">

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section className="klt-intro">

          <div className="klt-intro-main">
            <h2>
              Advanced Kidney & Liver Transplant Care
            </h2>

            <p>
              Organ transplantation can be an important treatment
              option for selected patients whose kidneys or liver can
              no longer perform their essential functions adequately.
            </p>

            <p>
              Kidney transplantation replaces the function of a failed
              kidney with a healthy donated kidney. In a living-donor
              kidney transplant, an eligible donor gives one kidney,
              while the recipient's own kidneys are usually left in
              place unless there is a specific reason to remove them.
            </p>

            <p>
              Liver transplantation involves replacing a severely
              diseased liver with a healthy donor liver. In living-donor
              liver transplantation, a suitable donor may donate a
              portion of the liver.
            </p>

            <p>
              Transplant care is not limited to surgery. It includes
              detailed evaluation before transplantation, donor
              assessment, compatibility testing, medication management,
              infection prevention, monitoring for rejection and
              lifelong or long-term follow-up.
            </p>
          </div>

          <div className="klt-intro-side">
            <h3>
              What Transplant Care Includes
            </h3>

            <div className="klt-highlight">
              <div className="klt-highlight-icon">
                🔬
              </div>

              <div>
                <strong>
                  Detailed Evaluation
                </strong>

                <span>
                  Medical, laboratory, imaging and specialist
                  assessment before transplantation.
                </span>
              </div>
            </div>

            <div className="klt-highlight">
              <div className="klt-highlight-icon">
                🤝
              </div>

              <div>
                <strong>
                  Donor Assessment
                </strong>

                <span>
                  Living donors undergo extensive evaluation to
                  protect donor safety.
                </span>
              </div>
            </div>

            <div className="klt-highlight">
              <div className="klt-highlight-icon">
                🧬
              </div>

              <div>
                <strong>
                  Compatibility
                </strong>

                <span>
                  Blood group, tissue and immunological testing may
                  be performed as appropriate.
                </span>
              </div>
            </div>

            <div className="klt-highlight">
              <div className="klt-highlight-icon">
                💊
              </div>

              <div>
                <strong>
                  Long-Term Monitoring
                </strong>

                <span>
                  Medication, organ function, infection and rejection
                  surveillance after transplantation.
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* =====================================================
            KIDNEY & LIVER
        ===================================================== */}

        <section>
          <div className="klt-heading">
            <h2>
              Kidney & Liver Transplant Services
            </h2>

            <p>
              Specialized pathways for patients, recipients and
              potential living donors.
            </p>
          </div>

          <div className="klt-organ-grid">

            <article className="klt-organ-card kidney">

              <div className="klt-organ-header">
                <div className="klt-organ-icon">
                  🫘
                </div>

                <div>
                  <h3>Kidney Transplant</h3>

                  <span className="klt-organ-label">
                    Renal Transplantation
                  </span>
                </div>
              </div>

              <p>
                Kidney transplantation may be considered for patients
                with advanced kidney disease or kidney failure who are
                medically suitable for transplantation.
              </p>

              <ul>
                <li>
                  <span className="klt-check">✓</span>
                  Evaluation for kidney transplant suitability
                </li>

                <li>
                  <span className="klt-check">✓</span>
                  Living and deceased donor pathways
                </li>

                <li>
                  <span className="klt-check">✓</span>
                  Blood group and tissue compatibility assessment
                </li>

                <li>
                  <span className="klt-check">✓</span>
                  Dialysis and pre-transplant coordination
                </li>

                <li>
                  <span className="klt-check">✓</span>
                  Post-transplant kidney function monitoring
                </li>

                <li>
                  <span className="klt-check">✓</span>
                  Anti-rejection medication management
                </li>
              </ul>

            </article>

            <article className="klt-organ-card liver">

              <div className="klt-organ-header">
                <div className="klt-organ-icon">
                  🫀
                </div>

                <div>
                  <h3>Liver Transplant</h3>

                  <span className="klt-organ-label">
                    Hepatic Transplantation
                  </span>
                </div>
              </div>

              <p>
                Liver transplantation may be considered for selected
                patients with severe liver disease, liver failure and
                other conditions where transplantation is appropriate.
              </p>

              <ul>
                <li>
                  <span className="klt-check">✓</span>
                  Comprehensive liver transplant evaluation
                </li>

                <li>
                  <span className="klt-check">✓</span>
                  Living and deceased donor options
                </li>

                <li>
                  <span className="klt-check">✓</span>
                  Liver function and imaging assessment
                </li>

                <li>
                  <span className="klt-check">✓</span>
                  Donor liver volume and safety assessment
                </li>

                <li>
                  <span className="klt-check">✓</span>
                  Post-transplant liver function monitoring
                </li>

                <li>
                  <span className="klt-check">✓</span>
                  Long-term medication and follow-up care
                </li>
              </ul>

            </article>

          </div>
        </section>

        {/* =====================================================
            KIDNEY SERVICES
        ===================================================== */}

        <section>
          <div className="klt-heading">
            <h2>
              Kidney Transplant Services
            </h2>

            <p>
              From initial assessment through long-term follow-up,
              kidney transplant care requires coordinated medical,
              surgical and supportive services.
            </p>
          </div>

          <div className="klt-services">

            {kidneyServices.map((service) => (
              <article
                className="klt-service"
                key={service.title}
              >
                <div className="klt-service-top">
                  <div className="klt-service-icon">
                    {service.icon}
                  </div>

                  <h3>
                    {service.title}
                  </h3>
                </div>

                <p>
                  {service.description}
                </p>

                <ul>
                  {service.features.map((feature) => (
                    <li key={feature}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}

          </div>
        </section>

        {/* =====================================================
            LIVER SERVICES
        ===================================================== */}

        <section>
          <div className="klt-heading">
            <h2>
              Liver Transplant Services
            </h2>

            <p>
              A multidisciplinary approach to liver transplantation,
              including recipient assessment, donor evaluation and
              long-term follow-up.
            </p>
          </div>

          <div className="klt-services">

            {liverServices.map((service) => (
              <article
                className="klt-service"
                key={service.title}
              >
                <div className="klt-service-top">
                  <div className="klt-service-icon">
                    {service.icon}
                  </div>

                  <h3>
                    {service.title}
                  </h3>
                </div>

                <p>
                  {service.description}
                </p>

                <ul>
                  {service.features.map((feature) => (
                    <li key={feature}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}

          </div>
        </section>

        {/* =====================================================
            DONOR INFORMATION
        ===================================================== */}

        <section className="klt-donation-section">

          <div className="klt-heading">
            <h2>
              Living Organ Donation
            </h2>

            <p>
              Living donation can provide an alternative to waiting
              for a deceased-donor organ in selected patients.
              Donor safety is a central part of the transplant process.
            </p>
          </div>

          <div className="klt-donation-grid">

            <article className="klt-donation-card">
              <div className="klt-donation-icon">
                🫘
              </div>

              <h3>
                Living Kidney Donation
              </h3>

              <p>
                A healthy eligible donor can donate one kidney.
                Because donation is major surgery, the donor undergoes
                extensive medical testing and counselling before a
                transplant is approved.
              </p>
            </article>

            <article className="klt-donation-card">
              <div className="klt-donation-icon">
                🫀
              </div>

              <h3>
                Living Liver Donation
              </h3>

              <p>
                A suitable donor can donate a portion of the liver.
                The donor's liver has regenerative capacity, but the
                procedure remains major surgery and requires careful
                assessment of donor safety.
              </p>
            </article>

            <article className="klt-donation-card">
              <div className="klt-donation-icon">
                🧑‍⚕️
              </div>

              <h3>
                Independent Donor Evaluation
              </h3>

              <p>
                Donors are evaluated separately from recipients to
                assess physical health, psychological readiness,
                compatibility and the risks associated with donation.
              </p>
            </article>

          </div>
        </section>

        {/* =====================================================
            PROCESS
        ===================================================== */}

        <section className="klt-process">

          <div className="klt-heading">
            <h2>
              Transplant Journey
            </h2>

            <p>
              The transplant pathway consists of multiple stages
              designed to evaluate the patient, donor and expected
              benefits and risks.
            </p>
          </div>

          <div className="klt-process-grid">

            {processSteps.map((step) => (
              <article
                className="klt-process-card"
                key={step.number}
              >
                <div className="klt-process-number">
                  {step.number}
                </div>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.text}
                </p>
              </article>
            ))}

          </div>
        </section>

        {/* =====================================================
            BENEFITS AND RISKS
        ===================================================== */}

        <section className="klt-info-grid">

          <div className="klt-info-box benefits">

            <h3>
              Potential Benefits
            </h3>

            <ul>
              <li>
                <span>✓</span>
                Potential alternative to long-term organ-support
                treatment in appropriate patients.
              </li>

              <li>
                <span>✓</span>
                Kidney transplantation can eliminate the need for
                dialysis when the transplanted kidney functions well.
              </li>

              <li>
                <span>✓</span>
                Living-donor transplantation can sometimes reduce
                waiting time.
              </li>

              <li>
                <span>✓</span>
                Living donation can allow transplantation to be
                planned rather than waiting for an organ to become
                available unexpectedly.
              </li>

              <li>
                <span>✓</span>
                Successful transplantation may improve quality of
                life and organ function.
              </li>
            </ul>

          </div>

          <div className="klt-info-box risks">

            <h3>
              Important Risks
            </h3>

            <ul>
              <li>
                <span>!</span>
                Transplant surgery carries risks such as bleeding,
                infection, blood clots and complications related to
                anesthesia.
              </li>

              <li>
                <span>!</span>
                The recipient may experience rejection of the
                transplanted organ.
              </li>

              <li>
                <span>!</span>
                Anti-rejection medicines suppress the immune system
                and may increase infection risk and cause other
                side effects.
              </li>

              <li>
                <span>!</span>
                Living donors face risks associated with major surgery
                and require long-term medical follow-up.
              </li>

              <li>
                <span>!</span>
                Liver donation has specific risks including bile duct
                complications, bleeding and other surgical problems.
              </li>
            </ul>

          </div>

        </section>

        {/* =====================================================
            AFTERCARE
        ===================================================== */}

        <section className="klt-aftercare">

          <div className="klt-aftercare-box">

            <h2>
              Life After Transplantation
            </h2>

            <p>
              Transplantation does not end when surgery is completed.
              Long-term follow-up is essential. Recipients need to
              take prescribed medicines, attend regular appointments,
              undergo blood tests and report concerning symptoms to
              their transplant team.
            </p>

            <div className="klt-aftercare-grid">

              <div className="klt-aftercare-item">
                <strong>
                  💊 Medicines
                </strong>

                <span>
                  Take anti-rejection medicines exactly as prescribed.
                </span>
              </div>

              <div className="klt-aftercare-item">
                <strong>
                  🧪 Monitoring
                </strong>

                <span>
                  Regular laboratory testing and organ-function
                  assessment.
                </span>
              </div>

              <div className="klt-aftercare-item">
                <strong>
                  🦠 Infection Prevention
                </strong>

                <span>
                  Follow precautions and medical advice because
                  immune-suppressing medicines increase infection risk.
                </span>
              </div>

              <div className="klt-aftercare-item">
                <strong>
                  📅 Follow-Up
                </strong>

                <span>
                  Maintain regular appointments with the transplant
                  care team.
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            FAQ
        ===================================================== */}

        <section className="klt-faq">

          <div className="klt-heading">
            <h2>
              Kidney & Liver Transplant FAQs
            </h2>

            <p>
              Common questions patients and families may have about
              transplantation.
            </p>
          </div>

          <div className="klt-faq-list">

            {faqs.map((faq) => (
              <article
                className="klt-faq-item"
                key={faq.question}
              >
                <h3>
                  {faq.question}
                </h3>

                <p>
                  {faq.answer}
                </p>
              </article>
            ))}

          </div>

        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="klt-cta">

          <div>
            <h2>
              Need Transplant Evaluation?
            </h2>

            <p>
              Speak with a qualified transplant specialist to
              understand your treatment options, required evaluations,
              donor pathways and next steps.
            </p>
          </div>

          <div className="klt-cta-actions">

            <button
              className="klt-cta-btn primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Specialist
            </button>

            <button
              className="klt-cta-btn secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}
