import axios from "axios";

const isDev = import.meta.env.MODE === "production";

const api = axios.create({
  baseURL: isDev
    ? import.meta.env.VITE_LOCAL_HOST
    : import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
