import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authImage from "../assets/login.jpg";
import { loginAdmin } from "../services/adminService";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

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
      // Login request
      const result = await loginAdmin(formData);

      console.log("LOGIN RESULT:", result);

      // -----------------------------------------
      // CHECK TOKEN
      // -----------------------------------------

      if (!result || !result.token) {
        throw new Error("Invalid email or password.");
      }

      // -----------------------------------------
      // GET ROLE
      // -----------------------------------------

      const role = String(result.role || "")
        .trim()
        .toUpperCase();

      console.log("USER ROLE:", role);

      // -----------------------------------------
      // ALLOWED STAFF ROLES
      // -----------------------------------------

      if (
        !["MAIN_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTION", "LAB", "PHARMACY"].includes(role)
      ) {
        throw new Error(
          "You are not authorized as a staff member."
        );
      }

      // -----------------------------------------
      // SAVE LOGIN DATA
      // -----------------------------------------

      sessionStorage.setItem(
        "adminToken",
        result.token
      );

      sessionStorage.setItem(
        "adminRole",
        role
      );

      sessionStorage.setItem(
        "adminId",
        String(result.id || "")
      );

      sessionStorage.setItem(
        "adminEmail",
        result.email || formData.email
      );
      if (result.fullName) sessionStorage.setItem("adminName", result.fullName);
      if (result.phoneNumber) sessionStorage.setItem("adminPhone", result.phoneNumber);

      // Doctors use the same login form, but keep doctor credentials
      // separate from administrator/staff credentials.
      if (role === "DOCTOR") {
        sessionStorage.setItem("doctorToken", result.token);
        sessionStorage.setItem("doctorId", String(result.id || ""));
        sessionStorage.setItem("doctorEmail", result.email || formData.email);
        sessionStorage.setItem("doctorName", result.fullName || "");
        sessionStorage.setItem("doctorPhone", result.phoneNumber || "");
        sessionStorage.setItem("status", result.status || "APPROVED");
        sessionStorage.setItem("doctorRole", "DOCTOR");
        // Remove any stale administrator credentials from a previous session.
        ["adminToken", "adminRole", "adminId", "adminEmail", "adminName", "adminPhone"].forEach((key) => sessionStorage.removeItem(key));
      }

      if (role !== "DOCTOR") {
        ["doctorToken", "doctorId", "doctorEmail", "doctorName", "doctorPhone", "doctorRole", "status"].forEach((key) => sessionStorage.removeItem(key));
      }

      // -----------------------------------------
      // REDIRECT BASED ON ROLE
      // -----------------------------------------

      if (role === "MAIN_ADMIN" || role === "ADMIN") {

        navigate("/admin/dashboard", {
          replace: true,
        });

      } else if (role === "DOCTOR") {
        navigate("/doctor/dashboard", { replace: true });
      } else if (role === "NURSE") {

        navigate("/nurse/dashboard", {
          replace: true,
        });

      } else if (role === "RECEPTION") {

        navigate("/reception/dashboard", { replace: true });
      } else if (role === "LAB") {
        navigate("/lab/dashboard", { replace: true });
      } else if (role === "PHARMACY") {
        navigate("/pharmacy/dashboard", { replace: true });
      }

    } catch (error) {

      console.error(
        "Staff login error:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Invalid email or password."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="admin-login-page">

      {/* =====================================
          LEFT SIDE
      ====================================== */}

      <div className="admin-login-image">

        <img src={authImage} alt="Healthcare professionals at MediCo hospital" />

        <div className="admin-image-overlay" />

        <div className="admin-image-content">

          <h1>
             MediCo
          </h1>

          <p>
            Secure access for administrators, doctors and hospital staff members.
          </p>

          <div className="admin-features">

            <div>
              <span>✓</span>
              Patient Management
            </div>

            <div>
              <span>✓</span>
              Appointment Management
            </div>

            <div>
              <span>✓</span>
              Secure Staff Access
            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          RIGHT SIDE
      ====================================== */}

      <div className="admin-login-form-side">

        <div className="admin-login-card">

          <div className="admin-mobile-logo">
            🏥
          </div>

          <h2>
            Staff Login
          </h2>

          <p className="admin-subtitle">
            Sign in to MediCo
          </p>

          {/* ERROR */}

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="admin-input-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />

            </div>

            {/* PASSWORD */}

            <div className="admin-input-group">

              <label>
                Password
              </label>

              <span
                className="patient-forgot-link"
                onClick={() => navigate("/admin/forgot-password")}
              >
                Forgot Password?
              </span>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >

              {loading
                ? "Logging in..."
                : "Login"}

            </button>

          </form>

          <div className="admin-security">
            🔒 Secure staff access
          </div>

          <button
            type="button"
            className="patient-back-button"
            onClick={() => navigate("/")}
          >
            Back to HomePage
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;
