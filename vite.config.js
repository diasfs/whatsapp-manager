import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import voie from "vite-plugin-voie";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        voie.default({
            pagesDir: "pages",
        }),
    ],
    root: "./ui",
    base: "./",
    envDir: "../",
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:5000",                
            },
        },
    },
    build: {
        outDir: "../public",
        emptyOutDir: true,
    },
});
