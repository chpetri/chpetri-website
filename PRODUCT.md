# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The audience is deliberately broad (owner clarification, 2026-10-30): people interested in Christian's projects and possible future articles, peers, and recruiters or hiring managers. Recruiters are an important audience; the site is one route alongside LinkedIn and the owner's existing application channels.

Job interests include IT security, system administration, security consulting, and compliance. The portfolio must not restrict the owner to a single junior security specialization or read as an application landing page throughout.

## Product Purpose

chpetri.com is Christian Petri's personal project portfolio and professional profile. It should show what he actually works on: IT security, software projects, local search and automation tools, and Linux work. The project pages carry the concrete work; the bilingual CV provides qualifications and career history.

A blog or an external writing platform such as Substack is an open future product decision, not an approved build task. Success means visitors can understand the person and the work, explore a project, reach the CV, or get in touch without repeated introductions or duplicated contact blocks. Security experience from training, labs, or a case study stays distinguishable from professional practice.

## Positioning

An honest personal portfolio with an IT-security background, practical support experience, and current software and Linux projects. Describe the owner's actual contributions, including product decisions, testing and refinement. Do not infer manual Python/Rust implementation skills or production security operations experience from the existence of code in a repository.

The completed security training, dated certifications, and IHK case study support the professional profile. They do not need to define every project. Tone is plain, personal, and understated. The owner chose an advisor-oriented introduction with Darmstadt included: "Ich bin Christian, Berater für IT-Sicherheit aus Darmstadt." This is the owner-selected profile description; exact qualifications and experience remain in the CV.

## Operating Context

- Visitors come from application documents, LinkedIn (linkedin.com/in/christianpetri1), GitHub (github.com/chpetri), and TryHackMe (tryhackme.com/p/chpetri).
- The CV is read on screen and printed; it exists in English and German on one page with a language switch and a print layout.
- Location: Darmstadt, Germany. Contact: contact@chpetri.com.
- Source lives in this repository (chpetri/chpetri-website, private). The domain www.chpetri.com is served from a Hetzner web space.
- The deployed site (last-modified 2026-09-11) is newer than the repository (2026-08-30): copy on the home page and CV was revised, the Projects page gained the IHK case study, and the PDF `docs/Christian_Petri_IHK_Projektarbeit_Sicherer_Fernzugriff.pdf` (615 KB) exists only on the host. A full HTTPS mirror of the deployed site is the content source of truth for the rebuild.

## Capabilities and Constraints

