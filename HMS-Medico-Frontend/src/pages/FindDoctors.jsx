import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApprovedDoctors } from "../services/publicDoctorService";
import api from "../services/axiosConfig";
import "./FindDoctors.css";

export default function FindDoctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const patientToken = sessionStorage.getItem("patientToken");

  //To view doctor profile
  const[selectedDoctor,setSelectedDoctor]=useState(null);
  const handleViewProfile=(doctor) =>   {setSelectedDoctor(doctor)};
  const closeDoctorProfile=() => {setSelectedDoctor(null)};


  // LOAD DOCTORS
  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getApprovedDoctors();
      const doctorList = Array.isArray(data) ? data : [];
      setDoctors(doctorList);
      setFilteredDoctors(doctorList);

    } catch (err) {
      console.error("Unable to load doctors:", err);
      setError( err?.response?.data?.message ||  " Please try again after some time or Contact Healthcare......");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      setFilteredDoctors(doctors);
      return;
    }

    const results = doctors.filter((doctor) => {
      const searchableText = `
        ${doctor.fullName || ""}
        ${doctor.specialization || ""}
        ${doctor.qualification || ""}
        ${doctor.hospitalName || ""}
        ${doctor.clinicName || ""}
        ${doctor.city || ""}
      `.toLowerCase();

      return searchableText.includes(search);
    });

    setFilteredDoctors(results);
  }, [searchTerm, doctors]);


  // BOOK APPOINTMENT
  const handleBookAppointment = (doctorId) => {
    if (!patientToken) {
      navigate(`/patient/login?redirect=/patient/book-appointment/${doctorId}`);
      return;
    }
    navigate(`/patient/book-appointment/${doctorId}`);
  };


  // HOME
   const goHome = () => {
    navigate("/");
  };

  // DOCTOR LOGIN
  const goDoctorLogin = () => {
    navigate("/doctor/login");
  };

  // PATIENT LOGIN
  const goPatientLogin = () => {
    navigate("/patient/login");
  };


  // RENDER
  return (
    <div className="find-doctors-page">

      <section id="doctor-list" className="fd-doctors-section" >
        <div className="fd-container">

          {/* HEADER */}
          <div className="fd-section-header">
            <div>
              <span className="fd-small-title"></span>
              <h2>Find the Right Doctor for You</h2>
              <p>Choose our healthcare professionals and book your appointment easily...</p>
            </div>

          </div>
          {/* SEARCH */}
          <div className="fd-search-box">
            <span className="fd-search-icon">🔍</span>
            <input type="text" value={searchTerm} placeholder="Search doctors by specializations........" onChange={(event) =>setSearchTerm(event.target.value)}/>

            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")} >
                ✕
              </button>
            )}
          </div>

          {/* FILTER INFORMATION */}
          <div className="fd-search-info">
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")} >
                Clear Search
              </button>
            )}
          </div>

          {/* ==== LOADING === */}

          {loading && (
            <div className="fd-loading">
              <div className="fd-spinner"></div>
              <h3>Loading Doctors...  </h3>
              <p>Please wait while loading available doctors. </p>
            </div>
          )}

          {/* ==== ERROR === */}

          {!loading && error && (
            <div className="fd-error">
              <div>
                <strong>Unable to Load Doctors  </strong>
                <p>{error}</p>
              </div>
              <button type="button" onClick={loadDoctors}>
                Retry
              </button>
            </div>
          )}

          {/* === NO DOCTORS === */}

          {!loading &&
            !error &&
            doctors.length === 0 && (
              <div className="fd-empty">
                <div className="fd-empty-icon">
                  👨‍⚕️
                </div>

                <h3>No Doctors Available</h3>
                <p>There are currently no doctors.</p>
                <button type="button" onClick={loadDoctors}>
                  Refresh
                </button>
              </div>
            )}

          {/* === NO SEARCH RESULT === */}
          {!loading &&
            !error &&
            doctors.length > 0 &&
            filteredDoctors.length === 0 && (
              <div className="fd-empty">
                <div className="fd-empty-icon">
                  🔍
                </div>

                <h3>No Doctors Found</h3>
                <p>Try searching with another name,specialization, hospital or city.</p>
                <button type="button" onClick={() => setSearchTerm("")}>
                  Clear Search
                </button>
              </div>
            )}


              {/* === VIEW PROFILE === */}
            {selectedDoctor && (
              <div className="fd-modal-overlay" onClick={closeDoctorProfile} >
                <div
                  className="fd-profile-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="fd-profile-title"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="fd-modal-header">
                    <div>
                      <h2 id="fd-profile-title">Doctor Profile</h2>
                      <p>Doctor information and consultation details</p>
                    </div>

                    <button
                      type="button"
                      className="fd-modal-close"
                      onClick={closeDoctorProfile}
                      aria-label="Close doctor profile"
                    >
                      ×
                    </button>
                  </div>

                  <div className="fd-modal-doctor-heading">
                    {selectedDoctor.profilePhoto ? (
                      <img
                        className="fd-modal-photo"
                        src={`${api.defaults.baseURL}/doctors/${selectedDoctor.id || selectedDoctor.doctorId}/profile-photo`}
                        alt={selectedDoctor.fullName || "Doctor"}
                        onError={(event) => { event.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <div className="fd-modal-photo fd-modal-photo-placeholder">
                        {selectedDoctor.fullName?.charAt(0) || "D"}
                      </div>
                    )}

                    <div>
                      <h3>{selectedDoctor.fullName || "Doctor"}</h3>
                      <p>{selectedDoctor.specialization || "Specialization not provided"}</p>

                    </div>
                  </div>

                  <div className="fd-profile-form">
                    <h3>Personal Information</h3>

                    <div className="fd-profile-grid">
                      <div className="fd-profile-field">
                        <label>Full Name</label>
                        <input value={selectedDoctor.fullName || "Not provided"} readOnly />
                      </div>



                      <div className="fd-profile-field">
                        <label>City</label>
                        <input value={selectedDoctor.city || "Not provided"} readOnly />
                      </div>
                    </div>

                    <h3>Professional Information</h3>

                    <div className="fd-profile-grid">
                      <div className="fd-profile-field">
                        <label>Qualification</label>
                        <input
                          value={selectedDoctor.qualification || "Not provided"}
                          readOnly
                        />
                      </div>

                      <div className="fd-profile-field">
                        <label>Specialization</label>
                        <input
                          value={selectedDoctor.specialization || "Not provided"}
                          readOnly
                        />
                      </div>

                      <div className="fd-profile-field">
                        <label>Experience</label>
                        <input
                          value={
                            selectedDoctor.experienceYears != null
                              ? `${selectedDoctor.experienceYears} years`
                              : "Not provided"
                          }
                          readOnly
                        />
                      </div>

                      <div className="fd-profile-field">
                        <label>Languages Known</label>
                        <input
                          value={selectedDoctor.languagesKnown || "Not provided"}
                          readOnly
                        />
                      </div>
                    </div>

                    <h3>Hospital & Consultation Details</h3>

                    <div className="fd-profile-grid">


                      <div className="fd-profile-field">
                        <label>Consultation Fee</label>
                        <input
                          value={
                            selectedDoctor.consultationFee != null
                              ? `₹${selectedDoctor.consultationFee}`
                              : "Not provided"
                          }
                          readOnly
                        />
                      </div>

                      <div className="fd-profile-field fd-profile-field-full">
                        <label>Available Timings</label>
                        <textarea
                          value={selectedDoctor.availableTimings || "Not provided"}
                          readOnly
                          rows={2}
                        />
                      </div>

                      <div className="fd-profile-field fd-profile-field-full">
                        <label>About the Doctor</label>
                        <textarea
                          value={selectedDoctor.about || "No description available"}
                          readOnly
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fd-modal-footer">
                    <button
                      type="button"
                      className="fd-modal-cancel"
                      onClick={closeDoctorProfile}
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      className="fd-modal-book"
                      onClick={() => {
                        const doctorId = selectedDoctor.id;
                        closeDoctorProfile();
                        handleBookAppointment(doctorId);
                      }}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            )}

          {/* === DOCTOR CARDS === */}
          {!loading &&
            !error &&
            filteredDoctors.length > 0 && (
              <div className="fd-doctor-grid">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBook={handleBookAppointment}
                    onViewProfile={handleViewProfile}

                  />
                ))}
              </div>
            )}
        </div>
      </section>

      {/* === WHY MEDICO === */}

      <section className="fd-why-section">
        <div className="fd-container">

          <div className="fd-why-header">
            <span className="fd-small-title">
              <h1>MEDICO HEALTHCARE</h1>
            </span>

            <h2>Healthcare Made Simple</h2>
            <p>Connect with healthcare professionals and manage your healthcare journey conveniently.</p>
          </div>
          <div className="fd-why-grid">
            <div className="fd-why-card">
              <div>✓</div>
              <h3>Approved Doctors</h3>
              <p>Browse doctors and made available through the MediCo platform.</p>
            </div>

            <div className="fd-why-card">
              <div>🔍</div>
              <h3>Easy Search</h3>
              <p>Search doctors by name, specialization,hospital, clinic or city.</p>
            </div>
            <div className="fd-why-card">
              <div>📅</div>
              <h3>Easy Appointment</h3>
              <p>Select your preferred doctor and continue to the appointment booking process.</p>
            </div>

            <div className="fd-why-card">
              <div>🔒</div>
              <h3>Patient Access</h3>
              <p> Patients can log in and manage their healthcare appointments.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



