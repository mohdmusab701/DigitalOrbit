"use client";

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
 isDark: boolean;
 toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function ThemeContextProvider({ children }: { children: ReactNode }) {
 const { theme, setTheme, systemTheme } = useNextTheme();
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 setMounted(true);
 }, []);

 const currentTheme = theme === "system" ? systemTheme : theme;
 const isDark = mounted ? currentTheme === "dark" : false;

 const toggleTheme = () => {
 setTheme(isDark ? "light" : "dark");
 };

 return (
 <ThemeContext.Provider value={{ isDark, toggleTheme }}>
 {children}
 </ThemeContext.Provider>
 );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
 return (
 <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
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
