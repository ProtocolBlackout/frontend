import { useState } from "react";
import "./LoginRegistrieren.css";

function LoginRegister() {
  const [tab, setTab] = useState("login");

  // nur UI-State (ohne Backend)
  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  function onLoginChange(e) {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  }

  function onRegisterChange(e) {
    const { name, value } = e.target;
    setRegister((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <main className="auth">
      <section className="auth-console">
        <header className="auth-console__header">
          <span className="auth-console__title">AUTH_TERMINAL</span>
          <span className="auth-console__dots">● ● ●</span>
        </header>

        <div className="auth-tabs" role="tablist" aria-label="Login oder Registrieren">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "login"}
            className={`auth-tab ${tab === "login" ? "auth-tab--active" : ""}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === "register"}
            className={`auth-tab ${tab === "register" ? "auth-tab--active" : ""}`}
            onClick={() => setTab("register")}
          >
            Registrieren
          </button>
        </div>

        <div className="auth-console__body">
          {tab === "login" ? (
            <section role="tabpanel" className="auth-panel">
              <p className="auth-lead">
                Bitte anmelden. (Nur Design – Verbindung kommt später.)
              </p>

              <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <label className="auth-field auth-field--full">
                  <span className="auth-label">E-MAIL</span>
                  <input
                    className="auth-input"
                    name="email"
                    type="email"
                    value={login.email}
                    onChange={onLoginChange}
                    placeholder="dein.name@mail.de"
                    autoComplete="username"
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
                  />
                </label>

                <div className="auth-actions">
                  <button className="auth-btn" type="button">
                    ANMELDEN
                  </button>
                  <p className="auth-hint">Kein Backend angeschlossen.</p>
                </div>
              </form>
            </section>
          ) : (
            <section role="tabpanel" className="auth-panel">
              <p className="auth-lead">
                Neues Konto erstellen. (Nur Design – Verbindung kommt später.)
              </p>

              <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <label className="auth-field">
                  <span className="auth-label">BENUTZERNAME</span>
                  <input
                    className="auth-input"
                    name="username"
                    value={register.username}
                    onChange={onRegisterChange}
                    placeholder="username"
                    autoComplete="username"
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
                  />
                </label>

                <div className="auth-actions">
                  <button className="auth-btn" type="button">
                    REGISTRIEREN
                  </button>
                  <p className="auth-hint">Kein Backend angeschlossen.</p>
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
