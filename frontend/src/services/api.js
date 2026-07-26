import axios from "axios";

const normalizeApiBase = (value) => {
  const raw = (value || "").trim();

  // default for local dev
  if (!raw) return "http://localhost:5000/api";

  // remove trailing slashes
  let base = raw.replace(/\/+$/, "");

  // allow either:
  // VITE_API_URL=https://your-backend.com
  // or
  // VITE_API_URL=https://your-backend.com/api
  if (!base.endsWith("/api")) base = `${base}/api`;

  return base;
};

const api = axios.create({
  baseURL: normalizeApiBase(import.meta.env.VITE_API_URL),
});

export default api;