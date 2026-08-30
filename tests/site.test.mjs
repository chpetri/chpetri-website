import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import test from "node:test";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const pages = ["index.html", "cv/index.html", "projects/index.html"];

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

function themeVariables(css, selector) {
  const body = css.match(new RegExp(`${selector}\\s*\\{([^}]+)\\}`))[1];
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/gi)].map((match) => [match[1], match[2]]));
}

test("build contains all three static routes and the Pages marker", async () => {
  for (const path of pages) assert.equal((await stat(new URL(path, dist))).isFile(), true);
  assert.equal((await stat(new URL(".nojekyll", dist))).isFile(), true);
  assert.deepEqual((await readdir(dist)).sort(), [".htaccess", ".nojekyll", "assets", "cv", "index.html", "og.png", "projects"]);
});

test("every page has route metadata and restrictive browser policy", async () => {
  const expectedTitles = [
    "Christian Petri — Cybersecurity &amp; Network Security",
    "Curriculum Vitae — Christian Petri",
    "Projects — Christian Petri",
  ];

  for (const [index, path] of pages.entries()) {
    const html = await page(path);
    assert.match(html, new RegExp(`<title>${expectedTitles[index]}</title>`));
    assert.match(html, /<meta name="description" content="[^"]+">/);
    assert.match(html, /Content-Security-Policy/);
    assert.match(html, /connect-src 'none'/);
    assert.match(html, /object-src 'none'/);
    assert.match(html, /base-uri 'none'/);
    assert.match(html, /form-action 'none'/);
    assert.match(html, /<meta name="referrer" content="no-referrer">/);
    assert.doesNotMatch(html, /http:\/\//i);
  }
});

test("CV remains factual, bilingual, private-data-minimised, and loads only first-party scripts", async () => {
  const html = await page("cv/index.html");
  assert.match(html, /id="lang-en" checked/);
  assert.match(html, /lang="de"/);
  assert.match(html, /Technical Support \/ IT Technician/);
  assert.match(html, /Technischer Support \/ IT-Techniker/);
  assert.match(html, /Vulnerability management <mark>\[lab\]<\/mark>/i);
  assert.match(html, /Vulnerability Management <mark>\[Lab\]<\/mark>/);
  assert.match(html, /CompTIA Network Vulnerability Assessment Professional/);
  assert.match(html, /German — native; English — B2/);
  assert.match(html, /<script type="module" crossorigin src="\.\.\/assets\/[^"]+\.js"><\/script>/);
});

test("Projects is intentionally empty and does not invent portfolio work", async () => {
  const html = await page("projects/index.html");
  assert.match(html, /Darmstadt, Germany|Projects/);
  assert.match(html, /Projects in progress|Projects are taking shape/i);
  assert.match(html, /practical projects/i);
  assert.match(html, /<script type="module" crossorigin src="\.\.\/assets\/[^"]+\.js"><\/script>/);
  assert.doesNotMatch(html, /class="project-card"|Magic Numbers|SOC|penetration test project/i);
});

test("homepage uses the approved modernist hierarchy and verified evidence ledger", async () => {
  const html = await page("index.html");
  assert.match(html, /class="hero"/);
  assert.match(html, /class="professional-introduction"/);
  assert.match(html, /class="terminal-zone"/);
  assert.match(html, /class="evidence-ledger"/);
  assert.match(html, /class="site-footer home-footer"/);
  assert.doesNotMatch(html, /class="(?:intro-index|link-index)"/);

  assert.match(html, /From troubleshooting hardware|securing systems/i);
  assert.match(html, /Security testing shown here comes from training and lab work/);
  assert.match(html, /Type help to explore my background|Type help/i);
  assert.match(html, /Current certifications/i);
  assert.doesNotMatch(html, /Credentials, not decoration|safe command interface|Static by design/i);

  assert.match(html, /CompTIA Network Vulnerability Assessment Professional/);
  assert.match(html, /CompTIA PenTest\+/);
  assert.match(html, /Cyber Security Advisor/);
  assert.match(html, /CompTIA Security\+/);
  assert.match(html, /CompTIA Network\+/);
  assert.doesNotMatch(html, /GIAC|SANS|OSCP|binary exploitation|PGP fingerprint|Signal handle/i);

  const css = await readFile(new URL("styles.css", root), "utf8");
  assert.match(css, /--bg-canvas:\s*#101416/i);
  assert.match(css, /--accent-primary:\s*#bdd838/i);
  assert.match(css, /--text-primary:\s*#eff3f4/i);
  assert.doesNotMatch(css, /gradient\s*\(|box-shadow\s*:|border-radius\s*:/i);
});

test("all loaded resources are first-party and zero external requests", async () => {
  const home = await page("index.html");
  assert.match(home, /<script type="module" crossorigin src="\.\/assets\/[^"]+\.js"><\/script>/);

  for (const path of pages) {
    const html = await page(path);
    assert.doesNotMatch(html, /<(?:script|img)\b[^>]*src="https?:\/\//i, `${path} loads an external script or image`);
    assert.doesNotMatch(html, /<link\b[^>]*rel="(?:stylesheet|icon|preload|modulepreload)"[^>]*href="https?:\/\//i, `${path} loads an external linked resource`);
  }
});

test("every relative link and asset resolves inside the static build", async () => {
  for (const path of pages) {
    const html = await page(path);
    for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|mailto:|#|data:)/.test(value)) continue;
      let target = new URL(value, new URL(path, dist));
      if (target.pathname.endsWith("/")) target = new URL("index.html", target);
      assert.equal((await stat(target)).isFile(), true, `${path}: ${value}`);
    }
  }
});

test("built assets stay within the agreed performance budgets", async () => {
  const assets = await readdir(new URL("assets/", dist));
  const cssFile = assets.find((name) => name.endsWith(".css"));
  const jsFiles = assets.filter((name) => name.endsWith(".js"));
  assert.ok(cssFile);
  assert.equal(jsFiles.length, 1);

  const css = await readFile(new URL(`assets/${cssFile}`, dist));
  const js = await readFile(new URL(`assets/${jsFiles[0]}`, dist));
  assert.ok(css.byteLength <= 25 * 1024, `CSS is ${css.byteLength} bytes`);
  assert.ok(js.byteLength <= 12 * 1024, `terminal JS is ${js.byteLength} bytes`);
  assert.ok(gzipSync(js).byteLength <= 5 * 1024, `terminal JS gzip is ${gzipSync(js).byteLength} bytes`);

  for (const path of pages) {
    const html = await readFile(new URL(path, dist));
    assert.ok(html.byteLength <= 100 * 1024, `${path} is ${html.byteLength} bytes`);
  }
});

test("source has zero runtime dependencies and includes print/reduced-motion CSS", async () => {
  const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.deepEqual(packageJson.dependencies ?? {}, {});
  assert.deepEqual(Object.keys(packageJson.devDependencies), ["vite"]);

  const css = await readFile(new URL("styles.css", root), "utf8");
  assert.match(css, /@media print/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("small text colours meet WCAG AA contrast in both themes", async () => {
  const css = await readFile(new URL("styles.css", root), "utf8");
  const themes = [
    themeVariables(css, String.raw`:root,\s*:root\[data-theme="petrol"\]`),
    themeVariables(css, String.raw`:root\[data-theme="smoked"\],\s*:root\[data-theme="ultramarine"\]`),
  ];

  for (const theme of themes) {
    for (const foreground of ["text-secondary", "text-muted", "text-meta", "accent-primary"]) {
      for (const background of ["bg-canvas", "bg-surface"]) {
        assert.ok(contrastRatio(theme[foreground], theme[background]) >= 4.5, `${foreground} on ${background} is below 4.5:1`);
      }
    }
  }
});

test("publication gate blocks unresolved contact placeholders and verifies active email", async () => {
  if (process.env.PUBLISH_CHECK !== "1") return;
  for (const path of pages) {
    const html = await page(path);
    assert.doesNotMatch(html, /EMAIL_PLACEHOLDER/);
    if (path === "index.html" || path === "cv/index.html") {
      assert.match(html, /mailto:contact@chpetri\.com/);
    }
  }
});
