import alchemy from "alchemy";
import { Vite, Worker } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/server/.env" });

const app = await alchemy("portfolio");

export const web = await Vite("web", {
	cwd: "../../apps/web",
	assets: "dist",
	bindings: {
		VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL!,
		DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
		CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
	},
});

export const server = await Worker("server", {
	cwd: "../../apps/server",
	entrypoint: "src/index.ts",
	compatibility: "node",
	bindings: {
		DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
		CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
	},
	dev: {
		port: 3000,
	},
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

await app.finalize();
