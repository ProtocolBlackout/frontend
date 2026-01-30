import { useState, useEffect } from "react";
import { requestJson, getToken } from "../../../services/api.js";
import styles from "./gameQuiz.module.css";

const PENDING_RESULT_KEY = "pbPendingGameResult";

// Hinweis: Fragen werden beim Start vom Backend geladen (wenn erreichbar).
// Falls nicht, greift der automatische Fallback auf './questions.js'.

function GameQuiz() {
  // --- STATE ---
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Theme wurde entfernt — statisches Aussehen

  // --- RESULT HANDLING (Ergebnis speichern) ---
  useEffect(() => {
    // Nur ausführen, wenn das Spiel zu Ende ist
    if (!isFinished) return;

    // Gastmodus: Wenn kein Token da ist, Ergebnis zwischenspeichern
    // und NICHT speichern (sonst werden Gäste nach Spielende automatisch zur Login-Seite geschickt).
    const token = getToken();

    if (!token) {
      sessionStorage.setItem(
        PENDING_RESULT_KEY,
        JSON.stringify({
          gameId: "quiz",
          score,
          createdAt: Date.now()
        })
      );
      return;
    }

    const saveResults = async () => {
      try {
        // Wichtig:
        // - KEIN hardcoded localhost
        // - KEIN manuelles Token-Handling
        // -> requestJson nutzt backendBaseUrl und hängt (wenn needsAuth=true) den Bearer Token an
        // -> bei 401 wird automatisch Token gelöscht + Redirect auf /login gemacht
        await requestJson(
          "/games/quiz/result",
          {
            method: "POST",
            body: JSON.stringify({ score })
          },
          true
        );

        console.log("Erfolg: XP wurden gespeichert!");
      } catch (error) {
        // Falls Speichern fehlschlägt (z. B. Netzwerk/Backend nicht erreichbar oder Token abgelaufen)
        console.error("Fehler beim Speichern:", error.message);
      }
    };

    saveResults();
  }, [isFinished, score]);

  // --- LOGIC: START & LOAD QUESTIONS ---
  const handleStart = async () => {
    setStarted(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setLoadingQuestions(true);
    setLoadError(null);

    let loadedQuestions = [];

    try {
      // 1. Versuch: Backend abfragen
      const data = await requestJson("/games/quiz/questions");

      // Mappe Backend-Daten auf unser Frontend-Format
      const mapped = data.map((q) => ({
        question: q.questionText || q.question || "",
        answers: q.answers || q.options || [],
        correctIndex:
          typeof q.correctIndex === "number"
            ? q.correctIndex
            : (q.answers || q.options || []).indexOf(q.answer)
      }));

      loadedQuestions = mapped;
    } catch (err) {
      console.warn("Backend-Load fehlgeschlagen, nutze Fallback:", err.message);

      // 2. Fallback: Lokale Datei importieren
      try {
        const mod = await import("./questions.js");
        // Sicherstellen, dass wir das Array erwischen (egal ob default export oder named export)
        const rawQuestions = mod.questions || mod.default || [];

        const mappedFallback = rawQuestions.map((q) => ({
          question: q.question || q.questionText || "",
          answers: q.options || q.answers || [],
          correctIndex:
            typeof q.correctIndex === "number"
              ? q.correctIndex
              : (q.options || q.answers || []).indexOf(q.answer)
        }));
        loadedQuestions = mappedFallback;
      } catch (e) {
        console.error(
          "Kritischer Fehler: Auch Fallback konnte nicht geladen werden",
          e
        );
        setLoadError("Systemfehler: Keine Fragen verfügbar.");
      }
    }

    // Abschluss-Logik: Mischen & Setzen
    if (loadedQuestions.length > 0) {
      // Zufällig mischen und auf maximal 10 Fragen begrenzen
      const shuffled = loadedQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      setQuestions(shuffled);
      // Wichtig: Fehler löschen, da wir ja jetzt Fragen haben (der Fallback hat funktioniert)
      setLoadError(null);
    } else {
      setLoadError("Keine Fragen gefunden.");
    }

    setLoadingQuestions(false);
  };

  // --- LOGIC: ANSWER HANDLING ---
  const handleAnswerClick = (index) => {
    const currentQuestion = questions[currentIndex];

    // Punkte zählen
    if (index === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }

    // Nächste Frage oder Ende
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setIsFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setQuestions([]);
  };

  // --- RENDER HELPERS ---

  // 1. Start Screen
  const renderStartScreen = () => (
    <div className={styles.contentArea}>
      <p className={styles.introText}>
        &gt; SYSTEM_LOGIN REQUIRED
        <br />
        <br />
        Fordern Sie Zugriff auf das Sicherheits-Quiz an.
        <br />
        10 Fragen. 10 Chancen.
      </p>

      {/* Zeige Fehler nur an, wenn wir WIRKLICH keine Fragen laden konnten (auch nicht lokal) */}
      {loadError && <div className={styles.errorMsg}>ERROR: {loadError}</div>}

      {loadingQuestions ? (
        <p className={styles.introText}>&gt; Lade Module...</p>
      ) : (
        <button className={styles.actionBtn} onClick={handleStart}>
          [ VERBINDUNG HERSTELLEN ]
        </button>
      )}
    </div>
  );

  // 2. Result Screen
  const renderResultScreen = () => (
    <div className={styles.contentArea}>
      <h2 className={styles.title}>ANALYSE ABGESCHLOSSEN</h2>

      <div className={styles.scoreDisplay}>
        SCORE: {score} / {questions.length}
      </div>

      <p className={styles.resultText}>
        {score >= 8
          ? "> ZUGRIFF GEWÄHRT. Systemintegrität bestätigt."
          : "> ZUGRIFF VERWEIGERT. Sicherheitslücken erkannt."}
      </p>

      <button className={styles.actionBtn} onClick={handleRestart}>
        [ NEUSTART ]
      </button>
    </div>
  );

  // 3. Question Screen
  const renderQuestionScreen = () => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return <div>Ladefehler...</div>;

    return (
      <div className={styles.contentArea}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            color: "#666",
            fontSize: "0.8rem"
          }}
        >
          <span>
            FRAGE {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <h3 className={styles.questionText}>{currentQuestion.question}</h3>

        <div className={styles.answersContainer}>
          {currentQuestion.answers.map((answer, idx) => (
            <button
              key={idx}
              className={styles.answerBtn}
              onClick={() => handleAnswerClick(idx)}
            >
              {`> ${answer}`}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.gameContainer}>
      {/* Header Row - Angepasst an PasswordCracker Style */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>SECURITY_QUIZ v2.0</h1>
      </div>

      {/* Main Content Switch */}
      {!started && renderStartScreen()}
      {started && !isFinished && renderQuestionScreen()}
      {isFinished && renderResultScreen()}
    </div>
  );
}

export default GameQuiz;
