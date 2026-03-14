import { RandomizedText } from "@portfolio/ui/components/randomized-text";
import { cn } from "@portfolio/ui/lib/utils";
import { animate, spring } from "animejs";
import { useEffect, useRef, useState } from "react";

export function ProjectsBlock() {
	const projects: Project[] = [
		{
			title: "Concero.ai",
			description:
				"Concero is an AI agent for real estate that chats with visitors on your site, recommends the right properties from your listings, and books viewings directly into your agents calendars all day and every day.",
			icon: "projects/concero/icon.svg",
			year: "2025",
			media: [
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
			<RandomizedText>Projects</RandomizedText>

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

export interface Project {
	description: string;
	icon: string;
	media: ProjectMedia[];
	title: string;
	year: string;
}

export interface ProjectMedia {
	type: "image" | "video";
	url: string;
}

export function ProjectItem({ title, description, icon, media }: Project) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="hit-area-l-18 hit-area-t-2 flex w-full flex-col gap-2"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="flex w-full flex-row items-center gap-1">
				<div>
					<img alt={title} height={20} src={icon} width={20} />
				</div>

				<div>
					<RandomizedText>{title}</RandomizedText>
					{/*<RandomizedText className="text-sm">{description}</RandomizedText>*/}
				</div>
			</div>

			<ProjectMedia isHovered={isHovered} media={media} />
		</div>
	);
}

function ProjectMedia({
	media,
	isHovered,
}: {
	media: ProjectMedia[];
	isHovered: boolean;
}) {
	const spanRef = useRef<HTMLDivElement>(null);

	const animateTo = () => {
		if (!spanRef.current) {
			return;
		}
		animate(spanRef.current, {
			opacity: 0,
			translateX: 8,
			ease: spring({
				bounce: 0.3,
				duration: 628,
			}),
		});
	};
	const animateFrom = () => {
		if (!spanRef.current) {
			return;
		}
		animate(spanRef.current, {
			opacity: 1,
			translateX: -8,
			ease: spring({
				bounce: 0.3,
				duration: 628,
			}),
		});
	};

	useEffect(() => {
		if (isHovered) {
			animateTo();
		} else {
			animateFrom();
		}
	}, [isHovered]);

	return (
		<div className="flex">
			<div className="relative flex flex-row">
				{media.map((_, i) => (
					<ProjectItemMedia
						index={i}
						isHovered={isHovered}
						key={i}
						media={media[i]}
					/>
				))}
			</div>
			<span
				className="select-none whitespace-nowrap text-muted-foreground text-xs"
				ref={spanRef}
			>
				{media.length} media
			</span>
		</div>
	);
}

function ProjectItemMedia({
	media,
	isHovered,
	index,
}: {
	media: ProjectMedia;
	isHovered?: boolean;
	index: number;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mediaRef = useRef<HTMLDivElement>(null);

	const mediaWidth = 128;
	const mediaHeight = 80;

	// hovered state
	const animateTo = () => {
		if (!(containerRef.current && mediaRef.current)) {
			return;
		}
		// Container animation
		animate(containerRef.current, {
			width: mediaWidth,
			height: mediaHeight,
			translateX: 0,
			marginRight: 2,
			ease: spring({
				bounce: 0.3,
				duration: 628,
			}),
		});

		// Media animation
		animate(mediaRef.current, {
			opacity: 1,
		});
	};

	// initial state
	const animateFrom = () => {
		if (!(containerRef.current && mediaRef.current)) {
			return;
		}
		// Container animation
		animate(containerRef.current, {
			width: 16,
			height: 16,
			translateX: index * -6,
			marginRight: 0,
			ease: spring({
				bounce: 0.2,
				duration: 628,
			}),
		});

		// Media animation
		animate(mediaRef.current, {
			opacity: 0,
		});
	};

	useEffect(() => {
		if (isHovered) {
			animateTo();
		} else {
			animateFrom();
		}
	}, [isHovered]);

	return (
		<>
			<div
				className={cn(
					"group/media size-4 overflow-hidden rounded-sm border border-background bg-neutral-400 ring-2 ring-background",
					isHovered && "ring-0"
				)}
				data-slot="media"
				ref={containerRef}
			>
				<div ref={mediaRef}>
					{media.type === "image" && (
						<img
							alt="Project media"
							className="h-full w-full object-cover"
							height={mediaHeight}
							src={media.url}
							width={mediaWidth}
						/>
					)}
					{/*{media.type === "video" && (
						<video
							alt=""
							className="h-full w-full object-cover"
							height={mediaHeight}
							src={media.url}
							width={mediaWidth}
						/>
					)}*/}
				</div>
			</div>
			{/*<div
				className="h-fit w-full max-w-32 border border-border bg-muted"
				style={{
					aspectRatio: "4/3",
				}}
			/>*/}
		</>
	);
}
