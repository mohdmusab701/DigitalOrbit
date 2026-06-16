"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeTest() {
 const { theme, setTheme } = useTheme();
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 setMounted(true);
 }, []);

 if (!mounted) return null;

 return (
 <div className="p-20 flex flex-col gap-8 bg-background min-h-screen text-foreground transition-colors duration-300">
 <h1 className="text-4xl font-bold">Theme Test Page</h1>
 <p>Current theme: <strong>{theme}</strong></p>
 
 <div className="flex gap-4">
 <button 
 onClick={() => setTheme('light')}
 className="px-4 py-2 bg-slate-200 text-foreground rounded dark:bg-slate-800 dark:text-slate-100"
 >
 Force Light
 </button>
 <button 
 onClick={() => setTheme('dark')}
 className="px-4 py-2 bg-slate-200 text-foreground rounded dark:bg-slate-800 dark:text-slate-100"
 >
 Force Dark
 </button>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="p-6 rounded-xl border border-border bg-card">
 <h2 className="text-xl font-semibold mb-2">Card Element</h2>
 <p className="text-muted-foreground">
 This card uses <code className="bg-muted px-1 py-0.5 rounded text-sm">bg-card</code> and <code className="bg-muted px-1 py-0.5 rounded text-sm">border-border</code>.
 The text uses <code className="bg-muted px-1 py-0.5 rounded text-sm">text-muted-foreground</code>.
 </p>
 </div>
 
 <div className="p-6 rounded-xl bg-muted text-foreground">
 <h2 className="text-xl font-semibold mb-2">Muted Element</h2>
 <p>
 This block uses <code className="bg-background px-1 py-0.5 rounded text-sm">bg-muted</code>.
 </p>
 </div>
 </div>
 </div>
 );
}
