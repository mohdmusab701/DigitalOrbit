import { 
  MessageSquarePlus, 
  Bot, 
  MessageCircle, 
  Mic, 
  Workflow, 
  Cpu,
  Clock,
  TrendingUp,
  LineChart,
  Zap,
  Target,
  Settings
} from 'lucide-react';
import { ElementType } from 'react';

export interface AIService {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  color: string;
  benefits: string[];
}

export interface AIBenefit {
  title: string;
  description: string;
  icon: ElementType;
}

export interface AIShowcaseItem {
  id: string;
  title: string;
  description: string;
  gradient: string;
  category: string;
}

export interface AIStat {
  value: string;
  label: string;
}

export const aiServices: AIService[] = [
  {
    id: 'ai-chatbot-development',
    title: 'AI Chatbot Development',
    description: 'Intelligent conversational interfaces that understand context, handle complex queries, and provide human-like interactions across all platforms.',
    icon: MessageSquarePlus,
    color: 'from-blue-500 to-indigo-500',
    benefits: ['Custom AI Chatbots', 'Website Chatbots', 'Customer Support Automation', 'Lead Generation Chatbots'],
  },
  {
    id: 'ai-agent-development',
    title: 'AI Agent Development',
    description: 'Autonomous AI agents capable of reasoning, planning, and executing complex multi-step workflows to automate your entire business operations.',
    icon: Bot,
    color: 'from-violet-500 to-fuchsia-500',
    benefits: ['Business Automation Agents', 'Customer Service Agents', 'Sales Agents', 'Multi-Agent Systems'],
  },
  {
    id: 'whatsapp-ai-automation',
    title: 'WhatsApp AI Automation',
    description: 'Engage customers where they already are. Deploy smart AI agents on WhatsApp for instant support, sales, and automated booking.',
    icon: MessageCircle,
    color: 'from-emerald-400 to-emerald-600',
    benefits: ['WhatsApp API Integration', 'Automated Ordering', 'Appointment Booking', 'Proactive Outreach'],
  },
  {
    id: 'voice-ai-assistant',
    title: 'Voice AI Assistant',
    description: 'Next-generation voice AI that can handle inbound customer calls, qualify leads, and schedule appointments with natural human-like voice synthesis.',
    icon: Mic,
    color: 'from-amber-400 to-orange-500',
    benefits: ['Inbound Call Handling', 'Outbound Sales Calls', 'Multi-language Support', 'Voice Authentication'],
  },
  {
    id: 'business-process-automation',
    title: 'Business Process Automation',
    description: 'Streamline operations by connecting your internal tools and databases with AI models to automate repetitive administrative and data-entry tasks.',
    icon: Workflow,
    color: 'from-sky-400 to-blue-600',
    benefits: ['Data Extraction', 'Workflow Automation', 'Document Processing', 'ERP/CRM Integration'],
  },
  {
    id: 'custom-ai-solutions',
    title: 'Custom AI Solutions',
    description: 'Tailored machine learning models and Generative AI applications designed specifically for your unique industry challenges and datasets.',
    icon: Cpu,
    color: 'from-rose-400 to-red-600',
    benefits: ['Custom LLM Fine-tuning', 'RAG Implementation', 'Predictive Analytics', 'Computer Vision'],
  },
];

export const aiBenefits: AIBenefit[] = [
  {
    title: '24/7 Customer Support',
    description: 'Never miss a customer query. AI provides instant, accurate responses around the clock, improving satisfaction and retention.',
    icon: Clock,
  },
  {
    title: 'Automatic Lead Generation',
    description: 'Qualify leads automatically and schedule meetings 24/7 without human intervention.',
    icon: Target,
  },
  {
    title: 'Reduced Operational Costs',
    description: 'Automate repetitive tasks and inquiries, drastically reducing overhead and support costs.',
    icon: TrendingUp,
  },
  {
    title: 'Faster Response Times',
    description: 'Provide instant answers to complex questions, reducing wait times from hours to milliseconds.',
    icon: Zap,
  },
  {
    title: 'Increased Sales Conversions',
    description: 'AI agents proactively engage visitors, recommend products, and guide users through the checkout process.',
    icon: LineChart,
  },
  {
    title: 'Business Automation',
    description: 'Connect AI with your existing tools to automate workflows, data entry, and report generation.',
    icon: Settings,
  },
];

export const aiShowcase: AIShowcaseItem[] = [
  {
    id: 'customer-support-bot',
    title: 'AI Customer Support Bot',
    description: 'A custom RAG-powered chatbot resolving 80% of Level 1 support tickets instantly.',
    gradient: 'from-blue-600 to-indigo-600',
    category: 'Customer Support',
  },
  {
    id: 'sales-assistant',
    title: 'AI Sales Assistant',
    description: 'An autonomous agent that qualifies inbound leads and books demos directly into the CRM.',
    gradient: 'from-violet-600 to-purple-600',
    category: 'Sales',
  },
  {
    id: 'whatsapp-agent',
    title: 'AI WhatsApp Agent',
    description: 'A WhatsApp-based ordering system handling payments and customer inquiries for retail.',
    gradient: 'from-emerald-500 to-teal-600',
    category: 'Automation',
  },
  {
    id: 'real-estate-assistant',
    title: 'AI Real Estate Assistant',
    description: 'An AI that matches buyers with properties and schedules viewings 24/7.',
    gradient: 'from-amber-500 to-orange-600',
    category: 'Real Estate',
  },
  {
    id: 'ecommerce-assistant',
    title: 'AI E-commerce Assistant',
    description: 'A personal shopping assistant that recommends products based on conversational context.',
    gradient: 'from-rose-500 to-pink-600',
    category: 'E-commerce',
  },
  {
    id: 'education-assistant',
    title: 'AI Education Assistant',
    description: 'A personalized tutoring AI that adapts to student learning paces and answers curriculum questions.',
    gradient: 'from-cyan-500 to-blue-600',
    category: 'EdTech',
  },
];

export const aiStats: AIStat[] = [
  { value: '70%', label: 'Support Cost Reduction' },
  { value: '3x', label: 'Faster Customer Response' },
  { value: '24/7', label: 'Availability & Support' },
  { value: '95%', label: 'Customer Satisfaction' },
];
