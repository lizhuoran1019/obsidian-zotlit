import builtins from "builtin-modules";
import { build } from "esbuild";
import { lessLoader } from "esbuild-plugin-less";
import escape from "escape-string-regexp";
import { promises } from "fs";

import inlineWorker from "./scripts/inline-worker.mjs";
const { copyFile, rename, writeFile, readFile } = promises;

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source visit the plugins github repository
*/
`;

/** @type import("esbuild").Plugin */
const obPlugin = {
  name: "obsidian-plugin",
  setup: (build) => {
    build.onEnd(async () => {
      // fix default css output file name
      const { outfile } = build.initialOptions;
      try {
        await rename(
          outfile.replace(/\.js$/, ".css"),
          outfile.replace(/main\.js$/, "styles.css"),
        );
      } catch (err) {
        if (err.code !== "ENOENT") throw err;
      }

      // copy manifest.json to build dir
      await copyFile("manifest.json", "build/manifest.json");

      // create .hotreload if it doesn't exist
      try {
        await writeFile("build/.hotreload", "", { flag: "wx" });
      } catch (err) {
        if (err.code !== "EEXIST") throw err;
      }

      console.log("build finished");
    });
  },
};

const PATH_TO_CONFIG = `app.vault.adapter.getFullPath(app.vault.configDir)`;
const LIB_FILENAME = `better_sqlite3.node`;

/**
 * @param {boolean} worker
 * @returns {import("esbuild").Plugin}
 */
const patchBindings = (worker = false) => ({
  name: "patch-bindings",
  setup: (build) => {
    build.onLoad(
      {
        filter: /node_modules\/bindings\/bindings\.js$/,
      },
      async (args) => {
        let original = await readFile(args.path, "utf8");
        const checkLib = worker
          ? ""
          : `require("${process.cwd()}/check-lib")(${PATH_TO_CONFIG}, "${LIB_FILENAME}");`;
        original = original.replace(
          `// Get the module root`,
          checkLib +
            `var b, p = require("path").join(${PATH_TO_CONFIG},"${LIB_FILENAME}");` +
            `return (b = require(p), b.path = p, b);`,
        );
        return { contents: original };
      },
    );
  },
});

const isProd = process.env.BUILD === "production";

/** @type import("esbuild").BuildOptions */
const opts = {
  bundle: true,
  watch: !isProd,
  platform: "browser",
  external: ["obsidian", "electron", ...builtins],
  format: "cjs",
  mainFields: ["browser", "module", "main"],
  sourcemap: isProd ? false : "inline",
  minify: isProd,
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.BUILD),
  },
  loader: {
    ".sql": "text",
  },
};
try {
  await build({
    ...opts,
    entryPoints: ["src/zt-main.ts"],
    banner: { js: banner },
    outfile: "build/main.js",
    plugins: [
      lessLoader(),
      inlineWorker(
        {
          ...opts,
          external: [...builtins],
          plugins: [patchBindings(true)],
          format: "cjs",
        },
        [[new RegExp(escape(PATH_TO_CONFIG), "g"), 0]],
      ),
      obPlugin,
      patchBindings(),
    ],
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}
