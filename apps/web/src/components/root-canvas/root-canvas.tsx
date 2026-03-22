import { Image } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { useLocation } from "@tanstack/react-router";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import { animate } from "animejs";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { OrderedDither } from "@/lib/r3f/effects/ordered-dither";
import { Canvas } from "@/lib/r3f/fiber";
import { FlameParticles } from "@/lib/r3f/particles/flame";
import { useTheme } from "../theme";

interface ShapeTransform {
	position: [number, number, number];
	scale: number;
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

const TRANSITION_DURATION = 1200;

function getShapeConfig(route: string): ShapeTransform[] {
	return ROUTE_SHAPES[route] ?? ROUTE_SHAPES["/"];
}

export function RootCanvas() {
	const pathname = useLocation({
		select: (location) => location.pathname,
	});
	const { theme } = useTheme();
	const eventSource = useMemo(() => document.body, []);
	const bgColor = theme === "dark" ? "#fff" : "#000";

	return (
		<div className="fixed top-0 left-0 h-screen w-screen">
			<Canvas camera={{ position: [0, 0, 5] }} eventSource={eventSource}>
				{/*<color args={[bgColor]} attach="background" />*/}
				<Scene route={pathname} />
			</Canvas>
		</div>
	);
}

export function Scene({ route }: { route: string }) {
	const { theme } = useTheme();
	const config = getShapeConfig(route);
	const isMobile = useIsMobile();

	return (
		<>
			{/*<ambientLight intensity={1} />*/}
			{/*<OrbitControls />*/}

			{/*Scenes*/}
			{/*<HeaderScene />*/}
			<ProfileScene />

			<CornerShapes />
			<RouteShapes config={config} />

			{!isMobile && (
				<FlameParticles
					color="#ff0000"
					lifetimeDecay={0.03}
					particleCount={30}
					size={0.1}
					spawnSpread={0.05}
					// texture={texture}
					velocityX={0.005}
					velocityY={0.01}
				/>
			)}

			{/*<axesHelper args={[2, 2, 2]} />*/}
			<EffectComposer>
				<OrderedDither ditherScale={3} invertDither={true} useColor={false} />
				{isMobile ? null : (
					<Fluid
						backgroundColor="#a7958b"
						blend={0}
						curl={10}
						densityDissipation={0.98}
						distortion={1}
						fluidColor="#cfc0a8"
						force={2}
						intensity={0.3}
						pressure={0.94}
						radius={0.03}
						rainbow={false}
						showBackground={true}
						swirl={5}
						velocityDissipation={0.99}
					/>
				)}
			</EffectComposer>
		</>
	);
}

function RouteShapes({ config }: { config: ShapeTransform[] }) {
	return (
		<>
			<AnimatedShape config={config[0]} rotationSpeed={[0.15, 0.1, 0.05]}>
				<torusKnotGeometry args={[0.5, 0.15, 128, 32]} />
			</AnimatedShape>
			<AnimatedShape config={config[1]} rotationSpeed={[0.1, 0.2, 0.08]}>
				<boxGeometry args={[1, 1, 1]} />
			</AnimatedShape>
			<AnimatedShape config={config[2]} rotationSpeed={[0.08, 0.12, 0.18]}>
				<icosahedronGeometry args={[0.5, 0]} />
			</AnimatedShape>
			<AnimatedShape config={config[3]} rotationSpeed={[0.12, 0.08, 0.15]}>
				<octahedronGeometry args={[0.5, 0]} />
			</AnimatedShape>
		</>
	);
}

function AnimatedShape({
	config,
	children,
	rotationSpeed = [0.1, 0.1, 0.1],
}: {
	config: ShapeTransform;
	children: React.ReactNode;
	rotationSpeed?: [number, number, number];
}) {
	const groupRef = useRef<Group>(null);
	const meshRef = useRef<Mesh>(null);
	const isFirst = useRef(true);

	useEffect(() => {
		if (!groupRef.current) {
			return;
		}

		if (isFirst.current) {
			isFirst.current = false;
			groupRef.current.position.set(...config.position);
			const s = config.scale;
			groupRef.current.scale.set(s, s, s);
			return;
		}

		const posAnim = animate(groupRef.current.position, {
			x: config.position[0],
			y: config.position[1],
			z: config.position[2],
			ease: "inOutExpo",
			duration: TRANSITION_DURATION,
		});

		const s = config.scale;
		const scaleAnim = animate(groupRef.current.scale, {
			x: s,
			y: s,
			z: s,
			ease: "inOutExpo",
			duration: TRANSITION_DURATION,
		});

		return () => {
			posAnim.pause();
			scaleAnim.pause();
		};
	}, [config]);

	useFrame((_, delta) => {
		if (!meshRef.current) {
			return;
		}
		meshRef.current.rotation.x += delta * rotationSpeed[0];
		meshRef.current.rotation.y += delta * rotationSpeed[1];
		meshRef.current.rotation.z += delta * rotationSpeed[2];
	});

	return (
		<group ref={groupRef}>
			<mesh ref={meshRef}>
				{children}
				<meshBasicMaterial
					color="#e8ddd0"
					opacity={0.6}
					transparent
					wireframe
				/>
			</mesh>
		</group>
	);
}

function CornerShapes() {
	const topLeft = useRef<Mesh>(null);
	const topRight = useRef<Mesh>(null);
	const bottomLeft = useRef<Mesh>(null);
	const bottomRight = useRef<Mesh>(null);

	useFrame((_, delta) => {
		if (topLeft.current) {
			topLeft.current.rotation.x += delta * 0.04;
			topLeft.current.rotation.y += delta * 0.06;
		}
		if (topRight.current) {
			topRight.current.rotation.y += delta * 0.05;
			topRight.current.rotation.z += delta * 0.03;
		}
		if (bottomLeft.current) {
			bottomLeft.current.rotation.x += delta * 0.03;
			bottomLeft.current.rotation.z += delta * 0.05;
		}
		if (bottomRight.current) {
			bottomRight.current.rotation.x += delta * 0.05;
			bottomRight.current.rotation.y += delta * 0.04;
		}
	});

	return (
		<>
			<mesh position={[-6, 4, -6]} ref={topLeft}>
				<icosahedronGeometry args={[3, 1]} />
				<meshBasicMaterial
					color="#d5cac0"
					opacity={0.15}
					transparent
					wireframe
				/>
			</mesh>
			<mesh position={[6, 3.5, -7]} ref={topRight}>
				<torusGeometry args={[2.5, 0.8, 16, 32]} />
				<meshBasicMaterial
					color="#d5cac0"
					opacity={0.12}
					transparent
					wireframe
				/>
			</mesh>
			<mesh position={[-5.5, -4, -5]} ref={bottomLeft}>
				<dodecahedronGeometry args={[2.8, 0]} />
				<meshBasicMaterial
					color="#d5cac0"
					opacity={0.13}
					transparent
					wireframe
				/>
			</mesh>
			<mesh position={[6.5, -3.5, -6]} ref={bottomRight}>
				<octahedronGeometry args={[3, 0]} />
				<meshBasicMaterial
					color="#d5cac0"
					opacity={0.14}
					transparent
					wireframe
				/>
			</mesh>
		</>
	);
}

function ProfileScene() {
	console.log(location);

	return (
		<Image
			position={[-4, 2.5, 0]}
			url={location.origin + "/portfolio-avatar-01.png"}
		/>
	);
}

function HeaderScene() {
	const { viewport } = useThree();

	return (
		<mesh position={[0, viewport.height / 2, -1]}>
			<planeGeometry args={[8, 1]} />
			<radialShaderMaterial uColor={"black"} uRadius={0.5} />
		</mesh>
	);
}
