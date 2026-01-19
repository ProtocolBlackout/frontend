
import Button from "../../../components/button"; 
import styles from "./phishingFinder.module.css";

function PhishingFinder({ onBack }) {
  return (
    <div className={styles.gameContainer}>
      <div className={styles.headerRow}>
        <Button onClick={onBack}>← Zurück</Button>
        <h1 className={styles.title}>Phishing Finder</h1>
      </div>
      
      <div className={styles.contentArea}>
        <h2>🚧 Work in Progress 🚧</h2>
        <p>Hier entsteht das Phishing-Spiel.</p>
        <p>Schritt 1: Grundgerüst steht.</p>
      </div>
    </div>
  );
}

export default PhishingFinder;
