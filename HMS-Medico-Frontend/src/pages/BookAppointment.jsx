import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";
import { getAvailableAppointmentSlots } from "../utils/appointmentSlots";

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingPatient, setCheckingPatient] = useState(true);

  const [patient, setPatient] = useState({
    patientName: "",
    patientGender: "",
    patientAge: "",
  });

  const [registerData, setRegisterData] = useState({
    patientName: "",
    patientEmail: "",
    password: "",
    patientGender: "",
    patientAge: "",
    phone: "",
  });

  const [appointmentData, setAppointmentData] = useState({
    problem: "",
    date: "",
    time: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [doctorAvailable, setDoctorAvailable] = useState(null);
  const [doctorAvailability, setDoctorAvailability] = useState(null);

  const [registerLoading, setRegisterLoading] = useState(false);
  const [appointmentLoading, setAppointmentLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const maxBookingDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  useEffect(() => {
    if (!appointmentData.date || !doctorId) { setBookedSlots([]); setDoctorAvailable(null); setDoctorAvailability(null); return; }
    let active = true;
    setDoctorAvailable(null);
    setDoctorAvailability(null);
    Promise.all([
      axiosInstance.get(`/appointments/patient/doctor/${doctorId}/booked-slots`, { params: { date: appointmentData.date } }),
      axiosInstance.get(`/appointments/patient/doctor/${doctorId}/availability`, { params: { date: appointmentData.date } }),
    ])
      .then(([slots, availability]) => {
        if (!active) return;
        setBookedSlots(Array.isArray(slots.data) ? slots.data : []);
        setDoctorAvailable(availability.data?.active !== false);
        setDoctorAvailability(availability.data || { active: true });
      })
      .catch(() => { if (active) { setBookedSlots([]); setDoctorAvailable(true); setDoctorAvailability({ active: true }); } });
    return () => { active = false; };
  }, [appointmentData.date, doctorId]);

  const availableAppointmentSlots = getAvailableAppointmentSlots(
    doctorAvailability,
    undefined,
    bookedSlots,
  );



  const getPatientGender = (patientData) => {
    return (
      patientData?.patientGender ||
      patientData?.gender ||
      patientData?.sex ||
      ""
    );
  };

  const getPatientName = (patientData) => {
    return (
      patientData?.patientName ||
      patientData?.name ||
      ""
    );
  };

  const getPatientAge = (patientData) => {
    const age =
      patientData?.patientAge ??
      patientData?.age ??
      "";

    return age !== "" &&
      age !== null &&
      age !== undefined
      ? String(age)
      : "";
  };


  useEffect(() => {
    let isMounted = true;

    const checkPatientSession = async () => {
      try {
        setCheckingPatient(true);
        setError("");

        const response = await axiosInstance.get("/patients/me");
        console.log("Patient /me response:",response.data);

        const patientData = response.data || {};

        const patientName =
          getPatientName(patientData);

        const patientGender =
          getPatientGender(patientData);

        const patientAge =
          getPatientAge(patientData);

        console.log("Patient name:", patientName);
        console.log("Patient gender:", patientGender);
        console.log("Patient age:", patientAge);

        if (!isMounted) {
          return;
        }

        setPatient({
          patientName,
          patientGender,
          patientAge,
        });

        setRegisterData((previous) => ({
          ...previous,
          patientName,
          patientGender,
          patientAge,
        }));

        setIsRegistered(true);

        if (!patientGender) {
          setError(
            "Patient gender is missing from your account. Please update your patient profile."
          );
        } else {
          setError("");
        }
      } catch (err) {
        console.error(
          "Patient session check failed:",
          err
        );

        console.error(
          "Patient /me error response:",
          err.response?.data
        );

        if (!isMounted) {
          return;
        }

        setPatient({
          patientName: "",
          patientGender: "",
          patientAge: "",
        });

        setIsRegistered(false);



        const status =
          err.response?.status;

        if (status === 401 || status === 403) {
          setError(
            "Your patient login session has expired. Please login again."
          );
        } else {
          setError(
            "Unable to verify your patient account. Please login again."
          );
        }
      } finally {
        if (isMounted) {
          setCheckingPatient(false);
        }
      }
    };

    checkPatientSession();

    return () => {
      isMounted = false;
    };
  }, []);



  const handleRegisterChange = (event) => {
    const { name, value } = event.target;

    setRegisterData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };


  const handleAppointmentChange = (event) => {
    const { name, value } = event.target;

    setAppointmentData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "date" ? { time: "" } : {}),
    }));

    setError("");
    setMessage("");
  };


  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const name =
      registerData.patientName.trim();

    const email =
      registerData.patientEmail.trim();

    const password =
      registerData.password;

    const gender =
      registerData.patientGender.trim();

    const age =
      Number(registerData.patientAge);

    const phone =
      registerData.phone.trim();



    if (!name) {
      setError(
        "Please enter the patient's name."
      );
      return;
    }

    if (!email) {
      setError(
        "Please enter the patient's email."
      );
      return;
    }

    if (!password || password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (!gender) {
      setError(
        "Please select the patient's gender."
      );
      return;
    }

    if (
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120
    ) {
      setError(
        "Patient age must be between 1 and 120."
      );
      return;
    }

    if (!phone) {
      setError(
        "Please enter the patient's phone number."
      );
      return;
    }

    try {
      setRegisterLoading(true);

      const response =
        await axiosInstance.post(
          "/patients/register",
          {
            patientName: name,
            patientEmail: email,
            password,
            patientGender: gender,
            patientAge: age,
            phone,
          }
        );

      console.log(
        "Patient registration response:",
        response.data
      );

      const data =
        response.data || {};

      const token =
        data?.token ||
        data?.patientToken ||
        data?.accessToken;

      const registeredPatient =
        data?.patient ||
        data?.data ||
        data;

      console.log(
        "Registered patient:",
        registeredPatient
      );

      const registeredName =
        registeredPatient?.patientName ||
        registeredPatient?.name ||
        name;

      const registeredGender =
        registeredPatient?.patientGender ||
        registeredPatient?.gender ||
        registeredPatient?.sex ||
        gender;

      const registeredAge =
        registeredPatient?.patientAge ??
        registeredPatient?.age ??
        age;

      setPatient({
        patientName: registeredName,
        patientGender: registeredGender,
        patientAge: String(
          registeredAge
        ),
      });

      setRegisterData((previous) => ({
        ...previous,
        patientName: registeredName,
        patientGender: registeredGender,
        patientAge: String(
          registeredAge
        ),
        password: "",
      }));

      setIsRegistered(true);

      setMessage(
        "Registration successful. You can now confirm your appointment."
      );



      if (!token) {
        console.log(
          "Registration did not return a token. Authentication should be handled by the backend session/cookie."
        );
      }
    } catch (err) {
      console.error(
        "Patient registration error:",
        err
      );

      console.error(
        "Registration backend response:",
        err.response?.data
      );

      const backendMessage =
        err.response?.data;

      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : backendMessage?.message ||
              backendMessage?.error ||
              "Unable to register patient. Please try again."
      );
    } finally {
      setRegisterLoading(false);
    }
  };


  const handleSubmitAppointment = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!isRegistered) {
      setError(
        "Please register and login as a patient before confirming the appointment."
      );

      return;
    }



    const patientName =
      patient.patientName.trim();

    const patientGender =
      patient.patientGender.trim();

    const patientAge =
      patient.patientAge;

    console.log(
      "================================="
    );

    console.log(
      "APPOINTMENT PATIENT DATA"
    );

    console.log(
      "Name:",
      patientName
    );

    console.log(
      "Gender:",
      patientGender
    );

    console.log(
      "Age:",
      patientAge
    );

    console.log(
      "================================="
    );



    if (!patientGender) {
      setError(
        "Patient gender is missing. Please update your patient profile or login again."
      );

      return;
    }


    if (!patientName) {
      setError(
        "Patient name is missing. Please login again."
      );

      return;
    }



    const numericAge =
      Number(patientAge);

    if (
      !Number.isInteger(numericAge) ||
      numericAge < 1 ||
      numericAge > 120
    ) {
      setError(
        "Patient age is missing or invalid. Please update your patient profile."
      );

      return;
    }



    const problem =
      appointmentData.problem.trim();

    if (!problem) {
      setError(
        "Please enter the patient's problem or reason for the appointment."
      );

      return;
    }


    if (!appointmentData.date) {
      setError(
        "Please select the appointment date."
      );

      return;
    }



    if (!appointmentData.time) {
      setError(
        "Please select the appointment time."
      );

      return;
    }


    const numericDoctorId =
      Number(doctorId);

    if (
      !Number.isInteger(numericDoctorId) ||
      numericDoctorId <= 0
    ) {
      setError(
        "Invalid doctor ID."
      );

      return;
    }



    const appointmentPayload = {
      doctorId: numericDoctorId,

      patientName,

      patientGender,

      patientAge: numericAge,

      problem,

      appointmentDate:
        appointmentData.date,

      appointmentTime:
        appointmentData.time,
    };

    console.log(
      "Appointment request payload:",
      appointmentPayload
    );



    try {
      setAppointmentLoading(true);

      const response =
        await axiosInstance.post(
          "/appointments",
          appointmentPayload
        );

      console.log(
        "Appointment created:",
        response.data
      );

      setMessage(
        "Appointment request booked successfully. It is now waiting for doctor confirmation."
      );

      setAppointmentData({
        problem: "",
        date: "",
        time: "",
      });
    } catch (err) {
      console.error(
        "Appointment booking error:",
        err
      );

      console.error(
        "Appointment backend response:",
        err.response?.data
      );

      const backendMessage =
        err.response?.data;

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setIsRegistered(false);

        setError(
          "Your patient login session has expired. Please login again."
        );

        return;
      }

      setError(
        typeof backendMessage === "string"
          ? backendMessage
          : backendMessage?.message ||
              backendMessage?.error ||
              "Unable to book appointment. Please try again."
      );
    } finally {
      setAppointmentLoading(false);
    }
  };



  if (checkingPatient) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          <h2 style={styles.loadingTitle}>
            Checking patient account...
          </h2>

          <p style={styles.loadingText}>
            Please wait.
          </p>
        </div>
      </div>
    );
  }



  return (
    <div style={styles.page}>


      <aside style={styles.sidePanel}>
        <div style={styles.sideContent}>

          <div style={styles.sideMain}>

            <div>
              <h1 style={styles.logoTitle}>
                 MediCo
              </h1>

              <p style={styles.logoSubtitle}>
                Healthcare Management System
              </p>
            </div>

            <p style={styles.sideDescription}>
              Book appointments with approved
              doctors and get professional
              healthcare whenever you need it.
            </p>

            <div style={styles.sideFeatures}>

              <div style={styles.feature}>
                <span style={styles.featureIcon}>
                  ✓
                </span>

                <span>
                  Verified Doctors
                </span>
              </div>

              <div style={styles.feature}>
                <span style={styles.featureIcon}>
                  ✓
                </span>

                <span>
                  Easy Appointment Booking
                </span>
              </div>

              <div style={styles.feature}>
                <span style={styles.featureIcon}>
                  ✓
                </span>

                <span>
                  Secure Patient Records
                </span>
              </div>

              <div style={styles.feature}>
                <span style={styles.featureIcon}>
                  ✓
                </span>

                <span>
                  Quality Healthcare
                </span>
              </div>

            </div>
          </div>

          <div style={styles.sideFooter}>
            © {new Date().getFullYear()} Potla MediCore
          </div>

        </div>
      </aside>

      {/* ======================================================
          RIGHT SIDE
      ====================================================== */}

      <main style={styles.contentArea}>

        <div style={styles.formContainer}>

          {/* HEADER */}

          <div style={styles.header}>

            <h1 style={styles.title}>
              Book Appointment
            </h1>

            <p style={styles.subtitle}>
              {isRegistered
                ? "Choose your appointment date and time."
                : "Please register as a patient before confirming an appointment."}
            </p>

          </div>

          {/* DOCTOR INFO */}

          <div style={styles.doctorBox}>

            <div>
              <span style={styles.doctorBoxLabel}>
                Appointment with Doctor
              </span>

              <strong style={styles.doctorBoxTitle}>
                Doctor ID: {doctorId}
              </strong>
            </div>

            <div style={styles.doctorBoxIcon}>
              👨‍⚕️
            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div style={styles.error}>

              <span style={styles.alertIcon}>
                !
              </span>

              <div>
                <strong>
                  Please check
                </strong>

                <p style={styles.alertText}>
                  {error}
                </p>
              </div>

            </div>
          )}

          {/* SUCCESS */}

          {message && (
            <div style={styles.success}>

              <span style={styles.successIcon}>
                ✓
              </span>

              <div>

                <strong>
                  Success
                </strong>

                <p style={styles.successText}>
                  {message}
                </p>

                {message.includes(
                  "Appointment request"
                ) && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/patient/appointments"
                      )
                    }
                    style={
                      styles.viewAppointmentsButton
                    }
                  >
                    View My Appointments
                  </button>
                )}

              </div>

            </div>
          )}

          {/* ==================================================
              REGISTRATION FORM
          ================================================== */}

          {!isRegistered && (
            <div style={styles.formCard}>

              <div style={styles.formSectionHeader}>

                <div style={styles.sectionIcon}>
                  👤
                </div>

                <div>
                  <h2 style={styles.sectionTitle}>
                    Patient Registration
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    New patients must register before
                    confirming an appointment.
                  </p>
                </div>

              </div>

              <form onSubmit={handleRegister}>

                <div style={styles.grid}>

                  {/* NAME */}

                  <div style={styles.field}>
                    <label
                      htmlFor="patientName"
                      style={styles.label}
                    >
                      Patient Name *
                    </label>

                    <input
                      id="patientName"
                      name="patientName"
                      type="text"
                      value={
                        registerData.patientName
                      }
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="Enter patient name"
                      maxLength={100}
                      required
                      style={styles.input}
                    />
                  </div>

                  {/* EMAIL */}

                  <div style={styles.field}>
                    <label
                      htmlFor="patientEmail"
                      style={styles.label}
                    >
                      Email *
                    </label>

                    <input
                      id="patientEmail"
                      name="patientEmail"
                      type="email"
                      value={
                        registerData.patientEmail
                      }
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="Enter email address"
                      required
                      style={styles.input}
                    />
                  </div>

                  {/* PASSWORD */}

                  <div style={styles.field}>
                    <label
                      htmlFor="password"
                      style={styles.label}
                    >
                      Password *
                    </label>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={
                        registerData.password
                      }
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="Create password"
                      minLength={6}
                      required
                      style={styles.input}
                    />

                    <small style={styles.helpText}>
                      Minimum 6 characters
                    </small>
                  </div>

                  {/* PHONE */}

                  <div style={styles.field}>
                    <label
                      htmlFor="phone"
                      style={styles.label}
                    >
                      Phone Number *
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={
                        registerData.phone
                      }
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="Enter phone number"
                      required
                      style={styles.input}
                    />
                  </div>

                  {/* GENDER */}

                  <div style={styles.field}>
                    <label
                      htmlFor="patientGender"
                      style={styles.label}
                    >
                      Gender *
                    </label>

                    <select
                      id="patientGender"
                      name="patientGender"
                      value={
                        registerData.patientGender
                      }
                      onChange={
                        handleRegisterChange
                      }
                      required
                      style={styles.input}
                    >
                      <option value="">
                        Select gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* AGE */}

                  <div style={styles.field}>
                    <label
                      htmlFor="patientAge"
                      style={styles.label}
                    >
                      Age *
                    </label>

                    <input
                      id="patientAge"
                      name="patientAge"
                      type="number"
                      value={
                        registerData.patientAge
                      }
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="Enter age"
                      min="1"
                      max="120"
                      required
                      style={styles.input}
                    />
                  </div>

                </div>

                <div style={styles.registerInfo}>
                  <span>🔐</span>

                  <span>
                    Your patient account is required
                    to confirm and manage appointments.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={registerLoading}
                  style={{
                    ...styles.primaryButton,
                    opacity: registerLoading
                      ? 0.7
                      : 1,
                    cursor: registerLoading
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {registerLoading
                    ? "Registering Patient..."
                    : "Register & Continue"}
                </button>

              </form>

              <div style={styles.existingPatient}>
                Already have a patient account?

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/patient/login?redirect=/patient/book-appointment/${doctorId}`
                    )
                  }
                  style={styles.loginLink}
                >
                  Login here
                </button>
              </div>

            </div>
          )}

          {/* ==================================================
              APPOINTMENT FORM
          ================================================== */}

          {isRegistered && (
            <div style={styles.formCard}>

              <div style={styles.formSectionHeader}>

                <div style={styles.sectionIcon}>
                  📅
                </div>

                <div>
                  <h2 style={styles.sectionTitle}>
                    Appointment Details
                  </h2>

                  <p style={styles.sectionSubtitle}>
                    Select a convenient date and time
                    for your appointment.
                  </p>
                </div>

              </div>

              {/* PATIENT INFO */}

              <div style={styles.patientInfo}>

                <div style={styles.patientAvatar}>
                  {patient.patientName
                    ? patient.patientName
                        .charAt(0)
                        .toUpperCase()
                    : "P"}
                </div>

                <div style={styles.patientInfoContent}>

                  <span style={styles.patientInfoLabel}>
                    Registered Patient
                  </span>

                  <strong style={styles.patientInfoName}>
                    {patient.patientName ||
                      "Patient"}
                  </strong>

                  <span style={styles.patientInfoDetails}>
                    {patient.patientGender || "N/A"}{" "}
                    • Age{" "}
                    {patient.patientAge || "N/A"}
                  </span>

                </div>

                <span style={styles.registeredBadge}>
                  ✓ Registered
                </span>

              </div>

              <form
                onSubmit={handleSubmitAppointment}
              >

                {/* PROBLEM */}

                <div style={styles.field}>
                  <label
                    htmlFor="problem"
                    style={styles.label}
                  >
                    Problem / Reason for Visit *
                  </label>

                  <textarea
                    id="problem"
                    name="problem"
                    value={
                      appointmentData.problem
                    }
                    onChange={
                      handleAppointmentChange
                    }
                    placeholder="Describe the patient's problem, symptoms, or reason for consultation"
                    maxLength={1000}
                    rows={4}
                    required
                    style={styles.textarea}
                  />

                  <small style={styles.helpText}>
                    Maximum 1000 characters
                  </small>
                </div>

                {/* DATE + TIME */}

                <div style={styles.grid}>

                  <div style={styles.field}>
                    <label
                      htmlFor="date"
                      style={styles.label}
                    >
                      Appointment Date *
                    </label>

                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={
                        appointmentData.date
                      }
                      min={today}
                      max={maxBookingDate}
                      onChange={
                        handleAppointmentChange
                      }
                      required
                      style={styles.input}
                    />
                  </div>

                  {appointmentData.date && doctorAvailable === false && <p role="alert" style={{ ...styles.error, gridColumn: "1 / -1" }}>The doctor is unavailable on this day. Please choose another date.</p>}

                  <div style={styles.field}>
                    <label
                      htmlFor="time"
                      style={styles.label}
                    >
                      Appointment Time *
                    </label>

                    <select id="time" name="time" value={appointmentData.time} onChange={handleAppointmentChange} required disabled={doctorAvailable !== true} style={styles.input}>
                      <option value="">Select a time within the doctor's available hours</option>
                      {availableAppointmentSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </div>

                </div>

                {/* ACTIONS */}

                <div style={styles.actions}>

                  <button
                    type="submit"
                    disabled={
                      appointmentLoading
                    }
                    style={{
                      ...styles.primaryButton,
                      flex: 1,
                      opacity:
                        appointmentLoading
                          ? 0.7
                          : 1,
                      cursor:
                        appointmentLoading
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {appointmentLoading
                      ? "Confirming Appointment..."
                      : "✓ Confirm Appointment"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/finddoctors"
                      )
                    }
                    disabled={
                      appointmentLoading
                    }
                    style={{
                      ...styles.secondaryButton,
                      opacity:
                        appointmentLoading
                          ? 0.7
                          : 1,
                      cursor:
                        appointmentLoading
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Back To Doctor Page
                  </button>

                </div>

              </form>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  page: {
    width: "100%",
    height: "100vh",
    display: "flex",
    overflow: "hidden",
    background: "#f4f8fb",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  sidePanel: {
    flex: "0 0 50%",
    width: "50%",
    height: "100vh",
    background:
      "linear-gradient(145deg, #123b5d 0%, #1769aa 100%)",
    color: "white",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  sideContent: {
    width: "100%",
    height: "100%",
    padding: "45px 55px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },

  logoTitle: {
    margin: 0,
    fontSize: "23px",
    fontWeight: 800,
  },

  logoSubtitle: {
    margin: "4px 0 0",
    color: "#c7e2f4",
    fontSize: "12px",
  },

  sideMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    maxWidth: "560px",
  },

  sideDescription: {
    color: "#d6e8f5",
    fontSize: "16px",
    lineHeight: 1.7,
    margin: "30px 0",
    maxWidth: "500px",
  },

  sideFeatures: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#eaf6ff",
    fontSize: "14px",
  },

  featureIcon: {
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 800,
    flexShrink: 0,
  },

  sideFooter: {
    color: "#b9d5e8",
    fontSize: "12px",
  },

  contentArea: {
    flex: "0 0 50%",
    width: "50%",
    height: "100vh",
    boxSizing: "border-box",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "35px 45px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    scrollbarWidth: "thin",
    scrollbarColor:
      "#b8c8d6 transparent",
  },

  formContainer: {
    width: "100%",
    maxWidth: "760px",
    minWidth: 0,
    paddingBottom: "30px",
    boxSizing: "border-box",
  },

  header: {
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    color: "#16324f",
    fontSize: "30px",
    fontWeight: 800,
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#667085",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  doctorBox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 18px",
    marginBottom: "18px",
    borderRadius: "12px",
    background: "#eef6ff",
    border: "1px solid #d7eafa",
    boxSizing: "border-box",
  },

  doctorBoxLabel: {
    display: "block",
    color: "#667085",
    fontSize: "11px",
    marginBottom: "4px",
  },

  doctorBoxTitle: {
    display: "block",
    color: "#24527a",
    fontSize: "15px",
  },

  doctorBoxIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "11px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    width: "100%",
    padding: "13px 15px",
    marginBottom: "18px",
    borderRadius: "10px",
    background: "#f8d7da",
    border: "1px solid #f1bfc4",
    color: "#842029",
    boxSizing: "border-box",
  },

  alertIcon: {
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#842029",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    flexShrink: 0,
  },

  alertText: {
    margin: "4px 0 0",
    lineHeight: 1.4,
  },

  success: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    width: "100%",
    padding: "13px 15px",
    marginBottom: "18px",
    borderRadius: "10px",
    background: "#d1e7dd",
    border: "1px solid #badbcc",
    color: "#0f5132",
    boxSizing: "border-box",
  },

  successIcon: {
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#0f5132",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    flexShrink: 0,
  },

  successText: {
    margin: "4px 0 0",
    lineHeight: 1.4,
  },

  viewAppointmentsButton: {
    marginTop: "10px",
    border: "none",
    borderRadius: "7px",
    padding: "9px 13px",
    background: "#1769aa",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  formCard: {
    width: "100%",
    background: "white",
    borderRadius: "15px",
    padding: "26px",
    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",
    border: "1px solid #e5e7eb",
    boxSizing: "border-box",
  },

  formSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "23px",
  },

  sectionIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "11px",
    background: "#e8f4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  sectionTitle: {
    margin: 0,
    color: "#16324f",
    fontSize: "19px",
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    color: "#667085",
    fontSize: "12px",
    lineHeight: 1.4,
  },

  grid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(0, 1fr)",
    gap: "0 18px",
    alignItems: "start",
  },

  field: {
    width: "100%",
    minWidth: 0,
    marginBottom: "18px",
  },

  label: {
    display: "block",
    color: "#344054",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "7px",
  },

  input: {
    display: "block",
    width: "100%",
    minWidth: 0,
    height: "45px",
    padding: "11px 13px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "#fff",
    outline: "none",
    color: "#344054",
  },

  textarea: {
    display: "block",
    width: "100%",
    minWidth: 0,
    padding: "12px 13px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "#fff",
    outline: "none",
    color: "#344054",
    resize: "vertical",
    lineHeight: 1.5,
  },

  helpText: {
    display: "block",
    marginTop: "5px",
    color: "#667085",
    fontSize: "11px",
  },

  registerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    width: "100%",
    padding: "11px 13px",
    borderRadius: "8px",
    background: "#f4f8fb",
    color: "#667085",
    fontSize: "12px",
    marginBottom: "18px",
    lineHeight: 1.4,
    boxSizing: "border-box",
  },

  primaryButton: {
    width: "100%",
    minHeight: "45px",
    border: "none",
    borderRadius: "8px",
    padding: "12px 16px",
    background: "#1769aa",
    color: "white",
    fontWeight: 800,
    fontSize: "14px",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  secondaryButton: {
    flex: 1,
    minHeight: "45px",
    border: "1px solid #1769aa",
    borderRadius: "8px",
    padding: "12px 16px",
    background: "white",
    color: "#1769aa",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "7px",
  },

  existingPatient: {
    textAlign: "center",
    marginTop: "18px",
    color: "#667085",
    fontSize: "13px",
  },

  loginLink: {
    border: "none",
    background: "transparent",
    color: "#1769aa",
    fontWeight: 800,
    cursor: "pointer",
    marginLeft: "5px",
    padding: 0,
  },

  patientInfo: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px",
    marginBottom: "22px",
    borderRadius: "10px",
    background: "#f4f8fb",
    border: "1px solid #e5e7eb",
    boxSizing: "border-box",
  },

  patientAvatar: {
    width: "43px",
    height: "43px",
    borderRadius: "50%",
    background: "#1769aa",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    fontWeight: 800,
    flexShrink: 0,
  },

  patientInfoContent: {
    minWidth: 0,
    flex: 1,
  },

  patientInfoLabel: {
    display: "block",
    color: "#667085",
    fontSize: "10px",
    marginBottom: "2px",
  },

  patientInfoName: {
    display: "block",
    color: "#16324f",
    fontSize: "14px",
    wordBreak: "break-word",
  },

  patientInfoDetails: {
    display: "block",
    color: "#667085",
    fontSize: "11px",
    marginTop: "2px",
  },

  registeredBadge: {
    marginLeft: "auto",
    padding: "6px 9px",
    borderRadius: "20px",
    background: "#d1e7dd",
    color: "#0f5132",
    fontSize: "10px",
    fontWeight: 800,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  loadingPage: {
    width: "100%",
    height: "100vh",
    background: "#f4f8fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loadingCard: {
    background: "white",
    padding: "40px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #dbeafe",
    borderTop: "4px solid #1769aa",
    borderRadius: "50%",
    margin: "0 auto 18px",
    animation: "spin 1s linear infinite",
  },

  loadingTitle: {
    margin: 0,
    color: "#16324f",
    fontSize: "18px",
  },

  loadingText: {
    color: "#667085",
    fontSize: "13px",
  },
};

export default BookAppointment;
