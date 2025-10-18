import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "https://api.bitechx.com";

// Helper to get token safely
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - MUST add token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Handle 400 - Usually means no token or invalid token
    if (status === 400 && message?.includes("Authorization")) {
      console.error("Authorization token missing or invalid");
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_email");
        window.location.href = "/login";
      }
    }

    // Handle 401 - Unauthorized
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_email");
        window.location.href = "/login";
      }
    }

    // Handle 429 - Rate limit
    if (status === 429) {
      if (typeof window !== "undefined") {
        toast.error("Too many requests. Please wait a moment.");
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email) => apiClient.post("/auth", { email }),
};

// Products API
export const productsAPI = {
  getAll: (params) => apiClient.get("/products", { params }),
  getBySlug: (slug) => apiClient.get(`/products/${slug}`),
  search: (searchedText) =>
    apiClient.get("/products/search", { params: { searchedText } }),
  create: (data) => apiClient.post("/products", data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: (params) => apiClient.get("/categories", { params }),
  search: (searchedText) =>
    apiClient.get("/categories/search", { params: { searchedText } }),
};

export default apiClient;
