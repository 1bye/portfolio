import { cn } from "@portfolio/ui/lib/utils";
import { Slot } from "radix-ui";
import type React from "react";

function Panel({ className, ...props }: React.ComponentProps<"section">) {
	return (
		<section
			className={cn(
				"screen-line-before screen-line-after border-edge border-x",
				className
			)}
			data-slot="panel"
			{...props}
		/>
	);
}

function PanelHeader({ className, ...props }: React.ComponentProps<"header">) {
	return (
		<header
			className={cn("screen-line-after px-4", className)}
			data-slot="panel-header"
			{...props}
		/>
	);
}

function PanelTitle({
	className,
	asChild = false,
	...props
}: React.ComponentProps<"h2"> & { asChild?: boolean }) {
	const Comp = asChild ? Slot.Root : "h2";

	return (
		<Comp
			className={cn("font-semibold text-3xl tracking-tight", className)}
			data-slot="panel-title"
			{...props}
		/>
	);
}

function PanelTitleSup({ className, ...props }: React.ComponentProps<"sup">) {
	return (
		<sup
			className={cn(
				"-top-[0.75em] ml-1 font-medium text-muted-foreground text-sm tracking-normal",
				className
			)}
			{...props}
		/>
	);
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div className={cn("p-4", className)} data-slot="panel-body" {...props} />
	);
}

export { Panel, PanelContent, PanelHeader, PanelTitle, PanelTitleSup };
