# Fonts

Two typefaces, self-hosted as subsets, both under the SIL Open Font License 1.1 (licence texts beside them).

| File | Source | Instance | Glyphs | Used on |
|---|---|---|---|---|
| `baskervville.woff2` | [Baskervville](https://github.com/anrt-type/ANRT-Baskervville) variable (ANRT), via google/fonts `ofl/baskervville` | weight axis kept at 400–600 | Latin (see below) | every page except the start page |
| `saira-extra-condensed.woff2` | [Saira](https://github.com/Omnibus-Type/Saira) variable (Omnibus-Type), via google/fonts `ofl/saira` | width pinned to 62.5 (Extra Condensed), weight axis kept at 300–500 | Latin | every page except the start page |
| `home/baskervville-home.woff2` | Baskervville | weight pinned to 400 | only the letters the start page shows (`home/glyphs.txt`) | start page, inlined |
| `home/saira-hi.woff2` | Saira | width 62.5, weight 300 | `H`, `I`, `.` | start page, inlined |

All four are produced by `scripts/fonts.py` (fontTools 4.68: `varLib.instancer` for the instances, the subsetter with `--flavor=woff2`, no hinting, desubroutinized; layout features kern, liga, ccmp, locl, mark, mkmk, case, lnum, tnum, pnum for the two full files, kern only for the start-page subsets). The Latin range is `U+0020-007E, U+00A0-00FF, U+2011, U+2013-2014, U+2018-2019, U+201C-201E, U+2022, U+2026, U+2032-2033, U+20AC`; German umlauts and ß are inside Latin-1. Any character outside that range falls back to the system stack.

The start-page subsets are inlined into `index.html` by the build (see `vite.config.js`) so that page renders from its first response. They contain only the letters in `home/glyphs.txt`, keep only the copyright and licence names (IDs 0, 13, 14) and have no outline for missing glyphs; change any visible text on the start page and run the script again. `npm test` checks the coverage.

The script always writes all four files. A run on 2026-11-01 from the then-current google/fonts sources changed the two full files too (other bytes, Saira 52 bytes larger). If only the start page changed, restore them with `git checkout -- fonts/baskervville.woff2 fonts/saira-extra-condensed.woff2`, so the sub-pages keep their cached font files.
