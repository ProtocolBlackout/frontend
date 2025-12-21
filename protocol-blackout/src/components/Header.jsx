import "./header.css";
import Button from "./button.jsx";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="pb-header">
      <div className="pb-header__logo">Protocol Blackout</div>

      <nav className="pb-header__nav">
        <Link to="/home">Startseite</Link>
        <Link to="/history">Geschichte</Link>
        <Link to="/ethics">Etisches Hacken</Link>
        <Link to="/games">Spiele</Link>
        <Link to="/login">Login</Link>
        <Link to="/about">Über uns</Link>
        <Link to="/contact">Kontakt & Impressum</Link>
      </nav>

      <Button />
    </header>
  );
}

export default Header;
