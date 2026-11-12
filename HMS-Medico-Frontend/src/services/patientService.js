import api from "./axiosConfig";

export const getMyPatientProfile = async () => {
  const response = await api.get("/patients/me");
  return response.data;
};

export const updateMyPatientProfile = async (profileData) => {
  const response = await api.put("/patients/me", profileData);
  return response.data;
};
export const bookHealthCheckup = async (data) => {
  const response = await api.post("/health-checkups", data);
  return response.data;
};

export const getMyHealthCheckups = async () => {
  const response = await api.get("/health-checkups/patient/my");
  return response.data;
};


export const getHealthCheckupReport = async (id) => {
  const response = await api.get(`/health-checkups/${id}/file`, {
    responseType: "blob",
  });

  return response.data;
};