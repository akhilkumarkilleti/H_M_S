import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AMBULANCE_REQUEST_FORM_ENDPOINT = "https://formspree.io/f/xyeyrvwl";

export default function AmbulanceService() {
  const navigate = useNavigate();
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestError, setRequestError] = useState("");

  const ambulanceTypes = [
    {
      icon: "🚑",
      title: "Basic Life Support Ambulance",
      description:
        "Designed for patients who require safe transportation and basic medical support during transfer.",
      features: [
        "Patient transportation",
        "Basic monitoring",
        "First-aid support",
        "Oxygen availability",
      ],
    },
    {
      icon: "❤️",
      title: "Advanced Life Support Ambulance",
      description:
        "Equipped for patients who require continuous monitoring and advanced medical care during transportation.",
      features: [
        "Advanced patient monitoring",
        "Oxygen support",
        "Emergency medicines",
        "Critical care support",
      ],
    },
    {
      icon: "🏥",
      title: "ICU Ambulance",
      description:
        "Specialized ambulance support for critically ill patients requiring intensive monitoring during transfer.",
      features: [
        "ICU-level monitoring",
        "Ventilator support",
        "Cardiac monitoring",
        "Trained medical team",
      ],
    },
    {
      icon: "👶",
      title: "Neonatal Ambulance",
      description:
        "Specialized transportation support for newborn babies who require medical supervision during transfer.",
      features: [
        "Newborn transportation",
        "Temperature support",
        "Neonatal monitoring",
        "Specialized equipment",
      ],
    },
  ];

  const ambulanceServices = [
    {
      icon: "🚨",
      title: "Emergency Response",
      description:
        "Rapid ambulance assistance for medical emergencies requiring immediate transportation and medical support.",
    },
    {
      icon: "🫀",
      title: "Cardiac Emergency Transfer",
      description:
        "Transportation support for patients experiencing serious heart-related emergencies requiring hospital care.",
    },
    {
      icon: "🧠",
      title: "Stroke Transfer",
      description:
        "Urgent transportation for patients with suspected stroke symptoms requiring immediate medical evaluation.",
    },
    {
      icon: "🏥",
      title: "Hospital-to-Hospital Transfer",
      description:
        "Safe transfer of patients between hospitals when specialized treatment or facilities are required.",
    },
    {
      icon: "🛏️",
      title: "Patient Transfer",
      description:
        "Planned transportation for patients who need medical assistance while travelling to or from a healthcare facility.",
    },
    {
      icon: "✈️",
      title: "Long-Distance Medical Transfer",
      description:
        "Medical transportation support for patients requiring longer-distance transfers with appropriate supervision.",
    },
  ];

  const submitAmbulanceRequest = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmittingRequest(true);
    setRequestError("");
    try {
      const response = await fetch("https://formspree.io/f/mkjjwdna", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Request submission failed");
      form.reset();
      setIsRequestFormOpen(false);
      window.alert("Ambulance request submitted successfully!");
    } catch (error) {
      console.error("Ambulance request submission error:", error);
      setRequestError("Unable to submit your ambulance request. Please try again or call the hospital.");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const emergencySigns = [
    "Severe chest pain or pressure",
    "Difficulty breathing or severe shortness of breath",
    "Sudden weakness or paralysis",
    "Difficulty speaking or understanding speech",
    "Loss of consciousness",
    "Severe bleeding",
    "Serious accident or traumatic injury",
    "Severe burns",
    "Uncontrolled seizures",
    "Any rapidly worsening medical condition",
  ];

  return (
    <div className="ambulance-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .ambulance-page {
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

        .ambulance-page button {
          font-family: inherit;
        }

        /* =====================================================
           HERO
        ===================================================== */

        .ambulance-hero {
          position: relative;
          overflow: hidden;
          padding: 75px 20px;
          color: white;
          text-align: center;

          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(255,255,255,0.12),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #991b1b 0%,
              #dc2626 48%,
              #b91c1c 100%
            );
        }

        .ambulance-hero::after {
          content: "";
          position: absolute;
          width: 320px;
          height: 320px;
          right: -100px;
          bottom: -180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }

        .ambulance-hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
        }

        .ambulance-hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 15px;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 30px;
          background: rgba(255,255,255,0.10);
          color: #fee2e2;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .ambulance-hero h1 {
          margin: 18px 0 14px;
          font-size: clamp(36px, 5vw, 54px);
          line-height: 1.08;
          font-weight: 800;
        }

        .ambulance-hero p {
          max-width: 780px;
          margin: 0 auto;
          color: #fee2e2;
          font-size: 16px;
          line-height: 1.8;
        }

        .ambulance-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .ambulance-hero-button {
          min-height: 45px;
          padding: 0 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .ambulance-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #b91c1c;
        }

        .ambulance-hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 9px 22px rgba(0,0,0,0.18);
        }

        .ambulance-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.55);
          background: transparent;
          color: white;
        }

        .ambulance-hero-button.secondary:hover {
          background: rgba(255,255,255,0.1);
        }

        /* =====================================================
           CONTAINER
        ===================================================== */

        .ambulance-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 55px 0 80px;
        }

        .ambulance-section-heading {
          margin-bottom: 38px;
          text-align: center;
        }

        .ambulance-section-heading h2 {
          margin: 0 0 11px;
          color: #173550;
          font-size: 30px;
          font-weight: 800;
        }

        .ambulance-section-heading p {
          max-width: 760px;
          margin: 0 auto;
          color: #738392;
          font-size: 14px;
          line-height: 1.8;
        }

        /* =====================================================
           INTRO
        ===================================================== */

        .ambulance-intro {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 24px;
          margin-bottom: 55px;
        }

        .ambulance-intro-card,
        .ambulance-intro-side {
          padding: 30px;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .ambulance-intro-card h2 {
          margin: 0 0 14px;
          color: #173550;
          font-size: 27px;
        }

        .ambulance-intro-card p {
          margin: 0 0 13px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.8;
        }

        .ambulance-intro-card p:last-child {
          margin-bottom: 0;
        }

        .ambulance-intro-side {
          background:
            linear-gradient(
              145deg,
              #fff1f2,
              #ffffff
            );
        }

        .ambulance-intro-side h3 {
          margin: 0 0 18px;
          color: #173550;
          font-size: 20px;
        }

        .ambulance-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 17px;
        }

        .ambulance-highlight:last-child {
          margin-bottom: 0;
        }

        .ambulance-highlight-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #fee2e2;
          font-size: 17px;
        }

        .ambulance-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #29465e;
          font-size: 13px;
        }

        .ambulance-highlight span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =====================================================
           EMERGENCY CALL BANNER
        ===================================================== */

        .ambulance-call-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 55px;
          padding: 24px 28px;
          border-radius: 14px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
        }

        .ambulance-call-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .ambulance-call-icon {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #dc2626;
          color: white;
          font-size: 24px;
        }

        .ambulance-call-left h3 {
          margin: 0 0 5px;
          color: #991b1b;
          font-size: 18px;
        }

        .ambulance-call-left p {
          margin: 0;
          color: #9f5b5b;
          font-size: 12px;
          line-height: 1.5;
        }

        .ambulance-call-button {
          min-height: 43px;
          padding: 0 19px;
          border: 0;
          border-radius: 8px;
          background: #dc2626;
          color: white;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .ambulance-call-button:hover {
          background: #b91c1c;
        }

        /* =====================================================
           SERVICES
        ===================================================== */

        .ambulance-services {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .ambulance-service-card {
          padding: 25px;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .ambulance-service-card:hover {
          transform: translateY(-4px);
          border-color: #fecdd3;
          box-shadow: 0 15px 35px rgba(30,60,80,0.09);
        }

        .ambulance-service-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          border-radius: 12px;
          background: #fff1f2;
          font-size: 26px;
        }

        .ambulance-service-card h3 {
          margin: 0 0 9px;
          color: #18364f;
          font-size: 18px;
        }

        .ambulance-service-card p {
          margin: 0;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        /* =====================================================
           AMBULANCE TYPES
        ===================================================== */

        .ambulance-types-section {
          margin-top: 60px;
        }

        .ambulance-types {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .ambulance-type-card {
          position: relative;
          overflow: hidden;
          padding: 27px;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .ambulance-type-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #dc2626;
        }

        .ambulance-type-top {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .ambulance-type-icon {
          width: 58px;
          height: 58px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #fff1f2;
          font-size: 28px;
        }

        .ambulance-type-card h3 {
          margin: 0;
          color: #18364f;
          font-size: 19px;
        }

        .ambulance-type-card > p {
          margin: 0 0 17px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .ambulance-type-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .ambulance-type-features li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5d7282;
          font-size: 12px;
        }

        .ambulance-check {
          width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fee2e2;
          color: #dc2626;
          font-size: 9px;
          font-weight: 800;
        }

        /* =====================================================
           PROCESS
        ===================================================== */

        .ambulance-process-section {
          margin-top: 60px;
        }

        .ambulance-process {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .ambulance-process-step {
          padding: 28px 20px;
          text-align: center;
          border-right: 1px solid #edf1f3;
        }

        .ambulance-process-step:last-child {
          border-right: none;
        }

        .ambulance-step-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 13px;
          border-radius: 50%;
          background: #fee2e2;
          color: #dc2626;
          font-size: 12px;
          font-weight: 800;
        }

        .ambulance-process-step h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 15px;
        }

        .ambulance-process-step p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =====================================================
           WHEN TO CALL
        ===================================================== */

        .ambulance-warning-section {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 25px;
          margin-top: 60px;
        }

        .ambulance-warning-info {
          padding: 30px;
          border-radius: 15px;
          background: #102d45;
          color: white;
        }

        .ambulance-warning-info h2 {
          margin: 0 0 12px;
          font-size: 25px;
        }

        .ambulance-warning-info p {
          margin: 0;
          color: #c5d7e2;
          font-size: 13px;
          line-height: 1.8;
        }

        .ambulance-warning-list {
          padding: 30px;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .ambulance-warning-list h3 {
          margin: 0 0 18px;
          color: #173550;
          font-size: 19px;
        }

        .ambulance-warning-items {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px 20px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .ambulance-warning-items li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #617585;
          font-size: 12px;
          line-height: 1.5;
        }

        .warning-icon {
          color: #dc2626;
          font-weight: 900;
        }

        /* =====================================================
           SAFETY
        ===================================================== */

        .ambulance-safety {
          margin-top: 60px;
        }

        .ambulance-safety-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .ambulance-safety-card {
          padding: 25px;
          background: #ffffff;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
        }

        .ambulance-safety-card h3 {
          margin: 0 0 9px;
          color: #28455a;
          font-size: 16px;
        }

        .ambulance-safety-card p {
          margin: 0;
          color: #71818d;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =====================================================
           CTA
        ===================================================== */

        .ambulance-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-top: 60px;
          padding: 35px;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #102d45,
              #164b63
            );
          color: white;
        }

        .ambulance-cta h2 {
          margin: 0 0 9px;
          font-size: 25px;
        }

        .ambulance-cta p {
          max-width: 680px;
          margin: 0;
          color: #bcd1dd;
          font-size: 14px;
          line-height: 1.7;
        }

        .ambulance-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .ambulance-cta-button {
          min-height: 43px;
          padding: 0 19px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .ambulance-cta-button.primary {
          border: 1px solid #dc2626;
          background: #dc2626;
          color: white;
        }

        .ambulance-cta-button.primary:hover {
          background: #b91c1c;
        }

        .ambulance-cta-button.secondary {
          border: 1px solid #557587;
          background: transparent;
          color: white;
        }

        .ambulance-cta-button.secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        /* =====================================================
           DISCLAIMER
        ===================================================== */

        .ambulance-disclaimer {
          margin-top: 22px;
          padding: 20px 25px;
          border: 1px solid #e2e9ee;
          border-radius: 12px;
          background: #ffffff;
        }

        .ambulance-disclaimer strong {
          color: #334d62;
          font-size: 13px;
        }

        .ambulance-disclaimer p {
          margin: 7px 0 0;
          color: #7a8995;
          font-size: 11px;
          line-height: 1.6;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 950px) {
          .ambulance-intro {
            grid-template-columns: 1fr;
          }

          .ambulance-services {
            grid-template-columns: repeat(2, 1fr);
          }

          .ambulance-process {
            grid-template-columns: repeat(2, 1fr);
          }

          .ambulance-process-step:nth-child(2) {
            border-right: none;
          }

          .ambulance-process-step:nth-child(-n + 2) {
            border-bottom: 1px solid #edf1f3;
          }

          .ambulance-warning-section {
            grid-template-columns: 1fr;
          }

          .ambulance-safety-grid {
            grid-template-columns: 1fr 1fr;
          }

          .ambulance-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 650px) {
          .ambulance-hero {
            padding: 55px 18px;
          }

          .ambulance-hero h1 {
            font-size: 35px;
          }

          .ambulance-hero p {
            font-size: 14px;
          }

          .ambulance-container {
            width: 92%;
            padding: 40px 0 60px;
          }

          .ambulance-section-heading h2 {
            font-size: 26px;
          }

          .ambulance-intro-card,
          .ambulance-intro-side {
            padding: 23px;
          }

          .ambulance-call-banner {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .ambulance-call-button {
            width: 100%;
          }

          .ambulance-services {
            grid-template-columns: 1fr;
          }

          .ambulance-types {
            grid-template-columns: 1fr;
          }

          .ambulance-process {
            grid-template-columns: 1fr;
          }

          .ambulance-process-step {
            border-right: none !important;
            border-bottom: 1px solid #edf1f3;
          }

          .ambulance-process-step:last-child {
            border-bottom: none;
          }

          .ambulance-warning-items {
            grid-template-columns: 1fr;
          }

          .ambulance-safety-grid {
            grid-template-columns: 1fr;
          }

          .ambulance-cta {
            padding: 27px 22px;
          }

          .ambulance-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .ambulance-cta-button {
            width: 100%;
          }
        }

        .ambulance-request-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(15, 23, 42, 0.64);
        }

        .ambulance-request-dialog {
          width: min(100%, 620px);
          max-height: min(92vh, 850px);
          overflow-y: auto;
          padding: 26px;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
        }

        .ambulance-request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 20px;
        }

        .ambulance-request-header span {
          color: #0f766e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .ambulance-request-header h2 {
          margin: 6px 0;
          color: #17324d;
          font-size: 25px;
        }

        .ambulance-request-header p,
        .ambulance-request-note {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .ambulance-request-close {
          width: 36px;
          height: 36px;
          flex: 0 0 auto;
          border: 0;
          border-radius: 50%;
          background: #f1f5f9;
          color: #334155;
          font-size: 24px;
          cursor: pointer;
        }

        .ambulance-request-form {
          display: grid;
          gap: 14px;
        }

        .ambulance-request-form > label {
          display: grid;
          gap: 6px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .ambulance-request-form input,
        .ambulance-request-form textarea,
        .ambulance-request-form select {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #fff;
          color: #17324d;
          font: inherit;
          font-size: 14px;
        }

        .ambulance-request-form input:focus,
        .ambulance-request-form textarea:focus,
        .ambulance-request-form select:focus {
          outline: 3px solid rgba(15, 118, 110, 0.16);
          border-color: #0f766e;
        }

        .ambulance-request-form textarea {
          resize: vertical;
        }

        .ambulance-request-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 4px;
        }

        .ambulance-request-actions button {
          min-height: 42px;
          padding: 10px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #fff;
          color: #334155;
          font-weight: 700;
          cursor: pointer;
        }

        .ambulance-request-actions button[type="submit"] {
          border-color: #0f766e;
          background: #0f766e;
          color: #fff;
        }

        .ambulance-request-actions button:disabled,
        .ambulance-request-close:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .ambulance-request-error {
          margin: 0 0 14px;
          padding: 11px 12px;
          border: 1px solid #fecaca;
          border-radius: 8px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 13px;
        }

        .ambulance-request-note {
          text-align: center;
        }

        @media (max-width: 520px) {
          .ambulance-request-dialog {
            padding: 20px 16px;
          }

          .ambulance-request-actions {
            flex-direction: column-reverse;
          }
        }
      `}</style>

      {isRequestFormOpen && (
        <div className="ambulance-request-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmittingRequest) setIsRequestFormOpen(false); }}>
          <section className="ambulance-request-dialog" role="dialog" aria-modal="true" aria-labelledby="ambulance-request-title">
            <header className="ambulance-request-header">
              <div><span>AMBULANCE SERVICE</span><h2 id="ambulance-request-title">Request an Ambulance</h2><p>Share your contact and pickup details. Our team will follow up.</p></div>
              <button type="button" className="ambulance-request-close" onClick={() => setIsRequestFormOpen(false)} disabled={isSubmittingRequest} aria-label="Close request form">×</button>
            </header>
            {requestError && <p className="ambulance-request-error" role="alert">{requestError}</p>}
            <form className="ambulance-request-form" onSubmit={submitAmbulanceRequest}>
              <input type="hidden" name="_subject" value="Ambulance Request" />
              <label>Patient name *<input name="patientName" type="text" autoComplete="name" maxLength={100} required /></label>
              <label>Patient mobile number *<input name="patientMobile" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+() -]{7,20}" title="Enter a valid phone number" maxLength={20} required /></label>
              <label>Pickup location / full address *<textarea name="pickupLocation" rows={2} maxLength={500} autoComplete="street-address" required /></label>
              <label>Destination hospital / location<input name="destination" type="text" maxLength={200} /></label>
              <label>Ambulance type *<select name="ambulanceType" defaultValue="" required><option value="" disabled>Select ambulance type</option>{ambulanceTypes.map((type) => <option key={type.title} value={type.title}>{type.title}</option>)}</select></label>
              <label>Emergency or patient details<textarea name="emergencyDetails" rows={3} maxLength={1000} placeholder="Briefly describe the patient's condition or support needed" /></label>
              <div className="ambulance-request-actions">
                <button type="button" onClick={() => setIsRequestFormOpen(false)} disabled={isSubmittingRequest}>Cancel</button>
                <button type="submit" disabled={isSubmittingRequest}>{isSubmittingRequest ? "Submitting…" : "Submit Request"}</button>
              </div>
              <p className="ambulance-request-note">For a life-threatening emergency, call emergency services immediately.</p>
            </form>
          </section>
        </div>
      )}

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="ambulance-hero">
        <div className="ambulance-hero-content">

          <span className="ambulance-hero-badge">
            🚑 Emergency Medical Transportation
          </span>

          <h1>24/7 Ambulance Services</h1>

          <p>
            Reliable emergency medical transportation and patient
            transfer services designed to provide timely support,
            safe transportation, and appropriate medical care while
            travelling to a healthcare facility.
          </p>

          <div className="ambulance-hero-actions">

            <button
              className="ambulance-hero-button primary"
              onClick={() => { setRequestError(""); setIsRequestFormOpen(true); }}
            >
              Request Ambulance
            </button>


          </div>

        </div>
      </section>

      <main className="ambulance-container">

        {/* ===================================================
            INTRO
        =================================================== */}

        <section className="ambulance-intro">

          <div className="ambulance-intro-card">

            <h2>
              Emergency Ambulance & Patient Transport
            </h2>

            <p>
              An ambulance provides specialized transportation
              for patients who need medical assistance while
              travelling to a hospital or healthcare facility.
            </p>

            <p>
              MediCo ambulance services are designed to support
              patients during emergencies, planned transfers,
              hospital-to-hospital transfers, and other situations
              where medical supervision during transportation may
              be required.
            </p>

            <p>
              Depending on the patient's condition, an appropriate
              ambulance type and level of medical support can be
              arranged.
            </p>

            <p>
              Ambulance transportation should be considered when
              moving a patient by private vehicle could be unsafe,
              especially when the patient may require monitoring,
              oxygen, or medical assistance during transportation.
            </p>

          </div>

          <div className="ambulance-intro-side">

            <h3>
              Our Ambulance Support
            </h3>

            <div className="ambulance-highlight">

              <div className="ambulance-highlight-icon">
                🚨
              </div>

              <div>
                <strong>
                  Emergency Response
                </strong>

                <span>
                  Ambulance assistance for urgent medical situations.
                </span>
              </div>

            </div>

            <div className="ambulance-highlight">

              <div className="ambulance-highlight-icon">
                🩺
              </div>

              <div>
                <strong>
                  Medical Monitoring
                </strong>

                <span>
                  Appropriate monitoring and support during transport.
                </span>
              </div>

            </div>

            <div className="ambulance-highlight">

              <div className="ambulance-highlight-icon">
                🏥
              </div>

              <div>
                <strong>
                  Hospital Transfers
                </strong>

                <span>
                  Safe transfer between healthcare facilities.
                </span>
              </div>

            </div>

            <div className="ambulance-highlight">

              <div className="ambulance-highlight-icon">
                ❤️
              </div>

              <div>
                <strong>
                  Patient-Focused Care
                </strong>

                <span>
                  Transportation planned around the patient's needs.
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            EMERGENCY BANNER
        =================================================== */}

        <section className="ambulance-call-banner">

          <div className="ambulance-call-left">

            <div className="ambulance-call-icon">
              ☎
            </div>

            <div>

              <h3>
                Medical Emergency?
              </h3>

              <p>
                If someone is experiencing a life-threatening
                emergency, seek immediate emergency medical help.
              </p>

            </div>

          </div>

          <button
            className="ambulance-call-button"
            onClick={() =>
              navigate("/services/emergency")
            }
          >
            Emergency Services
          </button>

        </section>

        {/* ===================================================
            SERVICES
        =================================================== */}

        <section>

          <div className="ambulance-section-heading">

            <h2>
              Ambulance Services
            </h2>

            <p>
              Ambulance transportation can be arranged for
              emergency response, patient transfers, and
              specialized medical transportation needs.
            </p>

          </div>

          <div className="ambulance-services">

            {ambulanceServices.map((service) => (

              <article
                className="ambulance-service-card"
                key={service.title}
              >

                <div className="ambulance-service-icon">
                  {service.icon}
                </div>

                <h3>
                  {service.title}
                </h3>

                <p>
                  {service.description}
                </p>

              </article>

            ))}

          </div>

        </section>

        {/* ===================================================
            AMBULANCE TYPES
        =================================================== */}

        <section className="ambulance-types-section">

          <div className="ambulance-section-heading">

            <h2>
              Types of Ambulance Support
            </h2>

            <p>
              Different ambulance configurations may be used
              depending on the patient's medical condition and
              transportation requirements.
            </p>

          </div>

          <div className="ambulance-types">

            {ambulanceTypes.map((type) => (

              <article
                className="ambulance-type-card"
                key={type.title}
              >

                <div className="ambulance-type-top">

                  <div className="ambulance-type-icon">
                    {type.icon}
                  </div>

                  <h3>
                    {type.title}
                  </h3>

                </div>

                <p>
                  {type.description}
                </p>

                <ul className="ambulance-type-features">

                  {type.features.map((feature) => (

                    <li key={feature}>

                      <span className="ambulance-check">
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

        {/* ===================================================
            PROCESS
        =================================================== */}

        <section className="ambulance-process-section">

          <div className="ambulance-section-heading">

            <h2>
              Ambulance Service Process
            </h2>

            <p>
              The response process may vary depending on the
              urgency of the situation and the patient's medical
              requirements.
            </p>

          </div>

          <div className="ambulance-process">

            <div className="ambulance-process-step">

              <div className="ambulance-step-number">
                01
              </div>

              <h3>
                Request Assistance
              </h3>

              <p>
                Provide the patient's location and explain the
                emergency or transportation requirement.
              </p>

            </div>

            <div className="ambulance-process-step">

              <div className="ambulance-step-number">
                02
              </div>

              <h3>
                Assessment
              </h3>

              <p>
                Relevant information helps determine the
                appropriate ambulance and medical support.
              </p>

            </div>

            <div className="ambulance-process-step">

              <div className="ambulance-step-number">
                03
              </div>

              <h3>
                Transportation
              </h3>

              <p>
                The patient is transported to the appropriate
                healthcare facility with suitable support.
              </p>

            </div>

            <div className="ambulance-process-step">

              <div className="ambulance-step-number">
                04
              </div>

              <h3>
                Hospital Handover
              </h3>

              <p>
                Patient information is communicated to the
                receiving healthcare team.
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            WHEN TO CALL
        =================================================== */}

        <section className="ambulance-warning-section">

          <div className="ambulance-warning-info">

            <h2>
              When Should You Call an Ambulance?
            </h2>

            <p>
              An ambulance may be appropriate when a person's
              condition could be life-threatening or when they
              require medical support during transportation.
            </p>

            <p style={{ marginTop: "15px" }}>
              When in doubt about a serious emergency, seek
              professional emergency medical assistance rather
              than attempting to transport a severely ill or
              injured person yourself.
            </p>

          </div>

          <div className="ambulance-warning-list">

            <h3>
              Possible Emergency Situations
            </h3>

            <ul className="ambulance-warning-items">

              {emergencySigns.map((sign) => (

                <li key={sign}>

                  <span className="warning-icon">
                    !
                  </span>

                  {sign}

                </li>

              ))}

            </ul>

          </div>

        </section>

        {/* ===================================================
            SAFETY
        =================================================== */}

        <section className="ambulance-safety">

          <div className="ambulance-section-heading">

            <h2>
              Patient Safety During Transport
            </h2>

            <p>
              Safe medical transportation involves appropriate
              preparation, monitoring, communication, and transfer
              of care.
            </p>

          </div>

          <div className="ambulance-safety-grid">

            <div className="ambulance-safety-card">

              <h3>
                🩺 Patient Monitoring
              </h3>

              <p>
                Patients may require observation of vital signs
                and clinical condition during transportation.
              </p>

            </div>

            <div className="ambulance-safety-card">

              <h3>
                💨 Oxygen Support
              </h3>

              <p>
                Oxygen support may be available when clinically
                appropriate and when required by the patient's
                condition.
              </p>

            </div>

            <div className="ambulance-safety-card">

              <h3>
                📋 Medical Information
              </h3>

              <p>
                Relevant medical records, medication information,
                allergies, and recent treatment details can help
                the receiving team provide appropriate care.
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            CTA
        =================================================== */}

        <section className="ambulance-cta">

          <div>

            <h2>
              Need Ambulance Assistance?
            </h2>

            <p>
              For emergencies, seek immediate emergency medical
              assistance. For planned patient transfers, contact
              the healthcare team to discuss the appropriate
              transportation arrangements.
            </p>

          </div>

          <div className="ambulance-cta-actions">

            <button
              className="ambulance-cta-button primary"
              onClick={() =>
                navigate("/services/emergency")
              }
            >
              Emergency Services
            </button>

            <button
              className="ambulance-cta-button secondary"
              onClick={() =>
                navigate("/contact")
              }
            >
              Contact Us
            </button>

          </div>

        </section>

        {/* ===================================================
            DISCLAIMER
        =================================================== */}

        <section className="ambulance-disclaimer">

          <strong>
            Important Emergency Information
          </strong>

          <p>
            This page provides general information about ambulance
            and emergency transportation services and is not a
            substitute for professional medical advice. In a
            life-threatening emergency, contact your local emergency
            medical service immediately. Ambulance availability,
            equipment, response times, and medical personnel may
            vary by location and patient requirements.
          </p>

        </section>

      </main>
    </div>
  );
}
