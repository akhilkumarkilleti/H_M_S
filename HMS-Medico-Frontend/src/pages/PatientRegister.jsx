import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authImage from "../assets/login.jpg";
import axiosInstance from "../services/axiosConfig";
import {
  getMyPatientProfile,
  updateMyPatientProfile,
} from "../services/patientService";
import "./PatientRegister.css";

function PatientRegister() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const redirect =
    params.get("redirect") || "/patient/appointments";

  const isEditMode = params.get("mode") === "edit";

  const [formData, setFormData] = useState({
    patientName: "",
    patientGender: "",
    patientAge: "",
    email: "",
    password: "",
    mobileNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOAD EXISTING PATIENT DATA IN EDIT MODE
  // ==========================================

  useEffect(() => {
    if (!isEditMode) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const data = await getMyPatientProfile();

        setFormData({
          patientName: data.patientName || "",
          patientGender: data.patientGender || "",
          patientAge: data.patientAge || "",
          email: data.email || "",
          password: "",
          mobileNumber:
            data.mobileNumber ||
            data.phoneNumber ||
            "",
        });
      } catch (err) {
        console.error(
          "Unable to load patient profile:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load patient profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isEditMode]);

  // ==========================================
  // MOBILE NUMBER PATTERN
  // ==========================================

  const mobileRegex = /^[6-9][0-9]{9}$/;

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // REGISTER / UPDATE PATIENT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ==========================================
    // MOBILE NUMBER VALIDATION
    // ==========================================

    if (!mobileRegex.test(formData.mobileNumber.trim())) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    // ==========================================
    // AGE VALIDATION
    // ==========================================

    const age = Number(formData.patientAge);

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

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    const email = formData.email.trim().toLowerCase();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    // ==========================================
    // PASSWORD VALIDATION FOR NEW REGISTRATION
    // ==========================================

    if (!isEditMode && formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      let data;

      // ========================================
      // EDIT PATIENT PROFILE
      // ========================================

      if (isEditMode) {
        data = await updateMyPatientProfile({
          patientName: formData.patientName.trim(),
          patientGender: formData.patientGender,
          patientAge: age,
          email: email,
          phoneNumber:
            formData.mobileNumber.trim(),
          password: formData.password,
        });

        console.log(
          "Patient profile update response:",
          data
        );

        // ========================================
        // SAVE UPDATED PATIENT DATA
        // ========================================

        if (data.token) {
          sessionStorage.setItem(
            "patientToken",
            data.token
          );
        }

        if (data.id) {
          sessionStorage.setItem(
            "patientId",
            String(data.id)
          );
        }

        sessionStorage.setItem(
          "patientEmail",
          data.email || email
        );

        sessionStorage.setItem(
          "patientName",
          data.patientName ||
            formData.patientName
        );

        sessionStorage.setItem(
          "patientGender",
          data.patientGender ||
            formData.patientGender
        );

        sessionStorage.setItem(
          "patientAge",
          String(
            data.patientAge || age
          )
        );

        sessionStorage.setItem(
          "patientMobileNumber",
          data.mobileNumber ||
            data.phoneNumber ||
            formData.mobileNumber
        );

        alert(
          "Patient profile updated successfully."
        );

        navigate(
          "/patient/dashboard",
          { replace: true }
        );

        return;
      }

      // ========================================
      // NEW PATIENT REGISTRATION
      // ========================================

      const response = await axiosInstance.post(
        "/patients/register",
        {
          patientName:
            formData.patientName.trim(),

          patientGender:
            formData.patientGender,

          patientAge:
            age,

          email:
            email,

          password:
            formData.password,

          mobileNumber:
            formData.mobileNumber.trim(),

          // Backend expects phoneNumber
          phoneNumber:
            formData.mobileNumber.trim(),
        }
      );

      data = response.data;

      console.log(
        "Patient registration response:",
        data
      );

      // ========================================
      // SAVE PATIENT DATA
      // ========================================

      if (data.token) {
        sessionStorage.setItem(
          "patientToken",
          data.token
        );
      }

      if (data.id) {
        sessionStorage.setItem(
          "patientId",
          String(data.id)
        );
      }

      sessionStorage.setItem(
        "patientEmail",
        data.email || email
      );

      sessionStorage.setItem(
        "patientName",
        data.patientName ||
          formData.patientName
      );

      sessionStorage.setItem(
        "patientGender",
        data.patientGender ||
          formData.patientGender
      );

      sessionStorage.setItem(
        "patientAge",
        String(
          data.patientAge || age
        )
      );

      sessionStorage.setItem(
        "patientMobileNumber",
        data.mobileNumber ||
          data.phoneNumber ||
          formData.mobileNumber
      );

      // ========================================
      // EMAIL SUCCESS MESSAGE
      // ========================================

      setSuccess(
        `Registration successful! A confirmation email has been sent to ${email}.`
      );

      // ========================================
      // REDIRECT AFTER REGISTRATION
      // ========================================

      setTimeout(() => {
        navigate(
          redirect,
          { replace: true }
        );
      }, 1500);

    } catch (error) {
      console.error(
        "Patient registration error:",
        error
      );

      // ========================================
      // BACKEND ERROR
      // ========================================

      if (error.response) {
        setError(
          error.response.data?.message ||
            (
              typeof error.response.data ===
              "string"
                ? error.response.data
                : "Unable to create patient account."
            )
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please check whether the Spring Boot backend is running."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-register-page">

      {/* ======================================
          LEFT SIDE
      ====================================== */}

      <div className="patient-register-image">

        <img src={authImage} alt="Healthcare professionals at MediCo hospital" />

        <div className="register-image-overlay"></div>

        <div className="register-image-content">

          <h1>
            MediCo
          </h1>

          <p>
            Start your healthcare journey
            with a secure and trusted
            hospital management platform.
          </p>

          <div className="register-image-features">




            <div>
              <span>✓</span>
              Create Account & Find Qualified Doctors
            </div>

            <div>
              <span>✓</span>
              Book Appointments Easily
            </div>

            <div>
              <span>✓</span>
              Manage Your Healthcare
            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          RIGHT SIDE
      ====================================== */}

      <div className="patient-register-form-side">

        <div className="patient-register-card">

          <div className="register-mobile-logo">
            🏥
          </div>

          <h2>
            {
              isEditMode
                ? "Update Patient Profile"
                : "Create Account"
            }
          </h2>

          <p className="register-subtitle">

            {
              isEditMode
                ? "Update your details. Your changes will be saved to the database."
                : "Register as a patient"
            }

          </p>

          {/* ======================================
              ERROR MESSAGE
          ====================================== */}

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* ======================================
              SUCCESS MESSAGE
          ====================================== */}

          {success && (
            <div
              className="register-success"
              style={{
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "6px",
                backgroundColor: "#e8f5e9",
                color: "#2e7d32",
                border: "1px solid #81c784",
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* =================================
                PATIENT NAME
            ================================= */}

            <div className="register-input-group">

              <label>
                Patient Name
              </label>

              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter your full name"
                maxLength="100"
                required
              />

            </div>

            {/* =================================
                SEX + AGE
            ================================= */}

            <div className="register-row">

              <div className="register-input-group">

                <label>
                  Gender
                </label>

                <select
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Gender
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

              <div className="register-input-group">

                <label>
                  Age
                </label>

                <input
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  placeholder="Age"
                  required
                />

              </div>

            </div>

            {/* =================================
                EMAIL
            ================================= */}

            <div className="register-input-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

              {!isEditMode && (
                <small
                  style={{
                    display: "block",
                    marginTop: "5px",
                    color: "#666",
                  }}
                >
                  A registration confirmation will
                  be sent to this email.
                </small>
              )}

            </div>

            {/* =================================
                MOBILE NUMBER
            ================================= */}

            <div className="register-input-group">

              <label>
                Mobile Number
              </label>

              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                pattern="[6-9][0-9]{9}"
                required
              />

            </div>

            {/* =================================
                PASSWORD
            ================================= */}

            <div className="register-input-group">

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  isEditMode
                    ? "Leave blank to keep current password"
                    : "Create a password"
                }
                minLength="6"
                required={!isEditMode}
              />

            </div>

            {/* =================================
                REGISTER BUTTON
            ================================= */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading
                ? (
                    isEditMode
                      ? "Saving..."
                      : "Creating Account..."
                  )
                : (
                    isEditMode
                      ? "Save Profile"
                      : "Create Patient Account"
                  )}

            </button>

          </form>

          {/* =================================
              DIVIDER
          ================================= */}

          <div className="register-divider">

            <span>
              OR
            </span>

          </div>

          {/* =================================
              LOGIN
          ================================= */}

          <p className="register-login-text">

            Already have a patient account?

            <span
              onClick={() =>
                navigate(
                  `/patient/login?redirect=${encodeURIComponent(
                    redirect
                  )}`
                )
              }
            >
              Login
            </span>

          </p>

          {/* =================================
              BACK HOME
          ================================= */}

          <button
            className="register-back-button"
            onClick={() =>
              navigate("/")
            }
          >
            Back to HomePage
          </button>

        </div>

      </div>

    </div>
  );
}

export default PatientRegister;
