import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/crafts/dither")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/crafts/dither"!</div>;
}
