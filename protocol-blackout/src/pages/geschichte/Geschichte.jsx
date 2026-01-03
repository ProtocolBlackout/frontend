// src/pages/geschichte/Geschichte.jsx
import { useState } from "react";
import "./geschichte.css";

const mainTimeline = [
  {
    id: "mit",
    year: "1950–1960",
    title: "Die ersten Hacker am MIT",
    teaser: "Hacking als kreative Problemlösung.",
    full: "Der Begriff „Hacker“ entstand Ende der 1950er und Anfang der 1960er Jahre am MIT. Gemeint waren Studierende und Forschende, die Hard- und Software spielerisch erforschten, Systeme verbesserten und kreative Abkürzungen fanden. Hacking hatte keinen kriminellen Hintergrund, sondern stand für Neugier, technisches Verständnis und das Austesten von Systemgrenzen."
  },
  {
    id: "universities",
    year: "1960–1970",
    title: "Universitäten als Keimzellen der Hackerkultur",
    teaser: "Großrechner, Wissen und Freiheit.",
    full: "Universitäten spielten eine zentrale Rolle für die frühe Hackerkultur. Dort standen teure Großrechner zur Verfügung, und Studierende konnten offen experimentieren. Wissen wurde geteilt, Programme analysiert und Systeme jenseits der vorgesehenen Nutzung verstanden – eine Grundlage für das heutige Hackerverständnis."
  },
  {
    id: "phreaking",
    year: "1960–1970",
    title: "Phone-Phreaking",
    teaser: "Hacking vor dem Internet.",
    full: "Schon vor vernetzten Computern manipulierten sogenannte Phone-Phreaker das analoge Telefonsystem. Durch das Ausnutzen technischer Tonsignale konnten sie Gebühren umgehen und kostenlose Gespräche führen. Der bekannteste Vertreter war John Draper („Cap’n Crunch“). Phreaking zeigte früh, dass auch komplexe Infrastrukturen angreifbar sind."
  },
  {
    id: "arpanet",
    year: "1970",
    title: "ARPANET entsteht",
    teaser: "Der Ursprung des Internets.",
    full: "Das ARPANET wurde von der US-Behörde ARPA als Forschungsnetz entwickelt. Es verband erstmals Computer über große Entfernungen und ermöglichte den Austausch von Daten zwischen Universitäten. Damit entstand die technische Grundlage für das Internet – und für netzwerkbasierte Angriffe."
  },
  {
    id: "creeper",
    year: "1971–1972",
    title: "Creeper und Reaper",
    teaser: "Erste selbstverbreitende Software.",
    full: "Mit Creeper tauchte eines der ersten Programme auf, das sich selbst über ein Netzwerk verbreitete. Reaper wurde als gezielte Gegenmaßnahme entwickelt. Diese Experimente gelten als frühe Vorläufer von Schadsoftware und IT-Sicherheitskonzepten."
  },
  {
    id: "kgbhack",
    year: "1980er",
    title: "Der KGB-Hack",
    teaser: "Hacking wird geopolitisch.",
    full: "In den 1980er Jahren drang eine deutsche Hackergruppe in westliche Computersysteme ein und verkaufte die erlangten Daten an den sowjetischen Geheimdienst. Der sogenannte KGB-Hack machte deutlich, dass Hacking nicht nur technisches, sondern auch politisches und sicherheitliches Gewicht hat."
  },
  {
    id: "law",
    year: "1986",
    title: "Erste Computerstrafgesetze",
    teaser: "Recht reagiert auf neue Risiken.",
    full: "Mit dem Computer Fraud and Abuse Act in den USA wurde unbefugter Computerzugriff erstmals klar unter Strafe gestellt. Die zunehmende Zahl bekannter Hacks führte dazu, dass Staaten rechtliche Rahmenbedingungen für den Umgang mit Computerkriminalität schufen."
  },
  {
    id: "morris",
    year: "1988",
    title: "Der Morris-Wurm",
    teaser: "Das Internet wird verwundbar.",
    full: "Der Morris-Wurm verbreitete sich selbstständig im noch jungen Internet und legte tausende UNIX-Systeme lahm. Obwohl er aus Neugier entwickelt wurde, zeigte er drastisch, wie Softwarefehler in vernetzten Systemen globale Auswirkungen haben können."
  },
  {
    id: "commercial",
    year: "1990er",
    title: "Kommerzialisierung des Internets",
    teaser: "Von Forschung zu Wirtschaft.",
    full: "Mit dem World Wide Web wurde das Internet für Unternehmen und Privatpersonen zugänglich. Gleichzeitig nahmen Viren, Phishing und Betrugsversuche stark zu. Hacking verlagerte sich zunehmend von Experimenten hin zu finanziell motivierter Cyberkriminalität."
  },
  {
    id: "worms",
    year: "2000er",
    title: "Massenwürmer und globale Schäden",
    teaser: "Cyberangriffe erreichen neue Dimensionen.",
    full: "Schadprogramme wie ILOVEYOU oder Code Red infizierten weltweit Millionen Systeme und verursachten enorme wirtschaftliche Schäden. Unternehmen begannen, Sicherheitsstrategien, Firewalls, Patch-Management und Incident-Response-Pläne einzuführen."
  },
  {
    id: "apt",
    year: "2000–2010er",
    title: "Gezielte Angriffe und APTs",
    teaser: "Cyberangriffe als Strategie.",
    full: "Staatlich unterstützte Angreifergruppen führten gezielte und langfristige Angriffe durch. Diese Advanced Persistent Threats (APTs) zielten auf Spionage, Sabotage und Informationsgewinnung und unterschieden sich klar von breit gestreuten Massenangriffen."
  },
  {
    id: "modern",
    year: "2010er",
    title: "Cloud, Mobile und IoT",
    teaser: "Die Angriffsfläche wächst.",
    full: "Mit Cloud-Diensten, Smartphones und vernetzten Geräten wuchs die Angriffsfläche erheblich. Fehlkonfigurationen, unsichere Zugänge und neue Schnittstellen wurden zu häufigen Einfallstoren für Angreifer."
  },
  {
    id: "ransomware",
    year: "2020er",
    title: "Ransomware und Crime-as-a-Service",
    teaser: "Cybercrime als Industrie.",
    full: "Ransomware-Gruppen agieren heute hochprofessionell und arbeitsteilig. Angriffe werden als Dienstleistung angeboten, Daten gestohlen und Opfer erpresst. Cyberkriminalität ist damit zu einem globalen Geschäftsmodell geworden."
  },
  {
    id: "ethical",
    year: "Heute",
    title: "Ethisches Hacking und Cybersecurity",
    teaser: "Angreifen, um zu schützen.",
    full: "Ethisches Hacking, Penetrationstests und Bug-Bounty-Programme werden gezielt eingesetzt, um Sicherheitslücken mit Erlaubnis zu finden. Ziel ist es, Systeme zu verbessern und Angriffe frühzeitig zu verhindern."
  }
];

