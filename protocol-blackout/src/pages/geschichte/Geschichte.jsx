// src/pages/geschichte/Geschichte.jsx
import { useState } from "react";
import "./Geschichte.css";

const mainTimeline = [
  {
    id: "mit",
    year: "1950/1960",
    title: "Die ersten Hacker am MIT",
    teaser: "Hacker = kreative Tüftler, nicht Kriminelle.",
    full: "Der Begriff „Hacker“ entstand am MIT für Leute, die mit Hardware und Software spielerisch experimentierten. Ziel war es, technische Systeme smarter und effizienter zu machen – nicht, Schaden anzurichten."
  },
  {
    id: "arpanet",
    year: "1970",
    title: "ARPANET & Creeper/Reaper",
    teaser: "Die ersten selbstverbreitenden Programme im Netz.",
    full: "Mit ARPANET als Forschungsnetz der US‑Behörde ARPA entstand die Grundlage des späteren Internets. In diesem Umfeld tauchten Creeper (früher Wurm‑Vorläufer) und Reaper (Gegenprogramm) auf – frühe Beispiele selbstverbreitender Software."
  },
  {
    id: "phonephreak",
    year: "1970",
    title: "Phone‑Phreaking & Cap’n Crunch",
    teaser: "Hacken, bevor das Internet Mainstream war.",
    full: "Phone‑Phreaker wie John Draper („Cap’n Crunch“) nutzten spezielle Tonsignale, um das Telefonsystem zu manipulieren und Gespräche kostenlos zu führen. Das zeigte, dass auch analoge Netze gehackt werden können und prägte das Bild des Hackers stark."
  },
  {
    id: "wargames_morris",
    year: "1983–1988",
    title: "WarGames & Morris‑Wurm",
    teaser: "Hacking wird Popkultur – und ein Risiko.",
    full: "Der Film „WarGames“ machte die Vorstellung vom jugendlichen Hacker populär, der versehentlich beinahe einen Krieg auslöst. Kurz darauf infizierte der Morris‑Wurm tausende vernetzte UNIX‑Systeme und führte zur Einrichtung der ersten CERT‑Strukturen."
  },
  {
    id: "massviren",
    year: "1990/2000",
    title: "Internet, Massenviren & Phishing",
    teaser: "Vom Experiment zur globalen Cyberkriminalität.",
    full: "Mit der Kommerzialisierung des Internets entstanden Viren, Würmer und Makro‑Schadsoftware, die Millionen von Systemen trafen. Parallel tauchten erste große Phishing‑Kampagnen und Exploit‑Kits auf, wodurch Hacking zunehmend finanziell motiviert wurde."
  },
  {
    id: "apt_ransom",
    year: "2000–heute",
    title: "APT‑Gruppen & Ransomware‑Ökonomie",
    teaser: "Hacking als Industrie und geopolitisches Werkzeug.",
    full: "Staatlich unterstützte APT‑Gruppen setzen zielgerichtete Angriffe für Spionage und Sabotage ein, während Ransomware‑Banden ein globales Erpressungs‑Ökosystem aufgebaut haben. Heute reicht die Landschaft von Bug‑Bounties bis zu Crime‑as‑a‑Service und groß angelegten Kampagnen."
  }
];

