// Zentrale Backend-Base-URL (aus Vite-ENV)
// Vorteil: Eine Quelle für alle API-Calls, später leicht für Deploy/ENV tauschbar
const backendBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export { backendBaseUrl };
