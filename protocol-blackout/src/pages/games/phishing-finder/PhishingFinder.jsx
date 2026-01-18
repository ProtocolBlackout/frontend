import { useState } from "react";
import Button from "../../../components/button";
import styles from "./phishingFinder.module.css";

function PhishingFinder({ onBack }) {
  // State kommt in Commit 3
  
  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    }
  };

  return (
    <div className={styles.gameContainer}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <Button onClick={handleBack} className={styles.navBtn}>
          ← Zurück
        </Button>
        <h1 className={styles.title}>Phishing Finder</h1>
        <div style={{ minWidth: "100px" }}></div>
      </div>

      {/* Platzhalter für Mail Client */}
      <div className={styles.mailClientWindow}>
        <div className={styles.clientTitleBar}>
          <span>📧 E-Mail Client - Verdächtige Mails erkennen</span>
        </div>
        <div className={styles.clientBody}>
          <p style={{ padding: "20px", color: "#333" }}>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PhishingFinder;
