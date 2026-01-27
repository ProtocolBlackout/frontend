import React from "react";
import { useEffect, useState } from "react";
import { requestJson } from "../../services/api.js";
import Quiz from "./quiz/gameQuiz";
import GamePasswordCracker from "./password-cracker/passwordCracker";
import styles from "./Gamespage.module.css";
import PhishingFinder from "./phishing-finder/PhishingFinder";

// import ErrorBoundary from '../../components/ErrorBoundary'

export default function Gamespage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalPageIndex, setModalPageIndex] = useState(0);
  const [playingInOverlay, setPlayingInOverlay] = useState(null);

  const [gamesFromBackend, setGamesFromBackend] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadGames = async () => {
      setGamesLoading(true);
      setGamesError(null);

      try {
        const data = await requestJson("/games");

        if (!isMounted) return;

        if (Array.isArray(data)) {
          setGamesFromBackend(data);
        } else {
          setGamesFromBackend([]);
        }
      } catch (err) {
        if (!isMounted) return;
        setGamesError(err.message ?? "Fehler beim Laden der Games-Liste");
        setGamesFromBackend([]);
      } finally {
        if (!isMounted) return;
        setGamesLoading(false);
      }
    };

    loadGames();

    return () => {
      isMounted = false;
    };
  }, []);

  const localGames = [
    {
      id: "quiz",
      title: "Quiz",
      desc: "Teste dein Wissen rund um das Thema Hacking",
      instructions: [
        "Seite 1: Lies die Frage sorgfältig.",
        "Seite 2: Wähle die beste Antwort. Du hast 60 Sekunden pro Frage."
      ],
      render: (onBack) => <Quiz onBack={onBack} />
    },
    {
      id: "cracker",
      title: "Passwort Cracker",
      desc: "Na schaffst du es unsere Passwörter herauszufinden",
      instructions: [
        "Seite 1: Du hast begrenzte Versuche.",
        "Seite 2: Nutze Hinweise und Mustererkennung."
      ],
      render: (onBack) => <GamePasswordCracker onBack={onBack} />
    },
    {
      id: "phishing-finder",
      title: "Phishing Finder",
      desc: "Erkenne gefährliche Mails.",
      instructions: ["Spiel starten und Mails prüfen."],
      render: (onBack) => <PhishingFinder onBack={onBack} />
    }
  ];

  // Lookup: lokale Spiele schnell per ID finden (statt jedes Mal find() über ein Array)
  const localById = localGames.reduce((acc, game) => {
    acc[game.id] = game;
    return acc;
  }, {});

  // Backend kann Instructions als Array oder String liefern -> immer als Array normalisieren
  const normalizeInstructions = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim() !== "") return [value];
    return null;
  };

  // Falls Backend-IDs von lokalen IDs abweichen, mappen wir sie hier
  const aliasMap = {
    "password-cracker": "cracker"
  };

  // Backend liefert Metadaten, Frontend liefert weiterhin die Render-Implementierung
  const backendMapped = (gamesFromBackend || [])
    .map((g) => {
      const backendId = g?.id ?? g?.gameId ?? g?.slug ?? g?.key;
      if (!backendId) return null;

      const id = String(backendId);
      const localId = aliasMap[id] ?? id;

      // Nur Games übernehmen, die wir lokal auch wirklich rendern können
      const localGame = localById[localId];
      if (!localGame) return null;

      return {
        id,
        title: g?.title ?? g?.name ?? localGame.title,
        desc:
          g?.desc ?? g?.description ?? g?.shortDescription ?? localGame.desc,
        instructions:
          normalizeInstructions(g?.instructions) ??
          normalizeInstructions(g?.howTo) ??
          normalizeInstructions(g?.rules) ??
          localGame.instructions,
        render: localGame.render
      };
    })
    .filter(Boolean);

  // Backend-first, aber Fallback auf lokale Daten (z. B. wenn Backend leer/fehlerhaft ist)
  const games = backendMapped.length > 0 ? backendMapped : localGames;

  const currentIndex = games.findIndex((g) => g.id === selectedGame);
  const current = currentIndex >= 0 ? games[currentIndex] : null;

  return (
    <div className={styles.gamesPage}>
      <div className={styles.gamesConsole}>
        <div className={styles.gamesConsole__header}>
          <div className={styles.gamesConsole__title}>
            Willkommen in der Simulation
          </div>
          <div className={styles.gamesConsole__dots}>GAMES</div>
        </div>

        <div className={styles.gamesConsole__body}>
          <div className={styles.tileGrid}>
            {gamesLoading && <div aria-live="polite">Lade Spiele…</div>}
            {gamesError && <div aria-live="polite">{gamesError}</div>}
            {games.map((game) => (
              <button
                key={game.id}
                className={`${styles.tile} ${selectedGame === game.id ? styles.tileZoomed : ""}`}
                onClick={() => {
                  setSelectedGame(game.id);
                  setIsPlaying(false);
                  setModalPageIndex(0);
                }}
                aria-pressed={selectedGame === game.id}
              >
                <div className={styles.tile__inner}>
                  <h3 className={styles.tile__title}>{game.title}</h3>
                  <p className={styles.tile__desc}>{game.desc}</p>
                  <span className={styles.tile__action}>Details →</span>
                </div>
              </button>
            ))}
          </div>

          {current && (
            <div className={styles.overlay} role="dialog" aria-modal="true">
              <div className={styles.modal}>
                <button
                  className={styles.navLeft}
                  onClick={() => {
                    if (!current) return;
                    const instrCount = (current.instructions || []).length;
                    const total = instrCount + 1; // last page is Highscore
                    setModalPageIndex((i) => Math.max(0, i - 1));
                  }}
                  aria-label="Vorherige Seite"
                >
                  ‹
                </button>

                <div className={styles.modalContent}>
                  <header>
                    <h2 className={styles.modalTitle}>{current.title}</h2>
                    <p className={styles.modalDesc}>{current.desc}</p>
                  </header>

                  <div className={styles.modalMeta}>
                    {/* Inhalt: zeigt je nach modalPageIndex Instruktionsseite oder Highscore */}
                    {(() => {
                      const instr = current.instructions || [];
                      if (modalPageIndex < instr.length) {
                        return (
                          <div className={styles.instructionBlock}>
                            <div className={styles.instructionHeading}>
                              Anleitung (Seite {modalPageIndex + 1} /{" "}
                              {instr.length + 1})
                            </div>
                            <div className={styles.instructionText}>
                              {instr[modalPageIndex]}
                            </div>
                          </div>
                        );
                      }
                      // Highscore-Seite
                      return (
                        <div className={styles.metaBlock}>
                          <div className={styles.metaHeading}>Highscore</div>
                          <div className={styles.metaValue}>—</div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className={styles.modalActions}>
                    {!isPlaying && (
                      <button
                        className={styles.startBtn}
                        onClick={() => {
                          // Öffne das Spiel in einem zusätzlichen Overlay (nested)
                          setPlayingInOverlay(current.id);
                        }}
                      >
                        Spiel starten
                      </button>
                    )}

                    <button
                      className={styles.overlay__close}
                      onClick={() => {
                        setSelectedGame(null);
                        setIsPlaying(false);
                        setModalPageIndex(0);
                      }}
                    >
                      Schließen
                    </button>
                  </div>
                </div>

                <button
                  className={styles.navRight}
                  onClick={() => {
                    if (!current) return;
                    const instrCount = (current.instructions || []).length;
                    const total = instrCount + 1;
                    setModalPageIndex((i) => Math.min(total - 1, i + 1));
                  }}
                  aria-label="Nächste Seite"
                >
                  ›
                </button>
              </div>
            </div>
          )}

          {/* Nested overlay: öffnet das eigentliche Spiel über dem Info-Overlay */}
          {playingInOverlay && (
            <div
              className={styles.nestedOverlay}
              role="dialog"
              aria-modal="true"
            >
              <div className={styles.nestedContent}>
                <div className={styles.nestedHeader}>
                  <h3>{games.find((g) => g.id === playingInOverlay)?.title}</h3>
                  <button
                    className={styles.stopBtn}
                    onClick={() => setPlayingInOverlay(null)}
                  >
                    System Exit
                  </button>
                </div>
                <div className={styles.nestedBody}>
                  {games
                    .find((g) => g.id === playingInOverlay)
                    ?.render(() => setPlayingInOverlay(null))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
