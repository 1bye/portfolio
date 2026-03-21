import {
	PhotoView,
	PhotoViewProvider,
} from "@portfolio/ui/components/photo-view";
import { VideoPlayer } from "@portfolio/ui/components/video";
import { cn } from "@portfolio/ui/lib/utils";
import { animate, spring } from "animejs";
import { useEffect, useRef, useState } from "react";
import { RevealText } from "@/components/reveal/reveal-text";
import { useStickyBoolean } from "@/hooks/use-sticky-boolean";
import { RevealBlock } from "../reveal/reveal-block";

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
	companyUrl?: string;
	description: string;
	note?: string;
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
	note,
	category,
	unavailable,
}: Project) {
	const [isHovered, setIsHovered] = useState(false);
	const unavailableStrokeRef = useRef<HTMLParagraphElement>(null);

	// end state
	const animateTo = () => {
		if (!unavailableStrokeRef.current) {
			return;
		}
		animate(unavailableStrokeRef.current, {
			width: "100%",
			duration: 300,
			delay: 100,
		});
	};

	// initial state
	const animateFrom = () => {
		if (!unavailableStrokeRef.current) {
			return;
		}
		animate(unavailableStrokeRef.current, {
			width: "0%",
		});
	};

	// useEffect(() => {
	// 	if (unavailable) {
	// 		animateTo();
	// 	} else {
	// 		animateFrom();
	// 	}
	// }, []);

	return (
		<PhotoViewProvider>
			<div
				className="hit-area-l-18 hit-area-t-2 flex w-full flex-col"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div className="flex w-full flex-row items-center gap-1">
					<RevealBlock
						className="overflow-hidden rounded-full"
						onDone={() => {
							if (unavailable) {
								animateTo();
							} else {
								animateFrom();
							}
						}}
					>
						<img
							alt={title}
							height={20}
							src={icon}
							style={{
								filter: "grayscale(0.6)",
							}}
							width={20}
						/>
					</RevealBlock>

					<div className="relative">
						<RevealText
							className={cn(unavailable && "text-muted-foreground italic")}
						>
							{title}
						</RevealText>

						<div
							className="absolute top-1/2 left-0 -translate-y-1/2 overflow-hidden"
							ref={unavailableStrokeRef}
							style={{
								width: "0%",
							}}
						>
							<svg
								className=""
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
						</div>
					</div>

					{category && (
						<RevealText className="mt-1 flex whitespace-nowrap font-mono text-muted-foreground/50 text-xs italic">
							{`# ${category}`}
						</RevealText>
					)}
				</div>
				<ProjectInfo
					companyIcon={companyIcon}
					companyName={companyName}
					companyUrl={companyUrl}
					description={description}
					isHovered={isHovered}
					note={note}
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
	note,
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
			height: height ?? 85,
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
			style={{
				height: 0,
			}}
		>
			<RevealText className="text-sm">{description}</RevealText>

			<div className="relative z-10 flex flex-row gap-3">
				{(companyName || note) && (
					<div className="flex flex-row items-center gap-1">
						{companyName && (
							<RevealBlock
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
							</RevealBlock>
						)}

						{note && (
							<RevealText className="text-muted-foreground text-xs italic">
								{`“${note}”`}
							</RevealText>
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
					<RevealBlock key={i}>
						<ProjectItemMedia
							index={i}
							isHovered={isHovered}
							media={media[i]}
						/>
					</RevealBlock>
				))}
			</div>
			<span
				className="select-none whitespace-nowrap pl-1.5 text-muted-foreground text-xs"
				ref={spanRef}
				style={{
					opacity: 1,
				}}
			>
				<RevealText>{`${media.length} media`}</RevealText>
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
	const imgRef = useRef<HTMLImageElement>(null);
	const hasBeenHovered = useStickyBoolean(isHovered ?? false);

	const mediaWidth = 128;
	const mediaHeight = 80;

	// hovered state
	const animateTo = () => {
		if (!(containerRef.current && mediaRef.current && imgRef.current)) {
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

		// Image
		animate(imgRef.current, {
			opacity: 0,
			duration: 100,
		});
	};

	// initial state
	const animateFrom = () => {
		if (!(containerRef.current && mediaRef.current && imgRef.current)) {
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

		// Image
		animate(imgRef.current, {
			opacity: 1,
			duration: 2500,
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
		<div
			className={cn(
				"group/media relative size-4 overflow-hidden rounded-sm border bg-neutral-400 ring-2 ring-background",
				isHovered && "ring-0"
			)}
			data-slot="media"
			ref={containerRef}
			style={{
				width: 16,
				height: 16,
				marginInlineStart: index === 0 ? 0 : -6,
				marginRight: 0,
				borderWidth: 0,
			}}
		>
			<img
				alt="Ordered Dither Gradient"
				className="absolute top-0 left-0"
				height={16}
				ref={imgRef}
				src="ordered-dither-gradient-03.png"
				style={{
					opacity: 1,
				}}
				width={16}
			/>

			<div
				ref={mediaRef}
				style={{
					opacity: 0,
				}}
			>
				{hasBeenHovered && (
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
				)}
			</div>
		</div>
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
	return (
		<div
			style={{
				width,
				height,
			}}
		>
			{/*<DitherShader
				className="h-full w-full object-cover"
				ditherMode="bayer"
				gridSize={1}
				src={src}
			/>*/}
			<img alt="Img" className="h-full w-full object-cover" src={src} />
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
					<img alt="Img" className="h-full w-full object-cover" src={gif} />
					{/*<DitherShader
						className="h-full w-full object-cover"
						gifFps={10}
						gridSize={1}
						src={gif}
						style={{
							width,
							height,
						}}
					/>*/}
				</div>
			) : (
				<div className="aspect-video w-full max-w-350">
					<VideoPlayer src={src} />
				</div>
			)}
		</div>
	);
}
