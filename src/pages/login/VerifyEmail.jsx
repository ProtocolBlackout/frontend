import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./Auth.module.css";
import { requestJson } from "../../services/api.js";

const VerifyEmail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  // UI status
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!token) {
      if (!isDone) {
        setError("Token fehlt.");
      }
      return;
    }

    let isMounted = true;

    const verify = async () => {
      setError("");
      setMessage("");
      setIsLoading(true);

      try {
        const data = await requestJson(
          `/auth/verify-email?token=${encodeURIComponent(token)}`,
          { method: "GET" },
          false
        );

        if (!isMounted) return;
        setMessage(data?.message ?? "E-Mail erfolgreich verifiziert");
        setIsDone(true);
        // Clear token from search params without full page reload
        setSearchParams({}, { replace: true });
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message ?? "Fehler bei der Verifizierung.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, isDone, setSearchParams]);

  return (
    <div className={styles.auth}>
      <section className={styles.authConsole}>
        <header className={styles.authConsoleHeader}>
          <span className={styles.authConsoleTitle}>SYSTEM // VERIFY_EMAIL</span>
          <span className={styles.authConsoleDots}>● ● ●</span>
        </header>

        <div className={styles.authConsoleBody}>
          <section className={styles.authPanel}>
            <p className={styles.authLead}>
              {isDone
                ? "Deine E-Mail wurde verifiziert."
                : error
                  ? "Verifizierung fehlgeschlagen."
                  : "Wir verifizieren gerade deine E-Mail..."}
            </p>

            {isLoading ? (
              <p className={styles.authHint}>Verifizierung läuft...</p>
            ) : null}
            {error ? <p className={styles.authHint}>{error}</p> : null}
            {message ? <p className={styles.authHint}>{message}</p> : null}

            <div className={styles.authActions}>
              <Link to="/login" className={styles.authLink}>
                Zurück zum Login
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default VerifyEmail;
