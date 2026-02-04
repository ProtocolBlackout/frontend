import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Wir nutzen das bestehende Auth-Layout/CSS vom Login
import "./LoginRegistrieren.css";

// Zentraler API-Helper (Base-URL + JSON + Fehlerhandling)
import { requestJson } from "../../services/api.js";

function VerifyEmail() {
  const [token, setToken] = useState("");

  // UI-Status
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Token aus URL lesen: /auth/verify-email?token=...
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken ?? "");
    setIsDone(false);
  }, []);

  // Wenn Token vorhanden ist: Backend-Verifizierung ausführen
  useEffect(() => {
    async function verify() {
      if (!token) {
        // Wenn wir gerade erfolgreich waren, ist "Token fehlt" nach dem URL-Cleanup normal
        if (isDone) {
          return;
        }

        setError("Token fehlt.");
        return;
      }

      setError("");
      setMessage("");
      setIsLoading(true);

      try {
        const data = await requestJson(
          `/auth/verify-email?token=${encodeURIComponent(token)}`,
          {
            method: "GET"
          },
          false
        );

        setMessage(data?.message ?? "E-Mail erfolgreich verifiziert");
        setIsDone(true);

        // Token aus der URL entfernen, damit man nicht versehentlich erneut verifiziert
        window.history.replaceState(null, "", "/auth/verify-email");
        setToken("");
      } catch (err) {
        setError(err?.message ?? "Fehler bei der Verifizierung.");
      } finally {
        setIsLoading(false);
      }
    }

    verify();
  }, [token, isDone]);

  return (
    <main className="auth">
      <section className="auth-console">
        <header className="auth-console__header">
          <span className="auth-console__title">SYSTEM // VERIFY_EMAIL</span>
          <span className="auth-console__dots">● ● ●</span>
        </header>

        <div className="auth-console__body">
          <section className="auth-panel">
            <p className="auth-lead">
              {isDone
                ? "Deine E-Mail wurde verifiziert."
                : error
                  ? "Verifizierung fehlgeschlagen."
                  : "Wir verifizieren gerade deine E-Mail..."}
            </p>

            {isLoading ? (
              <p className="auth-hint">Verifizierung läuft...</p>
            ) : null}
            {error ? <p className="auth-hint">{error}</p> : null}
            {message ? <p className="auth-hint">{message}</p> : null}

            <div className="auth-actions">
              <Link to="/login" className="auth-link">
                Zurück zum Login
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default VerifyEmail;
