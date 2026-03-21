import type { DitherRenderConfig } from "@portfolio/ui/components/dither-shader";
import {
	DitherShader,
	decodeGifWithImageDecoder,
	parseColor,
	renderDitheredFrame,
} from "@portfolio/ui/components/dither-shader";
import { Slider } from "@portfolio/ui/components/slider";

import { createFileRoute } from "@tanstack/react-router";
import { applyPalette, GIFEncoder, quantize } from "gifenc";
import { Download, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export const Route = createFileRoute("/crafts/dither")({
	component: DitherCraft,
});

type DitheringMode = "bayer" | "halftone" | "noise" | "crosshatch";
type ColorMode = "original" | "grayscale" | "duotone" | "custom";

const DITHER_MODES: { label: string; value: DitheringMode }[] = [
	{ label: "Bayer", value: "bayer" },
	{ label: "Halftone", value: "halftone" },
	{ label: "Noise", value: "noise" },
	{ label: "Crosshatch", value: "crosshatch" },
];

const COLOR_MODES: { label: string; value: ColorMode }[] = [
	{ label: "Original", value: "original" },
	{ label: "Grayscale", value: "grayscale" },
	{ label: "Duotone", value: "duotone" },
];

function DitherCraft() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [src, setSrc] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [imageDimensions, setImageDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);

	const [gridSize, setGridSize] = useState(4);
	const [ditherMode, setDitherMode] = useState<DitheringMode>("bayer");
	const [colorMode, setColorMode] = useState<ColorMode>("grayscale");
	const [threshold, setThreshold] = useState(50);
	const [brightness, setBrightness] = useState(0);
	const [contrast, setContrast] = useState(100);
	const [pixelRatio, setPixelRatio] = useState(100);
	const [invert, setInvert] = useState(false);
	const [primaryColor, setPrimaryColor] = useState("#000000");
	const [secondaryColor, setSecondaryColor] = useState("#ffffff");
	const [backgroundColor, setBackgroundColor] = useState("#000000");
	const [isGif, setIsGif] = useState(false);
	const [exporting, setExporting] = useState(false);

	const handleFile = useCallback((file: File) => {
		const url = URL.createObjectURL(file);
		setFileName(file.name);
		setIsGif(
			file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif")
		);

		const img = new Image();
		img.onload = () => {
			setImageDimensions({
				width: img.naturalWidth,
				height: img.naturalHeight,
			});
		};
		img.src = url;

		setSrc(url);
	}, []);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				handleFile(file);
			}
		},
		[handleFile]
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			if (file?.type.startsWith("image/")) {
				handleFile(file);
			}
		},
		[handleFile]
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
	}, []);

	const handleClear = useCallback(() => {
		setSrc(null);
		setFileName(null);
		setImageDimensions(null);
		setIsGif(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, []);

	const buildDitherConfig = useCallback((): DitherRenderConfig => {
		return {
			backgroundColor,
			brightness: brightness / 100,
			colorMode,
			contrast: contrast / 100,
			customPalette: [],
			ditherMode,
			gridSize,
			invert,
			pixelRatio: pixelRatio / 100,
			primaryColor: parseColor(primaryColor),
			secondaryColor: parseColor(secondaryColor),
			threshold: threshold / 100,
		};
	}, [
		backgroundColor,
		brightness,
		colorMode,
		contrast,
		ditherMode,
		gridSize,
		invert,
		pixelRatio,
		primaryColor,
		secondaryColor,
		threshold,
	]);

	const handleExportPng = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const link = document.createElement("a");
		link.download = `dithered-${fileName ?? "image"}.png`;
		link.href = canvas.toDataURL("image/png");
		link.click();
	}, [fileName]);

	const handleExportGif = useCallback(async () => {
		if (!src) {
			return;
		}

		setExporting(true);

		try {
			const abortController = new AbortController();
			const decoded = await decodeGifWithImageDecoder(
				src,
				abortController.signal
			);

			if (!decoded || decoded.frames.length === 0) {
				handleExportPng();
				return;
			}

			const { frames, width: gifW, height: gifH } = decoded;
			const config = buildDitherConfig();

			const tempCanvas = document.createElement("canvas");
			tempCanvas.width = gifW;
			tempCanvas.height = gifH;
			const tempCtx = tempCanvas.getContext("2d");

			const ditherCanvas = document.createElement("canvas");
			ditherCanvas.width = gifW;
			ditherCanvas.height = gifH;
			const ditherCtx = ditherCanvas.getContext("2d");

			if (!(tempCtx && ditherCtx)) {
				return;
			}

			const gif = GIFEncoder();
			const frameDelay = Math.round(1000 / 10);

			for (const bitmap of frames) {
				tempCtx.clearRect(0, 0, gifW, gifH);
				tempCtx.drawImage(bitmap, 0, 0, gifW, gifH);
				const sourceImageData = tempCtx.getImageData(0, 0, gifW, gifH);

				renderDitheredFrame({
					config,
					ctx: ditherCtx,
					displayHeight: gifH,
					displayWidth: gifW,
					sourceImageData,
					time: 0,
				});

				const ditheredData = ditherCtx.getImageData(0, 0, gifW, gifH);
				const palette = quantize(ditheredData.data, 256);
				const index = applyPalette(ditheredData.data, palette);

				gif.writeFrame(index, gifW, gifH, {
					delay: frameDelay,
					palette,
				});
			}

			gif.finish();

			const bytes = gif.bytes();
			const blob = new Blob([bytes.buffer as ArrayBuffer], {
				type: "image/gif",
			});
			const link = document.createElement("a");
			link.download = `dithered-${fileName ?? "image"}.gif`;
			link.href = URL.createObjectURL(blob);
			link.click();
			URL.revokeObjectURL(link.href);

			for (const bitmap of frames) {
				bitmap.close();
			}
		} finally {
			setExporting(false);
		}
	}, [src, fileName, buildDitherConfig, handleExportPng]);

	const handleExport = useCallback(() => {
		if (isGif) {
			void handleExportGif();
		} else {
			handleExportPng();
		}
	}, [isGif, handleExportGif, handleExportPng]);

	return (
		<div className="mx-auto w-full max-w-5xl py-8">
			<header className="mb-6 px-2">
				<h1 className="font-semibold text-2xl tracking-tight">
					Ordered Dither
				</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Upload an image or GIF and apply ordered dithering with real-time
					configuration.
				</p>
			</header>

			<div className="flex flex-col gap-6 lg:flex-row">
				{/* Preview area */}
				<div className="flex min-w-0 flex-1 flex-col gap-4">
					{src ? (
						<div className="relative overflow-hidden rounded-xl border border-border bg-muted">
							<div className="flex items-center justify-between border-border border-b px-4 py-2">
								<span className="truncate font-mono text-muted-foreground text-xs">
									{fileName}
									{imageDimensions
										? ` — ${imageDimensions.width}×${imageDimensions.height}`
										: ""}
								</span>
								<div className="flex items-center gap-1">
									<button
										className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
										disabled={exporting}
										onClick={handleExport}
										title={isGif ? "Export GIF" : "Export PNG"}
										type="button"
									>
										<Download className="size-3.5" />
									</button>
									<button
										className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
										onClick={handleClear}
										title="Remove"
										type="button"
									>
										<X className="size-3.5" />
									</button>
								</div>
							</div>
							<div
								className="flex items-center justify-center p-4"
								style={{ backgroundColor }}
							>
								<div
									className="relative"
									style={{
										width: "100%",
										maxWidth: imageDimensions
											? `${imageDimensions.width}px`
											: "100%",
										aspectRatio: imageDimensions
											? `${imageDimensions.width} / ${imageDimensions.height}`
											: "16 / 9",
									}}
								>
									<DitherShader
										backgroundColor={backgroundColor}
										brightness={brightness / 100}
										canvasRef={canvasRef}
										className="h-full w-full"
										colorMode={colorMode}
										contrast={contrast / 100}
										ditherMode={ditherMode}
										forceGif={isGif}
										gifFps={isGif ? 10 : undefined}
										gridSize={gridSize}
										invert={invert}
										objectFit="contain"
										pixelRatio={pixelRatio / 100}
										playGifs={isGif}
										primaryColor={primaryColor}
										secondaryColor={secondaryColor}
										src={src}
										threshold={threshold / 100}
									/>
								</div>
							</div>
						</div>
					) : (
						<button
							className="flex min-h-80 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-border border-dashed bg-muted/50 transition-colors hover:bg-muted"
							onClick={() => fileInputRef.current?.click()}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
							type="button"
						>
							<div className="flex size-12 items-center justify-center rounded-full bg-accent">
								<Upload className="size-5 text-muted-foreground" />
							</div>
							<div className="text-center">
								<p className="font-medium text-sm">Drop an image or GIF here</p>
								<p className="mt-0.5 text-muted-foreground text-xs">
									or click to browse
								</p>
							</div>
						</button>
					)}

					<input
						accept="image/*"
						className="hidden"
						onChange={handleFileChange}
						ref={fileInputRef}
						type="file"
					/>
				</div>

				{/* Controls panel */}
				<div className="w-full shrink-0 lg:w-80">
					<div className="flex flex-col gap-2 rounded-xl bg-[#1a1a1a] p-3">
						<ControlSection title="Pattern">
							<SegmentedControl
								onChange={(v) => setDitherMode(v as DitheringMode)}
								options={DITHER_MODES}
								value={ditherMode}
							/>
							<Slider
								label="Grid Size"
								max={16}
								min={1}
								onChange={setGridSize}
								value={gridSize}
							/>
							<Slider
								label="Threshold"
								max={100}
								min={0}
								onChange={setThreshold}
								value={threshold}
							/>
							<Slider
								label="Pixel Ratio"
								max={400}
								min={50}
								onChange={setPixelRatio}
								step={10}
								value={pixelRatio}
							/>
						</ControlSection>

						<div className="h-px bg-white/10" />

						<ControlSection title="Color">
							<SegmentedControl
								onChange={(v) => setColorMode(v as ColorMode)}
								options={COLOR_MODES}
								value={colorMode}
							/>
							{colorMode === "duotone" && (
								<div className="flex gap-2">
									<ColorInput
										label="Primary"
										onChange={setPrimaryColor}
										value={primaryColor}
									/>
									<ColorInput
										label="Secondary"
										onChange={setSecondaryColor}
										value={secondaryColor}
									/>
								</div>
							)}
							<ToggleRow checked={invert} label="Invert" onChange={setInvert} />
						</ControlSection>

						<div className="h-px bg-white/10" />

						<ControlSection title="Adjustments">
							<Slider
								label="Brightness"
								max={100}
								min={-100}
								onChange={setBrightness}
								value={brightness}
							/>
							<Slider
								label="Contrast"
								max={200}
								min={0}
								onChange={setContrast}
								value={contrast}
							/>
						</ControlSection>

						<div className="h-px bg-white/10" />

						<ControlSection title="Background">
							<ColorInput
								label="Color"
								onChange={setBackgroundColor}
								value={backgroundColor}
							/>
						</ControlSection>

						{src && (
							<>
								<div className="h-px bg-white/10" />
								<button
									className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white/10 font-medium text-[13px] text-white/90 transition-colors hover:bg-white/15 disabled:opacity-50"
									disabled={exporting}
									onClick={handleExport}
									type="button"
								>
									{exporting ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										<Download className="size-4" />
									)}
									{exporting
										? "Encoding GIF…"
										: isGif
											? "Export GIF"
											: "Export PNG"}
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function ControlSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2">
			<span className="px-1 font-mono text-[11px] text-white/40 uppercase tracking-wider">
				{title}
			</span>
			{children}
		</div>
	);
}

