import {
	createRootRoute,
	type ErrorComponentProps,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";

const DEFAULT_TITLE = "Yurii Hulyk — Software Engineer";
const DEFAULT_DESCRIPTION =
	"Portfolio of Yurii Hulyk, a software engineer building thoughtful digital experiences.";

interface StatusPageProps {
	readonly action: ReactNode;
	readonly code: string;
	readonly description: string;
	readonly title: string;
}

const StatusPage = ({ action, code, description, title }: StatusPageProps) => (
	<main
		className="grid min-h-svh place-items-center px-6 py-16"
		id="main-content"
	>
		<section aria-labelledby="status-title" className="max-w-lg text-center">
			<p className="font-mono text-[0.6875rem] text-[var(--accent)] uppercase tracking-[0.16em]">
				{code}
			</p>
			<h1
				className="mt-4 text-balance font-medium text-5xl tracking-[-0.055em]"
				id="status-title"
			>
				{title}
			</h1>
			<p className="mt-5 text-[var(--muted)] leading-7">{description}</p>
			<div className="mt-8">{action}</div>
		</section>
	</main>
);

const ErrorPage = ({ reset }: ErrorComponentProps) => (
	<StatusPage
		action={
			<button className="text-link" onClick={reset} type="button">
				Try again
			</button>
		}
		code="500"
		description="The page hit an unexpected problem."
		title="Something went wrong."
	/>
);

const NotFoundPage = () => (
	<StatusPage
		action={
			<a className="text-link" href="/">
				Return home
			</a>
		}
		code="404"
		description="The address may be wrong, or the page may have moved."
		title="Page not found."
	/>
);

const RootDocument = ({ children }: Readonly<{ children: ReactNode }>) => (
	<html lang="en">
		<head>
			<HeadContent />
		</head>
		<body>
			<a className="skip-link" href="#main-content">
				Skip to content
			</a>
			{children}
			<Scripts />
		</body>
	</html>
);

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: DEFAULT_TITLE },
			{ name: "description", content: DEFAULT_DESCRIPTION },
			{ name: "author", content: "Yurii Hulyk" },
			{ name: "robots", content: "noindex, nofollow, noarchive" },
			{ name: "theme-color", content: "#f1f0eb" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	component: Outlet,
	errorComponent: ErrorPage,
	notFoundComponent: NotFoundPage,
	shellComponent: RootDocument,
});
