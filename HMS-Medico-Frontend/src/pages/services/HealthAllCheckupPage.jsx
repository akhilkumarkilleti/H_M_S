import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const healthCheckupPackages = [
    {
      id: 1,
      name: "Basic Health Checkup",
      category: "Basic",
      price: 999,
      oldPrice: 1499,
      popular: false,
      duration: "2–3 Hours",
      suitableFor: "Adults below 40 years",
      description:
        "An affordable preventive health screening package designed to identify common health risks at an early stage.",
      tests: [
        "Complete Blood Count (CBC)",
        "Blood Sugar - Fasting",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Urine Routine Examination",
        "Blood Pressure",
        "Body Mass Index (BMI)",
        "Doctor Consultation",
      ],
    },

    {
      id: 2,
      name: "Comprehensive Health Checkup",
      category: "Comprehensive",
      price: 2499,
      oldPrice: 3499,
      popular: true,
      duration: "3–4 Hours",
      suitableFor: "Adults 30+ years",
      description:
        "A detailed preventive health package covering blood, metabolic, liver, kidney, heart and general health parameters.",
      tests: [
        "Complete Blood Count (CBC)",
        "Fasting Blood Sugar",
        "HbA1c",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Thyroid Profile",
        "Urine Routine",
        "Vitamin B12",
        "Vitamin D",
        "ECG",
        "Chest X-Ray",
        "Blood Pressure",
        "BMI Assessment",
        "General Physician Consultation",
      ],
    },

    {
      id: 3,
      name: "Executive Health Checkup",
      category: "Executive",
      price: 4999,
      oldPrice: 6999,
      popular: true,
      duration: "4–5 Hours",
      suitableFor: "Working professionals",
      description:
        "A premium preventive health screening package for professionals who want a comprehensive assessment of their overall health.",
      tests: [
        "Complete Blood Count",
        "Fasting Blood Sugar",
        "HbA1c",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Thyroid Profile",
        "Vitamin B12",
        "Vitamin D",
        "Iron Profile",
        "Urine Examination",
        "ECG",
        "Chest X-Ray",
        "Ultrasound Abdomen & Pelvis",
        "Blood Pressure",
        "BMI",
        "General Physician Consultation",
        "Dietitian Consultation",
      ],
    },

    {
      id: 4,
      name: "Cardiac Health Checkup",
      category: "Cardiac",
      price: 3499,
      oldPrice: 4999,
      popular: false,
      duration: "3–4 Hours",
      suitableFor: "Adults with cardiac risk factors",
      description:
        "A focused heart-health screening package for assessing cardiovascular risk and identifying potential cardiac concerns.",
      tests: [
        "Complete Blood Count",
        "Fasting Blood Sugar",
        "HbA1c",
        "Lipid Profile",
        "Kidney Function Test",
        "Electrolytes",
        "ECG",
        "2D Echo",
        "Blood Pressure",
        "BMI",
        "Cardiology Consultation",
      ],
    },

    {
      id: 5,
      name: "Diabetes Health Checkup",
      category: "Diabetes",
      price: 1999,
      oldPrice: 2999,
      popular: false,
      duration: "2–3 Hours",
      suitableFor: "People with diabetes or diabetes risk",
      description:
        "A diabetes-focused screening package designed to assess blood glucose control and related health parameters.",
      tests: [
        "Fasting Blood Sugar",
        "Post Meal Blood Sugar",
        "HbA1c",
        "Complete Blood Count",
        "Lipid Profile",
        "Kidney Function Test",
        "Liver Function Test",
        "Urine Routine",
        "Urine Microalbumin",
        "Blood Pressure",
        "BMI",
        "Diabetologist Consultation",
      ],
    },

    {
      id: 6,
      name: "Women's Health Checkup",
      category: "Women",
      price: 2999,
      oldPrice: 4499,
      popular: true,
      duration: "3–4 Hours",
      suitableFor: "Adult women",
      description:
        "A comprehensive preventive screening package focused on women's general, metabolic and reproductive health.",
      tests: [
        "Complete Blood Count",
        "Blood Sugar",
        "HbA1c",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Thyroid Profile",
        "Vitamin D",
        "Vitamin B12",
        "Urine Examination",
        "Pap Smear",
        "Ultrasound Pelvis",
        "Breast Examination",
        "Blood Pressure",
        "Gynecologist Consultation",
      ],
    },

    {
      id: 7,
      name: "Men's Health Checkup",
      category: "Men",
      price: 2999,
      oldPrice: 4499,
      popular: false,
      duration: "3–4 Hours",
      suitableFor: "Adult men",
      description:
        "A preventive health screening package designed around common health risks affecting adult men.",
      tests: [
        "Complete Blood Count",
        "Fasting Blood Sugar",
        "HbA1c",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Thyroid Profile",
        "Vitamin D",
        "Vitamin B12",
        "Urine Routine",
        "PSA",
        "ECG",
        "Ultrasound Abdomen",
        "Blood Pressure",
        "Urologist Consultation",
      ],
    },

    {
      id: 8,
      name: "Senior Citizen Health Checkup",
      category: "Senior",
      price: 3999,
      oldPrice: 5499,
      popular: true,
      duration: "4–5 Hours",
      suitableFor: "Adults above 60 years",
      description:
        "A detailed preventive health assessment designed to monitor common age-related health conditions.",
      tests: [
        "Complete Blood Count",
        "Fasting Blood Sugar",
        "HbA1c",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Thyroid Profile",
        "Vitamin B12",
        "Vitamin D",
        "Urine Examination",
        "ECG",
        "2D Echo",
        "Chest X-Ray",
        "Ultrasound Abdomen",
        "Bone Health Assessment",
        "General Physician Consultation",
      ],
    },

    {
      id: 9,
      name: "Complete Master Health Checkup",
      category: "Premium",
      price: 7999,
      oldPrice: 10999,
      popular: true,
      duration: "5–6 Hours",
      suitableFor: "Adults seeking comprehensive screening",
      description:
        "Our premium comprehensive screening package covering major organ systems, metabolic health, cardiac screening and specialist evaluation.",
      tests: [
        "Complete Blood Count",
        "Fasting Blood Sugar",
        "Post Meal Blood Sugar",
        "HbA1c",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Thyroid Profile",
        "Vitamin B12",
        "Vitamin D",
        "Iron Profile",
        "Urine Routine",
        "Urine Microalbumin",
        "ECG",
        "2D Echo",
        "Chest X-Ray",
        "Ultrasound Abdomen & Pelvis",
        "PSA / Women's Screening",
        "Doctor Consultation",
        "Dietitian Consultation",
      ],
    },
  ];

