import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import { requestJson, setToken } from "../../services/api.js";

const PENDING_RESULT_KEY = "pbPendingGameResult";

const AuthPage = () => {
  const [tab, setTab] = useState("login");
  const navigate = useNavigate();

  // Form states
  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  // Request status
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const onRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegister((prev) => ({ ...prev, [name]: value }));
  };

  const submitPendingGameResult = async () => {
    const raw = sessionStorage.getItem(PENDING_RESULT_KEY);
    if (!raw) return;

    let pending = null;

    try {
      pending = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(PENDING_RESULT_KEY);
      return;
    }

    const scoreNumber = Number(pending?.score);
    const createdAt = Number(pending?.createdAt);

    if (!Number.isFinite(scoreNumber) || scoreNumber < 0) {
      sessionStorage.removeItem(PENDING_RESULT_KEY);
      return;
    }

    // Discard pending results older than 1 hour
    if (Number.isFinite(createdAt) && Date.now() - createdAt > 60 * 60 * 1000) {
      sessionStorage.removeItem(PENDING_RESULT_KEY);
      return;
    }

    let path = "";
    if (pending?.gameId === "quiz" || pending?.gameId === "quiz-01") {
      path = "/games/quiz/result";
    }
    if (pending?.gameId === "cracker") {
      path = "/games/cracker/result";
    }

    if (!path) {
      sessionStorage.removeItem(PENDING_RESULT_KEY);
      return;
    }

    try {
      await requestJson(
        path,
        {
          method: "POST",
          body: JSON.stringify({ score: scoreNumber })
        },
        true
      );
      sessionStorage.removeItem(PENDING_RESULT_KEY);
    } catch (err) {
      console.warn("Could not save pending game result after login:", err?.message);
    }
  };

  const handleLoginSubmit = async (e) => {
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

      if (!data?.token) {
        setError("Login erfolgreich, aber Token fehlt in der Antwort vom Server.");
        return;
      }

      setToken(data.token);
      await submitPendingGameResult();

      setMessage(data.message ?? "Login erfolgreich");
      navigate("/profil", { replace: true });
    } catch (err) {
      setError(err?.message ?? "Login fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

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
      setMessage(`${baseMessage} Bitte E-Mail verifizieren und dann einloggen.`);
      setTab("login");
      setRegister({
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
      });
    } catch (err) {
      setError(err?.message ?? "Registrierung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.auth}>
      <section className={styles.authConsole}>
        <header className={styles.authConsoleHeader}>
          <span className={styles.authConsoleTitle}>AUTH_TERMINAL</span>
          <span className={styles.authConsoleDots}>● ● ●</span>
        </header>

        <div
          className={styles.authTabs}
          role="tablist"
          aria-label="Login oder Registrieren"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "login"}
            className={`${styles.authTab} ${tab === "login" ? styles.authTabActive : ""}`}
            disabled={isLoading}
            onClick={() => {
              setTab("login");
              setError("");
              setMessage("");
            }}
          >
            Login
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === "register"}
            className={`${styles.authTab} ${tab === "register" ? styles.authTabActive : ""}`}
            disabled={isLoading}
            onClick={() => {
              setTab("register");
              setError("");
              setMessage("");
            }}
          >
            Registrieren
          </button>
        </div>

        <div className={styles.authConsoleBody}>
          {tab === "login" ? (
            <section role="tabpanel" className={styles.authPanel}>
              <p className={styles.authLead}>
                Bitte anmelden. (Login funktioniert nur nach
                E-Mail-Verifizierung.)
              </p>

              {error ? <p className={styles.authHint}>{error}</p> : null}
              {message ? <p className={styles.authHint}>{message}</p> : null}

              <form className={styles.authForm} onSubmit={handleLoginSubmit}>
                <label className={`${styles.authField} ${styles.authFieldFull}`}>
                  <span className={styles.authLabel}>E-MAIL</span>
                  <input
                    className={styles.authInput}
                    name="email"
                    type="email"
                    value={login.email}
                    onChange={onLoginChange}
                    placeholder="dein.name@mail.de"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className={`${styles.authField} ${styles.authFieldFull}`}>
                  <span className={styles.authLabel}>PASSWORT</span>
                  <input
                    className={styles.authInput}
                    name="password"
                    type="password"
                    value={login.password}
                    onChange={onLoginChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </label>

                <div className={styles.authActions}>
                  <button
                    className={styles.authBtn}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "ANMELDEN"}
                  </button>

                  <p className={styles.authHint}>
                    {isLoading ? "Bitte warten..." : " "}
                  </p>

                  <Link
                    to="/password-reset"
                    className={`${styles.authLink} ${styles.authForgotBtn}`}
                  >
                    Passwort vergessen?
                  </Link>
                </div>
              </form>
            </section>
          ) : (
            <section role="tabpanel" className={styles.authPanel}>
              <p className={styles.authLead}>Neues Konto erstellen.</p>

              {error ? <p className={styles.authHint}>{error}</p> : null}
              {message ? <p className={styles.authHint}>{message}</p> : null}

              <form className={styles.authForm} onSubmit={handleRegisterSubmit}>
                <label className={styles.authField}>
                  <span className={styles.authLabel}>BENUTZERNAME</span>
                  <input
                    className={styles.authInput}
                    name="username"
                    value={register.username}
                    onChange={onRegisterChange}
                    placeholder="username"
                    autoComplete="username"
                    required
                  />
                </label>

                <label className={styles.authField}>
                  <span className={styles.authLabel}>E-MAIL</span>
                  <input
                    className={styles.authInput}
                    name="email"
                    type="email"
                    value={register.email}
                    onChange={onRegisterChange}
                    placeholder="dein.name@mail.de"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className={`${styles.authField} ${styles.authFieldFull}`}>
                  <span className={styles.authLabel}>PASSWORT</span>
                  <input
                    className={styles.authInput}
                    name="password"
                    type="password"
                    value={register.password}
                    onChange={onRegisterChange}
                    placeholder="Neues Passwort"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label className={`${styles.authField} ${styles.authFieldFull}`}>
                  <span className={styles.authLabel}>PASSWORT BESTÄTIGEN</span>
                  <input
                    className={styles.authInput}
                    name="passwordConfirm"
                    type="password"
                    value={register.passwordConfirm}
                    onChange={onRegisterChange}
                    placeholder="Nochmal eingeben"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <div className={styles.authActions}>
                  <button
                    className={styles.authBtn}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "REGISTRIEREN"}
                  </button>

                  <p className={styles.authHint}>
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
    </div>
  );
};

export default AuthPage;
