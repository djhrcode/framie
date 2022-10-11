import { resolve } from "node:path";
import { defineConfig, UserConfigExport } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
    build: {
        lib: {
            entry: {
                container: resolve(__dirname, "src/container/index.ts"),
                "container/react": resolve(__dirname, "src/container/react.ts"),
            },
            name: "framie",
            fileName: (format, name) => `${name}/index.${format}.js`,
        },
        rollupOptions: {
            external: ["react"],
            output: {
                globals: {
                    react: "React",
                },
                preserveModules: false,
            },
        },
    },
    resolve: {
        alias: {
            "@root": resolve(__dirname, "./src"),
            "@shared": resolve(__dirname, "./src/shared"),
        },
    },
    plugins: [react()],
} as any as UserConfigExport);
