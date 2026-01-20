import { useState } from "react";
import Button from "../../../components/button";
import styles from "./phishingFinder.module.css";
import { initialEmails } from "./phishingFinderData";

function PhishingFinder({ onBack }) {
  const [emails, setEmails] = useState(
    initialEmails.map((e) => ({ ...e, status: "new", userVerdict: null, userOptions: [] }))
  );
  
  // Neuer State für Reader
  const [selectedEmail, setSelectedEmail] = useState(null);

  // --- HANDLER ---
  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  };

  const handleCloseOverlay = () => {
    setSelectedEmail(null);
  };

  // Entscheidung treffen (vorerst nur Console Log / Alert Ersatz)
  const handleVerdict = (verdict) => {
    // verdict ist entweder 'LEGIT' oder 'PHISHING'
    console.log("Entscheidung:", verdict, "für Mail ID:", selectedEmail.id);
    
    // Wir markieren die Mail als 'processed' (gelesen) und schließen das Fenster
    // (Später kommt hier die komplexe Logik für Phishing-Analyse rein)
    const updated = emails.map(e => 
        e.id === selectedEmail.id 
        ? { ...e, status: "processed", userVerdict: verdict } 
        : e
    );
    setEmails(updated);
    setSelectedEmail(null);
  };

  // Hilfsfunktion um [[LINK:...]] Text klickbar zu machen
  const renderBody = (text) => text.split(/(\[\[LINK:.*?\]\])/g).map((part, i) => {
    if (part.startsWith("[[LINK:")) {
        return <span key={i} className={styles.fakeLink} onClick={() => alert("Vorsicht! In echt wäre das gefährlich.")}>{part.slice(7, -2)}</span>;
    }
    return part;
  });

  // --- RENDER ---
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
      {selectedEmail && (
        <div className={styles.overlayBackdrop}>
          <div className={styles.emailModal}>
            <div className={styles.emailHeader}>
              <div className={styles.emailSubject}>{selectedEmail.subject}</div>
              <div>Von: {selectedEmail.from}</div>
            </div>
            
            <div className={styles.emailBody}>
              {renderBody(selectedEmail.body)}
            </div>
            
            <div className={styles.decisionFooter}>
              <button className={`${styles.btnBase} ${styles.btnBack}`} onClick={handleCloseOverlay}>
                Zurück
              </button>
              <button className={`${styles.btnBase} ${styles.btnLegit}`} onClick={() => handleVerdict("LEGIT")}>
                ✅ Sicher
              </button>
              <button className={`${styles.btnBase} ${styles.btnPhish}`} onClick={() => handleVerdict("PHISHING")}>
                ⚠️ Phishing Melden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhishingFinder;
