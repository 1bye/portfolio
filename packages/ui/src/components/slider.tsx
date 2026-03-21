"use client";

import { cn } from "@portfolio/ui/lib/utils";
import type * as React from "react";
import { useCallback } from "react";

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

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(Number(e.target.value));
		},
		[onChange]
	);

	return (
		<div className={cn("relative select-none", className)} data-slot="slider">
			<div
				className="relative h-11 overflow-hidden rounded-2xl"
				style={{ background: "rgba(255, 255, 255, 0.07)" }}
			>
				<div
					className="absolute inset-y-0 left-0 rounded-2xl transition-none"
					style={{
						width: `${percent}%`,
						background: "rgba(255, 255, 255, 0.13)",
					}}
				/>
				<div
					className="pointer-events-none absolute inset-y-2.5 w-px rounded-full"
					style={{
						left: `calc(${percent}% - 0.5px)`,
						background: "rgba(255, 255, 255, 0.9)",
					}}
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
					<span className="font-medium text-[13px] text-white/80">{label}</span>
					<span className="font-medium text-[12px] text-white/45 tabular-nums">
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
