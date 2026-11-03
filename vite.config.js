import { createHash } from "node:crypto";
import { resolve, sep } from "node:path";
import { defineConfig } from "vite";

// Inline each page's stylesheets into the page so that every HTML response
// carries its critical CSS inside the first TCP congestion window
// (https://endtimes.dev/why-your-website-should-be-under-14kb-in-size/).
// A page may link several stylesheets (base.css plus its own); they become one
// <style> element in document order. The Content Security Policy keeps
// forbidding inline styles in general: only that exact text is allowed, by its
// SHA-256 hash.
function inlineStylesheets() {
  return {
    name: "inline-stylesheets-with-csp-hash",
    enforce: "post",
    generateBundle(_options, bundle) {
      const cssAssets = new Map(
        Object.values(bundle)
          .filter((item) => item.type === "asset" && item.fileName.endsWith(".css"))
          .map((item) => [item.fileName, typeof item.source === "string" ? item.source : Buffer.from(item.source).toString("utf8")]),
      );
      if (cssAssets.size === 0) throw new Error("no stylesheet found to inline");
      const linkPattern = /<link rel="stylesheet"[^>]*href="\/?([^"]+\.css)"[^>]*>\s*/g;

      for (const item of Object.values(bundle)) {
        if (item.type !== "asset" || !item.fileName.endsWith(".html")) continue;
        let html = typeof item.source === "string" ? item.source : Buffer.from(item.source).toString("utf8");
        const links = [...html.matchAll(linkPattern)];
        if (links.length === 0) throw new Error(`${item.fileName}: no stylesheet link found`);
        const cssText = links
          .map(([, fileName]) => {
            if (!cssAssets.has(fileName)) throw new Error(`${item.fileName}: stylesheet ${fileName} not in the bundle`);
            return cssAssets.get(fileName);
          })
          .join("");
        const hash = createHash("sha256").update(cssText, "utf8").digest("base64");
        let first = true;
        html = html.replace(linkPattern, () => {
          if (!first) return "";
          first = false;
          return `<style>${cssText}</style>\n`;
        });
        html = html.replace("style-src 'self';", `style-src 'sha256-${hash}';`);
        if (!html.includes(`'sha256-${hash}'`)) throw new Error(`${item.fileName}: CSP style-src not rewritten`);
        item.source = html;
      }
      for (const fileName of cssAssets.keys()) delete bundle[fileName];
    },
  };
}

// Only the start page's own font subsets and its engraving become data URIs, so
// the start page renders from its first response. Everything else stays a
// separate, cacheable file.
const inlinedAssets = [`${sep}fonts${sep}home${sep}`, `${sep}art${sep}`];

export default defineConfig({
  base: "/",
  plugins: [inlineStylesheets()],
  build: {
    assetsInlineLimit: (filePath) => inlinedAssets.some((part) => filePath.includes(part)),
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), "index.html"),
        cv: resolve(process.cwd(), "cv/index.html"),
        contact: resolve(process.cwd(), "contact/index.html"),
        work: resolve(process.cwd(), "work/index.html"),
        privacy: resolve(process.cwd(), "datenschutz/index.html"),
        notFound: resolve(process.cwd(), "404.html"),
      },
    },
  },
});
