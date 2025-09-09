import { getFoundryPackageInfo } from "@foundryvtt/utils";
import { foundryvtt } from "@foundryvtt/vite-plugin";
import path from "path";
import * as Vite from "vite";

const config = Vite.defineConfig(async ({ mode }: Vite.ConfigEnv): Promise<Vite.UserConfig> => {
  const buildMode = mode === "production" ? "production" : "development";
  const packageInfo = await getFoundryPackageInfo();
  return {
    base: packageInfo.prefixUrl,
    css: { devSourcemap: buildMode === "development" },
    define: {
      fu: "foundry.utils",
    },
    publicDir: path.resolve("static"),
    root: path.resolve("src"),
    esbuild: { keepNames: true },
    build: {
      emptyOutDir: buildMode !== "development",
      outDir: path.resolve("dist"),
      minify: buildMode === "development" ? false : "terser",
      sourcemap: buildMode === "development",
      rollupOptions: {
        input: {
          index: path.resolve("src/index.ts"),
        },
        output: {
          format: "esm",
          entryFileNames: "[name].mjs",
          assetFileNames: (chunkInfo: Vite.Rollup.PreRenderedAsset) =>
            chunkInfo.names[0] === "index.css" ? "styles.css" : "[name].[hash][extname]",
        },
      },
    },
    server: {
      port: 30001,
      proxy: {
        [`^(?!${packageInfo.prefixUrl})`]: "http://localhost:30000/",
        "/socket.io": {
          target: "ws://localhost:30000",
          ws: true,
        },
      },
      watch: {
        atomic: true,
        depth: 8,
        persistent: true,
      },
    },
    plugins: [
      await foundryvtt({
        root: path.resolve("."),
        copyStaticFiles: {
          ignore: ["@types"],
        },
      }),
    ],
  };
});

export default config;
