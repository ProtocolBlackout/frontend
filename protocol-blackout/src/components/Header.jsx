import "./header.css";
import Button from "./button.jsx";

function Header() {
  return (
    <header className="pb-header">
      <div className="pb-header__logo">Protocol Blackout</div>

      <nav className="pb-header__nav">
        <a href="#hero">Startseite</a>
        <a href="#about">Geschichte</a>
        <a href="#ethics">Etisches Hacken</a>
        <a href="#simulation">Spiele</a>
        <a href="#ethics">Login</a>
        <a href="#ethics">Über uns</a>
        <a href="#contact">Kontakt & Impressum</a>
      </nav>

      <Button />
    </header>
  );
}

export default Header;
