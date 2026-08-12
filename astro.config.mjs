import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.fr-makler.de",
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("/bu-ausfuellhilfe"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
