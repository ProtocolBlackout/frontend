import { useRef, useState } from "react";
import "./KontaktImpressum.css";

// API-Helper für Backend-Call
import { requestJson } from "../../services/api.js";

function KontaktImpressum() {
  const [tab, setTab] = useState("kontakt");

  // nur fürs UI (controlled inputs) + Backend-Call fürs Kontaktformular
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // UI-States fürs Formular-Feedback (loading/success/error)
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Refs für Fokus auf Success/Error (Barrierefreiheit)
  const successRef = useRef(null);
  const errorRef = useRef(null);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Submit-Handler: Form -> requestJson -> UI-Feedback
  async function onSubmit(e) {
    e.preventDefault();

    // Feedback zurücksetzen, damit alte Meldungen nicht stehen bleiben
    setSuccessMessage("");
    setErrorMessage("");

    // Minimale Client-Validierung (Backend validiert ohnehin auch)
    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name || !email || !subject || !message) {
      setErrorMessage("Bitte fülle alle Felder aus");
      // Fokus auf Fehlermeldung setzen (Keyboard/Screenreader)
      setTimeout(() => errorRef.current?.focus(), 0);

      return;
    }

    setIsSending(true);

    try {
      // Content-Type Header, damit Backend sicher JSON erkennt
      const data = await requestJson("/mail/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message
        })
      });

      // Success-Message aus Backend nutzen (Fallback, falls nötig)
      setSuccessMessage(data?.message || "Nachricht wurde gesendet");

      // Focus auf Success-Meldung setzen (Keyboard/Screenreader)
      setTimeout(() => successRef.current?.focus(), 0);

      // Formular leeren nach Erfolg
      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      // requestJson wirft Error(message) -> wir zeigen die Message an
      setErrorMessage(error?.message || "Unbekannter Fehler");

      // Fokus auf Fehlermeldung setzen (Keyboard/Screenreader)
      setTimeout(() => errorRef.current?.focus(), 0);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="ki">
      <section className="ki-console">
        <header className="ki-console__header">
          <span className="ki-console__title">KONTAKT_IMPRESSUM</span>
          <span className="ki-console__dots">● ● ●</span>
        </header>

        <div
          className="ki-tabs"
          role="tablist"
          aria-label="Kontakt und Impressum"
        >
          <button
            type="button"
            role="tab"
            // Tab-ARIA: eindeutige IDs + Verknüpfung mit Panel
            id="ki-tab-kontakt"
            aria-controls="ki-panel-kontakt"
            aria-selected={tab === "kontakt"}
            className={`ki-tab ${tab === "kontakt" ? "ki-tab--active" : ""}`}
            onClick={() => setTab("kontakt")}
          >
            Kontakt
          </button>

          <button
            type="button"
            role="tab"
            // Tab-ARIA: eindeutige IDs + Verknüpfung mit Panel
            id="ki-tab-impressum"
            aria-controls="ki-panel-impressum"
            aria-selected={tab === "impressum"}
            className={`ki-tab ${tab === "impressum" ? "ki-tab--active" : ""}`}
            onClick={() => setTab("impressum")}
          >
            Impressum
          </button>
        </div>

        <div className="ki-console__body">
          {tab === "kontakt" ? (
            <section
              role="tabpanel"
              className="ki-panel"
              // Tab-ARIA: Panel verknüpfen mit Tab
              id="ki-panel-kontakt"
              aria-labelledby="ki-tab-kontakt"
            >
              <p className="ki-lead">Schreib uns eine Nachricht.</p>

              <form
                className="ki-form"
                onSubmit={onSubmit}
                aria-busy={isSending}
                noValidate // [NEU] Browser-Validierung aus, wir zeigen eigenes UI-Feedback
              >
                <label className="ki-field">
                  <span className="ki-label">NAME</span>
                  <input
                    className="ki-input"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Dein Name"
                    autoComplete="name"
                    required
                    disabled={isSending}
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
                    required
                    disabled={isSending}
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
                    required
                    disabled={isSending}
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
                    required
                    disabled={isSending}
                  />
                </label>

                {/* UI-Feedback (success/error) */}
                {successMessage ? (
                  <p
                    className="ki-alert ki-alert--success"
                    role="status"
                    aria-live="polite"
                    // Fokusziel, damit wir per JS fokussieren können
                    tabIndex="-1"
                    ref={successRef}
                  >
                    {successMessage}
                  </p>
                ) : null}

                {errorMessage ? (
                  <p
                    className="ki-alert ki-alert--error"
                    role="alert"
                    aria-live="assertive"
                    // Fokusziel, damit wir per JS fokussieren können (A11y)
                    tabIndex="-1"
                    ref={errorRef}
                  >
                    {errorMessage}
                  </p>
                ) : null}

                <div className="ki-actions">
                  <button className="ki-btn" type="submit" disabled={isSending}>
                    {isSending ? "SENDE…" : "SENDEN"}
                  </button>

                  <p className="ki-hint">
                    {isSending
                      ? "Nachricht wird gesendet…"
                      : "Wir melden uns so schnell wie möglich."}
                  </p>
                </div>
              </form>
            </section>
          ) : (
            <section
              role="tabpanel"
              className="ki-panel"
              // Tab-ARIA: Panel verknüpfen mit Tab
              id="ki-panel-impressum"
              aria-labelledby="ki-tab-impressum"
            >
              <p className="ki-lead">Impressum</p>

              <div className="ki-impressum">
                <h2 className="ki-impressum__h">Angaben gemäß § 5 DDG</h2>
                <p className="ki-impressum__p">
                  Protocol Blackout HQ
                  <br />
                  Firewall Street 42
                  <br />
                  Vault Zone
                </p>

                <h2 className="ki-impressum__h">Kontakt</h2>
                <p className="ki-impressum__p">
                  E-Mail: prot.blackout@gmail.com
                  <br />
                  Telefon: +49 123 456789
                </p>

                <h2 className="ki-impressum__h">Vertreten durch</h2>
                <p className="ki-impressum__p">Darth Vader</p>

                <h2 className="ki-impressum__h">Haftungsausschluss</h2>
                <p className="ki-impressum__p">
                  Haftung für Inhalte Als Diensteanbieter sind wir gemäß § 7
                  Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den
                  allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind
                  wir als Diensteanbieter jedoch nicht verpflichtet,
                  übermittelte oder gespeicherte fremde Informationen zu
                  überwachen oder nach Umständen zu forschen, die auf eine
                  rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
                  Entfernung oder Sperrung der Nutzung von Informationen nach
                  den allgemeinen Gesetzen bleiben hiervon unberührt. Eine
                  diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
                  Kenntnis einer konkreten Rechtsverletzung möglich. Bei
                  Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
                  diese Inhalte umgehend entfernen. Haftung für Links Unser
                  Angebot enthält Links zu externen Websites Dritter, auf deren
                  Inhalte wir keinen Einfluss haben. Deshalb können wir für
                  diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                  Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                  oder Betreiber der Seiten verantwortlich. Die verlinkten
                  Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
                  Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
                  Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente
                  inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne
                  konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
                  Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
                  Links umgehend entfernen. Urheberrecht Die durch die
                  Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                  unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
                  Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb
                  der Grenzen des Urheberrechtes bedürfen der schriftlichen
                  Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads
                  und Kopien dieser Seite sind nur für den privaten, nicht
                  kommerziellen Gebrauch gestattet. Soweit die Inhalte auf
                  dieser Seite nicht vom Betreiber erstellt wurden, werden die
                  Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
                  Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf
                  eine Urheberrechtsverletzung aufmerksam werden, bitten wir um
                  einen entsprechenden Hinweis. Bei Bekanntwerden von
                  Rechtsverletzungen werden wir derartige Inhalte umgehend
                  entfernen.
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
