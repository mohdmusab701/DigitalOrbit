"use client";

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import { createContext, useContext, useEffect, useSyncExternalStore, ReactNode } from "react";

interface ThemeContextType {
 isDark: boolean;
 mounted: boolean;
 toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsClient() {
 return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

function ThemeContextProvider({ children }: { children: ReactNode }) {
 const { resolvedTheme, setTheme } = useNextTheme();
 const mounted = useIsClient();

 const isDark = mounted ? resolvedTheme === "dark" : false;

 const toggleTheme = () => {
 setTheme(isDark ? "light" : "dark");
 };

 return (
 <ThemeContext.Provider value={{ isDark, mounted, toggleTheme }}>
 {children}
 </ThemeContext.Provider>
 );
}

function ThemeColorUpdater() {
 const { resolvedTheme } = useNextTheme();

 useEffect(() => {
 if (!resolvedTheme) return;

 const lightColor = "#ffffff";
 const darkColor = "#0a0e1a";
 const activeColor = resolvedTheme === "dark" ? darkColor : lightColor;

 let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
 if (!meta) {
 meta = document.createElement("meta");
 meta.name = "theme-color";
 document.head.appendChild(meta);
 }
 meta.content = activeColor;
 }, [resolvedTheme]);

 return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
 return (
 <NextThemesProvider
 attribute="class"
 defaultTheme="light"
 enableSystem={false}
 enableColorScheme
 storageKey="digitalorbit-theme"
 disableTransitionOnChange={false}
 >
 <ThemeColorUpdater />
 <ThemeContextProvider>
 {children}
 </ThemeContextProvider>
 </NextThemesProvider>
 );
}

export const useTheme = () => {
 const context = useContext(ThemeContext);
 if (!context) throw new Error("useTheme must be used within ThemeProvider");
 return context;
};
