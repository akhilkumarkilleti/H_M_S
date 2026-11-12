import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DONOR_REQUEST_FORM_ENDPOINT = "https://formspree.io/f/xyeyrvwl";

export default function HealthDonationsPage() {
  const navigate = useNavigate();
  const [isDonorFormOpen, setIsDonorFormOpen] = useState(false);
  const [isSubmittingDonor, setIsSubmittingDonor] = useState(false);
  const [donorFormError, setDonorFormError] = useState("");

  const submitDonorForm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmittingDonor(true);
    setDonorFormError("");
    try {
      const response = await fetch("https://formspree.io/f/xbggrndn", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Donor registration failed");
      form.reset();
      setIsDonorFormOpen(false);
      window.alert("Thank you! Your donor registration was submitted successfully.");
    } catch (error) {
      console.error("Donor form submission error:", error);
      setDonorFormError("Unable to submit your donor registration. Please try again.");
    } finally {
      setIsSubmittingDonor(false);
    }
  };

  const bloodDonationTypes = [
    {
      icon: "🩸",
      title: "Whole Blood Donation",
      description:
        "Whole blood donation collects blood that can be separated into red blood cells, plasma, and platelets for use in patient care.",
      points: [
        "Used for surgeries and trauma care",
        "Supports patients with blood loss",
        "Can help multiple patients after processing",
        "Requires basic donor screening",
      ],
    },
    {
      icon: "🔴",
      title: "Red Blood Cell Donation",
      description:
        "Red blood cells carry oxygen throughout the body and are especially important for patients with significant blood loss or certain blood disorders.",
      points: [
        "Important for anemia and blood loss",
        "Used during major surgeries",
        "Supports trauma patients",
        "Blood group compatibility is essential",
      ],
    },
    {
      icon: "🟡",
      title: "Platelet Donation",
      description:
        "Platelets help blood clot and are particularly important for patients with very low platelet counts or those undergoing certain cancer treatments.",
      points: [
        "Supports clotting",
        "Important during some cancer treatments",
        "Used for patients with low platelet counts",
        "Collected using specialized equipment",
      ],
    },
    {
      icon: "💛",
      title: "Plasma Donation",
      description:
        "Plasma is the liquid component of blood and contains proteins and other substances that support circulation and clotting.",
      points: [
        "Supports clotting-related care",
        "Used in selected medical conditions",
        "Contains important blood proteins",
        "Collected under supervised conditions",
      ],
    },
  ];

  const organDonationTypes = [
    {
      icon: "❤️",
      title: "Heart Donation",
      description:
        "A donated heart may provide a life-saving transplant option for carefully selected patients with severe heart failure.",
      organs: "Heart",
    },
    {
      icon: "🫁",
      title: "Lung Donation",
      description:
        "Lung transplantation can be considered for patients with advanced lung disease when other treatment options are no longer sufficient.",
      organs: "One or both lungs",
    },
    {
      icon: "🧠",
      title: "Kidney Donation",
      description:
        "Kidneys are among the most commonly transplanted organs. Living and deceased donation programs may support patients with kidney failure.",
      organs: "One kidney",
    },
    {
      icon: "🧬",
      title: "Liver Donation",
      description:
        "The liver has a unique ability to regenerate. Selected living donors may donate part of their liver, while deceased donation can provide a complete organ.",
      organs: "Part or whole liver",
    },
    {
      icon: "🩺",
      title: "Pancreas Donation",
      description:
        "Pancreas transplantation may be considered for selected patients with severe diabetes and specific medical indications.",
      organs: "Pancreas",
    },
    {
      icon: "👁️",
      title: "Eye / Corneal Donation",
      description:
        "Corneal donation can help restore vision for people with certain corneal diseases or injuries.",
      organs: "Corneal tissue",
    },
  ];

  const donationSteps = [
    {
      number: "01",
      title: "Registration",
      description:
        "Express your interest in donating and provide the required personal and medical information.",
    },
    {
      number: "02",
      title: "Health Seening",
      description:
        "A qualified healthcare team assesses your health and determines whether donation is appropriate.",
    },
    {
      number: "03",
      title: "Consent",
      description:
        "Donation decisions and consent are documented according to applicable medical and legal requirements.",
    },
    {
      number: "04",
      title: "Donation",
      description:
        "The donation is performed using appropriate medical procedures and strict safety protocols.",
    },
    {
      number: "05",
      title: "Processing",
      description:
        "Blood components or donated organs and tissues are prepared, tested, matched, and allocated appropriately.",
    },
    {
      number: "06",
      title: "Patient Care",
      description:
        "Donated blood, organs, or tissues are provided to eligible patients who need them.",
    },
  ];

  const bloodEligibility = [
    "Generally healthy and feeling well on the day of donation",
    "Meet the minimum age and weight requirements applicable to the donation program",
    "Pass the required health and hemoglobin screening",
    "Provide accurate information about medical history and medications",
    "Follow the blood bank's instructions before and after donation",
  ];

  const organDonationConsiderations = [
    "Discuss your donation wishes with your family",
    "Register through an authorized organ donation program where applicable",
    "Provide accurate medical and personal information",
    "Understand that medical suitability is determined by specialists",
    "Donation and transplantation follow applicable laws and ethical standards",
  ];

  const faqs = [
    {
      question: "Can anyone donate blood?",
      answer:
        "Not everyone is automatically eligible. Blood donation depends on factors such as age, health, weight, hemoglobin level, medical history, medications, recent procedures, and applicable blood-bank requirements. A qualified team performs screening before donation.",
    },
    {
      question: "Does blood donation hurt?",
      answer:
        "Blood donation usually involves a brief needle insertion. Donors may experience mild discomfort, but the procedure is performed by trained healthcare professionals using sterile equipment.",
    },
    {
      question: "Can a living person donate an organ?",
      answer:
        "Yes, in selected circumstances. Living donation is possible for certain organs or portions of organs, such as one kidney or part of the liver. Donor safety and medical suitability are carefully evaluated.",
    },
    {
      question: "Can organ donation happen after death?",
      answer:
        "Yes. Depending on medical circumstances and applicable legal requirements, organs and tissues from eligible deceased donors may be donated for transplantation.",
    },
    {
      question: "Does organ donation affect the funeral?",
      answer:
        "Donation procedures are performed with respect for the donor and family. Specific arrangements depend on the type of donation, medical circumstances, cultural considerations, and applicable regulations.",
    },
    {
      question: "Where should I register for organ donation?",
      answer:
        "Registration should be completed through an authorized organ and tissue donation organization or applicable government-recognized program in your region.",
    },
  ];

  return (
    <div className="health-donations-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .health-donations-page {
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

        .health-donations-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .donation-hero {
          position: relative;
          overflow: hidden;
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

        .donation-hero::before {
          content: "";
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          top: -150px;
          left: -80px;
        }

        .donation-hero::after {
          content: "";
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          right: -120px;
          bottom: -190px;
        }

        .donation-hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: auto;
        }

        .donation-hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 15px;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 30px;
          background: rgba(255,255,255,0.1);
          color: #e0f2fe;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.9px;
          text-transform: uppercase;
        }

        .donation-hero h1 {
          margin: 18px 0 14px;
          font-size: clamp(36px, 5vw, 53px);
          line-height: 1.1;
          font-weight: 800;
        }

        .donation-hero p {
          max-width: 800px;
          margin: auto;
          color: #e0f2fe;
          font-size: 16px;
          line-height: 1.8;
        }

        .donation-hero-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .donation-hero-button {
          min-height: 44px;
          padding: 0 21px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .donation-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #0369a1;
        }

        .donation-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.6);
          background: transparent;
          color: white;
        }

        .donation-hero-button:hover {
          transform: translateY(-2px);
        }

        /* =========================================
           CONTAINER
        ========================================= */

        .donation-container {
          width: 92%;
          max-width: 1200px;
          margin: auto;
          padding: 55px 0 80px;
        }

        .donation-section-heading {
          text-align: center;
          margin-bottom: 38px;
        }

        .donation-section-heading h2 {
          margin: 0 0 11px;
          color: #173550;
          font-size: 30px;
          font-weight: 800;
        }

        .donation-section-heading p {
          max-width: 780px;
          margin: auto;
          color: #738392;
          font-size: 14px;
          line-height: 1.8;
        }

        /* =========================================
           INTRO
        ========================================= */

        .donation-intro {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 25px;
          margin-bottom: 55px;
        }

        .donation-intro-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .donation-intro-card h2 {
          margin: 0 0 14px;
          color: #173550;
          font-size: 27px;
        }

        .donation-intro-card p {
          margin: 0 0 13px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.8;
        }

        .donation-intro-card p:last-child {
          margin-bottom: 0;
        }

        .donation-impact-card {
          background:
            linear-gradient(
              145deg,
              #eaf8f8,
              #ffffff
            );
        }

        .donation-impact-card h3 {
          margin: 0 0 18px;
          color: #173550;
          font-size: 20px;
        }

        .impact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .impact-item:last-child {
          margin-bottom: 0;
        }

        .impact-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #dff4f3;
          font-size: 18px;
        }

        .impact-item strong {
          display: block;
          margin-bottom: 3px;
          color: #29465e;
          font-size: 13px;
        }

        .impact-item span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================================
           DONATION TYPES
        ========================================= */

        .donation-type-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .donation-type-card {
          position: relative;
          overflow: hidden;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          padding: 26px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease;
        }

        .donation-type-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: #159c9d;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform .25s ease;
        }

        .donation-type-card:hover {
          transform: translateY(-4px);
          border-color: #cfe4e6;
          box-shadow: 0 15px 35px rgba(30,60,80,0.09);
        }

        .donation-type-card:hover::before {
          transform: scaleY(1);
        }

        .donation-type-top {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 16px;
        }

        .donation-type-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: #eaf8f8;
          font-size: 28px;
        }

        .donation-type-card h3 {
          margin: 0;
          color: #18364f;
          font-size: 19px;
        }

        .donation-type-card p {
          margin: 0 0 18px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .donation-points {
          padding: 0;
          margin: 0;
          list-style: none;
          display: grid;
          gap: 8px;
        }

        .donation-points li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #5d7282;
          font-size: 12px;
          line-height: 1.5;
        }

        .donation-check {
          width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
          border-radius: 50%;
          background: #e7f7f5;
          color: #159c9d;
          font-size: 9px;
          font-weight: 800;
        }

        /* =========================================
           ORGAN DONATION
        ========================================= */

        .organ-section {
          margin-top: 60px;
        }

        .organ-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .organ-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          padding: 23px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
          transition: .25s ease;
        }

        .organ-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(30,60,80,0.08);
        }

        .organ-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #eef7fc;
          font-size: 24px;
          margin-bottom: 15px;
        }

        .organ-card h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 17px;
        }

        .organ-card p {
          margin: 0 0 12px;
          color: #718290;
          font-size: 12px;
          line-height: 1.7;
        }

        .organ-label {
          color: #0b78b3;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .4px;
        }

        /* =========================================
           PROCESS
        ========================================= */

        .donation-process-section {
          margin-top: 60px;
        }

        .donation-process {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .process-step {
          padding: 27px 22px;
          border-right: 1px solid #edf1f3;
          border-bottom: 1px solid #edf1f3;
        }

        .process-step:nth-child(3n) {
          border-right: none;
        }

        .process-number {
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 13px;
          border-radius: 50%;
          background: #e8f7f7;
          color: #159c9d;
          font-size: 12px;
          font-weight: 800;
        }

        .process-step h3 {
          margin: 0 0 8px;
          color: #27445a;
          font-size: 15px;
        }

        .process-step p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.65;
        }

        /* =========================================
           ELIGIBILITY
        ========================================= */

        .eligibility-section {
          margin-top: 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .eligibility-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 28px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .eligibility-card.blood {
          border-top: 4px solid #dc2626;
        }

        .eligibility-card.organ {
          border-top: 4px solid #0b78b3;
        }

        .eligibility-card h3 {
          margin: 0 0 10px;
          color: #24445a;
          font-size: 20px;
        }

        .eligibility-card > p {
          margin: 0 0 18px;
          color: #748592;
          font-size: 13px;
          line-height: 1.7;
        }

        .eligibility-list {
          display: grid;
          gap: 11px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .eligibility-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #5d7282;
          font-size: 12px;
          line-height: 1.55;
        }

        .eligibility-list span {
          color: #159c9d;
          font-weight: 900;
        }

        /* =========================================
           BENEFITS
        ========================================= */

        .benefits-section {
          margin-top: 60px;
        }

        .benefits-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .benefit-card {
          text-align: center;
          padding: 25px 18px;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
        }

        .benefit-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #eaf8f8;
          font-size: 21px;
        }

        .benefit-card h3 {
          margin: 0 0 7px;
          color: #29465e;
          font-size: 14px;
        }

        .benefit-card p {
          margin: 0;
          color: #7a8995;
          font-size: 11px;
          line-height: 1.6;
        }

        /* =========================================
           SAFETY
        ========================================= */

        .safety-section {
          margin-top: 60px;
        }

        .safety-box {
          padding: 30px;
          border-radius: 15px;
          background:
            linear-gradient(
              135deg,
              #102d45,
              #164b63
            );
          color: white;
        }

        .safety-box h2 {
          margin: 0 0 10px;
          font-size: 25px;
        }

        .safety-box > p {
          max-width: 850px;
          margin: 0 0 24px;
          color: #c5d7e0;
          font-size: 13px;
          line-height: 1.7;
        }

        .safety-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .safety-item {
          padding: 18px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px;
          background: rgba(255,255,255,.05);
        }

        .safety-item strong {
          display: block;
          margin-bottom: 5px;
          font-size: 13px;
        }

        .safety-item span {
          color: #bad0db;
          font-size: 11px;
          line-height: 1.55;
        }

        /* =========================================
           FAQ
        ========================================= */

        .faq-section {
          margin-top: 60px;
        }

        .faq-list {
          display: grid;
          gap: 12px;
        }

        .faq-item {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 12px;
          padding: 21px 23px;
        }

        .faq-item h3 {
          margin: 0 0 8px;
          color: #29465e;
          font-size: 15px;
        }

        .faq-item p {
          margin: 0;
          color: #718290;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           CTA
        ========================================= */

        .donation-cta {
          margin-top: 55px;
          padding: 35px;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #075985,
              #0f766e
            );
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .donation-cta h2 {
          margin: 0 0 8px;
          font-size: 25px;
        }

        .donation-cta p {
          max-width: 720px;
          margin: 0;
          color: #d0e6ed;
          font-size: 13px;
          line-height: 1.7;
        }

        .donation-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .donation-cta-button {
          min-height: 43px;
          padding: 0 18px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .donation-cta-button.primary {
          border: 1px solid white;
          background: white;
          color: #075985;
        }

        .donation-cta-button.secondary {
          border: 1px solid rgba(255,255,255,.5);
          background: transparent;
          color: white;
        }

        /* =========================================
           DISCLAIMER
        ========================================= */

        .donation-disclaimer {
          margin-top: 20px;
          padding: 19px 22px;
          border-radius: 11px;
          background: #fff9ed;
          border: 1px solid #f6e4bd;
          color: #80652d;
          font-size: 11px;
          line-height: 1.65;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 950px) {
          .donation-intro {
            grid-template-columns: 1fr;
          }

          .organ-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .donation-process {
            grid-template-columns: repeat(2, 1fr);
          }

          .process-step:nth-child(3n) {
            border-right: 1px solid #edf1f3;
          }

          .process-step:nth-child(2n) {
            border-right: none;
          }

          .benefits-box {
            grid-template-columns: repeat(2, 1fr);
          }

          .safety-grid {
            grid-template-columns: 1fr;
          }

          .donation-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 700px) {
          .donation-hero {
            padding: 55px 18px;
          }

          .donation-hero h1 {
            font-size: 35px;
          }

          .donation-hero p {
            font-size: 14px;
          }

          .donation-container {
            width: 92%;
            padding: 40px 0 60px;
          }

          .donation-section-heading h2 {
            font-size: 26px;
          }

          .donation-type-grid,
          .organ-grid,
          .eligibility-section,
          .donation-process {
            grid-template-columns: 1fr;
          }

          .process-step,
          .process-step:nth-child(2n),
          .process-step:nth-child(3n) {
            border-right: none;
          }

          .process-step:last-child {
            border-bottom: none;
          }

          .benefits-box {
            grid-template-columns: 1fr 1fr;
          }

          .donation-intro-card,
          .eligibility-card,
          .safety-box {
            padding: 23px;
          }

          .donation-cta {
            padding: 27px 22px;
          }

          .donation-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .donation-cta-button {
            width: 100%;
          }
        }

        @media (max-width: 430px) {
          .benefits-box {
            grid-template-columns: 1fr;
          }
        }

        .donor-form-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(15, 23, 42, 0.64);
        }

        .donor-form-dialog {
          width: min(100%, 580px);
          max-height: 92vh;
          overflow-y: auto;
          padding: 26px;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
        }

        .donor-form-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 18px;
        }

        .donor-form-header h2 {
          margin: 0 0 6px;
          color: #17324d;
          font-size: 24px;
        }

        .donor-form-header p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .donor-form-close {
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

        .donor-form-fields {
          display: grid;
          gap: 14px;
        }

        .donor-form-fields label {
          display: grid;
          gap: 6px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .donor-form-fields input,
        .donor-form-fields select,
        .donor-form-fields textarea {
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

        .donor-form-fields textarea {
          resize: vertical;
        }

        .donor-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 4px;
        }

        .donor-form-actions button {
          min-height: 42px;
          padding: 10px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #fff;
          color: #334155;
          font-weight: 700;
          cursor: pointer;
        }

        .donor-form-actions button[type="submit"] {
          border-color: #0f766e;
          background: #0f766e;
          color: #fff;
        }

        .donor-form-error {
          margin: 0 0 14px;
          padding: 11px 12px;
          border: 1px solid #fecaca;
          border-radius: 8px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 13px;
        }

        @media (max-width: 520px) {
          .donor-form-dialog { padding: 20px 16px; }
          .donor-form-actions { flex-direction: column-reverse; }
        }
      `}</style>

      {isDonorFormOpen && (
        <div className="donor-form-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmittingDonor) setIsDonorFormOpen(false); }}>
          <section className="donor-form-dialog" role="dialog" aria-modal="true" aria-labelledby="donor-form-title">
            <header className="donor-form-header">
              <div><h2 id="donor-form-title">Become a Donor</h2><p>Share a few details and our donation team will contact you.</p></div>
              <button type="button" className="donor-form-close" onClick={() => setIsDonorFormOpen(false)} disabled={isSubmittingDonor} aria-label="Close donor form">×</button>
            </header>
            {donorFormError && <p className="donor-form-error" role="alert">{donorFormError}</p>}
            <form className="donor-form-fields" onSubmit={submitDonorForm}>
              <input type="hidden" name="_subject" value="Donor Registration" />
              <label>Full name *<input name="donorName" type="text" autoComplete="name" maxLength={100} required /></label>
              <label>Mobile number *<input name="donorMobile" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+() -]{7,20}" title="Enter a valid phone number" maxLength={20} required /></label>
              <label>Donation interest *<select name="donationInterest" defaultValue="" required><option value="" disabled>Select an option</option><option>Blood donation</option><option>Organ donation</option><option>Eye or tissue donation</option><option>Not sure yet</option></select></label>
              <label>Blood group (if known)<select name="bloodGroup" defaultValue=""><option value="">Select blood group</option>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}</select></label>
              <label>City / area *<input name="city" type="text" autoComplete="address-level2" maxLength={100} required /></label>
              <label>Additional details<textarea name="additionalDetails" rows={3} maxLength={600} placeholder="Preferred time to contact or any questions" /></label>
              <div className="donor-form-actions"><button type="button" onClick={() => setIsDonorFormOpen(false)} disabled={isSubmittingDonor}>Cancel</button><button type="submit" disabled={isSubmittingDonor}>{isSubmittingDonor ? "Submitting…" : "Submit Donor Form"}</button></div>
            </form>
          </section>
        </div>
      )}

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="donation-hero">
        <div className="donation-hero-content">

          <span className="donation-hero-badge">
            Blood & Organ Donation
          </span>

          <h1>
            Give the Gift of Life
          </h1>

          <p>
            Blood and organ donation can make a profound difference
            in the lives of patients facing trauma, surgery, cancer,
            organ failure, blood disorders, and other serious medical
            conditions. Learn how donation works, who may be eligible,
            and how you can help.
          </p>

          <div className="donation-hero-actions">
            <button
              className="donation-hero-button primary"
              onClick={() => { setDonorFormError(""); setIsDonorFormOpen(true); }}
            >
              Become a Donor
            </button>

            <button
              className="donation-hero-button secondary"
              onClick={() => navigate("/finddoctors")}
            >
              Speak to a Specialist
            </button>
          </div>

        </div>
      </section>

      <main className="donation-container">

        {/* ===================================================
            INTRO
        =================================================== */}

        <section className="donation-intro">

          <div className="donation-intro-card">

            <h2>
              Why Donation Matters
            </h2>

            <p>
              Hospitals depend on voluntary blood and organ donation
              programs to support patients who need life-saving
              treatment. Blood may be needed after accidents, during
              major operations, for certain cancers and blood
              disorders, and in many other medical situations.
            </p>

            <p>
              Organ donation can provide a transplant opportunity for
              patients whose organs have permanently lost their
              ability to function. Depending on medical and legal
              circumstances, donation may occur from living donors or
              eligible deceased donors.
            </p>

            <p>
              Every donation is evaluated carefully. Donor safety,
              medical suitability, informed consent, testing,
              compatibility, ethical standards, and applicable laws
              are important parts of the donation process.
            </p>

          </div>

          <div className="donation-intro-card donation-impact-card">

            <h3>
              Your Donation Can Support
            </h3>

            <div className="impact-item">
              <div className="impact-icon">
                🚑
              </div>

              <div>
                <strong>Emergency & Trauma Care</strong>

                <span>
                  Blood components may be needed by patients with
                  significant blood loss.
                </span>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon">
                🏥
              </div>

              <div>
                <strong>Surgical Care</strong>

                <span>
                  Donated blood can support patients undergoing
                  major surgical procedures.
                </span>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon">
                🎗️
              </div>

              <div>
                <strong>Cancer Treatment</strong>

                <span>
                  Some cancer patients may require blood or platelet
                  support during treatment.
                </span>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon">
                ❤️
              </div>

              <div>
                <strong>Transplant Patients</strong>

                <span>
                  Organ donation may provide a transplant option for
                  eligible patients with organ failure.
                </span>
              </div>
            </div>

          </div>

        </section>

        {/* ===================================================
            BLOOD DONATION
        =================================================== */}

        <section>

          <div className="donation-section-heading">

            <h2>
              Blood Donation
            </h2>

            <p>
              Blood is made up of several components, each with
              important functions. Depending on a patient's needs,
              donated blood may be separated into components and
              provided individually.
            </p>

          </div>

          <div className="donation-type-grid">

            {bloodDonationTypes.map((item) => (

              <article
                className="donation-type-card"
                key={item.title}
              >

                <div className="donation-type-top">

                  <div className="donation-type-icon">
                    {item.icon}
                  </div>

                  <h3>
                    {item.title}
                  </h3>

                </div>

                <p>
                  {item.description}
                </p>

                <ul className="donation-points">

                  {item.points.map((point) => (

                    <li key={point}>

                      <span className="donation-check">
                        ✓
                      </span>

                      {point}

                    </li>

                  ))}

                </ul>

              </article>

            ))}

          </div>

        </section>

        {/* ===================================================
            ORGAN DONATION
        =================================================== */}

        <section className="organ-section">

          <div className="donation-section-heading">

            <h2>
              Organ & Tissue Donation
            </h2>

            <p>
              Organ and tissue donation can help patients with
              advanced organ failure or specific tissue-related
              conditions. The exact eligibility and allocation
              process is determined by authorized transplant teams
              and applicable regulations.
            </p>

          </div>

          <div className="organ-grid">

            {organDonationTypes.map((item) => (

              <article
                className="organ-card"
                key={item.title}
              >

                <div className="organ-icon">
                  {item.icon}
                </div>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>

                <div className="organ-label">
                  Donation: {item.organs}
                </div>

              </article>

            ))}

          </div>

        </section>

        {/* ===================================================
            DONATION PROCESS
        =================================================== */}

        <section className="donation-process-section">

          <div className="donation-section-heading">

            <h2>
              How Donation Works
            </h2>

            <p>
              Donation involves screening, consent, medical
              evaluation, collection or retrieval, testing, and
              appropriate allocation.
            </p>

          </div>

          <div className="donation-process">

            {donationSteps.map((step) => (

              <div
                className="process-step"
                key={step.number}
              >

                <div className="process-number">
                  {step.number}
                </div>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.description}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* ===================================================
            ELIGIBILITY
        =================================================== */}

        <section className="eligibility-section">

          <div className="eligibility-card blood">

            <h3>
              🩸 Blood Donation Eligibility
            </h3>

            <p>
              Eligibility requirements differ between blood
              donation programs. A trained healthcare professional
              must make the final decision after screening.
            </p>

            <ul className="eligibility-list">

              {bloodEligibility.map((item) => (

                <li key={item}>
                  <span>✓</span>
                  {item}
                </li>

              ))}

            </ul>

          </div>

          <div className="eligibility-card organ">

            <h3>
              ❤️ Organ Donation Considerations
            </h3>

            <p>
              Organ donation is carefully regulated. Medical teams
              determine suitability based on the donor's health,
              circumstances, organ condition, and applicable rules.
            </p>

            <ul className="eligibility-list">

              {organDonationConsiderations.map((item) => (

                <li key={item}>
                  <span>✓</span>
                  {item}
                </li>

              ))}

            </ul>

          </div>

        </section>

        {/* ===================================================
            BENEFITS
        =================================================== */}

        <section className="benefits-section">

          <div className="donation-section-heading">

            <h2>
              Why Become a Donor?
            </h2>

            <p>
              Donation is a voluntary act that can contribute to
              patient care and support families during difficult
              medical situations.
            </p>

          </div>

          <div className="benefits-box">

            <div className="benefit-card">

              <div className="benefit-icon">
                ❤️
              </div>

              <h3>
                Help Patients
              </h3>

              <p>
                Your donation may help patients who urgently need
                blood, organs, or tissues.
              </p>

            </div>

            <div className="benefit-card">

              <div className="benefit-icon">
                🏥
              </div>

              <h3>
                Support Healthcare
              </h3>

              <p>
                Donations help hospitals maintain essential
                resources for patient treatment.
              </p>

            </div>

            <div className="benefit-card">

              <div className="benefit-icon">
                🤝
              </div>

              <h3>
                Help Families
              </h3>

              <p>
                Donation can provide meaningful support to patients
                and their families during serious illness.
              </p>

            </div>

            <div className="benefit-card">

              <div className="benefit-icon">
                🌱
              </div>

              <h3>
                Create a Lasting Impact
              </h3>

              <p>
                Organ donation can potentially transform the future
                of a patient awaiting transplantation.
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            SAFETY
        =================================================== */}

        <section className="safety-section">

          <div className="safety-box">

            <h2>
              Donor Safety & Medical Standards
            </h2>

            <p>
              Donation should always take place through an
              authorized healthcare facility or recognized donation
              program. Donor health and patient safety are central
              to the process.
            </p>

            <div className="safety-grid">

              <div className="safety-item">
                <strong>Medical Screening</strong>
                <span>
                  Donors are evaluated to determine whether donation
                  is medically appropriate.
                </span>
              </div>

              <div className="safety-item">
                <strong>Sterile Procedures</strong>
                <span>
                  Blood collection uses appropriate sterile,
                  single-use equipment.
                </span>
              </div>

              <div className="safety-item">
                <strong>Laboratory Testing</strong>
                <span>
                  Donated blood and organs undergo required medical
                  testing before use.
                </span>
              </div>

              <div className="safety-item">
                <strong>Compatibility</strong>
                <span>
                  Blood and organs are assessed for suitability and
                  compatibility where required.
                </span>
              </div>

              <div className="safety-item">
                <strong>Informed Consent</strong>
                <span>
                  Donation decisions should follow appropriate
                  consent and documentation procedures.
                </span>
              </div>

              <div className="safety-item">
                <strong>Ethical Allocation</strong>
                <span>
                  Donation and transplantation are managed according
                  to applicable medical and legal standards.
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            FAQ
        =================================================== */}

        <section className="faq-section">

          <div className="donation-section-heading">

            <h2>
              Frequently Asked Questions
            </h2>

            <p>
              Important questions about blood and organ donation.
            </p>

          </div>

          <div className="faq-list">

            {faqs.map((faq) => (

              <article
                className="faq-item"
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

        {/* ===================================================
            CTA
        =================================================== */}

        <section className="donation-cta">

          <div>

            <h2>
              Interested in Becoming a Donor?
            </h2>

            <p>
              Contact the MediCo healthcare team to learn about
              available blood donation programs, organ donation
              registration, eligibility requirements, and the
              appropriate next steps.
            </p>

          </div>

          <div className="donation-cta-actions">

            <button
              className="donation-cta-button primary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>

            <button
              className="donation-cta-button secondary"
              onClick={() => navigate("/finddoctors")}
            >
              Find a Doctor
            </button>

          </div>

        </section>

        {/* ===================================================
            DISCLAIMER
        =================================================== */}

        <div className="donation-disclaimer">
          <strong>Important:</strong> Donation eligibility,
          collection procedures, testing requirements, organ
          allocation, consent procedures, and transplant eligibility
          vary according to medical circumstances and applicable
          regulations. This page provides general educational
          information and should not be considered a substitute for
          assessment by an authorized healthcare professional or
          donation organization.
        </div>

      </main>
    </div>
  );
}
