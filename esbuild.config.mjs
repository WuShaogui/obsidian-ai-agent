import esbuild from "esbuild";
import process from "process";

const prod = process.argv[2] === "production";

const context = await esbuild.context({
    entryPoints: ["src/main.ts"],
    bundle: true,
    external: [
        "obsidian",
        "electron",
        "@codemirror/*",
        "@lezer/*",
        "child_process",
        "stream",
        "events",
        "path",
        "fs",
    ],
    format: "cjs",
    target: "es2018",
    platform: "node",
    outfile: "main.js",
    minify: prod,
    sourcemap: prod ? false : "inline",
    logLevel: "info",
});

if (prod) {
    await context.rebuild();
    await context.dispose();
} else {
    await context.watch();
    console.log("esbuild watching for changes...");
}
