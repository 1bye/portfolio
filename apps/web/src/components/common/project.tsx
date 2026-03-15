import { DitherShader } from "@portfolio/ui/components/dither-shader";
import {
	PhotoView,
	PhotoViewProvider,
} from "@portfolio/ui/components/photo-view";
import { RandomizedText } from "@portfolio/ui/components/randomized-text";
import { VideoPlayer } from "@portfolio/ui/components/video";
import { cn } from "@portfolio/ui/lib/utils";
import { animate, spring } from "animejs";
import { useEffect, useRef, useState } from "react";

export interface Project extends ProjectInfo {
	icon: string;
	media: ProjectMedia[];
	title: string;
	unavailable?: boolean;
	year: string;
}

export interface ProjectInfo {
	category?: string;
	companyIcon?: string;
	companyName?: string;
	companyNote?: string;
	companyUrl?: string;
	description: string;
}

export interface ProjectMedia {
	gif?: string;
	type: "image" | "video";
	url: string;
}

export function ProjectItem({
	title,
	description,
	icon,
	media,
	companyIcon,
	companyName,
	companyUrl,
	companyNote,
	category,
	unavailable,
}: Project) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<PhotoViewProvider>
			<div
				className="hit-area-l-18 hit-area-t-2 flex w-full flex-col"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div className="flex w-full flex-row items-center gap-1">
					<div>
						<img alt={title} height={20} src={icon} width={20} />
					</div>

					<div className="relative">
						<RandomizedText
							className={cn(unavailable && "text-muted-foreground italic")}
						>
							{title}
						</RandomizedText>

						{unavailable && (
							<svg
								className="absolute top-1/2 left-0 w-full -translate-y-1/2"
								height="6"
								preserveAspectRatio="none"
								viewBox="0 0 100 6"
							>
								<path
									d="M0 3 Q5 0 10 3 T20 3 T30 3 T40 3 T50 3 T60 3 T70 3 T80 3 T90 3 T100 3"
									fill="none"
									stroke="black"
									strokeWidth="2"
								/>
							</svg>
						)}
					</div>

					{category && (
						<span className="mt-1 flex whitespace-nowrap font-mono text-muted-foreground/50 text-xs italic">
							{`# ${category}`}
						</span>
					)}
				</div>
				<ProjectInfo
					companyIcon={companyIcon}
					companyName={companyName}
					companyNote={companyNote}
					companyUrl={companyUrl}
					description={description}
					isHovered={isHovered}
				/>

				<ProjectMedia isHovered={isHovered} media={media} />
			</div>
		</PhotoViewProvider>
	);
}

function ProjectInfo({
	description,
	isHovered,
	height,
	companyIcon,
	companyName,
	companyUrl,
	companyNote,
}: ProjectInfo & {
	isHovered: boolean;
	height?: number;
}) {
	const containerRef = useRef<HTMLParagraphElement>(null);

	// hovered state
	const animateTo = () => {
		if (!containerRef.current) {
			return;
		}
		animate(containerRef.current, {
			height: height ?? 100,
			ease: spring({
				bounce: 0.3,
				duration: 628,
			}),
		});
	};

	// initial state
	const animateFrom = () => {
		if (!containerRef.current) {
			return;
		}
		animate(containerRef.current, {
			height: 0,
			ease: spring({
				bounce: 0.3,
				duration: 1250,
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
		<div
			className="relative mt-1 flex flex-col justify-between overflow-hidden"
			ref={containerRef}
		>
			<p className="text-sm">{description}</p>

			<div className="relative z-10 flex flex-row gap-3">
				{companyName && (
					<div className="flex flex-row items-center gap-1">
						<div
							className={cn(
								"flex flex-row items-center gap-1",
								companyUrl && "cursor-pointer border-border border-b"
							)}
						>
							{companyIcon && (
								<img alt={companyName} className="size-4" src={companyIcon} />
							)}
							<a
								className="text-sm"
								href={companyUrl}
								rel="noopener noreferrer"
								target="_blank"
							>
								{companyName}
							</a>
						</div>
						{companyNote && (
							<span className="text-muted-foreground text-xs italic">
								“{companyNote}”
							</span>
						)}
					</div>
				)}
			</div>
			<div className="absolute bottom-0 left-0">
				<img
					alt="Ordered Dither Gradient"
					className="w-full"
					src="ordered-dither-gradient-02.png"
				/>
			</div>
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

	// hovered state
	const animateTo = () => {
		if (!spanRef.current) {
			return;
		}
		animate(spanRef.current, {
			opacity: 0,
			// translateX: 8,
			ease: spring({
				bounce: 0.3,
				duration: 628,
			}),
		});
	};

	// initial state
	const animateFrom = () => {
		if (!spanRef.current) {
			return;
		}
		animate(spanRef.current, {
			opacity: 1,
			// translateX: -(media.length * 4),
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
		<div className="mt-1 flex max-w-86 overflow-auto sm:max-w-140">
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
				className="select-none whitespace-nowrap pl-1.5 text-muted-foreground text-xs"
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
			marginInlineStart: 0,
			marginRight: 2,
			ease: spring({
				bounce: 0.3,
				duration: 628,
			}),
		});
		animate(containerRef.current, {
			borderWidth: 2,
			duration: 300,
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
			marginInlineStart: index === 0 ? 0 : -6,
			// marginInlineEnd: index * 2,
			// translateX: index * -6,
			marginRight: 0,
			ease: spring({
				bounce: 0.2,
				duration: 628,
			}),
		});
		animate(containerRef.current, {
			borderWidth: 0,
			duration: 300,
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

	const render =
		media.type === "image"
			? undefined
			: () => {
					return (
						<ProjectItemVideo
							height={mediaHeight}
							src={media.url}
							width={mediaWidth}
						/>
					);
				};

	return (
		<>
			<div
				className={cn(
					"group/media size-4 overflow-hidden rounded-sm border bg-neutral-400 ring-2 ring-background",
					isHovered && "ring-0"
				)}
				data-slot="media"
				ref={containerRef}
			>
				<div ref={mediaRef}>
					<PhotoView
						index={index}
						render={render}
						src={media.type === "image" ? media.url : undefined}
					>
						{media.type === "image" && (
							<ProjectItemImage
								height={mediaHeight}
								src={media.url}
								width={mediaWidth}
							/>
						)}
						{media.type === "video" && (
							<ProjectItemVideo
								gif={media.gif}
								height={mediaHeight}
								src={media.url}
								width={mediaWidth}
							/>
						)}
					</PhotoView>
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

function ProjectItemImage({
	src,
	width,
	height,
}: {
	src: string;
	width: number;
	height: number;
}) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				width,
				height,
			}}
		>
			<DitherShader
				className="h-full w-full object-cover"
				colorMode={isHovered ? "original" : "grayscale"}
				ditherMode="bayer"
				gridSize={1}
				src={src}
			/>
		</div>
	);
}

function ProjectItemVideo({
	src,
	width,
	height,
	gif,
}: {
	src: string;
	gif?: string;
	width: number;
	height: number;
}) {
	return (
		<div className="h-hit w-fit">
			{gif ? (
				<div
					style={{
						width,
						height,
					}}
				>
					<DitherShader
						className="h-full w-full object-cover"
						gifFps={10}
						gridSize={1}
						src={gif}
						style={{
							width,
							height,
						}}
					/>
				</div>
			) : (
				<div className="aspect-video w-full max-w-350">
					<VideoPlayer src={src} />
				</div>
			)}
		</div>
	);
}
