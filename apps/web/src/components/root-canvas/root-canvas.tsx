import { Image } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { useMemo } from "react";
import { OrderedDither } from "@/lib/r3f/effects/ordered-dither";
import { Canvas } from "@/lib/r3f/fiber";
import { FlameParticles } from "@/lib/r3f/particles/flame";

export function RootCanvas() {
	const eventSource = useMemo(() => document.body, []);

	return (
		<div className="fixed top-0 left-0 h-screen w-screen">
			<Canvas camera={{ position: [0, 0, 5] }} eventSource={eventSource}>
				<Scene />
			</Canvas>
		</div>
	);
}

export function Scene() {
	// const texture = useMemo(
	// 	() => new TextureLoader().load("./portfolio-avatar-01.png"),
	// 	[]
	// );

	return (
		<>
			{/*<ambientLight intensity={1} />*/}
			{/*<OrbitControls />*/}

			{/*Scenes*/}
			{/*<HeaderScene />*/}
			<ProfileScene />

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
			{/*<axesHelper args={[2, 2, 2]} />*/}
			<EffectComposer>
				<OrderedDither ditherScale={3} invertDither={true} useColor={false} />
				{/*<SixBitRgbDither ditherScale={2} />*/}
			</EffectComposer>
		</>
	);
}

function ProfileScene() {
	return <Image position={[-4, 2.5, 0]} url="./portfolio-avatar-01.png" />;
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
