"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';

export default function AIHeroSection() {
 return (
 <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
 {/* Premium AI Decorative Background */}
 <div className="absolute inset-0 dot-pattern opacity-40" />
 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-full blur-[120px] opacity-50 translate-x-1/3 -translate-y-1/4" />
 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-[120px] opacity-50 -translate-x-1/3 translate-y-1/4" />
 
 <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10 w-full">
 <div className="max-w-4xl mx-auto text-center">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="mb-8 flex justify-center"
 >
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm font-medium text-indigo-600 dark:text-indigo-400 backdrop-blur-md">
 <Sparkles className="w-4 h-4" />
 <span>Next-Generation AI Solutions</span>
 </div>
 </motion.div>

 <motion.h1
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.1 }}
 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight"
 >
 Automate Your Business <br className="hidden sm:block" />
 With <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500">Intelligent AI</span>
 </motion.h1>

 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
 >
 From intelligent conversational chatbots to autonomous multi-agent systems, we build premium AI solutions that help modern businesses scale faster and reduce costs.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.3 }}
 className="flex flex-col sm:flex-row items-center justify-center gap-4"
 >
 <Link
 href="/contact"
 className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-semibold rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
 >
 {/* Button gradient hover effect */}
 <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
 Book Free Consultation
 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </span>
 </Link>
 
 <Link
 href="/contact"
 className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/50 dark:bg-white/5 hover:bg-card dark:hover:bg-white/10 text-foreground font-semibold rounded-2xl border border-border dark:border-white/10 backdrop-blur-md transition-all hover:shadow-lg w-full sm:w-auto"
 >
 <Bot className="w-5 h-5 text-indigo-500" />
 Get AI Demo
 </Link>
 </motion.div>
 </div>
 </div>
 </section>
 );
}
