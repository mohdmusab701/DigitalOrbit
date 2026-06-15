"use client";

import { motion } from 'framer-motion';
import { Heart, Eye, AtSign, Globe2 } from 'lucide-react';
import SectionHeading from '@/frontend/components/common/SectionHeading';
import { team, stats } from '@/frontend/data/team';

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-16 lg:pb-20 bg-white dark:bg-dark-bg mesh-gradient relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <SectionHeading
            badge="About Us"
            title="We're on a Mission to Transform Digital"
            description="DigitalOrbit was born from a simple belief: every business deserves world-class digital experiences, regardless of size."
          />
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full mb-4">
                Our Story
              </span>
              <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                From a Small Studio to a{' '}
                <span className="gradient-text">Global Agency</span>
              </h2>
              <div className="space-y-4 text-slate-500 dark:text-slate-400 leading-relaxed">
                <p>
                  Founded in 2019, DigitalOrbit started as a two-person studio with a bold vision: 
                  to bridge the gap between cutting-edge technology and exceptional design. We believed 
                  that the best digital products come from the intersection of engineering excellence 
                  and human-centered design.
                </p>
                <p>
                  Today, we&apos;re a team of 45+ engineers, designers, and strategists serving 200+ 
                  clients across 30 countries. We&apos;ve helped startups secure millions in funding, 
                  enterprises modernize their tech stacks, and brands create unforgettable digital 
                  experiences.
                </p>
                <p>
                  Our work has been recognized by Awwwards, CSS Design Awards, and ProductHunt, 
                  and our clients include some of the most innovative companies in the world. But 
                  what we&apos;re most proud of is the lasting partnerships we&apos;ve built along the way.
                </p>
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-7xl lg:text-8xl font-black opacity-20 mb-2">DO</div>
                    <div className="text-lg font-medium opacity-60">Since 2019</div>
                  </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-8 right-8 w-24 h-24 border border-white/20 rounded-full" />
                <div className="absolute bottom-12 left-12 w-16 h-16 border border-white/15 rounded-lg rotate-45" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-1/3 right-1/4 w-40 h-40 border border-white/10 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-200/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 lg:p-10 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mb-5">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Our Mission
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                To democratize access to world-class digital experiences by combining 
                cutting-edge technology with human-centered design. We believe every 
                business, from scrappy startups to Fortune 500 enterprises, deserves 
                digital products that inspire, engage, and convert.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="p-8 lg:p-10 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Our Vision
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                To become the most trusted digital partner for innovative companies 
                worldwide. We envision a future where technology and design work in 
                perfect harmony to solve complex challenges and create meaningful 
                impact across every industry.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Team"
            title="Meet the People Behind the Orbit"
            description="A diverse team of engineers, designers, and strategists who are passionate about building exceptional digital products."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="p-6 lg:p-8 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 text-center">
                  {/* Avatar */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-5 text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300`}>
                    {member.avatar}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                    {member.bio}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={member.social.linkedin}
                      className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-primary-50 dark:hover:bg-primary-900/30 flex items-center justify-center transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <AtSign className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </a>
                    <a
                      href={member.social.twitter}
                      className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-primary-50 dark:hover:bg-primary-900/30 flex items-center justify-center transition-colors"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <Globe2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
