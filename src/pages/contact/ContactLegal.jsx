import { useRef, useState } from "react";
import styles from "./ContactLegal.module.css";
import { requestJson } from "../../services/api.js";

const ContactLegal = () => {
  const [tab, setTab] = useState("kontakt");

  // Controlled form inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // UI feedback states
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Refs for programmatic focus management (A11y)
  const successRef = useRef(null);
  const errorRef = useRef(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name || !email || !subject || !message) {
      setErrorMessage("Bitte fülle alle Felder aus");
      setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }

    setIsSending(true);

    try {
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

      setSuccessMessage(data?.message || "Nachricht wurde gesendet");
      setTimeout(() => successRef.current?.focus(), 0);

      // Reset form after successful submission
      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      setErrorMessage(error?.message || "Unbekannter Fehler");
      setTimeout(() => errorRef.current?.focus(), 0);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.console}>
        <header className={styles.consoleHeader}>
          <span className={styles.consoleTitle}>KONTAKT_IMPRESSUM</span>
          <span className={styles.consoleDots}>● ● ●</span>
        </header>

        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Kontakt und Impressum"
        >
          <button
            type="button"
            role="tab"
            id="ki-tab-kontakt"
            aria-controls="ki-panel-kontakt"
            aria-selected={tab === "kontakt"}
            className={`${styles.tab} ${
              tab === "kontakt" ? styles.tabActive : ""
            }`}
            onClick={() => setTab("kontakt")}
          >
            Kontakt
          </button>

          <button
            type="button"
            role="tab"
            id="ki-tab-impressum"
            aria-controls="ki-panel-impressum"
            aria-selected={tab === "impressum"}
            className={`${styles.tab} ${
              tab === "impressum" ? styles.tabActive : ""
            }`}
            onClick={() => setTab("impressum")}
          >
            Impressum
          </button>
        </div>

        <div className={styles.consoleBody}>
          {tab === "kontakt" ? (
            <section
              role="tabpanel"
              className={styles.panel}
              id="ki-panel-kontakt"
              aria-labelledby="ki-tab-kontakt"
            >
              <p className={styles.lead}>Schreib uns eine Nachricht.</p>

              <form
                className={styles.form}
                onSubmit={onSubmit}
                aria-busy={isSending}
                noValidate
              >
                <label className={styles.field}>
                  <span className={styles.label}>NAME</span>
                  <input
                    className={styles.input}
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Dein Name"
                    autoComplete="name"
                    required
                    disabled={isSending}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>E-MAIL</span>
                  <input
                    className={styles.input}
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

                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.label}>BETREFF</span>
                  <input
                    className={styles.input}
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                    placeholder="Worum geht’s?"
                    required
                    disabled={isSending}
                  />
                </label>

                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.label}>NACHRICHT</span>
                  <textarea
                    className={styles.textarea}
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    placeholder="Deine Nachricht …"
                    rows={6}
                    required
                    disabled={isSending}
                  />
                </label>

                {/* UI Feedback */}
                {successMessage ? (
                  <p
                    className={`${styles.alert} ${styles.alertSuccess}`}
                    role="status"
                    aria-live="polite"
                    tabIndex="-1"
                    ref={successRef}
                  >
                    {successMessage}
                  </p>
                ) : null}

                {errorMessage ? (
                  <p
                    className={`${styles.alert} ${styles.alertError}`}
                    role="alert"
                    aria-live="assertive"
                    tabIndex="-1"
                    ref={errorRef}
                  >
                    {errorMessage}
                  </p>
                ) : null}

                <div className={styles.actions}>
                  <button
                    className={styles.btn}
                    type="submit"
                    disabled={isSending}
                  >
                    {isSending ? "SENDE…" : "SENDEN"}
                  </button>

                  <p className={styles.hint}>
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
              className={styles.panel}
              id="ki-panel-impressum"
              aria-labelledby="ki-tab-impressum"
            >
              <p className={styles.lead}>Impressum</p>

              <div>
                <h2 className={styles.impressumHeading}>
                  Angaben gemäß § 5 DDG
                </h2>
                <p className={styles.impressumParagraph}>
                  Protocol Blackout HQ
                  <br />
                  Firewall Street 42
                  <br />
                  Vault Zone
                </p>

                <h2 className={styles.impressumHeading}>Kontakt</h2>
                <p className={styles.impressumParagraph}>
                  E-Mail: prot.blackout@gmail.com
                  <br />
                  Telefon: +49 123 456789
                </p>

                <h2 className={styles.impressumHeading}>Vertreten durch</h2>
                <p className={styles.impressumParagraph}>Darth Vader</p>

                <h2 className={styles.impressumHeading}>Haftungsausschluss</h2>
                <p className={styles.impressumParagraph}>
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
    </div>
  );
};

export default ContactLegal;
