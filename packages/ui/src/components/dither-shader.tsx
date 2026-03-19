"use client";
import { cn } from "@portfolio/ui/lib/utils";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type DitheringMode = "bayer" | "halftone" | "noise" | "crosshatch";
type ColorMode = "original" | "grayscale" | "duotone" | "custom";

interface DitherShaderProps {
	/** Enable animation effect */
	animated?: boolean;
	/** Animation speed (lower = slower) */
	animationSpeed?: number;
	/** Background color behind the dithered image */
	backgroundColor?: string;
	/** Brightness adjustment (-1 to 1) */
	brightness?: number;
	/** Additional CSS classes for the container (use this to set size via Tailwind) */
	className?: string;
	/** Color processing mode */
	colorMode?: ColorMode;
	/** Contrast adjustment (0 to 2, 1 = normal) */
	contrast?: number;
	/** Custom color palette array for custom mode */
	customPalette?: string[];
	/** Type of dithering pattern */
	ditherMode?: DitheringMode;
	/** Cap GIF redraw rate (frames per second) */
	gifFps?: number;
	/** Size of the dithering grid cells */
	gridSize?: number;
	/** Invert the dithered output colors */
	invert?: boolean;
	/** Object fit behavior */
	objectFit?: "cover" | "contain" | "fill" | "none";
	/** Pixelation multiplier (1 = no pixelation, higher = more pixelated) */
	pixelRatio?: number;
	/** Enable playback for GIF sources */
	playGifs?: boolean;
	/** Primary color for duotone mode */
	primaryColor?: string;
	/** Secondary color for duotone mode */
	secondaryColor?: string;
	/** Source image URL */
	src: string;
	style?: React.CSSProperties;
	/** Threshold bias for dithering (0 to 1) */
	threshold?: number;
}

// 4x4 Bayer matrix for ordered dithering
const BAYER_MATRIX_4x4 = [
	[0, 8, 2, 10],
	[12, 4, 14, 6],
	[3, 11, 1, 9],
	[15, 7, 13, 5],
];

// 8x8 Bayer matrix for finer dithering
const BAYER_MATRIX_8x8 = [
	[0, 32, 8, 40, 2, 34, 10, 42],
	[48, 16, 56, 24, 50, 18, 58, 26],
	[12, 44, 4, 36, 14, 46, 6, 38],
	[60, 28, 52, 20, 62, 30, 54, 22],
	[3, 35, 11, 43, 1, 33, 9, 41],
	[51, 19, 59, 27, 49, 17, 57, 25],
	[15, 47, 7, 39, 13, 45, 5, 37],
	[63, 31, 55, 23, 61, 29, 53, 21],
];

const RGB_COLOR_REGEX = /rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/i;

function parseColor(color: string): [number, number, number] {
	if (color.startsWith("#")) {
		const hex = color.slice(1);
		if (hex.length === 3) {
			return [
				Number.parseInt(hex[0] + hex[0], 16),
				Number.parseInt(hex[1] + hex[1], 16),
				Number.parseInt(hex[2] + hex[2], 16),
			];
		}
		return [
			Number.parseInt(hex.slice(0, 2), 16),
			Number.parseInt(hex.slice(2, 4), 16),
			Number.parseInt(hex.slice(4, 6), 16),
		];
	}
	const match = color.match(RGB_COLOR_REGEX);
	if (match) {
		return [
			Number.parseInt(match[1], 10),
			Number.parseInt(match[2], 10),
			Number.parseInt(match[3], 10),
		];
	}
	return [0, 0, 0];
}

