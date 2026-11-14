import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button.jsx";
import styles from "./DeleteConfirmationModal.module.css";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, errorMsg }) => {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(password);
  };

  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>⚠️ ACHTUNG: Profil löschen</h2>

        <p className={styles.modalWarningText}>
          Dieser Schritt kann <strong>NICHT WIDERRUFEN</strong> werden.
          Dein Account, alle XP, Level und Achievements werden dauerhaft gelöscht.
        </p>

        {errorMsg && <div className={styles.modalError}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <label htmlFor="confirm-password" className={styles.modalLabel}>
            Bitte Passwort zur Bestätigung eingeben:
          </label>
          <input
            id="confirm-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.modalInput}
            placeholder="Dein Passwort"
            required
            autoFocus
          />

          <div className={styles.modalActions}>
            <Button onClick={onClose} type="button">
              Abbrechen
            </Button>
            <Button type="submit" className={styles.btnDanger}>
              Endgültig löschen
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmationModal;
