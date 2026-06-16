"use client";

import { motion } from 'framer-motion';
import { Orbit } from 'lucide-react';

export default function LoadingScreen() {
 return (
 <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
 <motion.div
 initial={{ opacity: 0, scale: 0.8 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center"
 >
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
 className="inline-block mb-4"
 >
 <Orbit className="w-10 h-10 text-primary-600" strokeWidth={2} />
 </motion.div>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.3 }}
 >
 <p className="text-lg font-bold text-foreground">
 Digital<span className="gradient-text">Orbit</span>
 </p>
 <div className="mt-4 w-32 h-1 bg-muted dark:bg-white/10 rounded-full mx-auto overflow-hidden">
 <motion.div
 initial={{ x: '-100%' }}
 animate={{ x: '100%' }}
 transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
 className="h-full w-1/2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
 />
 </div>
 </motion.div>
 </motion.div>
 </div>
 );
}