function getLuminance(r: number, g: number, b: number): number {
	return 0.299 * r + 0.587 * g + 0.114 * b;
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

type RGB = [number, number, number];

interface DitherRenderConfig {
	backgroundColor: string;
	brightness: number;
	colorMode: ColorMode;
	contrast: number;
	customPalette: readonly RGB[];
	ditherMode: DitheringMode;
	gridSize: number;
	invert: boolean;
	pixelRatio: number;
	primaryColor: RGB;
	secondaryColor: RGB;
	threshold: number;
}

const TRANSPARENT_ALPHA_THRESHOLD = 10;
const ORIGINAL_COLOR_LEVELS = 4;

function clearWithBackground(
	ctx: CanvasRenderingContext2D,
	displayWidth: number,
	displayHeight: number,
	backgroundColor: string
) {
	if (backgroundColor !== "transparent") {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, displayWidth, displayHeight);
		return;
	}

	ctx.clearRect(0, 0, displayWidth, displayHeight);
}

function getBayerConfiguration(gridSize: number) {
	const matrixSize = gridSize <= 4 ? 4 : 8;
	const bayerMatrix = matrixSize === 4 ? BAYER_MATRIX_4x4 : BAYER_MATRIX_8x8;
	const matrixScale = matrixSize === 4 ? 16 : 64;

	return { bayerMatrix, matrixScale, matrixSize };
}

function computeRawDitherThreshold({
	bayerMatrix,
	ditherMode,
	gridSize,
	matrixScale,
	matrixX,
	matrixY,
	time,
	x,
	y,
}: {
	bayerMatrix: number[][];
	ditherMode: DitheringMode;
	gridSize: number;
	matrixScale: number;
	matrixX: number;
	matrixY: number;
	time: number;
	x: number;
	y: number;
}): number {
	switch (ditherMode) {
		case "bayer":
			return bayerMatrix[matrixY][matrixX] / matrixScale;
		case "halftone": {
			const angle = Math.PI / 4;
			const scale = gridSize * 2;
			const rotX = x * Math.cos(angle) + y * Math.sin(angle);
			const rotY = -x * Math.sin(angle) + y * Math.cos(angle);
			return (Math.sin(rotX / scale) + Math.sin(rotY / scale) + 2) / 4;
		}
		case "noise": {
			const noiseVal =
				Math.sin(x * 12.9898 + y * 78.233 + time * 100) * 43_758.5453;
			return noiseVal - Math.floor(noiseVal);
		}
		case "crosshatch": {
			const line1 = (x + y) % (gridSize * 2) < gridSize ? 1 : 0;
			const line2 = (x - y + gridSize * 4) % (gridSize * 2) < gridSize ? 1 : 0;
			return (line1 + line2) / 2;
		}
		default:
			return bayerMatrix[matrixY][matrixX] / matrixScale;
	}
}

function applyThresholdBias(
	ditherThreshold: number,
	threshold: number
): number {
	return ditherThreshold * (1 - threshold) + threshold * 0.5;
}

function computeOriginalColor({
	b,
	ditherThreshold,
	g,
	r,
}: {
	b: number;
	ditherThreshold: number;
	g: number;
	r: number;
}): RGB {
	const ditherAmount = ditherThreshold - 0.5;
	const adjustedR = clamp(r + ditherAmount * 64, 0, 255);
	const adjustedG = clamp(g + ditherAmount * 64, 0, 255);
	const adjustedB = clamp(b + ditherAmount * 64, 0, 255);

	const step = 255 / ORIGINAL_COLOR_LEVELS;
	return [
		Math.round(adjustedR / step) * step,
		Math.round(adjustedG / step) * step,
		Math.round(adjustedB / step) * step,
	];
}

