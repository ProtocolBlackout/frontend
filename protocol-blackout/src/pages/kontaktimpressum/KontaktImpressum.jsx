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
                Impressum
              </p>

              <div className="ki-impressum">
                <h2 className="ki-impressum__h">Angaben gemäß § 5 DDG</h2>
                <p className="ki-impressum__p">
                  Protocol Blackout HQ<br />
                  Firewall Street 42<br />
                  Vault Zone
                </p>

                <h2 className="ki-impressum__h">Kontakt</h2>
                <p className="ki-impressum__p">
                  E-Mail: prot.blackout@gmail.com<br />
                  Telefon: +49 123 456789
                </p>

                <h2 className="ki-impressum__h">Vertreten durch</h2>
                <p className="ki-impressum__p">Darth Vader</p>

                <h2 className="ki-impressum__h">Haftungsausschluss</h2>
                <p className="ki-impressum__p">
                  Haftung für Inhalte
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.

                  Haftung für Links
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.

                  Urheberrecht
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
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
