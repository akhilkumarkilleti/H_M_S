import api from "./axiosConfig";

export const getDoctorDashboard = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}/dashboard`);
  return response.data;
};

export const getDoctorPatientClinicalRecords = async (patientId) => {
  const response = await api.get(`/clinical-records/doctor/patient/${patientId}`);
  return response.data;
};

export const getDoctorOldMedicalRecordFile = async (reportId) => {
  return api.get(`/clinical-records/doctor/old-records/${reportId}/file`, {
    responseType: "blob",
  });
};

export const getDoctorLabReportFile = async (reportId) => {
  return api.get(`/clinical-records/doctor/lab-reports/${reportId}/file`, {
    responseType: "blob",
  });
};