function computeColorForMode({
	b,
	colorMode,
	customPalette,
	ditherThreshold,
	g,
	luminance,
	primaryColor,
	r,
	secondaryColor,
}: {
	b: number;
	colorMode: ColorMode;
	customPalette: readonly RGB[];
	ditherThreshold: number;
	g: number;
	luminance: number;
	primaryColor: RGB;
	r: number;
	secondaryColor: RGB;
}): RGB {
	if (colorMode === "grayscale") {
		return luminance < ditherThreshold ? [0, 0, 0] : [255, 255, 255];
	}

	if (colorMode === "duotone") {
		return luminance < ditherThreshold ? primaryColor : secondaryColor;
	}

	if (colorMode === "custom") {
		if (customPalette.length === 2) {
			return luminance < ditherThreshold ? customPalette[0] : customPalette[1];
		}

		const adjustedLuminance = luminance + (ditherThreshold - 0.5) * 0.5;
		const paletteIndex = Math.floor(
			clamp(adjustedLuminance, 0, 1) * (customPalette.length - 1)
		);
		return customPalette[paletteIndex] ?? [0, 0, 0];
	}

	return computeOriginalColor({ b, ditherThreshold, g, r });
}

function maybeInvertColor(color: RGB, invert: boolean): RGB {
	if (!invert) {
		return color;
	}
	return [255 - color[0], 255 - color[1], 255 - color[2]];
}

function computeDitheredCellColor({
	bayerMatrix,
	config,
	displayHeight,
	displayWidth,
	effectiveGridSize,
	matrixScale,
	matrixSize,
	sourceData,
	sourceHeight,
	sourceWidth,
	time,
	x,
	y,
}: {
	bayerMatrix: number[][];
	config: DitherRenderConfig;
	displayHeight: number;
	displayWidth: number;
	effectiveGridSize: number;
	matrixScale: number;
	matrixSize: number;
	sourceData: Uint8ClampedArray;
	sourceHeight: number;
	sourceWidth: number;
	time: number;
	x: number;
	y: number;
}): RGB | null {
	const srcX = Math.floor((x / displayWidth) * sourceWidth);
	const srcY = Math.floor((y / displayHeight) * sourceHeight);
	const srcIdx = (srcY * sourceWidth + srcX) * 4;

	const alpha = sourceData[srcIdx + 3] ?? 0;
	if (alpha < TRANSPARENT_ALPHA_THRESHOLD) {
		return null;
	}

	const rawR = sourceData[srcIdx] ?? 0;
	const rawG = sourceData[srcIdx + 1] ?? 0;
	const rawB = sourceData[srcIdx + 2] ?? 0;

	const r = clamp(
		(rawR - 128) * config.contrast + 128 + config.brightness * 255,
		0,
		255
	);
	const g = clamp(
		(rawG - 128) * config.contrast + 128 + config.brightness * 255,
		0,
		255
	);
	const b = clamp(
		(rawB - 128) * config.contrast + 128 + config.brightness * 255,
		0,
		255
	);

	const luminance = getLuminance(r, g, b) / 255;

	const matrixX = Math.floor(x / effectiveGridSize) % matrixSize;
	const matrixY = Math.floor(y / effectiveGridSize) % matrixSize;
	const rawThreshold = computeRawDitherThreshold({
		bayerMatrix,
		ditherMode: config.ditherMode,
		gridSize: effectiveGridSize,
		matrixScale,
		matrixX,
		matrixY,
		time,
		x,
		y,
	});
	const ditherThreshold = applyThresholdBias(rawThreshold, config.threshold);

	const baseColor = computeColorForMode({
		b,
		colorMode: config.colorMode,
		customPalette: config.customPalette,
		ditherThreshold,
		g,
		luminance,
		primaryColor: config.primaryColor,
		r,
		secondaryColor: config.secondaryColor,
	});

	return maybeInvertColor(baseColor, config.invert);
}

