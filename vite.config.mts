import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { meteor } from "meteor-vite/plugin";
import path from "path";
export default defineConfig({
  plugins: [
    svelte({
      configFile: "svelte.config.mjs",
    }),
    meteor({
      clientEntry: "client/main.js",
      stubValidation: {
        warnOnly: true,
      },
    }),
  ],
  css: {
    postcss: "./postcss.config.js",
  },
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
      "/imports": "/imports",
    },
  },
});
