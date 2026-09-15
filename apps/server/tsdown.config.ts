import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "./src/index.ts",
	external: [/^cloudflare:/],
	format: "esm",
	outDir: "./dist",
	clean: true,
	noExternal: [/@portfolio\/.*/],
});
