import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

export default defineConfig({
  integrations: [tailwind()],
  output: "server",
  adapter: netlify(),
  site: "https://kda-sporting.netlify.app",
  mode: 'production',
});
