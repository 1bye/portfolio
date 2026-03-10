import { useMouse } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";

export function ProfileBlock() {
	return (
		<div className="w-full border-border border-x">
			<div>
				<ProfileAvatar />
			</div>
		</div>
	);
}

export function ProfileAvatar() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [elementMouse, ref] = useMouse();

	const size = 120;

	const depth = 14;
	const cols = 8;
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

		ctx.strokeStyle = "#1c1c1c";
		ctx.lineWidth = 1;

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

			ctx.strokeRect(x, y, s, s);
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

		const outer = squares[0];

		// vertical grid
		for (let i = 0; i <= cols; i++) {
			const t = i / cols;
			const x = outer.x + outer.s * t;

			ctx.beginPath();
			ctx.moveTo(x, outer.y);
			ctx.lineTo(vx, vy);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(x, outer.y + outer.s);
			ctx.lineTo(vx, vy);
			ctx.stroke();
		}

		// horizontal grid
		for (let i = 0; i <= rows; i++) {
			const t = i / rows;
			const y = outer.y + outer.s * t;

			ctx.beginPath();
			ctx.moveTo(outer.x, y);
			ctx.lineTo(vx, vy);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(outer.x + outer.s, y);
			ctx.lineTo(vx, vy);
			ctx.stroke();
		}

		// draw avatar at tunnel end
		const end = squares[squares.length - 1];

		if (avatar.current?.complete) {
			ctx.drawImage(avatar.current, end.x, end.y, end.s, end.s);
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
