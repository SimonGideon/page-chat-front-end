import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token to every request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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

// Response interceptor - just pass through errors to be handled by Redux
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let the Redux slices handle error responses
    return Promise.reject(error);
  }
);

export default axiosInstance;
