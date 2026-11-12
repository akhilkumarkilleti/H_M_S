import React from "react";import { useNavigate } from "react-router-dom";

import "./HospitalFooter.css";

export default function HospitalFooter() {
  return (
    <footer className="main-footer">

      {/* =====================================================
          FOOTER TOP
      ===================================================== */}
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">✚</span>
            MediCo
          </div>

          <p>
            Modern healthcare for everyone.
          </p>
        </div>

        {/* ABOUT */}
        <div className="footer-column">
          <h4>About</h4>
          <a href="/hospitalinformationbio">About Us</a>
          <a href="/careers">Careers</a>
          <a href="/articles">Blog</a>
          <a href="/">Contact Us</a>
        </div>

        {/* PATIENTS */}
        <div className="footer-column">
          <h4>For Patients</h4>
          <a href="/finddoctors">Search for doctors</a>
          <a href="/patient/login">Patient Profile</a>
          <a href="/patient/register">Create Patient Account</a>
          <a href="/articles">Health-articles</a>
        </div>

        {/* DOCTORS */}
        <div className="footer-column">
          <h4>For Doctors</h4>
          <a href="/doctor/login">Doctor Profile</a>
          <a href="/research">Research</a>
        </div>

        {/* HOSPITALS */}
        <div className="footer-column">
          <h4>For Hospitals</h4>
          <a href="/hospitalinformationbio">Hospital Profile</a>
          <a href="/">Kukatpally Branch</a>
        </div>

        {/* MORE */}
        <div className="footer-column">
          <h4>More</h4>
          <a href="/help">Help</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms">Terms &amp; Conditions</a>
          <a href="/health-wiki">MediCo Health Wiki</a>
        </div>



         <div className="footer-column">
                  <h4>Follow-On</h4>

                  <div className="social-icons">
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noreferrer"
                      data-text="Facebook"
                    >
                      <span>f</span>

                    </a>

                    <a
                      href="https://x.com/?lang=en"
                      target="_blank"
                      rel="noreferrer"
                      data-text="Twitter"

                    >
                      𝕏
                    </a>

                    <a
                      href="https://www.linkedin.com/login/in/"
                      target="_blank"
                      rel="noreferrer"
                      data-text="Linkdein"

                    >
                      in
                    </a>

                    <a
                      href="https://www.youtube.com/"
                      target="_blank"
                      rel="noreferrer"
                      data-text="YouTube"

                    >
                      ▶
                    </a>


                  </div>
          </div>

      </div>



      <div className="footer-bottom">

        <div>
          <a href="#">Recaptcha Policy</a>
          <span>|</span>
          <a href="#">Recaptcha Terms</a>
        </div>

        <p>
          © 2026 MediCo. All rights reserved.
        </p>

      </div>


      <div className="footer-callback">

        <span className="callback-icon">
          ☎
        </span>

        <div>
          <small>Call Back</small>

          <strong>
            <a
              href="tel:+917659045893"
              style={{
                color: "white",
                textDecoration: "none"
              }}
            >
              +91 7659045893
            </a>
          </strong>
        </div>

      </div>

    </footer>
  );
}
