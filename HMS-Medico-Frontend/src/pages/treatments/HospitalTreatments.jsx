import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HospitalTreatments() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const treatments = [
    {
      id: 1,
      title: "Cardiac Care",
      icon: "❤️",
      description:
        "Comprehensive treatment and management for heart-related conditions through specialist consultations, diagnostics, procedures, and follow-up care.",
      features: [
        "Heart health evaluation",
        "Cardiology consultation",
        "ECG and cardiac diagnostics",
        "Cardiac procedures",
        "Post-treatment monitoring",
      ],
      path: "/heartcardiopage",
    },
    {
      id: 2,
      title: "Cancer Treatment",
      icon: "🎗️",
      description:
        "Multidisciplinary cancer care supported by oncology specialists, diagnostic services, treatment planning, and patient support.",
      features: [
        "Cancer screening",
        "Medical oncology",
        "Radiation oncology",
        "Chemotherapy support",
        "Follow-up and monitoring",
      ],
      path: "/cancercarepage",
    },
    {
      id: 3,
      title: "Neurology Treatment",
      icon: "🧠",
      description:
        "Specialized neurological care for conditions affecting the brain, spinal cord, nerves, and related systems.",
      features: [
        "Neurology consultation",
        "Migraine treatment",
        "Stroke care",
        "Neurological diagnostics",
        "Long-term neurological care",
      ],
      path: "/neurologypage",
    },
    {
      id: 4,
      title: "Orthopedic Treatment",
      icon: "🦴",
      description:
        "Comprehensive orthopedic treatment for bones, joints, muscles, ligaments, and mobility-related conditions.",
      features: [
        "Joint pain treatment",
        "Fracture management",
        "Joint replacement",
        "Sports injury care",
        "Physiotherapy support",
      ],
      path: "/orthopedicpage",
    },
    {
      id: 5,
      title: "Maternity & Child Care",
      icon: "👶",
      description:
        "Specialized maternity, newborn, and pediatric services designed to support mothers and children throughout their healthcare journey.",
      features: [
        "Antenatal care",
        "Maternity consultations",
        "Delivery services",
        "Newborn care",
        "Pediatric consultations",
      ],
      path: "/maternitycarepage",
    },
    {
      id: 6,
      title: "Kidney & Urology Care",
      icon: "🩺",
      description:
        "Specialist care for kidney, urinary tract, bladder, and other urological conditions.",
      features: [
        "Urology consultation",
        "Kidney health assessment",
        "Urinary disorder treatment",
        "Stone management",
        "Urological procedures",
      ],
      path: "/kidneycarepage",
    },
    {
      id: 7,
      title: "Gastroenterology",
      icon: "🔬",
      description:
        "Diagnosis and treatment for digestive system conditions involving the stomach, intestine, liver, pancreas, and related organs.",
      features: [
        "Digestive health consultation",
        "Endoscopy services",
        "Liver care",
        "Gastrointestinal treatment",
        "Preventive screening",
      ],
      path: "/gastroenterologypage",
    },
    {
      id: 8,
      title: "Emergency Treatment",
      icon: "🚑",
      description:
        "Urgent medical evaluation and treatment for patients requiring immediate attention and emergency care.",
      features: [
        "24/7 emergency support",
        "Emergency assessment",
        "Critical care",
        "Trauma management",
        "Emergency diagnostics",
      ],
      path: "/emergencypage",
    },
  ];

  const filteredTreatments = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return treatments;
    }

    return treatments.filter((treatment) => {
      const searchableText = [
        treatment.title,
        treatment.description,
        ...treatment.features,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(value);
    });
  }, [search]);

  const go = (path) => {
    if (!path) return;

    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="hospital-treatments-wrapper">
      <style>{`
        /* =========================================================
           GLOBAL
        ========================================================= */

        .hospital-treatments-wrapper {
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

        .hospital-treatments-wrapper *,
        .hospital-treatments-wrapper *::before,
        .hospital-treatments-wrapper *::after {
          box-sizing: border-box;
        }

        .hospital-treatments-wrapper button,
        .hospital-treatments-wrapper input {
          font-family: inherit;
        }


        /* =========================================================
           NAVBAR
        ========================================================= */

        .hospital-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(255, 255, 255, 0.97);
          border-bottom: 1px solid #e6edf2;
          box-shadow: 0 3px 18px rgba(20, 52, 75, 0.06);
          backdrop-filter: blur(12px);
        }

        .hospital-navbar-inner {
          width: 100%;
          max-width: 1380px;
          height: 78px;
          margin: 0 auto;
          padding: 0 35px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }


        /* =========================================================
           LOGO
        ========================================================= */

        .hospital-logo-section {
          display: flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
          cursor: pointer;
          user-select: none;
        }

        .hospital-logo-icon {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: linear-gradient(
            135deg,
            #159c9d,
            #087f88
          );

          color: #ffffff;

          font-size: 25px;
          font-weight: 700;

          box-shadow:
            0 7px 18px rgba(21, 156, 157, 0.22);
        }

        .hospital-logo-text {
          color: #173550;
          font-size: 21px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .hospital-logo-subtext {
          margin-top: 3px;

          color: #8998a6;

          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }


        /* =========================================================
           DESKTOP NAVIGATION
        ========================================================= */

        .hospital-nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          flex: 1;
        }

        .hospital-nav-link {
          position: relative;

          padding: 9px 14px;

          border: none;
          outline: none;
          background: transparent;

          color: #647587;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          transition:
            color 0.25s ease,
            background 0.25s ease;
        }

        .hospital-nav-link:hover {
          color: #159c9d;
        }

        .hospital-active-nav-link {
          color: #159c9d;
        }

        .hospital-active-nav-link::after {
          content: "";

          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 1px;

          height: 2px;

          border-radius: 10px;

          background: #159c9d;
        }


        /* =========================================================
           NAV ACTIONS
        ========================================================= */

        .hospital-nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .hospital-login-button,
        .hospital-register-button {
          height: 40px;

          padding: 0 19px;

          border-radius: 7px;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition:
            all 0.25s ease;
        }

        .hospital-login-button {
          border: 1px solid #d4e0e7;
          background: #ffffff;
          color: #486175;
        }

        .hospital-login-button:hover {
          border-color: #159c9d;
          color: #159c9d;
          background: #f2fbfb;
        }

        .hospital-register-button {
          border: 1px solid #159c9d;
          background: #159c9d;
          color: #ffffff;
        }

        .hospital-register-button:hover {
          background: #0e8183;
          border-color: #0e8183;

          box-shadow:
            0 6px 15px rgba(21, 156, 157, 0.22);

          transform: translateY(-1px);
        }


        /* =========================================================
           MOBILE MENU BUTTON
        ========================================================= */

        .hospital-menu-button {
          display: none;

          width: 42px;
          height: 42px;

          border: 1px solid #dbe5ea;
          border-radius: 8px;

          background: #ffffff;

          color: #173550;

          font-size: 22px;
          line-height: 1;

          cursor: pointer;

          transition: all 0.25s ease;
        }

        .hospital-menu-button:hover {
          border-color: #159c9d;
          color: #159c9d;
        }


        /* =========================================================
           MOBILE MENU
        ========================================================= */

        .hospital-mobile-menu {
          display: none;
        }


        /* =========================================================
           MAIN PAGE
        ========================================================= */

        .hospital-treatments-page {
          width: 100%;
          max-width: 1280px;

          margin: 0 auto;
          padding: 65px 30px 90px;
        }


        /* =========================================================
           PAGE HEADER
        ========================================================= */

        .hospital-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 40px;

          margin-bottom: 38px;
        }

        .hospital-page-title {
          margin: 0;

          color: #173550;

          font-size: clamp(36px, 4vw, 52px);
          font-weight: 800;

          line-height: 1.08;
          letter-spacing: -1.8px;
        }

        .hospital-page-subtitle {
          max-width: 680px;

          margin: 15px 0 0;

          color: #738392;

          font-size: 15px;
          line-height: 1.7;
        }


        /* =========================================================
           TREATMENT COUNT
        ========================================================= */

        .hospital-treatment-count {
          min-width: 180px;

          display: flex;
          flex-direction: column;
          align-items: flex-end;

          padding: 16px 20px;

          border: 1px solid #dcebed;
          border-radius: 12px;

          background: #ffffff;

          box-shadow:
            0 7px 22px rgba(30, 65, 85, 0.04);
        }

        .hospital-count-number {
          color: #159c9d;

          font-size: 30px;
          font-weight: 800;

          line-height: 1;
        }

        .hospital-count-text {
          margin-top: 6px;

          color: #82919e;

          font-size: 11px;
          font-weight: 600;

          text-transform: uppercase;
          letter-spacing: 0.8px;
        }


        /* =========================================================
           SEARCH
        ========================================================= */

        .hospital-search-container {
          position: relative;

          width: 100%;
          height: 58px;

          display: flex;
          align-items: center;

          margin-bottom: 35px;

          border: 1px solid #dce6ec;
          border-radius: 10px;

          background: #ffffff;

          box-shadow:
            0 6px 24px rgba(35, 70, 90, 0.045);

          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .hospital-search-container:focus-within {
          border-color: #159c9d;

          box-shadow:
            0 8px 28px rgba(21, 156, 157, 0.1);
        }

        .hospital-search-icon {
          margin-left: 20px;
          color: #159c9d;
          font-size: 18px;
        }

        .hospital-search-input {
          flex: 1;

          width: 100%;
          height: 100%;

          padding: 0 16px;

          border: none;
          outline: none;

          background: transparent;

          color: #263e54;

          font-size: 14px;
        }

        .hospital-search-input::placeholder {
          color: #9aa7b2;
        }

        .hospital-clear-button {
          width: 34px;
          height: 34px;

          margin-right: 11px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;
          border-radius: 50%;

          background: #edf5f6;

          color: #71818f;

          font-size: 13px;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .hospital-clear-button:hover {
          background: #159c9d;
          color: #ffffff;
        }


        /* =========================================================
           TREATMENT LIST
        ========================================================= */

        .hospital-treatment-list {
          display: flex;
          flex-direction: column;

          gap: 18px;
        }


        /* =========================================================
           TREATMENT CARD / ROW
        ========================================================= */

        .hospital-treatment-card {
          position: relative;

          display: flex;
          align-items: flex-start;

          width: 100%;

          padding: 26px 28px;

          border: 1px solid #e2e9ee;
          border-radius: 13px;

          background: #ffffff;

          box-shadow:
            0 7px 25px rgba(30, 60, 80, 0.045);

          overflow: hidden;

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .hospital-treatment-card::before {
          content: "";

          position: absolute;

          left: 0;
          top: 0;
          bottom: 0;

          width: 4px;

          background: #159c9d;

          transform: scaleY(0);
          transform-origin: bottom;

          transition:
            transform 0.3s ease;
        }

        .hospital-treatment-card:hover {
          border-color: #cfe4e6;

          box-shadow:
            0 15px 38px rgba(30, 60, 80, 0.09);

          transform: translateY(-3px);
        }

        .hospital-treatment-card:hover::before {
          transform: scaleY(1);
        }


        /* =========================================================
           TREATMENT ICON
        ========================================================= */

        .hospital-treatment-icon-container {
          flex-shrink: 0;

          width: 82px;
          height: 82px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-right: 27px;

          border-radius: 14px;

          background:
            linear-gradient(
              145deg,
              #e8f8f8,
              #f3fbfb
            );
        }

        .hospital-treatment-icon {
          font-size: 39px;

          line-height: 1;

          transition:
            transform 0.3s ease;
        }

        .hospital-treatment-card:hover
        .hospital-treatment-icon {
          transform: scale(1.08);
        }


        /* =========================================================
           TREATMENT INFORMATION
        ========================================================= */

        .hospital-treatment-info {
          flex: 1;

          min-width: 0;
        }

        .hospital-treatment-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 20px;
        }

        .hospital-treatment-name {
          margin: 0;

          color: #18364f;

          font-size: 22px;
          font-weight: 750;

          line-height: 1.25;
        }

        .hospital-treatment-label {
          display: block;

          margin-top: 5px;

          color: #98a6b2;

          font-size: 11px;
          font-weight: 600;

          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .hospital-available-badge {
          flex-shrink: 0;

          padding: 6px 10px;

          border-radius: 20px;

          background: #e9f8f3;

          color: #22956e;

          font-size: 11px;
          font-weight: 700;

          white-space: nowrap;
        }

        .hospital-treatment-line {
          width: 100%;
          height: 1px;

          margin: 16px 0;

          background: #edf1f3;
        }

        .hospital-treatment-description {
          max-width: 900px;

          margin: 0 0 17px;

          color: #687a89;

          font-size: 14px;

          line-height: 1.7;
        }


        /* =========================================================
           SERVICES
        ========================================================= */

        .hospital-services {
          display: flex;
          flex-wrap: wrap;

          gap: 8px 22px;

          margin-bottom: 20px;
        }

        .hospital-service {
          display: flex;
          align-items: center;

          gap: 7px;

          color: #596f80;

          font-size: 12.5px;
          font-weight: 600;

          line-height: 1.5;
        }

        .hospital-service-check {
          width: 18px;
          height: 18px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 50%;

          background: #e7f7f5;

          color: #159c9d;

          font-size: 10px;
          font-weight: 800;
        }


        /* =========================================================
           FIND DOCTOR BUTTON
        ========================================================= */

        .hospital-find-doctor-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 40px;

          padding: 0 17px;

          border: 1px solid #159c9d;
          border-radius: 7px;

          background: #ffffff;

          color: #159c9d;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          transition:
            all 0.25s ease;
        }

        .hospital-find-doctor-button:hover {
          background: #159c9d;
          color: #ffffff;

          box-shadow:
            0 6px 16px rgba(21, 156, 157, 0.18);

          transform: translateY(-1px);
        }


        /* =========================================================
           EMPTY STATE
        ========================================================= */

        .hospital-empty {
          min-height: 390px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          padding: 40px;

          border: 1px solid #e2e9ee;
          border-radius: 14px;

          background: #ffffff;

          text-align: center;
        }

        .hospital-empty-icon {
          width: 72px;
          height: 72px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 20px;

          border-radius: 50%;

          background: #eaf7f7;

          font-size: 28px;
        }

        .hospital-empty-title {
          margin: 0 0 9px;

          color: #19364e;

          font-size: 23px;
          font-weight: 750;
        }

        .hospital-empty-text {
          margin: 0 0 22px;

          color: #7b8a97;

          font-size: 14px;
        }

        .hospital-primary-button {
          min-height: 42px;

          padding: 0 20px;

          border: none;
          border-radius: 7px;

          background: #159c9d;

          color: #ffffff;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition:
            all 0.25s ease;
        }

        .hospital-primary-button:hover {
          background: #0e8183;

          transform: translateY(-1px);

          box-shadow:
            0 7px 17px rgba(21, 156, 157, 0.2);
        }


        /* =========================================================
           FOOTER
        ========================================================= */

        .hospital-footer {
          width: 100%;

          background: #102d45;

          color: #ffffff;
        }

        .hospital-footer-inner {
          width: 100%;
          max-width: 1280px;

          margin: 0 auto;

          padding: 60px 30px 50px;

          display: grid;

          grid-template-columns:
            1.5fr
            0.8fr
            1fr
            1.2fr;

          gap: 55px;
        }


        /* =========================================================
           FOOTER BRAND
        ========================================================= */

        .hospital-footer-brand {
          display: flex;
          align-items: center;

          gap: 11px;

          margin-bottom: 20px;
        }

        .hospital-footer-logo {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #159c9d;

          color: #ffffff;

          font-size: 24px;
        }

        .hospital-footer-brand-name {
          color: #ffffff;

          font-size: 20px;
          font-weight: 800;

          line-height: 1.1;
        }

        .hospital-footer-brand-sub {
          margin-top: 3px;

          color: #83a0b5;

          font-size: 9px;
          font-weight: 600;

          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hospital-footer-description {
          max-width: 330px;

          margin: 0;

          color: #9bb0bf;

          font-size: 13px;

          line-height: 1.8;
        }


        /* =========================================================
           FOOTER COLUMNS
        ========================================================= */

        .hospital-footer-column {
          display: flex;
          flex-direction: column;

          align-items: flex-start;
        }

        .hospital-footer-heading {
          position: relative;

          margin: 0 0 22px;

          color: #ffffff;

          font-size: 14px;
          font-weight: 700;
        }

        .hospital-footer-heading::after {
          content: "";

          display: block;

          width: 28px;
          height: 2px;

          margin-top: 8px;

          border-radius: 10px;

          background: #159c9d;
        }


        /* =========================================================
           FOOTER LINKS
        ========================================================= */

        .hospital-footer-link,
        .hospital-footer-text {
          display: block;

          margin-bottom: 11px;

          color: #9bb0bf;

          font-size: 13px;

          line-height: 1.5;
        }

        .hospital-footer-link {
          padding: 0;

          border: none;
          background: transparent;

          cursor: pointer;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .hospital-footer-link:hover {
          color: #52c8c8;

          transform: translateX(3px);
        }

        .hospital-footer-text {
          margin-bottom: 13px;
        }


        /* =========================================================
           FOOTER BOTTOM
        ========================================================= */

        .hospital-footer-bottom {
          width: 100%;
          max-width: 1280px;

          margin: 0 auto;

          padding: 20px 30px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          border-top: 1px solid rgba(255, 255, 255, 0.09);

          color: #7892a4;

          font-size: 11px;
        }

        .hospital-footer-bottom-links {
          display: flex;
          align-items: center;

          gap: 22px;
        }

        .hospital-footer-bottom-links span {
          cursor: pointer;

          transition:
            color 0.2s ease;
        }

        .hospital-footer-bottom-links span:hover {
          color: #52c8c8;
        }


        /* =========================================================
           LARGE TABLET
        ========================================================= */

        @media (max-width: 1100px) {

          .hospital-navbar-inner {
            padding: 0 22px;
          }

          .hospital-nav-links {
            gap: 0;
          }

          .hospital-nav-link {
            padding: 9px 9px;
            font-size: 13px;
          }

          .hospital-active-nav-link::after {
            left: 9px;
            right: 9px;
          }

          .hospital-treatments-page {
            padding-left: 25px;
            padding-right: 25px;
          }

          .hospital-footer-inner {
            grid-template-columns:
              1.5fr
              1fr
              1fr;

            gap: 40px;
          }

          .hospital-footer-inner
          .hospital-footer-column:last-child {
            grid-column: 2 / 4;
          }
        }


        /* =========================================================
           TABLET
        ========================================================= */

        @media (max-width: 850px) {

          .hospital-navbar-inner {
            height: 70px;
          }

          .hospital-nav-links,
          .hospital-nav-actions {
            display: none;
          }

          .hospital-menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .hospital-mobile-menu {
            display: flex;

            flex-direction: column;

            padding: 12px 20px 22px;

            border-top: 1px solid #edf1f3;

            background: #ffffff;

            box-shadow:
              0 12px 25px rgba(20, 50, 70, 0.08);
          }

          .hospital-mobile-nav-link {
            width: 100%;

            padding: 13px 12px;

            border: none;
            border-radius: 7px;

            background: transparent;

            color: #536a7b;

            text-align: left;

            font-size: 14px;
            font-weight: 600;

            cursor: pointer;

            transition:
              all 0.2s ease;
          }

          .hospital-mobile-nav-link:hover {
            background: #f0f9f9;
            color: #159c9d;
          }

          .hospital-mobile-active-link {
            background: #eaf8f8;

            color: #159c9d;
          }

          .hospital-mobile-divider {
            height: 1px;

            margin: 10px 0 15px;

            background: #e7edf0;
          }

          .hospital-mobile-login-button,
          .hospital-mobile-register-button {
            width: 100%;

            min-height: 43px;

            margin-top: 8px;

            border-radius: 7px;

            font-size: 13px;
            font-weight: 700;

            cursor: pointer;
          }

          .hospital-mobile-login-button {
            border: 1px solid #d5e1e7;

            background: #ffffff;

            color: #536a7b;
          }

          .hospital-mobile-register-button {
            border: 1px solid #159c9d;

            background: #159c9d;

            color: #ffffff;
          }

          .hospital-page-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 25px;
          }

          .hospital-treatment-count {
            align-items: flex-start;
            min-width: 150px;
          }

          .hospital-treatment-card {
            padding: 22px;
          }

          .hospital-footer-inner {
            grid-template-columns: 1fr 1fr;
          }

          .hospital-footer-inner
          .hospital-footer-column:last-child {
            grid-column: auto;
          }
        }


        /* =========================================================
           MOBILE
        ========================================================= */

        @media (max-width: 600px) {

          .hospital-navbar-inner {
            height: 66px;
            padding: 0 16px;
          }

          .hospital-logo-icon {
            width: 39px;
            height: 39px;

            border-radius: 10px;

            font-size: 22px;
          }

          .hospital-logo-text {
            font-size: 18px;
          }

          .hospital-logo-subtext {
            font-size: 8px;
          }

          .hospital-treatments-page {
            padding: 45px 16px 65px;
          }

          .hospital-page-title {
            font-size: 36px;
            letter-spacing: -1.2px;
          }

          .hospital-page-subtitle {
            font-size: 13px;
            line-height: 1.7;
          }

          .hospital-treatment-count {
            width: 100%;

            align-items: center;

            padding: 15px;
          }

          .hospital-count-number {
            font-size: 26px;
          }

          .hospital-count-text {
            font-size: 10px;
          }

          .hospital-search-container {
            height: 54px;
            margin-bottom: 25px;
          }

          .hospital-search-input {
            padding: 0 10px;
            font-size: 13px;
          }

          .hospital-search-input::placeholder {
            font-size: 12px;
          }

          .hospital-treatment-card {
            flex-direction: column;
            padding: 22px 19px;
          }

          .hospital-treatment-icon-container {
            width: 64px;
            height: 64px;

            margin-right: 0;
            margin-bottom: 18px;
          }

          .hospital-treatment-icon {
            font-size: 31px;
          }

          .hospital-treatment-heading {
            flex-direction: column;
            gap: 12px;
          }

          .hospital-treatment-name {
            font-size: 20px;
          }

          .hospital-available-badge {
            align-self: flex-start;
          }

          .hospital-treatment-description {
            font-size: 13px;
          }

          .hospital-services {
            flex-direction: column;
            gap: 9px;
          }

          .hospital-find-doctor-button {
            width: 100%;
          }

          .hospital-empty {
            min-height: 330px;
            padding: 30px 20px;
          }

          .hospital-footer-inner {
            grid-template-columns: 1fr;
            gap: 35px;
            padding: 45px 20px 35px;
          }

          .hospital-footer-inner
          .hospital-footer-column:last-child {
            grid-column: auto;
          }

          .hospital-footer-description {
            max-width: 100%;
          }

          .hospital-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            padding: 18px 20px;
            line-height: 1.6;
          }

          .hospital-footer-bottom-links {
            flex-direction: column;
            align-items: flex-start;
            gap: 7px;
          }
        }


        /* =========================================================
           SMALL MOBILE
        ========================================================= */

        @media (max-width: 400px) {

          .hospital-logo-text {
            font-size: 17px;
          }

          .hospital-page-title {
            font-size: 32px;
          }

          .hospital-page-subtitle {
            font-size: 12.5px;
          }

          .hospital-treatment-card {
            padding: 19px 16px;
          }

          .hospital-treatment-name {
            font-size: 18px;
          }

          .hospital-treatment-description {
            font-size: 12.5px;
          }

          .hospital-service {
            font-size: 12px;
          }
        }


        /* =========================================================
           ACCESSIBILITY
        ========================================================= */

        @media (prefers-reduced-motion: reduce) {

          .hospital-treatments-wrapper *,
          .hospital-treatments-wrapper *::before,
          .hospital-treatments-wrapper *::after {
            scroll-behavior: auto !important;

            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>





      {/* =========================================================
          MAIN
      ========================================================= */}

      <main className="hospital-treatments-page">

        {/* PAGE HEADER */}
        <section className="hospital-page-header">

          <div>
            <h1 className="hospital-page-title">
              Medical Treatments
            </h1>

            <p className="hospital-page-subtitle">
              Explore specialized medical treatments and
              healthcare services provided by MediCo
              specialists across multiple departments.
            </p>
          </div>




        </section>


        {/* SEARCH */}
        <div className="hospital-search-container">

          <span className="hospital-search-icon">
            🔍
          </span>

          <input
            type="text"
            className="hospital-search-input"
            placeholder="Search treatments, departments or services..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="hospital-clear-button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>


        {/* =========================================================
            TREATMENT LIST
        ========================================================= */}

        <section className="hospital-treatment-list">

          {filteredTreatments.length > 0 ? (

            filteredTreatments.map((treatment) => (

              <article
                className="hospital-treatment-card"
                key={treatment.id}
              >

                {/* ICON */}
                <div className="hospital-treatment-icon-container">

                  <span className="hospital-treatment-icon">
                    {treatment.icon}
                  </span>

                </div>


                {/* INFORMATION */}
                <div className="hospital-treatment-info">

                  {/* HEADING */}
                  <div className="hospital-treatment-heading">

                    <div>

                      <h2 className="hospital-treatment-name">
                        {treatment.title}
                      </h2>

                      <span className="hospital-treatment-label">
                        Treatment 0{treatment.id}
                      </span>

                    </div>

                    <span className="hospital-available-badge">
                      Available
                    </span>

                  </div>


                  {/* LINE */}
                  <div className="hospital-treatment-line" />


                  {/* DESCRIPTION */}
                  <p className="hospital-treatment-description">
                    {treatment.description}
                  </p>


                  {/* SERVICES */}
                  <div className="hospital-services">

                    {treatment.features.map(
                      (feature, index) => (

                        <span
                          className="hospital-service"
                          key={`${feature}-${index}`}
                        >

                          <span className="hospital-service-check">
                            ✓
                          </span>

                          {feature}

                        </span>

                      )
                    )}

                  </div>


                  {/* BUTTON */}
                  <button
                    type="button"
                    className="hospital-find-doctor-button"
                    onClick={() =>
                      navigate(treatment.path)
                    }
                  >
                    View Treatment →
                  </button>

                </div>

              </article>

            ))

          ) : (

            /* EMPTY */
            <div className="hospital-empty">

              <div className="hospital-empty-icon">
                🔍
              </div>

              <h2 className="hospital-empty-title">
                No Treatments Found
              </h2>

              <p className="hospital-empty-text">
                We couldn't find any treatment matching
                "{search}".
              </p>

              <button
                type="button"
                className="hospital-primary-button"
                onClick={() => setSearch("")}
              >
                View All Treatments
              </button>

            </div>

          )}

        </section>

      </main>



    </div>
  );
}
