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
    // We can't just call a function on startup because of some Vite's BS...
    // So instead I'm exposing some endpoint that only does something the first time it's called.
    {
      name: "on-server-start",
      hooks: {
        "astro:config:done": () => {
          console.log("Running on startup script in 10s...")
          setTimeout(() => fetch(`http://${ASTRO_HOST}:${ASTRO_PORT}/en/api/on-startup`), 10_000);
        },
      },
    },
    astroMetaTags(),
    icon({
      include: {
        "material-symbols": ["*"], // Loads entire Material Design Icon set
      },
    }),
  ],
  prefetch: false,
  devToolbar: { enabled: false },
  server: {
    port: parseInt(ASTRO_PORT ?? "4321"),
    host: ASTRO_HOST ?? true,
  },
});
