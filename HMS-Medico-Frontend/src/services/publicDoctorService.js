import axiosInstance from "./axiosConfig";

export const getApprovedDoctors = async () => {
  const response = await axiosInstance.get("/doctors/approved");
  return response.data;
};