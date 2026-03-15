import { cn } from "@portfolio/ui/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

// ---- Types ----

interface PhotoViewItem {
	render?: () => ReactNode;
	src?: string;
}

interface PhotoViewContextValue {
	open: (index: number) => void;
	register: (index: number, item: PhotoViewItem) => void;
	unregister: (index: number) => void;
}

// ---- Context ----

const PhotoViewContext = createContext<PhotoViewContextValue | null>(null);

function usePhotoViewContext() {
	const ctx = useContext(PhotoViewContext);
	if (!ctx) {
		throw new Error(
			"PhotoView components must be used within a PhotoViewProvider"
		);
	}
	return ctx;
}

// ---- Constants ----

const SWIPE_THRESHOLD = 50;
const SPRING = { type: "spring" as const, bounce: 0.15, duration: 0.5 };

// ---- Provider ----

export function PhotoViewProvider({ children }: { children: ReactNode }) {
	const itemsRef = useRef(new Map<number, PhotoViewItem>());
	const [state, setState] = useState<{
		currentIndex: number;
		isOpen: boolean;
		items: PhotoViewItem[];
	}>({
		currentIndex: 0,
		isOpen: false,
		items: [],
	});

	const register = useCallback((index: number, item: PhotoViewItem) => {
		itemsRef.current.set(index, item);
	}, []);

	const unregister = useCallback((index: number) => {
		itemsRef.current.delete(index);
	}, []);

	const open = useCallback((index: number) => {
		const sorted = [...itemsRef.current.entries()]
			.sort(([a], [b]) => a - b)
			.map(([, item]) => item);
		setState({ isOpen: true, currentIndex: index, items: sorted });
		document.body.style.overflow = "hidden";
	}, []);

	const close = useCallback(() => {
		setState((prev) => ({ ...prev, isOpen: false }));
		document.body.style.overflow = "";
	}, []);

	const goTo = useCallback((index: number) => {
		setState((prev) => ({
			...prev,
			currentIndex: Math.max(0, Math.min(index, prev.items.length - 1)),
		}));
	}, []);

	const contextValue = useMemo(
		() => ({ open, register, unregister }),
		[open, register, unregister]
	);

	return (
		<PhotoViewContext.Provider value={contextValue}>
			{children}
			<AnimatePresence>
				{state.isOpen && (
					<PhotoViewOverlay
						close={close}
						currentIndex={state.currentIndex}
						goTo={goTo}
						items={state.items}
					/>
				)}
			</AnimatePresence>
		</PhotoViewContext.Provider>
	);
}

// ---- Trigger ----

export function PhotoView({
	children,
	className,
	index,
	render,
	src,
}: {
	children: ReactNode;
	className?: string;
	index: number;
	render?: () => ReactNode;
	src?: string;
}) {
	const { register, unregister, open } = usePhotoViewContext();

	useEffect(() => {
		register(index, { src, render });
		return () => unregister(index);
	}, [index, src, render, register, unregister]);

	const handleOpen = useCallback(() => open(index), [open, index]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				open(index);
			}
		},
		[open, index]
	);

	return (
		<div
			className={cn("cursor-zoom-in", className)}
			onClick={handleOpen}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
		>
			{children}
		</div>
	);
}

// ---- Overlay ----

function PhotoViewOverlay({
	close,
	currentIndex,
	goTo,
	items,
}: {
	close: () => void;
	currentIndex: number;
	goTo: (index: number) => void;
	items: PhotoViewItem[];
}) {
	const touchStartX = useRef(0);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
			} else if (e.key === "ArrowLeft") {
				goTo(currentIndex - 1);
			} else if (e.key === "ArrowRight") {
				goTo(currentIndex + 1);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [close, goTo, currentIndex]);

	const onTouchStart = useCallback((e: React.TouchEvent) => {
		touchStartX.current = e.touches[0]?.clientX ?? 0;
	}, []);

	const onTouchEnd = useCallback(
		(e: React.TouchEvent) => {
			const touch = e.changedTouches[0];
			if (!touch) {
				return;
			}
			const diff = touchStartX.current - touch.clientX;
			if (diff > SWIPE_THRESHOLD) {
				goTo(currentIndex + 1);
			} else if (diff < -SWIPE_THRESHOLD) {
				goTo(currentIndex - 1);
			}
		},
		[goTo, currentIndex]
	);

	const hasMultiple = items.length > 1;

	return (
		<motion.div
			animate={{ opacity: 1 }}
			className="fixed inset-0 z-50 flex items-center justify-center"
			exit={{ opacity: 0 }}
			initial={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
		>
			{/* Backdrop */}
			<motion.div className="absolute inset-0 bg-black/90" onClick={close} />

			{/* Close */}
			<button
				aria-label="Close viewer"
				className="absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
				onClick={close}
				type="button"
			>
				<X size={20} />
			</button>

			{/* Counter */}
			{hasMultiple && (
				<div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
					{currentIndex + 1} / {items.length}
				</div>
			)}

			{/* Nav arrows */}
			{hasMultiple && currentIndex > 0 && (
				<button
					aria-label="Previous"
					className="absolute left-4 z-10 cursor-pointer rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
					onClick={() => goTo(currentIndex - 1)}
					type="button"
				>
					<ChevronLeft size={20} />
				</button>
			)}
			{hasMultiple && currentIndex < items.length - 1 && (
				<button
					aria-label="Next"
					className="absolute right-4 z-10 cursor-pointer rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
					onClick={() => goTo(currentIndex + 1)}
					type="button"
				>
					<ChevronRight size={20} />
				</button>
			)}

			{/* Slider content — scale spring on open/close, translateX spring on slide */}
			<motion.div
				animate={{ scale: 1 }}
				className="relative h-full w-full overflow-hidden"
				exit={{ scale: 0.95 }}
				initial={{ scale: 0.95 }}
				onClick={(e) => e.stopPropagation()}
				transition={SPRING}
			>
				<motion.div
					animate={{ x: `${String(-currentIndex * 100)}%` }}
					className="flex h-full will-change-transform"
					onTouchEnd={onTouchEnd}
					onTouchStart={onTouchStart}
					transition={SPRING}
				>
					{items.map((item, i) => (
						<div
							className="flex h-full w-screen shrink-0 items-center justify-center p-8"
							key={i}
						>
							{item.src && (
								<img
									alt=""
									className="max-h-full max-w-full select-none object-contain"
									draggable={false}
									src={item.src}
								/>
							)}
							{item.render?.()}
						</div>
					))}
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
