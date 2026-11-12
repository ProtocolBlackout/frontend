import "./EthischesHacken.css";

function EthischesHacken() {
  return (
    <main className="ethics">
      {/* Konsole: Überblick */}
      <section className="ethics-console">
        <header className="ethics-console__header">
          <span className="ethics-console__title">ETHISCHE_HACKING_REGELN</span>
          <span className="ethics-console__dots">● ● ●</span>
        </header>

        <div className="ethics-console__body">
          {/* Block 1: Überblick */}
          <div className="ethics-block">
            <h2 className="ethics-block__heading">ÜBERBLICK</h2>

            <div className="ethics-console__row">
              <span className="ethics-console__label">HACKER_ETHIK</span>
              <span className="ethics-console__value">
                Hacker-Ethik beschreibt die moralischen Grundwerte, nach denen verantwortungsbewusste Hacker handeln. Ziel ist es, Sicherheitslücken aufzudecken und Systeme zu verbessern – nicht, Schaden zu verursachen oder sich zu bereichern.

              </span>
            </div>

            <div className="ethics-console__row">
              <span className="ethics-console__label">RAHMEN</span>
              <span className="ethics-console__value">
                Ethisches Hacken findet immer in einem klar definierten rechtlichen und organisatorischen Rahmen statt. Dazu gehören Genehmigungen, festgelegte Testziele und die Einhaltung von Gesetzen und Verträgen.

              </span>
            </div>
          </div>

          {/* Block 2: Grundprinzipien */}
          <div className="ethics-block">
            <h2 className="ethics-block__heading">GRUNDPRINZIPIEN</h2>
            <ul className="ethics-list">
              <li>
                <span className="ethics-list__key">
                  ZUGANG_NUR_MIT_EINWILLIGUNG
                </span>
                <span className="ethics-list__value">
                  Systeme dürfen ausschließlich mit ausdrücklicher Erlaubnis des Eigentümers getestet werden.
                </span>
              </li>
              <li>
                <span className="ethics-list__key">
                  TRANSPARENZ_UND_PROTOKOLLE
                </span>
                <span className="ethics-list__value">
                  Vorgehen, Methoden und Ergebnisse müssen nachvollziehbar dokumentiert werden.
                </span>
              </li>
              <li>
                <span className="ethics-list__key">KEIN_SCHADEN</span>
                <span className="ethics-list__value">
                  Tests dürfen den Betrieb von Systemen nicht absichtlich beeinträchtigen oder zerstören.
                </span>
              </li>
              <li>
                <span className="ethics-list__key">VERTRAULICHER_UMGANG</span>
                <span className="ethics-list__value">
                  Gefundene Schwachstellen und sensible Daten müssen vertraulich behandelt werden.
                </span>
              </li>
              <li>
                <span className="ethics-list__key">VERANTWORTUNG</span>
                <span className="ethics-list__value">
                  Ethische Hacker tragen Verantwortung für die Folgen ihres Handelns und ihrer Erkenntnisse.
                </span>
              </li>
              <li>
                <span className="ethics-list__key">
                  LERNEN_UND_TEILEN_MIT_SINN
                </span>
                <span className="ethics-list__value">
                  Wissen soll zur Verbesserung der Sicherheit beitragen – nicht zum Missbrauch.
                </span>
              </li>
            </ul>
          </div>

          {/* Block 3: Do & Don't */}
          <div className="ethics-block ethics-block--split">
            <h2 className="ethics-block__heading">DOS_UND_DONTS</h2>
            <div className="ethics-split">
              <div className="ethics-split__column ethics-split__column--do">
                <h3 className="ethics-split__heading">ERLAUBT</h3>
                <ul className="ethics-split__list">
                  <li>
                    Tests nur im vereinbarten Rahmen durchführen und vereinbarte Grenzen einhalten.
                  </li>
                  <li>
                    Ergebnisse strukturiert dokumentieren und nachvollziehbar aufbereiten.
                  </li>
                  <li>
                    Schwachstellen verantwortungsvoll melden, bevor sie öffentlich gemacht werden.
                  </li>
                </ul>
              </div>

              <div className="ethics-split__column ethics-split__column--dont">
                <h3 className="ethics-split__heading">NICHT_ERLAUBT</h3>
                <ul className="ethics-split__list">
                  <li>UNBEFUGTER_ZUGRIFF – Eindringen in Systeme ohne Zustimmung des Eigentümers.</li>
                  <li>DATENDIEBSTAHL_ODER_LEAKS – Kopieren, Veröffentlichen oder Weitergeben sensibler Daten.</li>
                  <li>ABSICHTLICHER_SCHADEN – Sabotage, Erpressung oder Störung von Systemen.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EthischesHacken;
