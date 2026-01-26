import { Link } from "react-router-dom";
import "./LoginRegistrieren.css";

export default function PasswordResetSuccess() {
  return (
    <section className="auth">
      <div className="auth-console">
        <header className="auth-console__header">
          <div className="auth-console__title">SYSTEM MESSAGE</div>
          <div className="auth-console__dots">● ● ●</div>
        </header>

        <div className="auth-console__body">
          <div className="auth-panel">
            <h2 className="auth-lead" style={{ color: "var(--cyan-neon)" }}>
              PASSWORT GEÄNDERT
            </h2>
            <p className="auth-lead">
              Dein Passwort wurde erfolgreich neu gesetzt. Du kannst dich jetzt einloggen.
            </p>

            <div className="auth-actions">
              <Link className="auth-btn" to="/login">
                JETZT ANMELDEN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
