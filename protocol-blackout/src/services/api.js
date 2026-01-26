// Kleine API-Helfer
// - zentralisiert Base-URL + JSON-Handling
// - hängt bei Bedarf "Authorization: Bearer <token>" an

import { backendBaseUrl } from "../config/backend.js";

const TOKEN_KEY = "pbToken";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function requestJson(path, options = {}, needsAuth = false) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {})
  };

  if (needsAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${backendBaseUrl}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message ?? "Request fehlgeschlagen";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export { getToken, setToken, clearToken, requestJson };
