import { useEffect, useMemo, useRef, useState } from "react";
import "./AboutUs.css";

const TEAM = [
  {
    id: "bella",
    name: "Bella",
    role: "Game Development (Frontend & Backend)",
    tags: ["Game Dev", "Frontend", "Backend"],
    avatar: "/images/BellaAvatar.png",
    avatarAlt: "Porträt von Bella",
    bio: "Bella bringt als stolze Slytherin und Fantasy-Fan die Portion Magie ins Team. Zwischen Kita-Alltag, Code und Dark-Romance-Romanen jongliert sie ihr Leben mit beeindruckender Gelassenheit – bis eine ihrer berühmten Emotionsexplosionen das Team wieder mit neuer Energie erfüllt. Grün ist ihre Farbe, sieben ihre Zahl – und wenn Saltatio Mortis oder Versengold läuft, läuft’s erst richtig rund.",
  },
  {
    id: "lulu",
    name: "Lulu",
    role: "Backend (Full) & Project Managerin",
    tags: ["Backend", "Project Management"],
    avatar: "/images/LuNesAvatar.png",
    avatarAlt: "Porträt von Lulu",
    bio: "Lulu, Baujahr 1988 und gebürtig aus der ehemaligen DDR, steht für Idealismus, Freiheit und Herzblut. Punkrock im Ohr, Hündin Xara an der Seite und das Herz am richtigen Fleck – so kennt man unseren „Terrorzwerg“. Mit 1,50 m geballter Energie sorgt sie für kreative Explosionen, gute Laune und klare Worte. Ihren Ausgleich findet sie in der Natur oder beim kreativen Handwerken.",
  },
  {
    id: "jenny",
    name: "Jenny",
    role: "Frontend (Full) & Content",
    tags: ["Frontend", "UI/UX", "Content"],
    avatar: "/images/JennyAvatar.png",
    avatarAlt: "Porträt von Jenny",
    bio: "Jenny, Baujahr 1992, ist leidenschaftliche Zockerin, Batman-Freak und stolzer Fan von A Day to Remember. Sie hat den Sprung von der Altenpflege in die IT gewagt – und schreibt nebenbei noch an einer eigenen Fantasy-Trilogie. Zwischen Blau, Rot und Lila findet sie die perfekte Balance aus Struktur, Leidenschaft und Kreativität.",
  },
];

export default function AboutUs() {
  const [activeId, setActiveId] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const dialogRef = useRef(null);
  const activeMember = useMemo(
    () => TEAM.find((m) => m.id === activeId) ?? null,
    [activeId]
  );

  const open = (id) => {
    setActiveId(id);
    setFlipped(false);
  };

  const close = () => {
    setFlipped(false);
    setActiveId(null);
  };

  // open/close the native dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeId) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [activeId]);

  return (
    <main className="about">
      <header className="about__header">
        <h1>Über uns</h1>
        <p>Drei Köpfe, eine Vision. Wir sind Bella, Lulu und Jenny – drei kreative Köpfe mit völlig unterschiedlichen Wegen, die sich in der Welt des Programmierens gefunden haben.</p>
      </header>

      <section className="about__team">
        <h2>Team Members</h2>

        <div className="teamGrid">
          {TEAM.map((m) => (
            <button
              key={m.id}
              type="button"
              className="memberTile"
              onClick={() => open(m.id)}
            >
              <img className="memberTile__avatar" src={m.avatar} alt={m.avatarAlt} />
              <div className="memberTile__meta">
                <div className="memberTile__name">{m.name}</div>
                <div className="memberTile__role">{m.role}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Modal (nur Bild -> flip -> Text) */}
      <dialog
        ref={dialogRef}
        className="aboutModal"
        aria-labelledby="aboutModalTitle"
        onClose={close}
      >
        {activeMember && (
          <div className="aboutModal__content">
            <div className="aboutModal__top">
              <div id="aboutModalTitle" className="aboutModal__title">
                {activeMember.name}
              </div>

              <button type="button" className="aboutModal__close" onClick={close}>
                Schließen
              </button>
            </div>

            {/* Click area that flips */}
            <button
              type="button"
              className={`zoomFlip ${flipped ? "isFlipped" : ""}`}
              onClick={() => setFlipped((p) => !p)}
              aria-label={flipped ? "Bild anzeigen" : "Text anzeigen"}
            >
              <div className="zoomFlip__inner">
                <div className="zoomFlip__face zoomFlip__front">
                  <img
                    className="zoomFlip__img"
                    src={activeMember.avatar}
                    alt={activeMember.avatarAlt}
                  />
                  <div className="zoomFlip__hint">Klick fürs Umdrehen</div>
                </div>

                <div className="zoomFlip__face zoomFlip__back">
                  <div className="zoomFlip__text">
                    <div className="zoomFlip__role">{activeMember.role}</div>
                    <p className="zoomFlip__bio">{activeMember.bio}</p>
                    <div className="zoomFlip__tags">
                      {activeMember.tags.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="zoomFlip__hint">Klick fürs Bild</div>
                </div>
              </div>
            </button>
          </div>
        )}
      </dialog>
    </main>
  );
}
