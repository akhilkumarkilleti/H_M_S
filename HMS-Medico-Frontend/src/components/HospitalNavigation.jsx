import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HospitalNavigation.css";
import ThemeToggle from "./ThemeToggle";

export default function HospitalNavigation() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);
  const [hoveredTreatment, setHoveredTreatment] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);



  const go = (path) => {
    if (!path) return;

    setOpenMenu(null);
    setHoveredTreatment(null);
    setIsEnquiryOpen(false);

    navigate(path);
  };



  const handleMainMouseEnter = (key) => {
    setOpenMenu(key);

    if (key !== "treatments") {
      setHoveredTreatment(null);
    }
  };

  const handleMainClick = (key) => {
    if (key === "treatments") {
      setOpenMenu((current) =>
        current === key ? null : key
      );

      setHoveredTreatment(null);
    }
  };


  const handleTreatmentMouseEnter = (item) => {
    if (item.children?.length) {
      setHoveredTreatment(item.label);
    } else {
      setHoveredTreatment(null);
    }
  };



  const handleTreatmentClick = (item) => {
    go(item.path);
  };



  const openEnquiry = () => {
    setOpenMenu(null);
    setHoveredTreatment(null);
    setIsEnquiryOpen(true);
  };

  const closeEnquiry = () => {
    setIsEnquiryOpen(false);
  };

  const handleEnquirySubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmittingEnquiry(true);

    try {
      const response = await fetch("https://formspree.io/f/xyeyrvwl", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Enquiry submission failed");

      form.reset();
      closeEnquiry();
      window.alert("Form sent successfully!");
    } catch (error) {
      console.error("Enquiry submission error:", error);
      window.alert("Unable to send your enquiry. Please try again.");
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };



  const menu = {
    hospitals: [
      ["Hospital Information", "/hospitalinformationbio"],
      ["MediCo-Kukatpally Branch", "/"],
      ["MediCo-HiTechCity Branch", "/"],
    ],

    treatments: [
      {
        label: "Our-Treatments",
        path: "/hospitaltreatments",
      },



      {
        label: "Cancer-Care",
        path: "/cancercarepage",

        children: [

          ["Blood Cancer", "/cancerbloodpage"],
          ["Breast Cancer", "/cancerbreastpage"],
          ["Lung Cancer", "/lungcancerpage"],
          ["Liver Cancer", "/livercancerpage"],
          ["Brain Cancer", "/braincancerpage"],
        ],
      },

      {
        label: "Cardiac Sciences",
        path: "/heartcardiopage",

        children: [
          ["Cardiology", "/cardiologypage"],
          ["Heart Surgery", "/heartsurgerypage"],
          ["Vascular Sciences", "/vascularsciencespage"],
        ],
      },

      {
        label: "Neurosciences",
        path: "/neurologypage",

        children: [

          ["Neurology", "/neurologydetailpage"],
          ["Brain & Spine", "/brainspinepage"],

        ],
      },


      {
        label: "Orthopaedics & Joint Replacement",
        path: "/orthopedicpage",

        children: [
          ["Knee Replacement", "/kneereplacementpage"],
          ["Hip Replacement", "/hipreplacementpage"],
          ["Shoulder Injury", "/shouldercarepage"],
          ["Spine Care", "/spinecarepage"],
          ["Sports Injury", "/sportsinjurypage"],
        ],
      },



//       {
//         label: "Robotic Surgery",
//         path: "/roboticsurgerypage",
//
//         children: [
//           ["Robotic Urology", "/robotic-surgery/urology"],
//           ["Robotic Gynecology", "/robotic-surgery/gynecology"],
//           [
//             "Robotic General Surgery",
//             "/robotic-surgery/general",
//           ],
//
//         ],
//       },


      {
        label: "Kidney-Liver Transplant",
        path: "/kidneylivertransplant",

        children: [
          ["Kidney Transplant", "/kidneytransplantpage"],
          ["Liver Transplant", "/livertransplantpage"],
          ["Liver Donor Transplant", "/livingdonortransplantpage"],
          ["Transplant Follow-up Care", "/transplantfollowuppage"],
        ],
      },
    ],

    services: [
      ["Preventive Health Checkups", "/healthallcheckups"],
      ["Home Healthcare", "/healthhomepage"],
      ["Medi Max-Lab / Diagnostics", "/maxlabdiagnostics"],
      ["Organ-Blood Donations", "/healthdonationspage"],
      ["Ambulance Servoce", "/ambulanceservice"],
    ],
  };

  return (
    <>
      {/* =====================================================
          ANNOUNCEMENT BAR
      ===================================================== */}

      <div className="common-announcement">
        <span>
          Advanced Healthcare, Modern technology and
          Patient-focused care
        </span>

        <span className="common-announcement-right">
          24/7 Emergency Support ·
        </span>
      </div>

      {/* =====================================================
          UTILITY BAR
      ===================================================== */}

      <div className="common-utility-bar">
        <div className="common-utility-left">

          <button onClick={() => go("/finddoctors")}>
            Find a Doctor
          </button>

          <button onClick={() => go("/articles")}>
            Blogs
          </button>



          <button onClick={() => go("/investors")}>
            Investors
          </button>

          <button onClick={() => go("/research")}>
            Research
          </button>

          <button onClick={() => go("/hospitalinformationbio")}>
            About Us
          </button>

        </div>

        <div className="common-utility-right">

          <a
            href="https://wa.me/917659045893"
            target="_blank"
            rel="noreferrer"
          >
            💬 WhatsApp Us (24/7)
          </a>

          <a href="tel:+917659045893">
            ☎ +91 7659045893
          </a>

        </div>
      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav
        className="common-navbar"
        onMouseLeave={() => {
          setOpenMenu(null);
          setHoveredTreatment(null);
        }}
      >

        {/* ===================================================
            LOGO
        =================================================== */}

        <button
          className="common-logo"
          onClick={() => go("/")}
          aria-label="MediCo home"
        >
          <span className="common-logo-mark">
            ✚
          </span>

          <span>
            <strong>MediCo</strong>
            <small>HealthCare</small>
          </span>
        </button>

        {/* ===================================================
            NAV LINKS
        =================================================== */}

        <div className="common-nav-links">

          {Object.entries(menu).map(
            ([key, items]) => {

              const isOpen = openMenu === key;

              return (
                <div
                  className="common-nav-group"
                  key={key}
                  onMouseEnter={() =>
                    handleMainMouseEnter(key)
                  }
                >

                  {/* =========================================
                      MAIN NAV BUTTON
                  ========================================= */}

                  <button
                    type="button"
                    className={
                      isOpen
                        ? "common-nav-button active"
                        : "common-nav-button"
                    }
                    onClick={() =>
                      handleMainClick(key)
                    }
                  >
                    {key[0].toUpperCase() + key.slice(1)}

                    <span className="main-arrow">
                      ▾
                    </span>
                  </button>

                  {/* =========================================
                      MAIN DROPDOWN
                  ========================================= */}

                  {isOpen && (
                    <div
                      className={
                        key === "treatments"
                          ? "common-dropdown treatments-dropdown"
                          : "common-dropdown"
                      }
                      onMouseEnter={() =>
                        setOpenMenu(key)
                      }
                    >

                      {items.map(
                        (item, index) => {

                          {/* =================================
                              SIMPLE ITEM
                          ================================= */}

                          if (Array.isArray(item)) {
                            const [label, path] = item;

                            return (
                              <button
                                type="button"
                                key={`${label}-${index}`}
                                className="dropdown-simple-button"
                                onClick={() => go(path)}
                              >
                                {label}
                              </button>
                            );
                          }

                          {/* =================================
                              OBJECT ITEM
                          ================================= */}

                          const hasChildren =
                            item.children &&
                            item.children.length > 0;

                          const isTreatmentHovered =
                            hoveredTreatment ===
                            item.label;

                          return (
                            <div
                              className={
                                hasChildren
                                  ? "dropdown-item-wrapper has-submenu"
                                  : "dropdown-item-wrapper"
                              }
                              key={item.label}
                              onMouseEnter={() =>
                                handleTreatmentMouseEnter(
                                  item
                                )
                              }
                            >



                              <button
                                type="button"
                                className={
                                  isTreatmentHovered
                                    ? "dropdown-parent-button submenu-hovered"
                                    : "dropdown-parent-button"
                                }
                                onClick={() =>
                                  handleTreatmentClick(
                                    item
                                  )
                                }
                              >

                                <span>
                                  {item.label}
                                </span>

                                {hasChildren && (
                                  <span
                                    className={
                                      isTreatmentHovered
                                        ? "submenu-arrow rotated"
                                        : "submenu-arrow"
                                    }
                                  >
                                    ›
                                  </span>
                                )}

                              </button>

                              {/* =================================
                                  NESTED DROPDOWN
                              ================================= */}

                              {hasChildren &&
                                isTreatmentHovered && (
                                  <div
                                    className="nested-dropdown"
                                    onMouseEnter={() =>
                                      setHoveredTreatment(
                                        item.label
                                      )
                                    }
                                  >

                                    <div className="nested-dropdown-title">
                                      {item.label}
                                    </div>

                                    {item.children.map(
                                      (
                                        [label, path],
                                        childIndex
                                      ) => (
                                        <button
                                          type="button"
                                          key={`${label}-${childIndex}`}
                                          className="nested-dropdown-button"
                                          onClick={() =>
                                            go(path)
                                          }
                                        >

                                          <span>
                                            {label}
                                          </span>

                                          <span className="nested-arrow">
                                            →
                                          </span>

                                        </button>
                                      )
                                    )}

                                  </div>
                                )}

                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                </div>
              );
            }
          )}

          {/* =================================================
              MEDIA CENTRE
          ================================================= */}

          <button
            type="button"
            className="common-nav-button"
            onClick={() => go("/mediacentre")}
          >
            Media Centre
          </button>

          {/* =================================================
              QUICK ENQUIRY
          ================================================= */}

          <button
            type="button"
            className="common-nav-button"
            onClick={openEnquiry}
          >
            Quick Enquiry
          </button>

          <a
            className="common-nav-button"
            href={import.meta.env.BASE_URL + "inventory/"}
          >
            Inventory
          </a>

        </div>

        {/* ===================================================
            RIGHT ACTIONS
        =================================================== */}

        <div className="common-nav-actions">

          {/* THEME TOGGLE */}

          <ThemeToggle />

          {/* LOGIN */}

          <div
            className="common-nav-group"
            onMouseEnter={() => {
              setOpenMenu("login");
              setHoveredTreatment(null);
            }}
          >

            <button
              type="button"
              className={
                openMenu === "login"
                  ? "common-nav-button active"
                  : "common-nav-button"
              }
              onClick={() => {
                setOpenMenu(
                  openMenu === "login"
                    ? null
                    : "login"
                );

                setHoveredTreatment(null);
              }}
            >
              Get Started ▾
            </button>

            {openMenu === "login" && (
              <div className="common-dropdown common-login-dropdown">

                <button
                  type="button"
                  onClick={() =>
                    go("/patient/login")
                  }
                >
                  Patient - Login
                </button>

                <button
                  type="button"
                  onClick={() =>
                    go("/admin/login")
                  }
                >
                  Admin / Staff / Doctor - Login
                </button>

              </div>
            )}

          </div>



        </div>

      </nav>

      {/* =====================================================
          QUICK ENQUIRY DRAWER
      ===================================================== */}

      {isEnquiryOpen && (
        <div
          className="enquiry-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-enquiry-title"
        >

          <div
            className="enquiry-overlay"
            onClick={closeEnquiry}
          />

          <aside className="enquiry-side-drawer">

            <div className="enquiry-drawer-header">

              <div>
                <span className="enquiry-drawer-label">
                  QUICK ENQUIRY
                </span>

                <h2 id="quick-enquiry-title">
                  Get In Touch
                </h2>
              </div>

              <button
                type="button"
                className="enquiry-close-button"
                onClick={closeEnquiry}
                aria-label="Close enquiry form"
              >
                ×
              </button>

            </div>

            <div className="enquiry-drawer-about">

              <h3>
                Empowering Health.
              </h3>

              <h4>
                Backed by Science-Driven by Purpose.
              </h4>

              <p>
                At MediCo, we are committed to
                redefining healthcare through
                technology, trusted medical
                professionals, and patient-focused
                healthcare solutions.
              </p>

              <p>
                Our platform helps patients connect
                with approved doctors, access
                healthcare services and manage their
                healthcare conveniently.
              </p>

            </div>

            <p className="enquiry-form-description">
              Have a question, suggestion or need
              more information? Send us your enquiry
              and our team will get back to you.
            </p>

            <form
              onSubmit={handleEnquirySubmit}
              className="enquiry-form"
            >

              <div className="enquiry-form-row">

                <div className="enquiry-form-group">

                  <label htmlFor="common-enquiry-name">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    id="common-enquiry-name"
                    name="name"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </div>

                <div className="enquiry-form-group">

                  <label htmlFor="common-enquiry-phone">
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    id="common-enquiry-phone"
                    name="phone"
                    placeholder="10 digit phone number"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    required
                  />

                </div>

              </div>

              <div className="enquiry-form-group">

                <label htmlFor="common-enquiry-email">
                  Email Address *
                </label>

                <input
                  type="email"
                  id="common-enquiry-email"
                  name="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                />

              </div>

              <div className="enquiry-form-group">

                <label htmlFor="common-enquiry-subject">
                  Subject
                </label>

                <input
                  type="text"
                  id="common-enquiry-subject"
                  name="subject"
                  placeholder="Enter subject"
                />

              </div>

              <div className="enquiry-form-group">

                <label htmlFor="common-enquiry-message">
                  Message *
                </label>

                <textarea
                  id="common-enquiry-message"
                  name="message"
                  rows="5"
                  placeholder="Write your enquiry here..."
                  required
                />

              </div>

              <input
                type="hidden"
                name="_subject"
                value="New MediCo Quick Enquiry"
              />

              <button
                type="submit"
                className="enquiry-submit-btn"
                disabled={isSubmittingEnquiry}
              >
                Send Enquiry →
              </button>

            </form>

          </aside>

        </div>
      )}
    </>
  );
}
