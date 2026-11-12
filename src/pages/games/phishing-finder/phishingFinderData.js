// src/pages/games/phishing-finder/phishingFinderData.js

export const initialEmails = [
  {
    id: 1,
    from: "support@bank-secure.example",
    subject: "DRINGEND: Aktualisierung Ihrer Sicherheitsdaten",
    date: "2026-01-01",
    isPhishing: true,
    body: `Sehr geehrter Kunde,

aufgrund neuer Sicherheitsrichtlinien müssen Sie Ihre Identität bestätigen. 

Bitte aktualisieren Sie Ihre Daten innerhalb von 24 Stunden über den untenstehenden Link, um eine Kontosperrung zu vermeiden.

[[LINK:Jetzt Identität bestätigen]]

Mit freundlichen Grüßen,
Ihr Bank-Sicherheitsteam`,
    options: [
      { id: "o1", text: "Dringlichkeit und Drohung mit Kontosperrung" },
      { id: "o2", text: "Unpersönliche Anrede" },
      { id: "o3", text: "Link führt auf fremde Seite" },
    ],
    correctOptionIds: ["o1", "o2", "o3"],
  },
  {
    id: 2,
    from: "newsletter@opensource.org",
    subject: "DevTools v3.4.0 Release 🚀",
    date: "2026-01-03",
    isPhishing: false,
    body: `Hallo Community,

das neue Update ist da! Infos und Download findest du wie immer auf unserer offiziellen Projektseite.

[[LINK:Release Notes ansehen]]

Vielen Dank an alle Contributor!
Happy Coding!`,
    options: [
      { id: "o1", text: "Keine Datenabfrage" },
      { id: "o2", text: "Plausibler Absender und Kontext" },
    ],
    correctOptionIds: ["o1", "o2"],
  },
  {
    id: 3,
    from: "security@paypaI-support.com", // Typo: Großes 'I' statt kleines 'l'
    subject: "Sicherheitswarnung: Unautorisierter Zugriff!",
    date: "2026-01-07",
    isPhishing: true,
    body: `Hallo,

wir haben einen Login von einem neuen Gerät (iPhone 15, Standort: Moskau) festgestellt.

Warst du das? Falls nein, sichere dein Konto sofort:

[[LINK:Konto schützen & Passwort ändern]]

Dein Support-Team`,
    options: [
      { id: "o1", text: "Manipulierte Absender-Adresse (Typosquatting)" },
      { id: "o2", text: "Panikmache durch Standort im Ausland" },
    ],
    correctOptionIds: ["o1", "o2"],
  },
  {
    id: 4,
    from: "hr-department@company.example",
    subject: "Einladung: Jährliche Mitarbeiterbefragung",
    date: "2026-01-10",
    isPhishing: false,
    body: `Liebe Kolleginnen und Kollegen,

wir laden euch herzlich ein, an unserer jährlichen, anonymen Mitarbeiterbefragung teilzunehmen.

[[LINK:Zur Umfrage (Internes Portal)]]

Vielen Dank,
Euer HR Team`,
    options: [
      { id: "o1", text: "Interne Kommunikation über bekannten Kanal" },
      { id: "o2", text: "Keine Abfrage sensibler Daten" },
    ],
    correctOptionIds: ["o1", "o2"],
  },
];
