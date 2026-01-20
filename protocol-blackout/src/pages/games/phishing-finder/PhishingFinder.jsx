import { useState } from "react";
import Button from "../../../components/button";
import styles from "./phishingFinder.module.css";
import { initialEmails } from "./phishingFinderData";

function PhishingFinder({ onBack }) {
  // State: Wir kopieren die Daten, um den Status (gelesen/ungelesen) zu speichern
  const [emails, setEmails] = useState(
    initialEmails.map((e) => ({ 
      ...e, 
      status: "new",       // new | processed
      userVerdict: null,   // LEGIT | PHISHING
      userOptions: []      // Gewählte Gründe
    }))
  );

  return (
    <div className={styles.gameContainer}>
      <div className={styles.headerRow}>
        <Button onClick={onBack}>← Zurück</Button>
        <h1 className={styles.title}>Phishing Finder</h1>
        <div>Mails: {emails.length}</div>
      </div>

      {/* Mail Client Fenster */}
      <div className={styles.mailClientWindow}>
        <div className={styles.clientTitleBar}>📧 Corporate Mail v1.0</div>
        
        <div className={styles.clientBody}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={`${styles.sidebarItem} ${styles.active}`}>
              📥 Posteingang ({emails.filter(e => e.status === 'new').length})
            </div>
            <div className={styles.sidebarItem}>📤 Gesendet</div>
            <div className={styles.sidebarItem}>🗑️ Papierkorb</div>
          </div>

          {/* E-Mail Liste */}
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
                  onClick={() => alert(`Du hast auf Mail "${email.subject}" geklickt.`)}
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
    </div>
  );
}

export default PhishingFinder;
