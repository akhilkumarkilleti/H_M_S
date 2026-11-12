import React from "react";
import { useNavigate } from "react-router-dom";

export default function NeurologyPage() {
  const navigate = useNavigate();

  const neurologyServices = [
    {
      title: "Neurology Consultation",
      icon: "🧠",
      description:
        "Comprehensive evaluation and management of conditions affecting the brain, spinal cord, nerves, and muscles.",
      features: [
        "Neurological assessment",
        "Specialist consultation",
        "Treatment planning",
        "Follow-up care",
      ],
    },
    {
      title: "Stroke Care",
      icon: "🩺",
      description:
        "Specialized care for stroke evaluation, treatment, recovery, and prevention of future neurological complications.",
      features: [
        "Stroke assessment",
        "Emergency evaluation",
        "Recovery planning",
        "Stroke prevention",
      ],
    },
    {
      title: "Migraine & Headache Care",
      icon: "💙",
      description:
        "Diagnosis and personalized treatment for migraines, recurring headaches, and other neurological causes of head pain.",
      features: [
        "Migraine evaluation",
        "Headache diagnosis",
        "Preventive treatment",
        "Lifestyle guidance",
      ],
    },
    {
      title: "Epilepsy Care",
      icon: "⚡",
      description:
        "Specialist diagnosis and long-term management for epilepsy and seizure-related neurological conditions.",
      features: [
        "Seizure evaluation",
        "EEG assessment",
        "Medication management",
        "Long-term monitoring",
      ],
    },
    {
      title: "Neurosurgery",
      icon: "🏥",
      description:
        "Advanced surgical evaluation and treatment for neurological conditions involving the brain, spine, and nervous system.",
      features: [
        "Neurosurgical consultation",
        "Brain surgery evaluation",
        "Spine surgery",
        "Post-operative care",
      ],
    },
    {
      title: "Brain & Spine Care",
      icon: "🦴",
      description:
        "Integrated care for neurological and spinal conditions affecting mobility, sensation, coordination, and daily activities.",
      features: [
        "Brain condition evaluation",
        "Spine assessment",
        "Nerve-related care",
        "Rehabilitation planning",
      ],
    },
  ];

  return (
    <div className="neurology-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .neurology-page {
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

        .neurology-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .neurology-hero {
          background:
            linear-gradient(
              135deg,
              #075985 0%,
              #0284c7 50%,
              #0f766e 100%
            );
          color: white;
          padding: 75px 20px;
          text-align: center;
        }

        .neurology-hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 14px;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 30px;
          background: rgba(255,255,255,0.10);
          color: #e0f2fe;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .neurology-hero h1 {
          margin: 18px 0 14px;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 800;
          line-height: 1.1;
        }

        .neurology-hero p {
          max-width: 780px;
          margin: 0 auto;
          color: #e0f2fe;
          font-size: 16px;
          line-height: 1.8;
        }

        .neurology-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .neurology-hero-button {
          min-height: 44px;
          padding: 0 21px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .neurology-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #0369a1;
        }

        .neurology-hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .neurology-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.6);
          background: transparent;
          color: white;
        }

        .neurology-hero-button.secondary:hover {
          background: rgba(255,255,255,0.10);
        }

        /* =========================================
           MAIN
        ========================================= */

        .neurology-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 55px 0 80px;
        }

        .neurology-section-heading {
          text-align: center;
          margin-bottom: 40px;
        }

        .neurology-section-heading h2 {
          margin: 0 0 12px;
          color: #173550;
          font-size: 30px;
          font-weight: 800;
        }

        .neurology-section-heading p {
          max-width: 760px;
          margin: 0 auto;
          color: #738392;
          font-size: 15px;
          line-height: 1.8;
        }

        /* =========================================
           INTRO
        ========================================= */

        .neurology-intro {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 25px;
          margin-bottom: 50px;
        }

        .neurology-intro-content,
        .neurology-intro-side {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .neurology-intro-content h2 {
          margin: 0 0 14px;
          color: #173550;
          font-size: 27px;
        }

        .neurology-intro-content p {
          margin: 0 0 13px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.8;
        }

        .neurology-intro-content p:last-child {
          margin-bottom: 0;
        }

        .neurology-intro-side {
          background:
            linear-gradient(
              145deg,
              #eaf8f8,
              #ffffff
            );
        }

        .neurology-intro-side h3 {
          margin: 0 0 18px;
          color: #173550;
          font-size: 20px;
        }

        .neurology-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .neurology-highlight:last-child {
          margin-bottom: 0;
        }

        .neurology-highlight-icon {
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

        .neurology-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #29465e;
          font-size: 13px;
        }

        .neurology-highlight span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================================
           SERVICES
        ========================================= */

        .neurology-services {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .neurology-service {
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

        .neurology-service::before {
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

        .neurology-service:hover {
          transform: translateY(-4px);
          border-color: #cfe4e6;
          box-shadow: 0 15px 35px rgba(30,60,80,0.09);
        }

        .neurology-service:hover::before {
          transform: scaleY(1);
        }

        .neurology-service-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 17px;
        }

        .neurology-service-icon {
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

        .neurology-service h3 {
          margin: 0;
          color: #18364f;
          font-size: 20px;
          line-height: 1.25;
        }

        .neurology-service p {
          margin: 0 0 18px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .neurology-feature-title {
          margin-bottom: 11px;
          color: #334d62;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .neurology-feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .neurology-feature-list li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5d7282;
          font-size: 12px;
        }

        .neurology-check {
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
           CARE PATH
        ========================================= */

        .neurology-care-section {
          margin-top: 55px;
        }

        .neurology-care-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .neurology-care-step {
          position: relative;
          padding: 28px 22px;
          text-align: center;
          border-right: 1px solid #edf1f3;
        }

        .neurology-care-step:last-child {
          border-right: none;
        }

        .neurology-step-number {
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

        .neurology-care-step h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 15px;
        }

        .neurology-care-step p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           CTA
        ========================================= */

        .neurology-cta {
          margin-top: 50px;
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

        .neurology-cta h2 {
          margin: 0 0 9px;
          font-size: 25px;
        }

        .neurology-cta p {
          max-width: 700px;
          margin: 0;
          color: #bcd1dd;
          font-size: 14px;
          line-height: 1.7;
        }

        .neurology-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .neurology-cta-button {
          min-height: 43px;
          padding: 0 18px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .neurology-cta-button.primary {
          border: 1px solid #159c9d;
          background: #159c9d;
          color: white;
        }

        .neurology-cta-button.primary:hover {
          background: #0e8183;
        }

        .neurology-cta-button.secondary {
          border: 1px solid #557587;
          background: transparent;
          color: white;
        }

        .neurology-cta-button.secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        /* =========================================
           EMERGENCY
        ========================================= */

        .neurology-emergency {
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

        .neurology-emergency-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .neurology-emergency-icon {
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

        .neurology-emergency h3 {
          margin: 0 0 5px;
          color: #991b1b;
          font-size: 17px;
        }

        .neurology-emergency p {
          margin: 0;
          color: #9f5b5b;
          font-size: 12px;
        }

        .neurology-emergency-button {
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

        .neurology-emergency-button:hover {
          background: #b91c1c;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 900px) {
          .neurology-intro {
            grid-template-columns: 1fr;
          }

          .neurology-services {
            grid-template-columns: 1fr;
          }

          .neurology-care-box {
            grid-template-columns: repeat(2, 1fr);
          }

          .neurology-care-step:nth-child(2) {
            border-right: none;
          }

          .neurology-care-step:nth-child(-n + 2) {
            border-bottom: 1px solid #edf1f3;
          }

          .neurology-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 600px) {
          .neurology-hero {
            padding: 55px 18px;
          }

          .neurology-hero h1 {
            font-size: 35px;
          }

          .neurology-hero p {
            font-size: 14px;
          }

          .neurology-container {
            width: 92%;
            padding: 40px 0 60px;
          }

          .neurology-section-heading h2 {
            font-size: 26px;
          }

          .neurology-intro-content,
          .neurology-intro-side {
            padding: 23px;
          }

          .neurology-service {
            padding: 22px;
          }

          .neurology-care-box {
            grid-template-columns: 1fr;
          }

          .neurology-care-step {
            border-right: none !important;
            border-bottom: 1px solid #edf1f3;
          }

          .neurology-care-step:last-child {
            border-bottom: none;
          }

          .neurology-cta {
            padding: 27px 22px;
          }

          .neurology-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .neurology-cta-button {
            width: 100%;
          }

          .neurology-emergency {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .neurology-emergency-button {
            width: 100%;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="neurology-hero">
        <span className="neurology-hero-badge">
          Neurology & Neurosciences
        </span>

        <h1>Neurology Care</h1>

        <p>
          Comprehensive neurological care for conditions affecting
          the brain, spinal cord, nerves, and muscles, supported by
          specialist consultation, advanced diagnostics, treatment,
          and long-term follow-up.
        </p>

        <div className="neurology-hero-actions">
          <button
            className="neurology-hero-button primary"
            onClick={() => navigate("/finddoctors")}
          >
            Find a Neurologist
          </button>

          <button
            className="neurology-hero-button secondary"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </section>

      <main className="neurology-container">

        {/* INTRO */}
        <section className="neurology-intro">
          <div className="neurology-intro-content">
            <h2>Specialized Neurological Care</h2>

            <p>
              Neurology focuses on the diagnosis and management of
              disorders affecting the brain, spinal cord, peripheral
              nerves, and muscles.
            </p>

            <p>
              At MediCo, patients can access neurological evaluation,
              diagnostic support, treatment planning, rehabilitation
              guidance, and ongoing specialist care.
            </p>

            <p>
              Our approach is centered around understanding each
              patient's symptoms and creating an individualized care
              plan based on their condition and healthcare needs.
            </p>
          </div>

          <div className="neurology-intro-side">
            <h3>Neurology Care Includes</h3>

            <div className="neurology-highlight">
              <div className="neurology-highlight-icon">🧠</div>

              <div>
                <strong>Brain & Nervous System</strong>
                <span>
                  Evaluation and management of neurological conditions.
                </span>
              </div>
            </div>

            <div className="neurology-highlight">
              <div className="neurology-highlight-icon">🩺</div>

              <div>
                <strong>Specialist Consultation</strong>
                <span>
                  Detailed assessment and personalized treatment planning.
                </span>
              </div>
            </div>

            <div className="neurology-highlight">
              <div className="neurology-highlight-icon">🔬</div>

              <div>
                <strong>Diagnostic Support</strong>
                <span>
                  Appropriate neurological investigations and testing.
                </span>
              </div>
            </div>

            <div className="neurology-highlight">
              <div className="neurology-highlight-icon">❤️</div>

              <div>
                <strong>Long-Term Care</strong>
                <span>
                  Follow-up, monitoring, prevention, and recovery support.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section>
          <div className="neurology-section-heading">
            <h2>Neurology Services</h2>

            <p>
              Explore neurological services available through the
              MediCo healthcare network.
            </p>
          </div>

          <div className="neurology-services">
            {neurologyServices.map((service, index) => (
              <article
                className="neurology-service"
                key={service.title}
              >
                <div className="neurology-service-top">
                  <div className="neurology-service-icon">
                    {service.icon}
                  </div>

                  <div>
                    <h3>{service.title}</h3>
                  </div>
                </div>

                <p>{service.description}</p>

                <div className="neurology-feature-title">
                  Care Includes
                </div>

                <ul className="neurology-feature-list">
                  {service.features.map((feature) => (
                    <li key={feature}>
                      <span className="neurology-check">
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

        {/* CARE PROCESS */}
        <section className="neurology-care-section">
          <div className="neurology-section-heading">
            <h2>Your Neurology Care Journey</h2>

            <p>
              A structured approach to neurological evaluation,
              treatment, and follow-up.
            </p>
          </div>

          <div className="neurology-care-box">
            <div className="neurology-care-step">
              <div className="neurology-step-number">01</div>

              <h3>Consultation</h3>

              <p>
                Discuss symptoms and medical history with a specialist.
              </p>
            </div>

            <div className="neurology-care-step">
              <div className="neurology-step-number">02</div>

              <h3>Diagnosis</h3>

              <p>
                Appropriate neurological examinations and diagnostics.
              </p>
            </div>

            <div className="neurology-care-step">
              <div className="neurology-step-number">03</div>

              <h3>Treatment</h3>

              <p>
                Receive a personalized treatment and care plan.
              </p>
            </div>

            <div className="neurology-care-step">
              <div className="neurology-step-number">04</div>

              <h3>Follow-Up</h3>

              <p>
                Ongoing monitoring, recovery, and preventive care.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="neurology-cta">
          <div>
            <h2>Need Neurological Care?</h2>

            <p>
              Connect with a qualified specialist to discuss your
              symptoms and explore appropriate neurological care.
            </p>
          </div>

          <div className="neurology-cta-actions">
            <button
              className="neurology-cta-button primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Doctor
            </button>

            <button
              className="neurology-cta-button secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </section>

        {/* EMERGENCY */}
        <section className="neurology-emergency">
          <div className="neurology-emergency-content">
            <div className="neurology-emergency-icon">
              🚑
            </div>

            <div>
              <h3>Medical Emergency?</h3>

              <p>
                For sudden severe neurological symptoms or other
                emergencies, seek immediate medical attention.
              </p>
            </div>
          </div>

          <button
            className="neurology-emergency-button"
            onClick={() => navigate("/services/emergency")}
          >
            Emergency Services
          </button>
        </section>

      </main>
    </div>
  );
}
