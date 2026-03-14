import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
// import { WaterPlane } from "@/lib/r3f/components/water";
import Water from "@/lib/r3f/components/waterr";
import { OrderedDither } from "@/lib/r3f/effects/ordered-dither";

export function ProfileWater() {
	return (
		<Canvas camera={{ position: [0, 360, 20], fov: 30 }}>
			<color args={["#e5e5e5"]} attach="background" />
			<Water />
			<Environment
				background={false}
				environmentIntensity={20}
				preset="sunset"
			/>
			<directionalLight intensity={1.5} position={[10, 20, 10]} />
			<ambientLight intensity={0.1} />

			<EffectComposer>
				<OrderedDither
					colorThreshold={4}
					ditherScale={2}
					invertDither={false}
					matrixSize={4}
					useColor={false}
				/>
			</EffectComposer>
		</Canvas>
	);
}
