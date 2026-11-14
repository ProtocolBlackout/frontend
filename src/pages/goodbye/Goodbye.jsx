import { Link } from "react-router-dom";
import styles from "./Goodbye.module.css";
import Button from "../../components/button"

const PromptLine = ({ children }) => {
  return (
    <div className={styles.line}>
      <span className={styles.prompt}>protocol-blackout@client</span>
      <span className={styles.path}>:~$</span>
      <span className={styles.cmd}>{children}</span>
    </div>
  );
};

const Goodbye = () => {
  return (
    <main className={styles.page}>

      <section className={styles.card} aria-labelledby="goodbyeHeadline">
  

        <div className={styles.terminal} aria-label="Terminal Ausgabe">
          <PromptLine>user delete --confirm</PromptLine>
          <PromptLine>
            <span className={styles.ok}>[OK]</span> session canceled
          </PromptLine>
          <PromptLine>exit</PromptLine>
        </div>

        <div className={styles.actions}>
          <Link className={styles.primaryBtn} to="/">
            Zur Startseite
          </Link>

          <Link className={styles.secondaryBtn} to="/login">
            Neu registrieren
          </Link>
        </div>

        <p className={styles.hint}>
          Hinweis: Diese Seite ist aktuell zum Testen frei erreichbar.
        </p>
      </section>
    </main>
  );
};

export default Goodbye;
