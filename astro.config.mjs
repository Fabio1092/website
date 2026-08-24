import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://fr-makler.de",
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("/bu-ausfuellhilfe") && !page.includes("/bu-kassel-danke") && !page.includes("/pkv-ausfuellhilfe"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
