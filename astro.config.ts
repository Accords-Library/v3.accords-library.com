import icon from "astro-icon";
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import astroMetaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  output: "server",
  srcDir: "./src",
  publicDir: "./public",
  outDir: "./dist",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    astroMetaTags(),
    icon({
      include: {
        "material-symbols": ["*"], // Loads entire Material Design Icon set
      },
    }),
  ],

  server: {
    port: 12499,
    host: true,
  },
});
