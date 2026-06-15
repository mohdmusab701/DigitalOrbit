import Link from 'next/link';
import { Orbit, Mail, Phone, MapPin, ArrowUpRight, Globe2, AtSign, GitFork, Share2 } from 'lucide-react';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'AI Solutions', path: '/ai-solutions' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'About', path: '/about' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact', path: '/contact' },
];

const serviceLinks = [
  { name: 'Web Development', path: '/services#web-development' },
  { name: 'Mobile Apps', path: '/services#mobile-development' },
  { name: 'UI/UX Design', path: '/services#ui-ux-design' },
  { name: 'AI Solutions', path: '/services#ai-solutions' },
  { name: 'Cloud & DevOps', path: '/services#cloud-devops' },
  { name: 'Digital Marketing', path: '/services#digital-marketing' },
];

const socialLinks = [
  { icon: Globe2, href: '#', label: 'Twitter / X' },
  { icon: AtSign, href: '#', label: 'LinkedIn' },
  { icon: GitFork, href: '#', label: 'GitHub' },
  { icon: Share2, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 dark:bg-dark-bg text-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-500 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* CTA Banner */}
        <div className="py-12 lg:py-16 border-b border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                Ready to launch your next project?
              </h2>
              <p className="text-slate-400 text-lg">
                Let&apos;s build something extraordinary together.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 font-semibold rounded-2xl hover:bg-primary-50 transition-all hover:shadow-xl hover:shadow-white/10"
            >
              Start a Project
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <Orbit className="w-7 h-7 text-primary-400" strokeWidth={2.5} />
              <span className="text-xl font-bold">
                Digital<span className="text-primary-400">Orbit</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              We craft premium digital experiences that help businesses build smarter, grow faster, and orbit higher in the digital space.
            </p>
            <div className="space-y-3">
              <a href="mailto:mohdmusab701@gmail.com" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-primary-400" />
                mohdmusab701@gmail.com
              </a>
              <a href="tel:+919335289386" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-primary-400" />
                +919335289386
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
                jaunpur,UttarPradesh,India
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Stay Connected
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              Follow us on social media for the latest updates, insights, and project showcases.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary-600 flex items-center justify-center transition-all hover:scale-110"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} DigitalOrbit. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
