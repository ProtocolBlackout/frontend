import "./header.css";
import Button from "./button.jsx";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="pb-header">
      <div className="pb-header__logo">Protocol Blackout</div>

      <nav className="pb-header__nav">
        <a href="#hero">Startseite</a>
        <a href="#about">Geschichte</a>
        <a href="#ethics">Etisches Hacken</a>
        <Link to="/games">Spiele</Link>
        <a href="#ethics">Login</a>
        <Link to="/about">Über uns</Link>
        <a href="#contact">Kontakt & Impressum</a>
      </nav>

      <Button />
    </header>
  );
}

export default Header;
