import { animate, createTimeline, splitText, stagger } from "animejs";
import { useEffect, useRef } from "react";

export function AnimatedLogo() {
	const startRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	const tl = createTimeline({ defaults: { duration: 750 }, autoplay: true });

	useEffect(() => {
		if (!(startRef.current && containerRef.current && textRef.current)) {
			return;
		}

		const startAnimate = animate(startRef.current, {
			keyframes: {
				"0%": { width: 112, left: 0 },
				"100%": { width: 0, left: -8 },
			},
			ease: "inOutExpo",
			duration: 2000,
		});

		const containerAnimate = animate(containerRef.current, {
			keyframes: {
				"0%": { rotateZ: 30 },
				"100%": { rotateZ: 0 },
			},
			ease: "inOutExpo",
			duration: 2000,
		});

		const { chars } = splitText(textRef.current, { words: false, chars: true });

		const textAnimate = animate(chars, {
			keyframes: {
				"0%": { translateY: 10, opacity: 0 },
				"100%": { translateY: 0, opacity: 1 },
			},
			ease: "inOutExpo",
			duration: 2000,
			delay: stagger(50),
		});

		const containerAnimate2 = animate(containerRef.current, {
			keyframes: {
				"0%": { top: "50%", left: "50%" },
				"100%": { top: "0.65%", left: "0.85%" },
			},
			ease: "inOutExpo",
			duration: 2000,
		});

		const startAnimate2 = animate(startRef.current, {
			keyframes: {
				"0%": { fontSize: 48 },
				"100%": { fontSize: 16 },
			},
			ease: "inOutExpo",
			duration: 2000,
		});

		const textAnimate2 = animate(textRef.current, {
			keyframes: {
				"0%": { fontSize: 48 },
				"100%": { fontSize: 16 },
			},
			ease: "inOutExpo",
			duration: 2000,
		});

		tl.label("Start")
			.sync(startAnimate, 0)
			.sync(containerAnimate, 0)
			// .sync(textAnimate, 100)
			.sync(containerAnimate2, 1400)
			.sync(startAnimate2, 2400)
			.sync(textAnimate2, 2400);
	}, []);

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

export function Animated2Logo() {
	const startRef = useRef<HTMLDivElement>(null);
	const midRef = useRef<HTMLDivElement>(null);
	const tl = createTimeline({ defaults: { duration: 750 }, autoplay: false });

	useEffect(() => {
		if (!(startRef.current && midRef.current)) {
			return;
		}

		const startAnimate = animate(startRef.current, {
			keyframes: {
				"0%": { translateY: 100, rotateZ: 0 },
				"30%": { translateY: 0, ease: "outBounce", rotateZ: 20 },
				"100%": { translateY: 52, ease: "outBounce", rotateZ: 0 },
			},
			duration: 1800,
		});

		const midAnimate = animate(midRef.current, {
			keyframes: {
				"0%": { translateX: -75 },
				"100%": { translateX: 0, ease: "in" },
			},
			duration: 1800,
			delay: 1000,
		});

		tl.label("Start").sync(startAnimate).sync(midAnimate);
	}, []);

	return (
		<>
			<button
				className="absolute top-4 left-4 bg-red-400 px-5 py-4"
				onClick={() => {
					tl.restart();
				}}
			>
				play
			</button>

			<div className="flex w-24 flex-row items-end">
				<div
					className="shrink-0 overflow-hidden"
					style={{
						height: 100,
					}}
				>
					<div
						className="flex w-5 text-5xl"
						ref={startRef}
						style={{
							transform: "translateY(100px)",
						}}
					>
						1
					</div>
				</div>

				<div className="w-48 overflow-hidden">
					<div
						className="text-5xl"
						ref={midRef}
						style={{
							transform: "translateX(-75px)",
						}}
					>
						bye
					</div>
				</div>
			</div>
		</>
	);
}
