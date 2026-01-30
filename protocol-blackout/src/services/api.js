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
  // =======================================================
  let response;

  try {
    response = await fetch(`${backendBaseUrl}${path}`, {
      ...options,
      headers
    });
  } catch (err) {
    // Netzwerk/Cold-Start (render): Fetch kann komplett fehlschlagen (kein HTTP-Status vorhanden)
    const error = new Error(
      "Netzwerkfehler - Server nicht erreichbar (ggf. Render Cold Start)"
    );
    error.cause = err;
    throw error;
  }

  const contentType = response.headers.get("content-type") ?? "";

  let data = {};
  let rawText = "";

  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => ({}));
  } else {
    // Manchmal kommt HTML/Text statt JSON (z.B. bei Server-/Plattformfehlern)
    rawText = await response.text().catch(() => "");
  }

  if (!response.ok) {
    if (needsAuth && response.status === 401) {
      clearToken();
      window.location.href = "/login";

      const error = new Error("Nicht autorisiert");
      error.status = 401;
      error.data = data;
      throw error;
    }

    const fallbackMessage =
      response.status >= 500
        ? `Serverfehler (HTTP ${response.status}) - ggf. Render Cold Start`
        : `Request fehlgeschlagen (HTTP ${response.status})`;

    const textMessage =
      rawText && !rawText.trim().startsWith("<")
        ? rawText.trim().slice(0, 140)
        : "";

    const message = data?.message || textMessage || fallbackMessage;

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export { getToken, setToken, clearToken, requestJson };
