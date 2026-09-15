import { createFileRoute } from "@tanstack/react-router";
import { ProfileBlock } from "@/components/blocks/profile";
import { ProjectsBlock } from "@/components/blocks/projects";
import { WorkExperienceBlock } from "@/components/blocks/work-experience";
import { AnimatedLogo, hasPlayedThisSession } from "@/components/logo";
import { RevealProvider } from "@/components/reveal/provider";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	head: () => ({
		meta: [
			{ title: "Yurii Hulyk — 1bye" },
			{
				name: "description",
				content:
					"Software engineer crafting interactive experiences on the web.",
			},
		],
	}),
});

function HomeComponent() {
	return (
		<RevealProvider delay={hasPlayedThisSession ? 0 : 3700}>
			<div className="flex-1">
				<div className="relative z-10 mx-auto md:max-w-2xl *:[[id]]:scroll-mt-22">
					<AnimatedLogo />

					<SiteHeader />
					<div className="w-full pt-8" />
					<ProfileBlock />
					<div className="w-full pt-8" />
					<ProjectsBlock />
					<div className="w-full pt-8" />
					<WorkExperienceBlock />
				</div>
			</div>

			<SiteFooter />
		</RevealProvider>
	);
}
