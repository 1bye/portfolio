import { Effect } from "postprocessing";
import { forwardRef, useMemo } from "react";
import { Uniform } from "three";

const fragmentShader = `
uniform float uDitherScale;

const mat4 bayer4x4 = mat4(
  0.,  8.,  2., 10.,
  12., 4., 14., 6.,
  3., 11., 1., 9.,
  15., 7., 13., 5.
) / 16.0;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // "6-bit RGB" = 2 bits per channel = 4 levels per channel.
  const float levels = 3.0;

  vec2 ditherCoord = floor((uv * resolution) / uDitherScale);
  float threshold = bayer4x4[int(mod(ditherCoord.y, 4.0))][int(mod(ditherCoord.x, 4.0))];

  vec3 quantized = floor(inputColor.rgb * levels + threshold) / levels;
  outputColor = vec4(clamp(quantized, 0.0, 1.0), inputColor.a);
}
`;

export interface ISixBitRgbDitherProps {
	ditherScale?: number;
}

export class SixBitRgbDitherEffect extends Effect {
	constructor({ ditherScale = 1 }: ISixBitRgbDitherProps = {}) {
		const uniforms = new Map<string, Uniform>([
			["uDitherScale", new Uniform(ditherScale)],
		]);

		super("SixBitRgbDither", fragmentShader, { uniforms });
	}
}

export const SixBitRgbDither = forwardRef<
	SixBitRgbDitherEffect,
	ISixBitRgbDitherProps
>(({ ditherScale = 1 }, ref) => {
	const effect = useMemo(
		() => new SixBitRgbDitherEffect({ ditherScale }),
		[ditherScale]
	);
	return <primitive dispose={null} object={effect} ref={ref} />;
});
