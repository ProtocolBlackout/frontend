import { useCallback, useEffect, useState } from "react";
import styles from "./HomePage.module.css";

const SLIDES = [
  {
    src: "/images/team.png",
    alt: "Slide 1",
    caption: "Protocol Blackout – deploying ideas since 03:00 AM."
  },
  {
    src: "/images/quote1.png",
    alt: "Slide 2",
    caption: "Matrix Lines Graphic"
  },
  {
    src: "/images/quote2.png",
    alt: "Slide 3",
    caption: "Data stream / scan view"
  },
  {
    src: "/images/quote3.png",
    alt: "Slide 4",
    caption: "Terminal simulation"
  },
  { src: "/images/quote4.png", alt: "Slide 5", caption: "Network map" },
  { src: "/images/quote5.png", alt: "Slide 6", caption: "Security alert" },
  { src: "/images/quote6.png", alt: "Slide 7", caption: "Log analysis" },
  { src: "/images/quote7.png", alt: "Slide 8", caption: "Firewall / rules" }
];

const ImageSlideshow = ({ images, autoPlay = true, interval = 20000 }) => {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timerId = setInterval(next, interval);
    return () => clearInterval(timerId);
  }, [autoPlay, interval, images.length, next]);

  if (!images?.length) return null;
  const current = images[index];

  return (
    <div className={styles.slideshow}>
      <div className={styles.slideshowFrame}>
        <img
          className={styles.slideshowImg}
          src={current.src}
          alt={current.alt ?? `Slide ${index + 1}`}
          loading="lazy"
        />

        <button
          className={`${styles.slideshowBtn} ${styles.left}`}
          onClick={prev}
          aria-label="Previous slide"
          type="button"
        >
          ‹
        </button>

        <button
          className={`${styles.slideshowBtn} ${styles.right}`}
          onClick={next}
          aria-label="Next slide"
          type="button"
        >
          ›
        </button>
      </div>

      <div
        className={styles.slideshowDots}
        role="tablist"
        aria-label="Slideshow navigation"
      >
        {images.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.active : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : "false"}
            type="button"
          />
        ))}
      </div>

      {current.caption && (
        <p className={styles.slideshowCaption}>{current.caption}</p>
      )}
    </div>
  );
};

const HomePage = () => {
  return (
    <div className={styles.home}>
      <div className={styles.homeConsole}>
        <div className={styles.homeConsoleHeader}>
          <div className={styles.homeConsoleTitle}>PROTOCOL BLACKOUT_</div>
          <div className={styles.homeConsoleDots}>● ● ●</div>
        </div>

        <div className={styles.homeConsoleBody}>
          {/* Block 1: Overview */}
          <section className={styles.homeBlock}>
            <h2 className={styles.homeBlockHeading}>Overview</h2>

            <div className={styles.homeConsoleRow}>
              <span className={styles.homeConsoleLabel}>Mode</span>
              <span className={styles.homeConsoleValue}>
                Educational Simulation
              </span>
            </div>

            <div className={styles.homeConsoleRow}>
              <span className={styles.homeConsoleLabel}>Focus</span>
              <span className={styles.homeConsoleValue}>
                Awareness · History · Password Security
              </span>
            </div>

            <div className={styles.homeConsoleRow}>
              <span className={styles.homeConsoleLabel}>System</span>
              <span className={styles.homeConsoleValue}>
                Protocol Blackout Training Terminal
              </span>
            </div>
          </section>

          {/* Block 2: Modules */}
          <section className={styles.homeBlock}>
            <h2 className={styles.homeBlockHeading}>Modules</h2>

            <ul className={styles.homeList}>
              <li>
                <span className={styles.homeListKey}>Hacking History Quiz</span>
                <span className={styles.homeListValue}>
                  Interaktives Quiz zur Geschichte des Hackings
                  (Learning-by-Playing).
                </span>
              </li>
              <li>
                <span className={styles.homeListKey}>Password Cracker (Sim)</span>
                <span className={styles.homeListValue}>
                  Simulation zur Passwortstärke (nur Demo/Training, keine echten
                  Targets).
                </span>
              </li>
            </ul>
          </section>

          {/* Block 3: Disclaimer */}
          <section className={styles.homeBlock}>
            <h2 className={styles.homeBlockHeading}>Disclaimer</h2>

            <p className={styles.homeParagraph}>
              Alle Inhalte dienen ausschließlich der Schulung und
              Sensibilisierung für IT-Sicherheitsrisiken in einer sicheren,
              kontrollierten Umgebung. Die gezeigten Beispiele sind keine
              Anleitung zu realen Angriffen.
            </p>

            <p className={styles.homeParagraph}>
              Hinweis: Verwendete Grafiken wurden mithilfe von KI generiert. Ein
              Teil der Texte wurde KI-gestützt erstellt und anschließend
              redaktionell angepasst.
            </p>

            <p className={styles.homeParagraph}>
              Missbrauch oder Anwendung außerhalb dieses Trainings ist
              ausdrücklich untersagt. Das Projektteam übernimmt keine Haftung
              für Schäden oder Missbrauchsversuche. Bitte halte dich an geltende
              Gesetze und Schulvorgaben.
            </p>
          </section>

          {/* Block 4: Visual Log */}
          <section className={styles.homeBlock}>
            <h2 className={styles.homeBlockHeading}>Visual Log</h2>
            <div className={styles.homeVisual}>
              <div className={styles.homeVisualMeta}>
                <span className={styles.homeVisualPrompt}>
                  &gt; loading assets…
                </span>
                <span className={styles.homeVisualStatus}>STATUS: ONLINE</span>
              </div>
              <ImageSlideshow images={SLIDES} autoPlay interval={20000} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
