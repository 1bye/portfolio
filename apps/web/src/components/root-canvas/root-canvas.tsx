import { Image } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";
import { useMemo } from "react";
import { OrderedDither } from "@/lib/r3f/effects/ordered-dither";
import { Canvas } from "@/lib/r3f/fiber";
import { FlameParticles } from "@/lib/r3f/particles/flame";
import { useTheme } from "../theme";

export function RootCanvas() {
	const { theme } = useTheme();
	const eventSource = useMemo(() => document.body, []);
	const bgColor = theme === "dark" ? "#fff" : "#000";

	return (
		<div className="fixed top-0 left-0 h-screen w-screen">
			<Canvas camera={{ position: [0, 0, 5] }} eventSource={eventSource}>
				{/*<color args={[bgColor]} attach="background" />*/}
				<Scene />
			</Canvas>
		</div>
	);
}

export function Scene() {
	const { theme } = useTheme();
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
