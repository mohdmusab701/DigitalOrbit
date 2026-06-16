"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Mail, Lock, ArrowRight, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLoginPage() {
 const router = useRouter();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError(null);

 try {
 const res = await fetch("/api/client/auth/login", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ email, password }),
 });
 const json = await res.json();

 if (!res.ok || !json.success) {
 throw new Error(json.error || "Login failed");
 }

 router.push("/client/dashboard");
 router.refresh();
 } catch (err) {
 setError((err as Error).message);
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-muted flex items-center justify-center p-4 selection:bg-primary-500/30">
 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
 
 {/* Decorative background blobs */}
 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease: "easeOut" }}
 className="w-full max-w-md relative z-10"
 >
 <div className="text-center mb-10">
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
 className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20"
 >
 <UserCircle className="w-8 h-8 text-white" />
 </motion.div>
 <h1 className="text-3xl font-bold text-foreground mb-2">Client Portal</h1>
 <p className="text-muted-foreground">Sign in to view your projects and invoices.</p>
 </div>

 <div className="bg-white/80 /80 backdrop-blur-xl border border-slate-200/50 /50 rounded-3xl p-8 shadow-2xl">
 <form onSubmit={handleSubmit} className="space-y-6">
 <AnimatePresence>
 {error && (
 <motion.div
 initial={{ opacity: 0, height: 0, marginBottom: 0 }}
 animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
 exit={{ opacity: 0, height: 0, marginBottom: 0 }}
 className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm"
 >
 <AlertCircle className="w-4 h-4 shrink-0" />
 <p>{error}</p>
 </motion.div>
 )}
 </AnimatePresence>

 <div className="space-y-1.5">
 <label className="text-sm font-medium text-muted-foreground ml-1">Email Address</label>
 <div className="relative group">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
 <input
 required
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="name@company.com"
 className="w-full pl-12 pr-4 py-3.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <div className="flex items-center justify-between ml-1">
 <label className="text-sm font-medium text-muted-foreground">Password</label>
 </div>
 <div className="relative group">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
 <input
 required
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="••••••••"
 className="w-full pl-12 pr-4 py-3.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
 />
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full relative group overflow-hidden bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-3.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
 >
 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
 <div className="relative flex items-center justify-center gap-2 font-semibold">
 {loading ? (
 <>
 <Loader2 className="w-5 h-5 animate-spin" />
 Signing in...
 </>
 ) : (
 <>
 Sign In
 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
 </>
 )}
 </div>
 </button>
 </form>
 </div>
 </motion.div>
 </div>
 );
}
