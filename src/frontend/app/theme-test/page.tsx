"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Check, Mail, Moon, Sun } from "lucide-react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ThemeTest() {
 const { theme, resolvedTheme, setTheme } = useTheme();
 const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

 if (!mounted) return null;

 return (
 <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
 <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
 <div className="space-y-3">
 <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
 Theme System
 </span>
 <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">Theme Test Page</h1>
 <p className="text-muted-foreground max-w-2xl">
 Current theme: <strong className="text-foreground">{theme}</strong>
 {resolvedTheme && <span> / resolved: <strong className="text-foreground">{resolvedTheme}</strong></span>}
 </p>
 </div>

 <div className="flex flex-wrap gap-3">
 <button 
 onClick={() => setTheme('light')}
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground rounded-xl border border-border hover:bg-muted transition-colors shadow-sm"
 >
 <Sun className="w-4 h-4" />
 Force Light
 </button>
 <button 
 onClick={() => setTheme('dark')}
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground rounded-xl border border-border hover:bg-muted transition-colors shadow-sm"
 >
 <Moon className="w-4 h-4" />
 Force Dark
 </button>
 </div>

 <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
 <div className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
 <h2 className="text-xl font-semibold mb-2">Card</h2>
 <p className="text-muted-foreground leading-relaxed">
 Soft surface using semantic card, border, foreground, and muted text tokens.
 </p>
 </div>
 
 <div className="p-6 rounded-xl bg-muted text-foreground border border-border">
 <h2 className="text-xl font-semibold mb-2">Muted Surface</h2>
 <p className="text-muted-foreground leading-relaxed">
 Secondary background used for quiet panels, table headers, and form fill.
 </p>
 </div>

 <div className="p-6 rounded-xl border border-border bg-card">
 <h2 className="text-xl font-semibold mb-4">Buttons</h2>
 <div className="flex flex-wrap gap-3">
 <button className="px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
 Primary
 </button>
 <button className="px-4 py-2.5 rounded-xl bg-muted text-foreground font-semibold border border-border hover:bg-background transition-colors">
 Secondary
 </button>
 </div>
 </div>
 </div>

 <div className="grid gap-5 lg:grid-cols-2">
 <div className="p-6 rounded-xl border border-border bg-card">
 <h2 className="text-xl font-semibold mb-5">Inputs</h2>
 <div className="space-y-4">
 <label className="block">
 <span className="block text-sm font-medium text-foreground mb-2">Email</span>
 <div className="relative">
 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
 <input
 type="email"
 placeholder="hello@digitalorbit.agency"
 className="w-full pl-10 pr-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
 />
 </div>
 </label>
 <textarea
 placeholder="Message"
 rows={4}
 className="w-full px-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors resize-none"
 />
 </div>
 </div>

 <div className="p-6 rounded-xl border border-border bg-card">
 <h2 className="text-xl font-semibold mb-5">States</h2>
 <div className="space-y-3">
 {["Background", "Text", "Cards", "Borders", "Primary"].map((item) => (
 <div key={item} className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
 <span className="font-medium">{item}</span>
 <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>
 </div>
 );
}
