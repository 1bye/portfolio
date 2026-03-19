import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

type RevealPhase = "waiting" | "revealing" | "revealed";

interface RevealContextValue {
	/** Duration of the sweep wave in ms */
	duration: number;
	/** Subscribe to normalized progress (0–1) for external sync (e.g. canvas) */
	onProgress: (callback: (progress: number) => void) => () => void;
	/** Current animation phase */
	phase: RevealPhase;
	/** Manually trigger the hide (for future page transitions) */
	triggerHide: () => void;
	/** Manually trigger the reveal */
	triggerReveal: () => void;
}

const RevealContext = createContext<RevealContextValue | null>(null);

interface RevealProviderProps {
	/** Delay before the reveal starts (ms) */
	delay?: number;
	/** How long the sweep wave takes to cross the viewport (ms) */
	duration?: number;
}

export function RevealProvider({
	children,
	delay = 2500,
	duration = 1200,
}: PropsWithChildren<RevealProviderProps>) {
	const [phase, setPhase] = useState<RevealPhase>("waiting");
	const listeners = useRef<Set<(p: number) => void>>(new Set());
	const rafId = useRef(0);
	const startTime = useRef(0);

	const tick = useCallback(() => {
		const elapsed = performance.now() - startTime.current;
		const p = Math.min(elapsed / duration, 1);
		for (const cb of listeners.current) {
			cb(p);
		}
		if (p < 1) {
			rafId.current = requestAnimationFrame(tick);
		} else {
			setPhase("revealed");
		}
	}, [duration]);

	const triggerReveal = useCallback(() => {
		setPhase("revealing");
		startTime.current = performance.now();
		rafId.current = requestAnimationFrame(tick);
	}, [tick]);

	const triggerHide = useCallback(() => {
		cancelAnimationFrame(rafId.current);
		setPhase("waiting");
	}, []);

	useEffect(() => {
		const id = setTimeout(triggerReveal, delay);
		return () => {
			clearTimeout(id);
			cancelAnimationFrame(rafId.current);
		};
	}, [delay, triggerReveal]);

	const onProgress = useCallback((cb: (progress: number) => void) => {
		listeners.current.add(cb);
		return () => {
			listeners.current.delete(cb);
		};
	}, []);

	return (
		<RevealContext.Provider
			value={{ phase, duration, triggerReveal, triggerHide, onProgress }}
		>
			{children}
		</RevealContext.Provider>
	);
}

export function useReveal(): RevealContextValue {
	const ctx = useContext(RevealContext);
	if (!ctx) {
		return {
			phase: "revealed",
			duration: 0,
			triggerReveal: () => {},
			triggerHide: () => {},
			onProgress: () => () => {},
		};
	}
	return ctx;
}
