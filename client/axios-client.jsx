import axios from "axios";
import Cookies from "js-cookie";
const axiosClient = axios.create({
  baseURL: `http://3.87.219.14:5000/api`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE", // Allow specific HTTP methods
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept", // Allow specific headers
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("_auth");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  }
);

export default axiosClient;
