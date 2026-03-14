import {
	createContext,
	type PropsWithChildren,
	useContext,
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

export const RootCanvasContext = createContext<RootCanvasProps>({});

export function RootCanvasProvider({ children }: PropsWithChildren<{}>) {
	const [targets, setTargets] = useState<RootCanvasTarget[]>([]);

	const registerTarget = (target: RootCanvasTarget) => {
		setTargets([...targets, target]);
	};

	const unregisterTarget = (targetId: string) => {
		setTargets(targets.filter((t) => t.id !== targetId));
	};

	return (
		<RootCanvasContext.Provider
			value={{ targets, registerTarget, unregisterTarget }}
		>
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
