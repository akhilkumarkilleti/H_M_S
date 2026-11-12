import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HospitalHome.css";
import home1Img from "../assets/home1.png";
import doctorArticleImg from "../assets/doctorarticlepic.jpg";
import mainPageImg from "../assets/Mainpage.jpg";

function HospitalHome() {
  const navigate = useNavigate();

  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);




  const openDoctors = () => {
    navigate("/patient/find-doctors");
  };

  const openEnquiry = () => {
    setIsEnquiryOpen(true);
    setActiveMegaMenu(null);
  };

  const closeEnquiry = () => {
    setIsEnquiryOpen(false);
  };


  const handleEnquirySubmit = async (e) => {
      e.preventDefault();

      const form = e.target;
      setIsSubmitting(true);

      try {
        const response = await fetch(
          "https://formspree.io/f/xyeyrvwl",
          {
            method: "POST",
            body: new FormData(form),
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          // Clear the form
          form.reset();

          // Close enquiry drawer
          closeEnquiry();

          // Show success popup
          setShowSuccess(true);
        }else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        alert("Unable to submit your enquiry. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

  const toggleMegaMenu = (menuName) => {
    setActiveMegaMenu((previous) =>
      previous === menuName ? null : menuName
    );

    setIsEnquiryOpen(false);
  };

  const closeMegaMenu = () => {
    setActiveMegaMenu(null);
  };

  const openHospitalInformation = () => {
    closeMegaMenu();
    navigate("/hospitalinformationbio");
  };





  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveMegaMenu(null);
        setIsEnquiryOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =====================================================
     BODY SCROLL
  ===================================================== */

  useEffect(() => {
    document.body.style.overflow = isEnquiryOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isEnquiryOpen]);

  return (
    <div className="hospital-page">


     

      <section className="hospital-hero">

        <img
          src={home1Img}
          alt="MediCo Hospital"
          className="hospital-hero-image"
        />

        <div className="hero-image-overlay" />


        <div className="hero-overlay-content">

          <h1>
            Healthcare
            <br />
            <span>Made-Simple</span>
          </h1>



        </div>


        {/* FLOATING PHONE */}

        <a
          href="tel:+917659045893"
          className="floating-phone"
        >

          <span className="floating-phone-icon">
            ☎
          </span>

          <strong>
            +91 7659045893
          </strong>

        </a>


        {/* CALLBACK */}

        <button
          type="button"
          className="floating-callback"
          onClick={openEnquiry}
        >
          <span>☎</span>
          Call Back
        </button>

      </section>





      {/* =====================================================
          SERVICES SECTION
      ===================================================== */}

      <section
        id="services"
        className="services-section"
      >

        <h2>
          Healthcare Made Simple
        </h2>

        <p className="section-description">
          Everything you need for a better healthcare experience.
        </p>


        <div className="service-cards">

          <div
            className="service-card"
            role="button"
            tabIndex={0}


          >

            <div className="service-icon">
              🩺
            </div>

            <h3>
              Find Doctors
            </h3>

            <p>
              View doctors who have been approved and are
              available for patients.
            </p>


            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/finddoctors")
              }
            >
              Find Doctors
            </button>

          </div>


          <div className="service-card">

            <div className="service-icon">
              💉
            </div>

            <h3>
              Health CheckUp
            </h3>

            <p>
              Book your appointment for your Checkup.
            </p>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/healthallcheckups")
              }
            >
              Get Health CheckUp
            </button>

          </div>


          <div className="service-card">

            <div className="service-icon">
              💊
            </div>

            <h3>
              Pharmacy
            </h3>

            <p>
              Tablets Information
            </p>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/patient/login")
              }
            >
              Pharmacy
            </button>

          </div>


          <div className="service-card">

            <div className="service-icon">
              ⚕️
            </div>

            <h3>
              Inventory - Infra Details
            </h3>

            <p>
              You can go through infrastructure data of hospital
            </p>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                window.location.href = "http://localhost:3001";
              }}
            >
              Inventory
            </button>
          </div>

        </div>

      </section>




      {/* ====
          ARTICLES
      ==== */}

      <section
        id="articles"
        className="about-section"
      >

        <div className="about-content">

          <div className="section-label">
           <h1> COMMON HEALTH FEED</h1>
          </div>

          <h2>
            Technology Meets Healthcare
          </h2>

          <p>
            MediCo is designed to make healthcare accessible,
            convenient and efficient.
          </p>

          <p>
            Here you can view the top doctors tips as articles
            for reference.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() =>
              navigate("/articles")
            }
          >
            Health-Blogs-Use-Cases
          </button>

        </div>


        <div className="about-box">

          <img
            src={doctorArticleImg}
            alt="Better Healthcare"
            className="about-image"
          />

        </div>

      </section>




      {/* =====================================================
          QUICK ENQUIRY DRAWER
      ===================================================== */}

      {isEnquiryOpen && (

        <div className="enquiry-layer">
          <div className="enquiry-overlay" onClick={closeEnquiry}/>
          <aside className="enquiry-side-drawer">
            <div className="enquiry-drawer-header">
              <div>
                <span className="enquiry-drawer-label">QUICK ENQUIRY</span>
                <h2>Get In Touch</h2>
              </div>
              <button type="button" className="enquiry-close-button" onClick={closeEnquiry}>×</button>
            </div>
            <div className="enquiry-drawer-about">
              <h3>Empowering Health.</h3>
              <h4>Backed by Science. Driven by Purpose. </h4>
              <p>
                At MediCo, we are committed to redefining
                healthcare through technology, trusted medical
                professionals, and patient-focused healthcare
                solutions.
              </p>
              <p>
                Our platform helps patients connect with approved
                doctors, access online consultations, find
                healthcare services and manage their healthcare
                conveniently from anywhere.
              </p>
            </div>
            <p className="enquiry-form-description">
              Have a question, suggestion or need more information?
              Send us your enquiry and our team will get back to you.
            </p>
            <form  onSubmit={handleEnquirySubmit} className="enquiry-form" >

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="enquiry-name">Full Name *</label>
                  <input type="text" id="enquiry-name" name="name" placeholder="Enter your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="enquiry-phone">Phone Number *</label>
                  <input type="tel" id="enquiry-phone" name="phone" placeholder="Enter phone number" maxLength="10" pattern="[0-9]{10}" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="enquiry-email">Email Address *</label>
                <input type="email" id="enquiry-email" name="email" placeholder="Enter your email address" required />
              </div>
              <div className="form-group">
                <label htmlFor="enquiry-subject">Subject</label>
                <input type="text" id="enquiry-subject" name="subject" placeholder="Enter subject"/>
              </div>
              <div className="form-group">
                <label htmlFor="enquiry-message">Message *</label>
                <textarea id="enquiry-message" name="message" rows="5" placeholder="Write your comments here..." required />
              </div>

              <input type="hidden" name="_subject" value="New MediCo Enquiry"  />
              <button type="submit" className="enquiry-submit-btn">
                  {isSubmitting  ? "Submitting..."  : "Request a Callback →"}
              </button>
            </form>
          </aside>
        </div>
      )}


       {/* ====
                SUCCESS POPUP
            ==== */}

            {showSuccess && (
              <div className="success-popup-overlay">

                <div className="success-popup">

                  {/* Success Icon */}
                  <div className="success-icon">
                    ✓
                  </div>

                  {/* Title */}
                  <h3>
                    Thank You!
                  </h3>

                  {/* Message */}
                  <p>
                    Your enquiry has been submitted successfully.
                    <br />
                    Our staff will contact you soon.
                  </p>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setShowSuccess(false)}
                  >
                    OK
                  </button>

                </div>

              </div>
            )}




        <section className="rare-cases-section" id="rare-cases">
          <div className="rare-cases-container">

            {/* Section Header */}
            <div className="rare-cases-header">
              <div>
                <span className="rare-cases-label"></span>
                <h2>⭐Rare-Cases</h2>
              </div>


            </div>

            {/* Cards */}
            <div className="rare-cases-grid">

              {/* Card 1 */}
              <article className="rare-case-card">
                <div className="rare-case-image">
                  <img
                    src={mainPageImg}
                    alt="Rare Aortic Arch Replacement"
                  />
                  <span className="case-category">Cardiac Surgery</span>
                </div>

                <div className="rare-case-content">
                  <h3>
                    Rare Aortic Arch Replacement Using Frozen Elephant Trunk Technique
                  </h3>


                  <p>
                    The condition involved the aortic arch, the curved portion of the
                    main artery carrying blood from the heart to the brain, arms, and
                    lower body, an area known for its surgical complexity and high risk.
                  </p>

                  <a href="/rarecases" className="read-more">
                                      View-More <span>→</span>
                                    </a>
                </div>
              </article>

              {/* Card 2 */}
              <article className="rare-case-card">
                <div className="rare-case-image">
                  <img
                    src={mainPageImg}
                    alt="Bilateral Total Knee Replacement"
                  />
                  <span className="case-category">Orthopaedics</span>
                </div>

                <div className="rare-case-content">
                  <h3>
                    World’s 1ˢᵗ Same-Day Discharge Bilateral Total Knee Replacement
                  </h3>

                  <p>
                    At Max Multi Speciality Centre, Panchsheel Park, we successfully
                    completed the world’s first same-day discharge of both knee
                    replacement surgeries on 10th January 2026 for a 65-year-old woman
                    from Agra.
                  </p>

                  <p>
                    The trust and faith that she bestowed upon the team led by Dr Sujoy
                    Bhattacharjee, Chairman & Chief, Robotic Joints Replacement
                    Surgery, Max Healthcare, is beyond words.
                  </p>

                  <a href="/rarecases" className="read-more">
                                      View-More <span>→</span>
                                    </a>
                </div>
              </article>

              {/* Card 3 */}
              <article className="rare-case-card">
                <div className="rare-case-image">
                  <img
                    src={mainPageImg}
                    alt="Bilateral Hand Transplantation"
                  />
                  <span className="case-category">Transplant Surgery</span>
                </div>

                <div className="rare-case-content">
                  <h3>
                    Bilateral Hand Transplantation from Female Donor
                  </h3>

                  <p>
                    A highly complex bilateral hand transplantation procedure was
                    successfully performed by a specialised multidisciplinary medical
                    team, offering the patient an opportunity to regain greater
                    independence and functionality.
                  </p>

                  <p>
                    The procedure required extensive planning, advanced microsurgical
                    techniques and coordinated post-operative rehabilitation.
                  </p>

                  <a href="/rarecases" className="read-more">
                    View-More <span>→</span>
                  </a>
                </div>
              </article>

            </div>
          </div>
        </section>




