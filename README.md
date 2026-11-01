# chpetri.com

Quellcode meiner persönlichen Website: [chpetri.com](https://chpetri.com). Die Seite enthält meinen Lebenslauf, ein Projekt und Kontaktmöglichkeiten.

Die Website besteht aus HTML und CSS. Vite erstellt die fertigen Dateien; im Browser wird kein JavaScript benötigt. Schriften und Grafiken liegen auf dem eigenen Server.

## Lokal starten

Voraussetzung ist Node.js ab Version 22.13.

```bash
npm ci
npm run dev
```

## Prüfen und bauen

```bash
npm test
```

Der Test erstellt die Website und prüft unter anderem Inhalte, Links, einzelne Aspekte der Barrierefreiheit und Dateigrößen. Das Ergebnis liegt in `dist/`. Auf GitHub laufen die Prüfungen ebenfalls automatisch.

## Aufbau

- `index.html`, `cv/`, `work/`, `contact/`: die Seiten der Website
- `base.css`, `home.css`, `cv.css`, `pages.css`: Gestaltung
- `public/docs/`: Lebensläufe und IHK-Projektarbeit als PDF
- `fonts/` und `art/`: Schriften und Grafiken mit Quellen- und Lizenzangaben
- `tests/`: automatische Prüfungen

Die Lebensläufe stehen auf Deutsch und Englisch zur Verfügung. Bei Änderungen am Lebenslauf müssen die PDF-Dateien mit der HTML-Version abgeglichen werden.

## Veröffentlichung

Die Website wird bei Hetzner gehostet. `scripts/deploy-ftp.sh` prüft und erstellt die Website und lädt `dist/` per FTPS hoch. Es überschreibt oder ergänzt Dateien auf dem Server; entfernte Dateien müssen dort separat gelöscht werden.
