import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), "index.html"),
        cv: resolve(process.cwd(), "cv/index.html"),
        projects: resolve(process.cwd(), "projects/index.html"),
      },
    },
  },
});