export default function HealthAllCheckupPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPackage, setSelectedPackage] = useState(null);



  const categories = [
    "All",
    "Basic",
    "Comprehensive",
    "Executive",
    "Cardiac",
    "Diabetes",
    "Women",
    "Men",
    "Senior",
    "Premium",
  ];

  const filteredPackages = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return healthCheckupPackages.filter((pkg) => {
      const matchesCategory =
        selectedCategory === "All" ||
        pkg.category === selectedCategory;

      const searchableText = [
        pkg.name,
        pkg.category,
        pkg.description,
        pkg.suitableFor,
        pkg.tests.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        search === "" || searchableText.includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const bookPackage = (pkg) => {
    navigate("/finddoctors", {
      state: {
        selectedHealthPackage: pkg.name,
        packagePrice: pkg.price,
      },
    });
  };

  return (
    <div className="health-checkup-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .health-checkup-page {
          min-height: 100vh;
          background: #f5f9fc;
          color: #173b52;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }

        /* =====================================
           HERO
        ===================================== */

        .health-checkup-hero {
          background:
            linear-gradient(
              135deg,
              #064e78 0%,
              #087bb5 48%,
              #0f8b8d 100%
            );
          color: white;
          padding: 70px 20px 75px;
          text-align: center;
        }

        .health-checkup-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 15px;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,.35);
          background: rgba(255,255,255,.1);
          color: #e0f7ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .health-checkup-hero h1 {
          margin: 18px 0 12px;
          font-size: clamp(34px, 5vw, 52px);
          line-height: 1.1;
          font-weight: 800;
        }

        .health-checkup-hero p {
          max-width: 800px;
          margin: 0 auto;
          color: #d9f2fc;
          font-size: 15px;
          line-height: 1.8;
        }

        /* =====================================
           CONTAINER
        ===================================== */

        .health-checkup-container {
          width: 92%;
          max-width: 1250px;
          margin: 0 auto;
          padding: 50px 0 80px;
        }

        /* =====================================
           SEARCH
        ===================================== */

        .health-search-box {
          margin-top: -35px;
          position: relative;
          z-index: 5;
          background: white;
          border: 1px solid #dce8ee;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 12px 35px rgba(20,60,80,.12);
        }

        .health-search-wrapper {
          position: relative;
        }

        .health-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 19px;
          color: #668393;
        }

        .health-search-input {
          width: 100%;
          height: 52px;
          border: 1px solid #d0dfe7;
          border-radius: 10px;
          outline: none;
          padding: 0 48px;
          color: #193f55;
          font-size: 14px;
          background: #fbfdfe;
          transition: .2s ease;
        }

        .health-search-input:focus {
          border-color: #087bb5;
          box-shadow: 0 0 0 4px rgba(8,123,181,.09);
          background: white;
        }

        .health-search-clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          border: 0;
          border-radius: 50%;
          background: #edf5f8;
          color: #527082;
          cursor: pointer;
          font-size: 15px;
        }

        /* =====================================
           FILTERS
        ===================================== */

        .health-filter-section {
          margin: 30px 0 38px;
        }

        .health-filter-title {
          margin: 0 0 13px;
          color: #25485e;
          font-size: 14px;
          font-weight: 800;
        }

        .health-filter-list {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .health-filter-button {
          border: 1px solid #d6e3e9;
          background: white;
          color: #547080;
          border-radius: 30px;
          padding: 9px 15px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .health-filter-button:hover {
          border-color: #087bb5;
          color: #087bb5;
        }

        .health-filter-button.active {
          background: #087bb5;
          border-color: #087bb5;
          color: white;
        }

        /* =====================================
           SECTION HEADING
        ===================================== */

        .health-section-heading {
          text-align: center;
          margin-bottom: 35px;
        }

        .health-section-heading h2 {
          margin: 0 0 10px;
          color: #173b52;
          font-size: 30px;
          font-weight: 800;
        }

        .health-section-heading p {
          max-width: 760px;
          margin: auto;
          color: #738692;
          font-size: 14px;
          line-height: 1.7;
        }

        /* =====================================
           RESULT INFO
        ===================================== */

        .health-result-info {
          margin-bottom: 18px;
          color: #6d818d;
          font-size: 13px;
        }

        .health-result-info strong {
          color: #173b52;
        }

        /* =====================================
           CARDS
        ===================================== */

        .health-packages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .health-package-card {
          position: relative;
          background: white;
          border: 1px solid #dfe9ee;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(25,60,80,.05);
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease;
        }

        .health-package-card:hover {
          transform: translateY(-5px);
          border-color: #bcdbe7;
          box-shadow: 0 16px 35px rgba(25,60,80,.11);
        }

        .health-popular {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 5px 9px;
          border-radius: 20px;
          background: #e6f8f5;
          color: #07847d;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .5px;
          text-transform: uppercase;
        }

        .health-package-top {
          padding: 24px 22px 20px;
          background:
            linear-gradient(
              145deg,
              #f2f9fc,
              #ffffff
            );
          border-bottom: 1px solid #e8eef2;
        }

        .health-package-category {
          display: inline-block;
          margin-bottom: 10px;
          padding: 5px 9px;
          border-radius: 5px;
          background: #e5f4fa;
          color: #087bb5;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .7px;
        }

        .health-package-top h3 {
          margin: 0 0 10px;
          padding-right: 50px;
          color: #173b52;
          font-size: 20px;
          line-height: 1.25;
        }

        .health-package-description {
          min-height: 68px;
          margin: 0;
          color: #71838e;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =====================================
           PRICE
        ===================================== */

        .health-price-section {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 18px;
        }

        .health-price {
          color: #087bb5;
          font-size: 28px;
          font-weight: 800;
        }

        .health-old-price {
          color: #9aa9b2;
          font-size: 13px;
          text-decoration: line-through;
        }

        .health-save {
          padding: 4px 7px;
          border-radius: 4px;
          background: #edf9ed;
          color: #37823c;
          font-size: 9px;
          font-weight: 800;
        }

        /* =====================================
           PACKAGE META
        ===================================== */

        .health-package-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 17px 22px;
          border-bottom: 1px solid #edf2f4;
        }

        .health-meta-item {
          color: #70838f;
          font-size: 11px;
          line-height: 1.5;
        }

        .health-meta-item strong {
          display: block;
          color: #355469;
          margin-bottom: 3px;
          font-size: 11px;
        }

        /* =====================================
           TESTS
        ===================================== */

        .health-tests {
          padding: 20px 22px;
        }

        .health-tests-title {
          margin-bottom: 12px;
          color: #294b60;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .5px;
        }

        .health-test-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .health-test-list li {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          color: #687d89;
          font-size: 11px;
          line-height: 1.4;
        }

        .health-test-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #e7f7f4;
          color: #0c9289;
          font-size: 9px;
          font-weight: 800;
        }

        .health-more-tests {
          margin-top: 10px;
          color: #087bb5;
          font-size: 11px;
          font-weight: 700;
        }

        /* =====================================
           CARD BUTTONS
        ===================================== */

        .health-package-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          padding: 0 22px 22px;
        }

        .health-package-button {
          min-height: 42px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s ease;
        }

        .health-package-button.primary {
          border: 1px solid #087bb5;
          background: #087bb5;
          color: white;
        }

        .health-package-button.primary:hover {
          background: #075f8d;
        }

        .health-package-button.secondary {
          border: 1px solid #d2e0e7;
          background: white;
          color: #426276;
        }

        .health-package-button.secondary:hover {
          border-color: #087bb5;
          color: #087bb5;
          background: #f4fbfe;
        }

        /* =====================================
           NO RESULTS
        ===================================== */

        .health-no-results {
          padding: 55px 20px;
          text-align: center;
          background: white;
          border: 1px solid #e1eaee;
          border-radius: 15px;
        }

        .health-no-results-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .health-no-results h3 {
          margin: 0 0 8px;
          color: #294b60;
          font-size: 19px;
        }

        .health-no-results p {
          margin: 0 0 18px;
          color: #778993;
          font-size: 13px;
        }

        .health-reset-button {
          border: 0;
          border-radius: 7px;
          background: #087bb5;
          color: white;
          padding: 10px 17px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        /* =====================================
           BENEFITS
        ===================================== */

        .health-benefits {
          margin-top: 65px;
        }

        .health-benefits-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .health-benefit {
          background: white;
          border: 1px solid #e0e9ee;
          border-radius: 13px;
          padding: 22px;
          text-align: center;
        }

        .health-benefit-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          margin: 0 auto 12px;
          border-radius: 12px;
          background: #eaf7fb;
          font-size: 22px;
        }

        .health-benefit h3 {
          margin: 0 0 7px;
          color: #294b60;
          font-size: 14px;
        }

        .health-benefit p {
          margin: 0;
          color: #778993;
          font-size: 11px;
          line-height: 1.6;
        }

        /* =====================================
           IMPORTANT INFO
        ===================================== */

        .health-info-box {
          margin-top: 45px;
          padding: 28px;
          border-radius: 15px;
          background: #eef8fb;
          border: 1px solid #d5eaf2;
        }

        .health-info-box h2 {
          margin: 0 0 13px;
          color: #17465e;
          font-size: 21px;
        }

        .health-info-box p {
          margin: 0 0 10px;
          color: #587281;
          font-size: 12px;
          line-height: 1.75;
        }

        .health-info-box ul {
          margin: 10px 0 0;
          padding-left: 20px;
          color: #587281;
          font-size: 12px;
          line-height: 1.8;
        }

        /* =====================================
           MODAL
        ===================================== */

        .health-modal-layer {
          position: fixed;
          inset: 0;
          z-index: 5000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .health-modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(5,28,43,.65);
          backdrop-filter: blur(3px);
        }

        .health-modal {
          position: relative;
          z-index: 1;
          width: min(650px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 70px rgba(0,0,0,.25);
        }

        .health-modal-header {
          position: sticky;
          top: 0;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 23px 25px;
          background: white;
          border-bottom: 1px solid #e5edf1;
        }

        .health-modal-header h2 {
          margin: 0 0 5px;
          color: #173b52;
          font-size: 22px;
        }

        .health-modal-header p {
          margin: 0;
          color: #758893;
          font-size: 12px;
        }

        .health-modal-close {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border: 1px solid #dce6eb;
          border-radius: 50%;
          background: white;
          color: #476477;
          font-size: 23px;
          cursor: pointer;
        }

        .health-modal-body {
          padding: 25px;
        }

        .health-modal-price {
          margin-bottom: 22px;
          padding: 18px;
          border-radius: 10px;
          background: #f1f9fc;
          color: #087bb5;
          font-size: 27px;
          font-weight: 800;
        }

        .health-modal-body h3 {
          margin: 20px 0 12px;
          color: #294b60;
          font-size: 15px;
        }

        .health-modal-tests {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .health-modal-tests li {
          display: flex;
          gap: 7px;
          color: #647a86;
          font-size: 12px;
        }

        .health-modal-book {
          width: 100%;
          margin-top: 25px;
          border: 0;
          border-radius: 8px;
          background: #087bb5;
          color: white;
          padding: 13px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        /* =====================================
           RESPONSIVE
        ===================================== */

        @media(max-width:1050px) {
          .health-packages-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .health-benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media(max-width:700px) {
          .health-checkup-hero {
            padding: 55px 18px 65px;
          }

          .health-checkup-container {
            width: 92%;
            padding-top: 40px;
          }

          .health-packages-grid {
            grid-template-columns: 1fr;
          }

          .health-benefits-grid {
            grid-template-columns: 1fr;
          }

          .health-package-description {
            min-height: auto;
          }

          .health-modal-tests {
            grid-template-columns: 1fr;
          }
        }

        @media(max-width:500px) {
          .health-checkup-hero h1 {
            font-size: 34px;
          }

          .health-filter-list {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 5px;
          }

          .health-filter-button {
            white-space: nowrap;
          }

          .health-package-actions {
            grid-template-columns: 1fr;
          }

          .health-modal {
            max-height: 94vh;
          }

          .health-modal-body {
            padding: 20px;
          }
        }
      `}</style>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="health-checkup-hero">
        <span className="health-checkup-badge">
          Preventive Healthcare
        </span>

        <h1>Health Checkup Packages</h1>

        <p>
          Take control of your health with comprehensive preventive
          health screening packages designed to detect potential
          health concerns early and support informed healthcare
          decisions.
        </p>
      </section>

      <main className="health-checkup-container">

        {/* =========================================
            SEARCH
        ========================================= */}

        <section className="health-search-box">

          <div className="health-search-wrapper">

            <span className="health-search-icon">
              🔍
            </span>

            <input
              type="search"
              className="health-search-input"
              placeholder="Search health packages, tests, diabetes, cardiac, women, senior..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search health checkup packages"
            />

            {searchTerm && (
              <button
                type="button"
                className="health-search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

        </section>

        {/* =========================================
            FILTERS
        ========================================= */}

        <section className="health-filter-section">

          <div className="health-filter-title">
            Browse by Category
          </div>

          <div className="health-filter-list">

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  selectedCategory === category
                    ? "health-filter-button active"
                    : "health-filter-button"
                }
                onClick={() =>
                  setSelectedCategory(category)
                }
              >
                {category}
              </button>
            ))}

          </div>

        </section>

        {/* =========================================
            HEADING
        ========================================= */}

        <section className="health-section-heading">

          <h2>
            Choose the Right Health Checkup
          </h2>

          <p>
            Our screening packages are designed for different
            age groups, health needs and preventive healthcare
            requirements.
          </p>

        </section>

        <div className="health-result-info">
          Showing <strong>{filteredPackages.length}</strong>{" "}
          health checkup package
          {filteredPackages.length !== 1 ? "s" : ""}
        </div>

        {/* =========================================
            PACKAGES
        ========================================= */}

        {filteredPackages.length > 0 ? (

          <section className="health-packages-grid">

            {filteredPackages.map((pkg) => {

              const savings = Math.round(
                ((pkg.oldPrice - pkg.price) /
                  pkg.oldPrice) *
                  100
              );

              const visibleTests =
                pkg.tests.slice(0, 8);

              const remainingTests =
                pkg.tests.length -
                visibleTests.length;

              return (
                <article
                  className="health-package-card"
                  key={pkg.id}
                >

                  {pkg.popular && (
                    <span className="health-popular">
                      Popular
                    </span>
                  )}

                  <div className="health-package-top">

                    <span className="health-package-category">
                      {pkg.category}
                    </span>

                    <h3>
                      {pkg.name}
                    </h3>

                    <p className="health-package-description">
                      {pkg.description}
                    </p>

                    <div className="health-price-section">

                      <span className="health-price">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </span>

                      <span className="health-old-price">
                        ₹{pkg.oldPrice.toLocaleString("en-IN")}
                      </span>

                      <span className="health-save">
                        {savings}% OFF
                      </span>

                    </div>

                  </div>

                  <div className="health-package-meta">

                    <div className="health-meta-item">
                      <strong>Duration</strong>
                      {pkg.duration}
                    </div>

                    <div className="health-meta-item">
                      <strong>Suitable For</strong>
                      {pkg.suitableFor}
                    </div>

                  </div>

                  <div className="health-tests">

                    <div className="health-tests-title">
                      Included Tests
                    </div>

                    <ul className="health-test-list">

                      {visibleTests.map((test) => (
                        <li key={test}>
                          <span className="health-test-check">
                            ✓
                          </span>

                          {test}
                        </li>
                      ))}

                    </ul>

                    {remainingTests > 0 && (
                      <div className="health-more-tests">
                        + {remainingTests} more tests
                      </div>
                    )}

                  </div>

                  <div className="health-package-actions">

                    <button
                      type="button"
                      className="health-package-button secondary"
                      onClick={() =>
                        setSelectedPackage(pkg)
                      }
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      className="health-package-button primary"
                      onClick={() =>
                                      navigate("/patient/login")
                                    }
                    >
                      Book Checkup
                    </button>

                  </div>

                </article>
              );
            })}

          </section>

        ) : (

          <section className="health-no-results">

            <div className="health-no-results-icon">
              🔎
            </div>

            <h3>
              No Packages Found
            </h3>

            <p>
              We could not find a health checkup package
              matching your search.
            </p>

            <button
              type="button"
              className="health-reset-button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              View All Packages
            </button>

          </section>

        )}

        {/* =========================================
            BENEFITS
        ========================================= */}

        <section className="health-benefits">

          <div className="health-section-heading">

            <h2>
              Why Choose Preventive Health Screening?
            </h2>

            <p>
              Regular health checkups can help identify
              potential health concerns and support timely
              medical evaluation.
            </p>

          </div>

          <div className="health-benefits-grid">

            <div className="health-benefit">

              <div className="health-benefit-icon">
                🔬
              </div>

              <h3>
                Early Detection
              </h3>

              <p>
                Screening can help identify certain health
                abnormalities before symptoms become obvious.
              </p>

            </div>

            <div className="health-benefit">

              <div className="health-benefit-icon">
                ❤️
              </div>

              <h3>
                Heart Health
              </h3>

              <p>
                Monitor cardiovascular risk factors such as
                cholesterol, blood pressure and blood sugar.
              </p>

            </div>

            <div className="health-benefit">

              <div className="health-benefit-icon">
                🩸
              </div>

              <h3>
                Blood Health
              </h3>

              <p>
                Routine blood tests can provide important
                information about general health.
              </p>

            </div>

            <div className="health-benefit">

              <div className="health-benefit-icon">
                👨‍⚕️
              </div>

              <h3>
                Medical Guidance
              </h3>

              <p>
                Discuss your results with qualified healthcare
                professionals and understand the next steps.
              </p>

            </div>

          </div>

        </section>

        {/* =========================================
            INFORMATION
        ========================================= */}

        <section className="health-info-box">

          <h2>
            Before Your Health Checkup
          </h2>

          <p>
            Preparation requirements depend on the tests included
            in your selected package. Some blood investigations
            may require fasting.
          </p>

          <ul>
            <li>
              Follow the fasting instructions provided by the hospital.
            </li>

            <li>
              Continue or stop medications only according to your
              doctor's instructions.
            </li>

            <li>
              Carry previous medical reports if available.
            </li>

            <li>
              Inform the healthcare team about existing medical
              conditions and medications.
            </li>

            <li>
              Pregnant patients should inform the medical team before
              undergoing investigations involving radiation.
            </li>

            <li>
              Test availability and package contents may vary based
              on hospital location and clinical requirements.
            </li>
          </ul>

        </section>

      </main>

      {/* =========================================
          DETAILS MODAL
      ========================================= */}

      {selectedPackage && (

        <div className="health-modal-layer">

          <div
            className="health-modal-overlay"
            onClick={() =>
              setSelectedPackage(null)
            }
          />

          <div
            className="health-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="health-package-title"
          >

            <div className="health-modal-header">

              <div>

                <h2 id="health-package-title">
                  {selectedPackage.name}
                </h2>

                <p>
                  {selectedPackage.suitableFor}
                </p>

              </div>

              <button
                type="button"
                className="health-modal-close"
                onClick={() =>
                  setSelectedPackage(null)
                }
                aria-label="Close package details"
              >
                ×
              </button>

            </div>

            <div className="health-modal-body">

              <div className="health-modal-price">
                ₹
                {selectedPackage.price.toLocaleString(
                  "en-IN"
                )}
              </div>

              <p>
                {selectedPackage.description}
              </p>

              <h3>
                Package Information
              </h3>

              <p>
                <strong>Duration:</strong>{" "}
                {selectedPackage.duration}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {selectedPackage.category}
              </p>

              <h3>
                Complete Test List
              </h3>

              <ul className="health-modal-tests">

                {selectedPackage.tests.map((test) => (
                  <li key={test}>

                    <span className="health-test-check">
                      ✓
                    </span>

                    {test}

                  </li>
                ))}

              </ul>



            </div>

          </div>

        </div>

      )}

    </div>
  );
}
