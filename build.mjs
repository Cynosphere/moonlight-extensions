import * as esbuild from "esbuild";
import copyStaticFiles from "esbuild-copy-static-files";
import fs from "fs";

const prod = process.env.NODE_ENV === "production";
const watch = process.argv.includes("--watch");

function makeConfig(ext, name) {
  const entryPoints = [];
  const fileExts = ["js", "jsx", "ts", "tsx"];
  for (const fileExt of fileExts) {
    const path = `./src/${ext}/${name}.${fileExt}`;
    if (fs.existsSync(path)) entryPoints.push(path);
  }

  if (entryPoints.length === 0) return null;

  return {
    entryPoints,
    outfile: `./dist/${ext}/${name}.js`,

    format: "cjs",
    platform: "node",

    treeShaking: true,
    bundle: true,
    minify: prod,
    sourcemap: "inline",

    plugins: [
      copyStaticFiles({
        src: `./src/${ext}/manifest.json`,
        dest: `./dist/${ext}/manifest.json`
      })
    ]
  };
}

const exts = fs.readdirSync("./src");

const config = exts
  .map((x) => [
    makeConfig(x, "index"),
    makeConfig(x, "node"),
    makeConfig(x, "host")
  ])
  .flat()
  .filter((c) => c !== null);

if (watch) {
  await Promise.all(
    config.map(async (c) => {
      const ctx = await esbuild.context(c);
      await ctx.watch();
    })
  );
} else {
  for (const c of config) {
    await esbuild.build(c);
  }
}
