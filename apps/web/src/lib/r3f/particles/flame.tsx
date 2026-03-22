import { useFrame } from "@react-three/fiber";
import { useMouse } from "@uidotdev/usehooks";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface FlameParticlesProps {
	color?: string;
	lifetimeDecay?: number;
	opacity?: number;
	particleCount?: number;
	size?: number;
	spawnSpread?: number;
	texture?: THREE.Texture;
	velocityX?: number;
	velocityY?: number;
	velocityZ?: number;
}

export function FlameParticles({
	particleCount = 50,
	size = 0.08,
	color = "#ff6b35",
	opacity = 0.7,
	velocityX = 0.02,
	velocityY = 0.03,
	velocityZ = 0.02,
	spawnSpread = 0.1,
	lifetimeDecay = 0.01,
	texture,
}: FlameParticlesProps) {
	const particlesRef = useRef<THREE.Points>(null);
	const mousePos = useRef(new THREE.Vector3(0, 0, 0));
	const [mouse] = useMouse();

	const { positions, velocities, lifetimes } = useMemo(() => {
		const positions = new Float32Array(particleCount * 3);
		const velocities = new Float32Array(particleCount * 3);
		const lifetimes = new Float32Array(particleCount);

		for (let i = 0; i < particleCount; i++) {
			positions[i * 3] = 0;
			positions[i * 3 + 1] = 0;
			positions[i * 3 + 2] = 0;
			velocities[i * 3] = (Math.random() - 0.5) * velocityX;
			velocities[i * 3 + 1] = Math.random() * velocityY + velocityY * 0.67;
			velocities[i * 3 + 2] = (Math.random() - 0.5) * velocityZ;
			lifetimes[i] = Math.random();
		}

		return { positions, velocities, lifetimes };
	}, [particleCount, velocityX, velocityY, velocityZ]);

	useFrame((state) => {
		if (!(particlesRef.current && mouse.x && mouse.y)) {
			return;
		}

		// Convert page coordinates to viewport-relative NDC (-1 to 1)
		const x = ((mouse.x - window.scrollX) / window.innerWidth) * 2 - 1;
		const y = -((mouse.y - window.scrollY) / window.innerHeight) * 2 + 1;

		// Create a vector at the mouse position on the near plane
		const vector = new THREE.Vector3(x, y, 0.5);
		vector.unproject(state.camera);

		// Calculate direction from camera to mouse position
		const dir = vector.sub(state.camera.position).normalize();

		// Calculate distance to z=0 plane
		const distance = -state.camera.position.z / dir.z;

		// Get the intersection point at z=0
		mousePos.current
			.copy(state.camera.position)
			.add(dir.multiplyScalar(distance));

		const posArray = particlesRef.current.geometry.attributes.position
			.array as Float32Array;

		for (let i = 0; i < particleCount; i++) {
			const i3 = i * 3;

			lifetimes[i] -= lifetimeDecay;

			if (lifetimes[i] <= 0) {
				posArray[i3] = mousePos.current.x + (Math.random() - 0.5) * spawnSpread;
				posArray[i3 + 1] =
					mousePos.current.y + (Math.random() - 0.5) * spawnSpread;
				posArray[i3 + 2] = mousePos.current.z;
				velocities[i3] = (Math.random() - 0.5) * velocityX;
				velocities[i3 + 1] = Math.random() * velocityY + velocityY * 0.67;
				velocities[i3 + 2] = (Math.random() - 0.5) * velocityZ;
				lifetimes[i] = 1;
			} else {
				posArray[i3] += velocities[i3];
				posArray[i3 + 1] += velocities[i3 + 1];
				posArray[i3 + 2] += velocities[i3 + 2];
			}
		}

		particlesRef.current.geometry.attributes.position.needsUpdate = true;
	});

	const geometry = useMemo(() => {
		const geo = new THREE.BufferGeometry();
		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		return geo;
	}, [positions]);

	return (
		<points geometry={geometry} ref={particlesRef}>
			<pointsMaterial
				blending={THREE.AdditiveBlending}
				color={color}
				depthWrite={false}
				map={texture}
				opacity={opacity}
				size={size}
				transparent
			/>
		</points>
	);
}
