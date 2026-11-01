import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import test from "node:test";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const pages = ["index.html", "cv/index.html", "contact/index.html", "work/index.html", "404.html"];
const redirects = { "about/index.html": "/cv/", "projects/index.html": "/work/" };

async function page(path) {
  return readFile(new URL(path, dist), "utf8");
}

function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const channels = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
    const [red, green, blue] = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function rootVariables(css) {
  const body = css.match(/:root\s*\{([^}]+)\}/)[1];
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/gi)].map((match) => [match[1], match[2]]));
}

test("build contains every static route, the Pages marker, and the shipped assets", async () => {
  for (const path of pages) assert.equal((await stat(new URL(path, dist))).isFile(), true);
  assert.equal((await stat(new URL(".nojekyll", dist))).isFile(), true);
  assert.deepEqual(
    (await readdir(dist)).sort(),
    [".htaccess", ".nojekyll", "404.html", "about", "assets", "contact", "cv", "docs", "favicon.svg", "index.html", "og.png", "projects", "robots.txt", "sitemap.xml", "work"],
  );
  assert.equal((await stat(new URL("docs/Christian_Petri_IHK_Projektarbeit_Sicherer_Fernzugriff.pdf", dist))).isFile(), true);
});

test("every page has route metadata and a restrictive browser policy", async () => {
  const expectedTitles = {
    "index.html": "Christian Petri – IT-Sicherheit, Darmstadt",
    "cv/index.html": "CV – Christian Petri",
    "contact/index.html": "Kontakt – Christian Petri",
    "work/index.html": "Projekte – Christian Petri",
    "404.html": "Nicht gefunden – Christian Petri",
  };

  for (const path of pages) {
    const html = await page(path);
    assert.match(html, new RegExp(`<title>${expectedTitles[path]}</title>`));
    assert.match(html, /<meta name="description" content="[^"]+">/);
    assert.match(html, /Content-Security-Policy/);
    if (path === "index.html") {
      // default-src 'none' also covers scripts, connections and plugins
      assert.match(html, /default-src 'none'/);
    } else {
      assert.match(html, /connect-src 'none'/);
      assert.match(html, /object-src 'none'/);
    }
    assert.match(html, /base-uri 'none'/);
    assert.match(html, /form-action 'none'/);
    assert.match(html, /<meta name="referrer" content="no-referrer">/);
    // only the start page carries its fonts inline (as data: URIs)
    assert.match(html, path === "index.html" ? /font-src 'self' data:;/ : /font-src 'self';/);
    assert.doesNotMatch(html, /http:\/\//i);
    if (path !== "404.html") assert.match(html, /<link rel="canonical" href="https:\/\/chpetri\.com\/[^"]*">/);
  }
});

test("every page carries the four-corner frame", async () => {
  for (const path of pages) {
    const html = await page(path);
    assert.match(html, /<header class="corners corners-top">/);
    assert.match(html, /<footer class="corners corners-bottom">/);
    assert.match(html, /<html lang="de"(?: class="home")?>/);
    // the wordmark is the name alone; the job title is said once, in the sentence or the CV
    assert.match(html, /<a href="[^"]*" aria-label="Christian Petri – Startseite">Christian Petri<\/a>/);
    assert.doesNotMatch(html, />Christian Petri, IT-Sicherheit<\/a>/);
    assert.match(html, /<nav aria-label="Hauptnavigation">\s*<a href="[^"]*"[^>]*>CV<\/a>/);
    assert.match(html, />Projekte<\/a>/);
    assert.match(html, />Kontakt<\/a>/);
    assert.match(html, /class="skip-link"/);
  }
});

test("start page is only the greeting inside the frame", async () => {
  const html = await page("index.html");
  assert.match(html, /<main id="main-content" class="hi">/);
  assert.match(html, /<h1>Hi\.<\/h1>/);
  const intro = html.match(/<p class="hi-line">([\s\S]*?)<\/p>/)[1].replace(/<[^>]+>/g, "");
  assert.equal(intro, "Ich bin Christian, Berater für IT-Sicherheit aus Darmstadt.");
  assert.doesNotMatch(html, /terminal|evidence-ledger|hero/i);
});

test("CV is factual, bilingual, German first, private-data-minimised, and script-free", async () => {
  const html = await page("cv/index.html");
  assert.match(html, /id="lang-de" checked/);
  // the language switch is a small group of its own; the CV panels follow it, German first
  assert.match(html, /<\/fieldset>\s*<div class="lang-panels">\s*<article class="cv cv-de"/);
  // sections stay unnamed, otherwise every one becomes a landmark region
  assert.doesNotMatch(html, /<section class="cv-section" aria-labelledby/);
  assert.match(html, /href="\.\.\/docs\/Christian_Petri_CV_EN\.pdf" download=/);
  assert.match(html, /href="\.\.\/docs\/Christian_Petri_CV_DE\.pdf" download=/);
  assert.match(html, /<article class="cv cv-de" lang="de"/);
  assert.match(html, /Technical Support \/ IT Technician/);
  assert.match(html, /Technischer Support \/ IT-Techniker/);
  assert.match(html, /CompTIA Network Vulnerability Assessment Professional/);
  assert.match(html, /German – native; English – B2/);
  assert.match(html, /Deutsch – Muttersprache; Englisch – B2/);
  assert.match(html, /in lab environments/);
  assert.doesNotMatch(html, /<script/);
  // no private contact data: the site's address is the only one, no phone number, no postal address
  const body = html.match(/<body>[\s\S]*<\/body>/)[0];
  const text = body.replace(/<[^>]+>/g, " ");
  assert.deepEqual([...new Set(body.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g))], ["contact@chpetri.com"]);
  assert.doesNotMatch(text, /\+\d{2}[\s/-]*\d{3}|\b0\d{2,4}[\s/-]*\d{5,}/);
  assert.doesNotMatch(text, /\b\d{5}\s+\p{Lu}\p{Ll}+/u);
});

