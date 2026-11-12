import api from "./axiosConfig";

const auth = () => {
  const token = sessionStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Staff authentication token is missing. Please log in again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getStaffPatients = async (role) => (await api.get(`/${role}/patients`,auth())).data;
export const getStaffAppointments = async () => (await api.get("/reception/appointments",auth())).data;
export const getReceptionHealthCheckups = async () => (await api.get("/health-checkups/reception/all",auth())).data;
export const addVitals = async (data) => (await api.post("/nurse/vitals",data,auth())).data;
export const getPatientVitals = async (id) => (await api.get(`/nurse/patients/${id}/vitals`,auth())).data;
export const uploadLabReport = async (patientId,reportName,file,labTestId) => {
 const form=new FormData(); form.append("patientId",patientId); form.append("reportName",reportName); if(labTestId) form.append("labTestId",labTestId); form.append("file",file);
 return (await api.post("/lab/reports",form,{...auth(),headers:{...auth().headers,"Content-Type":"multipart/form-data"}})).data;
};
export const getPatientReports = async (id) => (await api.get(`/lab/patients/${id}/reports`,auth())).data;
export const getPharmacyPatient = async (id) => (await api.get(`/pharmacy/patients/${id}`,auth())).data;
export const getPharmacyPrescriptions = async () => (await api.get("/pharmacy/prescriptions",auth())).data;
export const getPatientRecords = async (type) => (await api.get(`/patient-records/${type}`,{headers:{Authorization:`Bearer ${sessionStorage.getItem("patientToken")}`}})).data;

export const getStaffClinicalRecords = async (patientId) =>
  (await api.get(`/clinical-records/patient/${patientId}`, auth())).data;

export const dispensePrescription = async (prescriptionId) =>
  (await api.put(`/prescriptions/${prescriptionId}/dispense`, {}, auth())).data;


export const getStaffProfile = async () =>
  (await api.get("/admin/users/me", auth())).data;

export const updateStaffProfile = async (profile) =>
  (await api.put("/admin/users/me", profile, auth())).data;

export const getActiveDoctorsForStaff = async () => (await api.get("/doctors/active-today", auth())).data;

export const getLabHealthCheckups = async () => (await api.get("/health-checkups/lab/all", auth())).data;
export const initializeHealthCheckup = async (id) => (await api.put(`/health-checkups/lab/${id}/initialize`, {}, auth())).data;
export const completeHealthCheckup = async (id, file) => {
 const form=new FormData(); form.append("file",file);
 return (await api.post(`/health-checkups/lab/${id}/complete`, form, {...auth(),headers:{...auth().headers,"Content-Type":"multipart/form-data"}})).data;
};
export const deleteLabReport = async (id) => (await api.delete(`/lab/reports/${id}`, auth())).data;
export const getPharmacyHistory = async () => (await api.get("/pharmacy/history", auth())).data;

export const initializeLabTest = async (id) => (await api.put(`/lab-tests/${id}/initialize`, {}, auth())).data;

export const replaceLabReport = async (id, reportName, file) => {
 const form=new FormData(); form.append("reportName",reportName); form.append("file",file);
 return (await api.put(`/lab/reports/${id}/replace`, form, {...auth(),headers:{...auth().headers,"Content-Type":"multipart/form-data"}})).data;
};

export const getLabHistory = async () => (await api.get("/lab/history", auth())).data;
