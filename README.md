# Protocol Blackout – Frontend

Frontend für **Protocol Blackout** (React + Vite) mit Routing, zentralem API-Helper (`requestJson`) und Theme-Handling inkl. optionalem Backend-Sync (wenn eingeloggt).

---

## Lokales Setup

### 1) Install

```bash
npm install
```

### 2) ENV anlegen

Lege im Frontend-Root eine `.env` an und nutze `env.sample` als Vorlage.

**Pflicht:**

- `VITE_API_BASE_URL` (Backend Base URL)
- `VITE_ENV` (z. B. `development`)

Beispiel (lokal):

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENV=development
```

Beispiel (Render Dev – optional):

```env
VITE_API_BASE_URL=https://protocol-blackout-backend-dev.onrender.com
VITE_ENV=development
```

⚠️ Wichtig: Frontend-ENV enthält **keine Secrets** (Vite-ENV ist im Build sichtbar).

### 3) Starten (Dev)

```bash
npm run dev
```

### 4) Build / Preview

```bash
npm run build
npm run preview
```

---

## NPM Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

## Routes (App.jsx)

- `/` und `/home`
- `/history`
- `/ethics`
- `/games`
- `/login`
- `/auth/verify-email`
- `/password-reset`
- `/about`
- `/contact`
- `/profil`
- `/goodbye`

---

## API (Frontend → Backend)

### Zentraler Helper

Alle Requests laufen über `requestJson(path, options, needsAuth)` aus `src/services/api.js`.

Token:

- localStorage Key: `pbToken`

Bei `needsAuth=true` wird gesetzt:

```txt
Authorization: Bearer <token>
```

Bei `401` (und `needsAuth=true`): Token wird gelöscht und Redirect auf `/login`.

### Verwendete Endpunkte (aus dem Frontend-Code)

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/verify-email?token=...`
- `POST /auth/password-reset/request`
- `POST /auth/password-reset/confirm`
- `GET /auth/profile` (Theme/Profil)
- `PATCH /auth/profile/theme` (Body: `{ preferredTheme }`)
- `GET /profile/progress`
- `DELETE /auth/profile` (optional mit `{ password }` im Body – Backend kann es ignorieren)
- `POST /mail/contact`
- `GET /games`
- `POST /games/quiz/result`
- `POST /games/cracker/result`

---

## Gastmodus: Pending Game Result → nach Login senden

Wenn ein Gast ein Spiel beendet, wird das Ergebnis als pending gespeichert:

- sessionStorage Key: `pbPendingGameResult`

Beim Login wird ein vorhandenes pending Ergebnis automatisch gesendet:

- `quiz` / `quiz-01` → `POST /games/quiz/result`
- `cracker` → `POST /games/cracker/result`

Pending wird nur gelöscht, wenn der POST erfolgreich war.
Zusätzlich verfällt es nach 1 Stunde (`createdAt`-Check).

---

## Theme

- localStorage Key: `pb_preferredTheme`
- Setzt: `document.documentElement.dataset.theme = "dark" | "light"`
- Wenn Token vorhanden:
  - lädt Profil via `GET /auth/profile` und übernimmt `preferredTheme`
  - beim Toggle: `PATCH /auth/profile/theme` (Rollback bei Fehler)

UI-Komponente: `src/components/ThemeToggle.jsx` (A11y: `role="switch"`, `aria-checked`)

---

## Deployment Hinweis (Render Cold Start)

Wenn `fetch(...)` komplett fehlschlägt (kein HTTP-Status), wirft der API-Helper den Fehler:

> „Netzwerkfehler - Server nicht erreichbar (ggf. Render Cold Start)“

---

## Mitwirken

- Team-Regeln: `CODING_GUIDELINES.md`
- Contribution: `CONTRIBUTING.md`
