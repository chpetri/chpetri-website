# Art

## `schloss.png`

The cut-away padlock behind the greeting on the start page.

- **Origin:** *Encyclopédie, ou Dictionnaire raisonné des sciences, des arts et des métiers* (Diderot, d'Alembert), *Recueil de planches*, tome IX, plates "Serrurier" (locksmithing), copper engraving, 18th century. Public domain.
- **Scan:** Internet Archive, item [RecueildeplanchIXDide](https://archive.org/details/RecueildeplanchIXDide), page [n328](https://archive.org/details/RecueildeplanchIXDide/page/n328) (`https://archive.org/download/RecueildeplanchIXDide/page/n328_w1600.jpg`).
- **Processing:** crop of the padlock figure at 1600 px width (box 1130,1110 to 1570,1780), upscaled 3× with Lanczos, autocontrast, plate caption removed (top 165 px of the upscaled crop), scaled to 229 × 320, thresholded at 150 to 1 bit, saved as a two-colour palette PNG: ink `#e8ecf4`, paper transparent. The page shows it with `image-rendering: pixelated` at a third of full strength.
- **Provenance** is also embedded in the file as a PNG text chunk.

The PNG (4,545 bytes) remains the source, including its provenance metadata.

## `schloss.webp`

The start page uses this smaller lossless WebP derivative (180 × 252 pixels,
2,300 bytes), inlined as a data URI. It is scaled down from the PNG and put through
the 1-bit threshold again. At a third of full strength behind the greeting it looks
almost the same and saves 1.4 kB of the start page's first round trip. Metadata stays
with the source PNG and this document.

Regenerate with ImageMagick:

```bash
magick art/schloss.png -alpha extract -filter Box -resize 180x252! -threshold 43% \
  \( +clone -fill '#e8ecf4' -colorize 100 \) +swap -compose CopyOpacity -composite \
  -strip -define webp:lossless=true -define webp:method=6 -quality 100 art/schloss.webp
```

## `public/og.png`

The social preview: a headless Chromium screenshot of the start page at 1200 × 630, quantised to 32 colours (`magick shot.png -dither None -colors 32 -strip PNG8:public/og.png`). Regenerate it after changing the start page.
