import { useFrame, useThree } from "@react-three/fiber";
import {
	Color,
	MeshPhysicalMaterial,
	ShaderLib,
	UniformsUtils,
	Vector2,
} from "three";
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla";
import { GPUComputationRenderer } from "three-stdlib";
import { heightmapFragmentShader, waterVertexShader } from "../shaders/water";

// Texture width for simulation
const WIDTH = 128;
// Water size in system units
const BOUNDS_X = 2048 + 512 + 64;
const BOUNDS_Y = 512;
let waterUniforms;
let heightmapVariable;
let gpuCompute;

export default function Water() {
	const waterMaterial = new CustomShaderMaterialImpl({
		baseMaterial: MeshPhysicalMaterial,
		vertexShader: waterVertexShader,
		uniforms: UniformsUtils.merge([
			ShaderLib["physical"].uniforms,
			{ heightmap: { value: null } },
		]),
	});

	// Material attributes
	waterMaterial.transmission = 1;
	waterMaterial.metalness = 0;
	waterMaterial.roughness = 0;
	waterMaterial.color = new Color(0x21_7d_9c);

	// Defines
	waterMaterial.defines.WIDTH = WIDTH.toFixed(1);
	waterMaterial.defines.BOUNDS_X = BOUNDS_X.toFixed(1);
	waterMaterial.defines.BOUNDS_Y = BOUNDS_Y.toFixed(1);

	waterUniforms = waterMaterial.uniforms;

	const gl = useThree((state) => state.gl);
	gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, gl);

	const heightmap0 = gpuCompute.createTexture();
	heightmapVariable = gpuCompute.addVariable(
		"heightmap",
		heightmapFragmentShader,
		heightmap0
	);
	gpuCompute.setVariableDependencies(heightmapVariable, [heightmapVariable]);
	heightmapVariable.material.uniforms["mousePos"] = {
		value: new Vector2(10_000, 10_000),
	};
	heightmapVariable.material.uniforms["mouseSize"] = { value: 20.0 };
	heightmapVariable.material.uniforms["viscosityConstant"] = { value: 0.98 };
	heightmapVariable.material.uniforms["heightCompensation"] = { value: 0 };
	heightmapVariable.material.defines.BOUNDS_X = BOUNDS_X.toFixed(1);
	heightmapVariable.material.defines.BOUNDS_Y = BOUNDS_Y.toFixed(1);

	const error = gpuCompute.init();
	if (error !== null) {
		console.error(error);
	}

	const pointer = useThree((state) => state.pointer);

	useFrame(() => {
		const uniforms = heightmapVariable.material.uniforms;
		uniforms["mousePos"].value.set(pointer.x * 200, -pointer.y * 200);
		gpuCompute.compute();
		waterUniforms["heightmap"].value =
			gpuCompute.getCurrentRenderTarget(heightmapVariable).texture;
	});

	return (
		<mesh
			castShadow
			material={waterMaterial}
			position={[0, 0, 0]}
			receiveShadow
			rotation={[-Math.PI / 2, 0, 0]}
			scale={0.4}
		>
			<planeGeometry args={[BOUNDS_X, BOUNDS_Y, WIDTH, WIDTH]} />
		</mesh>
	);
}
