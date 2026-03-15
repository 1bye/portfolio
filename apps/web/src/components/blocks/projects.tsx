import { RandomizedText } from "@portfolio/ui/components/randomized-text";
import { type Project, ProjectItem } from "../common/project";

export function ProjectsBlock() {
	const projects: Project[] = [
		{
			title: "Concero.ai",
			description:
				"Concero is an AI agent for real estate that chats with visitors on your site, recommends the right properties from your listings, and books viewings directly into your agents calendars all day and every day.",
			icon: "projects/concero/icon.svg",
			year: "2025",
			companyIcon: "company/kapta/icon.svg",
			companyName: "Kapta",
			companyUrl: "https://kapta.pt",
			media: [
				{
					type: "video",
					url: "projects/concero/video.mp4",
					gif: "projects/concero/video.gif",
				},
				{
					type: "image",
					url: "projects/concero/media-1.png",
				},
				{
					type: "image",
					url: "projects/concero/media-2.png",
				},
				{
					type: "image",
					url: "projects/concero/media-3.png",
				},
				{
					type: "image",
					url: "projects/concero/media-4.png",
				},
			],
		},
	];

	const grouped = projects.reduce(
		(acc, project) => {
			const year = project.year;
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(project);
			return acc;
		},
		{} as Record<string, Project[]>
	);

	return (
		<section className="flex flex-col gap-3">
			<div className="flex flex-row items-center justify-between">
				<RandomizedText>Projects</RandomizedText>
				<RandomizedText className="text-muted-foreground text-sm italic">
					Hover projects to see more information
				</RandomizedText>
			</div>

			<div className="flex flex-col">
				{Object.entries(grouped).map(([year, projects]) => (
					<div className="flex flex-row gap-8" key={year}>
						<span className="text-muted-foreground">{year}</span>
						{projects.map((project) => (
							<ProjectItem key={project.title} {...project} />
						))}
					</div>
				))}
			</div>
		</section>
	);
}