- Static site: semantic HTML and CSS, Vite for build only, no JavaScript shipped. Zero runtime dependencies, no tracking, no cookies, no external fonts, no external network requests (strict CSP meta with `default-src 'self'`; the stylesheet is inlined per page and allowed only by its SHA-256 hash).
- Performance rule (owner, citing endtimes.dev "Why your website should be under 14kB in size"; a first article on the site may later be about this): on paper the first TCP round trip carries 10 × 1460 = 14,600 bytes. Measured on the live server in real Chrome (2026-10-31 and 2026-11-01, over a VPN with 1265-byte packets), TLS tickets and the HTTP/2 setup leave far less: up to 9,400 bytes arrived in the first round trip in 38 of 39 samples, from 11,000 bytes never. The start page renders completely from its first response: its HTML, CSS, two font subsets that cover only its own glyphs and the engraving are inlined, at most 9,400 bytes at the server's Brotli level 5 (its CSP allows `data:` fonts). Owner decision (2026-11-01): this tight budget applies to the start page only. Every other page keeps HTML and CSS under 13.6 kB gzipped and then loads two cached, subsetted font files. Enforced by `npm test`.
- Pages: `/` (start), `/cv/` (the bilingual CV, DE default / EN, print layout, one PDF per language), `/work/` ("Projekte": IHK case study with PDF download; formerly `/projects/`), `/contact/` ("Kontakt"). `/about/` and `/projects/` redirect. Confirmed for the redesign: start page is rebuilt as a minimal entry; the interactive terminal is dropped. Owner decisions (2026-10-30): the separate About page was redundant with the CV and was removed; after a design critique the top-right corner is "CV" again (recruiters look for that word) and the CV offers a PDF download; the whole site chrome is German because the audience is German (the CV stays bilingual).
- Node >= 22.13; `npm test` builds and runs `tests/site.test.mjs`. Tests must be kept in step with the pages. Font subsets are rebuilt with `scripts/fonts.py` (Python with fontTools, development only) whenever the start page's visible text changes; a test fails until they cover it.
- Deploy: `scripts/deploy-ftp.sh` builds, tests and uploads `dist` to the Hetzner web space over FTPS; the owner runs it (credentials stay in `~/.netrc`). `.github/workflows/test.yml` runs npm ci, npm audit and npm test on every push. `public/.htaccess` configures Apache; `public/.nojekyll` is a leftover marker for a possible GitHub Pages host.
- Hosting decision (owner, 2026-10-30): the relaunch went live on the Hetzner web space; GitHub Pages is not used (the repository is private).
- Terminology: "IT Security · Networks · Systems" (EN) / "IT-Sicherheit · Netzwerke · Systeme" (DE), used on the CV; "IHK case study" / "IHK-Fallstudie"; corners read "Christian Petri", "CV", "Projekte", "Kontakt"; certification names as issued by CompTIA and IHK.
- Visual decision (owner, 2026-10-30, replaces the warm hueless palette and the Archivo/Geist type system): the "Schlüssel" direction. Petri is the genitive of Petrus, the keeper of the keys; a public-domain cut-away padlock from the Encyclopédie plates (Serrurier) stands behind the greeting as a 1-bit raster. One ground for the whole site, Anlassblau (#1f2c66, the blue of tempered steel), pale steel ink. Baskervville for reading, Saira Extra Condensed for large words and labels. Chosen over a security-print direction (guilloche, microtext) and a teletext direction, after three rounds of rendered comparisons.
- Undecided (owner idea, 2026-10-30): rotating between several themes every six hours (for example by an Apache rule on the hour, which needs no cron job). Not built; each theme would need its own sub-pages.

## Brand Commitments

- Name and mark: "Christian Petri"; the wordmark in the top-left corner reads "Christian Petri" only, so the job title is not said twice on the start page (owner, 2026-10-30). Favicon: a keyhole in pale steel on Anlassblau.
- Binding visual reference (volunteered by the owner, not expanded here): the supplied screenshot of a dark, near-empty start page: wordmark top-left, "CV" top-right, a single large "Hi." centred, "About" bottom-left, "Contact" bottom-right. Future design work builds toward this.
- Binding aesthetic reference (owner, third brief): the design philosophy of Nous Research / Hermes Agent (nousresearch.com), not a copy of it: one committed colour field instead of grey mood, classical engraving put through the machine (Nous rasters Hermes engravings and paintings), a thin condensed display face against a book face, imagery drawn from the owner's own name the way Nous draws on Hermes. All faces are open (SIL OFL).
- Voice: first person, plain, understated, no buzzwords or inflated claims. Site chrome and copy in German; the CV is bilingual (German first). Owner-selected start-page sentence (2026-10-30): "Ich bin Christian, Berater für IT-Sicherheit aus Darmstadt." Keep it as one sentence under "Hi." The owner omitted the suggested software-project sentence; the projects themselves and detailed background belong in the project pages and CV. Avoid the rejected "beschäftige mich mit" wording.
- Avoid redundant contact content on the same screen. The CV's contact section appears in print/PDF only; the existing navigation reaches the contact page on screen. The CV shows no location and no as-of date, and the contact page lists no location (owner, 2026-10-30: not relevant there; Darmstadt is in the start sentence). Certificates link to their Credly verification pages; the IHK certificate has no public badge. The Projekte page offers only the PDF download until a stable in-browser rendering of the case study exists.
- Social preview `public/og.png`: a screenshot of the start page at 1200 × 630 (regenerate after start-page changes). The favicon is `public/favicon.svg`.

## Evidence on Hand

- Certifications with dates (02/2026 CNVP, 02/2026 PenTest+, 02/2026 IHK Cyber Security Advisor, 12/2025 Security+, 08/2025 Network+).
- Training: 05/2025 to 02/2026 full-time IT-security training, MindRefined GmbH (remote), with IHK case study.
- Experience: 11/2024 to 05/2025 Technical Support / IT Technician, Computer für alle, Griesheim; 09/2022 to 10/2024 independent study; 2021 working student eprimo GmbH; 2020 to 2021 working student Signition Holding.
- Education: 2019 to 2022 Business Administration, 2018 to 2019 Online Communication, both Darmstadt University of Applied Sciences.
- Languages: German native, English B2.
- Project: IHK case study "Securing administrative remote access" (12/2025), PDF on the host, to be added under `public/docs/`.
- Absent and must not be fabricated: testimonials, employer endorsements, measured professional security outcomes, or metrics without their original evidence. Existing local projects are not automatically public releases. Private work, personal data, and third-party project details need their own publication scope.

## Product Principles

1. Keep projects, CV, and contact easy to reach. The start page is a short personal entrance.
2. Say only what the evidence supports; label lab and training work as such.
3. Project pages explain the actual work. The CV must read well on screen, in both languages, and in print.
4. Stay dependency-free and self-hosted: no third-party fonts, scripts, or trackers; CSP stays strict.
5. Keep the repository the single source of truth for what is deployed.

## Accessibility & Inclusion

Keep the existing baseline: skip link, semantic landmarks, visible focus states, keyboard-reachable navigation, `lang` attributes per language on the bilingual CV, print stylesheet. No additional standard mandated.
