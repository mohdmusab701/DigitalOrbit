"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle, Bot } from 'lucide-react';

export default function AICTASection() {
 return (
 <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="relative rounded-3xl overflow-hidden"
 >
 {/* Background Gradients */}
 <div className="absolute inset-0 bg-slate-900" />
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
 <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
 
 <div className="relative p-10 lg:p-20 text-center z-10 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
 <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30 bg-indigo-500/20 text-indigo-200 rounded-full mb-8">
 <Bot className="w-4 h-4" />
 Start Your AI Journey
 </span>
 
 <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
 Ready To Build Your <br />
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
 AI Solution?
 </span>
 </h2>
 
 <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
 From AI Chatbots to Advanced Autonomous Agents, we build intelligent systems that help businesses scale faster. Schedule a call with our AI experts today.
 </p>
 
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
 <Link
 href="/contact"
 className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-card text-foreground font-bold rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
 >
 <span className="relative z-10 flex items-center gap-2">
 Book Free Consultation
 <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
 </span>
 </Link>
 
 <Link
 href="/contact"
 className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all w-full sm:w-auto"
 >
 Get AI Demo
 </Link>
 </div>
 
 <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12 text-sm text-slate-400">
 <span className="flex items-center gap-2">
 <CheckCircle className="w-4 h-4 text-emerald-400" />
 Free Discovery Call
 </span>
 <span className="flex items-center gap-2">
 <CheckCircle className="w-4 h-4 text-emerald-400" />
 Custom AI Strategy
 </span>
 <span className="hidden sm:flex items-center gap-2">
 <CheckCircle className="w-4 h-4 text-emerald-400" />
 No Obligation
 </span>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 );
}
