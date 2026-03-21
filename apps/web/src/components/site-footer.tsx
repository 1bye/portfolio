import { RevealLink } from "./reveal/reveal-link";

const SOCIAL_LINKS = [
	{ label: "GitHub", href: "https://github.com/1bye" },
	{ label: "LinkedIn", href: "https://linkedin.com/in/yuriihulyk" },
	{ label: "Twitter", href: "https://x.com/1bye_dev" },
	{ label: "Email", href: "mailto:yurii@1bye.dev" },
];

const NAV_LINKS = [
	{ label: "Home", to: "/" },
	{ label: "Projects", to: "/projects" },
	{ label: "Crafts", to: "/crafts/dither" },
];

export default function Footer() {
	return (
		<footer className="relative z-10 mx-auto w-full pt-16 pb-8 md:max-w-2xl">
			<div className="h-px bg-border" />
			<div className="flex flex-col gap-6 pt-6">
				<div className="flex flex-row justify-between">
					<div className="flex flex-col gap-1.5">
						<span className="font-mono text-[11px] text-muted-foreground/50 uppercase tracking-wider">
							Navigate
						</span>
						{NAV_LINKS.map((link) => (
							<RevealLink
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
								key={link.to}
								to={link.to}
							>
								{link.label}
							</RevealLink>
						))}
					</div>
					<div className="flex flex-col gap-1.5">
						<span className="font-mono text-[11px] text-muted-foreground/50 uppercase tracking-wider">
							Connect
						</span>
						{SOCIAL_LINKS.map((link) => (
							<a
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
								href={link.href}
								key={link.label}
								rel="noopener noreferrer"
								target="_blank"
							>
								{link.label}
							</a>
						))}
					</div>
				</div>
				<div className="flex flex-row items-center justify-between">
					<span className="text-muted-foreground/50 text-xs">
						&copy; {new Date().getFullYear()} Yurii Hulyk
					</span>
					<span className="font-mono text-[10px] text-muted-foreground/40">
						1bye.dev
					</span>
				</div>
			</div>
		</footer>
	);
}
