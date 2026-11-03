---
name: chpetri.com
description: "A locksmith's plate on tempered steel: one Anlassblau field, pale blank-steel ink, Diderot's padlock through a 1-bit raster behind the greeting, a thin condensed face against a book face. German chrome."
colors:
  ground: "#1f2c66"
  ink: "#e8ecf4"
  ink-soft: "#dde2ee"
  ink-2: "#bac4dd"
  ink-3: "#a3afcc"
  rule: "rgba(232, 236, 244, 0.26)"
  rule-soft: "rgba(232, 236, 244, 0.13)"
  button-hover: "#ffffff"
  print-ground: "#ffffff"
  print-ink: "#141a33"
  print-ink-soft: "#1f2640"
  print-ink-2: "#3a4466"
  print-ink-3: "#4f5878"
  print-rule: "#b9bfd0"
  print-rule-soft: "#dde1ea"
typography:
  greeting:
    fontFamily: "Saira Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "560px"
    fontWeight: 300
    lineHeight: 0.76
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Saira Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "116px"
    fontWeight: 300
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Saira Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "104px"
    fontWeight: 300
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  email:
    fontFamily: "Saira Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "124px"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "0em"
  corner:
    fontFamily: "Baskervville, Baskerville, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.24em"
  label:
    fontFamily: "Saira Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.14em"
  button:
    fontFamily: "Saira Extra Condensed, Arial Narrow, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.16em"
  intro:
    fontFamily: "Baskervville, Baskerville, Georgia, serif"
    fontSize: "1.625rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0em"
  body:
    fontFamily: "Baskervville, Baskerville, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  cv-body:
    fontFamily: "Baskervville, Baskerville, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  entry:
    fontFamily: "Baskervville, Baskerville, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0em"
rounded:
  none: "0px"
spacing:
  edge: "clamp(16px, 2vw, 30px)"
  bar: "72px"
  bar-phone: "60px"
  measure: "66ch"
  page-top: "clamp(40px, 8vh, 96px)"
  page-bottom: "clamp(72px, 12vh, 140px)"
  section: "clamp(28px, 4vh, 40px)"
  row: "12px"
  entry: "28px"
  greeting-gap: "clamp(22px, 4.4vh, 44px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "15px 22px 14px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
    textColor: "{colors.ground}"
  corner-link:
    textColor: "{colors.ink-2}"
    typography: "{typography.corner}"
    padding: "0 10px"
    height: "44px"
  corner-link-current:
    textColor: "{colors.ink}"
    typography: "{typography.corner}"
  lang-label:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "0 14px 0 12px"
    height: "44px"
  lang-label-checked:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
    height: "44px"
---

# Design System: chpetri.com

## Overview

**Creative North Star: "The Locksmith's Plate"**

Petri is the genitive of Petrus, the keeper of the keys. The site is a plate from a locksmith's book printed on tempered steel: one field of Anlassblau, the blue that steel takes when it is tempered (lock springs, watch screws), and pale "blank steel" ink, the bright metal an engraver's cut reveals through the bluing. On the start page a cut-away padlock from the plates of Diderot's *Encyclopédie* (Serrurier, public domain) stands behind the greeting, put through a 1-bit raster the way Nous Research puts classical engraving through a screen. Everything else is restraint: four corners, one thing in the middle, no second colour.

The frame never changes. Every page has the same four corners (the name top-left, CV top-right, Projekte bottom-left, Kontakt bottom-right) and holds one thing in the middle: the greeting with one sentence on the start page, a document on the sub-pages. The visible headline of a sub-page is its content (the name on the CV, the case title on Projekte, the address on Kontakt), never a repeat of the corner that led there; each page keeps a visually hidden h1. Cross-document view transitions keep the corners still while the middle changes.

