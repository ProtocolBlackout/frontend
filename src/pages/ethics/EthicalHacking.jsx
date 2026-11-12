import styles from "./EthicalHacking.module.css";

const EthicalHacking = () => {
  return (
    <div className={styles.ethics}>
      {/* Console: Overview */}
      <section className={styles.ethicsConsole}>
        <header className={styles.ethicsConsoleHeader}>
          <span className={styles.ethicsConsoleTitle}>
            ETHISCHE_HACKING_REGELN
          </span>
          <span className={styles.ethicsConsoleDots}>● ● ●</span>
        </header>

        <div className={styles.ethicsConsoleBody}>
          {/* Block 1: Overview */}
          <div className={styles.ethicsBlock}>
            <h2 className={styles.ethicsBlockHeading}>ÜBERBLICK</h2>

            <div className={styles.ethicsConsoleRow}>
              <span className={styles.ethicsConsoleLabel}>HACKER_ETHIK</span>
              <span className={styles.ethicsConsoleValue}>
                Hacker-Ethik beschreibt die moralischen Grundwerte, nach denen
                verantwortungsbewusste Hacker handeln. Ziel ist es,
                Sicherheitslücken aufzudecken und Systeme zu verbessern – nicht,
                Schaden zu verursachen oder sich zu bereichern.
              </span>
            </div>

            <div className={styles.ethicsConsoleRow}>
              <span className={styles.ethicsConsoleLabel}>RAHMEN</span>
              <span className={styles.ethicsConsoleValue}>
                Ethisches Hacken findet immer in einem klar definierten
                rechtlichen und organisatorischen Rahmen statt. Dazu gehören
                Genehmigungen, festgelegte Testziele und die Einhaltung von
                Gesetzen und Verträgen.
              </span>
            </div>
          </div>

          {/* Block 2: Core Principles */}
          <div className={styles.ethicsBlock}>
            <h2 className={styles.ethicsBlockHeading}>GRUNDPRINZIPIEN</h2>
            <ul className={styles.ethicsList}>
              <li>
                <span className={styles.ethicsListKey}>
                  ZUGANG_NUR_MIT_EINWILLIGUNG
                </span>
                <span className={styles.ethicsListValue}>
                  Systeme dürfen ausschließlich mit ausdrücklicher Erlaubnis des
                  Eigentümers getestet werden.
                </span>
              </li>
              <li>
                <span className={styles.ethicsListKey}>
                  TRANSPARENZ_UND_PROTOKOLLE
                </span>
                <span className={styles.ethicsListValue}>
                  Vorgehen, Methoden und Ergebnisse müssen nachvollziehbar
                  dokumentiert werden.
                </span>
              </li>
              <li>
                <span className={styles.ethicsListKey}>KEIN_SCHADEN</span>
                <span className={styles.ethicsListValue}>
                  Tests dürfen den Betrieb von Systemen nicht absichtlich
                  beeinträchtigen oder zerstören.
                </span>
              </li>
              <li>
                <span className={styles.ethicsListKey}>
                  VERTRAULICHER_UMGANG
                </span>
                <span className={styles.ethicsListValue}>
                  Gefundene Schwachstellen und sensible Daten müssen vertraulich
                  behandelt werden.
                </span>
              </li>
              <li>
                <span className={styles.ethicsListKey}>VERANTWORTUNG</span>
                <span className={styles.ethicsListValue}>
                  Ethische Hacker tragen Verantwortung für die Folgen ihres
                  Handelns und ihrer Erkenntnisse.
                </span>
              </li>
              <li>
                <span className={styles.ethicsListKey}>
                  LERNEN_UND_TEILEN_MIT_SINN
                </span>
                <span className={styles.ethicsListValue}>
                  Wissen soll zur Verbesserung der Sicherheit beitragen – nicht
                  zum Missbrauch.
                </span>
              </li>
            </ul>
          </div>

          {/* Block 3: Do & Don't */}
          <div
            className={`${styles.ethicsBlock} ${styles.ethicsBlockSplit}`}
          >
            <h2 className={styles.ethicsBlockHeading}>DOS_UND_DONTS</h2>
            <div className={styles.ethicsSplit}>
              <div
                className={`${styles.ethicsSplitColumn} ${styles.ethicsSplitColumnDo}`}
              >
                <h3 className={styles.ethicsSplitHeading}>ERLAUBT</h3>
                <ul className={styles.ethicsSplitList}>
                  <li>
                    Tests nur im vereinbarten Rahmen durchführen und vereinbarte
                    Grenzen einhalten.
                  </li>
                  <li>
                    Ergebnisse strukturiert dokumentieren und nachvollziehbar
                    aufbereiten.
                  </li>
                  <li>
                    Schwachstellen verantwortungsvoll melden, bevor sie
                    öffentlich gemacht werden.
                  </li>
                </ul>
              </div>

              <div
                className={`${styles.ethicsSplitColumn} ${styles.ethicsSplitColumnDont}`}
              >
                <h3 className={styles.ethicsSplitHeading}>NICHT_ERLAUBT</h3>
                <ul className={styles.ethicsSplitList}>
                  <li>
                    UNBEFUGTER_ZUGRIFF – Eindringen in Systeme ohne Zustimmung
                    des Eigentümers.
                  </li>
                  <li>
                    DATENDIEBSTAHL_ODER_LEAKS – Kopieren, Veröffentlichen oder
                    Weitergeben sensibler Daten.
                  </li>
                  <li>
                    ABSICHTLICHER_SCHADEN – Sabotage, Erpressung oder Störung von
                    Systemen.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EthicalHacking;
