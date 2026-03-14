import { useMouse } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";
import { ProfileWater } from "./profile-water";

export function ProfileBlock() {
	return (
		<div className="flex w-full flex-row border-border border-x">
			<div className="flex h-fit w-fit border-border border-r">
				<ProfileAvatar />
			</div>

			<div
				className="flex w-full"
				style={{
					height: 120,
				}}
			>
				<ProfileWater />
			</div>
		</div>
	);
}

export function ProfileAvatar() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [elementMouse, ref] = useMouse();

	const size = 120;

	const depth = 8;
	const cols = 7.7;
	const rows = 8;

	const center = size / 2;

	const vx = elementMouse.elementX ?? center;
	const vy = elementMouse.elementY ?? center;

	const avatar = useRef<HTMLImageElement | null>(null);

	// preload avatar
	useEffect(() => {
		const img = new Image();
		img.src = "portfolio-avatar-01.png";
		avatar.current = img;
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}

		ctx.clearRect(0, 0, size, size);

		const squares: { x: number; y: number; s: number }[] = [];

		// create perspective squares
		for (let i = 0; i < depth; i++) {
			const t = i / depth;

			const s = size * 0.85 ** i;

			const offsetX = (vx - center) * t;
			const offsetY = (vy - center) * t;

			const x = center - s / 2 + offsetX;
			const y = center - s / 2 + offsetY;

			squares.push({ x, y, s });
		}

		// draw avatar at tunnel end FIRST (so it appears behind)
		const end = squares[squares.length - 1];
		if (avatar.current?.complete) {
			ctx.drawImage(avatar.current, end.x, end.y, end.s, end.s);
		}

		ctx.strokeStyle = "#e5e5e5";
		ctx.lineWidth = 1;

		// draw perspective squares (skip first/outermost square)
		for (let i = 1; i < squares.length; i++) {
			const sq = squares[i];
			ctx.strokeRect(sq.x, sq.y, sq.s, sq.s);
		}

		// connect corners
		for (let i = 0; i < squares.length - 1; i++) {
			const a = squares[i];
			const b = squares[i + 1];

			const cornersA = [
				[a.x, a.y],
				[a.x + a.s, a.y],
				[a.x + a.s, a.y + a.s],
				[a.x, a.y + a.s],
			];

			const cornersB = [
				[b.x, b.y],
				[b.x + b.s, b.y],
				[b.x + b.s, b.y + b.s],
				[b.x, b.y + b.s],
			];

			for (let c = 0; c < 4; c++) {
				ctx.beginPath();
				ctx.moveTo(cornersA[c][0], cornersA[c][1]);
				ctx.lineTo(cornersB[c][0], cornersB[c][1]);
				ctx.stroke();
			}
		}

		// vertical grid - bend through perspective squares
		for (let i = 0; i <= cols; i++) {
			const t = i / cols;

			// top edge
			ctx.beginPath();
			for (let j = 0; j < squares.length; j++) {
				const sq = squares[j];
				const x = sq.x + sq.s * t;
				const y = sq.y;
				if (j === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();

			// bottom edge
			ctx.beginPath();
			for (let j = 0; j < squares.length; j++) {
				const sq = squares[j];
				const x = sq.x + sq.s * t;
				const y = sq.y + sq.s;
				if (j === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
		}

		// horizontal grid - bend through perspective squares
		for (let i = 0; i <= rows; i++) {
			const t = i / rows;

			// left edge
			ctx.beginPath();
			for (let j = 0; j < squares.length; j++) {
				const sq = squares[j];
				const x = sq.x;
				const y = sq.y + sq.s * t;
				if (j === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();

			// right edge
			ctx.beginPath();
			for (let j = 0; j < squares.length; j++) {
				const sq = squares[j];
				const x = sq.x + sq.s;
				const y = sq.y + sq.s * t;
				if (j === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
		}
	}, [vx, vy]);

	return (
		<div
			ref={ref}
			style={{
				width: size,
				height: size,
			}}
		>
			<canvas
				height={size}
				ref={canvasRef}
				style={{
					width: size,
					height: size,
				}}
				width={size}
			/>
		</div>
	);
}

// export function ProfileAvatar() {
// 	const size = 100;
// 	const depth = 12;

// 	const shadows = Array.from({ length: depth })
// 		.map((_, i) => {
// 			const spread = i * 8;
// 			const opacity = 1 - i / depth;
// 			return `0 0 0 ${spread}px rgba(120,120,255,${opacity})`;
// 		})
// 		.join(",");

// 	return (
// 		<div
// 			className="relative flex items-center justify-center"
// 			style={{
// 				width: size,
// 				height: size,
// 			}}
// 		>
// 			<div
// 				style={{
// 					width: size,
// 					height: size,
// 					boxShadow: shadows,
// 					transform: "perspective(800px)",
// 				}}
// 			/>

// 			<img
// 				alt="avatar"
// 				src="portfolio-avatar-01.png"
// 				style={{
// 					position: "absolute",
// 					width: size,
// 					height: size,
// 					transform: "translateZ(-400px)",
// 				}}
// 			/>
// 		</div>
// 	);
// }
