// apiClient.js
import axios from "axios";

// live "https://tailor-backend-1.onrender.com/api"
//dev "http://localhost:3000/api"
// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://tailor-backend-1.onrender.com/api", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