Two voices from the plate's era and its machine. Saira Extra Condensed, light and in capitals when large, announces (the greeting, names, titles, the address) and, at weight 500 in small tracked capitals, labels (dates, section rails, metadata, the button). Baskervville, a 1757 face contemporary with the *Encyclopédie*, carries everything that is read, and it sets the corner capitals, engraved like the margin lettering of a plate. Confirmed rejections: black with neon, cream with serif and terracotta, editorial hairlines with italic serif and mono labels, terminal or hacker costume, padlock icons, badge walls, cards, gradients, shadows, rounded corners.

**Key Characteristics:**
- One ground on every page, Anlassblau; hierarchy is ink stepping down through cool steel greys tinted from the blue.
- Imagery is a public-domain engraving through a 1-bit raster, shown pixelated at a third of full strength; never a vector icon, never smoothed.
- Two faces with fixed jobs: Saira announces and labels, Baskervville reads and sets the corners.
- The square raster dot is the only marker: current page, chosen language, list bullets.
- Flat material: hairlines at 26 % and 13 % ink, no box borders, no shadows, no radius.
- The start page renders completely from its first response (inline font subsets and engraving, at most 9,400 bytes at the server's Brotli level 5); no JavaScript anywhere.

## Colors

One committed field and its steel: a deep blue ground, a pale cool ink, two dimmer steel steps, and hairlines of the ink at low alpha.

### Primary
- **Blank Steel** (`{colors.ink}`): the one voice. Greeting, names and titles, the start sentence, CV entry titles and profile, the current corner, the language that is chosen, focus rings, caret, selection fill, the skip link and the download button's fill.

### Neutral
- **Anlassblau** (`{colors.ground}`): the only background, including both corner bars, `theme-color`, the text of the inverted button and of selected text.
- **Steel Soft** (`{colors.ink-soft}`): long reading text (prose on Projekte, the CV body).
- **Steel 2** (`{colors.ink-2}`): secondary text that is still scanned first: corner links at rest, the note above the case study, CV dates, employers and the role line, the language not chosen.
- **Steel 3** (`{colors.ink-3}`): labels and metadata (section rails, skill and contact terms in the CV, the profile terms on Kontakt, case meta, title qualifiers), list bullets, the underline of links at rest, the scrollbar thumb. The dimmest text, still 5.9:1 on the ground.
- **Rule** (`{colors.rule}`) and **Rule Soft** (`{colors.rule-soft}`): 1px hairlines. Rule draws outer structure (CV section tops, the case top); Rule Soft draws rows inside a section.
- **Polished** (`{colors.button-hover}`): pure white, only as the hover and focus fill of the download button.

### Print
- **Print Ground, Print Ink, Print Ink Soft, Print Ink 2, Print Ink 3, Print Rule, Print Rule Soft** (`{colors.print-*}`): the same roles reassigned under `@media print` with `color-scheme: light`: white paper and blue-black ink from the same hue, rules as solid light greys.

### Named Rules
**The One Field Rule.** Every page stands on Anlassblau and nothing else. There is no accent hue; emphasis comes from size, weight and the four ink steps.

**The Blank Steel Rule.** Every grey is tinted from the blue (hue 265 to 270 in OKLCH). A neutral grey reads as dirt on the field.

**The Contrast Floor Rule.** Every text step reaches 4.5:1 on the ground (the lowest, Steel 3, is 5.94:1), and an underline that alone marks a link uses Steel 3, never the hairline.

## Typography

**Display and label face:** Saira Extra Condensed (Saira variable at width 62.5, weight 300 to 500; self-hosted subset; fallback Arial Narrow, sans-serif)
**Reading face:** Baskervville (variable, weight 400 to 600; self-hosted subset; fallback Baskerville, Georgia, serif)

**Character:** a machine-age condensed grotesk, thin when large, against an eighteenth-century book face. The contrast is the point: the greeting is thin and tall, the sentence under it reads like a line from a book.

### Hierarchy
- **Greeting** (Saira 300, fluid up to 560px: `clamp(110px, min(46vmin, 74svh - 214px), 560px)`, 0.76, -0.01em, capitals): "HI." on the start page and "HM." on the 404. It sizes to both viewport sides so lock, greeting and sentence fit between the bars. On the start page the box spans the full width and its line box is fixed, so nothing moves when the font replaces the fallback. The 404 has no lock above its word and subtracts 160px instead of 214px.
- **Headline** (Saira 300, fluid up to 116px: `clamp(60px, 8vw, 116px)`, 0.86, -0.005em, capitals): the name at the head of the CV.
- **Title** (Saira 300, fluid up to 104px: `clamp(48px, 7vw, 104px)`, 0.86, capitals, max 15ch): the case title on Projekte.
- **Email** (Saira 300, fluid up to 124px: `clamp(44px, 8.4vw, 124px)`, 1, not capitalised): the address on Kontakt, the page's headline and primary link, 2px underline.
- **Intro** (Baskervville 400, fluid up to 1.625rem: `clamp(1.25rem, 1.8vw, 1.625rem)`, 1.35, Blank Steel, max 18.2em, balanced, two lines reserved): the one sentence under the greeting, 1.1875rem on phones. Measured in em because the inline subset has no "0" for `ch`.
- **Entry** (Baskervville 600, 1.1875rem, 1.3): CV entry titles.
- **Body** (Baskervville 400, 1.125rem, 1.65, Steel Soft, 66ch): prose on Projekte; the note above it is 1.125rem in Steel 2, both 1.0625rem on phones. The CV body is 1.0625rem at 1.6, its profile 1.1875rem in Blank Steel; employers 1.0625rem in Steel 2.
- **Corner** (Baskervville 400, 0.875rem, 1.2, 0.24em, capitals, Steel 2): the four corner links; 0.8125rem and 0.18em on phones.
- **Label** (Saira 500, 0.875rem, 1.5, 0.14em, capitals, tabular lining numerals): section rails, terms, metadata, the language switch, title qualifiers. CV dates are the same voice at 0.9375rem in Steel 2.
- **Button** (Saira 500, 0.9375rem, 1.2, 0.16em, capitals): the download block (and a text link beside it, when there is one); the file facts in the button are 0.8125rem at 0.08em.

All reading and label sizes are in rem, so a larger default font size in the browser takes effect; display sizes follow the viewport. Reading text wraps with `text-wrap: pretty`, so no paragraph ends on a lone word; headings and the start sentence use `balance`. In print: CV body 10pt, entry titles 11pt, labels 8.5pt, letter-spacing of every label 0.03em.

### Named Rules
**The Two Voices Rule.** Saira announces and labels; Baskervville reads. A paragraph is never set in Saira, a label never in Baskervville. The corners are the one place Baskervville is set in tracked capitals.

**The Light When Large Rule.** Saira is weight 300 at every display size and 500 only below 1rem. Tracking runs the other way: slightly negative at display sizes, 0.14em to 0.16em on small capitals.

**The Untracked Paper Rule.** On paper and in PDFs, capitals are tracked at 0.03em at most; wider tracking makes text extraction and applicant tracking systems read single letters. For the same reason hyphenated keywords that would break at a line end are wrapped in `.keep` (no wrapping in print), because extraction drops the hyphen and joins the halves.

## Layout

Every page is a three-row grid (`auto 1fr auto`) at least `100svh` tall: top bar, middle, bottom bar. Each bar is `--bar` tall (72px; 60px in the narrow layout), padded `--edge` (`clamp(16px, 2vw, 30px)`) from the sides, with one link at each end; the right-hand links are pulled out by their own tracking so the last letter sits flush with the edge. The bars are pinned (sticky top and bottom) only where the screen is at least 47.5em wide and 720px tall; elsewhere they scroll with the page. While they are pinned, `--pinned` equals the bar height and the root's `scroll-padding-block` keeps keyboard focus and anchors 16px clear of both bars.

Width breakpoints are in em: the narrow layout starts below 47.5em, which is 760px at the default font size and comes earlier when the reader has set a larger one; the height limit stays in px because the bars do. Nothing scrolls sideways from 280px up, at default font sizes up to 32px: the body is one `minmax(0, 1fr)` column with `overflow-wrap: break-word`, narrow-layout grids use `minmax(0, 1fr)`, addresses may break anywhere, and the bars and the language switch may wrap. In the top bar the name breaks onto two lines first; only when that is not enough does the right-hand link move to a second line, still on the right.

The start page centres one group: room for the lock's shackle (0.6 of the greeting size), the greeting, a gap of `clamp(22px, 4.4vh, 44px)` and the sentence. The 404 centres the same way without the lock. Sub-pages use a `.page` column at `min(100%, 1120px)`, padded `clamp(40px, 8vh, 96px)` above and `clamp(72px, 12vh, 140px)` below (28px above on phones). Reading text keeps a 66ch measure.

The CV is a two-column document: a rail of `minmax(150px, 220px)` for the section label, sticky while its section scrolls, and a content column capped at 46rem, with `clamp(32px, 5vw, 80px)` between. Inside, dated rows and entries share one date column, `minmax(6.875rem, 9rem)` (`--date-col`): a month range such as 05/2025 – 02/2026 stays on one line, and in rem the column grows with the text. The gap is 24px. In the narrow layout everything collapses to one column. A4 paper is about 687 CSS px wide, so print restores what the phone rules remove: a 30mm rail and a 27mm date column.

Rhythm: 12px row padding inside CV sections, 28px between CV entries (22px on phones), 14px between the rows of the profile list on Kontakt and 36px between term and link, 44px minimum height for every interactive element (48px for the button).

## Elevation & Depth

Flat. Everything sits on the one ground; separation is a 1px hairline at 26 % or 13 % ink, or nothing. The pinned bars share the ground colour and carry no border or shadow, so they read as part of the frame. Depth on the start page comes only from the engraving behind the greeting, at 34 % opacity.

### Named Rules
**The No Shadow Rule.** `box-shadow` does not appear. Depth is a hairline, the raster, or nothing.

## Shapes

Square everywhere. No radius, no box with four borders. The recurring form is the filled square raster dot in the current colour: 0.42em before the current corner link, 0.45em before the chosen language, 0.3em in Steel 3 as CV list bullet. The engraving is shown with `image-rendering: pixelated`, so its pixels stay square at any size. In forced-colours mode the squares keep a system colour (`forced-color-adjust: none`, `CanvasText`).

**The Raster Rule.** Imagery is a public-domain engraving thresholded to 1 bit and shown pixelated in the ink colour on transparent ground, provenance embedded in the file. No photographs, no vector icons, no padlock symbols.

## Components

### Buttons
One filled block per page, for the one real action: downloading a document.
- **Shape:** square, no border.
- **Primary:** Blank Steel fill, Anlassblau text, Saira 500 0.9375rem capitals at 0.16em, padding 15px 22px 14px, at least 48px tall; a `small` suffix carries format, size and language ("PDF, 135 KB, Deutsch") at 0.8125rem and 78 % opacity. On phones the suffix stacks under the label.
- **Hover / Focus:** the fill steps to Polished white over 0.3s; focus adds the 2px ink ring at 4px offset.
- **Secondary:** none. An alternative beside it (such as reading a document in the browser) is an underlined link in the same capitals.
- **Forced colours:** a 1px `CanvasText` border keeps the block visible in every contrast theme. **Print:** plain ink text without fill.

### Links
Inherit their colour, underlined 1px in Steel 3 at 0.22em offset (5.9:1 on the ground); on hover and focus the underline brightens to the text colour over 0.3s. The contact address uses a 2px line at 0.12em.

### Navigation (the four corners)
Baskervville capitals in Steel 2 at rest, at least 44px tall with 10px inline padding pulled back by negative margins. Hover and focus bring them to Blank Steel and show the underline at 0.5em; the focus ring is drawn 7px inside the target. The current page is Blank Steel with a raster dot before it. The bars carry `view-transition-name`s and stay still between pages.

### Language switch (CV)
A fieldset holding only two visually hidden radios and their labels (DEUTSCH, ENGLISH) in the label voice; the chosen one is Blank Steel with a square before it. The two CV panels follow the fieldset, German first, and switch with `:has()`; without `:has()` both stay visible. Focus on a radio draws the ring around its label.

### CV document
Name as headline, the role line as a label, then sections divided by Rule hairlines: a sticky label rail on the left, content on the right. Entries: date (label voice, Steel 2), title (Baskervville 600), an optional qualifier as a label, the employer in Baskervville Steel 2, then text and square-bulleted lists. Sections carry no accessible names, so they do not become landmark regions. The contact section is print-only: the screen uses the persistent corner link to Kontakt, while a printed copy retains email and profile links. Location appears once, in the CV header.

### The greeting plate (signature)
On the start page the padlock sits in the greeting's `::before`, centred, its shackle rising above the letters (top -78 %, height 178 % of the line box). On load it is pulled onto the plate once, top to bottom, in 18 raster steps (`clip-path` inset, 1.4s, 0.15s delay); with reduced motion it simply stands there. The start page's two font subsets (the greeting's three glyphs, the sentence's and corners' letters) and the engraving are inlined, and its font stacks name only those subsets and local faces.

### Skip link
Blank Steel block with Anlassblau system-ui text, fixed at 16px, shown on focus.

### Themed browser surfaces
`color-scheme: dark` (light in print), scrollbar Steel 3 on the ground, caret and `accent-color` Blank Steel, selection Anlassblau on Blank Steel, a 2px Blank Steel focus ring at 4px offset unless a component pulls it inward.

## Do's and Don'ts

### Do:
- **Do** keep the four corners on every page (Christian Petri, CV, Projekte, Kontakt) and one thing in the middle.
- **Do** make the visible headline of a sub-page its content and keep a visually hidden h1 with the page name.
- **Do** derive every new grey from the blue (OKLCH hue 265 to 270) and check 4.5:1 on Anlassblau before using it for text.
- **Do** set large words in Saira 300 capitals, labels and dates in Saira 500 tracked capitals, and everything read in Baskervville.
- **Do** size reading text and labels in rem, width breakpoints in em, and measures on the start page in em.
- **Do** mark state with the square raster dot, and give it a system colour in forced-colours mode.
- **Do** link exactly one stylesheet per page that `@import`s the shared frame first, so page rules win ties.
- **Do** keep the start page complete in its first response: inline subsets and art only, font stacks without the full web fonts, at most 9,400 bytes at Brotli level 5; rerun `scripts/fonts.py` when its text changes, and put CSS only the sub-pages use into `pages.css`, not `base.css`.
- **Do** check printed CVs (sent with applications, no longer downloadable) after any CV or print change: make sure that `pdftotext` shows no spaced capitals and no keyword joined across a line-end hyphen, and keep the download label sizes on Projekte true.

### Don't:
- **Don't** add a second hue, a gradient, a photograph or a third typeface.
- **Don't** use black with neon, cream with serif and terracotta, a terminal or hacker look, padlock or shield icons, badges or cards.
- **Don't** add shadows, box borders or any radius.
- **Don't** set a paragraph in Saira or a label in Baskervville, and don't put a kicker or section number above a heading.
- **Don't** track capitals wider than 0.03em on paper.
- **Don't** add a second filled button to a page; the inverted block is the one real action.
- **Don't** pin the corner bars on screens under 720px tall, and don't give them a colour, border or shadow of their own.
- **Don't** smooth the engraving or redraw it as vector; it stays a pixelated 1-bit raster with its provenance embedded.
