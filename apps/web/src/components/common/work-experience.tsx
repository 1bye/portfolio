import { Separator } from "@portfolio/ui/components/separator";
import { cn } from "@portfolio/ui/lib/utils";
import { animate, spring } from "animejs";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

/**
 * Represents the valid keys of the `iconMap` object, used to specify the type of icon
 * associated with an experience position.
 */
export interface ExperiencePositionItemType {
	/** A brief description of the position or responsibilities */
	description?: string;
	/** The period during which the position was held (e.g., "Jan 2020 - Dec 2021") */
	employmentPeriod: string;
	/** The type of employment (e.g., "Full-time", "Part-time", "Contract") */
	employmentType?: string;
	/** Unique identifier for the position */
	id: string;
	/** Indicates if the position details are expanded in the UI */
	isExpanded?: boolean;
	/** A list of skills associated with the position */
	skills?: string[];
	/** The job title or position name */
	title: string;
}

export interface ExperienceItemType {
	/** URL or path to the company's logo image */
	companyLogo?: string;
	/** Name of the company where the experience was gained */
	companyName: string;
	/** Unique identifier for the experience item */
	id: string;
	/** Indicates if this is the user's current employer */
	isCurrentEmployer?: boolean;
	/**
	 * List of positions held at the company
	 */
	positions: ExperiencePositionItemType[];
	year: string;
}

// export interface WorkExperienceProps {
// 	className?: string;
// 	/** @fumadocsHref #experienceitemtype */
// 	experiences: ExperienceItemType[];
// }

// export function WorkExperience({
// 	className,
// 	experiences,
// }: WorkExperienceProps) {
// 	return (
// 		<div className={cn("", className)}>
// 			{experiences.map((experience) => (
// 				<ExperienceItem experience={experience} key={experience.id} />
// 			))}
// 		</div>
// 	);
// }

export interface ExperienceItemProps {
	experience: ExperienceItemType;
}

export function ExperienceItem({ experience }: ExperienceItemProps) {
	return (
		<div className="">
			<div className="not-prose flex items-center gap-1">
				{experience.companyLogo && (
					<div className="flex size-6 shrink-0 items-center justify-center">
						<img
							alt={experience.companyName}
							height={20}
							src={experience.companyLogo}
							width={20}
						/>
					</div>
				)}

				<h3 className="font-medium text-foreground leading-snug">
					{experience.companyName}
				</h3>

				{/*{experience.isCurrentEmployer && (
					<span className="relative flex items-center justify-center">
						<span className="absolute inline-flex size-3 animate-ping rounded-full bg-info opacity-50" />
						<span className="relative inline-flex size-2 rounded-full bg-info" />
						<span className="sr-only">Current Employer</span>
					</span>
				)}*/}
			</div>

			{/* before:absolute before:left-3 before:h-full before:w-px before:bg-border*/}
			<div className="relative mt-1 space-y-4">
				{experience.positions.map((position) => (
					<ExperiencePositionItem key={position.id} position={position} />
				))}
			</div>
		</div>
	);
}

export interface ExperiencePositionItemProps {
	position: ExperiencePositionItemType;
}

export function ExperiencePositionItem({
	position,
}: ExperiencePositionItemProps) {
	const [isHovered, setIsHovered] = useState(false);
	const infoRef = useRef<HTMLDivElement>(null);

	// hovered state
	const animateTo = () => {
		if (!infoRef.current) {
			return;
		}
		animate(infoRef.current, {
			height: 100,
			ease: spring({
				bounce: 0.3,
				duration: 628,
			}),
		});
	};

	// initial state
	const animateFrom = () => {
		if (!infoRef.current) {
			return;
		}
		animate(infoRef.current, {
			height: 0,
			ease: spring({
				bounce: 0.3,
				duration: 628,
			}),
		});
	};

	useEffect(() => {
		if (isHovered && position.description) {
			animateTo();
		} else {
			animateFrom();
		}
	}, [isHovered]);

	return (
		<div
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="hit-area-l-17 relative">
				<div
					className={cn("group not-prose block w-full select-none text-left")}
				>
					<div className="relative z-1 flex items-center gap-3">
						{/*<div
							className={cn(
								"flex size-6 shrink-0 items-center justify-center rounded-lg"
							)}
						>
							<ExperienceIcon className="size-4" />
						</div>*/}

						<h4 className="flex-1 text-balance font-medium text-foreground text-sm">
							{position.title}
						</h4>
					</div>

					<div className="relative z-1 flex items-center gap-2 text-muted-foreground text-sm">
						{position.employmentType && (
							<>
								<dl>
									<dt className="sr-only">Employment Type</dt>
									<dd>{position.employmentType}</dd>
								</dl>

								<Separator
									className="data-vertical:h-4 data-vertical:self-center"
									orientation="vertical"
								/>
							</>
						)}

						<dl>
							<dt className="sr-only">Employment Period</dt>
							<dd>{position.employmentPeriod}</dd>
						</dl>
					</div>
				</div>

				<div className="overflow-hidden" ref={infoRef}>
					{position.description && (
						<Prose className="text-xs">
							<ReactMarkdown>{position.description}</ReactMarkdown>
						</Prose>
					)}
				</div>

				{Array.isArray(position.skills) && position.skills.length > 0 && (
					<ul className="not-prose mt-1 flex flex-wrap gap-1">
						{position.skills.map((skill, index) => (
							<li className="flex" key={index}>
								<Skill>
									{skill}
									{index === (position.skills?.length ?? 0) - 1 ? "" : ","}
								</Skill>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

function Prose({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"prose prose-sm prose-ncdai prose-zinc dark:prose-invert max-w-none font-mono text-foreground",
				className
			)}
			{...props}
		/>
	);
}

function Skill({ className, ...props }: ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"font-mono text-muted-foreground text-xs italic",
				className
			)}
			{...props}
		/>
	);
}
