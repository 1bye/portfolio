import { Canvas } from "@react-three/fiber";
import { useLocation } from "@tanstack/react-router";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useTheme } from "../theme";

interface ShapeTransform {
	position: [number, number, number];
	scale: number;
}

interface CanvasPalette {
	background: string;
	cornerOpacity: number;
	shape: string;
	shapeOpacity: number;
}

const ROUTE_SHAPES: Record<string, ShapeTransform[]> = {
	"/": [
		{ position: [-5, 1, -2], scale: 0.6 },
		{ position: [3.5, -1, -3], scale: 0.5 },
		{ position: [2, 2.5, -4], scale: 0.45 },
		{ position: [-2.5, -2, -2.5], scale: 0.4 },
	],
	"/projects": [
		{ position: [-4.5, -2, -1.5], scale: 0.5 },
		{ position: [1, -2.5, -2], scale: 0.65 },
		{ position: [4, 1, -3], scale: 0.55 },
		{ position: [-1, 3, -4], scale: 0.35 },
	],
	"/crafts/list": [
		{ position: [4, 1.5, -2], scale: 0.55 },
		{ position: [-3, -2, -4], scale: 0.45 },
		{ position: [-1.5, 3, -2.5], scale: 0.5 },
		{ position: [2.5, -2, -1.5], scale: 0.5 },
	],
};

const CANVAS_PALETTES: Record<"dark" | "light", CanvasPalette> = {
	dark: {
		background: "#171717",
		cornerOpacity: 0.1,
		shape: "#f3f3f3",
		shapeOpacity: 0.28,
	},
	light: {
		background: "#ffffff",
		cornerOpacity: 0.14,
		shape: "#2f2f2f",
		shapeOpacity: 0.22,
	},
};

function getShapeConfig(route: string): ShapeTransform[] {
	return ROUTE_SHAPES[route] ?? ROUTE_SHAPES["/"];
}

function usePrefersReducedMotion() {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updatePreference = () => {
			setPrefersReducedMotion(mediaQuery.matches);
		};

		updatePreference();
		mediaQuery.addEventListener("change", updatePreference);
		return () => {
			mediaQuery.removeEventListener("change", updatePreference);
		};
	}, []);

	return prefersReducedMotion;
}

export function RootCanvas() {
	const pathname = useLocation({
		select: (location) => location.pathname,
	});
	const { resolvedTheme } = useTheme();
	const eventSource = useMemo(() => document.body, []);
	const isMobile = useIsMobile();
	const prefersReducedMotion = usePrefersReducedMotion();

	if (isMobile || prefersReducedMotion) {
		return null;
	}

	return (
		<div className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen overflow-hidden">
			<Canvas
				camera={{ position: [0, 0, 5] }}
				dpr={[1, 1.5]}
				eventSource={eventSource}
				frameloop="demand"
				gl={{
					alpha: false,
					antialias: false,
					powerPreference: "low-power",
				}}
			>
				<Scene palette={CANVAS_PALETTES[resolvedTheme]} route={pathname} />
			</Canvas>
		</div>
	);
}

function Scene({ route, palette }: { palette: CanvasPalette; route: string }) {
	return (
		<>
			<color args={[palette.background]} attach="background" />
			<CornerShapes palette={palette} />
			<RouteShapes config={getShapeConfig(route)} palette={palette} />
		</>
	);
}

function RouteShapes({
	config,
	palette,
}: {
	config: ShapeTransform[];
	palette: CanvasPalette;
}) {
	return (
		<>
			{config.map((shape, index) => (
				<StaticShape
					index={index}
					key={`${shape.position.join(":")}:${shape.scale}`}
					palette={palette}
					shape={shape}
				/>
			))}
		</>
	);
}

function StaticShape({
	shape,
	index,
	palette,
}: {
	index: number;
	palette: CanvasPalette;
	shape: ShapeTransform;
}) {
	const rotation = [index * 0.35, index * 0.52, index * 0.18] as [
		number,
		number,
		number,
	];

	return (
		<group position={shape.position} scale={shape.scale}>
			<mesh rotation={rotation}>
				<ShapeGeometry index={index} />
				<meshBasicMaterial
					color={palette.shape}
					opacity={palette.shapeOpacity}
					transparent
					wireframe
				/>
			</mesh>
		</group>
	);
}

function ShapeGeometry({ index }: { index: number }) {
	const geometries: ReactNode[] = [
		<torusKnotGeometry args={[0.5, 0.15, 96, 24]} key="torus-knot" />,
		<boxGeometry args={[1, 1, 1]} key="box" />,
		<icosahedronGeometry args={[0.5, 0]} key="icosahedron" />,
		<octahedronGeometry args={[0.5, 0]} key="octahedron" />,
	];

	return geometries[index] ?? null;
}

function CornerShapes({ palette }: { palette: CanvasPalette }) {
	return (
		<>
			<CornerShape
				palette={palette}
				position={[-6, 4, -6]}
				rotation={[0.2, 0.4, 0]}
			>
				<icosahedronGeometry args={[3, 1]} />
			</CornerShape>
			<CornerShape
				palette={palette}
				position={[6, 3.5, -7]}
				rotation={[0, 0.7, 0.3]}
			>
				<torusGeometry args={[2.5, 0.8, 16, 32]} />
			</CornerShape>
			<CornerShape
				palette={palette}
				position={[-5.5, -4, -5]}
				rotation={[0.4, 0, 0.2]}
			>
				<dodecahedronGeometry args={[2.8, 0]} />
			</CornerShape>
			<CornerShape
				palette={palette}
				position={[6.5, -3.5, -6]}
				rotation={[0.3, 0.2, 0.1]}
			>
				<octahedronGeometry args={[3, 0]} />
			</CornerShape>
		</>
	);
}

function CornerShape({
	children,
	palette,
	position,
	rotation,
}: {
	children: ReactNode;
	palette: CanvasPalette;
	position: [number, number, number];
	rotation: [number, number, number];
}) {
	return (
		<mesh position={position} rotation={rotation}>
			{children}
			<meshBasicMaterial
				color={palette.shape}
				opacity={palette.cornerOpacity}
				transparent
				wireframe
			/>
		</mesh>
	);
}
