import { build } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const libraries = [
    {
        entry: path.resolve(__dirname, "/src/container/index.ts"),
        fileName: "container",
    },
    {
        entry: path.resolve(__dirname, "/src/container/react.ts"),
        fileName: "container/react",
    },
];

libraries.forEach(async (lib) => {
    await build({
        build: {
            outDir: "./dist",
            lib: {
                ...lib,
                formats: ["es", "cjs"],
            },
            emptyOutDir: false,
            rollupOptions: {
                external: ["react", "react-dom"],
                output: {
                    globals: {
                        react: "React",
                        "react-dom": "ReactDOM",
                    },
                    preserveModules: false,
                },
            },
        },
    });
});
