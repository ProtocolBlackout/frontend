import { useMemo, useState } from "react";
import "./profil.css";

const MOCK_USER = {
  username: "User",
  avatar: "/images/defaultAvatar.png", // anpassen
  avatarAlt: "Profilbild",
  level: 7,
  xpNow: 420,
  xpMax: 1000,
  nextUnlock: "New unlock: Terminal Theme (Green Phosphor)",
  streakDays: 7,
  profilePublic: true,
  achievements: [
    { id: "a1", title: "Erstes Quiz bestanden", desc: "Quiz abgeschlossen: Ethics 101", date: "2026-01-10" },
    { id: "a2", title: "History Timeline komplett", desc: "Alle Timeline-Stationen gelesen", date: "2026-01-08" },
    { id: "a3", title: "3 Lessons am Stück", desc: "3 Lernmodule ohne Pause", date: "2026-01-06" }
  ],
  activity: [
    { id: "e1", ts: "2026-01-12 21:10", text: "+50 XP — Quiz 'Ethical Hacking' abgeschlossen" },
    { id: "e2", ts: "2026-01-12 20:44", text: "Achievement unlocked — Erstes Quiz bestanden" },
    { id: "e3", ts: "2026-01-11 19:03", text: "+20 XP — Lesson 'History: Phreaking' gelesen" },
    { id: "e4", ts: "2026-01-10 18:21", text: "Streak: 7 Tage erreicht" }
  ]
};

export default function Profile() {
  const [profilePublic, setProfilePublic] = useState(MOCK_USER.profilePublic);

  const xpPercent = useMemo(() => {
    const p = (MOCK_USER.xpNow / MOCK_USER.xpMax) * 100;
    return Math.max(0, Math.min(100, Math.round(p)));
  }, []);

  return (
    <main className="profile">
      <section className="terminal">
        <header className="terminal__header">
          <div className="terminal__title">
            pb://profile -- user={MOCK_USER.username} -- access={profilePublic ? "public" : "private"}
          </div>

          <label className="terminal__toggle">
            <span className="terminal__toggleLabel">Profil öffentlich</span>
            <input
              type="checkbox"
              checked={profilePublic}
              onChange={(e) => setProfilePublic(e.target.checked)}
            />
            <span className="terminal__toggleUI" aria-hidden="true" />
          </label>
        </header>

        <div className="terminal__body">
          <div className="profileGrid">
            {/* Identity */}
            <section className="panel">
              <div className="panel__title">IDENTITY</div>

              <div className="identity">
                <img
                  className="identity__avatar"
                  src={MOCK_USER.avatar}
                  alt={MOCK_USER.avatarAlt}
                />

                <div className="identity__meta">
                  <div className="identity__user">
                    <span className="prompt">$</span> {MOCK_USER.username}
                    <span className="cursor" aria-hidden="true" />
                  </div>

                  <div className="identity__line">
                    <span className="key">Level:</span> {MOCK_USER.level}
                  </div>

                  <div className="identity__line">
                    <span className="key">Streak:</span> {MOCK_USER.streakDays} Tage
                  </div>
                </div>
              </div>
            </section>

            {/* XP */}
            <section className="panel">
              <div className="panel__title">PROGRESS</div>

              <div className="xpRow">
                <div className="xpText">
                  Level {MOCK_USER.level} — {MOCK_USER.xpNow}/{MOCK_USER.xpMax} EXP
                </div>

                <div
                  className="xpBar"
                  role="progressbar"
                  aria-label="Erfahrungspunkte Fortschritt"
                  aria-valuenow={MOCK_USER.xpNow}
                  aria-valuemin={0}
                  aria-valuemax={MOCK_USER.xpMax}
                  aria-valuetext={`${MOCK_USER.xpNow} von ${MOCK_USER.xpMax} EXP`}
                >
                  <div className="xpBar__fill" style={{ width: `${xpPercent}%` }} />
                </div>

                <div className="xpNext">
                  Next unlock at {MOCK_USER.xpMax} EXP:{" "}
                  <span className="accent">{MOCK_USER.nextUnlock}</span>
                </div>
              </div>
            </section>

            {/* Achievements */}
            <section className="panel panel--wide">
              <div className="panel__title">ACHIEVEMENTS</div>

              <div className="badgeGrid">
                {MOCK_USER.achievements.map((a) => (
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
                {MOCK_USER.activity.map((e) => (
                  <li key={e.id} className="feed__item">
                    <span className="feed__ts">[{e.ts}]</span> {e.text}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
