"use client";

import { cn } from "@portfolio/ui/lib/utils";
import { motion, type Transition, useAnimation } from "motion/react";
import React, { useEffect } from "react";

interface WordsStaggerProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	onComplete?: () => void;
	onStart?: () => void;
	play?: boolean;
	speed?: number;
	stagger?: number;
}

export function WordsStagger({
	children,
	className,
	delay = 0,
	stagger = 0.1,
	speed = 0.5,
	play = false,
	onStart,
	onComplete,
}: WordsStaggerProps) {
	const controls = useAnimation();

	const text = React.Children.toArray(children)
		.filter((child) => typeof child === "string")
		.join("");

	const words = text.split(" ").filter((word) => word.length > 0);

	const transition: Transition = {
		type: "tween",
		ease: "easeOut",
		duration: speed,
	};

	const containerVariants = {
		hidden: {
			transition: {
				staggerChildren: stagger,
				staggerDirection: -1,
			},
		},
		visible: {
			transition: {
				delayChildren: delay,
				staggerChildren: stagger,
				staggerDirection: 1,
			},
		},
	};

	const wordVariants = {
		hidden: {
			opacity: 0,
			y: 10,
			filter: "blur(10px)",
			transition,
		},
		visible: {
			opacity: 1,
			y: 0,
			filter: "blur(0px)",
			transition,
		},
	};

	useEffect(() => {
		if (play) {
			controls.start("visible");
		} else {
			controls.start("hidden");
		}
	}, [play, controls]);

	return (
		<motion.div
			animate={controls}
			className={cn("flex flex-wrap", className)}
			initial="hidden"
			onAnimationComplete={onComplete}
			onAnimationStart={onStart}
			variants={containerVariants}
		>
			{words.map((word, index) => (
				<motion.span
					className="inline-block"
					key={`${word}-${index}`}
					variants={wordVariants}
				>
					{word}
					{index < words.length - 1 && (
						<span className="inline-block">&nbsp;</span>
					)}
				</motion.span>
			))}
		</motion.div>
	);
}
