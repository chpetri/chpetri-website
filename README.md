# chpetri.com

Source code for my personal website: [chpetri.com](https://chpetri.com).

A minimalist, static website focused on IT security, networks, and systems.

## Overview

- **Stack:** Semantic HTML, CSS, Vanilla JavaScript, Vite (build only)
- **Hosting:** GitHub Pages
- **Design Decisions:** Zero runtime dependencies, no tracking or cookies, no external fonts, and a client-side terminal simulation without external network requests.

## Pages

- `/` — Homepage with professional summary, certification ledger, and interactive terminal
- `/cv/` — Curated bilingual profile (English / German) with print layout
- `/projects/` — Practical lab environments and technical projects

## Local Development

```bash
npm ci
npm run dev
```

Run test suite:

```bash
npm test
```
