import axiosInstance from "./axiosInstance";

// 🔹 Register User
export const saveAppointment = (data) => {
  return axiosInstance.post("/appointment/create", data)
}

// update appointment
export const updateAppointment = (id, data) => {
  return axiosInstance.put(`/appointment/updateAppoint/${id}`, data)
}

// delete appointment
export const deleteAppointment = (id) => {
  return axiosInstance.delete(`/appointment/deleteAppoint/${id}`)
}