function renderDitheredFrame({
	config,
	ctx,
	displayHeight,
	displayWidth,
	sourceImageData,
	time,
}: {
	config: DitherRenderConfig;
	ctx: CanvasRenderingContext2D;
	displayHeight: number;
	displayWidth: number;
	sourceImageData: ImageData;
	time: number;
}) {
	clearWithBackground(ctx, displayWidth, displayHeight, config.backgroundColor);

	const sourceData = sourceImageData.data;
	const sourceWidth = sourceImageData.width;
	const sourceHeight = sourceImageData.height;

	const effectiveGridSize = Math.max(1, config.gridSize);
	const effectivePixelSize = Math.max(
		1,
		Math.floor(effectiveGridSize * config.pixelRatio)
	);
	const { bayerMatrix, matrixScale, matrixSize } =
		getBayerConfiguration(effectiveGridSize);

	for (let y = 0; y < displayHeight; y += effectivePixelSize) {
		for (let x = 0; x < displayWidth; x += effectivePixelSize) {
			const color = computeDitheredCellColor({
				bayerMatrix,
				config,
				displayHeight,
				displayWidth,
				effectiveGridSize,
				matrixScale,
				matrixSize,
				sourceData,
				sourceHeight,
				sourceWidth,
				time,
				x,
				y,
			});

			if (!color) {
				continue;
			}

			ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
			ctx.fillRect(x, y, effectivePixelSize, effectivePixelSize);
		}
	}
}

function isGifSource(src: string): boolean {
	if (src.startsWith("data:image/gif")) {
		return true;
	}

	const srcWithoutHash = src.split("#")[0] ?? src;
	const srcWithoutQuery = srcWithoutHash.split("?")[0] ?? srcWithoutHash;
	return srcWithoutQuery.toLowerCase().endsWith(".gif");
}

type DecodedGif = {
	frames: ImageBitmap[];
	height: number;
	width: number;
};

function isVideoFrame(value: unknown): value is VideoFrame {
	return typeof VideoFrame !== "undefined" && value instanceof VideoFrame;
}

async function decodeGifWithImageDecoder(
	src: string,
	signal: AbortSignal
): Promise<DecodedGif | null> {
	const ImageDecoderConstructor = (
		globalThis as unknown as { ImageDecoder?: unknown }
	).ImageDecoder;
	if (!ImageDecoderConstructor) {
		return null;
	}

	const response = await fetch(src, { signal });
	if (!response.ok) {
		return null;
	}

	const buffer = await response.arrayBuffer();

	// The DOM types for ImageDecoder vary by TS/lib version; keep this narrowly typed.
	const decoder = new (
		ImageDecoderConstructor as new (options: {
			data: ArrayBuffer;
			type: string;
		}) => {
			close?: () => void;
			decode: (options: { frameIndex: number }) => Promise<{ image: unknown }>;
			tracks: {
				ready: Promise<void>;
				selectedTrack: {
					frameCount: number;
				};
			};
		}
	)({
		data: buffer,
		type: "image/gif",
	});

	await decoder.tracks.ready;

	const frameCount = decoder.tracks.selectedTrack.frameCount;
	if (frameCount <= 1) {
		decoder.close?.();
		return null;
	}

	const frames: ImageBitmap[] = [];

	for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
		const result = await decoder.decode({ frameIndex });
		if (signal.aborted) {
			for (const bitmap of frames) {
				bitmap.close();
			}
			decoder.close?.();
			return null;
		}

		const decodedImage = result.image;
		if (isVideoFrame(decodedImage)) {
			const bitmap = await createImageBitmap(decodedImage);
			decodedImage.close();
			frames.push(bitmap);
			continue;
		}

		if (decodedImage instanceof ImageBitmap) {
			frames.push(decodedImage);
			continue;
		}

		decoder.close?.();
		for (const bitmap of frames) {
			bitmap.close();
		}
		return null;
	}

	const firstFrame = frames[0];
	if (!firstFrame) {
		decoder.close?.();
		return null;
	}

	decoder.close?.();

	return {
		frames,
		height: firstFrame.height,
		width: firstFrame.width,
	};
}

