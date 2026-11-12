import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const url = config.url || "";

  if (url.includes("/login") || url.includes("/signup") || url.includes("/forgot-password")) {
    delete config.headers.Authorization;
    return config;
  }

  const role = (sessionStorage.getItem("adminRole") || "").toUpperCase();
  let token = "";

  // Patient endpoints
  if (
    url.startsWith("/patient-records") ||
    url.startsWith("/prescriptions/patient") ||
    url.startsWith("/lab-tests/patient") ||
    url.startsWith("/medical-reports") ||
    url.startsWith("/patients/") ||
    url.startsWith("/appointments/patient") ||
    url === "/appointments" ||
    url.startsWith("/health-checkups/patient") ||
    (url.startsWith("/billing/invoices/") && url !== "/billing/invoices/catalog") ||
    url === "/health-checkups"
  ) {
    token = sessionStorage.getItem("patientToken") || "";
  }
  // Doctor endpoints
  else if (
    url === "/billing/invoices/catalog" ||
    (url.startsWith("/doctors/") &&
    !url.startsWith("/doctors/active-today")) ||
    url.startsWith("/appointments/doctor") ||
    url.match(/^\/appointments\/\d+\/(confirm|reject)$/) ||
    url.startsWith("/prescriptions/doctor") ||
    url === "/prescriptions" ||
    url.startsWith("/lab-tests/doctor") ||
    url === "/lab-tests" ||
    url.startsWith("/clinical-records/doctor")

  ) {
    token = sessionStorage.getItem("doctorToken") || "";
  }
  // Admin and hospital-staff endpoints
  else if (
    url.startsWith("/clinical-records/admin/") ||
    url.startsWith("/admin/") ||
    url.startsWith("/nurse/") ||
    url.startsWith("/reception/") ||
    url.startsWith("/lab/") ||
    url.startsWith("/pharmacy/") ||
    url.startsWith("/lab-tests/lab/") ||
    url.startsWith("/health-checkups/lab/")
  ) {
    token = sessionStorage.getItem("adminToken") || "";
  }
  // Other authenticated calls: choose based on the active login role.
  else if (role === "DOCTOR") {
    token = sessionStorage.getItem("doctorToken") || "";
  } else if (role === "PATIENT") {
    token = sessionStorage.getItem("patientToken") || "";
  } else {
    token = sessionStorage.getItem("adminToken") || "";
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;

  return config;
}, (error) => Promise.reject(error));


export default axiosInstance;