function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
}: {
	options: { label: string; value: T }[];
	value: T;
	onChange: (value: T) => void;
}) {
	return (
		<div className="flex gap-1 rounded-xl bg-white/5 p-1">
			{options.map((option) => (
				<button
					className={`flex-1 rounded-lg px-2 py-1.5 font-medium text-[12px] transition-colors ${
						value === option.value
							? "bg-white/15 text-white/90"
							: "text-white/40 hover:text-white/60"
					}`}
					key={option.value}
					onClick={() => onChange(option.value)}
					type="button"
				>
					{option.label}
				</button>
			))}
		</div>
	);
}

function ColorInput({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
			<input
				className="size-5 cursor-pointer appearance-none rounded-md border border-white/20"
				onChange={(e) => onChange(e.target.value)}
				style={{ backgroundColor: value }}
				type="color"
				value={value}
			/>
			<span className="font-medium text-[12px] text-white/60">{label}</span>
			<span className="ml-auto font-mono text-[11px] text-white/40">
				{value}
			</span>
		</label>
	);
}

function ToggleRow({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<button
			className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5"
			onClick={() => onChange(!checked)}
			type="button"
		>
			<span className="font-medium text-[13px] text-white/80">{label}</span>
			<div
				className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
					checked ? "bg-white/30" : "bg-white/10"
				}`}
			>
				<div
					className={`size-4 rounded-full bg-white/90 transition-transform ${
						checked ? "translate-x-4" : "translate-x-0"
					}`}
				/>
			</div>
		</button>
	);
}
