import api from "./axiosConfig";

const doctorAuth = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("doctorToken")}` } });
const patientAuth = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("patientToken")}` } });
const labAuth = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken")}` } });

export const createLabTest = async (data) => (await api.post("/lab-tests", data, doctorAuth())).data;
export const getDoctorLabTests = async () => (await api.get("/lab-tests/doctor/my", doctorAuth())).data;
export const getPatientLabTests = async () => (await api.get("/lab-tests/patient/my", patientAuth())).data;
export const getPendingLabTests = async () => (await api.get("/lab-tests/lab/pending", labAuth())).data;
