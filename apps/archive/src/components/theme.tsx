"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

interface ThemeProviderProps {
	children: ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}

const ThemeProviderContext = createContext<{
	resolvedTheme: ResolvedTheme;
	theme: Theme;
	setTheme: (theme: Theme) => void;
}>({
	resolvedTheme: "light",
	theme: "system",
	setTheme: () => null,
});

const getSystemTheme = (): ResolvedTheme =>
	window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const getStoredTheme = (storageKey: string, fallback: Theme): Theme => {
	try {
		const storedTheme = localStorage.getItem(storageKey);
		if (
			storedTheme === "dark" ||
			storedTheme === "light" ||
			storedTheme === "system"
		) {
			return storedTheme;
		}
	} catch {
		return fallback;
	}

	return fallback;
};

const updateThemeColor = (resolvedTheme: ResolvedTheme) => {
	const themeColor = resolvedTheme === "dark" ? "#171717" : "#ffffff";
	const meta = document.querySelector<HTMLMetaElement>(
		'meta[name="theme-color"]:not([media])'
	);
	meta?.setAttribute("content", themeColor);
};

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "ui-theme",
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(() =>
		getStoredTheme(storageKey, defaultTheme)
	);
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
		theme === "system" ? getSystemTheme() : theme
	);

	useEffect(() => {
		const root = window.document.documentElement;
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const applyTheme = () => {
			const nextTheme = theme === "system" ? getSystemTheme() : theme;
			root.classList.remove("light", "dark");
			root.classList.add(nextTheme);
			root.style.colorScheme = nextTheme;
			updateThemeColor(nextTheme);
			setResolvedTheme(nextTheme);
		};

		applyTheme();

		if (theme !== "system") {
			return;
		}

		mediaQuery.addEventListener("change", applyTheme);
		return () => {
			mediaQuery.removeEventListener("change", applyTheme);
		};
	}, [theme]);

	const value = useMemo(
		() => ({
			resolvedTheme,
			theme,
			setTheme: (nextTheme: Theme) => {
				try {
					localStorage.setItem(storageKey, nextTheme);
				} catch {
					// Ignore storage failures; theme still updates for this session.
				}
				setThemeState(nextTheme);
			},
		}),
		[resolvedTheme, storageKey, theme]
	);

	return (
		<ThemeProviderContext.Provider value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