const milestoneTimeline = [
  {
    id: "ms_mit",
    year: "1950–1960",
    title: "Geburt des Hackerbegriffs",
    teaser: "Hacking als kreative Problemlösung.",
    full: "Am MIT entsteht „Hacker“ als Bezeichnung für neugierige Tüftler. Hacking ist ursprünglich nicht kriminell."
  },
  {
    id: "ms_phreaking",
    year: "1960–1970",
    title: "Phone-Phreaking",
    teaser: "Angriffe auf technische Infrastruktur.",
    full: "Phreaker manipulieren das Telefonsystem und zeigen erstmals, dass komplexe technische Netze gezielt ausnutzbar sind."
  },
  {
    id: "ms_arpanet",
    year: "1970",
    title: "ARPANET",
    teaser: "Der Beginn vernetzter Systeme.",
    full: "Computer werden über große Entfernungen vernetzt – Angriffe sind nun nicht mehr lokal begrenzt."
  },
  {
    id: "ms_creeper",
    year: "1971–1972",
    title: "Creeper & Reaper",
    teaser: "Selbstverbreitende Programme.",
    full: "Erste Programme bewegen sich selbstständig durch Netzwerke und machen automatisierte Angriffe denkbar."
  },
  {
    id: "ms_law",
    year: "1986",
    title: "Hacking wird strafbar",
    teaser: "Recht reagiert auf Technik.",
    full: "Gesetze wie der Computer Fraud and Abuse Act kriminalisieren unbefugten Systemzugriff."
  },
  {
    id: "ms_morris",
    year: "1988",
    title: "Morris-Wurm",
    teaser: "Globale Auswirkungen von Malware.",
    full: "Ein einzelnes Programm legt große Teile des frühen Internets lahm und macht IT-Sicherheit notwendig."
  },
  {
    id: "ms_commercial",
    year: "1990er",
    title: "Kommerzialisierung des Internets",
    teaser: "Cybercrime wird wirtschaftlich.",
    full: "Mit Online-Diensten und E-Commerce entstehen finanzielle Anreize für Angriffe."
  },
  {
    id: "ms_ransomware",
    year: "2010–2020er",
    title: "Ransomware als Geschäftsmodell",
    teaser: "Professionalisierung von Cybercrime.",
    full: "Cyberangriffe werden organisiert, arbeitsteilig und hochprofitabel."
  },
  {
    id: "ms_ethical",
    year: "Heute",
    title: "Ethisches Hacking",
    teaser: "Angreifen zur Verteidigung.",
    full: "Sicherheitslücken werden gezielt gesucht, um Systeme zu schützen statt zu schädigen."
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
