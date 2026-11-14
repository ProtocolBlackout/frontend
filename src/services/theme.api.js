import { requestJson } from "./api.js";

export function getProfile() {
  return requestJson("/auth/profile", { method: "GET" }, true);
}

export function updatePreferredTheme(preferredTheme) {
  return requestJson(
    "/auth/profile/theme",
    {
      method: "PATCH",
      body: JSON.stringify({ preferredTheme })
    },
    true
  );
}
