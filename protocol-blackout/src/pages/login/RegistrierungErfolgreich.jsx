import { Link } from "react-router-dom"; 
import "./LoginRegistrieren.css";

export default function RegistrationSuccess() {
  return (
    <section className="auth">
      <div className="auth-console">
        <header className="auth-console__header">
          <div className="auth-console__title">PROTOCOL BLACKOUT</div>
          <div className="auth-console__dots">● ● ●</div>
        </header>

        <div className="auth-console__body">
          <div className="auth-panel">
            <h2 className="auth-lead" style={{ color: "var(--cyan-neon)" }}>
              REGISTRIERUNG ERFOLGREICH
            </h2>
            <p className="auth-lead">
              Wir haben dir eine E-Mail gesendet. Bitte klicke auf den Link darin, 
              um deinen Account zu aktivieren.
            </p>

            <div className="auth-actions">
              {/* Link zurück zum Login */}
              <Link className="auth-btn" to="/login">
                ZUM LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
