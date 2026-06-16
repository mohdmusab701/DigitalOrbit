"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/frontend/components/common/SectionHeading';
import { aiShowcase } from '@/frontend/data/ai-solutions';

export default function AIShowcaseSection() {
 return (
 <section className="py-20 lg:py-32 bg-muted">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <SectionHeading
 badge="Case Studies"
 title="See Our AI in Action"
 description="Explore real-world examples of how our intelligent solutions are transforming businesses across various industries."
 />

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
 {aiShowcase.map((item, index) => (
 <motion.div
 key={item.id}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ duration: 0.5, delay: index * 0.1 }}
 className="group cursor-pointer"
 >
 <div className="relative rounded-3xl overflow-hidden bg-card border border-border transition-all duration-500 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-1">
 {/* Visual Area */}
 <div className={`relative h-56 bg-gradient-to-br ${item.gradient} overflow-hidden`}>
 <div className="absolute inset-0 bg-black/10" />
 
 {/* Decorative Neural Network-like pattern */}
 <div className="absolute inset-0 opacity-20">
 <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
 <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white]" />
 <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
 <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
 <line x1="25%" y1="50%" x2="66%" y2="33%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
 <line x1="66%" y1="33%" x2="75%" y2="75%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
 <line x1="25%" y1="50%" x2="75%" y2="75%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
 </svg>
 </div>

 {/* Hover Overlay */}
 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
 <div className="flex items-center gap-2 text-white font-medium px-6 py-3 rounded-full border-2 border-white/30 hover:bg-white/20 transition-colors">
 View Solution
 <ArrowUpRight className="w-5 h-5" />
 </div>
 </div>

 <div className="absolute top-4 left-4">
 <span className="px-3 py-1.5 text-xs font-semibold bg-white/20 backdrop-blur-md text-white rounded-full shadow-sm">
 {item.category}
 </span>
 </div>
 </div>

 {/* Content */}
 <div className="p-8">
 <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
 {item.title}
 </h3>
 <p className="text-muted-foreground leading-relaxed text-sm">
 {item.description}
 </p>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}
