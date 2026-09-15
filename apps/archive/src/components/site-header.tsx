import { RevealLink } from "./reveal/reveal-link";
import { RevealText } from "./reveal/reveal-text";

export default function Header({ title }: { title?: string } = {}) {
	return (
		<header className="relative flex w-full flex-row items-center justify-between py-0.5">
			<div className="flex flex-row items-center gap-3">
				{/*<BlockSeparator
					className="h-8 border-border border-r before:top-0 before:h-8"
					orientation="vertical"
				/>*/}
				<div className="flex flex-row items-center gap-2">
					<RevealLink to="/">
						<RevealText>1bye</RevealText>
					</RevealLink>

					<span className="mt-1 flex select-none flex-row font-mono text-muted-foreground/50 text-xs">
						<RevealText>{"// Yurii Hulyk"}</RevealText>
					</span>
				</div>
			</div>

			{title && (
				<div className="pointer-events-none absolute inset-0 top-10 flex items-center justify-center">
					<RevealText className="font-mono text-muted-foreground text-xs">
						{title}
					</RevealText>
				</div>
			)}

			<div className="flex flex-row items-center gap-3">
				<div className="flex flex-row items-center gap-2">
					<RevealLink className="flex" to="/">
						<RevealText className="text-sm" split="chars">
							Home
						</RevealText>
					</RevealLink>
					<RevealLink className="flex" to="/projects">
						<RevealText className="text-sm" split="chars">
							Projects
						</RevealText>
					</RevealLink>
					<RevealLink className="flex" to="/crafts/list">
						<RevealText className="text-sm" split="chars">
							Crafts
						</RevealText>
					</RevealLink>
				</div>
				{/*<BlockSeparator
					className="h-8 border-border border-l before:top-0 before:h-8"
					orientation="vertical"
				/>*/}
			</div>
		</header>
	);
}
