import { cn } from "@portfolio/ui/lib/utils";

export function BlockSeparator({
	className,
	orientation = "horizontal",
}: {
	className?: string;
	orientation?: "horizontal" | "vertical";
}) {
	if (orientation === "vertical") {
		return (
			<div
				className={cn(
					"relative flex h-full w-8",
					"before:absolute before:-top-[100vh] before:-z-1 before:h-[200vh] before:w-8",
					"before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
					className
				)}
			/>
		);
	}

	return (
		<div
			className={cn(
				"relative flex h-8 w-full border-edge border-x",
				"before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
				"before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
				className
			)}
		/>
	);
}
