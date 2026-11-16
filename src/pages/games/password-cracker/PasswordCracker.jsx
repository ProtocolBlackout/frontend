import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestJson, getToken } from "../../../services/api.js";
import styles from "./PasswordCracker.module.css";

const PENDING_RESULT_KEY = "pbPendingGameResult";

// HINWEISE: Statisch im Frontend hinterlegt
const TARGET_HINTS = {
  jenny:
    "Jenny, Baujahr 1992, ist der kreative Kopf mit einem Faible für Fantasie und Technik gleichermaßen. Als leidenschaftliche Zockerin und überzeugter A Day to Remember-Fan liebt sie alles, was Herz, Action und Emotion vereint – ob im Game, beim Schreiben oder im Code. Mit ihrem Hintergrund in der Altenpflege bringt sie nicht nur Empathie und Geduld mit, sondern auch die Fähigkeit, Probleme strukturiert und mit ruhiger Hand zu lösen. Doch wer denkt, sie wäre nur ruhig und analytisch, irrt: Wenn sie über Batman oder ihre selbstgeschriebene Fantasy-Trilogie spricht, sprüht sie vor Begeisterung. Zwischen Blau, Rot und Lila findet sie ihre kreative Balance – und im Team sorgt sie mit ihrem Humor, ihrer Hartnäckigkeit und einem guten Schuss Fantasie dafür, dass selbst komplexe Ideen lebendig werden.",
  lulu: "Lulu, Baujahr 1988, bringt Punkrock, Idealismus und jede Menge Herzblut ins Team. Aufgewachsen in der ehemaligen DDR hat sie ein starkes Bewusstsein für Freiheit, Gerechtigkeit und Selbstbestimmung entwickelt – Werte, die sie in allem, was sie tut, verteidigt und lebt. In ihr steckt ein echtes Naturkind mit einem Sinn für das Wesentliche: frische Luft, ehrliche Worte und kreative Energie. Ihr treuer Hund Xara begleitet sie dabei auf Schritt und Tritt – ob bei langen Spaziergängen im Wald oder beim kreativen Handwerken, das sie als Ausgleich zu Kopf- und Bildschirmarbeit liebt. Trotz (oder gerade wegen) ihrer 1,50 m ist sie im Team als unser „Terrorzwerg“ bekannt – ein Wirbelwind, der nicht aufzuhalten ist, wenn sie sich für eine Idee begeistert. Mit Punkrock im Ohr, einem frischen Blick auf Probleme und einem unerschütterlichen Idealismus schafft sie es, kreative Prozesse in Bewegung zu bringen, wo andere stehen bleiben. Lulu ist unsere Stimme der Freiheit, unser Herz für Authentizität und ein Energiebündel, das jede Routine sprengt.",
  bella:
    "Bella, Baujahr 1993, ist unsere leidenschaftliche Slytherin mit einem Herzen für Fantasie und Emotionen. Sie ist die, die Struktur und Gefühl mit einer beeindruckenden Leichtigkeit vereint. Zwischen Kita-Alltag, Code und Dark-Romance-Romanen schafft sie es, rational zu denken und gleichzeitig mit dem Herzen zu führen. Wenn sie sich in ein Projekt stürzt, dann mit voller Leidenschaft – und wenn die Emotionen hochkochen, entstehen daraus oft kleine Explosionen voller Kreativität und Inspiration, die das ganze Team anstecken. Ihre Lieblingsfarbe Grün und die Zahl Sieben begleiten sie wie ein roter Faden – Symbole für Harmonie, Wachstum und Glück. Musikalisch lässt sie sich von Saltatio Mortis und Versengold tragen, die ihren Sinn für Tiefe, Geschichte und Melancholie perfekt widerspiegeln. Im Team bringt Bella Empathie, Organisationstalent und emotionale Tiefe zusammen – und sorgt damit dafür, dass jedes Projekt nicht nur funktioniert, sondern sich auch richtig anfühlt."
};

