// src/api.ts
import axios from "axios";

const VITE_API_BASE = import.meta.env.VITE_API_BASE;

// API instance có gắn token (default export)
const api = axios.create({
  baseURL: VITE_API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API instance không gắn token (named export)
export const apiNoAuth = axios.create({
  baseURL: VITE_API_BASE,
});

export default api;