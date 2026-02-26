// src/config/api.ts
export const API_BASE =
  (import.meta.env.VITE_API_URL ?? "http://localhost:4000") + "/api";

/**
 * Returns headers with Authorization Bearer token from localStorage.
 * Usage: fetch(url, { method: "POST", headers: authHeaders(), body: ... })
 */
export const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
