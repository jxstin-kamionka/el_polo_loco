# 🐔 El Pollo Loco

Ein 2D Jump-and-Run Browsergame im Stil von klassischen Plattformern.
Springe über Gegner, sammle Münzen und Flaschen und besiege den Endboss!

---

## 🎮 Features

* 🏃‍♂️ Charakterbewegung (Laufen & Springen)
* 🐔 Gegner (Hühner & kleine Hühner)
* 💰 Münzen sammeln
* 🍾 Flaschen sammeln & werfen
* 👾 Endboss mit eigener Lebensanzeige
* ❤️ Health-, Coin- & Bottle-Statusbars
* 📱 Mobile Steuerung (Touch Controls)
* 🔄 Bildschirmrotation für Mobile (Landscape only)
* 🔊 Soundeffekte & Musik

---

## 🕹️ Steuerung

### 💻 Desktop

| Taste     | Aktion         |
| --------- | -------------- |
| ⬅️ / ➡️   | Bewegen        |
| Leertaste | Springen       |
| D         | Flasche werfen |

### 📱 Mobile

* ⬅️ ➡️ Buttons → Bewegen
* ⬆️ Button → Springen
* 🧪 Button → Flasche werfen

👉 **Hinweis:** Das Spiel funktioniert nur im Querformat auf mobilen Geräten.

---

## 🚀 Installation & Start

1. Repository klonen:

```bash
git clone https://github.com/DEIN-USERNAME/el-pollo-loco.git
```

2. Projekt öffnen:

```bash
cd el-pollo-loco
```

3. Starte das Spiel:

* Öffne die `index.html` im Browser
  oder nutze einen Live Server (empfohlen)

---

## 🛠️ Technologien

* HTML5
* CSS3 (Responsive Design)
* JavaScript (ES6)
* Canvas API

---

## 📁 Projektstruktur

```
el-pollo-loco/
│
├── assets/            # Bilder, Sounds, Fonts
├── css/               # Mobile Stylesheet
├── style.css          # Haupt-Stylesheet
├── script.js          # Game Logik
├── models/            # Klassen (Character, World, etc.)
├── levels/            # Level Definitionen
├── index.html
└── README.md
```

---

## 🧠 Architektur

Das Spiel basiert auf einer objektorientierten Struktur:

* `World` → Hauptlogik & Game Loop
* `Character` → Spieler
* `Enemy` → Gegner
* `ThrowableObject` → Wurfobjekte
* `StatusBar` → UI-Anzeigen

---

## 📱 Responsive Design

* Automatische Anpassung an verschiedene Bildschirmgrößen
* Mobile Controls erscheinen unter **760px**
* Forced Landscape Mode für optimales Gameplay

---

## 🎯 Spielziel

* Sammle Münzen und Flaschen
* Besiege Gegner durch Draufspringen oder Werfen
* Erreiche den Endboss und besiege ihn

---

## 🔊 Sound

* Hintergrundmusik
* Effekte für:

  * Treffer
  * Münzen
  * Gegner
  * Endboss

---

## 🧑‍💻 Autor

**Justin Kamionka**
📍 Bad Kissingen

---

## 📜 Lizenz

Dieses Projekt ist ein Lernprojekt und nicht für kommerzielle Nutzung gedacht.

---

## 💡 Verbesserungen (To-Do)

* [ ] Highscore System
* [ ] Mehr Level
* [ ] Gegner KI verbessern
* [ ] Animationen erweitern
* [ ] Gamepad Support

---

## ⭐ Feedback

Wenn dir das Projekt gefällt, gib gerne ein ⭐ auf GitHub!
