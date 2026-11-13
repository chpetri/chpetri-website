# chpetri.com

Quellcode meiner persönlichen Website: [chpetri.com](https://chpetri.com). Die Seite enthält meinen Lebenslauf, meine Projekte und Kontaktmöglichkeiten.

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
- `public/docs/`: IHK-Projektarbeit als PDF
- `fonts/` und `art/`: Schriften und Grafiken mit Quellen- und Lizenzangaben
- `public/.htaccess`: Sicherheits-Header und Regeln für den Apache-Server
- `tests/`: automatische Prüfungen

Der Lebenslauf steht auf Deutsch und Englisch auf der Seite `/cv/`. Eine PDF-Fassung gibt es nur mit Bewerbungen, nicht zum Download.

## Veröffentlichung

Die Website wird bei Hetzner gehostet. `scripts/deploy-ftp.sh` veröffentlicht nur einen sauberen, auf GitHub gepushten Stand: Es installiert die Abhängigkeiten neu, prüft und erstellt die Website, gleicht `dist/` per FTPS (lftp) mit dem Webspace ab und vergleicht danach jede Datei mit der Live-Seite. Die Zugangsdaten liegen nur in `~/.netrc`.

```bash
DRY_RUN=1 scripts/deploy-ftp.sh   # nur anzeigen, was sich ändern würde
scripts/deploy-ftp.sh             # hochladen
PRUNE=1 scripts/deploy-ftp.sh     # zusätzlich veraltete Dateien auf dem Server löschen (mit Rückfrage)
```

`public/.well-known/security.txt` läuft am angegebenen `Expires`-Datum ab; ab dann schlägt `npm test` fehl, bis ein neues Datum (höchstens ein Jahr voraus) eingetragen ist.
