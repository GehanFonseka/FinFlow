import axios from "axios";
import Cookies from "js-cookie";

// Detect environment
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// Set the base URL depending on environment
const baseURL = import.meta.env.VITE_API_URL || (
  isLocal
    ? "http://localhost:5000/api"
    : "https://finflow-rg-ea-ehdgehdpd7axchfn.eastasia-01.azurewebsites.net/api"
);

// Create Axios instance
const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ⚡ ensures cookies are sent cross-origin
});

// Add Authorization header if token exists
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("_auth");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for logging errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "Axios Error Response:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("Axios Network/Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
