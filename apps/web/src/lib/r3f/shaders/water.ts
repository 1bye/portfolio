export const waterVertexShader = `
  uniform sampler2D heightmap;

  void main() {

      vec2 cellSize = vec2(1.0 / WIDTH, 1.0 / WIDTH);

      float heightValue = texture2D(heightmap, uv).x;

      csm_Position.z += heightValue * 50.0;

      float left  = texture2D(heightmap, uv + vec2(-cellSize.x, 0.0)).x;
      float right = texture2D(heightmap, uv + vec2( cellSize.x, 0.0)).x;
      float down  = texture2D(heightmap, uv + vec2(0.0, -cellSize.y)).x;
      float up    = texture2D(heightmap, uv + vec2(0.0,  cellSize.y)).x;

      float dx = (left - right) * WIDTH / BOUNDS_X;
      float dy = (down - up) * WIDTH / BOUNDS_Y;

      csm_Normal = normalize(vec3(dx, dy, 1.0));
  }
`;

export const heightmapFragmentShader = `
	#include <common>

	uniform vec2 mousePos;
	uniform float mouseSize;
	uniform float viscosityConstant;
	uniform float heightCompensation;

	void main()	{
		vec2 cellSize = 1.0 / resolution.xy;
		vec2 uv = gl_FragCoord.xy * cellSize;

		vec4 heightmapValue = texture2D( heightmap, uv );

		// Get neighbours
		vec4 north = texture2D( heightmap, uv + vec2( 0.0, cellSize.y ) );
		vec4 south = texture2D( heightmap, uv + vec2( 0.0, - cellSize.y ) );
		vec4 east = texture2D( heightmap, uv + vec2( cellSize.x, 0.0 ) );
		vec4 west = texture2D( heightmap, uv + vec2( - cellSize.x, 0.0 ) );

		float newHeight = ( ( north.x + south.x + east.x + west.x ) * 0.5 - heightmapValue.y ) * viscosityConstant;

		// Mouse influence
		vec2 worldPos = (uv - vec2(0.5)) * vec2(BOUNDS_X, BOUNDS_Y);

    float mousePhase = clamp(
        length(worldPos - vec2(mousePos.x, -mousePos.y))
        * PI / mouseSize,
        0.0,
        PI
    );
		newHeight += ( cos( mousePhase ) + 1.0 ) * 0.28;

		heightmapValue.y = heightmapValue.x;
		heightmapValue.x = newHeight;

		gl_FragColor = heightmapValue;
	}
`;
