// src/Apis/apiService.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// Base URL of your API (set via Vite)
const API_URL    = import.meta.env.VITE_API_URL!;
const ADMIN_KEY  = import.meta.env.VITE_ADMIN_KEY!;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    // Always send the admin key so your /Gallery, /Products, etc. endpoints pass authenticateAdmin
    "x-admin-key": ADMIN_KEY,
  },
});

// Attach JWT automatically to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally: clear out credentials and redirect
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error(
        "Unauthorized. Clearing credentials and redirecting to login."
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
