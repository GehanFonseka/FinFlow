import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: `https://finflow-rg-ea-ehdgehdpd7axchfn.eastasia-01.azurewebsites.net/api`,
  headers: {
    "Content-Type": "application/json"
    // removed Access-Control-Allow-* headers — server must send these
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("_auth");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  }
);

export default axiosClient;
