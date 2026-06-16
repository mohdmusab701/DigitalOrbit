"use client";

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import SectionHeading from '@/frontend/components/common/SectionHeading';
import ContactForm from '@/frontend/components/forms/ContactForm';

const contactInfo = [
 {
 icon: Mail,
 title: 'Email',
 value: 'mohdmusab701@gmail.com',
 link: 'mailto:mohdmusab701@gmail.com',
 },
 {
 icon: Phone,
 title: 'Phone',
 value: '+91 9335289386',
 link: 'tel:+919335289386',
 },
 {
 icon: MapPin,
 title: 'Address',
 value: 'Jaunpur, Uttar Pradesh, India',
 link: null,
 },
 {
 icon: Clock,
 title: 'Business Hours',
 value: 'Mon - Fri: 9:00 AM - 6:00 PM PST',
 link: null,
 },
];

export default function ContactPage() {
 return (
 <>
 {/* Hero */}
 <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background mesh-gradient relative overflow-hidden">
 <div className="absolute inset-0 dot-pattern opacity-30" />
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
 <SectionHeading
 badge="Contact Us"
 title="Let's Start a Conversation"
 description="Have a project in mind? We'd love to hear about it. Fill out the form below and our team will get back to you within 24 hours."
 />
 </div>
 </section>

 {/* Contact Section */}
 <section className="py-16 lg:py-24 bg-background">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
 {/* Form */}
 <motion.div
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="lg:col-span-3"
 >
 <div className="p-6 lg:p-10 rounded-2xl bg-card border border-border">
 <h3 className="text-xl font-semibold text-foreground mb-6">
 Send Us a Message
 </h3>
 <ContactForm />
 </div>
 </motion.div>

 {/* Contact Info */}
 <motion.div
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: 0.2 }}
 className="lg:col-span-2"
 >
 <div className="space-y-5">
 {contactInfo.map((info, index) => {
 const Icon = info.icon;
 const content = (
 <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary-200 dark:hover:border-primary-800 transition-all">
 <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
 <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
 </div>
 <div>
 <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
 {info.title}
 </p>
 <p className="text-sm font-medium text-foreground whitespace-pre-line">
 {info.value}
 </p>
 </div>
 </div>
 );

 return (
 <motion.div
 key={info.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 >
 {info.link ? (
 <a href={info.link} className="block hover:scale-[1.01] transition-transform">
 {content}
 </a>
 ) : (
 content
 )}
 </motion.div>
 );
 })}
 </div>
 </motion.div>
 </div>
 </div>
 </section>

 {/* Map Placeholder */}
 <section className="bg-background pb-16 lg:pb-24">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="rounded-2xl overflow-hidden border border-border"
 >
 <div className="relative h-72 lg:h-96 bg-muted">
 {/* Map placeholder with styled content */}
 <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-slate-100 dark:from-primary-900/20 dark:to-dark-card">
 <div className="absolute inset-0 dot-pattern opacity-50" />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="text-center">
 <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-600/30">
 <MapPin className="w-7 h-7 text-white" />
 </div>
 <p className="text-lg font-semibold text-foreground mb-1">
 DigitalOrbit HQ
 </p>
 <p className="text-sm text-muted-foreground">
 Jaunpur, Uttar Pradesh, India
 </p>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 </>
 );
}