export const DitherShader: React.FC<DitherShaderProps> = ({
	src,
	gridSize = 4,
	ditherMode = "bayer",
	colorMode = "original",
	invert = false,
	pixelRatio = 1,
	primaryColor = "#000000",
	secondaryColor = "#ffffff",
	customPalette = ["#000000", "#ffffff"],
	brightness = 0,
	contrast = 1,
	backgroundColor = "transparent",
	objectFit = "cover",
	threshold = 0.5,
	animated = false,
	animationSpeed = 0.02,
	playGifs = true,
	gifFps = 30,
	style,
	className,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | null>(null);
	const timeRef = useRef<number>(0);
	const imageRef = useRef<HTMLImageElement | null>(null);
	const imageDataRef = useRef<ImageData | null>(null);
	const dimensionsRef = useRef<{ width: number; height: number }>({
		width: 0,
		height: 0,
	});
	const gifFrameTimeRef = useRef<number>(0);

	const [dimensions, setDimensions] = useState<{
		width: number;
		height: number;
	}>({ width: 0, height: 0 });

	const parsedPrimaryColor = parseColor(primaryColor);
	const parsedSecondaryColor = parseColor(secondaryColor);
	const parsedCustomPalette = customPalette.map(parseColor);

	const applyDithering = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			displayWidth: number,
			displayHeight: number,
			time = 0
		) => {
			const sourceImageData = imageDataRef.current;
			if (!sourceImageData) {
				return;
			}

			const config: DitherRenderConfig = {
				backgroundColor,
				brightness,
				colorMode,
				contrast,
				customPalette: parsedCustomPalette,
				ditherMode,
				gridSize,
				invert,
				pixelRatio,
				primaryColor: parsedPrimaryColor,
				secondaryColor: parsedSecondaryColor,
				threshold,
			};

			renderDitheredFrame({
				config,
				ctx,
				displayHeight,
				displayWidth,
				sourceImageData,
				time,
			});
		},
		[
			gridSize,
			ditherMode,
			colorMode,
			invert,
			pixelRatio,
			parsedPrimaryColor,
			parsedSecondaryColor,
			parsedCustomPalette,
			brightness,
			contrast,
			backgroundColor,
			threshold,
		]
	);

	// Setup resize observer for responsive sizing
	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				if (width > 0 && height > 0) {
					dimensionsRef.current = { width, height };
					setDimensions({ width, height });
				}
			}
		});

		resizeObserver.observe(container);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	// Process image and apply dithering when dimensions or settings change
	useEffect(() => {
		const canvas = canvasRef.current;
		const img = imageRef.current;
		if (!(canvas && img) || dimensions.width === 0 || dimensions.height === 0) {
			return;
		}

		let isCancelled = false;
		const abortController = new AbortController();
		let decodedGifFrames: ImageBitmap[] | null = null;

		const displayWidth = dimensions.width;
		const displayHeight = dimensions.height;
		const shouldPlayGif = playGifs && isGifSource(src);
		const shouldAnimate = animated || shouldPlayGif;
		const minGifFrameMs = 1000 / Math.max(1, gifFps);
		const canDecodeGif = shouldPlayGif && "ImageDecoder" in globalThis;

		const setupOutputContext = (): CanvasRenderingContext2D | null => {
			const dpr = window.devicePixelRatio || 1;
			canvas.width = Math.floor(displayWidth * dpr);
			canvas.height = Math.floor(displayHeight * dpr);

			const ctx = canvas.getContext("2d");
			if (!ctx) {
				return null;
			}

			ctx.resetTransform();
			ctx.scale(dpr, dpr);
			return ctx;
		};

		const createImageDataUpdater = ({
			getSource,
			sourceHeight,
			sourceWidth,
		}: {
			getSource: () => CanvasImageSource;
			sourceHeight: number;
			sourceWidth: number;
		}): (() => boolean) | null => {
			const offscreen = document.createElement("canvas");
			offscreen.width = displayWidth;
			offscreen.height = displayHeight;
			const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
			if (!offCtx) {
				return null;
			}

			const iw = sourceWidth || displayWidth;
			const ih = sourceHeight || displayHeight;

			let dw = displayWidth;
			let dh = displayHeight;
			let dx = 0;
			let dy = 0;

			if (objectFit === "cover") {
				const scale = Math.max(displayWidth / iw, displayHeight / ih);
				dw = Math.ceil(iw * scale);
				dh = Math.ceil(ih * scale);
				dx = Math.floor((displayWidth - dw) / 2);
				dy = Math.floor((displayHeight - dh) / 2);
			} else if (objectFit === "contain") {
				const scale = Math.min(displayWidth / iw, displayHeight / ih);
				dw = Math.ceil(iw * scale);
				dh = Math.ceil(ih * scale);
				dx = Math.floor((displayWidth - dw) / 2);
				dy = Math.floor((displayHeight - dh) / 2);
			} else if (objectFit === "fill") {
				dw = displayWidth;
				dh = displayHeight;
			} else {
				dw = iw;
				dh = ih;
				dx = Math.floor((displayWidth - dw) / 2);
				dy = Math.floor((displayHeight - dh) / 2);
			}

			return () => {
				offCtx.clearRect(0, 0, displayWidth, displayHeight);
				offCtx.drawImage(getSource(), dx, dy, dw, dh);

				try {
					imageDataRef.current = offCtx.getImageData(
						0,
						0,
						displayWidth,
						displayHeight
					);
				} catch {
					console.error("Could not get image data. CORS issue?");
					return false;
				}

				return true;
			};
		};

		const startDecodedGifLoop = (
			ctx: CanvasRenderingContext2D,
			updateImageData: () => boolean,
			frameCount: number
		) => {
			const frameMs = 1000 / Math.max(1, gifFps);
			let currentFrameIndex = 0;
			let startTimeMs = 0;

			const tick = (now: number) => {
				if (isCancelled) {
					return;
				}

				if (startTimeMs === 0) {
					startTimeMs = now;
				}

				const elapsedMs = now - startTimeMs;
				const nextFrameIndex =
					Math.floor(elapsedMs / frameMs) % Math.max(1, frameCount);
				const didChangeFrame = nextFrameIndex !== currentFrameIndex;

				if (didChangeFrame) {
					currentFrameIndex = nextFrameIndex;
					gifFrameTimeRef.current = now;
					if (!updateImageData()) {
						return;
					}
				}

				const time = updateTime();
				if (animated || didChangeFrame) {
					applyDithering(ctx, displayWidth, displayHeight, time);
				}

				animationRef.current = requestAnimationFrame(tick);
			};

			animationRef.current = requestAnimationFrame(tick);
		};

		const updateTime = (): number => {
			if (!animated) {
				return 0;
			}
			timeRef.current += animationSpeed;
			return timeRef.current;
		};

		const maybeUpdateGifFrame = (
			now: number,
			updateImageData: () => boolean
		): boolean => {
			if (!shouldPlayGif) {
				return false;
			}

			if (gifFrameTimeRef.current !== 0) {
				const elapsed = now - gifFrameTimeRef.current;
				if (elapsed < minGifFrameMs) {
					return false;
				}
			}

			gifFrameTimeRef.current = now;
			return updateImageData();
		};

		const startLoop = (
			ctx: CanvasRenderingContext2D,
			updateImageData: () => boolean
		) => {
			const tick = (now: number) => {
				if (isCancelled) {
					return;
				}

				const didUpdateGifFrame = maybeUpdateGifFrame(now, updateImageData);
				if (shouldPlayGif && !animated && !didUpdateGifFrame) {
					animationRef.current = requestAnimationFrame(tick);
					return;
				}

				const time = updateTime();
				if (animated || didUpdateGifFrame) {
					applyDithering(ctx, displayWidth, displayHeight, time);
				}

				animationRef.current = requestAnimationFrame(tick);
			};

			animationRef.current = requestAnimationFrame(tick);
		};

		const startRendering = () => {
			if (isCancelled) {
				return;
			}

			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}

			timeRef.current = 0;
			gifFrameTimeRef.current = 0;

			const ctx = setupOutputContext();
			if (!ctx) {
				return;
			}

			const startWithImageElement = () => {
				const updateImageData = createImageDataUpdater({
					getSource: () => img,
					sourceHeight: img.naturalHeight || displayHeight,
					sourceWidth: img.naturalWidth || displayWidth,
				});
				if (!updateImageData) {
					return;
				}

				if (!updateImageData()) {
					return;
				}

				applyDithering(ctx, displayWidth, displayHeight, 0);

				if (shouldAnimate) {
					startLoop(ctx, updateImageData);
				}
			};

			const startWithDecodedGif = async () => {
				try {
					const decoded = await decodeGifWithImageDecoder(
						src,
						abortController.signal
					);
					if (isCancelled || !decoded) {
						startWithImageElement();
						return;
					}

					decodedGifFrames = decoded.frames;
					let currentFrameIndex = 0;

					const updateImageData = createImageDataUpdater({
						getSource: () => decoded.frames[currentFrameIndex] ?? img,
						sourceHeight: decoded.height,
						sourceWidth: decoded.width,
					});
					if (!updateImageData) {
						startWithImageElement();
						return;
					}

					if (!updateImageData()) {
						startWithImageElement();
						return;
					}

					applyDithering(ctx, displayWidth, displayHeight, 0);

					if (!shouldAnimate) {
						return;
					}

					const tickFrameIndex = (now: number) => {
						if (isCancelled) {
							return;
						}

						if (animated) {
							timeRef.current += animationSpeed;
							applyDithering(ctx, displayWidth, displayHeight, timeRef.current);
						}

						const shouldAdvance =
							gifFrameTimeRef.current === 0 ||
							now - gifFrameTimeRef.current >= minGifFrameMs;
						if (shouldAdvance) {
							gifFrameTimeRef.current = now;
							currentFrameIndex =
								(currentFrameIndex + 1) % Math.max(1, decoded.frames.length);
							if (updateImageData()) {
								applyDithering(
									ctx,
									displayWidth,
									displayHeight,
									animated ? timeRef.current : 0
								);
							}
						}

						animationRef.current = requestAnimationFrame(tickFrameIndex);
					};

					animationRef.current = requestAnimationFrame(tickFrameIndex);
				} catch {
					startWithImageElement();
				}
			};

			if (canDecodeGif) {
				void startWithDecodedGif();
				return;
			}

			startWithImageElement();
		};

		const handleLoad = () => {
			startRendering();
		};

		const handleError = () => {
			console.error("Failed to load image for DitherShader:", src);
		};

		img.addEventListener("load", handleLoad);
		img.addEventListener("error", handleError);

		// If image is already loaded, render immediately
		if (img.complete && img.naturalWidth > 0) {
			startRendering();
		}

		return () => {
			isCancelled = true;
			abortController.abort();
			if (decodedGifFrames) {
				for (const bitmap of decodedGifFrames) {
					bitmap.close();
				}
				decodedGifFrames = null;
			}
			img.removeEventListener("load", handleLoad);
			img.removeEventListener("error", handleError);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [
		src,
		dimensions,
		objectFit,
		animated,
		animationSpeed,
		applyDithering,
		playGifs,
		gifFps,
	]);

	return (
		<div
			className={cn("relative h-full w-full", className)}
			ref={containerRef}
			style={style}
		>
			<img
				alt=""
				aria-hidden="true"
				className="pointer-events-none absolute top-0 left-0 h-px w-px opacity-0"
				crossOrigin="anonymous"
				height={1}
				ref={imageRef}
				src={src}
				width={1}
			/>
			<canvas
				aria-label="Dithered image"
				className="absolute inset-0 h-full w-full"
				ref={canvasRef}
				role="img"
				style={{ imageRendering: "pixelated" }}
			/>
		</div>
	);
};

export default DitherShader;
