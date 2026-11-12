import React, { useState } from "react";
import "./HospitalInformationBio.css";

const HospitalInformationBio = () => {
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const additionalDepartments = [
    { icon: "🩺", name: "Dermatology", description: "Assessment and care for skin, hair, and nail conditions." },
    { icon: "👁️", name: "Ophthalmology", description: "Medical and surgical care for eye health and vision." },
    { icon: "👂", name: "ENT (Otolaryngology)", description: "Care for ear, nose, throat, and related head and neck conditions." },
    { icon: "🩻", name: "Gastroenterology", description: "Diagnosis and treatment of digestive system and liver conditions." },
    { icon: "🧪", name: "Nephrology", description: "Specialist care for kidney conditions and related health needs." },
    { icon: "🩺", name: "Urology", description: "Care for urinary tract and male reproductive health conditions." },
    { icon: "🧬", name: "Endocrinology", description: "Treatment of hormone-related conditions, including diabetes and thyroid disorders." },
    { icon: "🧠", name: "Psychiatry", description: "Assessment and treatment for mental and emotional health conditions." },
    { icon: "🦷", name: "Dental Care", description: "Preventive and restorative care for teeth, gums, and oral health." },
    { icon: "🏃", name: "Physiotherapy & Rehabilitation", description: "Support to improve movement, strength, and recovery after illness or injury." },
    { icon: "🩸", name: "Hematology", description: "Diagnosis and care for blood disorders and related conditions." },
    { icon: "🛡️", name: "Rheumatology", description: "Care for arthritis, autoimmune, and inflammatory conditions." },
  ];
  return (
    <div className="hospital-page">
      {/* Header */}


      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">🏥 Trusted Healthcare Partner</span>

          <h2>
            Welcome !! <br/> <span>MediCo Hospital</span>
          </h2>

          <p>
            MediCo Hospital is a modern multi-specialty healthcare
            institution dedicated to providing high-quality, affordable,
            and patient-centered medical care. Our hospital combines
            advanced medical technology with experienced healthcare
            professionals to deliver comprehensive treatment and better
            health outcomes.
          </p>


        </div>

        <div className="hero-card">
          <div className="hospital-symbol">🏥</div>
          <h3>MediCo Hospital</h3>
          <p>Multi-Specialty Healthcare Center</p>

          <div className="rating">
            ⭐⭐⭐⭐ <span>4.0/5</span>
          </div>
        </div>
      </section>

      {/* About Hospital */}
      <section className="section">
        <div className="section-heading">
          <span><h1>ABOUT US</h1></span>
          <h2>About MediCo Hospital</h2>
        </div>

        <div className="about-grid">
          <div className="about-text">
            <p>
              MediCo Hospital is a comprehensive multi-specialty hospital
              designed to provide medical services under one roof. We focus
              on delivering safe, ethical, and evidence-based healthcare
              while ensuring comfort and dignity for every patient.
            </p>

            <p>
              Our hospital provides preventive, diagnostic, emergency,
              surgical, and rehabilitative healthcare services. Our team
              includes experienced doctors, nurses, technicians,
              pharmacists, therapists, and other healthcare professionals.
            </p>

            <p>
              At MediCo, we believe that healthcare is not only about
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

      {/* Mission Vision Values */}
      <section className="section light-section">
        <div className="section-heading">
          <span><h1>OUR FOUNDATION</h1></span>
          <h2>Mission, Vision & Values</h2>
        </div>

        <div className="three-column">
          <div className="info-card">
            <div className="card-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To provide accessible, safe, compassionate, and high-quality
              healthcare services using modern medical practices and
              advanced technology.
            </p>
          </div>

          <div className="info-card">
            <div className="card-icon">👁️</div>
            <h3>Our Vision</h3>
            <p>
              To become a trusted healthcare institution known for clinical
              excellence, innovation, patient safety, and compassionate
              service.
            </p>
          </div>

          <div className="info-card">
            <div className="card-icon">❤️</div>
            <h3>Our Values</h3>
            <p>
              Compassion, integrity, respect, teamwork, patient safety,
              accountability, innovation, and excellence guide everything
              we do.
            </p>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section">
        <div className="section-heading">
          <span><h1>MEDICAL DEPARTMENTS</h1></span>
          <h2>Our Departments</h2>
        </div>

        <div className="department-grid" id="additional-medical-departments">
          <div className="department-card">
            <div>❤️</div>
            <h3>Cardiology</h3>
            <p>
              Diagnosis and treatment of heart-related diseases and
              cardiovascular conditions.
            </p>
          </div>

          <div className="department-card">
            <div>🧠</div>
            <h3>Neurology</h3>
            <p>
              Specialized care for disorders affecting the brain, spinal
              cord, nerves, and nervous system.
            </p>
          </div>

          <div className="department-card">
            <div>🦴</div>
            <h3>Orthopedics</h3>
            <p>
              Comprehensive treatment for bones, joints, muscles, and
              orthopedic injuries.
            </p>
          </div>

          <div className="department-card">
            <div>🫁</div>
            <h3>Pulmonology</h3>
            <p>
              Diagnosis and management of respiratory and lung-related
              conditions.
            </p>
          </div>

          <div className="department-card">
            <div>👶</div>
            <h3>Pediatrics</h3>
            <p>
              Specialized healthcare services for infants, children, and
              adolescents.
            </p>
          </div>

          <div className="department-card">
            <div>🤰</div>
            <h3>Obstetrics & Gynecology</h3>
            <p>
              Complete women's healthcare including pregnancy, maternity,
              and gynecological services.
            </p>
          </div>

          <div className="department-card">
            <div>🩺</div>
            <h3>General Medicine</h3>
            <p>
              Diagnosis, prevention, and treatment of common and complex
              adult medical conditions.
            </p>
          </div>

          <div className="department-card">
            <div>🔬</div>
            <h3>Oncology</h3>
            <p>
              Comprehensive cancer diagnosis, treatment, and supportive
              care services.
            </p>
          </div>

          {showAllDepartments && additionalDepartments.map((department) => (
            <div className="department-card" key={department.name}>
              <div aria-hidden="true">{department.icon}</div>
              <h3>{department.name}</h3>
              <p>{department.description}</p>
            </div>
          ))}
        </div>
        <div className="department-toggle-wrap">
          <button
            type="button"
            className="department-toggle"
            aria-expanded={showAllDepartments}
            aria-controls="additional-medical-departments"
            onClick={() => setShowAllDepartments((current) => !current)}
          >
            {showAllDepartments ? "Show fewer departments" : "Show more departments"}
          </button>
        </div>
      </section>

      {/* Services */}
      <section className="section light-section">
        <div className="section-heading">
          <span><h1>HEALTHCARE SERVICES</h1></span>
          <h2>Services We Provide</h2>
        </div>

        <div className="services-list">
          <div className="service-item">
            <span>✓</span>
            <div>
              <h3>24/7 Emergency Services</h3>
              <p>
                Round-the-clock emergency medical services for urgent
                and critical situations.
              </p>
            </div>
          </div>

          <div className="service-item">
            <span>✓</span>
            <div>
              <h3>Outpatient Department</h3>
              <p>
                Consultation and treatment services without requiring
                hospital admission.
              </p>
            </div>
          </div>

          <div className="service-item">
            <span>✓</span>
            <div>
              <h3>Inpatient Care</h3>
              <p>
                Comfortable rooms and professional nursing care for
                admitted patients.
              </p>
            </div>
          </div>

          <div className="service-item">
            <span>✓</span>
            <div>
              <h3>Diagnostic Services</h3>
              <p>
                Laboratory testing, imaging, scans, and other diagnostic
                investigations.
              </p>
            </div>
          </div>

          <div className="service-item">
            <span>✓</span>
            <div>
              <h3>Surgical Services</h3>
              <p>
                Advanced surgical procedures supported by experienced
                surgical and anesthesia teams.
              </p>
            </div>
          </div>

          <div className="service-item">
            <span>✓</span>
            <div>
              <h3>Pharmacy</h3>
              <p>
                Hospital pharmacy services providing prescribed medicines
                and pharmaceutical support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section">
        <div className="section-heading">
          <span><h1>HOSPITAL FACILITIES</h1></span>
          <h2>Modern Facilities</h2>
        </div>

        <div className="facility-grid">
          <div className="facility-card">
            <div className="facility-icon">🚑</div>
            <h3>Ambulance Services</h3>
            <p>
              Emergency ambulance support for patient transportation.
            </p>
          </div>

          <div className="facility-card">
            <div className="facility-icon">🧪</div>
            <h3>Advanced Laboratory</h3>
            <p>
              Modern laboratory facilities for accurate diagnostic testing.
            </p>
          </div>

          <div className="facility-card">
            <div className="facility-icon">🩻</div>
            <h3>Imaging Center</h3>
            <p>
              Diagnostic imaging services including X-ray, ultrasound,
              CT, and MRI facilities.
            </p>
          </div>

          <div className="facility-card">
            <div className="facility-icon">🛏️</div>
            <h3>Patient Rooms</h3>
            <p>
              Clean and comfortable rooms designed for patient recovery.
            </p>
          </div>

          <div className="facility-card">
            <div className="facility-icon">🚨</div>
            <h3>ICU & Critical Care</h3>
            <p>
              Specialized intensive care facilities for critically ill
              patients.
            </p>
          </div>

          <div className="facility-card">
            <div className="facility-icon">🍽️</div>
            <h3>Patient Nutrition</h3>
            <p>
              Nutritious meals planned according to patients' medical
              requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="section light-section">
        <div className="section-heading">
          <span><h1>OUR MEDICAL TEAM</h1></span>
          <h2>Senior Specialist Doctors</h2>
        </div>

        <div className="doctor-grid">
          <div className="doctor-card">
            <div className="doctor-avatar">👨‍⚕️</div>
            <h3>Dr. Rajesh Kumar</h3>
            <p className="doctor-speciality">Senior Cardiologist</p>
            <p>18+ years of clinical experience</p>
          </div>

          <div className="doctor-card">
            <div className="doctor-avatar">👩‍⚕️</div>
            <h3>Dr. Priya Sharma</h3>
            <p className="doctor-speciality">Senior Neurologist</p>
            <p>15+ years of clinical experience</p>
          </div>

          <div className="doctor-card">
            <div className="doctor-avatar">👨‍⚕️</div>
            <h3>Dr. Arjun Reddy</h3>
            <p className="doctor-speciality">Orthopedic Specialist</p>
            <p>14+ years of clinical experience</p>
          </div>

          <div className="doctor-card">
            <div className="doctor-avatar">👩‍⚕️</div>
            <h3>Dr. Ananya Rao</h3>
            <p className="doctor-speciality">Pediatrician</p>
            <p>12+ years of clinical experience</p>
          </div>
        </div>
      </section>

      {/* Patient Care */}
      <section className="section">
        <div className="section-heading">
          <span><h1>PATIENT CARE</h1></span>
          <h2>Why Choose MediCo Hospital?</h2>
        </div>

        <div className="why-grid">
          <div className="why-item">
            <span>01</span>
            <div>
              <h3>Experienced Medical Team</h3>
              <p>
                Our healthcare professionals bring extensive clinical
                experience and specialized knowledge.
              </p>
            </div>
          </div>

          <div className="why-item">
            <span>02</span>
            <div>
              <h3>Advanced Technology</h3>
              <p>
                We use modern medical equipment to support accurate
                diagnosis and effective treatment.
              </p>
            </div>
          </div>

          <div className="why-item">
            <span>03</span>
            <div>
              <h3>Patient-Centered Care</h3>
              <p>
                We focus on understanding patient needs and providing
                respectful and compassionate care.
              </p>
            </div>
          </div>

          <div className="why-item">
            <span>04</span>
            <div>
              <h3>24/7 Emergency Support</h3>
              <p>
                Our emergency department is available around the clock
                for urgent medical situations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timings */}
      <section className="timing-section">
        <div className="timing-container">
          <div>
            <span className="small-title"><h1>HOSPITAL TIMINGS</h1></span>
            <h2>We're Here When You Need Us</h2>
            <p>
              MediCo Hospital provides emergency medical services
              throughout the day and night.
            </p>
          </div>

          <div className="timing-card">
            <div className="timing-row">
              <span>Emergency Department</span>
              <strong>24 × 7</strong>
            </div>

            <div className="timing-row">
              <span>Outpatient Department</span>
              <strong>8:00 AM – 8:00 PM</strong>
            </div>

            <div className="timing-row">
              <span>Laboratory</span>
              <strong>7:00 AM – 9:00 PM</strong>
            </div>

            <div className="timing-row">
              <span>Pharmacy</span>
              <strong>24 × 7</strong>
            </div>
          </div>
        </div>
      </section>


      {/* Emergency Banner */}
      <section className="emergency-banner">
        <div>
          <span>🚨 MEDICAL EMERGENCY?</span>
          <h2>Get Immediate Medical Assistance</h2>
          <p>
            For serious or life-threatening emergencies, contact emergency
            services or visit the nearest emergency department immediately.
          </p>
        </div>

        <button className="emergency-btn">📞 Call Emergency – xxxxxxxxxx</button>
      </section>


    </div>
  );
};

export default HospitalInformationBio;
