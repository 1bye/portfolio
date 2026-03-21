import { createFileRoute } from "@tanstack/react-router";
import { ProjectsBlock } from "@/components/blocks/projects";
import { RevealProvider } from "@/components/reveal/provider";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const Route = createFileRoute("/projects")({
	component: ProjectsComponent,
});

function ProjectsComponent() {
	return (
		<RevealProvider delay={0}>
			<div className="flex-1">
				<div className="relative z-10 mx-auto md:max-w-2xl *:[[id]]:scroll-mt-22">
					<SiteHeader />
					<div className="w-full pt-8" />
					<ProjectsBlock />
				</div>
			</div>

			<SiteFooter />
		</RevealProvider>
	);
}
