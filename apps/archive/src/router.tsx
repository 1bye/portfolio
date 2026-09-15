import { createRouter } from "@tanstack/react-router";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	// const queryClient = new QueryClient();

	const router = createRouter({
		routeTree,
		context: {},
		defaultPreload: "intent",
		defaultPendingComponent: () => <Loader />,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
