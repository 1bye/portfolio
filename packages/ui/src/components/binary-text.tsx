"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

export interface BinaryTextProps {
	animatingClassName?: string;
	children: React.ReactNode;
	className?: string;
	play?: boolean;
	scrambleSpeed?: number;
	speed?: number;
	startDelay?: number;
	wordDelayMultiplier?: number;
}

const CHARS = "01@$#%&*<>";

function rand() {
	return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function Word({
	word,
	startDelay,
	play,
	speed,
	scrambleSpeed,
	className,
	animatingClassName,
}: {
	word: string;
	startDelay: number;
	play: boolean;
	speed: number;
	scrambleSpeed: number;
	className?: string;
	animatingClassName?: string;
}) {
	const [visible, setVisible] = useState(false);
	const [display, setDisplay] = useState("");
	const [isAnimating, setIsAnimating] = useState(false);
	const indexRef = useRef(0);

	useEffect(() => {
		let scrambleTimer: NodeJS.Timeout;
		let stepTimer: NodeJS.Timeout;
		let delayTimer: NodeJS.Timeout;

		const runForward = () => {
			delayTimer = setTimeout(() => {
				setVisible(true);
				setIsAnimating(true);

				scrambleTimer = setInterval(() => {
					const revealed = word.slice(0, indexRef.current);
					const scrambled = Array.from(
						{ length: word.length - indexRef.current },
						rand
					).join("");

					setDisplay(revealed + scrambled);
				}, scrambleSpeed);

				stepTimer = setInterval(() => {
					indexRef.current++;

					if (indexRef.current > word.length) {
						clearInterval(stepTimer);
						clearInterval(scrambleTimer);
						setDisplay(word);
						setIsAnimating(false);
					}
				}, speed * 1000);
			}, startDelay * 1000);
		};

		const runReverse = () => {
			if (!visible) {
				return;
			}

			setIsAnimating(true);

			scrambleTimer = setInterval(() => {
				const revealed = word.slice(0, indexRef.current);
				const scrambled = Array.from(
					{ length: word.length - indexRef.current },
					rand
				).join("");

				setDisplay(revealed + scrambled);
			}, scrambleSpeed);

			stepTimer = setInterval(() => {
				indexRef.current--;

				if (indexRef.current <= 0) {
					indexRef.current = 0;
					clearInterval(stepTimer);
					clearInterval(scrambleTimer);
					setIsAnimating(false);
					setVisible(false);
				}
			}, speed * 1000);
		};

		if (play) {
			runForward();
		} else {
			runReverse();
		}

		return () => {
			clearTimeout(delayTimer);
			clearInterval(scrambleTimer);
			clearInterval(stepTimer);
		};
	}, [play, startDelay, word, speed, scrambleSpeed]);

	if (!visible) {
		return null;
	}

	return (
		<span
			className={cn(
				"mr-[0.25em] inline-flex",
				className,
				isAnimating && animatingClassName
			)}
		>
			{display}
		</span>
	);
}

export function BinaryText({
	children,
	className,
	play = false,
	speed = 0.08,
	scrambleSpeed = 40,
	startDelay = 0,
	wordDelayMultiplier = 0.5,
	animatingClassName,
}: BinaryTextProps) {
	const text = React.Children.toArray(children)
		.filter((child) => typeof child === "string")
		.join("");

	const words = text.split(" ").filter((w) => w.length > 0);

	const wordDurations = words.map((w) => w.length * speed);

	let accumulated = startDelay;

	return (
		<div className="flex flex-wrap">
			{words.map((word, i) => {
				const delay = accumulated;
				accumulated += wordDurations[i] * wordDelayMultiplier;

				return (
					<Word
						animatingClassName={animatingClassName}
						className={className}
						key={i}
						play={play}
						scrambleSpeed={scrambleSpeed}
						speed={speed}
						startDelay={delay}
						word={word}
					/>
				);
			})}
		</div>
	);
}
