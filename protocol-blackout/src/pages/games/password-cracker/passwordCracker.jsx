import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./passwordCracker.module.css";

// KONFIGURATION: Ziele & Lösungen (Version A)
const TARGETS = [
  {
    id: "jenny",
    name: "Jenny (Frontend)",
    requiredKeywords: ["Gaming", "Batman"],
    solved: false,
    difficulty: "LOW",
    color: "#00bfff", // Blau
  },
  {
    id: "lulu",
    name: "Lulu (Backend)",
    requiredKeywords: ["Xara", "Berlin"],
    solved: false,
    difficulty: "MED",
    color: "#ffaa00", // Orange
  },
  {
    id: "bella",
    name: "Bella (Gamedev)",
    requiredKeywords: ["Slytherin", "2022"],
    solved: false,
    difficulty: "HIGH",
    color: "#00ff41", // Grün
  },
];

// Hints pro Ziel (außerhalb ist OK, da keine Hooks)
const TARGET_HINTS = {
  jenny: "Jenny, Baujahr 1992, ist der kreative Kopf mit einem Faible für Fantasie und Technik gleichermaßen. Als leidenschaftliche Zockerin und überzeugter A Day to Remember-Fan liebt sie alles, was Herz, Action und Emotion vereint – ob im Game, beim Schreiben oder im Code. Mit ihrem Hintergrund in der Altenpflege bringt sie nicht nur Empathie und Geduld mit, sondern auch die Fähigkeit, Probleme strukturiert und mit ruhiger Hand zu lösen. Doch wer denkt, sie wäre nur ruhig und analytisch, irrt: Wenn sie über Batman oder ihre selbstgeschriebene Fantasy-Trilogie spricht, sprüht sie vor Begeisterung. Zwischen Blau, Rot und Lila findet sie ihre kreative Balance – und im Team sorgt sie mit ihrem Humor, ihrer Hartnäckigkeit und einem guten Schuss Fantasie dafür, dass selbst komplexe Ideen lebendig werden.",
  lulu: "Lulu, Baujahr 1988, bringt Punkrock, Idealismus und jede Menge Herzblut ins Team. Aufgewachsen in der ehemaligen DDR hat sie ein starkes Bewusstsein für Freiheit, Gerechtigkeit und Selbstbestimmung entwickelt – Werte, die sie in allem, was sie tut, verteidigt und lebt. In ihr steckt ein echtes Naturkind mit einem Sinn für das Wesentliche: frische Luft, ehrliche Worte und kreative Energie. Ihr treuer Hund Xara begleitet sie dabei auf Schritt und Tritt – ob bei langen Spaziergängen im Wald oder beim kreativen Handwerken, das sie als Ausgleich zu Kopf- und Bildschirmarbeit liebt. Trotz (oder gerade wegen) ihrer 1,50 m ist sie im Team als unser „Terrorzwerg“ bekannt – ein Wirbelwind, der nicht aufzuhalten ist, wenn sie sich für eine Idee begeistert. Mit Punkrock im Ohr, einem frischen Blick auf Probleme und einem unerschütterlichen Idealismus schafft sie es, kreative Prozesse in Bewegung zu bringen, wo andere stehen bleiben. Lulu ist unsere Stimme der Freiheit, unser Herz für Authentizität und ein Energiebündel, das jede Routine sprengt.",
  bella: "Bella, Baujahr 1993, ist unsere leidenschaftliche Slytherin mit einem Herzen für Fantasie und Emotionen. Sie ist die, die Struktur und Gefühl mit einer beeindruckenden Leichtigkeit vereint. Zwischen Kita-Alltag, Code und Dark-Romance-Romanen schafft sie es, rational zu denken und gleichzeitig mit dem Herzen zu führen. Wenn sie sich in ein Projekt stürzt, dann mit voller Leidenschaft – und wenn die Emotionen hochkochen, entstehen daraus oft kleine Explosionen voller Kreativität und Inspiration, die das ganze Team anstecken. Ihre Lieblingsfarbe Grün und die Zahl Sieben begleiten sie wie ein roter Faden – Symbole für Harmonie, Wachstum und Glück. Musikalisch lässt sie sich von Saltatio Mortis und Versengold tragen, die ihren Sinn für Tiefe, Geschichte und Melancholie perfekt widerspiegeln. Im Team bringt Bella Empathie, Organisationstalent und emotionale Tiefe zusammen – und sorgt damit dafür, dass jedes Projekt nicht nur funktioniert, sondern sich auch richtig anfühlt.",
};

