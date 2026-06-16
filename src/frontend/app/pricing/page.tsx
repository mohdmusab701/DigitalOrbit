"use client";

import SectionHeading from '@/frontend/components/common/SectionHeading';
import PricingCard from '@/frontend/components/ui/PricingCard';
import { plans } from '@/frontend/data/pricing';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, CheckCircle } from 'lucide-react';

const faqs = [
 {
 q: 'How long does a typical project take?',
 a: 'Depending on complexity, projects range from 4–6 weeks for a standard website to 3–6 months for a complex web application or mobile app. We provide a detailed timeline during our initial consultation.',
 },
 {
 q: 'Do you offer ongoing maintenance and support?',
 a: 'Yes! Every package includes a free support period. After that, we offer flexible monthly retainer plans for ongoing maintenance, updates, and feature enhancements.',
 },
 {
 q: 'Can I customize a package to fit my needs?',
 a: 'Absolutely. Our packages are starting points. We tailor every engagement to your specific requirements, budget, and timeline. Contact us for a custom quote.',
 },
 {
 q: 'What technologies do you work with?',
 a: 'We specialize in React, Next.js, React Native, Flutter, Python, Node.js, AWS, GCP, and more. We choose the best technology stack for your specific project needs.',
 },
 {
 q: 'What is your payment structure?',
 a: 'We typically work with a 40% upfront deposit, 30% at the midpoint milestone, and 30% upon project completion. Enterprise clients may negotiate custom payment terms.',
 },
];

export default function PricingPage() {
 return (
 <>
 {/* Hero */}
 <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-background mesh-gradient relative overflow-hidden">
 <div className="absolute inset-0 dot-pattern opacity-30" />
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
 <SectionHeading
 badge="Pricing"
 title="Simple, Transparent Pricing"
 description="Choose the plan that fits your needs. No hidden fees, no surprises. Every plan includes our premium quality guarantee."
 />
 </div>
 </section>

 {/* Pricing Cards */}
 <section className="py-16 lg:py-24 bg-background">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
 {plans.map((plan, index) => (
 <PricingCard key={plan.id} plan={plan} index={index} />
 ))}
 </div>
 </div>
 </section>

 {/* FAQ */}
 <section className="py-16 lg:py-24 bg-muted">
 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
 <SectionHeading
 badge="FAQ"
 title="Frequently Asked Questions"
 description="Got questions? We've got answers. If you don't find what you're looking for, don't hesitate to reach out."
 />
 <div className="space-y-4">
 {faqs.map((faq, index) => (
 <motion.details
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.08 }}
 className="group p-6 rounded-2xl bg-card border border-border cursor-pointer"
 >
 <summary className="flex items-center justify-between font-semibold text-foreground list-none">
 {faq.q}
 <span className="ml-4 text-primary-600 dark:text-primary-400 text-xl group-open:rotate-45 transition-transform">+</span>
 </summary>
 <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
 {faq.a}
 </p>
 </motion.details>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16 lg:py-24 bg-background">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-center p-10 lg:p-16 rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden"
 >
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px]" />
 <MessageCircle className="w-10 h-10 text-primary-200 mx-auto mb-5" />
 <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
 Need a custom solution?
 </h2>
 <p className="text-primary-100/80 mb-8 max-w-lg mx-auto">
 Our Enterprise plan is fully customizable. Talk to our team about your specific requirements and get a tailored proposal.
 </p>
 <Link
 href="/contact"
 className="inline-flex items-center gap-2 px-8 py-4 bg-card text-foreground font-semibold rounded-2xl border border-border hover:bg-muted transition-all hover:shadow-xl"
 >
 Contact Sales
 </Link>
 <div className="flex items-center justify-center gap-6 mt-8 text-sm text-primary-200/70">
 <span className="flex items-center gap-2">
 <CheckCircle className="w-4 h-4" />
 Custom Scope
 </span>
 <span className="flex items-center gap-2">
 <CheckCircle className="w-4 h-4" />
 Dedicated Team
 </span>
 </div>
 </motion.div>
 </div>
 </section>
 </>
 );
}
