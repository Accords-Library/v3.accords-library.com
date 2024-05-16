import icon from "astro-icon";
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import astroMetaTags from "astro-meta-tags";
import { loadEnv } from "vite";
const { ASTRO_PORT, ASTRO_HOST } = loadEnv(process.env.NODE_ENV ?? "dev", process.cwd(), "");

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
  prefetch: false,
  // devToolbar: { enabled: false },
  server: {
    port: parseInt(ASTRO_PORT ?? "4321"),
    host: ASTRO_HOST ?? true,
  },
});
