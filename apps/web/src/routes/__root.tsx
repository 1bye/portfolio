import { Toaster } from "@portfolio/ui/components/sonner";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { PropsWithChildren } from "react";
import { RootCanvasProvider } from "@/components/root-canvas/provider";
import { ThemeProvider } from "@/components/theme";
import appCss from "../index.css?url";

export type RouterAppContext = {};

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "My App",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootDocument,
});

function RootLayout({ children }: PropsWithChildren<{}>) {
	return (
		<RootCanvasProvider>
			<ThemeProvider>
				<main className="max-w-screen overflow-x-hidden px-2">
					{children}
					{/*<RootCanvas />*/}
				</main>
			</ThemeProvider>
		</RootCanvasProvider>
	);
}

function RootDocument() {
	return (
		<html className="light" lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<RootLayout>
					<Outlet />
				</RootLayout>
				<Toaster richColors />
				<TanStackRouterDevtools position="bottom-left" />
				<Scripts />
			</body>
		</html>
	);
}
