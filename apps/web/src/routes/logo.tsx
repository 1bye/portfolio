import { createFileRoute } from "@tanstack/react-router";
import { AnimatedLogo } from "@/components/logo";

export const Route = createFileRoute("/logo")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<AnimatedLogo />
		</div>
	);
}
