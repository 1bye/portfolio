import { useLayoutEffect, useMemo, useRef } from "react";
import { useReveal } from "./provider";

type SplitType = "words" | "chars";

interface RevealTextProps {
	children: string;
	className?: string;
	/** Duration of each element's individual fade (ms) */
	fadeDuration?: number;
	split?: SplitType;
}

export function RevealText({
	children,
	className = "",
	split = "words",
	fadeDuration = 600,
}: RevealTextProps) {
	const { phase, duration, registerMaxDelay } = useReveal();
	const containerRef = useRef<HTMLSpanElement>(null);
	const delaysRef = useRef<number[]>([]);
	const measuredRef = useRef(false);

	const elements = useMemo(() => {
		if (split === "chars") {
			return children.split("").map((char, i) => ({
				content: char === " " ? "\u00A0" : char,
				key: `c-${i}`,
			}));
		}
		return children.split(" ").map((word, i) => ({
			content: word,
			key: `w-${i}`,
		}));
	}, [children, split]);

	useLayoutEffect(() => {
		if (!containerRef.current || measuredRef.current) {
			return;
		}

		const spans =
			containerRef.current.querySelectorAll<HTMLSpanElement>("[data-reveal]");
		if (spans.length === 0) {
			return;
		}

		const vh = window.innerHeight;
		const vw = window.innerWidth;

		delaysRef.current = Array.from(spans).map((span) => {
			const rect = span.getBoundingClientRect();
			const ny = rect.top / vh;
			const nx = rect.left / vw;
			// Weight Y 70 %, X 30 % → top-left to bottom-right diagonal
			const diagonal = Math.max(0, ny * 0.7 + nx * 0.3);
			return diagonal * duration;
		});

		const maxDelay = Math.max(...delaysRef.current, 0);
		registerMaxDelay(maxDelay);

		measuredRef.current = true;
	}, [elements, duration, registerMaxDelay]);

	const isVisible = phase === "revealing" || phase === "revealed";
	const isLeaving = phase === "leaving";

	return (
		<span
			aria-label={children}
			className={className}
			ref={containerRef}
			style={{ display: "inline-block", wordBreak: "break-word" }}
		>
			{elements.map((el, i) => (
				<span
					data-reveal=""
					key={el.key}
					style={{
						display: split === "words" ? "inline-block" : "inline",
						marginRight: split === "words" ? "0.25em" : undefined,
						opacity: isLeaving ? 0 : isVisible ? 1 : 0,
						transition: isLeaving
							? `opacity ${fadeDuration}ms cubic-bezier(0.16,1,0.3,1) ${delaysRef.current[i] ?? 0}ms`
							: isVisible
								? `opacity ${fadeDuration}ms cubic-bezier(0.16,1,0.3,1) ${delaysRef.current[i] ?? 0}ms`
								: "none",
					}}
				>
					{el.content}
				</span>
			))}
		</span>
	);
}
