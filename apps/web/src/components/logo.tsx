import { animate, createTimeline } from "animejs";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";

export let hasPlayedThisSession = false;

export function AnimatedLogo() {
	const startRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	const isMobile = useIsMobile();

	useEffect(() => {
		if (!(startRef.current && containerRef.current && textRef.current)) {
			return;
		}

		if (hasPlayedThisSession) {
			containerRef.current.style.opacity = 0;
			// startRef.current.style.width = "0px";
			// startRef.current.style.left = "-8px";
			// startRef.current.style.fontSize = "16px";
			// containerRef.current.style.transform = "rotateZ(0deg)";
			// containerRef.current.style.top = "0.65%";
			// containerRef.current.style.left = "0.85%";
			// textRef.current.style.fontSize = "16px";
			return;
		}

		const tl = createTimeline({
			defaults: { duration: 750 },
			autoplay: false,
			onComplete: () => {
				hasPlayedThisSession = true;
			},
		});

		const startAnimate = animate(startRef.current, {
			keyframes: {
				"0%": { width: 112, left: 0 },
				"100%": { width: 0, left: -8 },
			},
			ease: "inOutExpo",
			duration: 2000,
			autoplay: false,
		});

		const containerAnimate = animate(containerRef.current, {
			keyframes: {
				"0%": { rotateZ: 30 },
				"100%": { rotateZ: 0 },
			},
			ease: "inOutExpo",
			duration: 2000,
			autoplay: false,
		});

		const containerAnimate2 = animate(containerRef.current, {
			keyframes: {
				"0%": { top: "50%", left: "50%" },
				"100%": {
					top: isMobile ? "0.6%" : "0.65%",
					left: isMobile ? "1.2%" : "0.85%",
				},
			},
			ease: "inOutExpo",
			duration: 2000,
			autoplay: false,
		});

		const startAnimate2 = animate(startRef.current, {
			keyframes: {
				"0%": { fontSize: 48 },
				"100%": { fontSize: 16 },
			},
			ease: "inOutExpo",
			duration: 2000,
			autoplay: false,
		});

		const textAnimate2 = animate(textRef.current, {
			keyframes: {
				"0%": { fontSize: 48 },
				"100%": { fontSize: 16 },
			},
			ease: "inOutExpo",
			duration: 2000,
			autoplay: false,
		});

		const containerAnimate3 = animate(containerRef.current, {
			keyframes: {
				"0%": { opacity: 1 },
				"100%": { opacity: 0 },
			},
			ease: "inOutExpo",
			duration: 600,
			autoplay: false,
		});

		tl.label("Start")
			.sync(startAnimate, 0)
			.sync(containerAnimate, 0)
			.sync(containerAnimate2, 1400)
			.sync(startAnimate2, 2400)
			.sync(textAnimate2, 2400)
			.sync(containerAnimate3, 4600);

		tl.play();

		return () => {
			tl.pause();
		};
	}, [isMobile]);

	return (
		<>
			{/*<button
				className="absolute top-4 left-4 bg-red-400 px-5 py-4"
				onClick={() => {
					tl.restart();
				}}
			>
				play
			</button>*/}

			<div
				className="absolute top-1/2 left-1/2 flex flex-row items-end"
				ref={containerRef}
				style={{
					transform: "rotateZ(30deg)",
				}}
			>
				{/*<div className="z-10 shrink-0 before:absolute before:top-0 before:-left-24 before:h-16 before:w-24 before:bg-red-400"></div>*/}

				<div className="relative">
					<div
						className="absolute top-0 z-10 flex h-13 flex-row justify-end bg-background text-5xl"
						ref={startRef}
						style={{
							left: 0,
							width: 112,
						}}
					>
						<div className="relative translate-x-2">
							<span>1</span>
						</div>
					</div>

					<div className="text-5xl" ref={textRef}>
						bye
					</div>
				</div>
			</div>
		</>
	);
}