test("CV carries the verified certifications and nothing invented", async () => {
  const html = (await page("cv/index.html")).replace(/<style>[\s\S]*?<\/style>/, "");
  for (const cert of ["CompTIA Network Vulnerability Assessment Professional", "CompTIA PenTest\\+", "Cyber Security Advisor", "CompTIA Security\\+", "CompTIA Network\\+"]) {
    assert.match(html, new RegExp(cert));
  }
  assert.doesNotMatch(html, /GIAC|SANS|OSCP|binary exploitation|PGP fingerprint|Signal handle/i);
});

test("every download label states the file's real size", async () => {
  for (const path of ["cv/index.html", "work/index.html"]) {
    const html = await page(path);
    for (const [, href, kilobytes] of html.matchAll(/<a class="button" href="\.\.\/(docs\/[^"]+\.pdf)"[^>]*>[^<]*<small>PDF, (\d+) KB,/g)) {
      const bytes = (await stat(new URL(href, dist))).size;
      assert.equal(Number(kilobytes), Math.round(bytes / 1000), `${path}: ${href} is ${bytes} bytes`);
    }
  }
});

test("the 404 page names the problem in its heading", async () => {
  const html = await page("404.html");
  assert.match(html, /<h1 class="display">Hm\.<span class="visually-hidden"> Seite nicht gefunden<\/span><\/h1>/);
});

test("Projekte documents the IHK case study with a resolvable PDF", async () => {
  const html = await page("work/index.html");
  assert.match(html, /Sicherer administrativer Fernzugriff/);
  assert.match(html, /IHK-Fallstudie/);
  assert.match(html, /href="\.\.\/docs\/Christian_Petri_IHK_Projektarbeit_Sicherer_Fernzugriff\.pdf" download=/);
  assert.doesNotMatch(html.replace(/<style>[\s\S]*?<\/style>/, ""), /Magic Numbers|SOC analyst|penetration test project|a few projects|ein paar Projekte/i);
});

