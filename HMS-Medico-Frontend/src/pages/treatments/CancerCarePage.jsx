import React from "react";
import { useNavigate } from "react-router-dom";

export default function CancerCarePage() {
  const navigate = useNavigate();

  const cancerTypes = [
    {
      title: "Breast Cancer",
      icon: "🎗️",
      description:
        "Breast cancer develops when abnormal cells in the breast grow and multiply uncontrollably. It can affect both women and men, although it is much more common in women.",
      symptoms: [
        "Breast lump",
        "Changes in breast shape",
        "Nipple changes",
        "Skin changes",
      ],
    },
    {
      title: "Lung Cancer",
      icon: "🫁",
      description:
        "Lung cancer begins in the tissues of the lungs. Smoking is a major risk factor, although lung cancer can also occur in people who have never smoked.",
      symptoms: [
        "Persistent cough",
        "Chest discomfort",
        "Shortness of breath",
        "Coughing blood",
      ],
    },
    {
      title: "Liver Cancer",
      icon: "🩺",
      description:
        "Liver cancer develops in the cells of the liver. Chronic liver disease, hepatitis infections, and cirrhosis may increase the risk of developing liver cancer.",
      symptoms: [
        "Abdominal discomfort",
        "Unexplained weight loss",
        "Jaundice",
        "Loss of appetite",
      ],
    },
    {
      title: "Colorectal Cancer",
      icon: "🔬",
      description:
        "Colorectal cancer affects the colon or rectum. Screening can help detect certain abnormal growths before they become cancerous or identify cancer at an earlier stage.",
      symptoms: [
        "Changes in bowel habits",
        "Blood in stool",
        "Abdominal discomfort",
        "Unexplained weight loss",
      ],
    },
    {
      title: "Prostate Cancer",
      icon: "🧬",
      description:
        "Prostate cancer develops in the prostate gland. Many prostate cancers grow slowly, while some forms can be more aggressive and require active treatment.",
      symptoms: [
        "Difficulty urinating",
        "Frequent urination",
        "Weak urine flow",
        "Blood in urine",
      ],
    },
    {
      title: "Blood Cancer",
      icon: "🩸",
      description:
        "Blood cancers include leukemia, lymphoma, and multiple myeloma. These cancers affect blood cells, bone marrow, or the lymphatic system.",
      symptoms: [
        "Persistent fatigue",
        "Frequent infections",
        "Easy bruising",
        "Swollen lymph nodes",
      ],
    },
    {
      title: "Skin Cancer",
      icon: "☀️",
      description:
        "Skin cancer develops from abnormal skin cells. Long-term ultraviolet radiation exposure is an important risk factor for several types of skin cancer.",
      symptoms: [
        "Changing mole",
        "New skin growth",
        "Non-healing sore",
        "Changes in skin color",
      ],
    },
    {
      title: "Cervical Cancer",
      icon: "🩷",
      description:
        "Cervical cancer develops in the cells of the cervix. Regular screening and prevention strategies can help identify abnormal changes early.",
      symptoms: [
        "Abnormal bleeding",
        "Pelvic discomfort",
        "Pain during intercourse",
        "Unusual discharge",
      ],
    },
    {
      title: "Brain Tumors",
      icon: "🧠",
      description:
        "Brain tumors are abnormal growths of cells in or around the brain. They may be benign or malignant and can affect neurological function depending on their location.",
      symptoms: [
        "Persistent headaches",
        "Seizures",
        "Vision changes",
        "Balance problems",
      ],
    },
  ];

  const cancerSymptoms = [
    "Unexplained weight loss",
    "Persistent or unusual fatigue",
    "New lumps or swelling",
    "Persistent or unexplained pain",
    "Changes in bowel or bladder habits",
    "Unusual bleeding or discharge",
    "Persistent cough or voice changes",
    "Changes in a mole or skin lesion",
  ];

  const diagnosisMethods = [
    {
      number: "01",
      title: "Medical Evaluation",
      description:
        "Doctors review symptoms, personal and family medical history, risk factors, and perform a physical examination.",
    },
    {
      number: "02",
      title: "Laboratory Tests",
      description:
        "Blood, urine, and other laboratory tests may provide information that helps doctors investigate possible cancer.",
    },
    {
      number: "03",
      title: "Imaging Tests",
      description:
        "Imaging such as ultrasound, CT, MRI, mammography, or PET scans may be used to examine areas of concern.",
    },
    {
      number: "04",
      title: "Biopsy",
      description:
        "A biopsy involves taking a sample of tissue so that it can be examined for abnormal or cancerous cells.",
    },
  ];

  const treatmentOptions = [
    {
      title: "Surgery",
      icon: "🏥",
      description:
        "Surgery may be used to remove a tumor or cancerous tissue when appropriate for the type, location, and stage of cancer.",
    },
    {
      title: "Chemotherapy",
      icon: "💊",
      description:
        "Chemotherapy uses medicines to destroy cancer cells or slow their growth. It may be used alone or alongside other treatments.",
    },
    {
      title: "Radiation Therapy",
      icon: "☢️",
      description:
        "Radiation therapy uses high-energy radiation to damage and destroy cancer cells in a specific area of the body.",
    },
    {
      title: "Immunotherapy",
      icon: "🛡️",
      description:
        "Immunotherapy helps the body's immune system recognize and respond to certain cancer cells.",
    },
    {
      title: "Targeted Therapy",
      icon: "🎯",
      description:
        "Targeted treatments focus on specific characteristics of cancer cells and may be appropriate for certain cancers.",
    },
    {
      title: "Hormone Therapy",
      icon: "⚕️",
      description:
        "Hormone therapy may be used for cancers that depend on certain hormones to grow, including some breast and prostate cancers.",
    },
  ];

  return (
    <div className="cancer-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .cancer-page {
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

        .cancer-page button {
          font-family: inherit;
        }

        /* =========================================
           HERO
        ========================================= */

        .cancer-hero {
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

        .cancer-hero-badge {
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

        .cancer-hero h1 {
          margin: 18px 0 14px;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 800;
          line-height: 1.1;
        }

        .cancer-hero p {
          max-width: 800px;
          margin: 0 auto;
          color: #e0f2fe;
          font-size: 16px;
          line-height: 1.8;
        }

        .cancer-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .cancer-hero-button {
          min-height: 44px;
          padding: 0 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .cancer-hero-button.primary {
          border: 1px solid white;
          background: white;
          color: #0369a1;
        }

        .cancer-hero-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .cancer-hero-button.secondary {
          border: 1px solid rgba(255,255,255,0.6);
          background: transparent;
          color: white;
        }

        .cancer-hero-button.secondary:hover {
          background: rgba(255,255,255,0.10);
        }

        /* =========================================
           MAIN CONTAINER
        ========================================= */

        .cancer-container {
          width: 92%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 55px 0 80px;
        }

        .cancer-section-heading {
          text-align: center;
          margin-bottom: 40px;
        }

        .cancer-section-heading h2 {
          margin: 0 0 12px;
          color: #173550;
          font-size: 30px;
          font-weight: 800;
        }

        .cancer-section-heading p {
          max-width: 780px;
          margin: 0 auto;
          color: #738392;
          font-size: 15px;
          line-height: 1.8;
        }

        /* =========================================
           OVERVIEW
        ========================================= */

        .cancer-overview {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 25px;
          margin-bottom: 55px;
        }

        .cancer-overview-content,
        .cancer-overview-side {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .cancer-overview-content h2 {
          margin: 0 0 15px;
          color: #173550;
          font-size: 27px;
        }

        .cancer-overview-content p {
          margin: 0 0 14px;
          color: #687a89;
          font-size: 14px;
          line-height: 1.85;
        }

        .cancer-overview-content p:last-child {
          margin-bottom: 0;
        }

        .cancer-overview-side {
          background:
            linear-gradient(
              145deg,
              #eaf8f8,
              #ffffff
            );
        }

        .cancer-overview-side h3 {
          margin: 0 0 20px;
          color: #173550;
          font-size: 20px;
        }

        .cancer-highlight {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 17px;
        }

        .cancer-highlight:last-child {
          margin-bottom: 0;
        }

        .cancer-highlight-icon {
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

        .cancer-highlight strong {
          display: block;
          margin-bottom: 3px;
          color: #29465e;
          font-size: 13px;
        }

        .cancer-highlight span {
          color: #7a8995;
          font-size: 12px;
          line-height: 1.55;
        }

        /* =========================================
           CANCER TYPES
        ========================================= */

        .cancer-types-section {
          margin-top: 20px;
        }

        .cancer-types-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .cancer-type-card {
          position: relative;
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          padding: 25px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .cancer-type-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: #159c9d;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.25s ease;
        }

        .cancer-type-card:hover {
          transform: translateY(-5px);
          border-color: #cfe4e6;
          box-shadow: 0 15px 35px rgba(30,60,80,0.09);
        }

        .cancer-type-card:hover::before {
          transform: scaleY(1);
        }

        .cancer-type-icon {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 17px;
          border-radius: 13px;
          background: #eaf8f8;
          font-size: 27px;
        }

        .cancer-type-number {
          color: #159c9d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
        }

        .cancer-type-card h3 {
          margin: 7px 0 12px;
          color: #18364f;
          font-size: 19px;
        }

        .cancer-type-card > p {
          margin: 0 0 19px;
          color: #687a89;
          font-size: 13px;
          line-height: 1.75;
        }

        .cancer-symptom-heading {
          margin-bottom: 10px;
          color: #334d62;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .cancer-type-symptoms {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .cancer-type-symptoms li {
          padding: 5px 8px;
          border-radius: 5px;
          background: #f0f7f8;
          color: #607584;
          font-size: 10px;
        }

        /* =========================================
           WARNING SIGNS
        ========================================= */

        .cancer-warning-section {
          margin-top: 60px;
        }

        .cancer-warning-box {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .cancer-warning-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px 30px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .cancer-warning-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px;
          background: #f7fafc;
          border-radius: 8px;
          color: #596f7f;
          font-size: 13px;
        }

        .cancer-warning-check {
          width: 27px;
          height: 27px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e5f7f5;
          color: #159c9d;
          font-size: 12px;
          font-weight: 800;
        }

        .cancer-warning-note {
          margin: 20px 0 0;
          color: #87939c;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           RISK & PREVENTION
        ========================================= */

        .cancer-prevention-section {
          margin-top: 55px;
        }

        .cancer-prevention-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .cancer-prevention-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
          padding: 25px 20px;
          text-align: center;
        }

        .cancer-prevention-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          border-radius: 50%;
          background: #eaf8f8;
          font-size: 21px;
        }

        .cancer-prevention-card h3 {
          margin: 0 0 8px;
          color: #29465e;
          font-size: 15px;
        }

        .cancer-prevention-card p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.65;
        }

        /* =========================================
           DIAGNOSIS
        ========================================= */

        .cancer-diagnosis-section {
          margin-top: 60px;
        }

        .cancer-diagnosis-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .cancer-diagnosis-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 13px;
          padding: 27px 22px;
          box-shadow: 0 7px 25px rgba(30,60,80,0.04);
        }

        .cancer-diagnosis-number {
          color: #159c9d;
          font-size: 12px;
          font-weight: 800;
        }

        .cancer-diagnosis-card h3 {
          margin: 15px 0 10px;
          color: #29465e;
          font-size: 17px;
        }

        .cancer-diagnosis-card p {
          margin: 0;
          color: #7a8995;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           TREATMENT
        ========================================= */

        .cancer-treatment-section {
          margin-top: 60px;
        }

        .cancer-treatment-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .cancer-treatment-card {
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 14px;
          padding: 26px;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .cancer-treatment-card:hover {
          transform: translateY(-4px);
          border-color: #cfe4e6;
          box-shadow: 0 14px 30px rgba(30,60,80,0.08);
        }

        .cancer-treatment-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #eaf8f8;
          font-size: 22px;
        }

        .cancer-treatment-card h3 {
          margin: 18px 0 9px;
          color: #29465e;
          font-size: 18px;
        }

        .cancer-treatment-card p {
          margin: 0;
          color: #71818e;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================
           CARE JOURNEY
        ========================================= */

        .cancer-care-section {
          margin-top: 60px;
        }

        .cancer-care-box {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          background: white;
          border: 1px solid #e2e9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(30,60,80,0.045);
        }

        .cancer-care-step {
          padding: 27px 18px;
          text-align: center;
          border-right: 1px solid #edf1f3;
        }

        .cancer-care-step:last-child {
          border-right: none;
        }

        .cancer-step-number {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 13px;
          border-radius: 50%;
          background: #e8f7f7;
          color: #159c9d;
          font-size: 12px;
          font-weight: 800;
        }

        .cancer-care-step h3 {
          margin: 0 0 8px;
          color: #29465e;
          font-size: 14px;
        }

        .cancer-care-step p {
          margin: 0;
          color: #7a8995;
          font-size: 11px;
          line-height: 1.6;
        }

        /* =========================================
           CTA
        ========================================= */

        .cancer-cta {
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

        .cancer-cta h2 {
          margin: 0 0 9px;
          font-size: 25px;
        }

        .cancer-cta p {
          max-width: 700px;
          margin: 0;
          color: #bcd1dd;
          font-size: 14px;
          line-height: 1.7;
        }

        .cancer-cta-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .cancer-cta-button {
          min-height: 43px;
          padding: 0 18px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .cancer-cta-button.primary {
          border: 1px solid #159c9d;
          background: #159c9d;
          color: white;
        }

        .cancer-cta-button.primary:hover {
          background: #0e8183;
        }

        .cancer-cta-button.secondary {
          border: 1px solid #557587;
          background: transparent;
          color: white;
        }

        .cancer-cta-button.secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        /* =========================================
           EMERGENCY
        ========================================= */

        .cancer-emergency {
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

        .cancer-emergency-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .cancer-emergency-icon {
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

        .cancer-emergency h3 {
          margin: 0 0 5px;
          color: #991b1b;
          font-size: 17px;
        }

        .cancer-emergency p {
          margin: 0;
          color: #9f5b5b;
          font-size: 12px;
        }

        .cancer-emergency-button {
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

        .cancer-emergency-button:hover {
          background: #b91c1c;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 1000px) {
          .cancer-types-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cancer-prevention-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cancer-diagnosis-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cancer-treatment-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cancer-care-box {
            grid-template-columns: repeat(3, 1fr);
          }

          .cancer-care-step:nth-child(3) {
            border-right: none;
          }

          .cancer-care-step:nth-child(-n + 3) {
            border-bottom: 1px solid #edf1f3;
          }

          .cancer-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 850px) {
          .cancer-overview {
            grid-template-columns: 1fr;
          }

          .cancer-warning-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .cancer-hero {
            padding: 55px 18px;
          }

          .cancer-hero h1 {
            font-size: 35px;
          }

          .cancer-hero p {
            font-size: 14px;
          }

          .cancer-container {
            width: 92%;
            padding: 40px 0 60px;
          }

          .cancer-section-heading h2 {
            font-size: 26px;
          }

          .cancer-overview-content,
          .cancer-overview-side {
            padding: 23px;
          }

          .cancer-types-grid,
          .cancer-prevention-grid,
          .cancer-diagnosis-grid,
          .cancer-treatment-grid {
            grid-template-columns: 1fr;
          }

          .cancer-care-box {
            grid-template-columns: 1fr;
          }

          .cancer-care-step {
            border-right: none !important;
            border-bottom: 1px solid #edf1f3;
          }

          .cancer-care-step:last-child {
            border-bottom: none;
          }

          .cancer-cta {
            padding: 27px 22px;
          }

          .cancer-cta-actions {
            width: 100%;
            flex-direction: column;
          }

          .cancer-cta-button {
            width: 100%;
          }

          .cancer-emergency {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .cancer-emergency-button {
            width: 100%;
          }
        }
      `}</style>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="cancer-hero">
        <span className="cancer-hero-badge">
          Oncology & Cancer Care
        </span>

        <h1>Comprehensive Cancer Care</h1>

        <p>
          Learn about cancer, its different types, warning signs,
          diagnosis, treatment options, and the importance of
          personalized care throughout the cancer journey.
        </p>

        <div className="cancer-hero-actions">
          <button
            className="cancer-hero-button primary"
            onClick={() => navigate("/finddoctors")}
          >
            Find an Oncologist
          </button>

          <button
            className="cancer-hero-button secondary"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </section>

      <main className="cancer-container">

        {/* =========================================
            OVERVIEW
        ========================================= */}

        <section className="cancer-overview">
          <div className="cancer-overview-content">
            <h2>Understanding Cancer</h2>

            <p>
              Cancer is a broad group of diseases in which abnormal
              cells grow and divide in an uncontrolled way. These
              abnormal cells may form a mass called a tumor, although
              some cancers such as leukemia do not typically form solid
              tumors.
            </p>

            <p>
              Cancer can develop in almost any part of the body.
              Depending on the type and stage, cancer cells may remain
              in their original location or spread to other parts of
              the body through the blood or lymphatic system.
            </p>

            <p>
              Cancer care often involves several healthcare
              professionals working together. Treatment may include
              surgery, medicines, radiation therapy, immunotherapy,
              targeted therapy, or combinations of these approaches.
            </p>

            <p>
              Early evaluation of concerning symptoms and recommended
              screening can help identify some cancers at an earlier
              stage, when treatment may be more effective.
            </p>
          </div>

          <div className="cancer-overview-side">
            <h3>Key Areas of Cancer Care</h3>

            <div className="cancer-highlight">
              <div className="cancer-highlight-icon">🔎</div>

              <div>
                <strong>Early Detection</strong>

                <span>
                  Appropriate screening and evaluation can help
                  identify certain cancers early.
                </span>
              </div>
            </div>

            <div className="cancer-highlight">
              <div className="cancer-highlight-icon">🧬</div>

              <div>
                <strong>Accurate Diagnosis</strong>

                <span>
                  Tests and specialist evaluation help determine the
                  type and extent of cancer.
                </span>
              </div>
            </div>

            <div className="cancer-highlight">
              <div className="cancer-highlight-icon">🎯</div>

              <div>
                <strong>Personalized Treatment</strong>

                <span>
                  Treatment is selected according to the cancer type,
                  stage, and individual circumstances.
                </span>
              </div>
            </div>

            <div className="cancer-highlight">
              <div className="cancer-highlight-icon">❤️</div>

              <div>
                <strong>Supportive Care</strong>

                <span>
                  Physical, emotional, nutritional, and rehabilitation
                  support may be part of comprehensive cancer care.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CANCER TYPES
        ========================================= */}

        <section className="cancer-types-section">
          <div className="cancer-section-heading">
            <h2>Types of Cancer</h2>

            <p>
              Cancer can occur in many organs and tissues. Explore
              some of the common cancer types and the symptoms that
              may require medical evaluation.
            </p>
          </div>

          <div className="cancer-types-grid">
            {cancerTypes.map((cancer, index) => (
              <article
                className="cancer-type-card"
                key={cancer.title}
              >
                <div className="cancer-type-icon">
                  {cancer.icon}
                </div>

                <div className="cancer-type-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3>{cancer.title}</h3>

                <p>{cancer.description}</p>

                <div className="cancer-symptom-heading">
                  Possible Signs
                </div>

                <ul className="cancer-type-symptoms">
                  {cancer.symptoms.map((symptom) => (
                    <li key={symptom}>{symptom}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================
            WARNING SIGNS
        ========================================= */}

        <section className="cancer-warning-section">
          <div className="cancer-section-heading">
            <h2>Common Warning Signs</h2>

            <p>
              Cancer symptoms can vary significantly depending on the
              type and location of the cancer. Many of these symptoms
              can also be caused by conditions that are not cancer.
            </p>
          </div>

          <div className="cancer-warning-box">
            <div className="cancer-warning-list">
              {cancerSymptoms.map((symptom) => (
                <div
                  className="cancer-warning-item"
                  key={symptom}
                >
                  <span className="cancer-warning-check">
                    ✓
                  </span>

                  {symptom}
                </div>
              ))}
            </div>

            <p className="cancer-warning-note">
              If a symptom is persistent, unusual, worsening, or
              concerning, speak with a healthcare professional for
              appropriate evaluation.
            </p>
          </div>
        </section>

        {/* =========================================
            PREVENTION
        ========================================= */}

        <section className="cancer-prevention-section">
          <div className="cancer-section-heading">
            <h2>Cancer Risk Reduction</h2>

            <p>
              Not all cancers can be prevented, but certain lifestyle
              choices and preventive healthcare measures may reduce
              the risk of some cancers.
            </p>
          </div>

          <div className="cancer-prevention-grid">
            <div className="cancer-prevention-card">
              <div className="cancer-prevention-icon">
                🚭
              </div>

              <h3>Avoid Tobacco</h3>

              <p>
                Avoiding tobacco products can reduce the risk of
                several cancers.
              </p>
            </div>

            <div className="cancer-prevention-card">
              <div className="cancer-prevention-icon">
                🥗
              </div>

              <h3>Healthy Lifestyle</h3>

              <p>
                A balanced diet, regular activity, and healthy weight
                can support overall health.
              </p>
            </div>

            <div className="cancer-prevention-card">
              <div className="cancer-prevention-icon">
                ☀️
              </div>

              <h3>Sun Protection</h3>

              <p>
                Limiting excessive ultraviolet exposure can help
                reduce certain skin cancer risks.
              </p>
            </div>

            <div className="cancer-prevention-card">
              <div className="cancer-prevention-icon">
                🩺
              </div>

              <h3>Recommended Screening</h3>

              <p>
                Age- and risk-appropriate screening can help detect
                some cancers early.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            DIAGNOSIS
        ========================================= */}

        <section className="cancer-diagnosis-section">
          <div className="cancer-section-heading">
            <h2>How Cancer Is Diagnosed</h2>

            <p>
              Doctors may use several types of examinations and tests
              to investigate symptoms and determine whether cancer is
              present.
            </p>
          </div>

          <div className="cancer-diagnosis-grid">
            {diagnosisMethods.map((method) => (
              <article
                className="cancer-diagnosis-card"
                key={method.number}
              >
                <div className="cancer-diagnosis-number">
                  {method.number}
                </div>

                <h3>{method.title}</h3>

                <p>{method.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================
            TREATMENTS
        ========================================= */}

        <section className="cancer-treatment-section">
          <div className="cancer-section-heading">
            <h2>Cancer Treatment Options</h2>

            <p>
              Cancer treatment depends on factors such as the cancer
              type, stage, location, overall health, and individual
              treatment goals.
            </p>
          </div>

          <div className="cancer-treatment-grid">
            {treatmentOptions.map((treatment) => (
              <article
                className="cancer-treatment-card"
                key={treatment.title}
              >
                <div className="cancer-treatment-icon">
                  {treatment.icon}
                </div>

                <h3>{treatment.title}</h3>

                <p>{treatment.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================
            CARE JOURNEY
        ========================================= */}

        <section className="cancer-care-section">
          <div className="cancer-section-heading">
            <h2>Your Cancer Care Journey</h2>

            <p>
              Cancer care is often a step-by-step process involving
              evaluation, diagnosis, treatment, and ongoing follow-up.
            </p>
          </div>

          <div className="cancer-care-box">
            <div className="cancer-care-step">
              <div className="cancer-step-number">
                01
              </div>

              <h3>Consultation</h3>

              <p>
                Discuss symptoms, medical history, risk factors, and
                concerns with a healthcare professional.
              </p>
            </div>

            <div className="cancer-care-step">
              <div className="cancer-step-number">
                02
              </div>

              <h3>Diagnosis</h3>

              <p>
                Appropriate examinations, laboratory tests, imaging,
                or biopsy may be performed.
              </p>
            </div>

            <div className="cancer-care-step">
              <div className="cancer-step-number">
                03
              </div>

              <h3>Staging</h3>

              <p>
                Doctors determine the extent of cancer and whether it
                has spread to other areas.
              </p>
            </div>

            <div className="cancer-care-step">
              <div className="cancer-step-number">
                04
              </div>

              <h3>Treatment</h3>

              <p>
                A treatment plan is developed based on the diagnosis
                and individual healthcare needs.
              </p>
            </div>

            <div className="cancer-care-step">
              <div className="cancer-step-number">
                05
              </div>

              <h3>Follow-Up</h3>

              <p>
                Ongoing monitoring, supportive care, and follow-up
                appointments help manage long-term health.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            CTA
        ========================================= */}

        <section className="cancer-cta">
          <div>
            <h2>Need Cancer Care?</h2>

            <p>
              Connect with an oncology specialist to discuss symptoms,
              screening, diagnosis, treatment options, or ongoing
              cancer care.
            </p>
          </div>

          <div className="cancer-cta-actions">
            <button
              className="cancer-cta-button primary"
              onClick={() => navigate("/finddoctors")}
            >
              Find an Oncologist
            </button>

            <button
              className="cancer-cta-button secondary"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </section>

        {/* =========================================
            EMERGENCY
        ========================================= */}

        <section className="cancer-emergency">
          <div className="cancer-emergency-content">
            <div className="cancer-emergency-icon">
              🚑
            </div>

            <div>
              <h3>Medical Emergency?</h3>

              <p>
                For severe symptoms or a medical emergency, seek
                immediate medical attention rather than waiting for a
                routine appointment.
              </p>
            </div>
          </div>

          <button
            className="cancer-emergency-button"
            onClick={() => navigate("/services/emergency")}
          >
            Emergency Services
          </button>
        </section>

      </main>
    </div>
  );
}
