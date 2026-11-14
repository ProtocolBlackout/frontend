import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestJson, getToken, clearToken } from "../../services/api.js";
import styles from "./Profile.module.css";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal.jsx";
import Button from "../../components/Button.jsx";

const MOCK_USER = {
  username: "User",
  avatar: "./images/defaultAvatar.png",
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

const Profile = () => {
  const navigate = useNavigate();

  // Backend user from GET /auth/profile
  const [authUser, setAuthUser] = useState(null);
  const [progress, setProgress] = useState(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Account deletion modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [profilePublic, setProfilePublic] = useState(MOCK_USER.profilePublic);

  // Fetch profile on mount (redirect to login if unauthenticated)
  useEffect(() => {
    let isActive = true;
    const token = getToken();

    if (!token) {
      navigate("/login", { replace: true });
      return () => {
        isActive = false;
      };
    }

    requestJson("/auth/profile", { method: "GET" }, true)
      .then((data) => {
        if (!isActive) return null;
        setAuthUser(data?.user ?? null);
        setError("");
        return requestJson("/profile/progress", { method: "GET" }, true);
      })
      .then((data) => {
        if (!isActive || !data) return;
        setProgress(data.progress);
      })
      .catch((err) => {
        if (!isActive) return;
        setError(err?.message ?? "Profil konnte nicht geladen werden");
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [navigate]);

  const handleDeleteAccount = async (password) => {
    setDeleteError("");

    try {
      const result = await requestJson(
        "/auth/profile",
        {
          method: "DELETE",
          body: JSON.stringify({ password })
        },
        true
      );

      clearToken();
      setIsDeleteModalOpen(false);
      navigate(result?.nextPath ?? "/goodbye");
    } catch (err) {
      console.error("Account deletion failed:", err);
      setDeleteError(err.message || "Fehler beim Löschen des Accounts.");
    }
  };

  const uiUser = useMemo(() => {
    return {
      ...MOCK_USER,
      level: progress?.level ?? MOCK_USER.level,
      xpNow: progress?.xp ?? MOCK_USER.xpNow,
      xpMax: progress?.nextLevelXp ?? MOCK_USER.xpMax,
      username: authUser?.username ?? MOCK_USER.username,
      email: authUser?.email ?? null,
      id: authUser?.id ?? null
    };
  }, [authUser, progress]);

  const xpPercent = useMemo(() => {
    const p = (uiUser.xpNow / uiUser.xpMax) * 100;
    return Math.max(0, Math.min(100, Math.round(p)));
  }, [uiUser.xpNow, uiUser.xpMax]);

  return (
    <div className={styles.profile}>
      <section className={styles.terminal}>
        <header className={styles.terminalHeader}>
          <div className={styles.terminalTitle}>
            pb://profile -- user={uiUser.username} -- access=
            {profilePublic ? "public" : "private"}
          </div>

          <label className={styles.terminalToggle}>
            <span>Profil öffentlich</span>
            <input
              type="checkbox"
              checked={profilePublic}
              disabled={isLoading}
              onChange={(e) => setProfilePublic(e.target.checked)}
            />
            <span className={styles.terminalToggleUI} aria-hidden="true" />
          </label>
        </header>

        <div className={styles.terminalBody}>
          {isLoading ? (
            <p className={styles.statusMsg}>Lädt Profil...</p>
          ) : null}

          {!isLoading && error ? (
            <p className={styles.statusMsg}>{error}</p>
          ) : null}

          <div className={styles.profileGrid}>
            {/* Identity */}
            <section className={styles.panel}>
              <div className={styles.panelTitle}>IDENTITY</div>

              <div className={styles.identity}>
                <img
                  className={styles.identityAvatar}
                  src={uiUser.avatar}
                  alt={uiUser.avatarAlt}
                />

                <div className={styles.identityMeta}>
                  <div className={styles.identityUser}>
                    <span className={styles.prompt}>$</span> {uiUser.username}
                    <span className={styles.cursor} aria-hidden="true" />
                  </div>

                  <div className={styles.identityLine}>
                    <span className={styles.key}>Level:</span> {uiUser.level}
                  </div>

                  <div className={styles.identityLine}>
                    <span className={styles.key}>Streak:</span> {uiUser.streakDays}{" "}
                    Tage
                  </div>
                </div>
              </div>
            </section>

            {/* XP */}
            <section className={styles.panel}>
              <div className={styles.panelTitle}>PROGRESS</div>

              <div className={styles.xpRow}>
                <div className={styles.xpText}>
                  Level {uiUser.level} — {uiUser.xpNow}/{uiUser.xpMax} EXP
                </div>

                <div
                  className={styles.xpBar}
                  role="progressbar"
                  aria-label="Erfahrungspunkte Fortschritt"
                  aria-valuenow={uiUser.xpNow}
                  aria-valuemin={0}
                  aria-valuemax={uiUser.xpMax}
                  aria-valuetext={`${uiUser.xpNow} von ${uiUser.xpMax} EXP`}
                >
                  <div
                    className={styles.xpBarFill}
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>

                <div className={styles.xpNext}>
                  Next unlock at {uiUser.xpMax} EXP:{" "}
                  <span className={styles.accent}>{uiUser.nextUnlock}</span>
                </div>
              </div>
            </section>

            {/* Achievements */}
            <section className={`${styles.panel} ${styles.panelWide}`}>
              <div className={styles.panelTitle}>ACHIEVEMENTS</div>

              <div className={styles.badgeGrid}>
                {uiUser.achievements.map((a) => (
                  <article key={a.id} className={styles.badge}>
                    <div className={styles.badgeName}>{a.title}</div>
                    <div className={styles.badgeDesc}>{a.desc}</div>
                    <div className={styles.badgeDate}>{a.date}</div>
                  </article>
                ))}
              </div>
            </section>

            {/* Activity */}
            <section className={`${styles.panel} ${styles.panelWide}`}>
              <div className={styles.panelTitle}>ACTIVITY FEED</div>

              <ul className={styles.feed}>
                {uiUser.activity.map((e) => (
                  <li key={e.id} className={styles.feedItem}>
                    <span className={styles.feedTs}>[{e.ts}]</span> {e.text}
                  </li>
                ))}
              </ul>
            </section>

            {/* Danger Zone */}
            <section className={styles.dangerZone}>
              <Button
                className={styles.dangerBtn}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                ACCOUNT LÖSCHEN
              </Button>
            </section>

            {/* Modal */}
            <DeleteConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleDeleteAccount}
              errorMsg={deleteError}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
