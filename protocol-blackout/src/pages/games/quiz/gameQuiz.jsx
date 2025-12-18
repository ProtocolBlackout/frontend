import { useState } from "react";
import styles from "./gameQuiz.module.css";
// Hinweis: Fragen werden beim Start vom Backend geladen (wenn erreichbar).

function GameQuiz({ onBack }) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [theme, setTheme] = useState("green");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "green" ? "amber" : "green"));
  };

  const themeClass =
    theme === "green" ? styles.themeGreen : styles.themeAmber;

  const handleStart = async () => {
    setStarted(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setScore(0);

    // Fragen vom Backend laden
    setLoadingQuestions(true);
    setLoadError(null);
    try {
      const res = await fetch(`/games/quiz-01/questions`);
      if (!res.ok) throw new Error("Fehler beim Laden der Fragen");
      const data = await res.json();
      // Backend liefert { questionText, answers, correctIndex, gameId }
      // Mappe auf das lokale Format, das die Komponente erwartet:
      const mapped = data.map((q) => ({
        question: q.questionText || q.question || "",
        answers: q.answers || q.options || [],
        correctIndex:
          typeof q.correctIndex === "number"
            ? q.correctIndex
            : (q.answers || q.options || []).indexOf(q.answer),
      }));

      setQuestions(mapped);
    } catch (err) {
      console.error(err);
      setLoadError(err.message || "Fehler");
      // Fallback: falls lokale Datei `questions` existiert, importiere sie dynamisch
      try {
        const mod = await import("./questions.js");
        const fallback = mod.questions || mod.default || [];
        setQuestions(
          fallback.map((q) => ({
            question: q.question || q.questionText || "",
            answers: q.options || q.answers || [],
            correctIndex:
              typeof q.correctIndex === "number"
                ? q.correctIndex
                : (q.options || q.answers || []).indexOf(q.answer),
          }))
        );
      } catch (e) {
        console.warn("Kein Fallback-Questions-Modul gefunden", e);
        setQuestions([]);
      }
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswerClick = (index) => {
    const currentQuestion = questions[currentIndex];
    if (index === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
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
  };

  const renderContent = () => {
    if (!started) {
      return (
        <>
          <h1> SYSTEM_LOGIN</h1>
          <p className={styles.questionText}>
            Zugriff auf Sicherheits-Quiz anfordern.
            <br />
            10 Fragen. Bereit?
          </p>
          <button className={styles.retroBtn} onClick={handleStart}>
            [ VERBINDUNG HERSTELLEN ]
          </button>
          {loadingQuestions && <p>Lade Fragen…</p>}
          {loadError && <p className={styles.loadError}>Fehler: {loadError}</p>}
        </>
      );
    }

    if (isFinished) {
      return (
        <>
          <h1> SESSION_ENDED</h1>
          <p className={styles.questionText}>
            Analyse abgeschlossen.
            <br />
            <br />
            Ergebnis: {score} / {questions.length} Pakete gesichert.
          </p>
          <button className={styles.retroBtn} onClick={handleRestart}>
            [ NEUSTART ]
          </button>
        </>
      );
    }

    const currentQuestion = questions[currentIndex] || { question: "", answers: [] };
    return (
      <>
        <h2 className={styles.questionHeader}>
          FRAGE {currentIndex + 1} / {questions.length}
        </h2>

        <p className={styles.questionText}>{currentQuestion.question}</p>

        <div className={styles.answersContainer}>
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={index}
              className={styles.retroBtn}
              onClick={() => handleAnswerClick(index)}
            >
              {answer}
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={`${styles.appContainer} ${themeClass}`}>
      <button className={styles.backBtn} onClick={onBack}>
        ← SYSTEM_EXIT
      </button>

      <button className={styles.themeSwitchBtn} onClick={toggleTheme}>
        COLOR_MODE: {theme.toUpperCase()}
      </button>

      <div className={styles.monitorCasing}>
        <div className={styles.crtScreen}>
          <div className={styles.scanlines}></div>
          <div className={styles.overlay}></div>

          <div className={styles.uiContent}>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default GameQuiz;
