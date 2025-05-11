import { InternalAxiosRequestConfig } from "axios";
// src/Apis/apiService.ts
import axios, { AxiosError, AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8081",
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
});

// Attach admin key and JWT automatically
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const adminKey = localStorage.getItem("adminKey");
    if (adminKey && config.headers) {
      config.headers["x-admin-key"] = adminKey;
      console.log("Admin key header added:", adminKey);
    }

    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized. Clearing credentials and redirecting to login.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
