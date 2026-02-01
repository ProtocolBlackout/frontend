// === Imports: React Hooks + Routing + API-Helper ===
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestJson, getToken, clearToken } from "../../services/api.js";
import "./profil.css";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal.jsx";
import Button from "../../components/button.jsx";

const MOCK_USER = {
  username: "User",
  avatar: "./images/defaultAvatar.png", // anpassen
  avatarAlt: "Profilbild",
  level: 7,
  xpNow: 420,
  xpMax: 1000,
  nextUnlock: "New unlock: Terminal Theme (Green Phosphor)",
  streakDays: 7,
  profilePublic: true,
  achievements: [
    {
      id: "a1",
      title: "Erstes Quiz bestanden",
      desc: "Quiz abgeschlossen: Ethics 101",
      date: "2026-01-10"
    },
    {
      id: "a2",
      title: "History Timeline komplett",
      desc: "Alle Timeline-Stationen gelesen",
      date: "2026-01-08"
    },
    {
      id: "a3",
      title: "3 Lessons am Stück",
      desc: "3 Lernmodule ohne Pause",
      date: "2026-01-06"
    }
  ],
  activity: [
    {
      id: "e1",
      ts: "2026-01-12 21:10",
      text: "+50 XP — Quiz 'Ethical Hacking' abgeschlossen"
    },
    {
      id: "e2",
      ts: "2026-01-12 20:44",
      text: "Achievement unlocked — Erstes Quiz bestanden"
    },
    {
      id: "e3",
      ts: "2026-01-11 19:03",
      text: "+20 XP — Lesson 'History: Phreaking' gelesen"
    },
    { id: "e4", ts: "2026-01-10 18:21", text: "Streak: 7 Tage erreicht" }
  ]
};

