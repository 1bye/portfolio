import alchemy from "alchemy";
import { TanStackStart } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/server/.env" });

const app = await alchemy("portfolio");

function requireBinding<T>(value: T | undefined, name: string): T {
	if (value === undefined) {
		throw new Error(`${name} is required`);
	}

	return value;
}

export const web = await TanStackStart("web", {
	cwd: "../../apps/web",
	assets: "dist",
	profile: "1bye",
	bindings: {
		VITE_SERVER_URL: requireBinding(
			alchemy.env.VITE_SERVER_URL,
			"VITE_SERVER_URL"
		),
		DATABASE_URL: requireBinding(
			alchemy.secret.env.DATABASE_URL,
			"DATABASE_URL"
		),
		CORS_ORIGIN: requireBinding(alchemy.env.CORS_ORIGIN, "CORS_ORIGIN"),
	},
	domains: ["1bye.dev"],
});

// export const server = await Worker("server", {
// 	cwd: "../../apps/server",
// 	entrypoint: "src/index.ts",
// 	name: "1bye-dev-portfolio-server",
// 	compatibility: "node",
// 	bindings: {
// 		DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
// 		CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
// 	},
// 	dev: {
// 		port: 3000,
// 	},
// });

console.log(`Web    -> ${web.url}`);
// console.log(`Server -> ${server.url}`);

await app.finalize();
