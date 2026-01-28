import { useState } from "react";
import "./LoginRegistrieren.css";
import { useNavigate } from "react-router-dom";

// === API-Helper nutzen (Base-URL + JSON + Token) ===
import { requestJson, setToken } from "../../services/api.js";

function LoginRegister() {
  const [tab, setTab] = useState("login");
  const navigate = useNavigate();

  // nur UI-State (ohne Backend)
  // === Form-State ===
  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  // === Status für Requests ===
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function onLoginChange(e) {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  }

  function onRegisterChange(e) {
    const { name, value } = e.target;
    setRegister((prev) => ({ ...prev, [name]: value }));
  }

  // === Login-Submit (POST /auth/login) ===
  // Backend-Response: { message, token, user }
  async function handleLoginSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const data = await requestJson(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(login)
        },
        false
      );

      // FAKT: Token kommt als "token"
      if (!data?.token) {
        setError(
          "Login erfolgreich, aber Token fehlt in der Antwort vom Server."
        );
        return;
      }

      setToken(data.token);

      setMessage(data.message ?? "Login erfolgreich");
      navigate("/profil", { replace: true });
    } catch (err) {
      setError(err?.message ?? "Login fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  }

  // === Register-Submit (POST /auth/register) ===
  // Backend-Response: { message, user } (kein Token)
  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    // Front-Check
    if (register.password !== register.passwordConfirm) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        username: register.username,
        email: register.email,
        password: register.password
      };

      const data = await requestJson(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(payload)
        },
        false
      );

      const baseMessage = data.message ?? "Registrierung erfolgreich";
      setMessage(
        `${baseMessage} Bitte E-Mail verifizieren und dann einloggen.`
      );

      // UX: Nach Registrierung auf Login wechseln
      setTab("login");

      // === NEU: Registrierungsformular leeren ===
      setRegister({
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
      });
      // ==========================================
    } catch (err) {
      setError(err?.message ?? "Registrierung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth">
      <section className="auth-console">
        <header className="auth-console__header">
          <span className="auth-console__title">AUTH_TERMINAL</span>
          <span className="auth-console__dots">● ● ●</span>
        </header>

        <div
          className="auth-tabs"
          role="tablist"
          aria-label="Login oder Registrieren"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "login"}
            className={`auth-tab ${tab === "login" ? "auth-tab--active" : ""}`}
            disabled={isLoading}
            onClick={() => setTab("login")}
          >
            Login
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === "register"}
            className={`auth-tab ${tab === "register" ? "auth-tab--active" : ""}`}
            disabled={isLoading}
            onClick={() => setTab("register")}
          >
            Registrieren
          </button>
        </div>

        <div className="auth-console__body">
          {tab === "login" ? (
            <section role="tabpanel" className="auth-panel">
              <p className="auth-lead">
                Bitte anmelden. (Login funktioniert nur nach
                E-Mail-Verifizierung.)
              </p>

              {/* === NEU: Statusausgabe (Fehler/Erfolg) === */}
              {error ? <p className="auth-hint">{error}</p> : null}
              {message ? <p className="auth-hint">{message}</p> : null}

              {/* === GEÄNDERT: echter Submit-Handler (Login) === */}
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <label className="auth-field auth-field--full">
                  <span className="auth-label">E-MAIL</span>
                  <input
                    className="auth-input"
                    name="email"
                    type="email"
                    value={login.email}
                    onChange={onLoginChange}
                    placeholder="dein.name@mail.de"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="auth-field auth-field--full">
                  <span className="auth-label">PASSWORT</span>
                  <input
                    className="auth-input"
                    name="password"
                    type="password"
                    value={login.password}
                    onChange={onLoginChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </label>

                <div className="auth-actions">
                  {/* === GEÄNDERT: submit statt button === */}
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "ANMELDEN"}
                  </button>
                  {/* === GEÄNDERT: Hint nicht mehr "Kein Backend angeschlossen"
                  === */}
                  <p className="auth-hint">
                    {isLoading ? "Bitte warten..." : "Backend verbunden."}
                  </p>
                </div>
              </form>
            </section>
          ) : (
            <section role="tabpanel" className="auth-panel">
              {/* === GEÄNDERT: Text nicht mehr "Nur Design – Verbindung kommt später." === */}
              <p className="auth-lead">Neues Konto erstellen.</p>

              {/* === NEU: Statusausgabe (Fehler/Erfolg) === */}
              {error ? <p className="auth-hint">{error}</p> : null}
              {message ? <p className="auth-hint">{message}</p> : null}

              {/* === GEÄNDERT: echter Submit-Handler (Register) === */}
              <form
                className="auth-form"
                onSubmit={handleRegisterSubmit}
                method="post"
              >
                <label className="auth-field">
                  <span className="auth-label">BENUTZERNAME</span>
                  <input
                    className="auth-input"
                    name="username"
                    value={register.username}
                    onChange={onRegisterChange}
                    placeholder="username"
                    autoComplete="username"
                    required
                  />
                </label>

                <label className="auth-field">
                  <span className="auth-label">E-MAIL</span>
                  <input
                    className="auth-input"
                    name="email"
                    type="email"
                    value={register.email}
                    onChange={onRegisterChange}
                    placeholder="dein.name@mail.de"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="auth-field auth-field--full">
                  <span className="auth-label">PASSWORT</span>
                  <input
                    className="auth-input"
                    name="password"
                    type="password"
                    value={register.password}
                    onChange={onRegisterChange}
                    placeholder="Neues Passwort"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label className="auth-field auth-field--full">
                  <span className="auth-label">PASSWORT BESTÄTIGEN</span>
                  <input
                    className="auth-input"
                    name="passwordConfirm"
                    type="password"
                    value={register.passwordConfirm}
                    onChange={onRegisterChange}
                    placeholder="Nochmal eingeben"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <div className="auth-actions">
                  {/* === GEÄNDERT: submit statt button === */}
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "REGISTRIEREN"}
                  </button>

                  {/* === GEÄNDERT: Hint nicht mehr "Kein Backend angeschlossen." === */}
                  <p className="auth-hint">
                    {isLoading
                      ? "Bitte warten..."
                      : "Nach Registrierung bitte Mail verifizieren."}
                  </p>
                </div>
              </form>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

export default LoginRegister;
