import { useState } from "react";
import { useTheme } from "../context/themeContext.jsx";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const { theme, toggleTheme, isSyncing } = useTheme();
  const [error, setError] = useState("");

  const isDark = theme === "dark";

  const handleClick = async () => {
    setError("");
    try {
      await toggleTheme();
    } catch (e) {
      setError(e?.message ?? "Theme konnte nicht gespeichert werden");
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.toggle}
        onClick={handleClick}
        disabled={isSyncing}
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Dark Mode deaktivieren" : "Dark Mode aktivieren"}
        title={isDark ? "Dark Mode deaktivieren" : "Dark Mode aktivieren"}
      >
        <span className={styles.icon} aria-hidden="true">
          {isDark ? "🌙" : "☀"}
        </span>
      </button>

      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
};

export default ThemeToggle;
