import { Project } from '@/shared/types';

export const categories = [
  'All',
  'Web Development',
  'Mobile Apps',
  'AI Solutions',
  'UI/UX Design',
];

export const projects: Project[] = [
  {
    id: 1,
    title: 'Nexus E-Commerce Platform',
    category: 'Web Development',
    description: 'A modern, high-performance e-commerce platform built with Next.js and Stripe integration.',
    gradient: 'from-blue-500 to-cyan-400',
    image: '/images/portfolio/nexus.jpg',
    stats: {
      users: '50k+',
      growth: '+120%',
    },
    tags: ['Next.js', 'React', 'Stripe', 'Tailwind CSS'],
  },
  {
    id: 2,
    title: 'Aura Fitness App',
    category: 'Mobile Apps',
    description: 'A comprehensive fitness tracking mobile application with AI-powered workout recommendations.',
    gradient: 'from-purple-500 to-pink-500',
    image: '/images/portfolio/aura.jpg',
    stats: {
      users: '100k+',
      growth: '+250%',
    },
    tags: ['React Native', 'Firebase', 'AI', 'Node.js'],
  },
  {
    id: 3,
    title: 'Cognitive Data Engine',
    category: 'AI Solutions',
    description: 'An advanced data processing engine using machine learning algorithms to uncover business insights.',
    gradient: 'from-emerald-400 to-teal-500',
    image: '/images/portfolio/cognitive.jpg',
    stats: {
      users: '200+',
      growth: '+40%',
    },
    tags: ['Python', 'TensorFlow', 'AWS', 'React'],
  },
  {
    id: 4,
    title: 'FinTech Dashboard UI',
    category: 'UI/UX Design',
    description: 'A sleek, intuitive dashboard design for a modern financial technology startup.',
    gradient: 'from-orange-400 to-red-500',
    image: '/images/portfolio/fintech.jpg',
    stats: {
      users: '10k+',
      growth: '+85%',
    },
    tags: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
  },
  {
    id: 5,
    title: 'Smart Home Hub',
    category: 'Web Development',
    description: 'Centralized control panel for smart home devices with real-time monitoring and automation.',
    gradient: 'from-indigo-500 to-blue-600',
    image: '/images/portfolio/smarthome.jpg',
    stats: {
      users: '25k+',
      growth: '+150%',
    },
    tags: ['Vue.js', 'IoT', 'WebSockets', 'Node.js'],
  },
  {
    id: 6,
    title: 'Language Learning Bot',
    category: 'AI Solutions',
    description: 'Conversational AI chatbot that helps users learn new languages through natural dialogue.',
    gradient: 'from-yellow-400 to-orange-500',
    image: '/images/portfolio/languagebot.jpg',
    stats: {
      users: '75k+',
      growth: '+300%',
    },
    tags: ['OpenAI API', 'Next.js', 'PostgreSQL', 'Tailwind'],
  }
];
