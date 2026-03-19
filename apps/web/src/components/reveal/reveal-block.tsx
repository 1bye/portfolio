import { type ReactNode, useLayoutEffect, useRef } from "react";
import { useReveal } from "./provider";

interface RevealBlockProps {
	children: ReactNode;
	className?: string;
	/** Duration of the fade (ms) */
	fadeDuration?: number;
	onDone?: () => void;

	onStart?: () => void;
}

export function RevealBlock({
	children,
	className = "",
	fadeDuration = 600,
	onStart,
	onDone,
}: RevealBlockProps) {
	const { phase, duration } = useReveal();
	const containerRef = useRef<HTMLDivElement>(null);
	const delayRef = useRef(0);
	const measuredRef = useRef(false);
	const hasStartedRef = useRef(false);

	useLayoutEffect(() => {
		if (!containerRef.current || measuredRef.current) {
			return;
		}

		const vh = window.innerHeight;
		const vw = window.innerWidth;

		const rect = containerRef.current.getBoundingClientRect();
		const ny = rect.top / vh;
		const nx = rect.left / vw;
		const diagonal = Math.max(0, ny * 0.7 + nx * 0.3);

		delayRef.current = diagonal * duration;
		measuredRef.current = true;
	}, [duration]);

	const isVisible = phase !== "waiting";

	// Detect start
	useLayoutEffect(() => {
		if (isVisible && !hasStartedRef.current) {
			hasStartedRef.current = true;

			const timeout = setTimeout(() => {
				onStart?.();
			}, delayRef.current);

			return () => clearTimeout(timeout);
		}
	}, [isVisible, onStart]);

	// Detect end via transitionend
	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!(el && onDone)) {
			return;
		}

		const handleEnd = (e: TransitionEvent) => {
			if (e.target === el && e.propertyName === "opacity") {
				onDone();
			}
		};

		el.addEventListener("transitionend", handleEnd);
		return () => el.removeEventListener("transitionend", handleEnd);
	}, [onDone]);

	return (
		<div
			className={className}
			ref={containerRef}
			style={{
				opacity: isVisible ? 1 : 0,
				transition: isVisible
					? `opacity ${fadeDuration}ms cubic-bezier(0.16,1,0.3,1) ${delayRef.current}ms`
					: "none",
			}}
		>
			{children}
		</div>
	);
}
