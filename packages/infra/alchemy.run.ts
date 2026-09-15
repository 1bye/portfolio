import { Stack as createStack } from "alchemy";
import { providers, state, Website } from "alchemy/Cloudflare";
import { Stack as StackContext } from "alchemy/Stack";
import { gen } from "effect/Effect";

const PRODUCTION_STAGE = "prod";
const LEGACY_PRODUCTION_STAGE = "yuriihulyk";
const ARCHIVE_DOMAIN = "v1.1bye.dev";
const PRIMARY_DOMAIN = "1bye.dev";
const ARCHIVE_DEV_PORT = 3001;
const WEBSITE_DEV_PORT = 3000;

export default createStack(
	"Portfolio",
	{
		providers: providers(),
		state: state(),
	},
	gen(function* () {
		const stack = yield* StackContext;
		const legacyStage =
			stack.stage === PRODUCTION_STAGE ? LEGACY_PRODUCTION_STAGE : stack.stage;

		const archive = yield* Website.Vite("Archive", {
			rootDir: "../../apps/archive",
			name: `portfolio-web-${legacyStage}`,
			domain:
				stack.stage === PRODUCTION_STAGE
					? { name: PRIMARY_DOMAIN, aliases: [ARCHIVE_DOMAIN] }
					: undefined,
			memo: {
				include: [
					"**/*",
					"../../packages/config/**",
					"../../packages/ui/src/**",
				],
				lockfile: true,
			},
			dev: {
				port: ARCHIVE_DEV_PORT,
			},
		});

		const website = yield* Website.Vite("Website", {
			rootDir: "../../apps/web",
			name: `portfolio-v2-${stack.stage}`,
			domain: stack.stage === PRODUCTION_STAGE ? null : undefined,
			env: {
				VITE_IS_PRODUCTION: "false",
			},
			memo: {
				include: ["**/*", "../../packages/config/**"],
				lockfile: true,
			},
			dev: {
				port: WEBSITE_DEV_PORT,
			},
		});

		return {
			archiveUrl: archive.url,
			websiteUrl: website.url,
		};
	})
);
