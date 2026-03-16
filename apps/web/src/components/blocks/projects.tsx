import { RandomizedText } from "@portfolio/ui/components/randomized-text";
import { type Project, ProjectItem } from "../common/project";

export function ProjectsBlock() {
	const projects: Project[] = [
		{
			title: "Apiser",
			description:
				"Collection of fully-typed tools to work in back-end with ease. Drizzle Models, Controllers, Services, Workers, Responses, Transforms and much more.",
			icon: "projects/apiser/icon.png",
			year: "2026",
			companyIcon: "company/1bye/icon.png",
			companyName: "1bye",
			companyUrl: "https://github.com/1bye",
			note: "This is an open-source project by 1bye (it's me).",
			category: "Toolkit (WIP)",
			media: [
				{
					type: "image",
					url: "projects/apiser/media-1.png",
				},
				{
					type: "image",
					url: "projects/apiser/media-2.png",
				},
				{
					type: "image",
					url: "projects/apiser/media-3.png",
				},
				{
					type: "image",
					url: "projects/apiser/media-4.png",
				},
			],
		},
		{
			title: "Concero.ai",
			description:
				"Concero is an AI agent for real estate that chats with visitors on your site, recommends the right properties from your listings, and books viewings directly into your agents calendars all day and every day.",
			icon: "projects/concero/icon.svg",
			year: "2025",
			companyIcon: "company/kapta/icon.svg",
			companyName: "Kapta",
			companyUrl: "https://kapta.pt",
			note: "Concero.ai is showcase/test project for our clients",
			category: "SaaS",
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
		{
			title: "InvoiceXpress App",
			description:
				"Issuing invoices has never been so easy. With InvoiceXpress, the simplest and most intuitive invoicing software in the country, you can issue invoices in seconds at any time and in any place.",
			icon: "projects/invoice-xpress-app/icon.svg",
			year: "2025",
			companyIcon: "company/kapta/icon.svg",
			companyName: "Kapta",
			companyUrl: "https://kapta.pt",
			note: "InvoiceXpress is one of the biggest invoicing platforms in Portugal.",
			category: "Mobile App",
			media: [
				{
					type: "video",
					url: "projects/invoice-xpress-app/video.mp4",
					gif: "projects/invoice-xpress-app/video.gif",
				},
				{
					type: "image",
					url: "projects/invoice-xpress-app/media-1.png",
				},
			],
		},
		{
			title: "ResetStudio App",
			description:
				"Simple gym/activity app, with class scheduling and progress tracking. App is small and simple, with a focus on ease of use, with great animations and modern UI.",
			icon: "projects/reset-studio-app/icon.png",
			year: "2025",
			companyIcon: "company/kapta/icon.svg",
			companyName: "Kapta",
			companyUrl: "https://kapta.pt",
			category: "Mobile App",
			note: "This project was made in 2 days",
			media: [
				{
					type: "video",
					url: "projects/reset-studio-app/video.mp4",
					gif: "projects/reset-studio-app/video.gif",
				},
				{
					type: "image",
					url: "projects/reset-studio-app/media-1.png",
				},
			],
		},
		{
			title: "Nouro Flow",
			description:
				"Seamlessly integrate advanced workflows into any app with assigned flows, letting users easily create, modify, and manage workflows and app behavior without extensive coding knowledge.",
			icon: "projects/nouro-flow/icon.svg",
			year: "2023",
			companyName: "Nouro",
			companyIcon: "projects/nouro-flow/icon.svg",
			note: "Unfortunately, the project/company is not publicly available.",
			unavailable: true,
			media: [
				{
					type: "video",
					url: "projects/nouro-flow/video.mp4",
					gif: "projects/nouro-flow/video.gif",
				},
				{
					type: "image",
					url: "projects/nouro-flow/media-1.png",
				},
				{
					type: "image",
					url: "projects/nouro-flow/media-2.png",
				},
				{
					type: "image",
					url: "projects/nouro-flow/media-3.png",
				},
				{
					type: "image",
					url: "projects/nouro-flow/media-4.png",
				},
				{
					type: "image",
					url: "projects/nouro-flow/media-5.png",
				},
			],
			category: "SaaS",
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

	const sortedGrouped = Object.entries(grouped).sort(
		([a], [b]) => Number(b) - Number(a)
	);

	return (
		<section className="flex flex-col gap-3">
			<div className="flex flex-row items-center justify-between">
				<RandomizedText>Projects</RandomizedText>
				<div>
					<RandomizedText className="border-border border-b text-muted-foreground text-sm italic [&_span]:mr-0">
						Hover
					</RandomizedText>
					<RandomizedText className="pl-0.5 text-muted-foreground text-sm italic">
						projects to see more information
					</RandomizedText>
				</div>
			</div>

			<div className="flex flex-col gap-6">
				{Object.entries(sortedGrouped).map(([, [year, projects]]) => (
					<div className="flex flex-row gap-8" key={year}>
						<span className="text-muted-foreground">{year}</span>
						<div className="flex flex-col gap-6">
							{projects.map((project) => (
								<ProjectItem key={project.title} {...project} />
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
