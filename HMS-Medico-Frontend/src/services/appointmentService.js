import axiosInstance from "./axiosConfig";

export const getMyDoctorAppointments = async () => {
  const response = await axiosInstance.get("/appointments/doctor/my");
  return response.data;
};

export const getMyPatientAppointments = async () => {
  const response = await axiosInstance.get("/appointments/patient/my");
  return response.data;
};

// Doctor accepts/confirms a pending appointment.
export const approveDoctorAppointment = async (appointmentId) => {
  if (!appointmentId) {
    throw new Error("Appointment ID is required.");
  }

  const response = await axiosInstance.put(
    `/appointments/${appointmentId}/confirm`
  );

  return response.data;
};

// Doctor rejects a pending appointment.
export const rejectDoctorAppointment = async (appointmentId, payload) => {
  if (!appointmentId) {
    throw new Error("Appointment ID is required.");
  }

  const response = await axiosInstance.put(
    `/appointments/${appointmentId}/reject`,
    payload
  );

  return response.data;
};

// Backward-compatible alias.
export const confirmAppointment = approveDoctorAppointment;
