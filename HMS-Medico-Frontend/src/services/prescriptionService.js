import api from "./axiosConfig";
const auth=()=>({headers:{Authorization:`Bearer ${sessionStorage.getItem("doctorToken")}`}});
export const createPrescription=async data=>(await api.post("/prescriptions",data,auth())).data;
export const getDoctorPrescriptions=async()=>(await api.get("/prescriptions/doctor/my",auth())).data;
