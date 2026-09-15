import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

export interface RootCanvasTarget {
	id: string;
	// position: [number, number, number];
}

export interface RootCanvasProps {
	registerTarget: (target: RootCanvasTarget) => void;
	targets?: RootCanvasTarget[];
	unregisterTarget: (targetId: string) => void;
}

export const RootCanvasContext = createContext<RootCanvasProps | undefined>(
	undefined
);

export function RootCanvasProvider({ children }: { children: ReactNode }) {
	const [targets, setTargets] = useState<RootCanvasTarget[]>([]);

	const registerTarget = useCallback((target: RootCanvasTarget) => {
		setTargets((currentTargets) => [...currentTargets, target]);
	}, []);

	const unregisterTarget = useCallback((targetId: string) => {
		setTargets((currentTargets) =>
			currentTargets.filter((target) => target.id !== targetId)
		);
	}, []);

	const value = useMemo(
		() => ({ registerTarget, targets, unregisterTarget }),
		[registerTarget, targets, unregisterTarget]
	);

	return (
		<RootCanvasContext.Provider value={value}>
			{children}
		</RootCanvasContext.Provider>
	);
}

export function useRootCanvas(): RootCanvasProps {
	const ctx = useContext(RootCanvasContext);

	if (!ctx) {
		throw new Error("useRootCanvas must be used within a RootCanvasProvider");
	}

	return ctx;
}