test("robots.txt points at a sitemap that lists exactly the canonical pages", async () => {
  const robots = await readFile(new URL("robots.txt", dist), "utf8");
  assert.match(robots, /^Sitemap: https:\/\/chpetri\.com\/sitemap\.xml$/m);
  const sitemap = await readFile(new URL("sitemap.xml", dist), "utf8");
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url).sort();
  const canonical = [];
  for (const path of pages) {
    const match = (await page(path)).match(/<link rel="canonical" href="([^"]+)">/);
    if (match) canonical.push(match[1]);
  }
  assert.deepEqual(listed, canonical.sort());
});

test("the Apache host compresses pages and caches hashed fonts", async () => {
  const htaccess = await readFile(new URL(".htaccess", dist), "utf8");
  assert.match(htaccess, /AddOutputFilterByType DEFLATE text\/html/);
  assert.match(htaccess, /max-age=31536000, immutable/);
});

test("old routes redirect to their new homes without scripts", async () => {
  for (const [path, target] of Object.entries(redirects)) {
    const html = await page(path);
    assert.match(html, new RegExp(`<meta http-equiv="refresh" content="0; url=${target}">`));
    assert.match(html, new RegExp(`<link rel="canonical" href="https://chpetri\\.com${target}">`));
    assert.doesNotMatch(html, /<script/i);
  }
  const htaccess = await readFile(new URL(".htaccess", dist), "utf8");
  assert.match(htaccess, /Redirect 301 \/about\/ \/cv\//);
  assert.match(htaccess, /ErrorDocument 404 \/404\.html/);
  assert.match(htaccess, /Redirect 301 \/projects\/ \/work\//);
});

test("no page loads a script and every resource is first-party", async () => {
  for (const path of pages) {
    const html = await page(path);
    assert.doesNotMatch(html, /<script/i, `${path} ships JavaScript`);
    assert.doesNotMatch(html, /<(?:img|iframe)\b[^>]*src="https?:\/\//i, `${path} loads an external resource`);
    assert.doesNotMatch(html, /<link\b[^>]*rel="(?:stylesheet|icon|preload|modulepreload)"[^>]*href="https?:\/\//i, `${path} loads an external linked resource`);
  }
});

test("every relative link and asset resolves inside the static build", async () => {
  for (const path of pages) {
    const html = await page(path);
    for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|mailto:|#|data:)/.test(value)) continue;
      let target = value.startsWith("/") ? new URL(`.${value}`, dist) : new URL(value, new URL(path, dist));
      if (target.pathname.endsWith("/")) target = new URL("index.html", target);
      assert.equal((await stat(target)).isFile(), true, `${path}: ${value}`);
    }
  }
});

test("every page carries its stylesheet inline, allowed only by its SHA-256 hash", async () => {
  for (const path of pages) {
    const html = await page(path);
    const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)];
    assert.equal(styles.length, 1, `${path} must inline exactly one stylesheet`);
    assert.doesNotMatch(html, /<link rel="stylesheet"/);
    const hash = createHash("sha256").update(styles[0][1], "utf8").digest("base64");
    assert.match(html, new RegExp(`style-src 'sha256-${hash.replace(/[+/=]/g, (c) => `\\${c}`)}'`), `${path}: CSP must allow the inline stylesheet by hash`);
    assert.doesNotMatch(html, /style-src[^;]*'self'/, `${path}: CSP must not allow external stylesheets`);
    assert.doesNotMatch(html, /style-src[^;]*'unsafe-inline'/);
    assert.doesNotMatch(html, / style="/, `${path} uses an inline style attribute`);
  }
});

// TCP slow start sends 10 segments of 1460 bytes before the first acknowledgement:
// 14,600 bytes. 1,000 of them are left for the response headers. Measured at
// gzip level 6, the default of most servers.
const firstRoundTrip = 10 * 1460 - 1000;

test("each page fits in the first TCP round trip: HTML with inline CSS under 13.6 kB gzipped", async () => {
  for (const path of pages) {
    const html = await readFile(new URL(path, dist));
    const gzipped = gzipSync(html, { level: 6 }).byteLength;
    assert.ok(gzipped <= firstRoundTrip, `${path} is ${gzipped} bytes gzipped (limit ${firstRoundTrip})`);
  }
});

// The rule above is arithmetic. Measured in real Chrome on fresh connections to the live
// server (2026-11, over a VPN with 1265-byte packets): TLS tickets and the HTTP/2 setup
// use up packets, and the page travels as one TLS record, so the browser can read nothing
// until its last byte is there. Up to 9,400 bytes arrived in the first round trip in 38 of
// 39 samples, from 11,000 bytes never. The server compresses on the fly at Brotli level 5.
const startPageBudget = 9400;

test("start page really fits in the first round trip: at most 9,400 bytes as the server compresses it", async () => {
  const html = await readFile(new URL("index.html", dist));
  const sent = brotliCompressSync(html, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }).byteLength;
  assert.ok(sent <= startPageBudget, `index.html is ${sent} bytes at Brotli level 5 (limit ${startPageBudget})`);
});

test("start page renders completely from its first response: fonts and engraving inline", async () => {
  const html = await page("index.html");
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const startFaces = [...css.matchAll(/@font-face\{font-family:"?(Baskervville Start|Saira Start)"?[^}]*src:url\(([^)]*)\)/g)];
  assert.equal(startFaces.length, 2, "both start-page font subsets are declared");
  for (const [, family, url] of startFaces) assert.match(url, /^"?data:font\/woff2;base64,/, `${family} is inlined`);
  assert.match(css, /url\("?data:image\/webp;base64,/, "the lossless engraving is inlined");
  assert.doesNotMatch(html, /<link rel="preload"/, "nothing to preload: everything is already in the response");
  // the start page's font stacks name only its inline subsets and local faces; a full web
  // font in the stack would be fetched while the subsets decode (44 kB and a layout shift)
  const stacks = css.match(/\.home\{([^}]*)\}/)[1];
  assert.doesNotMatch(stacks, /"Baskervville"|"Saira Extra Condensed"/);
  // and those stacks must come after the shared :root tokens, or :root wins the cascade
  assert.ok(css.indexOf(".home{") > css.indexOf(":root{"), ".home must follow :root in the inlined CSS");
  assert.doesNotMatch(html, /<img\b/);
  // whatever the start page renders in its own faces must be covered by the inline subsets,
  // otherwise the browser would fetch the full font after all (run scripts/fonts.py again)
  const glyphs = new Set([...(await readFile(new URL("fonts/home/glyphs.txt", root), "utf8")).replace(/\n$/, "")]);
  const text = (fragment) => fragment.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const body = html.match(/<body>([\s\S]*)<\/body>/)[1].replace(/<a class="skip-link"[^>]*>[^<]*<\/a>/, "");
  // corner labels and the greeting are set in capitals by CSS, so only their capitals are drawn
  const capitalised = /<(?:header|footer|h1)\b[\s\S]*?<\/(?:header|footer|h1)>/g;
  const capitals = [...body.matchAll(capitalised)].map(([fragment]) => text(fragment).toUpperCase()).join("");
  const missing = [...new Set([...text(body.replace(capitalised, "")), ...capitals])].filter((char) => !glyphs.has(char));
  assert.deepEqual(missing, [], `start-page subset lacks ${missing.join("")}`);
});

test("built assets stay within the agreed performance budgets", async () => {
  const assets = await readdir(new URL("assets/", dist));
  const fontFiles = assets.filter((name) => name.endsWith(".woff2"));
  assert.equal(assets.filter((name) => name.endsWith(".css")).length, 0, "CSS must be inlined, not emitted");
  assert.equal(assets.filter((name) => name.endsWith(".js")).length, 0);
  assert.deepEqual(fontFiles.map((name) => name.replace(/-[A-Za-z0-9_-]{8}\.woff2$/, "")).sort(), ["baskervville", "saira-extra-condensed"]);
  assert.equal(assets.filter((name) => /\.(png|webp)$/.test(name)).length, 0, "the engraving ships inline, not as a file");

  let fontBytes = 0;
  for (const name of fontFiles) {
    const size = (await stat(new URL(`assets/${name}`, dist))).size;
    assert.ok(size <= 28 * 1024, `${name} is ${size} bytes`);
    fontBytes += size;
  }
  assert.ok(fontBytes <= 48 * 1024, `fonts are ${fontBytes} bytes in total`);
});

test("source has zero runtime dependencies and includes print, reduced-motion, and font licences", async () => {
  const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.deepEqual(packageJson.dependencies ?? {}, {});
  assert.deepEqual(Object.keys(packageJson.devDependencies), ["vite"]);

  const base = await readFile(new URL("base.css", root), "utf8");
  const home = await readFile(new URL("home.css", root), "utf8");
  const pages = await readFile(new URL("pages.css", root), "utf8");
  const cv = await readFile(new URL("cv.css", root), "utf8");
  assert.match(pages, /@media print/);
  assert.match(home, /@media print/);
  assert.match(cv, /@media print/);
  assert.match(base, /prefers-reduced-motion: reduce/);
  assert.match(pages, /forced-colors: active/);
  // keyboard focus must stop clear of both pinned bars (WCAG 2.4.11), and the bars
  // only pin where the screen is tall enough to spare them
  assert.match(base, /scroll-padding-block: calc\(var\(--pinned\) \+ 16px\)/);
  assert.match(base, /@media \(min-width: 47\.5em\) and \(min-height: 720px\) \{\s*:root \{ --pinned: var\(--bar\); \}/);
  // width breakpoints follow the reader's default font size, and no word can widen the page
  for (const css of [base, home, pages, cv]) assert.doesNotMatch(css, /@media[^{]*width: \d+px/);
  assert.match(base, /body \{[^}]*grid-template-columns: minmax\(0, 1fr\);[^}]*overflow-wrap: break-word;/);
  assert.match(base, /\.corners \{ flex-wrap: wrap; \}/);
  // inline links are marked by their underline alone, so it must reach 3:1
  assert.match(base, /a \{[^}]*text-decoration-color: var\(--ink-3\);/);
  assert.equal((base.match(/@font-face/g) ?? []).length, 0);
  assert.equal((pages.match(/@font-face/g) ?? []).length, 2);
  assert.equal((home.match(/@font-face/g) ?? []).length, 2);
  assert.match(await readFile(new URL("fonts/OFL-Baskervville.txt", root), "utf8"), /SIL Open Font License/);
  assert.match(await readFile(new URL("fonts/OFL-Saira.txt", root), "utf8"), /SIL Open Font License/);
  // the engraving carries its origin inside the file
  assert.match((await readFile(new URL("art/schloss.png", root))).toString("latin1"), /archive\.org\/details\/RecueildeplanchIXDide/);
});

test("text colours meet WCAG AA contrast on the ground", async () => {
  const css = await readFile(new URL("base.css", root), "utf8");
  const theme = rootVariables(css);
  for (const foreground of ["ink", "ink-soft", "ink-2", "ink-3"]) {
    assert.ok(contrastRatio(theme[foreground], theme.ground) >= 4.5, `${foreground} on ground is below 4.5:1`);
  }
});

test("publication gate blocks unresolved contact placeholders and verifies the active email", async () => {
  if (process.env.PUBLISH_CHECK !== "1") return;
  for (const path of pages) {
    const html = await page(path);
    assert.doesNotMatch(html, /EMAIL_PLACEHOLDER/);
    if (path === "contact/index.html" || path === "cv/index.html") {
      assert.match(html, /mailto:contact@chpetri\.com/);
    }
  }
});
