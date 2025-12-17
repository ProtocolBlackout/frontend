import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";
// import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className="app">
      <Header />

      <main className="landing">
        {/* Hero */}
        <section className="landing-hero">
          <h1>
            Simulate the Threat.
            <br />
            Illuminate the Future.
          </h1>
          <p>
            Tauche ein in die Welt des Ethical Hackings! Unsere interaktive
            Simulation vermittelt dir realistische Szenarien aus der
            IT-Sicherheit und erklärt, warum ethisches Verhalten beim Hacken so
            wichtig ist. Wichtig: Dieses Tool ist eine reine Simulation zu
            Trainings- und Lernzwecken und stellt keine Anleitung oder
            Aufforderung zu illegalem Handeln dar. Handle stets nach den
            Gesetzen und ethischen Grundsätzen.
          </p>
          <button className="btn-primary">Start Simulation</button>
        </section>

        {/* Ethics Section */}
        <section className="landing-ethics">
          <div className="landing-ethics-text">
            <h2>Disclaimer</h2>
            <p>
              Alle hier gezeigten Methoden dienen ausschließlich der Schulung
              und Sensibilisierung für IT-Sicherheitsrisiken in einer sicheren,
              kontrollierten Umgebung. Missbrauch oder Anwendung außerhalb
              dieses Trainings ist ausdrücklich untersagt. Das Projektteam
              übernimmt keine Haftung für etwaige Schäden oder
              Missbrauchsversuche. Bitte halte dich streng an geltende Gesetze
              und Schulvorgaben.
            </p>
            <button className="btn-secondary">Learn More</button>
          </div>

          <article className="landing-ethics-card">
            <h3>Ethical Guidelines</h3>
            <p>
              Understand the principles behind ethical hacking and why consent,
              transparency and documentation are essential for every test.
            </p>
          </article>
        </section>

        {/* Visuals */}
        <section className="landing-visuals">
          <h2>Visuals</h2>
          <div className="landing-visuals-card">
            <span className="tag">Graphic</span>
            <div className="visual-placeholder">
              Retro terminal / matrix-style graphic placeholder
            </div>
            <div className="visual-caption">
              <strong>Matrix Lines Graphic</strong>
              <p>
                Space reserved for an animated visualization that represents
                data streams, scans and intrusion attempts.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
