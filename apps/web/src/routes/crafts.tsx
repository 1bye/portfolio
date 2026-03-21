import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/crafts")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/crafts"!</div>;
}
