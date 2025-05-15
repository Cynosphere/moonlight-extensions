import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { watchExt, buildExt } from "@moonlight-mod/esbuild-config";
import inlineImportPlugin from "esbuild-plugin-inline-import";

const esm = [];

const watch = process.argv.includes("--watch");
const clean = process.argv.includes("--clean");

const wasmPlugin = {
  name: "wasm",
  setup(build) {
    // Resolve ".wasm" files to a path with a namespace
    build.onResolve({ filter: /\.wasm$/ }, (args) => {
      // If this is the import inside the stub module, import the
      // binary itself. Put the path in the "wasm-binary" namespace
      // to tell our binary load callback to load the binary file.
      if (args.namespace === "wasm-stub") {
        return {
          path: args.path,
          namespace: "wasm-binary"
        };
      }

      // Otherwise, generate the JavaScript stub module for this
      // ".wasm" file. Put it in the "wasm-stub" namespace to tell
      // our stub load callback to fill it with JavaScript.
      //
      // Resolve relative paths to absolute paths here since this
      // resolve callback is given "resolveDir", the directory to
      // resolve imports against.
      if (args.resolveDir === "") {
        return; // Ignore unresolvable paths
      }

      const req = createRequire(
        args.path.startsWith("./") ? args.resolveDir : path.resolve(args.resolveDir, "node_modules")
      );

      return {
        path: req.resolve(args.path), //path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
        namespace: "wasm-stub"
      };
    });

    // Virtual modules in the "wasm-stub" namespace are filled with
    // the JavaScript code for compiling the WebAssembly binary. The
    // binary itself is imported from a second virtual module.
    build.onLoad({ filter: /.*/, namespace: "wasm-stub" }, async (args) => ({
      contents: `import wasm from ${JSON.stringify(args.path)}
const mod = WebAssembly.compile(wasm);
export default mod`
    }));

    // Virtual modules in the "wasm-binary" namespace contain the
    // actual bytes of the WebAssembly file. This uses esbuild's
    // built-in "binary" loader instead of manually embedding the
    // binary data inside JavaScript code ourselves.
    build.onLoad({ filter: /.*/, namespace: "wasm-binary" }, async (args) => ({
      contents: await fs.promises.readFile(args.path),
      loader: "binary"
    }));
  }
};

if (clean) {
  fs.rmSync("./dist", { recursive: true, force: true });
} else {
  const exts = fs.readdirSync("./src");

  for (const ext of exts) {
    /** @type {import("@moonlight-mod/esbuild-config").ESBuildFactoryOptions} */
    const cfg = {
      ext,
      entry: path.resolve(path.join("src", ext)),
      output: path.resolve(path.join("dist", ext)),
      esm: esm.includes(ext),
      extraPlugins: [inlineImportPlugin(), wasmPlugin]
    };

    if (watch) {
      await watchExt(cfg);
    } else {
      await buildExt(cfg);
    }
  }
}
