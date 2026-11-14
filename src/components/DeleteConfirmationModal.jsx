// src/components/DeleteConfirmationModal.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import Button from "./button";
import styles from "./DeleteConfirmationModal.module.css"

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, errorMsg }) {
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(password);
    };

    // Rendert das Modal direkt in den document.body (außerhalb der normalen Struktur)
    return createPortal(
        <div className={styles["modal-overlay"]}>
            <div
                className={styles["modal-content"]}
            >
                <h2 className={styles["modal-title"]}>⚠️ ACHTUNG: Profil löschen</h2>

                <p className={styles["modal-warning-text"]}>
                    Dieser Schritt kann <strong>NICHT WIDERRUFEN</strong> werden.
                    Dein Account, alle XP, Level und Achievements werden dauerhaft gelöscht.
                </p>

                {errorMsg && <div className={styles["modal-error"]}>{errorMsg}</div>}

                <form onSubmit={handleSubmit} className={styles["modal-form"]}>
                    <label htmlFor="confirm-password">Bitte Passwort zur Bestätigung eingeben:</label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles["modal-input"]}
                        placeholder="Dein Passwort"
                        required
                        autoFocus
                    />

                    <div className="modal-actions">
                        <Button onClick={onClose} type="button">Abbrechen</Button>
                        <Button type="submit" className="btn-danger">Endgültig löschen</Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
