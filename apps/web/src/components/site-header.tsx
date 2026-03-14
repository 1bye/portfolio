import { RandomizedText } from "@portfolio/ui/components/randomized-text";
import { Link } from "@tanstack/react-router";
import { useRootCanvas } from "./root-canvas/provider";

export default function Header() {
	const { registerTarget, unregisterTarget } = useRootCanvas();

	// useEffect(() => {
	// 	const target = { id: "header", position: [0, 0, 0] };
	// 	registerTarget(target);
	// 	return () => unregisterTarget(target.id);
	// }, [registerTarget, unregisterTarget]);

	return (
		<header className="flex w-full flex-row items-center justify-between py-0.5">
			<div className="flex flex-row items-center gap-3">
				{/*<BlockSeparator
					className="h-8 border-border border-r before:top-0 before:h-8"
					orientation="vertical"
				/>*/}
				<div className="flex flex-row items-center gap-2">
					<RandomizedText>1bye</RandomizedText>
					<span className="mt-1 select-none font-mono text-muted-foreground/50 text-xs">
						<RandomizedText>// Yurii Hulyk</RandomizedText>
					</span>
				</div>
			</div>

			<div className="flex flex-row items-center gap-3">
				<div className="flex flex-row items-center gap-2">
					<Link className="flex" to="/">
						<RandomizedText className="text-sm" once split="chars">
							Home
						</RandomizedText>
					</Link>
					<Link className="flex" to="/projects">
						<RandomizedText className="text-sm" once split="chars">
							Projects
						</RandomizedText>
					</Link>
					<Link className="flex" to="/blog">
						<RandomizedText className="text-sm" once split="chars">
							Blog
						</RandomizedText>
					</Link>
				</div>
				{/*<BlockSeparator
					className="h-8 border-border border-l before:top-0 before:h-8"
					orientation="vertical"
				/>*/}
			</div>
		</header>
	);
}
