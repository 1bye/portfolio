import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { useMemo } from "react";
import { Color } from "three";
import { OrderedDither } from "@/lib/r3f/effects/ordered-dither";
import { FlameParticles } from "@/lib/r3f/particles/flame";

const RadialShaderMaterial = shaderMaterial(
	{
		uColor: new Color("red"),
		uTransparentColor: new Color("transparent"),
		uRadius: 0.5, // gradient spread
		uRotation: 0.0, // rotation in radians
	},
	// Vertex Shader
	`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.5);
    }
  `,
	// Fragment Shader
	`
    uniform vec3 uColor;
    uniform vec3 uTransparentColor;
    uniform float uRadius;
    uniform float uRotation;
    varying vec2 vUv;

    void main() {
      // Translate UV so origin is at top center
      vec2 uv = vUv - vec2(0.5, 1.0);

      // Apply rotation
      float cosR = cos(uRotation);
      float sinR = sin(uRotation);
      vec2 rotatedUV = vec2(
        uv.x * cosR - uv.y * sinR,
        uv.x * sinR + uv.y * cosR
      );

      // Compute distance from rotated origin
      float d = length(rotatedUV);

      // Smooth radial fade
      float alpha = 1.0 - smoothstep(0.0, uRadius, d);
      vec3 color = mix(uColor, uTransparentColor, alpha);
      gl_FragColor = vec4(color, alpha);
    }
  `
);

// 2️⃣ Register the material
extend({ RadialShaderMaterial });

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
	const { size } = useThree();

	return (
		<>
			{/*<OrbitControls />*/}
			{/*<OrthographicCamera
				bottom={-size.height}
				far={1000}
				left={0}
				makeDefault
				near={-1000}
				position={[0, 0, 100]}
				right={size.width}
				top={0}
			/>*/}

			<ambientLight intensity={1} />
			{/*<group position={[0, 0, 0]} scale={[1, -1, 1]}>
				<HeaderScene />
			</group>*/}
			<HeaderScene />

			<FlameParticles
				color="#00ffff"
				lifetimeDecay={0.03}
				particleCount={30}
				size={0.1}
				spawnSpread={0.05}
				velocityX={0.005}
				velocityY={0.01}
			/>
			{/*<axesHelper args={[2, 2, 2]} />*/}
			<EffectComposer>
				<OrderedDither colorThreshold={512} ditherScale={2} useColor={true} />
			</EffectComposer>
		</>
	);
}

function HeaderScene() {
	const { viewport } = useThree();

	return (
		<mesh position={[0, viewport.height / 2 - 0.3, 0]}>
			<planeGeometry args={[6, 1]} />
			<radialShaderMaterial uColor={"black"} uRadius={0.9} />
		</mesh>
	);
}
