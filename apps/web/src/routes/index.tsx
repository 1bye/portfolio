import { createFileRoute } from "@tanstack/react-router";
import { ProfileBlock } from "@/components/blocks/profile";
import SiteHeader from "@/components/site-header";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="mx-auto md:max-w-3xl *:[[id]]:scroll-mt-22">
			<SiteHeader />
			<ProfileBlock />
		</div>
	);
}
