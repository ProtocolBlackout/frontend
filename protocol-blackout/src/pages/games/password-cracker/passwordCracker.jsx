import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./passwordCracker.module.css";

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

  // Gameplay Mechanics
  const [traceLevel, setTraceLevel] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const terminalBodyRef = useRef(null);

  // --- DATEN LADEN (Backend Fetch) ---
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        // HINWEIS: URL anpassen, falls euer Backend woanders läuft
        const response = await fetch("http://localhost:3000/games/password-cracker/config");

        if (!response.ok) {
          throw new Error("Verbindung zum Server fehlgeschlagen");
        }

        const data = await response.json();

        // Solved-Status initialisieren
        const initializedTargets = data.targets.map((t) => ({
          ...t,
          solved: false,
        }));

        setTargetsStatus(initializedTargets);

        // Erstes Ziel auswählen
        if (initializedTargets.length > 0) {
          setSelectedTargetId(initializedTargets[0].id);
        }

        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Fehler beim Laden der Zielsysteme. Ist das Backend gestartet?");
        setIsLoading(false);
      }
    };

    fetchTargets();
  }, []);

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

  // --- FUNKTIONEN ---

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
    // Finde das aktuelle Target im State
    const currentTarget = targetsStatus.find((t) => t.id === selectedTargetId);
    
    // Falls (warum auch immer) kein Target gefunden wird -> Abbruch
    if (!currentTarget) {
        setIsHacking(false);
        return;
    }

    const userWordsLower = wordList.map((w) => w.toLowerCase());

    // Check Keywords (kamen vom Backend)
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
  const activeColor =
    targetsStatus.find((t) => t.id === selectedTargetId)?.color || "#00ff41";

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
           <div className={styles.logLine}><span className={styles.cursor}>_</span></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.gameContainer}>
       
        <div className={styles.terminal} style={{ borderColor: 'red', color: 'red' }}>
           <h3>VERBINDUNGSFEHLER</h3>
           <p>{error}</p>
           <button onClick={() => window.location.reload()} className={styles.hackBtn}>Neustart versuchen</button>
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
      {/* Header */}
      <div className={styles.headerRow}>
        <h2 className={styles.title}>PASSWORD CRACKER v1.0</h2>
        <div className={styles.spacer}></div>
      </div>

      {/* Lockout Overlay */}
      {isLocked && (
        <div className={styles.lockOverlay}>
          <h2>SYSTEM LOCKED</h2>
          <p>Sicherheitsmaßnahmen aktiv.</p>
          <p>IP wird neu geroutet...</p>
        </div>
      )}

      {/* Trace Level Bar */}
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
              backgroundColor: traceLevel > 80 ? "red" : activeColor,
            }}
          ></div>
        </div>
      </div>

      {/* Target Selection */}
      <div className={styles.targetSelect}>
        {targetsStatus.map((target) => (
          <button
            key={target.id}
            disabled={isLocked || isHacking}
            onClick={() => setSelectedTargetId(target.id)}
            className={`${styles.targetBtn} ${
              selectedTargetId === target.id ? styles.active : ""
            } ${target.solved ? styles.solved : ""}`}
            style={{ "--target-color": target.color }}
          >
            <div className={styles.targetName}>{target.name}</div>
            <div className={styles.diffBadge}>{target.difficulty}</div>
            {target.solved && <div className={styles.solvedIcon}>🔓</div>}
          </button>
        ))}
      </div>

      {/* Main Workspace */}
      <div className={styles.workspace}>
        {/* Left Panel: Inputs */}
        <div className={styles.panel}>
          <div className={styles.instruction}>
             Sammle Fragmente (Keywords), um das Passwort zu rekonstruieren.
          </div>

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
              <span className={styles.emptyInfo}>
                Keine Fragmente geladen.
              </span>
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
              isLocked || isHacking || wordList.length === 0 || targetsStatus.find(t => t.id === selectedTargetId)?.solved
            }
          >
            {isHacking
              ? `HACKING... ${hackProgress}%`
              : targetsStatus.find(t => t.id === selectedTargetId)?.solved
              ? "SYSTEM GEKNACKT"
              : "EXECUTE HACK_v1.exe"}
          </button>
        </div>

        {/* Right Panel: Terminal Log */}
        <div className={styles.terminal} style={{ borderColor: activeColor }}>
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
    </div>
  );
};

export default PasswordCracker;
