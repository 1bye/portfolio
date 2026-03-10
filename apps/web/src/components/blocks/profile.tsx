import { useMouse } from "@uidotdev/usehooks";

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
	const [elementMouse, ref] = useMouse();

	const blockSize = 100;
	const imageSize = blockSize;

	const totalDepth = 12;

	const maxImageDepth = 11;
	const minImageDepth = 1;

	const center = blockSize / 2;

	const x = elementMouse.elementX ?? center;
	const y = elementMouse.elementY ?? center;

	// Perspective origin (mouse controlled)
	const originX = (x / blockSize) * 100;
	const originY = (y / blockSize) * 100;

	// Distance from center
	const dx = x - center;
	const dy = y - center;
	const distance = Math.sqrt(dx * dx + dy * dy);

	const maxDistance = Math.sqrt(center * center + center * center);

	// Invert so closer = bigger depth
	const t = Math.min(distance / maxDistance, 1);

	const imageDepth = minImageDepth + (maxImageDepth - minImageDepth) * t;

	return (
		<div
			className="relative flex items-center justify-center overflow-hidden"
			ref={ref}
			style={{
				width: blockSize,
				height: blockSize,
			}}
		>
			<div
				style={{
					transformStyle: "preserve-3d",
					perspective: 950,
					perspectiveOrigin: `${Math.min(Math.max(originX, 10), 90)}% ${Math.min(Math.max(originY, 10), 90)}%`,
					width: blockSize,
					height: blockSize,
				}}
			>
				{Array.from({ length: totalDepth }).map((_, i) => (
					<TunnelLayer key={i} size={blockSize} z={-i * 100} />
				))}

				<img
					alt="Portfolio Avatar 01"
					src="portfolio-avatar-01.png"
					style={{
						width: imageSize,
						height: imageSize,
						transform: `translateZ(${-(imageDepth * 100)}px)`,
						position: "absolute",
					}}
				/>
			</div>
		</div>
	);
}

function TunnelLayer({ z, size }: { z: number; size: number }) {
	const thickness = size;

	return (
		<div
			className="absolute"
			style={{
				width: size,
				height: size,
				transform: `translateZ(${z}px)`,
				transformStyle: "preserve-3d",
			}}
		>
			{/* top */}
			<div
				className="absolute top-0 -left-px w-[calc(100%+1rem)]"
				style={{
					height: thickness,
					background: "#60a5fa",
					transformOrigin: "top",
					transform: "rotateX(92deg)",
				}}
			/>

			{/* bottom */}
			<div
				className="absolute bottom-0 -left-1 w-[calc(100%+1rem)]"
				style={{
					height: thickness,
					background: "#f87171",
					transformOrigin: "bottom",
					transform: "rotateX(-92deg)",
				}}
			/>

			{/* left */}
			<div
				className="absolute -top-1 left-0 h-[calc(100%+1rem)]"
				style={{
					width: thickness,
					background: "#34d399",
					transformOrigin: "left",
					transform: "rotateY(-92deg)",
				}}
			/>

			{/* right */}
			<div
				className="absolute -top-1 right-0 h-[calc(100%+1rem)]"
				style={{
					width: thickness,
					background: "#facc15",
					transformOrigin: "right",
					transform: "rotateY(92deg)",
				}}
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
