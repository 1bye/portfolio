declare module "gifenc" {
	interface GIFEncoderInstance {
		bytes(): Uint8Array;
		finish(): void;
		writeFrame(
			index: Uint8Array,
			width: number,
			height: number,
			opts?: {
				delay?: number;
				dispose?: number;
				palette?: number[][];
				transparent?: boolean;
				transparentIndex?: number;
			}
		): void;
	}

	export function GIFEncoder(opts?: {
		auto?: boolean;
		initialCapacity?: number;
	}): GIFEncoderInstance;

	export function quantize(
		rgba: Uint8ClampedArray | Uint8Array,
		maxColors: number,
		opts?: { format?: string; oneBitAlpha?: boolean | number }
	): number[][];

	export function applyPalette(
		rgba: Uint8ClampedArray | Uint8Array,
		palette: number[][],
		format?: string
	): Uint8Array;
}
