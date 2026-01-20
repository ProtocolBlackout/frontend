import { useState, useMemo } from "react";
import Button from "../../../components/button";
import styles from "./phishingFinder.module.css";
import { initialEmails } from "./phishingFinderData";

function PhishingFinder({ onBack }) {
  const [emails, setEmails] = useState(
    initialEmails.map((e) => ({ ...e, status: "new", userVerdict: null, userOptions: [] }))
  );
  
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [step, setStep] = useState("READING");
  const [currentSelection, setCurrentSelection] = useState([]);
  
  // Neuer State: Game Over
  const [gameState, setGameState] = useState("PLAYING"); // 'PLAYING' | 'FINISHED'

  // --- HANDLER ---
  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setStep("READING");
    setCurrentSelection([]);
  };

  const handleCloseOverlay = () => setSelectedEmail(null);

  const handleVerdict = (verdict) => {
    if (verdict === "PHISHING") {
      setStep("ANALYZING");
    } else {
      saveResultAndClose(selectedEmail.id, "LEGIT", []);
    }
  };

  const toggleOption = (id) => {
    setCurrentSelection(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmitAnalysis = () => {
    saveResultAndClose(selectedEmail.id, "PHISHING", currentSelection);
  };

  const saveResultAndClose = (id, verdict, options) => {
    const updated = emails.map(e => 
      e.id === id 
      ? { ...e, status: "processed", userVerdict: verdict, userOptions: options } 
      : e
    );
    setEmails(updated);
    setSelectedEmail(null);
    
    // Check Game Over
    if (updated.every(e => e.status === "processed")) {
      setGameState("FINISHED");
    }
  };

  const handleRestart = () => {
    setEmails(initialEmails.map(e => ({ ...e, status: "new", userVerdict: null, userOptions: [] })));
    setGameState("PLAYING");
  };

  // --- SCORE BERECHNUNG ---
  const reportData = useMemo(() => {
    if (gameState !== "FINISHED") return null;
    
    let totalPoints = 0;
    let correctCount = 0;
    
    const results = emails.map(email => {
      let isCorrect = false;
      let points = 0;
      let reason = "";

      if (email.isPhishing) {
        // Fall: Es IST Phishing
        if (email.userVerdict === "PHISHING") {
          // Prüfen ob richtige Optionen gewählt wurden
          // Einfache Logik: Mindestens 1 richtiger Treffer nötig
          const hits = email.userOptions.filter(id => email.correctOptionIds.includes(id)).length;
          
          if (hits > 0) {
            isCorrect = true;
            points = 100;
            reason = "Korrekt als Phishing erkannt.";
          } else {
            // Richtig erkannt, aber falsche Begründung
            isCorrect = false; 
            points = 50; // Teilpunkte
            reason = "Phishing erkannt, aber Begründung war falsch.";
          }
        } else {
          // Falsch: Als sicher eingestuft
          reason = "Falsch! Das war eine Phishing-Mail.";
        }
      } else {
        // Fall: Es ist KEIN Phishing (Sicher)
        if (email.userVerdict === "LEGIT") {
          isCorrect = true;
          points = 100;
          reason = "Korrekt als sicher erkannt.";
        } else {
          reason = "Falsch! Das war eine legitime Mail (False Positive).";
        }
      }

      if (isCorrect) totalPoints += points;
      if (isCorrect) correctCount++;
      
      return { ...email, isCorrect, points, reason };
    });

    return { totalPoints, correctCount, results };
  }, [gameState, emails]);


  // Hilfsfunktion für Text
  const renderBody = (text) => text.split(/(\[\[LINK:.*?\]\])/g).map((part, i) => {
    if (part.startsWith("[[LINK:")) {
        return <span key={i} className={styles.fakeLink} onClick={() => alert("Vorsicht!")}>{part.slice(7, -2)}</span>;
    }
    return part;
  });

  return (
    <div className={styles.gameContainer}>
      <div className={styles.headerRow}>
        <Button onClick={onBack}>← Zurück</Button>
        <h1 className={styles.title}>Phishing Finder</h1>
        <div>
           {gameState === 'PLAYING' ? 
             `Mails: ${emails.filter(e => e.status==='processed').length} / ${emails.length}` : 
             'Ergebnis'
           }
        </div>
      </div>

      {/* --- HAUPTANSICHT: ENTWEDER SPIEL ODER REPORT --- */}
      {gameState === "FINISHED" ? (
        <div className={styles.reportContainer}>
          <div className={styles.reportHeader}>
            <h2>Mission Abgeschlossen</h2>
            <div className={styles.reportScore}>Score: {reportData.totalPoints}</div>
            <p>Du hast {reportData.correctCount} von {emails.length} Mails korrekt bewertet.</p>
          </div>
          
          <div className={styles.reportList}>
            {reportData.results.map(res => (
              <div key={res.id} className={`${styles.reportItem} ${res.isCorrect ? styles.correct : styles.wrong}`}>
                <div style={{fontWeight: 'bold', display:'flex', justifyContent:'space-between'}}>
                    <span>{res.subject}</span>
                    <span>{res.points} Pkt</span>
                </div>
                <div>{res.isPhishing ? "⚠️ War Phishing" : "✅ War Sicher"} | Deine Wahl: {res.userVerdict}</div>
                <div style={{fontStyle:'italic', marginTop:'5px'}}>➡ {res.reason}</div>
              </div>
            ))}
          </div>
          
          <button className={styles.restartBtn} onClick={handleRestart}>Neustart</button>
        </div>
      ) : (
        <div className={styles.mailClientWindow}>
          <div className={styles.clientTitleBar}>📧 Corporate Mail v1.0</div>
          <div className={styles.clientBody}>
            <div className={styles.sidebar}>
              <div className={`${styles.sidebarItem} ${styles.active}`}>
                📥 Posteingang ({emails.filter(e => e.status === 'new').length})
              </div>
              <div className={styles.sidebarItem}>📤 Gesendet</div>
              <div className={styles.sidebarItem}>🗑️ Papierkorb</div>
            </div>
            <div className={styles.mailListArea}>
              <div className={styles.listHeader}>
                <span className={styles.colFrom}>Von</span>
                <span className={styles.colSub}>Betreff</span>
                <span className={styles.colDate}>Datum</span>
              </div>
              <div className={styles.mailRowsContainer}>
                {emails.map((email) => (
                  <div 
                    key={email.id} 
                    className={`${styles.mailRow} ${email.status === 'processed' ? styles.read : styles.unread}`}
                    onClick={() => handleSelectEmail(email)}
                  >
                    <span className={styles.colFrom}>{email.from}</span>
                    <span className={styles.colSub}>{email.subject}</span>
                    <span className={styles.colDate}>{email.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- READER OVERLAY --- */}
      {selectedEmail && step === "READING" && (
        <div className={styles.overlayBackdrop}>
          <div className={styles.emailModal}>
            <div className={styles.emailHeader}>
              <div className={styles.emailSubject}>{selectedEmail.subject}</div>
              <div>Von: {selectedEmail.from}</div>
            </div>
            <div className={styles.emailBody}>{renderBody(selectedEmail.body)}</div>
            <div className={styles.decisionFooter}>
              <button className={`${styles.btnBase} ${styles.btnBack}`} onClick={handleCloseOverlay}>Zurück</button>
              <button className={`${styles.btnBase} ${styles.btnLegit}`} onClick={() => handleVerdict("LEGIT")}>✅ Sicher</button>
              <button className={`${styles.btnBase} ${styles.btnPhish}`} onClick={() => handleVerdict("PHISHING")}>⚠️ Phishing</button>
            </div>
          </div>
        </div>
      )}

      {/* --- ANALYSE OVERLAY --- */}
      {selectedEmail && step === "ANALYZING" && (
        <div className={styles.overlayBackdrop}>
          <div className={styles.analysisModal}>
            <h3>Warum ist das Phishing?</h3>
            {selectedEmail.options.map(opt => (
              <label key={opt.id} className={styles.optionLabel}>
                <input 
                  type="checkbox" 
                  className={styles.checkInput} 
                  checked={currentSelection.includes(opt.id)} 
                  onChange={() => toggleOption(opt.id)} 
                />
                {opt.text}
              </label>
            ))}
            <button className={`${styles.btnBase} ${styles.btnSubmit}`} onClick={handleSubmitAnalysis}>Bestätigen</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhishingFinder;
