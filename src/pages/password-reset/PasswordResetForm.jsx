import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "../login/Auth.module.css";
import { requestJson } from "../../services/api.js";

const PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  // Password fields for "set new password"
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  // UI status
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Request password reset link (email is sent if the account exists)
  const handleRequestLink = async (e) => {
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
  };

  // Confirm password reset (token + new password sent to backend)
  const handleConfirmReset = async (e) => {
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
      // Clear token from search params without full page reload
      setSearchParams({}, { replace: true });
    } catch (err) {
      setError(err?.message ?? "Fehler beim Zurücksetzen des Passworts.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.auth}>
      <section className={styles.authConsole}>
        <header className={styles.authConsoleHeader}>
          <span className={styles.authConsoleTitle}>SYSTEM // PASSWORD_RESET</span>
          <span className={styles.authConsoleDots}>● ● ●</span>
        </header>

        <div className={styles.authConsoleBody}>
          <section className={styles.authPanel}>
            <p className={styles.authLead}>
              {isDone
                ? "Passwort wurde erfolgreich gesetzt."
                : token
                  ? "Setze jetzt ein neues Passwort."
                  : "Gib deine E-Mail-Adresse ein, um das Passwort zurückzusetzen."}
            </p>

            {error ? <p className={styles.authHint}>{error}</p> : null}
            {message ? <p className={styles.authHint}>{message}</p> : null}

            {isDone ? (
              <div className={styles.authActions}>
                <Link to="/login" className={styles.authLink}>
                  Jetzt einloggen
                </Link>
              </div>
            ) : null}

            {!isDone && !token ? (
              <form className={styles.authForm} onSubmit={handleRequestLink}>
                <label className={`${styles.authField} ${styles.authFieldFull}`}>
                  <span className={styles.authLabel}>E-MAIL</span>
                  <input
                    className={styles.authInput}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <div className={styles.authActions}>
                  <button
                    className={styles.authBtn}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "LINK ANFORDERN"}
                  </button>

                  <Link
                    to="/login"
                    className={`${styles.authLink} ${styles.authForgotBtn}`}
                  >
                    Zurück zum Login
                  </Link>
                </div>
              </form>
            ) : null}

            {!isDone && token ? (
              <form className={styles.authForm} onSubmit={handleConfirmReset}>
                <label className={`${styles.authField} ${styles.authFieldFull}`}>
                  <span className={styles.authLabel}>NEUES PASSWORT</span>
                  <input
                    className={styles.authInput}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label className={`${styles.authField} ${styles.authFieldFull}`}>
                  <span className={styles.authLabel}>PASSWORT WIEDERHOLEN</span>
                  <input
                    className={styles.authInput}
                    type="password"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
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
                    {isLoading ? "..." : "PASSWORT SETZEN"}
                  </button>

                  <Link to="/login" className={styles.authLink}>
                    Zurück zum Login
                  </Link>
                </div>
              </form>
            ) : null}
          </section>
        </div>
      </section>
    </div>
  );
};

export default PasswordResetForm;
