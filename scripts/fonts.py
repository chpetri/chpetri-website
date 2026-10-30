"""Build the self-hosted font subsets for chpetri.com.

Development tool only (not part of the site build). Needs fontTools and brotli:

    python -m venv .venv && .venv/bin/pip install fonttools brotli
    .venv/bin/python scripts/fonts.py path/to/Saira[wdth,wght].ttf path/to/Baskervville[wght].ttf

Sources: google/fonts, ofl/saira and ofl/baskervville (SIL Open Font License 1.1).

Writes
  fonts/saira-extra-condensed.woff2   Saira at width 62.5 (Extra Condensed), weight 300-500, Latin
  fonts/baskervville.woff2            Baskervville, weight 400-600, Latin
  fonts/home/saira-hi.woff2           Saira Extra Condensed Light, only the glyphs of the greeting
  fonts/home/baskervville-home.woff2  Baskervville Regular, only the glyphs the start page shows
  fonts/home/glyphs.txt               the characters covered by the start-page subset (checked by npm test)

The two start-page subsets are inlined into index.html so the start page renders
from its first response. Change any visible text on the start page, then run
this script again; the test suite fails until the subset covers the new text.
"""
import io
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "fonts")
HOME = os.path.join(FONTS, "home")

LATIN = ("U+0020-007E,U+00A0-00FF,U+2011,U+2013-2014,U+2018-2019,U+201C-201E,"
         "U+2022,U+2026,U+2032-2033,U+20AC")
FEATURES = ["kern", "liga", "ccmp", "locl", "mark", "mkmk", "case", "lnum", "tnum", "pnum"]

# Every character the start page renders in the reading face. Corner labels are
# set in capitals by CSS, so their capital forms are listed too. The skip link
# is set in the system face and needs no glyphs here.
HOME_GREETING = "HI."
HOME_TEXT = (
    "Christian Petri CV Projekte Kontakt"
    "CHRISTIAN PETRI CV PROJEKTE KONTAKT"
    "Ich bin Christian, Berater für IT-Sicherheit aus Darmstadt."
)


def save_woff2(font, unicodes=None, text=None, features=FEATURES):
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = features
    options.hinting = False
    options.desubroutinize = True
    options.name_IDs = [0, 1, 2, 4, 6, 13, 14]
    options.name_languages = [0x409]
    options.notdef_outline = True
    subsetter = subset.Subsetter(options)
    if unicodes is not None:
        subsetter.populate(unicodes=unicodes)
    else:
        subsetter.populate(text=text)
    subsetter.subset(font)
    font.flavor = "woff2"
    buffer = io.BytesIO()
    font.save(buffer)
    return buffer.getvalue()


def instance(path, axes):
    """Pin or limit the variation axes, then reload the result from bytes so the
    subsetter sees fully decompiled tables (it trips over lazily loaded gvar data)."""
    font = instancer.instantiateVariableFont(TTFont(path), axes)
    buffer = io.BytesIO()
    font.save(buffer)
    buffer.seek(0)
    return TTFont(buffer)


def parse_ranges(spec):
    codepoints = []
    for part in spec.split(","):
        part = part.strip().removeprefix("U+")
        if "-" in part:
            start, end = part.split("-")
            codepoints.extend(range(int(start, 16), int(end, 16) + 1))
        else:
            codepoints.append(int(part, 16))
    return codepoints


def write(path, data):
    with open(path, "wb") as handle:
        handle.write(data)
    print(f"{os.path.relpath(path, ROOT):40s} {len(data):6d} bytes")


def main(saira_path, baskervville_path):
    os.makedirs(HOME, exist_ok=True)
    latin = parse_ranges(LATIN)

    saira = instance(saira_path, {"wdth": 62.5, "wght": (300, 500)})
    write(os.path.join(FONTS, "saira-extra-condensed.woff2"), save_woff2(saira, unicodes=latin))

    baskervville = instance(baskervville_path, {"wght": (400, 600)})
    write(os.path.join(FONTS, "baskervville.woff2"), save_woff2(baskervville, unicodes=latin))

    saira_light = instance(saira_path, {"wdth": 62.5, "wght": 300})
    write(os.path.join(HOME, "saira-hi.woff2"), save_woff2(saira_light, text=HOME_GREETING, features=["kern"]))

    baskervville_regular = instance(baskervville_path, {"wght": 400})
    write(os.path.join(HOME, "baskervville-home.woff2"),
          save_woff2(baskervville_regular, text=HOME_TEXT, features=["kern"]))

    glyphs = "".join(sorted(set(HOME_TEXT + HOME_GREETING)))
    with open(os.path.join(HOME, "glyphs.txt"), "w", encoding="utf-8") as handle:
        handle.write(glyphs + "\n")
    print(f"fonts/home/glyphs.txt: {len(glyphs)} characters")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