const PasswordCracker = ({ onBack }) => {
  const navigate = useNavigate();

  // Navigation Handler
  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigate("/games");
    }
  };

  // --- STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [targetsStatus, setTargetsStatus] = useState([]);

  const [inputWord, setInputWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [log, setLog] = useState([]);
  const [isHacking, setIsHacking] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);

  // Ergebnis nur einmal pro Seiten-Session speichern (verhindert Mehrfach-POSTs durch useEffect)
  const [hasSavedResult, setHasSavedResult] = useState(false);

  // RESULT UI STATE (Speicherstatus + Progress)
  // ERKLÄRUNG saveStatus:
  // Dieser State steuert, was im UI angezeigt wird, wenn das Ergebnis gespeichert wurde.
  //
  // Mögliche Werte:
  // idle  = noch nichts passiert (Standard)
  // guest = nicht eingeloggt (pending in sessionStorage)
  // saving = Ergebnis wird gerade ans Backend gesendet
  // saved = Ergebnis gespeichert + Progress neu geladen
  // error = Speichern oder Progress-Laden fehlgeschlagen
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveError, setSaveError] = useState("");
  const [progressAfterSave, setProgressAfterSave] = useState(null);

  // Gameplay Mechanics
  const [traceLevel, setTraceLevel] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const terminalBodyRef = useRef(null);

  // Hint-State
  const [isHintOpen, setIsHintOpen] = useState(false);

  // --- DATEN LADEN (Backend Fetch) ---
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        // Kein Fallback für PasswordCracker (nur Backend)
        const data = await requestJson("/games/password-cracker/config");

        const initializedTargets = data.targets.map((t) => ({
          ...t,
          solved: false
        }));

        setTargetsStatus(initializedTargets);

        // Beim Neuladen der Targets das Save-Flag zurücksetzen
        setHasSavedResult(false);

        // Save-UI zurücksetzen (wenn Config neu geladen wird)
        setSaveStatus("idle");
        setSaveError("");
        setProgressAfterSave(null);

        if (initializedTargets.length > 0) {
          setSelectedTargetId(initializedTargets[0].id);
        }

        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          "Fehler beim Laden der Zielsysteme. Server nicht erreichbar oder Konfiguration fehlt."
        );
        setIsLoading(false);
      }
    };

    fetchTargets();
  }, []);

  // Ergebnis speichern, sobald alle Targets gelöst sind
  useEffect(() => {
    // Nur speichern, wenn:
    // - Daten geladen sind
    // - noch nicht gespeichert wurde
    // - überhaupt Targets vorhanden sind
    if (hasSavedResult) return;
    if (isLoading) return;
    if (targetsStatus.length === 0) return;

    const solvedCount = targetsStatus.filter((t) => t.solved).length;
    const allSolved = solvedCount === targetsStatus.length;

    if (!allSolved) return;

    // Gastmodus: Wenn kein Token da ist, Ergebnis zwischenspeichern und Retry verhindern.
    // Sonst würde requestJson beim Speichern scheitern und Gäste würden auf /login umgeleitet.
    const token = getToken();
    if (!token) {
      sessionStorage.setItem(
        PENDING_RESULT_KEY,
        JSON.stringify({
          gameId: "cracker",
          score: solvedCount,
          createdAt: Date.now()
        })
      );

      // UI-Status setzen (Gastmodus)
      setSaveStatus("guest");
      setSaveError("");
      setProgressAfterSave(null);

      setHasSavedResult(true);
      return;
    }

    const saveResult = async () => {
      try {
        // UI: Speichervorgang startet
        setSaveStatus("saving");
        setSaveError("");
        setProgressAfterSave(null);

        await requestJson(
          "/games/cracker/result",
          {
            method: "POST",
            body: JSON.stringify({ score: solvedCount })
          },
          true
        );

        // Nach dem Speichern direkt Progress neu laden (XP/Level sofort sichtbar)
        const progressData = await requestJson(
          "/profile/progress",
          { method: "GET" },
          true
        );

        setProgressAfterSave(progressData?.progress ?? null);
        setSaveStatus("saved");

        setHasSavedResult(true);
        console.log("Erfolg: XP wurden gespeichert!");
      } catch (error) {
        setSaveStatus("error");
        setSaveError(error?.message ?? "Fehler beim Speichern");
      }
    };

    saveResult();
  }, [targetsStatus, isLoading, hasSavedResult]);

  // --- EFFECTS ---

  // Auto-Scroll Terminal
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [log]);

  // Reset Log on Target Switch
  useEffect(() => {
    if (!isLocked && selectedTargetId) {
      setLog([
        `> Zielsystem: ${selectedTargetId.toUpperCase()}_PC`,
        "> Verbindung hergestellt...",
        "> Warte auf Input..."
      ]);
      setWordList([]);
      setHackProgress(0);
    }
  }, [selectedTargetId, isLocked]);

  // Trace Level Logic
  useEffect(() => {
    if (traceLevel >= 100 && !isLocked) {
      setIsLocked(true);
      setLog((prev) => [
        ...prev,
        "!!! ALARM !!!",
        "!!! INTRUSION DETECTED !!!",
        "!!! VERBINDUNG GETRENNT !!!"
      ]);

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
            "> System wieder bereit."
          ]);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [traceLevel, isLocked]);

  // --- FUNKTIONEN ---

  const addLog = (text) => setLog((prev) => [...prev, text]);

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
    setTraceLevel((prev) => Math.min(prev + 15, 100));
    addLog("> Initialisiere Handshake...");

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

    if (!currentTarget) {
      setIsHacking(false);
      return;
    }

    const userWordsLower = wordList.map((w) => w.toLowerCase());

    const foundKeywords = currentTarget.requiredKeywords.filter((req) =>
      userWordsLower.includes(req.toLowerCase())
    );
    const missingCount =
      currentTarget.requiredKeywords.length - foundKeywords.length;

    if (missingCount === 0) {
      // SUCCESS
      setHackProgress(100);
      addLog(`> ACCESS GRANTED.`);
      addLog(`> Credentials extrahiert.`);
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
      setTraceLevel((prev) => Math.min(prev + 20, 100));
      addLog(`> WARNUNG: IDS Aktivität gestiegen!`);
    }

    setIsHacking(false);
  };

  const activeColor =
    targetsStatus.find((t) => t.id === selectedTargetId)?.color || "#00ff41";

  const hintText = selectedTargetId
    ? TARGET_HINTS[selectedTargetId] || "Kein Hinweis verfügbar."
    : "";

  // --- RENDER: Lade-Zustand ---
  if (isLoading) {
    return (
      <div className={styles.gameContainer}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Verbindung wird aufgebaut...</h2>
          <div className={styles.spacer}></div>
        </div>
        <div className={styles.terminal}>
          <div className={styles.logLine}>{">"} Initiiere Uplink...</div>
          <div className={styles.logLine}>
            <span className={styles.cursor}>_</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.gameContainer}>
        <div className={styles.headerRow}>
          <button onClick={handleBack} className={styles.backBtn}>
            &lt; Zurück
          </button>
        </div>
        <div className={`${styles.terminal} ${styles.terminalError}`}>
          <h3>VERBINDUNGSFEHLER</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.hackBtn}
          >
            Neustart versuchen
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: Spiel ---
  return (
    <div
      className={styles.gameContainer}
      style={{ "--target-color": activeColor }}
    >
      <div className={styles.headerRow}>
        <h2 className={styles.title}>
          PASSWORD CRACKER v4.3
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
        <div className={styles.spacer}></div>
      </div>

      {isLocked && (
        <div className={styles.lockOverlay}>
          <h2>SYSTEM LOCKED</h2>
          <p>Sicherheitsmaßnahmen aktiv.</p>
          <p>IP wird neu geroutet...</p>
        </div>
      )}

      <div className={styles.traceContainer}>
        <div className={styles.traceLabels}>
          <span>TRACE LEVEL</span>
          <span>{traceLevel}%</span>
        </div>
        <div className={styles.traceBarBg}>
          <div
            className={styles.traceBarFill}
            style={{
              width: `${traceLevel}%`,
              backgroundColor: traceLevel > 80 ? "red" : activeColor
            }}
          ></div>
        </div>
      </div>

      {/* --- Layout: Target-Auswahl --- */}
      <div className={styles.targetSelect}>
        {targetsStatus.map((target) => (
          <button
            key={target.id}
            disabled={isLocked || isHacking}
            onClick={() => setSelectedTargetId(target.id)}
            className={`${styles.targetBtn} ${
              selectedTargetId === target.id ? styles.active : ""
            } ${target.solved ? styles.solved : ""}`}
            style={{
              "--target-color": target.color
            }}
          >
            <div className={styles.targetName}>{target.name}</div>
            <div className={styles.diffBadge}>{target.difficulty}</div>
            {target.solved && <div className={styles.solvedIcon}>🔓</div>}
          </button>
        ))}
      </div>

      <div className={styles.workspace}>
        <div className={styles.panel}>
          <div className={styles.instruction}>
            Sammle Fragmente (Keywords), um das Passwort zu rekonstruieren.
          </div>

          {/* Speichern/Progress-Status */}
          {saveStatus === "guest" && (
            <div className={styles.instruction}>
              &gt; Gastmodus: Logge dich ein, um XP zu speichern.
            </div>
          )}

          {saveStatus === "saving" && (
            <div className={styles.instruction}>
              &gt; Speichere Ergebnis und aktualisiere Fortschritt…
            </div>
          )}

          {saveStatus === "saved" && progressAfterSave && (
            <div className={styles.instruction}>
              &gt; Fortschritt aktualisiert: Level {progressAfterSave.level} |
              XP {progressAfterSave.xp}
            </div>
          )}

          {saveStatus === "error" && (
            <div className={styles.instruction}>
              &gt; Speichern fehlgeschlagen: {saveError}
            </div>
          )}

          <form onSubmit={handleAddWord} className={styles.inputGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="Fragment eingeben..."
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              disabled={isLocked || isHacking}
              autoFocus
            />
          </form>

          <div className={styles.wordList}>
            {wordList.length === 0 && (
              <span className={styles.emptyInfo}>Keine Fragmente geladen.</span>
            )}
            {wordList.map((word, idx) => (
              <div key={idx} className={styles.wordTag}>
                {word}
                <span
                  className={styles.tagDel}
                  onClick={() => !isHacking && handleDeleteWord(word)}
                >
                  ×
                </span>
              </div>
            ))}
          </div>

          <button
            className={styles.hackBtn}
            onClick={startHack}
            disabled={
              isLocked ||
              isHacking ||
              wordList.length === 0 ||
              targetsStatus.find((t) => t.id === selectedTargetId)?.solved
            }
          >
            {isHacking
              ? `HACKING... ${hackProgress}%`
              : targetsStatus.find((t) => t.id === selectedTargetId)?.solved
                ? "SYSTEM GEKNACKT"
                : "EXECUTE HACK_v1.exe"}
          </button>
        </div>

        <div className={styles.terminal}>
          <div className={styles.terminalHeader}>
            root@kali-linux:~# tail -f /var/log/syslog
          </div>
          <div className={styles.terminalBody} ref={terminalBodyRef}>
            {log.map((line, i) => (
              <div key={i} className={styles.logLine}>
                {line}
              </div>
            ))}
            {!isLocked && <span className={styles.cursor}>_</span>}
          </div>
        </div>
      </div>

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
                Hinweis: {selectedTargetId?.toUpperCase()}
              </div>
              <div className={styles.hintOverlayText}>{hintText}</div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default PasswordCracker;
