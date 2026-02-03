import "./header.css";
import Button from "./button.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../services/api.js";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle.jsx"

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, [location]);

  // Wenn sich der Pfad ändert (Navi-Klick erfolgreich), Menü IMMER schließen
  // Das ist der "Backup"-Mechanismus, falls onClick versagt.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    console.log("Menü wird geschlossen"); // Debugging
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
    // closeMenu wird hier nicht zwingend gebraucht, 
    // da navigate() den location-useEffect (oben) auslöst.
  };

  return (
    <header className="pb-header">
      <div className="pb-header__logo-container">
        <Link to="/home" className="pb-header__logo" onClick={closeMenu}>
          Protocol Blackout
        </Link>
      </div>

      <button
        className="pb-header__hamburger"
        onClick={toggleMenu}
        aria-label="Menü öffnen"
      >
        <span className={isMenuOpen ? "pb-header__bar open" : "pb-header__bar"}></span>
        <span className={isMenuOpen ? "pb-header__bar open" : "pb-header__bar"}></span>
        <span className={isMenuOpen ? "pb-header__bar open" : "pb-header__bar"}></span>
      </button>

      {/* Navigation */}
      <nav className={`pb-header__nav ${isMenuOpen ? "active" : ""}`}>

        {/* Wir schreiben das onClick explizit an jeden Link */}
        <Link to="/home" onClick={closeMenu}>Startseite</Link>
        <Link to="/history" onClick={closeMenu}>Geschichte</Link>
        <Link to="/ethics" onClick={closeMenu}>Ethisches Hacken</Link>
        <Link to="/games" onClick={closeMenu}>Spiele</Link>
        <Link to="/about" onClick={closeMenu}>Über uns</Link>
        <Link to="/contact" onClick={closeMenu}>Kontakt & Impressum</Link>
        <Link to="/profil" onClick={closeMenu}>Profil</Link>

      </nav>
      <div className="pb-header__right">
        <ThemeToggle />

        <div className="pb-header__auth-btn">
          <Button onClick={handleAuthClick}>
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
