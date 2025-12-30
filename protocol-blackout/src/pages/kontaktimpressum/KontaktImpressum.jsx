import { useState } from "react";
import "./KontaktImpressum.css";

function KontaktImpressum() {
  const [tab, setTab] = useState("kontakt");

  // nur fürs UI (controlled inputs), keine Verlinkung / kein Backend
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <main className="ki">
      <section className="ki-console">
        <header className="ki-console__header">
          <span className="ki-console__title">KONTAKT_IMPRESSUM</span>
          <span className="ki-console__dots">● ● ●</span>
        </header>

        <div className="ki-tabs" role="tablist" aria-label="Kontakt und Impressum">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "kontakt"}
            className={`ki-tab ${tab === "kontakt" ? "ki-tab--active" : ""}`}
            onClick={() => setTab("kontakt")}
          >
            Kontakt
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === "impressum"}
            className={`ki-tab ${tab === "impressum" ? "ki-tab--active" : ""}`}
            onClick={() => setTab("impressum")}
          >
            Impressum
          </button>
        </div>

        <div className="ki-console__body">
          {tab === "kontakt" ? (
            <section role="tabpanel" className="ki-panel">
              <p className="ki-lead">
                Schreib uns eine Nachricht. (Nur Design – Verbindung kommt später.)
              </p>

              <form className="ki-form" onSubmit={(e) => e.preventDefault()}>
                <label className="ki-field">
                  <span className="ki-label">NAME</span>
                  <input
                    className="ki-input"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Dein Name"
                    autoComplete="name"
                  />
                </label>

                <label className="ki-field">
                  <span className="ki-label">E-MAIL</span>
                  <input
                    className="ki-input"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="dein.name@mail.de"
                    autoComplete="email"
                  />
                </label>

                <label className="ki-field ki-field--full">
                  <span className="ki-label">BETREFF</span>
                  <input
                    className="ki-input"
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    placeholder="Worum geht’s?"
                  />
                </label>

                <label className="ki-field ki-field--full">
                  <span className="ki-label">NACHRICHT</span>
                  <textarea
                    className="ki-textarea"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    placeholder="Deine Nachricht …"
                    rows={6}
                  />
                </label>

                <div className="ki-actions">
                  <button className="ki-btn" type="button">
                    SENDEN
                  </button>

                  <p className="ki-hint">
                    UI steht – Versand/Backend-Call kommt später.
                  </p>
                </div>
              </form>
            </section>
          ) : (
            <section role="tabpanel" className="ki-panel">
              <p className="ki-lead">
                Impressum (Platzhalter) – später durch echte Daten ersetzen.
              </p>

              <div className="ki-impressum">
                <h2 className="ki-impressum__h">Angaben gemäß § 5 TMG</h2>
                <p className="ki-impressum__p">
                  Protocol Blackout<br />
                  Musterstraße 12<br />
                  12345 Musterstadt
                </p>

                <h2 className="ki-impressum__h">Kontakt</h2>
                <p className="ki-impressum__p">
                  E-Mail: kontakt@deine-domain.de<br />
                  Telefon: +49 000 000000
                </p>

                <h2 className="ki-impressum__h">Vertreten durch</h2>
                <p className="ki-impressum__p">Vorname Nachname</p>

                <h2 className="ki-impressum__h">Haftungshinweis</h2>
                <p className="ki-impressum__p">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
                  risus at odio gravida interdum.
                </p>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

export default KontaktImpressum;
