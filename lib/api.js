import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.bitechx.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const state = localStorage.getItem("persist:root");
      if (state) {
        const parsedState = JSON.parse(state);
        const authState = JSON.parse(parsedState.auth || "{}");
        const token = authState.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:root");
        window.location.href = "/login";
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