{/*        */}{/* ===================================================== */}
{/*           DOWNLOAD APP */}
{/*       ===================================================== */}

{/*       <section */}
{/*         id="contact" */}
{/*         className="download-app-section" */}
{/*       > */}

{/*         <div className="download-app-content"> */}

{/*           <h2> */}
{/*             Download MediCo App */}
{/*           </h2> */}

{/*           <p className="download-description"> */}
{/*             Access video consultations with qualified doctors */}
{/*             through the MediCo app. Connect with healthcare */}
{/*             professionals online and manage your healthcare */}
{/*             from the comfort of your home. */}
{/*           </p> */}

{/*           <h4> */}
{/*             Get the link to download the app */}
{/*           </h4> */}

{/*           <div className="phone-input-wrapper"> */}

{/*             <span className="country-code"> */}
{/*               +91 */}
{/*             </span> */}

{/*             <input */}
{/*               type="tel" */}
{/*               placeholder="Enter phone number" */}
{/*               maxLength="10" */}
{/*               pattern="[0-9]{10}" */}
{/*             /> */}

{/*             <button */}
{/*               type="button" */}
{/*               className="send-sms-btn" */}
{/*               onClick={() => */}
{/*                 window.open( */}
{/*                   "https://potlatechsolutions.com/", */}
{/*                   "_blank", */}
{/*                   "noopener,noreferrer" */}
{/*                 ) */}
{/*               } */}
{/*             > */}
{/*               Send Link */}
{/*             </button> */}

