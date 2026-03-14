import { useFrame, useThree } from "@react-three/fiber";
import type { IUniform } from "three";
import {
	Color,
	MeshPhysicalMaterial,
	ShaderLib,
	UniformsUtils,
	Vector2,
} from "three";
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla";
import type { Variable } from "three-stdlib";
import { GPUComputationRenderer } from "three-stdlib";
import { heightmapFragmentShader, waterVertexShader } from "../shaders/water";

// Texture width for simulation
const WIDTH = 256;
// Water size in system units
const BOUNDS = 1024;

let waterUniforms: Record<string, IUniform>;
let heightmapVariable: Variable;
let gpuCompute: GPUComputationRenderer;

export function WaterPlane() {
	const waterMaterial = new CustomShaderMaterialImpl({
		baseMaterial: MeshPhysicalMaterial,
		vertexShader: waterVertexShader,
		uniforms: UniformsUtils.merge([
			ShaderLib.physical.uniforms,
			{ heightmap: { value: null } },
		]),
	});

	// Material attributes
	const mat = waterMaterial as unknown as MeshPhysicalMaterial;
	mat.metalness = 0.9;
	mat.roughness = 0.12;
	mat.envMapIntensity = 2.0;
	mat.color = new Color(0x44_99_bb);

	// Defines
	waterMaterial.defines = waterMaterial.defines ?? {};
	waterMaterial.defines.WIDTH = WIDTH.toFixed(1);
	waterMaterial.defines.BOUNDS = BOUNDS.toFixed(1);

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
	heightmapVariable.material.uniforms.mousePos = {
		value: new Vector2(10_000, 10_000),
	};
	heightmapVariable.material.uniforms.mouseSize = { value: 40.0 };
	heightmapVariable.material.uniforms.viscosityConstant = { value: 0.98 };
	heightmapVariable.material.uniforms.heightCompensation = { value: 0 };
	heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed(1);

	const error = gpuCompute.init();
	if (error !== null) {
		console.error(error);
	}

	const pointer = useThree((state) => state.pointer);

	useFrame(() => {
		const uniforms = heightmapVariable.material.uniforms;
		uniforms.mousePos.value.set(pointer.x * 400, -pointer.y * 400);
		gpuCompute.compute();
		waterUniforms.heightmap.value =
			gpuCompute.getCurrentRenderTarget(heightmapVariable).texture;
	});

	return (
		<mesh
			castShadow
			material={waterMaterial}
			position={[0, 0, 0]}
			receiveShadow
			rotation={[-Math.PI / 2, 0, 0]}
			scale={2}
		>
			<planeGeometry args={[BOUNDS, BOUNDS, WIDTH, WIDTH]} />
		</mesh>
	);
}
