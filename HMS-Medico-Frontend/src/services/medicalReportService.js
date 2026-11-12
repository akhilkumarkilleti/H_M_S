import axios from "axios";

const API_URL = "http://localhost:8080/api/medical-reports";

/**
 * Get medical reports for the logged-in patient.
 */
export const getMyMedicalReports = async () => {
  const token = sessionStorage.getItem("patientToken");
  const patientId = sessionStorage.getItem("patientId");

  if (!token) {
    throw new Error("Patient is not logged in.");
  }

  const response = await axios.get(`${API_URL}/patient/${patientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * Upload a medical report for the logged-in patient.
 */
export const uploadMedicalReport = async (file) => {
  const token = sessionStorage.getItem("patientToken");
  const patientId = sessionStorage.getItem("patientId");

  if (!token) {
    throw new Error("Patient is not logged in.");
  }

  if (!patientId) {
    throw new Error("Patient ID is missing.");
  }

  if (!file) {
    throw new Error("Please select a file.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_URL}/upload/${patientId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const getMedicalReportFile = async (fileName) => {
  const token = sessionStorage.getItem("patientToken");
  return axios.get(`${API_URL}/file/${encodeURIComponent(fileName)}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
};
