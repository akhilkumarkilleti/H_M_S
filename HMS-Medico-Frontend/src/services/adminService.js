import axiosInstance from "./axiosConfig";

const API_URL = "/admin";


export const loginAdmin = async (loginData) => {
  const response = await axiosInstance.post(
    `${API_URL}/login`,
    loginData
  );

  return response.data;
};


const adminConfig = () => {
  const token = sessionStorage.getItem("adminToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};




export const getPendingDoctors = async () => {
  const response = await axiosInstance.get(
    `${API_URL}/doctors/pending`,
    adminConfig()
  );

  return response.data;
};

export const getApprovedDoctors = async () => {
  const response = await axiosInstance.get(
    `${API_URL}/doctors/approved`,
    adminConfig()
  );

  return response.data;
};

export const getRejectedDoctors = async () => {
  const response = await axiosInstance.get(
    `${API_URL}/doctors/rejected`,
    adminConfig()
  );

  return response.data;
};

export const approveDoctor = async (doctorId) => {
  const response = await axiosInstance.put(
    `${API_URL}/doctors/${doctorId}/approve`,
    {},
    adminConfig()
  );

  return response.data;
};

export const rejectDoctor = async (doctorId) => {
  const response = await axiosInstance.put(
    `${API_URL}/doctors/${doctorId}/reject`,
    {},
    adminConfig()
  );

  return response.data;
};

// =============================================
// PATIENTS
// =============================================

export const getAllPatients = async () => {
  const response = await axiosInstance.get(
    `${API_URL}/patients`,
    adminConfig()
  );

  return response.data;
};

// =============================================
// APPOINTMENTS
// =============================================

export const getAllAppointments = async () => {
  const response = await axiosInstance.get(
    `${API_URL}/appointments`,
    adminConfig()
  );

  return response.data;
};

// =============================================
// ADMINS
// =============================================

// GET ALL ADMINS
export const getAllAdmins = async () => {
  const response = await axiosInstance.get(
    `${API_URL}/users`,
    adminConfig()
  );

  return response.data;
};

// CREATE NEW ADMIN
export const createAdmin = async (adminData) => {
  const response = await axiosInstance.post(
    `${API_URL}/users`,
    adminData,
    adminConfig()
  );

  return response.data;
};


export const getAllDoctors = async () => (await axiosInstance.get(`${API_URL}/doctors`, adminConfig())).data;

export const getActivityLogs = async (module = "ALL") => {
  const url =
    module && module !== "ALL"
      ? `${API_URL}/activity/module/${encodeURIComponent(module)}`
      : `${API_URL}/activity`;

  const response = await axiosInstance.get(url, adminConfig());
  return response.data;
};

export const getPatientClinicalRecords = async (patientId) => {
  const response = await axiosInstance.get(`/clinical-records/admin/patient/${patientId}`, adminConfig());
  return response.data;
};



export const createDoctor = async (doctorData) => {
  const response = await axiosInstance.post(
    `${API_URL}/doctors`,
    doctorData,
    { ...adminConfig(), headers: { ...adminConfig().headers, "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const updateStaffByAdmin = async (id, data) => (await axiosInstance.put(`${API_URL}/users/${id}`, data, adminConfig())).data;
export const deleteStaffByAdmin = async (id) => (await axiosInstance.delete(`${API_URL}/users/${id}`, adminConfig())).data;
export const updateDoctorByAdmin = async (id, data) => (await axiosInstance.put(`${API_URL}/doctors/${id}`, data, adminConfig())).data;
export const deleteDoctorByAdmin = async (id) => (await axiosInstance.delete(`${API_URL}/doctors/${id}`, adminConfig())).data;

export const getAllHealthCheckups = async () => (await axiosInstance.get("/health-checkups/admin/all", adminConfig())).data;
export const getAdminBillingInvoices = async () => (await axiosInstance.get(`${API_URL}/billing/invoices`, adminConfig())).data;
export const renewAdminBillingInvoice = async (invoiceId) => (await axiosInstance.post(`${API_URL}/billing/invoices/${invoiceId}/renew`, {}, adminConfig())).data;
