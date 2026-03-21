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
import { RootCanvas } from "@/components/root-canvas/root-canvas";
import Footer from "@/components/site-footer";
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
				<main className="flex min-h-screen max-w-screen flex-col overflow-x-hidden px-2">
					<div className="flex-1">{children}</div>
					<Footer />
					<RootCanvas />
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
