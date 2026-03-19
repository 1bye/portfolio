import { RandomizedText } from "@portfolio/ui/components/randomized-text";
import {
	ExperienceItem,
	type ExperienceItemType,
} from "@/components/common/work-experience";

export function WorkExperienceBlock() {
	const workExperiences: ExperienceItemType[] = [
		{
			id: "kapta",
			companyName: "Kapta",
			year: "2025",
			companyLogo: "company/kapta/icon.svg",
			positions: [
				{
					id: "1",
					title: "Developer",
					employmentPeriod: "06.2025 — present",
					employmentType: "Full-time",
					description: `I'm building various projects at Kapta from Mobile Apps, and Financial Integrations to SaaS products and systems.\n\nStarting from Front-end and Back-end and ending at Design and DevOps etc.`,
					skills: [
						"Full-Stack",
						"SaaS Developer",
						"DevOps",
						"Project Management",
						"Finance",
					],
				},
			],
			isCurrentEmployer: true,
		},
		{
			id: "freelance",
			companyName: "Freelance",
			year: "2022",
			positions: [
				{
					id: "1",
					title: "UpWork",
					employmentPeriod: "06.2022 — present",
					employmentType: "Part-time / Per project",
					skills: ["AI", "Full-Stack", "Shopify", "Integrations"],
				},
				{
					id: "2",
					title: "Fiverr",
					employmentPeriod: "02.2026 — present",
					employmentType: "Part-time / Per project",
					skills: ["AI", "Full-Stack", "Mobile Apps"],
				},
			],
		},
	];

	const grouped = workExperiences.reduce(
		(acc, project) => {
			const year = project.year;
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(project);
			return acc;
		},
		{} as Record<string, ExperienceItemType[]>
	);

	const sortedGrouped = Object.entries(grouped).sort(
		([a], [b]) => Number(b) - Number(a)
	);

	return (
		<section className="flex flex-col gap-3">
			<div className="flex flex-row items-center justify-between">
				<RandomizedText>Work experience</RandomizedText>
				{/*<div>
					<RandomizedText className="border-border border-b text-muted-foreground text-sm italic [&_span]:mr-0">
						Hover
					</RandomizedText>
					<RandomizedText className="pl-0.5 text-muted-foreground text-sm italic">
						projects to see more information
					</RandomizedText>
				</div>*/}
			</div>

			<div className="flex flex-col gap-6">
				{Object.entries(sortedGrouped).map(([, [year, experiences]]) => (
					<div className="flex flex-row gap-8" key={year}>
						<span className="text-muted-foreground">{year}</span>
						<div className="flex flex-col gap-6">
							{experiences.map((experience) => (
								<ExperienceItem experience={experience} key={experience.id} />
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
