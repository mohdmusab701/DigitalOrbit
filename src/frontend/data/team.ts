import { TeamMember, Stat } from '@/shared/types';

export const team: TeamMember[] = [
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'CEO & Founder',
    bio: 'Former Google engineer with 12+ years in tech. Passionate about building products that make a difference.',
    avatar: 'AR',
    social: { linkedin: '#', twitter: '#' },
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    name: 'Maya Johnson',
    role: 'CTO',
    bio: 'Full-stack architect specializing in distributed systems. Led engineering teams at Amazon and Stripe.',
    avatar: 'MJ',
    social: { linkedin: '#', twitter: '#' },
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: 3,
    name: 'Daniel Kim',
    role: 'Head of Design',
    bio: 'Award-winning designer with a focus on creating intuitive, accessible, and beautiful digital experiences.',
    avatar: 'DK',
    social: { linkedin: '#', twitter: '#' },
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 4,
    name: 'Sophia Martinez',
    role: 'Head of AI',
    bio: 'PhD in Machine Learning from MIT. Published researcher in NLP and computer vision with 50+ papers.',
    avatar: 'SM',
    social: { linkedin: '#', twitter: '#' },
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 5,
    name: 'Ryan Foster',
    role: 'Lead Developer',
    bio: 'Open-source contributor and React specialist. Built applications serving millions of users globally.',
    avatar: 'RF',
    social: { linkedin: '#', twitter: '#' },
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    id: 6,
    name: 'Lena Okafor',
    role: 'Head of Marketing',
    bio: 'Growth marketing expert who scaled multiple startups from zero to IPO through data-driven strategies.',
    avatar: 'LO',
    social: { linkedin: '#', twitter: '#' },
    gradient: 'from-sky-500 to-indigo-500',
  },
];

export const stats: Stat[] = [
  { label: 'Projects Completed', value: '350+' },
  { label: 'Happy Clients', value: '200+' },
  { label: 'Team Members', value: '45+' },
  { label: 'Countries Served', value: '30+' },
];
