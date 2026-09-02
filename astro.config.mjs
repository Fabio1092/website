import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://fr-makler.de",
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes("/bu-ausfuellhilfe") &&
        !page.includes("/bu-kassel-danke") &&
        !page.includes("/pkv-ausfuellhilfe") &&
        !page.includes("/erstgespraech-danke") &&
        !page.includes("/pkv-kassel-danke") &&
        !page.includes("/gesamtcheck") &&
        // Conversion landing pages: kept live + crawlable (noindex, follow),
        // just not offered for indexing via the sitemap.
        !page.endsWith("/bu-kassel/") &&
        !page.endsWith("/pkv-kassel/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
