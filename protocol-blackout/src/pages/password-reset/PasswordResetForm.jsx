import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Wir nutzen das bestehende Auth-Layout/CSS vom Login
import "../login/LoginRegistrieren.css";

// Zentraler API-Helper (Base-URL + JSON + Fehlerhandling)
import { requestJson } from "../../services/api.js";

function PasswordResetForm() {
  const [email, setEmail] = useState("");

  // Token aus der URL (confirm-Mode) oder leer (request-Mode)
  const [token, setToken] = useState("");

  // Felder für "neues Passwort setzen"
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  // UI-Status
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Wenn true: Erfolgsscreen nach "Passwort setzen"
  const [isDone, setIsDone] = useState(false);

  // Token aus URL lesen: /password-reset?token=...
  // Hinweis: Wenn Token vorhanden ist, sind wir im Confirm-Flow (neues Passwort setzen).
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken ?? "");
    setIsDone(false);
  }, []);

  // Passwort-Reset-Link anfordern (Mail wird verschickt, wenn der User existiert)
  async function handleRequestLink(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const data = await requestJson(
        "/auth/password-reset/request",
        {
          method: "POST",
          body: JSON.stringify({ email: email.trim() })
        },
        false
      );

      // Backend gibt immer die gleiche Erfolgsmeldung zurück (keine E-Mail-Enumeration)
      setMessage(
        data?.message ??
          "Wenn ein Account mit dieser E-Mail existiert, wurde ein Link gesendet."
      );
      setEmail("");
    } catch (err) {
      setError(err?.message ?? "Fehler beim Anfordern des Links.");
    } finally {
      setIsLoading(false);
    }
  }

  // Passwort-Reset bestätigen (Token + neues Passwort an Backend)
  async function handleConfirmReset(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== passwordRepeat) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setIsLoading(true);

    try {
      await requestJson(
        "/auth/password-reset/confirm",
        {
          method: "POST",
          body: JSON.stringify({ token, password })
        },
        false
      );

      setPassword("");
      setPasswordRepeat("");
      setIsDone(true);

      // Token aus der URL entfernen, damit man nicht versehentlich erneut bestätigt
      window.history.replaceState(null, "", "/password-reset");
      setToken("");
    } catch (err) {
      setError(err?.message ?? "Fehler beim Zurücksetzen des Passworts.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth">
      <section className="auth-console">
        <header className="auth-console__header">
          <span className="auth-console__title">SYSTEM // PASSWORD_RESET</span>
          <span className="auth-console__dots">● ● ●</span>
        </header>

        <div className="auth-console__body">
          <section className="auth-panel">
            <p className="auth-lead">
              {isDone
                ? "Passwort wurde erfolgreich gesetzt."
                : token
                  ? "Setze jetzt ein neues Passwort."
                  : "Gib deine E-Mail-Adresse ein, um das Passwort zurückzusetzen."}
            </p>

            {/* Statusausgabe */}
            {error ? <p className="auth-hint">{error}</p> : null}
            {message ? <p className="auth-hint">{message}</p> : null}

            {/* Erfolgsscreen */}
            {isDone ? (
              <div className="auth-actions">
                <Link to="/login" className="auth-link">
                  Jetzt einloggen
                </Link>
              </div>
            ) : null}

            {/* Request-Mode: Link anfordern */}
            {!isDone && !token ? (
              <form className="auth-form" onSubmit={handleRequestLink}>
                <label className="auth-field auth-field--full">
                  <span className="auth-label">E-MAIL</span>
                  <input
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <div className="auth-actions">
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "LINK ANFORDERN"}
                  </button>

                  <Link to="/login" className="auth-link retroBtn auth-forgotBtn">
                    Zurück zum Login
                  </Link>
                </div>
              </form>
            ) : null}

            {/* Confirm-Mode: neues Passwort setzen */}
            {!isDone && token ? (
              <form className="auth-form" onSubmit={handleConfirmReset}>
                <label className="auth-field auth-field--full">
                  <span className="auth-label">NEUES PASSWORT</span>
                  <input
                    className="auth-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label className="auth-field auth-field--full">
                  <span className="auth-label">PASSWORT WIEDERHOLEN</span>
                  <input
                    className="auth-input"
                    type="password"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </label>

                <div className="auth-actions">
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "PASSWORT SETZEN"}
                  </button>

                  <Link to="/login" className="auth-link">
                    Zurück zum Login
                  </Link>
                </div>
              </form>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
}

export default PasswordResetForm;
