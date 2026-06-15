"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white/10 text-white/80 rounded-full mb-6">
            Ready to Start?
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Let&apos;s Build Something{' '}
            <span className="text-primary-200">Extraordinary</span> Together
          </h2>
          <p className="text-lg text-primary-100/80 mb-10 max-w-2xl mx-auto">
            Whether you need a stunning website, a powerful mobile app, or an AI-driven solution, 
            we&apos;re ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 font-semibold rounded-2xl hover:bg-primary-50 transition-all hover:shadow-xl hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get a Free Consultation
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all"
            >
              View Pricing
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-primary-200/70">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Free Consultation
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              No Commitment
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              24h Response
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
