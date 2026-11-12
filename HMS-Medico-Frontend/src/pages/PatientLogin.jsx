import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authImage from "../assets/login.jpg";
import axiosInstance from "../services/axiosConfig";
import "./PatientLogin.css";

function PatientLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirect =
    params.get("redirect") || "/patient/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await axiosInstance.post(
        "/patients/login",
        formData
      );

      console.log("Patient login response:", data);

      sessionStorage.setItem("patientToken", data.token);
      sessionStorage.setItem("patientId", String(data.id));
      sessionStorage.setItem("patientEmail", data.email);
      sessionStorage.setItem(
        "patientName",
        data.patientName || ""
      );
      sessionStorage.setItem(
        "patientSex",
        data.patientSex || ""
      );
      sessionStorage.setItem(
        "patientAge",
        String(data.patientAge || "")
      );

      navigate(redirect, {
        replace: true,
      });

    } catch (error) {
      console.error("Patient login error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          (typeof error.response.data === "string"
            ? error.response.data
            : "Invalid email or password.")
        );
      } else {
        setError(
          "Unable to connect to the server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-auth-page">

      {/* ================= LEFT SIDE ================= */}

      <div className="patient-auth-image">

        <img
          src={authImage}
          alt="Healthcare professionals at MediCo hospital"
        />

        <div className="patient-image-overlay"></div>

        <div className="patient-image-content">



          <h1>
            MediCo
          </h1>

          <p>
            Your health, our priority.
            Access trusted healthcare
            services anytime.
          </p>

          <div className="patient-image-features">

            <div>
              <span>✓</span>
              Easy Appointment Booking
            </div>

            <div>
              <span>✓</span>
              Connect With Doctors
            </div>

            <div>
              <span>✓</span>
              Secure Patient Portal
            </div>

          </div>

        </div>

      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div className="patient-auth-form-side">

        <div className="patient-login-card">

          <div className="patient-mobile-logo">
            🏥
          </div>

          <h2>
            Welcome Back
          </h2>

          <p className="patient-subtitle">
            Login to your patient account
          </p>

          {error && (
            <div className="patient-login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="patient-input-group">

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

            </div>

            {/* PASSWORD */}

            <div className="patient-input-group">

              <div className="patient-label-row">

                <label>
                  Password
                </label>

                <span
                  className="patient-forgot-link"
                  onClick={() =>
                    navigate(
                      "/patient/forgot-password"
                    )
                  }
                >
                  Forgot Password?
                </span>

              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />

            </div>

            <button
              type="submit"
              className="patient-login-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          <div className="patient-divider">
            <span>OR</span>
          </div>

          <p className="patient-signup-text">

            Don't have a patient account?

            <span
              onClick={() =>
                navigate(
                  `/patient/register?redirect=${encodeURIComponent(
                    redirect
                  )}`
                )
              }
            >
              Create Account
            </span>

          </p>

          <button className="patient-back-button" onClick={() => navigate("/")}>Back to HomePage</button>

        </div>

      </div>

    </div>
  );
}

export default PatientLogin;
