import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

let interceptorsConfigured = false;

export const setupAxiosInterceptors = (logout) => {
  if (interceptorsConfigured) {
    return;
  }

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("expense-tracker-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      }
      return Promise.reject(error);
    }
  );

  interceptorsConfigured = true;
};
