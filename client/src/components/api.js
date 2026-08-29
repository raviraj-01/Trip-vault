import axios from "axios";

export const TOKEN_KEY = "tripvault_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getApiError = (error, fallback) =>
  error.response?.data?.message || fallback;

const api = axios.create({ baseURL: "http://localhost:5000" });

api.interceptors.request.use((config) => {
  if (config.skipAuth) return config;

  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuth) clearToken();
    return Promise.reject(error);
  }
);

export default api;
