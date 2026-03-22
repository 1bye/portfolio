"use client";

import { cn } from "@portfolio/ui/lib/utils";
import { createAnimatable } from "animejs";
import type * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface SliderProps {
	className?: string;
	label: string;
	max?: number;
	min?: number;
	onChange?: (value: number) => void;
	step?: number;
	value: number;
}

function Slider({
	className,
	label,
	max = 100,
	min = 0,
	onChange,
	step = 1,
	value,
}: SliderProps) {
	const range = max - min;
	const percent = range === 0 ? 0 : (value - min) / range;

	const trackRef = useRef<HTMLDivElement>(null);
	const fillRef = useRef<HTMLDivElement>(null);
	const indicatorRef = useRef<HTMLDivElement>(null);

	const fillAnimRef = useRef<any>(null);
	const indicatorAnimRef = useRef<any>(null);

	const [width, setWidth] = useState(0);

	// Measure slider width
	useEffect(() => {
		if (trackRef.current) {
			setWidth(trackRef.current.getBoundingClientRect().width);
		}
	}, []);

	// Create animatables once
	useEffect(() => {
		if (!fillAnimRef.current && fillRef.current) {
			fillAnimRef.current = createAnimatable(fillRef.current, {
				scaleX: 300,
				ease: "out(3)",
			});
		}

		if (!indicatorAnimRef.current && indicatorRef.current) {
			indicatorAnimRef.current = createAnimatable(indicatorRef.current, {
				x: 300,
				ease: "out(3)",
			});
		}
	}, []);

	// Animate on value change
	useEffect(() => {
		fillAnimRef.current?.scaleX(percent);

		const _x = percent * width;
		const x = Math.max(10, _x - 17);

		indicatorAnimRef.current?.x(x);
	}, [percent, width]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(Number(e.target.value));
		},
		[onChange]
	);

	return (
		<div className={cn("relative select-none", className)}>
			<div
				className="relative h-11 overflow-hidden rounded-2xl bg-black/[0.04]"
				ref={trackRef}
			>
				<div
					className="absolute inset-y-0 left-0 w-full origin-left rounded-3xl bg-black/[0.06]"
					ref={fillRef}
					style={{ transform: "scaleX(0)" }}
				/>
				<div
					className="pointer-events-none absolute inset-y-3 h-5 w-0.5 rounded-full bg-black/30"
					ref={indicatorRef}
					style={{ transform: "translateX(0px)" }}
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
					<span className="font-medium text-[13px] text-black/70">{label}</span>
					<span className="font-medium text-[12px] text-black/40 tabular-nums">
						{value}
					</span>
				</div>
				<input
					className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					max={max}
					min={min}
					onChange={handleChange}
					step={step}
					type="range"
					value={value}
				/>
			</div>
		</div>
	);
}

export { Slider };
export type { SliderProps };
