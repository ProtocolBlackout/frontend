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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                ultrices, nulla sed tincidunt tempus, lorem nisi ultrices arcu,
                non hendrerit arcu elit sit amet lorem.
              </span>
            </div>

            <div className="ethics-console__row">
              <span className="ethics-console__label">RAHMEN</span>
              <span className="ethics-console__value">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed
                non risus at odio gravida interdum.
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </span>
              </li>
              <li>
                <span className="ethics-list__key">
                  TRANSPARENZ_UND_PROTOKOLLE
                </span>
                <span className="ethics-list__value">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </span>
              </li>
              <li>
                <span className="ethics-list__key">KEIN_SCHADEN</span>
                <span className="ethics-list__value">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </span>
              </li>
              <li>
                <span className="ethics-list__key">VERTRAULICHER_UMGANG</span>
                <span className="ethics-list__value">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </span>
              </li>
              <li>
                <span className="ethics-list__key">VERANTWORTUNG</span>
                <span className="ethics-list__value">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </span>
              </li>
              <li>
                <span className="ethics-list__key">
                  LERNEN_UND_TEILEN_MIT_SINN
                </span>
                <span className="ethics-list__value">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                    Tests nur im vereinbarten Rahmen durchführen – Lorem ipsum
                    dolor sit amet.
                  </li>
                  <li>
                    Ergebnisse sauber dokumentieren – Lorem ipsum dolor sit amet.
                  </li>
                  <li>
                    Schwachstellen verantwortungsvoll melden – Lorem ipsum dolor
                    sit amet.
                  </li>
                </ul>
              </div>

              <div className="ethics-split__column ethics-split__column--dont">
                <h3 className="ethics-split__heading">NICHT_ERLAUBT</h3>
                <ul className="ethics-split__list">
                  <li>UNBEFUGTER_ZUGRIFF – Lorem ipsum dolor sit amet.</li>
                  <li>DATENDIEBSTAHL_ODER_LEAKS – Lorem ipsum dolor sit amet.</li>
                  <li>ABSICHTLICHER_SCHADEN – Lorem ipsum dolor sit amet.</li>
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
