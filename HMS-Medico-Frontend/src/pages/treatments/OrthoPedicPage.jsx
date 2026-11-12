import React from "react";
import { useNavigate } from "react-router-dom";

export default function OrthopedicPage() {
  const navigate = useNavigate();

  const orthopedicServices = [
    {
      title: "Joint Pain Treatment",
      icon: "🦵",
      description:
        "Comprehensive evaluation and treatment for pain, stiffness, swelling, and reduced movement affecting the knees, hips, shoulders, and other joints.",
      features: [
        "Joint pain evaluation",
        "Arthritis management",
        "Pain management",
        "Mobility improvement",
      ],
    },
    {
      title: "Fracture Management",
      icon: "🦴",
      description:
        "Specialized orthopedic care for fractures and bone injuries, including assessment, stabilization, treatment, and recovery planning.",
      features: [
        "Fracture assessment",
        "Bone stabilization",
        "Cast and brace care",
        "Recovery monitoring",
      ],
    },
    {
      title: "Joint Replacement",
      icon: "🏥",
      description:
        "Surgical evaluation and treatment for severely damaged joints when conservative treatment no longer provides adequate relief.",
      features: [
        "Knee replacement",
        "Hip replacement",
        "Joint evaluation",
        "Post-surgery rehabilitation",
      ],
    },
    {
      title: "Sports Injury Care",
      icon: "⚽",
      description:
        "Diagnosis and treatment of sports-related injuries affecting muscles, bones, joints, tendons, and ligaments.",
      features: [
        "Sports injury evaluation",
        "Ligament injuries",
        "Muscle injuries",
        "Return-to-sport planning",
      ],
    },
    {
      title: "Spine Care",
      icon: "🦴",
      description:
        "Evaluation and treatment of common spinal conditions that can cause back pain, neck pain, stiffness, and movement difficulties.",
      features: [
        "Back pain evaluation",
        "Neck pain treatment",
        "Spinal condition care",
        "Posture guidance",
      ],
    },
    {
      title: "Muscle & Ligament Care",
      icon: "💪",
      description:
        "Comprehensive care for muscle strains, tendon problems, ligament injuries, and other soft-tissue orthopedic conditions.",
      features: [
        "Muscle strain treatment",
        "Tendon care",
        "Ligament injury care",
        "Physical rehabilitation",
      ],
    },
  ];

  return (
    <div className="orthopedic-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .orthopedic-page {
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

        .orthopedic-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .orthopedic-hero {
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

        .orthopedic-hero-badge {
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

        .orthopedic-hero h1 {
          margin: 18px 0 14px;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 800;
          line-height: 1.1;
        }

        .orthopedic-hero p {
          max-width: 780px;
          margin: 0 auto;
          color: #e0f2fe;
          font-size: 16px;
          line-height: 1.8;
        }

        .orthopedic-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .orthopedic-hero-button {
          min-height: 44px;
          padding: 0 21px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .orthopedic-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #0369a1;
        }

        .orthopedic-hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .orthopedic-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.6);
          background: transparent;
          color: white;
        }

        .orthopedic-hero-button.secondary:hover {
          background: rgba(255,255,255,0.10);
        }

        /* =========================================
           MAIN
        ========================================= */

        .orthopedic-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 55px 0 80px;
        }

        .orthopedic-section-heading {
          text-align: center;
          margin-bottom: 40px;
        }

        .orthopedic-section-heading h2 {
          margin: 0 0 12px;
          color: #173550;
          font-size: 30px;
          font-weight: 800;
        }

        .orthopedic-section-heading p {
          max-width: 760px;
          margin: 0 auto;
          color: #738392;
          font-size: 15px;
          line-height: 1.8;
        }

        /* =========================================
           INTRO
        ========================================= */

        .orthopedic-intro {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 25px;
          margin-bottom: 50px;
        }

        .orthopedic-intro-content,
        .orthopedic-intro-side {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .orthopedic-intro-content h2 {
          margin: 0 0 14px;
          color: #173550;
          font-size: 27px;
        }

        .orthopedic-intro-content p {
          margin: 0 0 13px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.8;
        }

        .orthopedic-intro-content p:last-child {
          margin-bottom: 0;
        }

        .orthopedic-intro-side {
          background:
            linear-gradient(
              145deg,
              #eaf8f8,
              #ffffff
            );
        }

        .orthopedic-intro-side h3 {
          margin: 0 0 18px;
          color: #173550;
          font-size: 20px;
        }

        .orthopedic-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .orthopedic-highlight:last-child {
          margin-bottom: 0;
        }

        .orthopedic-highlight-icon {
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

        .orthopedic-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #29465e;
          font-size: 13px;
        }

        .orthopedic-highlight span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================================
           CONDITIONS
        ========================================= */

        .orthopedic-conditions {
          margin-bottom: 50px;
        }

        .orthopedic-condition-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .orthopedic-condition {
          padding: 24px 20px;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
          text-align: center;
          box-shadow: 0 7px 25px rgba(30,60,80,0.04);
          transition: 0.25s ease;
        }

        .orthopedic-condition:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(30,60,80,0.08);
        }

        .orthopedic-condition-icon {
          width: 50px;
          height: 50px;
          margin: 0 auto 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #eaf8f8;
          font-size: 24px;
        }

        .orthopedic-condition h3 {
          margin: 0 0 7px;
          color: #29465e;
          font-size: 15px;
        }

        .orthopedic-condition p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           SERVICES
        ========================================= */

        .orthopedic-services {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .orthopedic-service {
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

        .orthopedic-service::before {
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

        .orthopedic-service:hover {
          transform: translateY(-4px);
          border-color: #cfe4e6;
          box-shadow: 0 15px 35px rgba(30,60,80,0.09);
        }

        .orthopedic-service:hover::before {
          transform: scaleY(1);
        }

        .orthopedic-service-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 17px;
        }

        .orthopedic-service-icon {
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

        .orthopedic-service h3 {
          margin: 0;
          color: #18364f;
          font-size: 20px;
          line-height: 1.25;
        }

        .orthopedic-service p {
          margin: 0 0 18px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .orthopedic-feature-title {
          margin-bottom: 11px;
          color: #334d62;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .orthopedic-feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .orthopedic-feature-list li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5d7282;
          font-size: 12px;
        }

        .orthopedic-check {
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
           TREATMENT APPROACH
        ========================================= */

        .orthopedic-treatment-section {
          margin-top: 55px;
        }

        .orthopedic-treatment-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .orthopedic-treatment-step {
          padding: 28px 22px;
          text-align: center;
          border-right: 1px solid #edf1f3;
        }

        .orthopedic-treatment-step:last-child {
          border-right: none;
        }

        .orthopedic-step-number {
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

        .orthopedic-treatment-step h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 15px;
        }

        .orthopedic-treatment-step p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           CTA
        ========================================= */

        .orthopedic-cta {
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

        .orthopedic-cta h2 {
          margin: 0 0 9px;
          font-size: 25px;
        }

        .orthopedic-cta p {
          max-width: 700px;
          margin: 0;
          color: #bcd1dd;
          font-size: 14px;
          line-height: 1.7;
        }

        .orthopedic-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .orthopedic-cta-button {
          min-height: 43px;
          padding: 0 18px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .orthopedic-cta-button.primary {
          border: 1px solid #159c9d;
          background: #159c9d;
          color: white;
        }

        .orthopedic-cta-button.primary:hover {
          background: #0e8183;
        }

        .orthopedic-cta-button.secondary {
          border: 1px solid #557587;
          background: transparent;
          color: white;
        }

        .orthopedic-cta-button.secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        /* =========================================
           EMERGENCY
        ========================================= */

        .orthopedic-emergency {
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

        .orthopedic-emergency-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .orthopedic-emergency-icon {
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

        .orthopedic-emergency h3 {
          margin: 0 0 5px;
          color: #991b1b;
          font-size: 17px;
        }

        .orthopedic-emergency p {
          margin: 0;
          color: #9f5b5b;
          font-size: 12px;
        }

        .orthopedic-emergency-button {
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

        .orthopedic-emergency-button:hover {
          background: #b91c1c;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 1000px) {
          .orthopedic-condition-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .orthopedic-intro {
            grid-template-columns: 1fr;
          }

          .orthopedic-services {
            grid-template-columns: 1fr;
          }

          .orthopedic-treatment-box {
            grid-template-columns: repeat(2, 1fr);
          }

          .orthopedic-treatment-step:nth-child(2) {
            border-right: none;
          }

          .orthopedic-treatment-step:nth-child(-n + 2) {
            border-bottom: 1px solid #edf1f3;
          }

          .orthopedic-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 600px) {
          .orthopedic-hero {
            padding: 55px 18px;
          }

          .orthopedic-hero h1 {
            font-size: 35px;
          }

          .orthopedic-hero p {
            font-size: 14px;
          }

          .orthopedic-container {
            width: 92%;
            padding: 40px 0 60px;
          }

          .orthopedic-section-heading h2 {
            font-size: 26px;
          }

          .orthopedic-intro-content,
          .orthopedic-intro-side {
            padding: 23px;
          }

          .orthopedic-condition-grid {
            grid-template-columns: 1fr;
          }

          .orthopedic-service {
            padding: 22px;
          }

          .orthopedic-treatment-box {
            grid-template-columns: 1fr;
          }

          .orthopedic-treatment-step {
            border-right: none !important;
            border-bottom: 1px solid #edf1f3;
          }

          .orthopedic-treatment-step:last-child {
            border-bottom: none;
          }

          .orthopedic-cta {
            padding: 27px 22px;
          }

          .orthopedic-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .orthopedic-cta-button {
            width: 100%;
          }

          .orthopedic-emergency {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .orthopedic-emergency-button {
            width: 100%;
          }
        }
      `}</style>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="orthopedic-hero">
        <span className="orthopedic-hero-badge">
          Orthopedics & Musculoskeletal Care
        </span>

        <h1>Orthopedic Care</h1>

        <p>
          Comprehensive orthopedic care for bones, joints, muscles,
          ligaments, tendons, and mobility-related conditions, supported
          by specialist evaluation, treatment, rehabilitation, and
          long-term follow-up.
        </p>

        <div className="orthopedic-hero-actions">
          <button
            className="orthopedic-hero-button primary"
            onClick={() => navigate("/finddoctors")}
          >
            Find an Orthopedic Doctor
          </button>

          <button
            className="orthopedic-hero-button secondary"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </section>

      <main className="orthopedic-container">

        {/* =========================================
            INTRO
        ========================================= */}

        <section className="orthopedic-intro">
          <div className="orthopedic-intro-content">
            <h2>Specialized Orthopedic Treatment</h2>

            <p>
              Orthopedics focuses on the diagnosis, treatment, and
              prevention of conditions affecting the bones, joints,
              muscles, ligaments, tendons, and other parts of the
              musculoskeletal system.
            </p>

            <p>
              At MediCo, patients can receive orthopedic evaluation,
              diagnostic support, conservative treatment, surgical
              consultation, rehabilitation guidance, and follow-up care.
            </p>

            <p>
              Treatment is planned according to the patient's condition,
              symptoms, activity level, medical history, and individual
              healthcare needs.
            </p>
          </div>

          <div className="orthopedic-intro-side">
            <h3>Orthopedic Care Includes</h3>

            <div className="orthopedic-highlight">
              <div className="orthopedic-highlight-icon">🦴</div>

              <div>
                <strong>Bone & Joint Care</strong>
                <span>
                  Evaluation and treatment of bone and joint conditions.
                </span>
              </div>
            </div>

            <div className="orthopedic-highlight">
              <div className="orthopedic-highlight-icon">🩺</div>

              <div>
                <strong>Specialist Evaluation</strong>
                <span>
                  Detailed orthopedic assessment and treatment planning.
                </span>
              </div>
            </div>

            <div className="orthopedic-highlight">
              <div className="orthopedic-highlight-icon">🏃</div>

              <div>
                <strong>Mobility & Recovery</strong>
                <span>
                  Support for restoring movement, strength, and function.
                </span>
              </div>
            </div>

            <div className="orthopedic-highlight">
              <div className="orthopedic-highlight-icon">❤️</div>

              <div>
                <strong>Long-Term Support</strong>
                <span>
                  Rehabilitation, prevention, monitoring, and follow-up.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CONDITIONS
        ========================================= */}

        <section className="orthopedic-conditions">
          <div className="orthopedic-section-heading">
            <h2>Conditions We Treat</h2>

            <p>
              Orthopedic specialists evaluate a wide range of conditions
              that can affect movement, strength, stability, and quality
              of life.
            </p>
          </div>

          <div className="orthopedic-condition-grid">
            <div className="orthopedic-condition">
              <div className="orthopedic-condition-icon">🦵</div>

              <h3>Joint Pain</h3>

              <p>
                Pain and stiffness affecting knees, hips, shoulders,
                elbows, and other joints.
              </p>
            </div>

            <div className="orthopedic-condition">
              <div className="orthopedic-condition-icon">🦴</div>

              <h3>Fractures</h3>

              <p>
                Bone injuries requiring assessment, stabilization, and
                appropriate recovery care.
              </p>
            </div>

            <div className="orthopedic-condition">
              <div className="orthopedic-condition-icon">💪</div>

              <h3>Muscle Injuries</h3>

              <p>
                Strains and other injuries affecting muscles and soft
                tissues.
              </p>
            </div>

            <div className="orthopedic-condition">
              <div className="orthopedic-condition-icon">🏃</div>

              <h3>Sports Injuries</h3>

              <p>
                Injuries affecting athletes and active individuals during
                exercise or sports.
              </p>
            </div>

            <div className="orthopedic-condition">
              <div className="orthopedic-condition-icon">🦶</div>

              <h3>Foot & Ankle</h3>

              <p>
                Conditions causing pain or difficulty with walking and
                everyday movement.
              </p>
            </div>

            <div className="orthopedic-condition">
              <div className="orthopedic-condition-icon">🖐️</div>

              <h3>Hand & Wrist</h3>

              <p>
                Conditions affecting hand, wrist, finger movement, and
                function.
              </p>
            </div>

            <div className="orthopedic-condition">
              <div className="orthopedic-condition-icon">🧍</div>

              <h3>Spine Problems</h3>

              <p>
                Back and neck conditions that may affect comfort and
                mobility.
              </p>
            </div>

            <div className="orthopedic-condition">
              <div className="orthopedic-condition-icon">🦿</div>

              <h3>Arthritis</h3>

              <p>
                Joint conditions that may cause pain, swelling, stiffness,
                and reduced movement.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            SERVICES
        ========================================= */}

        <section>
          <div className="orthopedic-section-heading">
            <h2>Orthopedic Services</h2>

            <p>
              Explore orthopedic treatments and services available
              through the MediCo healthcare network.
            </p>
          </div>

          <div className="orthopedic-services">
            {orthopedicServices.map((service) => (
              <article
                className="orthopedic-service"
                key={service.title}
              >
                <div className="orthopedic-service-top">
                  <div className="orthopedic-service-icon">
                    {service.icon}
                  </div>

                  <h3>{service.title}</h3>
                </div>

                <p>{service.description}</p>

                <div className="orthopedic-feature-title">
                  Treatment Includes
                </div>

                <ul className="orthopedic-feature-list">
                  {service.features.map((feature) => (
                    <li key={feature}>
                      <span className="orthopedic-check">
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
            TREATMENT PROCESS
        ========================================= */}

        <section className="orthopedic-treatment-section">
          <div className="orthopedic-section-heading">
            <h2>Your Orthopedic Care Journey</h2>

            <p>
              A structured approach to orthopedic evaluation, treatment,
              recovery, and ongoing care.
            </p>
          </div>

          <div className="orthopedic-treatment-box">
            <div className="orthopedic-treatment-step">
              <div className="orthopedic-step-number">01</div>

              <h3>Evaluation</h3>

              <p>
                Discuss symptoms, medical history, injury details, and
                mobility concerns with a specialist.
              </p>
            </div>

            <div className="orthopedic-treatment-step">
              <div className="orthopedic-step-number">02</div>

              <h3>Diagnosis</h3>

              <p>
                Appropriate physical examinations and diagnostic tests
                help identify the underlying condition.
              </p>
            </div>

            <div className="orthopedic-treatment-step">
              <div className="orthopedic-step-number">03</div>

              <h3>Treatment</h3>

              <p>
                Receive a personalized treatment plan that may include
                medicines, therapy, procedures, or surgery when appropriate.
              </p>
            </div>

            <div className="orthopedic-treatment-step">
              <div className="orthopedic-step-number">04</div>

              <h3>Recovery</h3>

              <p>
                Follow-up care and rehabilitation support help restore
                movement, strength, and daily function.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            CTA
        ========================================= */}

        <section className="orthopedic-cta">
          <div>
            <h2>Need Orthopedic Treatment?</h2>

            <p>
              Connect with a qualified orthopedic specialist to discuss
              joint pain, injuries, fractures, mobility problems, or other
              musculoskeletal concerns.
            </p>
          </div>

          <div className="orthopedic-cta-actions">
            <button
              className="orthopedic-cta-button primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Doctor
            </button>

            <button
              className="orthopedic-cta-button secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </section>

        {/* =========================================
            EMERGENCY
        ========================================= */}

        <section className="orthopedic-emergency">
          <div className="orthopedic-emergency-content">
            <div className="orthopedic-emergency-icon">
              🚑
            </div>

            <div>
              <h3>Serious Injury or Medical Emergency?</h3>

              <p>
                For severe injuries, major trauma, suspected fractures,
                or other emergencies, seek immediate medical attention.
              </p>
            </div>
          </div>

          <button
            className="orthopedic-emergency-button"
            onClick={() => navigate("/services/emergency")}
          >
            Emergency Services
          </button>
        </section>

      </main>
    </div>
  );
}
