"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Orbit } from 'lucide-react';
import { useTheme } from '@/frontend/hooks/useTheme';

const navLinks = [
 { name: 'Home', path: '/' },
 { name: 'Services', path: '/services' },
 { name: 'AI Solutions', path: '/ai-solutions' },
 { name: 'Portfolio', path: '/portfolio' },
 { name: 'About', path: '/about' },
 { name: 'Pricing', path: '/pricing' },
 { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
 const [isOpen, setIsOpen] = useState(false);
 const [scrolled, setScrolled] = useState(false);
 const [mounted, setMounted] = useState(false);
 const { isDark, toggleTheme } = useTheme();
 const pathname = usePathname();

 useEffect(() => {
 setMounted(true);
 }, []);

 useEffect(() => {
 const handleScroll = () => setScrolled(window.scrollY > 20);
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 useEffect(() => {
 setIsOpen(false);
 }, [pathname]);

 return (
 <motion.nav
 initial={{ y: -100 }}
 animate={{ y: 0 }}
 transition={{ duration: 0.6, ease: 'easeOut' }}
 className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
 scrolled
 ? 'glass shadow-lg shadow-black/5 dark:shadow-black/20'
 : 'bg-transparent'
 }`}
 >
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between h-16 lg:h-20">
 {/* Logo */}
 <Link href="/" className="flex items-center gap-2 group">
 <div className="relative">
 <Orbit className="w-8 h-8 text-primary-600 group-hover:text-primary-500 transition-colors" strokeWidth={2.5} />
 <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
 </div>
 <span className="text-xl font-bold tracking-tight text-primary-900 dark:text-white">
 Digital<span className="gradient-text">Orbit</span>
 </span>
 </Link>

 {/* Desktop Navigation */}
 <div className="hidden lg:flex items-center gap-1">
 {navLinks.map((link) => {
 const isActive = pathname === link.path;
 return (
 <Link
 key={link.name}
 href={link.path}
 className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
 isActive
 ? 'text-primary-600 dark:text-primary-400'
 : 'text-muted-foreground hover:text-primary-600 dark:hover:text-primary-400'
 }`}
 >
 {link.name}
 {isActive && (
 <motion.div
 layoutId="navbar-indicator"
 className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
 transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
 />
 )}
 </Link>
 );
 })}
 </div>

 {/* Right Side */}
 <div className="flex items-center gap-3">
 <button
 onClick={toggleTheme}
 className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
 aria-label="Toggle theme"
 >
 <AnimatePresence mode="wait">
 {mounted && (
 isDark ? (
 <motion.div
 key="sun"
 initial={{ rotate: -90, opacity: 0 }}
 animate={{ rotate: 0, opacity: 1 }}
 exit={{ rotate: 90, opacity: 0 }}
 transition={{ duration: 0.2 }}
 >
 <Sun className="w-5 h-5 text-amber-400" />
 </motion.div>
 ) : (
 <motion.div
 key="moon"
 initial={{ rotate: 90, opacity: 0 }}
 animate={{ rotate: 0, opacity: 1 }}
 exit={{ rotate: -90, opacity: 0 }}
 transition={{ duration: 0.2 }}
 >
 <Moon className="w-5 h-5 text-slate-600" />
 </motion.div>
 )
 )}
 </AnimatePresence>
 </button>

 <Link
 href="/book"
 className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary-600/25 active:scale-95"
 >
 Book a Call
 </Link>

 {/* Mobile Menu Toggle */}
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
 aria-label="Toggle menu"
 >
 {isOpen ? (
 <X className="w-5 h-5 text-slate-700 dark:text-white" />
 ) : (
 <Menu className="w-5 h-5 text-slate-700 dark:text-white" />
 )}
 </button>
 </div>
 </div>
 </div>

 {/* Mobile Menu */}
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.3, ease: 'easeInOut' }}
 className="lg:hidden overflow-hidden glass border-t border-border"
 >
 <div className="px-4 py-4 space-y-1">
 {navLinks.map((link, index) => {
 const isActive = pathname === link.path;
 return (
 <motion.div
 key={link.name}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: index * 0.05 }}
 >
 <Link
 href={link.path}
 className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
 isActive
 ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
 : 'text-muted-foreground hover:bg-slate-50 dark:hover:bg-white/5'
 }`}
 >
 {link.name}
 </Link>
 </motion.div>
 );
 })}
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: navLinks.length * 0.05 }}
 className="pt-2"
 >
 <Link
 href="/book"
 className="block w-full text-center px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all"
 >
 Book a Call
 </Link>
 </motion.div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.nav>
 );
}
