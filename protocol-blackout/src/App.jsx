import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";

import { Routes, Route } from "react-router-dom";

import Gamespage from "./pages/games/Gamespage.jsx";
import About from "./pages/aboutus/AboutUs.jsx";
import Contact from "./pages/kontaktimpressum/KontaktImpressum.jsx";
import History from "./pages/geschichte/Geschichte.jsx";
import Ethics from "./pages/ethik/EthischesHacken.jsx";
import Login from "./pages/login/LoginRegistrieren.jsx";

import { useEffect, useState } from "react";

function ImageSlideshow({ images, autoPlay = true, interval = 20000 }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, images.length]);

  if (!images?.length) return null;
  const current = images[index];

  return (
    <div className="slideshow">
      <div className="slideshow-frame">
        <img
          className="slideshow-img"
          src={current.src}
          alt={current.alt ?? `Slide ${index + 1}`}
          loading="lazy"
        />

        <button
          className="slideshow-btn left"
          onClick={prev}
          aria-label="Previous slide"
          type="button"
        >
          ‹
        </button>

        <button
          className="slideshow-btn right"
          onClick={next}
          aria-label="Next slide"
          type="button"
        >
          ›
        </button>
      </div>

      <div
        className="slideshow-dots"
        role="tablist"
        aria-label="Slideshow navigation"
      >
        {images.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : "false"}
            type="button"
          />
        ))}
      </div>

      {current.caption && (
        <p className="slideshow-caption">{current.caption}</p>
      )}
    </div>
  );
}

function Home() {
  const slides = [
    {
      src: "/images/team.png",
      alt: "Slide 1",
      caption: "Protocol Blackout – deploying ideas since 03:00 AM.",
    },
    {
      src: "/images/quote1.png",
      alt: "Slide 2",
      caption: "Matrix Lines Graphic",
    },
    {
      src: "/images/quote2.png",
      alt: "Slide 3",
      caption: "Data stream / scan view",
    },
    {
      src: "/images/quote3.png",
      alt: "Slide 4",
      caption: "Terminal simulation",
    },
    { src: "/images/quote4.png", alt: "Slide 5", caption: "Network map" },
    { src: "/images/quote5.png", alt: "Slide 6", caption: "Security alert" },
    { src: "/images/quote6.png", alt: "Slide 7", caption: "Log analysis" },
    { src: "/images/quote7.png", alt: "Slide 8", caption: "Firewall / rules" },
  ];

  return (
    <main className="home">
      <div className="home-console">
        <div className="home-console__header">
          <div className="home-console__title">PROTOCOL BLACKOUT_</div>
          <div className="home-console__dots">● ● ●</div>
        </div>

        <div className="home-console__body">
          {/* Block 1 */}
          <section className="home-block">
            <h2 className="home-block__heading">Overview</h2>

            <div className="home-console__row">
              <span className="home-console__label">Mode</span>
              <span className="home-console__value">
                Educational Simulation
              </span>
            </div>

            <div className="home-console__row">
              <span className="home-console__label">Focus</span>
              <span className="home-console__value">
                Awareness · History · Password Security
              </span>
            </div>

            <div className="home-console__row">
              <span className="home-console__label">System</span>
              <span className="home-console__value">
                Protocol Blackout Training Terminal
              </span>
            </div>
          </section>

          {/* Block 2 */}
          <section className="home-block">
            <h2 className="home-block__heading">Modules</h2>

            <ul className="home-list">
              <li>
                <span className="home-list__key">Hacking History Quiz</span>
                <span className="home-list__value">
                  Interaktives Quiz zur Geschichte des Hackings
                  (Learning-by-Playing).
                </span>
              </li>
              <li>
                <span className="home-list__key">Password Cracker (Sim)</span>
                <span className="home-list__value">
                  Simulation zur Passwortstärke (nur Demo/Training, keine echten
                  Targets).
                </span>
              </li>
            </ul>
          </section>

          {/* Block 3 */}
          <section className="home-block">
            <h2 className="home-block__heading">Disclaimer</h2>

            <p className="home-paragraph">
              Alle Inhalte dienen ausschließlich der Schulung und
              Sensibilisierung für IT-Sicherheitsrisiken in einer sicheren,
              kontrollierten Umgebung. Die gezeigten Beispiele sind keine
              Anleitung zu realen Angriffen.
            </p>

            <p className="home-paragraph">
              Hinweis: Verwendete Grafiken wurden mithilfe von KI generiert. Ein
              Teil der Texte wurde KI-gestützt erstellt und anschließend
              redaktionell angepasst.
            </p>

            <p className="home-paragraph">
              Missbrauch oder Anwendung außerhalb dieses Trainings ist
              ausdrücklich untersagt. Das Projektteam übernimmt keine Haftung
              für Schäden oder Missbrauchsversuche. Bitte halte dich an geltende
              Gesetze und Schulvorgaben.
            </p>
          </section>

          {/* Block 4: Visual Log */}
          <section className="home-block">
            <h2 className="home-block__heading">Visual Log</h2>
            <div className="home-visual">
              <div className="home-visual__meta">
                <span className="home-visual__prompt">
                  &gt; loading assets…
                </span>
                <span className="home-visual__status">STATUS: ONLINE</span>
              </div>
              <ImageSlideshow images={slides} autoPlay interval={20000} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <div className="app">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/ethics" element={<Ethics />} />
        <Route path="/games" element={<Gamespage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
