import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./passwordCracker.module.css";
import Button from '../../../components/button';

// KONFIGURATION: Lösungen
const TARGETS = [
  {
    id: "jenny",
    name: "Jenny (Frontend)",
    requiredKeywords: ["bello", "1995"],
    solved: false,
  },
  {
    id: "lulu",
    name: "Lulu (Backend)",
    requiredKeywords: ["dune", "scifi"],
    solved: false,
  },
  {
    id: "bella",
    name: "Bella (Gamedev)",
    requiredKeywords: ["falcons", "2077"],
    solved: false,
  },
];


const GamePasswordCracker = ({ onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      // fallback: navigate to games overview
      navigate("/games");
    }
  };
  const [selectedTargetId, setSelectedTargetId] = useState(TARGETS[0].id);
  const [inputWord, setInputWord] = useState("");
  const [wordList, setWordList] = useState([]);
  const [log, setLog] = useState([]);
  const [isHacking, setIsHacking] = useState(false);
  const [targetsStatus, setTargetsStatus] = useState(TARGETS);

  // NEU: Ein Fortschrittsbalken für die "Passwort-Integrität"
  const [hackProgress, setHackProgress] = useState(0);

  const addLog = (text) => {
    setLog((prev) => [...prev, text]);
  };

  useEffect(() => {
    const terminal = document.getElementById("terminal-body");
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }, [log]);

  // Wenn man das Ziel wechselt, setzen wir den Log und Fortschritt zurück
  useEffect(() => {
    setLog([`> Zielsystem ausgewählt: ${selectedTargetId.toUpperCase()}_PC`, "> Warte auf Input..."]);
    setWordList([]);
    setHackProgress(0);
  }, [selectedTargetId]);

  const handleAddWord = (e) => {
    e.preventDefault();
    if (!inputWord.trim()) return;

    if (!wordList.includes(inputWord.trim())) {
      setWordList([...wordList, inputWord.trim()]);
      // Kleines Feedback im Log beim Hinzufügen
      addLog(`> Fragment geladen: "${inputWord}"`);
    }
    setInputWord("");
  };

  // --- DIE VERBESSERTE LOGIK ---
  const startHack = () => {
    if (wordList.length === 0) {
      addLog("> ERROR: Keine Fragmente geladen.");
      return;
    }

    setIsHacking(true);
    setHackProgress(10); // Start-Animation
    addLog("> Initialisiere Brute-Force Routine...");

    setTimeout(() => {
      addLog("> Analysiere Wort-Kombinationen...");
      setHackProgress(40);
    }, 800);

    // Die eigentliche Prüfung passiert nach 2 Sekunden
    setTimeout(() => {
      const currentTarget = targetsStatus.find(t => t.id === selectedTargetId);
      const userWordsLower = wordList.map(w => w.toLowerCase());

      // 1. Welche Keywords wurden gefunden?
      const foundKeywords = currentTarget.requiredKeywords.filter(req =>
        userWordsLower.includes(req.toLowerCase())
      );

      // 2. Welche fehlen noch?
      const missingCount = currentTarget.requiredKeywords.length - foundKeywords.length;

      // 3. Berechnung der "Integrität" (Wie nah ist man dran?)
      const totalRequired = currentTarget.requiredKeywords.length;
      const successRate = (foundKeywords.length / totalRequired) * 100;

      setHackProgress(successRate === 100 ? 100 : successRate > 0 ? 60 : 0);

      // --- FEEDBACK GEBEN ---

      if (missingCount === 0) {
        // PERFEKT
        addLog(`> HASH GEKNACKT! Passwort rekonstruiert.`);
        addLog(`> Login erfolgreich.`);
        setTargetsStatus(prev => prev.map(t =>
          t.id === selectedTargetId ? { ...t, solved: true } : t
        ));
      } else if (foundKeywords.length > 0) {
        // TEILERFOLG (Das macht Spaß!)
        addLog(`> WARNUNG: Passwort unvollständig.`);
        addLog(`> ANGLEICHUNG: ${foundKeywords.length} von ${totalRequired} Fragmenten korrekt.`);

        // Tipp geben, was korrekt war
        foundKeywords.forEach(word => {
          addLog(`> VERIFIZIERT: Segment "${word}" ist Teil des Schlüssels.`);
        });
        addLog(`> Tipp: Es fehlen noch weitere Segmente.`);
      } else {
        // NICHTS GEFUNDEN
        addLog(`> FEHLER: Keine Übereinstimmung.`);
        addLog(`> Analyse: Die eingegebenen Fragmente sind irrelevant.`);
      }

      setIsHacking(false);
    }, 2500);
  };

  return (
    <div className={styles.gameContainer}>

      <Button className={styles.backBtn} onClick={handleBack}>
        ← SYSTEM_EXIT
      </Button>

      <h2 className={styles.title}>PASSWORD CRACKER v2.0</h2>

      <div className={styles.targetSelect}>
        <span className={styles.label}>ZIEL:</span>
        <div className={styles.buttonGroup}>
          {targetsStatus.map((target) => (
            <button
              key={target.id}
              onClick={() => setSelectedTargetId(target.id)}
              className={`${styles.targetBtn} ${selectedTargetId === target.id ? styles.active : ""} ${target.solved ? styles.solved : ""}`}
            >
              {target.name} {target.solved && " [GEHACKT]"}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.panel}>
          <h3>Fragment-Generator</h3>
          <p className={styles.instruction}>
            Kombiniere Hinweise aus den Mitarbeiter-Profilen (OSINT).
          </p>

          <form onSubmit={handleAddWord} className={styles.inputGroup}>
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="Hinweis eingeben..."
              className={styles.input}
              disabled={isHacking || targetsStatus.find(t => t.id === selectedTargetId).solved}
            />
            <Button type="submit" className={styles.addBtn} disabled={isHacking}>
              LOAD
            </Button>
          </form>

          <div className={styles.wordList}>
            {wordList.map((word, idx) => (
              <span key={idx} className={styles.wordTag}>
                {word}
                <Button
                  onClick={() => setWordList(wordList.filter(w => w !== word))}
                  className={styles.deleteTag}
                  disabled={isHacking}
                >x</Button>
              </span>
            ))}
          </div>

          <Button
            onClick={startHack}
            className={styles.hackBtn}
            disabled={isHacking || targetsStatus.find(t => t.id === selectedTargetId).solved}
          >
            {isHacking ? "DECODING..." : "EXECUTE HASHCAT"}
          </Button>
        </div>

        <div className={styles.terminal}>
          <div className={styles.terminalHeader}>
            SYSTEM STATUS: {isHacking ? "BUSY" : "IDLE"}
          </div>

          {/* Ladebalken Visualisierung */}
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${hackProgress}%`, backgroundColor: hackProgress === 100 ? '#0f0' : hackProgress > 0 ? 'orange' : '#333' }}
            ></div>
          </div>

          <div id="terminal-body" className={styles.terminalBody}>
            {log.map((line, index) => (
              <div key={index} className={styles.logLine} style={{
                color: line.includes("ERROR") ? "red" : line.includes("SUCCESS") || line.includes("GEKNACKT") ? "#0f0" : line.includes("VERIFIZIERT") ? "orange" : "inherit"
              }}>
                {line}
              </div>
            ))}
            {isHacking && <div className={styles.logLine}>_</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePasswordCracker;
