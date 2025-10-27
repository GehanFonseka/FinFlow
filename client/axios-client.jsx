import axios from "axios";
import Cookies from "js-cookie";

const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const baseURL =
  import.meta.env.VITE_API_URL ||
  (isLocal
    ? "http://localhost:5000/api"
    : "https://finflow-rg-ea-ehdgehdpd7axchfn.eastasia-01.azurewebsites.net/api");

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("_auth");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosClient;
