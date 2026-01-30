import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken } from "../services/api.js";
import { getProfile, updatePreferredTheme } from "../services/theme.api.js";

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "pb_preferredTheme";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let isMounted = true;

    (async () => {
      try {
        setIsSyncing(true);
        const data = await getProfile();
        const preferredTheme = data?.user?.preferredTheme;

        if (isMounted && (preferredTheme === "dark" || preferredTheme === "light")) {
          setTheme(preferredTheme);
        }
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = async () => {
    const current = theme;
    const next = current === "dark" ? "light" : "dark";

    setTheme(next);

    const token = getToken();
    if (!token) return;

    try {
      await updatePreferredTheme(next);
    } catch (err) {
      setTheme(current);
      throw err;
    }
  };

  const value = useMemo(
    () => ({ theme, toggleTheme, isSyncing }),
    [theme, isSyncing]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
