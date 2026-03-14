import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";

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

export { RadialShaderMaterial };
