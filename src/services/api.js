import axios from "axios";

// Configuration pour développement local uniquement
const baseURL = "http://localhost:3000/api";

console.log("API Base URL:", baseURL);
console.log("Environment: development local");

const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor to attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error - server might be down");
    }

    return Promise.reject(error);
  }
);

export default api;