{/*           </div> */}


{/*           <div className="app-store-buttons"> */}

{/*             <a */}
{/*               href="https://play.google.com/" */}
{/*               target="_blank" */}
{/*               rel="noopener noreferrer" */}
{/*               className="store-button" */}
{/*             > */}
{/*               ▶ */}

{/*               <span> */}
{/*                 <small> */}
{/*                   GET IT ON */}
{/*                 </small> */}

{/*                 <strong> */}
{/*                   Google Play */}
{/*                 </strong> */}
{/*               </span> */}

{/*             </a> */}


{/*             <a */}
{/*               href="https://www.apple.com/app-store/" */}
{/*               target="_blank" */}
{/*               rel="noopener noreferrer" */}
{/*               className="store-button" */}
{/*             > */}
{/*               ● */}

{/*               <span> */}
{/*                 <small> */}
{/*                   Download on the */}
{/*                 </small> */}

{/*                 <strong> */}
{/*                   App Store */}
{/*                 </strong> */}
{/*               </span> */}

{/*             </a> */}

{/*           </div> */}

{/*         </div> */}


{/*         <div className="download-app-image"> */}

{/*           <div className="phone-mockup"> */}

{/*             <div className="phone-screen"> */}

{/*               <div className="phone-logo"> */}
{/*                 + */}
{/*               </div> */}

