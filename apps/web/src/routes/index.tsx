import { createFileRoute } from "@tanstack/react-router";
import { ProfileBlock } from "@/components/blocks/profile";
import { ProjectsBlock } from "@/components/blocks/projects";
import { WorkExperienceBlock } from "@/components/blocks/work-experience";
import SiteHeader from "@/components/site-header";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="relative z-10 mx-auto md:max-w-2xl *:[[id]]:scroll-mt-22">
			<SiteHeader />
			<div className="w-full pt-8" />
			<ProfileBlock />
			<div className="w-full pt-8" />
			<ProjectsBlock />
			<div className="w-full pt-8" />
			<WorkExperienceBlock />
		</div>
	);
}
