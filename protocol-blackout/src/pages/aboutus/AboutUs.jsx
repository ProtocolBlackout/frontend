import { useEffect, useMemo, useRef, useState } from "react";
import "./AboutUs.css";

const TEAM = [
  {
    id: "bella",
    name: "Bella",
    role: "Game Development (Frontend & Backend)",
    tags: [
      "Game Dev",
      "Frontend",
      "Backend",
      "Emotional Intelligence",
      "Creative Thinker",
      "Dark Romance",
      "Team Harmony",
      "Fantasy Fan",
      "Slytherin",
      "Organization Talent",
      "Story Lover",
      "Music Soul",
      "Emotionsexplosion"
    ],
    avatar: "/images/BellaAvatar.png",
    avatarAlt: "Porträt von Bella",
    bio: "Bella, Baujahr 1993, ist unsere leidenschaftliche Slytherin mit einem Herzen für Fantasie und Emotionen. Sie ist die, die Struktur und Gefühl mit einer beeindruckenden Leichtigkeit vereint. Zwischen Kita-Alltag, Code und Dark-Romance-Romanen schafft sie es, rational zu denken und gleichzeitig mit dem Herzen zu führen. Wenn sie sich in ein Projekt stürzt, dann mit voller Leidenschaft – und wenn die Emotionen hochkochen, entstehen daraus oft kleine Explosionen voller Kreativität und Inspiration, die das ganze Team anstecken. Ihre Lieblingsfarbe Grün und die Zahl Sieben begleiten sie wie ein roter Faden – Symbole für Harmonie, Wachstum und Glück. Musikalisch lässt sie sich von Saltatio Mortis und Versengold tragen, die ihren Sinn für Tiefe, Geschichte und Melancholie perfekt widerspiegeln. Im Team bringt Bella Empathie, Organisationstalent und emotionale Tiefe zusammen – und sorgt damit dafür, dass jedes Projekt nicht nur funktioniert, sondern sich auch richtig anfühlt."
  },
  {
    id: "lulu",
    name: "Lulu",
    role: "Backend (Full) & Project Managerin",
    tags: [
      "Backend",
      "Project Management",
      "Idealistin",
      "Freedom Lover",
      "Naturfreundin",
      "Punkrock",
      "Dog Mom",
      "Handmade Spirit",
      "Creative Chaos",
      "Energiebündel",
      "Authentizität",
      "Team Motivation",
      "Problem Solver"
    ],
    avatar: "/images/LuNesAvatar.png",
    avatarAlt: "Porträt von Lulu",
    bio: "Lulu, Baujahr 1988, bringt Punkrock, Idealismus und jede Menge Herzblut ins Team. Aufgewachsen in der ehemaligen DDR hat sie ein starkes Bewusstsein für Freiheit, Gerechtigkeit und Selbstbestimmung entwickelt – Werte, die sie in allem, was sie tut, verteidigt und lebt. In ihr steckt ein echtes Naturkind mit einem Sinn für das Wesentliche: frische Luft, ehrliche Worte und kreative Energie. Ihr treuer Hund Xara begleitet sie dabei auf Schritt und Tritt – ob bei langen Spaziergängen im Wald oder beim kreativen Handwerken, das sie als Ausgleich zu Kopf- und Bildschirmarbeit liebt. Trotz (oder gerade wegen) ihrer 1,50 m ist sie im Team als unser „Terrorzwerg“ bekannt – ein Wirbelwind, der nicht aufzuhalten ist, wenn sie sich für eine Idee begeistert. Mit Punkrock im Ohr, einem frischen Blick auf Probleme und einem unerschütterlichen Idealismus schafft sie es, kreative Prozesse in Bewegung zu bringen, wo andere stehen bleiben. Lulu ist unsere Stimme der Freiheit, unser Herz für Authentizität und ein Energiebündel, das jede Routine sprengt."
  },
  {
    id: "jenny",
    name: "Jenny",
    role: "Frontend (Full) & Content",
    tags: [
      "Frontend",
      "UI/UX",
      "Content",
      "Gamer",
      "Fantasy Author",
      "Creative Mind",
      "Empathie",
      "Music Lover",
      "Batman Fan",
      "Storytelling",
      "Color Lover",
      "Team Spirit",
      "Problem Solver",
      "A Day to Remember"
    ],
    avatar: "/images/JennyAvatar.png",
    avatarAlt: "Porträt von Jenny",
    bio: "Jenny, Baujahr 1992, ist der kreative Kopf mit einem Faible für Fantasie und Technik gleichermaßen. Als leidenschaftliche Zockerin und überzeugter A Day to Remember-Fan liebt sie alles, was Herz, Action und Emotion vereint – ob im Game, beim Schreiben oder im Code. Mit ihrem Hintergrund in der Altenpflege bringt sie nicht nur Empathie und Geduld mit, sondern auch die Fähigkeit, Probleme strukturiert und mit ruhiger Hand zu lösen. Doch wer denkt, sie wäre nur ruhig und analytisch, irrt: Wenn sie über Batman oder ihre selbstgeschriebene Fantasy-Trilogie spricht, sprüht sie vor Begeisterung. Zwischen Blau, Rot und Lila findet sie ihre kreative Balance – und im Team sorgt sie mit ihrem Humor, ihrer Hartnäckigkeit und einem guten Schuss Fantasie dafür, dass selbst komplexe Ideen lebendig werden."
  }
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
        <p>
          Drei Köpfe, eine Vision. Wir sind Bella, Lulu und Jenny – drei kreative
          Köpfe mit völlig unterschiedlichen Wegen, die sich in der Welt des
          Programmierens gefunden haben.
        </p>
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

            <div className="flipCard">
              <div className={`flipCard__inner ${flipped ? "isFlipped" : ""}`}>
                {/* FRONT */}
                <section className="flipCard__face flipCard__front">
                  <img
                    className="flipCard__img"
                    src={activeMember.avatar}
                    alt={activeMember.avatarAlt}
                  />
                  <button
                    type="button"
                    className="flipCard__hint"
                    onClick={() => setFlipped(true)}
                  >
                    Klick fürs Umdrehen
                  </button>
                </section>

                {/* BACK */}
                <section className="flipCard__face flipCard__back">
                  <div className="flipCard__text">
                    <div className="flipCard__role">{activeMember.role}</div>
                    <p className="flipCard__bio">{activeMember.bio}</p>

                    <div className="flipCard__tags">
                      {activeMember.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flipCard__hint"
                    onClick={() => setFlipped(false)}
                  >
                    Klick fürs Bild
                  </button>
                </section>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </main>
  );
}