{/*               <h3> */}
{/*                 MediCo */}
{/*               </h3> */}

{/*               <p> */}
{/*                 Your Healthcare Companion */}
{/*               </p> */}

{/*               <div className="app-card"> */}

{/*                 <strong> */}
{/*                   Find Doctors */}
{/*                 </strong> */}

{/*                 <span> */}
{/*                   Book appointments easily */}
{/*                 </span> */}

{/*               </div> */}

{/*               <div className="app-card"> */}

{/*                 <strong> */}
{/*                   Video Consultation */}
{/*                 </strong> */}

{/*                 <span> */}
{/*                   Talk to doctors online */}
{/*                 </span> */}

{/*               </div> */}

{/*             </div> */}

{/*           </div> */}

{/*         </div> */}

{/*       </section> */}






       {/* About Hospital */}
            <section className="section" id="aboutus">
              <div className="section-heading">
                <span><h1>ABOUT-US</h1></span>
                <h2>About MediCo Hospital</h2>
              </div>

              <div className="about-grid">
                <div className="about-text">
                  <p>
                    📌MediCo Hospital is a comprehensive multi-specialty hospital
                    designed to provide medical services under one roof. We focus
                    on delivering safe, ethical, and evidence-based healthcare
                    while ensuring comfort and dignity for every patient.
                  </p>

                  <p>
                    📌Our hospital provides preventive, diagnostic, emergency,
                    surgical, and rehabilitative healthcare services. Our team
                    includes experienced doctors, nurses, technicians,
                    pharmacists, therapists, and other healthcare professionals.
                  </p>

                  <p>
                    📌At MediCo, we believe that healthcare is not only about
                    treating diseases but also about understanding patients,
                    supporting families, and promoting a healthier community.
                  </p>
                </div>

                <div className="about-stats">
                  <div className="stat-card">
                    <h3>15+</h3>
                    <p>Years of Service</p>
                  </div>

                  <div className="stat-card">
                    <h3>50+</h3>
                    <p>Specialist Doctors</p>
                  </div>

                  <div className="stat-card">
                    <h3>250+</h3>
                    <p>Hospital Beds</p>
                  </div>

                  <div className="stat-card">
                    <h3>24/7</h3>
                    <p>Emergency Care</p>
                  </div>
                </div>
              </div>
            </section>


    </div>
  );
}

export default HospitalHome;