// DOCTOR CARD
function DoctorCard({ doctor, onBook ,onViewProfile}) {
  const [imageError, setImageError] = useState(false);

  const doctorId = doctor?.id || doctor?.doctorId;
  const profilePhotoUrl = doctorId
    ? `${api.defaults.baseURL}/doctors/${doctorId}/profile-photo`
    : "";

  return (
    <article className="fd-doctor-card">

      {/* IMAGE */}
      <div className="fd-image-container">
        {doctor.profilePhoto && !imageError ? (
          <img
            src={profilePhotoUrl}
            alt={doctor.fullName || "Doctor"}
            className="fd-doctor-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="fd-default-image">
            👨‍⚕️
          </div>
        )}

      </div>

      {/* INFORMATION */}

      <div className="fd-doctor-info">

        <div className="fd-name-row">
          <div>
            <h3>Dr. {doctor.fullName || "Doctor"}</h3>
            <p className="fd-specialization"> {doctor.specialization || "General Physician"}            </p>
          </div>

        </div>

        <div className="fd-line"></div>
        <div className="fd-details">

          {doctor.qualification && (
            <DoctorDetail
              icon="🎓"
              label="Qualification"
              value={doctor.qualification}
            />
          )}

          <DoctorDetail
            icon="💼"
            label="Experience"
            value={`${doctor.experienceYears ?? 0} years`}
          />

          {doctor.clinicName && (
            <DoctorDetail
              icon="🏨"
              label="Clinic"
              value={doctor.clinicName}
            />
          )}

          {doctor.city && (
            <DoctorDetail
              icon="📍"
              label="Location"
              value={doctor.city}
            />
          )}

          <DoctorDetail
            icon="💰"
            label="Consultation Fee"
            value={`₹${doctor.consultationFee ?? 0}`} fee
          />

        </div>


        <button type="button" className="fd-book-button" onClick={() => onViewProfile(doctor)}>
            View Profile
        </button>
      </div>
    </article>


  );
}


// DOCTOR DETAIL
function DoctorDetail({icon,label,value,fee = false,}) {
  return (
    <div className="fd-detail">

      <span className="fd-detail-icon">{icon}</span>
      <div>
        <span className="fd-detail-label">{label}</span>
        <strong
          className={
            fee
              ? "fd-detail-fee"
              : "fd-detail-value"
          }
        >
          {value}
        </strong>
      </div>

    </div>
  );
}
