import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import voie from "vite-plugin-voie";

import * as url from 'url';

const root = url.fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        voie.default({
            pagesDir: "pages",
        }),
        {
            name: "configure-response-headers",
            configureServer: server => {
                server.middlewares.use((_req, res, next) => {
                    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                    next();
                })
            }
        }
    ],
    root: "./ui",
    base: "./",
    envDir: "../",
    server: {
        port: 80,
        hmr: {
            port: 80,
            host: 'oraclecloud.altgrupo.com.br',
            protocol: 'ws'
        },
        proxy: {
            "/api": {
                target: `http://app:5000/`,                
            },
            "/uploads": {
                target: `http://app:5000/`,                
            },
        },
    },
    resolve: {
        alias: {
            '@': root+'/ui',
            '~': root+'/ui',
        }
    },
    build: {
        outDir: "../public",
        emptyOutDir: true,
    },
});
