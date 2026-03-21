"use client";

import { cn } from "@portfolio/ui/lib/utils";
import { createAnimatable } from "animejs";
import type * as React from "react";
import { useCallback, useEffect, useRef } from "react";

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
	const percent = range === 0 ? 0 : ((value - min) / range) * 100;

	const fillRef = useRef<HTMLDivElement>(null);
	const indicatorRef = useRef<HTMLDivElement>(null);
	const fillAnimRef = useRef<Record<string, (v: unknown) => void> | null>(null);
	const indicatorAnimRef = useRef<Record<string, (v: unknown) => void> | null>(
		null
	);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			if (fillRef.current) {
				fillAnimRef.current = createAnimatable(fillRef.current, {
					width: 300,
					ease: "out(3)",
				});
			}
			if (indicatorRef.current) {
				indicatorAnimRef.current = createAnimatable(indicatorRef.current, {
					left: 300,
					ease: "out(3)",
				});
			}
		}
		fillAnimRef.current?.width?.(`${percent}%`);
		indicatorAnimRef.current?.left?.(`calc(${percent}% - 0.5px)`);
	}, [percent]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(Number(e.target.value));
		},
		[onChange]
	);

	return (
		<div className={cn("relative select-none", className)} data-slot="slider">
			<div className="relative h-11 overflow-hidden rounded-2xl bg-black/[0.04]">
				<div
					className="absolute inset-y-0 left-0 rounded-2xl bg-black/[0.06] transition-none"
					ref={fillRef}
					style={{ width: `${percent}%` }}
				/>
				<div
					className="pointer-events-none absolute inset-y-2.5 w-px rounded-full bg-black/60"
					ref={indicatorRef}
					style={{ left: `calc(${percent}% - 0.5px)` }}
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
