import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/site-header";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="relative z-10 mx-auto md:max-w-2xl *:[[id]]:scroll-mt-22">
			<SiteHeader />
			{/*<ProfileBlock />*/}
		</div>
	)
}
