import { useState } from "react";
import Button from "../../../components/Button";
import styles from "./phishingFinder.module.css";
import { initialEmails } from "./phishingFinderData";

function PhishingFinder({ onBack }) {
  const [emails, setEmails] = useState(
    initialEmails.map((e) => ({ ...e, status: "new", userVerdict: null, userOptions: [] }))
  );
  
  const [selectedEmail, setSelectedEmail] = useState(null);
  
  // Neuer State für den Ablauf
  const [step, setStep] = useState("READING"); // 'READING' oder 'ANALYZING'
  const [currentSelection, setCurrentSelection] = useState([]); // Gewählte Checkboxen

  // --- HANDLER ---
  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setStep("READING");
    setCurrentSelection([]);
  };

  const handleCloseOverlay = () => setSelectedEmail(null);

  const handleVerdict = (verdict) => {
    if (verdict === "PHISHING") {
      // Bei Phishing: Weiter zur Analyse (Checkboxen)
      setStep("ANALYZING");
    } else {
      // Bei Sicher: Sofort speichern und schließen
      saveResultAndClose(selectedEmail.id, "LEGIT", []);
    }
  };

  // Checkbox umschalten
  const toggleOption = (id) => {
    setCurrentSelection(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Analyse absenden
  const handleSubmitAnalysis = () => {
    saveResultAndClose(selectedEmail.id, "PHISHING", currentSelection);
  };

  // Zentrale Speicherfunktion
  const saveResultAndClose = (id, verdict, options) => {
    const updated = emails.map(e => 
      e.id === id 
      ? { ...e, status: "processed", userVerdict: verdict, userOptions: options } 
      : e
    );
    setEmails(updated);
    setSelectedEmail(null);
    
    // Prüfen ob Spiel zu Ende ist (alle Mails bearbeitet)
    if (updated.every(e => e.status === "processed")) {
      console.log("GAME OVER - Alle Mails bearbeitet");
      // Hier triggern wir im nächsten Schritt den Report-Screen
    }
  };

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
        <div>Mails: {emails.length}</div>
      </div>

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

      {/* --- ANALYSE OVERLAY (Neu) --- */}
      {selectedEmail && step === "ANALYZING" && (
        <div className={styles.overlayBackdrop}>
          <div className={styles.analysisModal}>
            <h3>Warum ist das Phishing?</h3>
            <p style={{fontSize: '0.9rem', marginBottom: '10px'}}>Markiere alle verdächtigen Merkmale:</p>
            
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
            
            <button className={`${styles.btnBase} ${styles.btnSubmit}`} onClick={handleSubmitAnalysis}>
              Bestätigen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhishingFinder;
