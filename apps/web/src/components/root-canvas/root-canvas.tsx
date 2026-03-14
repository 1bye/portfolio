import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
// import { EffectComposer } from "@react-three/postprocessing";
import { useMemo } from "react";
// import { OrderedDither } from "@/lib/r3f/effects/ordered-dither";
import { FlameParticles } from "@/lib/r3f/particles/flame";

export function RootCanvas() {
	const eventSource = useMemo(() => document.body, [document]);

	return (
		<div className="fixed top-0 left-0 h-screen w-screen">
			<Canvas eventSource={eventSource} orthographic>
				<Scene />
			</Canvas>
		</div>
	);
}

export function Scene() {
	const { size } = useThree();

	return (
		<>
			<OrbitControls />
			<OrthographicCamera
				bottom={-size.height}
				far={1000}
				left={0}
				makeDefault
				near={-1000}
				position={[0, 0, 100]}
				right={size.width}
				top={0}
			/>

			<ambientLight intensity={1} />
			<group position={[0, 0, 0]} scale={[1, -1, 1]}>
				<mesh position={[100 / 2, 100 / 2, 0]}>
					<planeGeometry args={[100, 100]} />
					<meshBasicMaterial color="red" />
				</mesh>
			</group>

			<FlameParticles
				color="#00ffff"
				lifetimeDecay={0.03}
				particleCount={30}
				size={0.1}
				spawnSpread={0.05}
				velocityX={0.005}
				velocityY={0.01}
			/>
			<axesHelper args={[2, 2, 2]} />
			{/*<EffectComposer>
					<OrderedDither
						colorThreshold={16}
						ditherScale={2}
						lightThreshold={-0.8}
						useColor={true}
					/>
				</EffectComposer>*/}
		</>
	);
}
