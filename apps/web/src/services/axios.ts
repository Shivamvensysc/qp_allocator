import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, clearToken } from "../utils/token";
import { navigateTo } from "../utils/navigation";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);


axiosInstance.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Unauthorized — Redirecting to login");
      clearToken();

      const currentPath = window.location.pathname;

      if (currentPath.startsWith("/admin")) {
        navigateTo("/auth/loginAdmin");
      } else {
        navigateTo("/auth/loginSelector");
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
