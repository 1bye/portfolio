import { cn } from "@portfolio/ui/lib/utils";
import { RevealBlock } from "./reveal/reveal-block";
import { RevealLink } from "./reveal/reveal-link";
import { RevealText } from "./reveal/reveal-text";

const SOCIAL_LINKS = [
	{ label: "GitHub", href: "https://github.com/1bye" },
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/yurii-hulyk-811186274/",
	},
	{ label: "Twitter", href: "https://x.com/MrBye32" },
	{ label: "Email", href: "mailto:yurii@1bye.dev" },
];

const NAV_LINKS = [
	{ label: "Home", to: "/" },
	{ label: "Projects", to: "/projects" },
	{ label: "Crafts", to: "/crafts/dither" },
];

export default function Footer({ className }: { className?: string }) {
	return (
		<footer
			className={cn(
				"relative z-1 mx-auto w-full pt-16 pb-8 md:max-w-2xl",
				className
			)}
		>
			{/*<div className="h-px bg-border" />*/}
			<div className="flex flex-col gap-6 pt-6">
				<div className="flex flex-row justify-between">
					<div className="flex flex-col gap-1.5">
						<RevealText className="font-mono text-[11px] text-muted-foreground/50 italic tracking-wider">
							Navigate
						</RevealText>
						{NAV_LINKS.map((link) => (
							<RevealBlock>
								<RevealLink
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									key={link.to}
									to={link.to}
								>
									{link.label}
								</RevealLink>
							</RevealBlock>
						))}
					</div>
					<div className="flex flex-col gap-1.5">
						<RevealText className="font-mono text-[11px] text-muted-foreground/50 italic tracking-wider">
							Connect
						</RevealText>
						{SOCIAL_LINKS.map((link) => (
							<RevealBlock key={link.label}>
								<a
									className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									href={link.href}
									rel="noopener noreferrer"
									target="_blank"
								>
									{link.label}
								</a>
							</RevealBlock>
						))}
					</div>
				</div>
				<div className="flex flex-row items-center justify-between">
					<RevealText className="text-muted-foreground/50 text-xs">
						{`${new Date().getFullYear()} Yurii Hulyk`}
					</RevealText>
					<RevealText className="font-mono text-[10px] text-muted-foreground/40">
						1bye.dev
					</RevealText>
				</div>
			</div>
		</footer>
	);
}
