# chpetri.com

Source code for my personal website: [chpetri.com](https://chpetri.com).

A static site in German, focused on IT security, networks, and systems: a greeting with a one-line introduction, a bilingual CV (German first) with PDF downloads, one project, and a way to get in touch.

## Overview

- **Stack:** Semantic HTML, CSS, Vite (build only). No JavaScript is shipped. Each page links one stylesheet (`home.css`, `pages.css` or `cv.css`) that imports the shared `base.css` first; the build inlines it into one `<style>` and allows it in the Content Security Policy by SHA-256 hash.
- **First round trip:** the start page renders completely from its first response: two font subsets that cover only its own letters and the lossless WebP engraving are inlined too, 9.4 kB in total as the server sends it (Brotli level 5). That budget is measured, not arithmetic: TCP slow start allows 14,600 bytes on paper, but TLS tickets and the HTTP/2 setup use up packets. On the live server, over a VPN with small packets, real Chrome got up to 9,400 bytes in the first round trip in 38 of 39 samples, and from 11,000 bytes never. Every other page keeps HTML and CSS under 13.6 kB gzipped and then loads two cached font files. `npm test` enforces both.
- **Hosting:** a Hetzner web space serves chpetri.com. `scripts/deploy-ftp.sh` builds, tests and uploads `dist/` over FTPS (credentials in `~/.netrc`, see the script). GitHub Actions runs the tests on every push.
- **Design:** one ground for the whole site, Anlassblau (#1f2c66, the blue of tempered steel), with pale steel ink. Behind the greeting stands a cut-away padlock from the plates of Diderot's Encyclopédie (public domain, see `art/README.md`); Petri is the genitive of Petrus, the keeper of the keys. Two self-hosted typefaces under the SIL Open Font License: Baskervville for reading and the corner capitals, Saira Extra Condensed for large words and labels (see `fonts/README.md`). Design system: `DESIGN.md`.
- **Principles:** zero runtime dependencies, no tracking or cookies, no external requests, strict Content Security Policy.

## Pages

- `/` — Start: the greeting inside the four-corner frame
- `/cv/` — Bilingual CV (German default, English via switch) with certifications, print layout and one PDF per language
- `/work/` — "Projekte": the IHK case study on secure administrative remote access, with PDF
- `/contact/` — "Kontakt": email and profiles
- `/about/`, `/projects/` — Old routes, redirect to `/cv/` and `/work/`

## CV PDFs

`public/docs/Christian_Petri_CV_DE.pdf` and `_EN.pdf` are printed from the built CV page with headless Chrome. Regenerate them after every CV change (serve `dist/` first, e.g. `npx vite preview`):

```bash
google-chrome-stable --headless=new --no-pdf-header-footer --print-to-pdf=public/docs/Christian_Petri_CV_DE.pdf http://127.0.0.1:4173/cv/
```

For the English PDF, copy `dist/cv/index.html` with the `lang-en` radio set to `checked`, print that copy, then delete it. Update the sizes in the two download buttons in `cv/index.html`. Then read both PDFs with `pdftotext`: capitals must come out as words, not spaced letters, and no hyphenated keyword may be joined across a line end (wrap such a word in `<span class="keep">`, which keeps it whole on paper only).

## Fonts

The font files in `fonts/` are subsets built by `scripts/fonts.py` (Python with fontTools, development only; instructions in the script). Run it again whenever the start page's visible text changes: its inline subsets only contain the letters it shows, and `npm test` fails until they cover the new text.

## Local Development

```bash
npm ci
npm run dev
```

Run the test suite (builds first):

```bash
npm test
```