const PasswordCracker = ({ onBack }) => {
  const navigate = useNavigate();

  // Navigation Handler (Integration für Jennys Framework)
  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      // Fallback, falls keine prop übergeben wurde
      navigate("/games");
    }
  };

  const [selectedTargetId, setSelectedTargetId] = useState(TARGETS[0].id);
  const [inputWord, setInputWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [log, setLog] = useState([]);
  const [isHacking, setIsHacking] = useState(false);
  const [targetsStatus, setTargetsStatus] = useState(TARGETS);
  const [hackProgress, setHackProgress] = useState(0);

  // Gameplay Mechanics (Version A: Trace & Lockout)
  const [traceLevel, setTraceLevel] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // NEU: Hint-State
  const [isHintOpen, setIsHintOpen] = useState(false);

  // NEU: Hint-Text ableiten (muss NACH selectedTargetId State sein)
  const hintText = TARGET_HINTS[selectedTargetId] ?? "Kein Hinweis verfügbar.";

  const terminalBodyRef = useRef(null);

  // Auto-Scroll Terminal
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [log]);

  // Reset Log on Target Switch
  useEffect(() => {
    if (!isLocked) {
      setLog([
        `> Zielsystem: ${selectedTargetId.toUpperCase()}_PC`,
        "> Verbindung hergestellt...",
        "> Warte auf Input...",
      ]);
      setWordList([]);
      setHackProgress(0);
    }
  }, [selectedTargetId, isLocked]);

  // Trace Level Logic: Lockout bei 100%
  useEffect(() => {
    if (traceLevel >= 100 && !isLocked) {
      setIsLocked(true);
      setLog((prev) => [
        ...prev,
        "!!! ALARM !!!",
        "!!! INTRUSION DETECTED !!!",
        "!!! VERBINDUNG GETRENNT !!!",
      ]);

      // Cooldown Timer (10s Strafe)
      let countdown = 10;
      const interval = setInterval(() => {
        countdown -= 1;
        if (countdown <= 0) {
          clearInterval(interval);
          setTraceLevel(0);
          setIsLocked(false);
          setLog((prev) => [
            ...prev,
            "> Neue IP-Adresse generiert.",
            "> System wieder bereit.",
          ]);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [traceLevel, isLocked]);

  const addLog = (text) => setLog((prev) => [...prev, text]);

  // Visual Effect: Hex Dump
  const generateHexDump = () => {
    const chars = "0123456789ABCDEF";
    let dump = "";
    for (let i = 0; i < 8; i++) {
      dump += chars[Math.floor(Math.random() * 16)];
    }
    return `0x${dump}... CHECKING MEMORY`;
  };

  const handleAddWord = (e) => {
    e.preventDefault();
    if (isLocked || !inputWord.trim()) return;

    if (!wordList.includes(inputWord.trim())) {
      setWordList([...wordList, inputWord.trim()]);
      addLog(`> Fragment geladen: "${inputWord}"`);
      // Risiko steigt leicht bei jeder Aktion
      setTraceLevel((prev) => Math.min(prev + 5, 100));
    }
    setInputWord("");
  };

  const handleDeleteWord = (wordToDelete) => {
    setWordList(wordList.filter((w) => w !== wordToDelete));
  };

  const startHack = () => {
    if (wordList.length === 0) {
      addLog("> ERROR: Keine Fragmente. Abbruch.");
      return;
    }
    setIsHacking(true);
    setHackProgress(5);
    // Risiko steigt deutlich bei Attacke
    setTraceLevel((prev) => Math.min(prev + 15, 100));

    addLog("> Initialisiere Handshake...");

    // Animations-Phase
    let steps = 0;
    const hexInterval = setInterval(() => {
      steps++;
      addLog(generateHexDump());
      setHackProgress((prev) => Math.min(prev + 10, 90));

      if (steps > 5) {
        clearInterval(hexInterval);
        finishHack();
      }
    }, 300);
  };

  const finishHack = () => {
    const currentTarget = targetsStatus.find((t) => t.id === selectedTargetId);
    const userWordsLower = wordList.map((w) => w.toLowerCase());

    // Check Keywords
    const foundKeywords = currentTarget.requiredKeywords.filter((req) =>
      userWordsLower.includes(req.toLowerCase())
    );
    const missingCount = currentTarget.requiredKeywords.length - foundKeywords.length;

    if (missingCount === 0) {
      // SUCCESS
      setHackProgress(100);
      addLog(`> ACCESS GRANTED.`);
      addLog(`> Credentials extrahiert.`);
      // Risiko sinkt bei Erfolg
      setTraceLevel(0);
      setTargetsStatus((prev) =>
        prev.map((t) =>
          t.id === selectedTargetId ? { ...t, solved: true } : t
        )
      );
    } else {
      // FAIL
      setHackProgress(0);
      addLog(`> ACCESS DENIED.`);
      if (foundKeywords.length > 0) {
        addLog(`> Teilerfolg: ${foundKeywords.length} Segmente verifiziert.`);
      }
      // Strafe: Trace Level steigt massiv
      setTraceLevel((prev) => Math.min(prev + 20, 100));
      addLog(`> WARNUNG: IDS Aktivität gestiegen!`);
    }
    setIsHacking(false);
  };

  // Helper to get color of current target
  const activeColor = targetsStatus.find(t => t.id === selectedTargetId)?.color || "#00ff41";

  return (
    <div
      className={styles.gameContainer}
      style={{ "--target-color": activeColor }}
    >
      {/* LOCKOUT OVERLAY */}
      {isLocked && (
        <div className={styles.lockedState}>
          <div className={styles.lockOverlay}>
            <h2>SYSTEM LOCKOUT</h2>
            <p>Sicherheitsmaßnahmen aktiv.</p>
            <p>IP wird neu geroutet...</p>
          </div>
        </div>
      )}

      {/* LINKS: Hauptinhalt (bisheriges Spiel) */}
      <div className={styles.mainContent}>
        {/* HEADER NAV */}

        <div className={styles.headerRow}>
          <button onClick={handleBack} className={styles.backBtn}>
            &lt; ZURÜCK
          </button>
          <h2 className={styles.title}>
            PASSWORD CRACKER v2.0
            <span className={styles.hintArea}>
              <button
                type="button"
                className={styles.hintBtn}
                onClick={() => setIsHintOpen(true)}
                disabled={isLocked || isHacking}
                aria-label="Hinweis anzeigen"
              >
                ?
              </button>
            </span>
          </h2>
          <div className={styles.spacer}>{/* Für Zentrierung */}</div>
        </div>

        {/* TRACE LEVEL BAR */}
        <div className={styles.traceContainer}>
          <div className={styles.traceLabels}>
            <span>DETECTION RISK</span>
            <span>{traceLevel}%</span>
          </div>
          <div className={styles.traceBarBg}>
            <div
              className={styles.traceBarFill}
              style={{
                width: `${traceLevel}%`,
                backgroundColor:
                  traceLevel >= 80 ? "red" : traceLevel >= 50 ? "orange" : activeColor,
              }}
            />
          </div>
        </div>

        {/* TARGET SELECTOR */}
        <div className={styles.targetSelect}>
          {targetsStatus.map((target) => (
            <button
              key={target.id}
              onClick={() => setSelectedTargetId(target.id)}
              disabled={isLocked || isHacking}
              className={`${styles.targetBtn} ${selectedTargetId === target.id ? styles.active : ""
                } ${target.solved ? styles.solved : ""}`}
              style={{ "--btn-color": target.color }}
            >
              <span className={styles.targetName}>{target.name}</span>
              <span className={styles.diffBadge}>{target.difficulty}</span>
              {target.solved && <span className={styles.solvedIcon}>✓</span>}
            </button>
          ))}
        </div>

        {/* WORKSPACE */}
        <div className={styles.workspace}>
          {/* LEFT PANEL INPUT */}
          <div className={styles.panel}>
            <div className={styles.instruction}>
              Ziel: Finde die versteckten Passwörter durch Hinweise im Profil.
            </div>

            <form onSubmit={handleAddWord} className={styles.inputGroup}>
              <input
                className={styles.input}
                type="text"
                placeholder="Code-Fragment eingeben..."
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                disabled={isLocked || isHacking}
                autoFocus
              />
            </form>

            <div className={styles.wordList}>
              {wordList.map((word, idx) => (
                <span key={idx} className={styles.wordTag}>
                  {word}
                  {!isHacking && !isLocked && (
                    <span
                      className={styles.tagDel}
                      onClick={() => handleDeleteWord(word)}
                    >
                      ×
                    </span>
                  )}
                </span>
              ))}
              {wordList.length === 0 && (
                <span className={styles.emptyInfo}>Keine Fragmente geladen...</span>
              )}
            </div>

            <button
              className={styles.hackBtn}
              onClick={startHack}
              disabled={isLocked || isHacking || wordList.length === 0}
            >
              {isHacking ? `RUNNING... ${hackProgress}%` : "EXECUTE HACK"}
            </button>
          </div>

          {/* RIGHT PANEL TERMINAL */}
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              root@blackout:{selectedTargetId}:cracktool.exe
            </div>

            <div className={styles.terminalBody} ref={terminalBodyRef}>
              {log.map((line, i) => (
                <div key={i} className={styles.logLine}>
                  {line}
                </div>
              ))}
              {isHacking && <div className={styles.cursor}>▮</div>}
            </div>
          </div>
        </div>
      </div>

      {/* RECHTS: Hint-Bereich (nur Button, Overlay bei Klick) */}
      <aside className={styles.hintArea}>
        {isHintOpen && (
          <div className={styles.hintOverlay}>
            <div className={styles.hintOverlayBox}>
              <button
                className={styles.hintOverlayClose}
                onClick={() => setIsHintOpen(false)}
                aria-label="Overlay schließen"
              >
                ×
              </button>
              <div className={styles.hintOverlayTitle}>
                Hinweis: {selectedTargetId.toUpperCase()}
              </div>
              <div className={styles.hintOverlayText}>{hintText}</div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default PasswordCracker;