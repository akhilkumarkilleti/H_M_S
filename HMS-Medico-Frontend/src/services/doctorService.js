import axiosInstance from "./axiosConfig";

export const loginDoctor = async (loginData) => {
  const response = await axiosInstance.post(
    "/doctors/login",
    loginData
  );

  return response.data;
};



export const getMyDoctorProfile = async () => {
  const response = await axiosInstance.get("/doctors/me");
  return response.data;
};

export const updateMyDoctorProfile = async (formData) => {
  const response = await axiosInstance.put("/doctors/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getMyDoctorAvailability = async (from, to) =>
  (await axiosInstance.get(`/doctors/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)).data;

export const saveMyDoctorAvailability = async (data) =>
  (await axiosInstance.put("/doctors/availability", data)).data;
