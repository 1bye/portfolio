import {
	ClientOnly,
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme";
import appCss from "../index.css?url";

export type RouterAppContext = Record<string, never>;

const SITE_URL = "https://1bye.dev";
const DEFAULT_TITLE = "Yurii Hulyk — 1bye";
const DEFAULT_DESCRIPTION =
	"Software engineer crafting interactive experiences on the web.";
const OG_IMAGE = `${SITE_URL}/og_image.png`;

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: DEFAULT_TITLE },
			{ name: "description", content: DEFAULT_DESCRIPTION },
			{ name: "author", content: "Yurii Hulyk" },
			{ name: "theme-color", content: "#ffffff" },
			// Open Graph
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "1bye.dev" },
			{ property: "og:title", content: DEFAULT_TITLE },
			{ property: "og:description", content: DEFAULT_DESCRIPTION },
			{ property: "og:image", content: OG_IMAGE },
			{ property: "og:url", content: SITE_URL },
			// Twitter
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: DEFAULT_TITLE },
			{ name: "twitter:description", content: DEFAULT_DESCRIPTION },
			{ name: "twitter:image", content: OG_IMAGE },
			{ name: "twitter:creator", content: "@MrBye32" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.ico" },
			{ rel: "canonical", href: SITE_URL },
		],
	}),

	component: RootComponent,
});

function Providers() {
	return (
		<ClientOnly>
			<ThemeProvider>
				<main className="relative isolate flex min-h-screen max-w-screen flex-col overflow-x-hidden px-2">
					<Outlet />
				</main>
			</ThemeProvider>
		</ClientOnly>
	);
}

function RootComponent() {
	return (
		<RootDocument>
			<Providers />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
