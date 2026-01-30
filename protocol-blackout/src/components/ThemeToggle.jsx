import { useState } from "react";
import { useTheme } from "../context/themeContext.jsx";

const ThemeToggle = () => {
  const { theme, toggleTheme, isSyncing } = useTheme();
  const [error, setError] = useState("");

  const handleClick = async () => {
    setError("");
    try {
      await toggleTheme();
    } catch (e) {
      setError(e?.message ?? "Theme konnte nicht gespeichert werden");
    }
  };

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={isSyncing}>
        Theme: {theme} (toggle)
      </button>
      {error ? <p>{error}</p> : null}
    </div>
  );
};

export default ThemeToggle;
