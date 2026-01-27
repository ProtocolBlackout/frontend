import "./header.css";
import Button from "./button.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../services/api.js"
import { useEffect, useState } from "react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); //Reagiert auf Seitenwechsel
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  
  //Prüft bei jedem Seitenwechsel ob eine Token da ist 
  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token); //!! konvertiert String/null zu <true />
    <false></false>
  }, [location]);

  //Handler für den Button (Login oder Logout)
   const handleAuthClick = () => {
    if (isLoggedIn) {
      // Wenn eingeloggt -> Token löschen + Redirect zum Login
      clearToken();
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      // Wenn ausgeloggt -> Zur Login-Seite
      navigate("/login");
    }
  };

  return (
    <header className="pb-header">
      <div className="pb-header__logo">Protocol Blackout</div>

      <nav className="pb-header__nav">
        <Link to="/home">Startseite</Link>
        <Link to="/history">Geschichte</Link>
        <Link to="/ethics">Ethisches Hacken</Link>
        <Link to="/games">Spiele</Link>
        {/*<Link to="/login">Login</Link>*/}
        <Link to="/about">Über uns</Link>
        <Link to="/contact">Kontakt & Impressum</Link>
        <Link to="/profil">Profil</Link>
    
      </nav>

      {/* Dynamischer Button: Zeigt LOGIN oder LOGOUT */}
      <Button onClick={handleAuthClick}>
        {isLoggedIn ? "LOGOUT" : "LOGIN"}
      </Button>
      
    </header>
  );
}

export default Header;
