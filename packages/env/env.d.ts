// Shared Cloudflare Worker environment contract.

export interface CloudflareEnv {
	CORS_ORIGIN: string;
	DATABASE_URL: string;
	VITE_SERVER_URL: string;
}

declare global {
	interface Env extends CloudflareEnv {}
}

declare module "cloudflare:workers" {
	export const env: Env;
}
