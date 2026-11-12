import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import Gamespage from "./pages/games/Gamespage.jsx";
import About from "./pages/aboutus/AboutUs.jsx";
import Contact from "./pages/kontaktimpressum/KontaktImpressum.jsx";
import History from "./pages/geschichte/Geschichte.jsx";
import Ethics from "./pages/ethik/EthischesHacken.jsx";
import Login from "./pages/login/LoginRegistrieren.jsx";
import VerifyEmail from "./pages/login/VerifyEmail.jsx";
import PasswordResetForm from "./pages/password-reset/PasswordResetForm.jsx";
import Profile from "./pages/profil/Profile.jsx";
import AccountDeletedPage from "./pages/goodbye/Goodbye.jsx";
import { requestJson } from "./services/api.js";
import "./App.css";

const App = () => {
  // Render Cold Start: Show friendly banner if server wake-up takes longer
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [showColdStartHint, setShowColdStartHint] = useState(false);

  useEffect(() => {
    // Only warm up once per tab session
    const alreadyWarmed = sessionStorage.getItem("pbBackendWarmed") === "1";
    if (alreadyWarmed) return;

    sessionStorage.setItem("pbBackendWarmed", "1");

    let isDone = false;
    setIsWakingUp(true);

    // Show notice only if cold start takes longer than 2.5s
    const hintTimerId = setTimeout(() => {
      if (!isDone) setShowColdStartHint(true);
    }, 2500);

    // Warm-up call to backend
    requestJson("/health")
      .catch(() => {
        // Intentionally silent: UI banner covers status
      })
      .finally(() => {
        isDone = true;
        clearTimeout(hintTimerId);
        setShowColdStartHint(false);
        setIsWakingUp(false);
      });

    return () => clearTimeout(hintTimerId);
  }, []);

  return (
    <div className="app">
      <Header />

      {isWakingUp && showColdStartHint ? (
        <div className="coldStartBanner" role="status" aria-live="polite">
          <strong>Einen Moment bitte:</strong> Wir starten den Server gerade.
          Das kann bis zu 1–2 Minuten dauern – bitte kurz dranbleiben.
          <span className="coldStartBanner__note">
            Wenn du die Seite eine Weile nicht nutzt, kann das später nochmal
            passieren.
          </span>
        </div>
      ) : null}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/history" element={<History />} />
          <Route path="/ethics" element={<Ethics />} />
          <Route path="/games" element={<Gamespage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/password-reset" element={<PasswordResetForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profil" element={<Profile />} />

          {/* Test route for account deletion feedback */}
          <Route path="/goodbye" element={<AccountDeletedPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