const milestoneTimeline = [
  {
    id: "ms-mit",
    year: "1950/1960",
    title: "Entstehung des Hackerbegriffs am MIT",
    teaser: "Startpunkt der Hackerkultur als kreatives, spielerisches Tüfteln.",
    full: "Am MIT entstand der Begriff „Hacker“ für Menschen, die technische Systeme mit viel Kreativität umbauten, optimierten und zweckentfremdeten – als Hobby und Herausforderung, nicht um Schaden anzurichten."
  },
  {
    id: "ms-arpanet",
    year: "frühe 1970",
    title: "ARPANET & Creeper/Reaper",
    teaser: "Frühe selbstverbreitende Programme im Netz.",
    full: "Creeper und Reaper im ARPANET zeigten, dass sich Programme automatisch über vernetzte Systeme bewegen und bekämpfen können – ein wichtiger Schritt hin zu heutigen Würmern und Anti‑Malware‑Ansätzen."
  },
  {
    id: "ms-phone",
    year: "1970",
    title: "Phone‑Phreaking & Cap’n Crunch",
    teaser: "Hacken außerhalb von Computern.",
    full: "Phone‑Phreaker nutzten spezielle Tonsignale, um Telefonnetze auszutricksen. John Draper („Cap’n Crunch“) wurde zum Symbol dafür, dass sich auch analoge Infrastrukturen hacken lassen."
  },
  {
    id: "ms-morris",
    year: "1988",
    title: "Morris‑Wurm & CERT‑Strukturen",
    teaser: "Erster großer Internet‑Wurm.",
    full: "Der Morris‑Wurm legte einen großen Teil des frühen Internets lahm und machte deutlich, wie verwundbar vernetzte Systeme sind. Er führte zur Einrichtung von Computer Emergency Response Teams (CERT)."
  },
  {
    id: "ms-ransom",
    year: "2010/2020",
    title: "Ransomware‑Ökonomie & Crime‑as‑a‑Service",
    teaser: "Cybercrime als Schattenindustrie.",
    full: "Mit Ransomware‑as‑a‑Service, Double‑Extortion‑Modellen und Crime‑as‑a‑Service ist Hacking zu einer arbeitsteiligen Schattenindustrie geworden, in der Angriffe gemietet und skaliert werden können."
  }
];

function Geschichte() {
  // Start: alles geschlossen
  const [openMainId, setOpenMainId] = useState(null);
  const [openMilestoneId, setOpenMilestoneId] = useState(null);

  return (
    <main className="history">
      <section className="history-intro">
        <h1>Die Geschichte des Hackings</h1>
        <p>
          Von spielerischen Tüftlern am MIT bis zu globalen Cyberangriffen: diese
          Timelines zeigen die Entwicklung der Hackerkultur und die wichtigsten
          Wendepunkte in der Geschichte des Hackings.
        </p>
      </section>

      {/* Haupt-Timeline */}
      <section className="history-timeline">
        {mainTimeline.map((item) => {
          const isOpen = item.id === openMainId;

          return (
            <article
              key={item.id}
              className={`history-event ${isOpen ? "history-event--open" : ""}`}
              onClick={() => setOpenMainId(isOpen ? null : item.id)}
            >
              <div className="history-event__marker">
                <span className="history-event__dot" />
                <span className="history-event__year">{item.year}</span>
              </div>

              <div className="history-event__card">
                <h2>{item.title}</h2>
                <p className="history-event__teaser">{item.teaser}</p>

                {isOpen && (
                  <p className="history-event__full">
                    {item.full}
                  </p>
                )}

                <button
                  type="button"
                  className="history-event__toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMainId(isOpen ? null : item.id);
                  }}
                >
                  {isOpen ? "Weniger anzeigen" : "Mehr anzeigen"}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Meilenstein-Timeline */}
      <section className="history-timeline history-timeline--milestones">
        <h3 className="history-section-title">Wichtige Meilensteine</h3>

        {milestoneTimeline.map((item) => {
          const isOpen = item.id === openMilestoneId;

          return (
            <article
              key={item.id}
              className={`history-event history-event--milestone ${
                isOpen ? "history-event--open" : ""
              }`}
              onClick={() => setOpenMilestoneId(isOpen ? null : item.id)}
            >
              <div className="history-event__marker">
                <span className="history-event__dot" />
                <span className="history-event__year">{item.year}</span>
              </div>

              <div className="history-event__card">
                <h2>{item.title}</h2>
                <p className="history-event__teaser">{item.teaser}</p>

                {isOpen && (
                  <p className="history-event__full">
                    {item.full}
                  </p>
                )}

                <button
                  type="button"
                  className="history-event__toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMilestoneId(isOpen ? null : item.id);
                  }}
                >
                  {isOpen ? "Weniger anzeigen" : "Mehr anzeigen"}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Geschichte;
