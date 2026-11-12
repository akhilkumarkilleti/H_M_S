import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authImage from "../assets/login.jpg";
import axiosInstance from "../services/axiosConfig";
import "./PatientLogin.css";

function StaffForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/admin/forgot-password", {
        email: form.email,
        newPassword: form.newPassword,
      });
      setSuccess(data.message || "Password updated. You can now log in.");
      setForm({ email: "", newPassword: "", confirmPassword: "" });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-auth-page">
      <div className="patient-auth-image">
        <img src={authImage} alt="Healthcare professionals at MediCo hospital" />
        <div className="patient-image-overlay" />
        <div className="patient-image-content">
          <h1>MediCo</h1>
          <p>Secure access for administrators, doctors and hospital staff members.</p>
        </div>
      </div>
      <div className="patient-auth-form-side">
        <div className="patient-login-card">
          <h2>Reset Your Password</h2>
          <p className="patient-subtitle">Enter your registered staff email and choose a new password.</p>
          {error && <div className="patient-login-error" role="alert">{error}</div>}
          {success && <div className="patient-reset-success" role="status">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="patient-input-group">
              <label htmlFor="staff-reset-email">Registered email address</label>
              <input id="staff-reset-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your registered email" autoComplete="email" required />
            </div>
            <div className="patient-input-group">
              <label htmlFor="staff-new-password">New password</label>
              <input id="staff-new-password" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="At least 6 characters" autoComplete="new-password" minLength={6} required />
            </div>
            <div className="patient-input-group">
              <label htmlFor="staff-confirm-password">Confirm new password</label>
              <input id="staff-confirm-password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter your new password" autoComplete="new-password" minLength={6} required />
            </div>
            <button type="submit" className="patient-login-button" disabled={loading}>
              {loading ? "Updating password..." : "Update Password"}
            </button>
          </form>
          <button className="patient-back-button" onClick={() => navigate("/admin/login", { replace: true })}>
            Back to Staff Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default StaffForgotPassword;