export default function Profile() {
  const navigate = useNavigate();

  // [NEU]: Backend-User (kommt von GET /auth/profile)
  const [authUser, setAuthUser] = useState(null);
  const [progress, setProgress] = useState(null);

  // [NEU]: Lade-/Fehlerzustand
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // [NEU]: State für das Lösch-Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Bestehender State bleibt, aber default bleibt aus MOCK_USER
  const [profilePublic, setProfilePublic] = useState(MOCK_USER.profilePublic);

  const handleLogout = () => {
    clearToken(); // 1. Token aus dem Speicher löschen (aus api.js)
    navigate("/login"); // 2. Zur Login-Seite navigieren
  };

  // Profil beim Laden abrufen (oder Redirect zur Login-Seite)
  useEffect(() => {
    let isActive = true;

    const token = getToken();

    // Kein Token => kein Profil für Gäste: Redirect zur Login-Seite, kein API-Call
    if (!token) {
      setIsLoading(false);
      navigate("/login");
      return () => {
        isActive = false;
      };
    }

    requestJson("/auth/profile", { method: "GET" }, true)
      .then((data) => {
        if (!isActive) {
          return null;
        }
        setAuthUser(data?.user ?? null);
        setError("");

        // [NEU]: Danach Progress laden
        return requestJson("/profile/progress", { method: "GET" }, true);
      })

      .then((data) => {
        // Wichtig: Wenn oben null zurückkam (isActive false), hier nichts tun
        if (!isActive || !data) {
          return;
        }

        setProgress(data.progress);
      })

      .catch((err) => {
        if (!isActive) {
          return;
        }

        setError(err?.message ?? "Profil konnte nicht geladen werden");
      })

      .finally(() => {
        if (!isActive) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [navigate]);

  // [NEU]: Die eigentliche Lösch-Logik
  const handleDeleteAccount = async (password) => {
    setDeleteError(""); // Reset error

    // 1. Optional: Hier könnte man client-seitig prüfen, ob ein Passwort eingegeben wurde,
    // aber das Modal erlaubt eh kein leeres Submit.

    try {
      // ACHTUNG: Dein Backend-Endpunkt "DELETE /auth/profile" erwartet aktuell
      // laut Dokumentation KEIN Passwort im Body. Er löscht einfach den eingeloggten User.
      // Falls wir das Passwort prüfen wollen, müsste der Backend-Endpunkt angepasst werden.
      // Für jetzt senden wir den Request so ab, wie das Backend ihn aktuell versteht.

      // Wenn du Backend-Anpassung willst: Sag Bescheid.
      // Aktueller Stand Backend: Löscht direkt anhand des Tokens.
      // Wir "simulieren" den Check hier oder senden es mit, falls das Backend es ignoriert ist es nicht schlimm.

      await requestJson(
        "/auth/profile",
        {
          method: "DELETE",
          // Falls Backend Password-Check unterstützt, würde man es so senden:
          body: JSON.stringify({ password })
        },
        true
      );

      // Erfolg:
      clearToken();
      setIsDeleteModalOpen(false);
      navigate("/login"); // Oder auf eine "Goodbye"-Seite
    } catch (err) {
      console.error("Löschen fehlgeschlagen:", err);
      setDeleteError(err.message || "Fehler beim Löschen des Accounts.");
    }
  };

  // UI-Daten: Identity kommt aus /auth/profile (username/email/id),
  // Progress kommt aus /profile/progress (level/xp/nextLevelXp).
  // MOCK_USER bleibt als Fallback, damit das Layout stabil bleibt, bis die API-Daten geladen sind.

  // [ERKLÄRUNG]: uiUser ist unsere zentrale UI-Quelle: Fallback = MOCK_USER, echte Werte überschreiben den Mock.

  const uiUser = useMemo(() => {
    return {
      ...MOCK_USER,
      // [NEU]: Progress überschreibt Mock-Werte (wenn vorhanden)
      level: progress?.level ?? MOCK_USER.level,
      xpNow: progress?.xp ?? MOCK_USER.xpNow,
      xpMax: progress?.nextLevelXp ?? MOCK_USER.xpMax,

      username: authUser?.username ?? MOCK_USER.username,
      email: authUser?.email ?? null,
      id: authUser?.id ?? null
    };
  }, [authUser, progress]);

  // [VORHER]:
  // const xpPercent = useMemo(() => {
  //   const p = (MOCK_USER.xpNow / MOCK_USER.xpMax) * 100;
  //   return Math.max(0, Math.min(100, Math.round(p)));
  // }, []);

  // [ERSETZT]: xpPercent basiert jetzt auf uiUser (statt fest auf MOCK_USER)
  const xpPercent = useMemo(() => {
    const p = (uiUser.xpNow / uiUser.xpMax) * 100;
    return Math.max(0, Math.min(100, Math.round(p)));
  }, [uiUser.xpNow, uiUser.xpMax]);

  return (
    <main className="profile">
      <section className="terminal">
        <header className="terminal__header">
          <div className="terminal__title">
            pb://profile -- user={uiUser.username} -- access=
            {profilePublic ? "public" : "private"}
          </div>

          <label className="terminal__toggle">
            <span className="terminal__toggleLabel">Profil öffentlich</span>
            <input
              type="checkbox"
              checked={profilePublic}
              disabled={isLoading}
              onChange={(e) => setProfilePublic(e.target.checked)}
            />
            <span className="terminal__toggleUI" aria-hidden="true" />
          </label>
        </header>

        <div className="terminal__body">
          {/* [NEU]: Status-Hinweise oben, ohne dein Layout umzubauen */}
          {isLoading ? (
            <p style={{ margin: 0, padding: 12 }}>Lädt Profil...</p>
          ) : null}

          {!isLoading && error ? (
            <p style={{ margin: 0, padding: 12 }}>{error}</p>
          ) : null}

          <div className="profileGrid">
            {/* Identity */}
            <section className="panel">
              <div className="panel__title">IDENTITY</div>

              <div className="identity">
                <img
                  className="identity__avatar"
                  src={uiUser.avatar}
                  alt={uiUser.avatarAlt}
                />

                <div className="identity__meta">
                  <div className="identity__user">
                    <span className="prompt">$</span> {uiUser.username}
                    <span className="cursor" aria-hidden="true" />
                  </div>

                  <div className="identity__line">
                    <span className="key">Level:</span> {uiUser.level}
                  </div>

                  <div className="identity__line">
                    <span className="key">Streak:</span> {uiUser.streakDays}{" "}
                    Tage
                  </div>
                </div>
              </div>
            </section>

            {/* XP */}
            <section className="panel">
              <div className="panel__title">PROGRESS</div>

              <div className="xpRow">
                <div className="xpText">
                  Level {uiUser.level} — {uiUser.xpNow}/{uiUser.xpMax} EXP
                </div>

                <div
                  className="xpBar"
                  role="progressbar"
                  aria-label="Erfahrungspunkte Fortschritt"
                  aria-valuenow={uiUser.xpNow}
                  aria-valuemin={0}
                  aria-valuemax={uiUser.xpMax}
                  aria-valuetext={`${uiUser.xpNow} von ${uiUser.xpMax} EXP`}
                >
                  <div
                    className="xpBar__fill"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>

                <div className="xpNext">
                  Next unlock at {uiUser.xpMax} EXP:{" "}
                  <span className="accent">{uiUser.nextUnlock}</span>
                </div>
              </div>
            </section>

            {/* Achievements */}
            <section className="panel panel--wide">
              <div className="panel__title">ACHIEVEMENTS</div>

              <div className="badgeGrid">
                {uiUser.achievements.map((a) => (
                  <article key={a.id} className="badge">
                    <div className="badge__name">{a.title}</div>
                    <div className="badge__desc">{a.desc}</div>
                    <div className="badge__date">{a.date}</div>
                  </article>
                ))}
              </div>
            </section>

            {/* Activity */}
            <section className="panel panel--wide">
              <div className="panel__title">ACTIVITY FEED</div>

              <ul className="feed">
                {uiUser.activity.map((e) => (
                  <li key={e.id} className="feed__item">
                    <span className="feed__ts">[{e.ts}]</span> {e.text}
                  </li>
                ))}
              </ul>
            </section>

            {/* [NEU]: Gefahr-Zone unter dem Activity Feed */}
            <section
              className="profile-section danger-zone"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "3rem",
                borderTop: "1px solid #333",
                paddingTop: "1rem"
              }}
            >
              <Button
                className="btn-danger"
                onClick={() => setIsDeleteModalOpen(true)}
                style={{ width: "100%", maxWidth: 400 }} // Schön breit, aber nicht zu breit
              >
                ACCOUNT LÖSCHEN
              </Button>
            </section>
            {/* [NEU]: Das Modal einbinden */}
            <DeleteConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleDeleteAccount}
              errorMsg={deleteError}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
