import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { getToken, clearToken } from "../services/api.js";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(Boolean(token));
  }, [location]);

  // Close mobile navigation drawer whenever route location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      clearToken();
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/home" className={styles.logo} onClick={closeMenu}>
          Protocol Blackout
        </Link>
      </div>

      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={isMenuOpen}
        type="button"
      >
        <span className={`${styles.bar} ${isMenuOpen ? styles.open : ""}`} />
        <span className={`${styles.bar} ${isMenuOpen ? styles.open : ""}`} />
        <span className={`${styles.bar} ${isMenuOpen ? styles.open : ""}`} />
      </button>

      {/* Navigation */}
      <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ""}`}>
        <Link to="/home" onClick={closeMenu}>Startseite</Link>
        <Link to="/history" onClick={closeMenu}>Geschichte</Link>
        <Link to="/ethics" onClick={closeMenu}>Ethisches Hacken</Link>
        <Link to="/games" onClick={closeMenu}>Spiele</Link>
        <Link to="/about" onClick={closeMenu}>Über uns</Link>
        <Link to="/contact" onClick={closeMenu}>Kontakt & Impressum</Link>
        <Link to="/profil" onClick={closeMenu}>Profil</Link>
      </nav>

      <div className={styles.right}>
        <ThemeToggle />

        <div className={styles.authBtn}>
          <Button onClick={handleAuthClick}>
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
