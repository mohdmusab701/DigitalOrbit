/**
 * DigitalOrbit AI Chatbot Engine
 *
 * A rule-based NLP chatbot with intent detection, entity extraction,
 * and a curated knowledge base about DigitalOrbit services.
 * Structured for easy migration to an LLM backend in the future.
 */

// ─── Knowledge Base ───────────────────────────────────────────

interface ServiceInfo {
  name: string;
  slug: string;
  keywords: string[];
  shortDescription: string;
  features: string[];
  startingPrice?: string;
}

const SERVICES: ServiceInfo[] = [
  {
    name: "Web Development",
    slug: "web-development",
    keywords: ["website", "web", "webapp", "web app", "frontend", "backend", "full stack", "fullstack", "landing page", "react", "next", "nextjs"],
    shortDescription: "Custom websites and web applications built with modern technologies like React, Next.js, and Node.js.",
    features: ["Responsive Design", "SEO Optimization", "Custom CMS", "E-commerce Integration", "Progressive Web Apps"],
    startingPrice: "₹25,000",
  },
  {
    name: "Mobile App Development",
    slug: "mobile-app",
    keywords: ["mobile", "app", "android", "ios", "flutter", "react native", "application", "phone app"],
    shortDescription: "Native and cross-platform mobile applications for iOS and Android.",
    features: ["Cross-Platform (Flutter/React Native)", "Native Performance", "Push Notifications", "Offline Support", "App Store Deployment"],
    startingPrice: "₹50,000",
  },
  {
    name: "UI/UX Design",
    slug: "ui-ux-design",
    keywords: ["design", "ui", "ux", "user interface", "user experience", "figma", "prototype", "wireframe", "mockup"],
    shortDescription: "Beautiful, intuitive interfaces designed to delight users and drive conversions.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
    startingPrice: "₹15,000",
  },
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    keywords: ["marketing", "seo", "ads", "google ads", "facebook ads", "social media", "smm", "sem", "ppc", "advertising", "branding"],
    shortDescription: "Data-driven marketing strategies to grow your online presence and revenue.",
    features: ["SEO", "PPC Campaigns", "Social Media Marketing", "Content Marketing", "Analytics & Reporting"],
    startingPrice: "₹10,000/month",
  },
  {
    name: "AI & Automation",
    slug: "ai-automation",
    keywords: ["ai", "artificial intelligence", "automation", "machine learning", "ml", "chatbot", "bot", "data science"],
    shortDescription: "Intelligent automation solutions to streamline your business operations.",
    features: ["Custom Chatbots", "Process Automation", "Data Analytics", "Predictive Models", "AI Integration"],
    startingPrice: "₹40,000",
  },
  {
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    keywords: ["cloud", "devops", "aws", "azure", "gcp", "hosting", "deployment", "docker", "kubernetes", "ci/cd", "server"],
    shortDescription: "Cloud infrastructure and DevOps solutions for scalable, reliable applications.",
    features: ["Cloud Migration", "CI/CD Pipelines", "Container Orchestration", "Monitoring", "Cost Optimization"],
    startingPrice: "₹20,000",
  },
];

// ─── FAQ Knowledge Base ───────────────────────────────────────

interface FAQ {
  keywords: string[];
  patterns: RegExp[];
  response: string;
}

const FAQS: FAQ[] = [
  {
    keywords: ["pricing", "cost", "price", "rate", "charge", "fee", "budget", "expensive", "cheap", "affordable", "how much", "quotation", "quote"],
    patterns: [/how much/i, /what.*cost/i, /pric/i, /quot/i, /budget/i],
    response: "Our pricing varies based on project scope and complexity. Here's a rough guide:\n\n• Web Development: Starting from ₹25,000\n• Mobile Apps: Starting from ₹50,000\n• UI/UX Design: Starting from ₹15,000\n• Digital Marketing: Starting from ₹10,000/month\n• AI & Automation: Starting from ₹40,000\n\nWe'd love to give you an exact quote! Could you share your requirements so we can prepare a custom proposal?",
  },
  {
    keywords: ["timeline", "time", "duration", "how long", "delivery", "deadline", "turnaround"],
    patterns: [/how long/i, /timeline/i, /deliver/i, /turnaround/i, /when.*ready/i],
    response: "Typical project timelines:\n\n• Landing Pages: 1-2 weeks\n• Full Websites: 3-6 weeks\n• Mobile Apps: 6-12 weeks\n• UI/UX Design: 2-4 weeks\n\nTimelines depend on complexity and revisions. We always provide a detailed timeline during the proposal stage!",
  },
  {
    keywords: ["technology", "tech stack", "technologies", "tools", "framework", "stack"],
    patterns: [/tech.*stack/i, /technolog/i, /what.*use/i, /framework/i],
    response: "We work with cutting-edge technologies:\n\n• Frontend: React, Next.js, TypeScript, Tailwind CSS\n• Backend: Node.js, Express, Python\n• Mobile: Flutter, React Native\n• Database: MongoDB, PostgreSQL\n• Cloud: AWS, Google Cloud, Vercel\n• AI/ML: TensorFlow, OpenAI APIs\n\nWe choose the best stack based on your project needs!",
  },
  {
    keywords: ["contact", "reach", "talk", "call", "email", "phone", "meet", "consultation"],
    patterns: [/contact/i, /reach.*out/i, /talk.*team/i, /call/i, /consultation/i, /meet/i],
    response: "You can reach us through:\n\n📧 Email: mohdmusab701@gmail.com\n📱 Phone: +91 9335289386\n🌐 Website: digitalorbit.in/contact\n\nOr simply share your name and email here, and our team will reach out within 24 hours!",
  },
  {
    keywords: ["about", "company", "who", "team", "digitalorbit", "digital orbit"],
    patterns: [/who.*are/i, /about.*company/i, /tell.*about/i, /digital.*orbit/i],
    response: "DigitalOrbit is a premium digital agency specializing in web development, mobile apps, UI/UX design, and AI solutions. We help businesses build smarter, grow faster, and orbit higher in the digital space.\n\nOur team of experienced developers and designers is passionate about creating exceptional digital experiences!",
  },
  {
    keywords: ["portfolio", "work", "project", "example", "case study", "previous"],
    patterns: [/portfolio/i, /previous.*work/i, /example/i, /case.*stud/i, /show.*work/i],
    response: "You can check out our portfolio at digitalorbit.in/portfolio! We've worked with clients across various industries including e-commerce, healthcare, education, and fintech.\n\nWould you like to discuss a specific type of project?",
  },
  {
    keywords: ["support", "maintenance", "after", "warranty", "bug", "issue", "fix"],
    patterns: [/support/i, /maintenance/i, /after.*delivery/i, /warranty/i, /bug.*fix/i],
    response: "We provide comprehensive post-launch support:\n\n• 30-day free bug fixes after delivery\n• Monthly maintenance plans available\n• 24/7 critical issue support\n• Regular security updates\n• Performance monitoring\n\nYour success is our priority even after project completion!",
  },
  {
    keywords: ["payment", "pay", "method", "installment", "milestone"],
    patterns: [/payment.*method/i, /how.*pay/i, /installment/i, /milestone/i],
    response: "We offer flexible payment options:\n\n• Milestone-based payments (most popular)\n• 50% upfront + 50% on delivery\n• Monthly retainer for ongoing work\n• UPI, Bank Transfer, and Razorpay supported\n\nWe'll work out a payment plan that suits your budget!",
  },
];

// ─── Intent Detection ─────────────────────────────────────────

type Intent =
  | "greeting"
  | "farewell"
  | "service_inquiry"
  | "faq"
  | "lead_capture"
  | "thanks"
  | "help"
  | "unknown";

interface DetectedIntent {
  intent: Intent;
  confidence: number;
  matchedService?: ServiceInfo;
  matchedFaq?: FAQ;
}

function detectIntent(message: string): DetectedIntent {
  const lower = message.toLowerCase().trim();
  const words = lower.split(/\s+/);

  // Greeting
  const greetings = ["hi", "hello", "hey", "hii", "hiii", "hola", "namaste", "good morning", "good afternoon", "good evening", "sup", "yo"];
  if (greetings.some((g) => lower === g || lower.startsWith(g + " ") || lower.startsWith(g + "!"))) {
    return { intent: "greeting", confidence: 0.95 };
  }

  // Farewell
  const farewells = ["bye", "goodbye", "see you", "thanks bye", "ok bye", "goodbye", "take care", "ttyl"];
  if (farewells.some((f) => lower.includes(f))) {
    return { intent: "farewell", confidence: 0.9 };
  }

  // Thanks
  const thanks = ["thank", "thanks", "thx", "appreciate", "grateful"];
  if (thanks.some((t) => lower.includes(t))) {
    return { intent: "thanks", confidence: 0.85 };
  }

  // Help
  if (lower === "help" || lower === "?" || lower.includes("what can you do") || lower.includes("how can you help")) {
    return { intent: "help", confidence: 0.9 };
  }

  // Service inquiry — check for service keyword matches
  for (const service of SERVICES) {
    const matchCount = service.keywords.filter((kw) => lower.includes(kw)).length;
    if (matchCount > 0) {
      return {
        intent: "service_inquiry",
        confidence: Math.min(0.5 + matchCount * 0.15, 0.95),
        matchedService: service,
      };
    }
  }

  // FAQ matching — check patterns and keywords
  for (const faq of FAQS) {
    if (faq.patterns.some((p) => p.test(lower))) {
      return { intent: "faq", confidence: 0.85, matchedFaq: faq };
    }
    const matchCount = faq.keywords.filter((kw) => lower.includes(kw)).length;
    if (matchCount >= 2) {
      return { intent: "faq", confidence: 0.7, matchedFaq: faq };
    }
  }

  // Lead capture signals
  const leadSignals = ["interested", "want to hire", "need help", "looking for", "require", "project", "build", "create", "develop", "make"];
  const leadMatches = leadSignals.filter((s) => lower.includes(s)).length;
  if (leadMatches > 0) {
    return { intent: "lead_capture", confidence: 0.6 + leadMatches * 0.1 };
  }

  return { intent: "unknown", confidence: 0 };
}

// ─── Response Generation ──────────────────────────────────────

interface ChatContext {
  messageCount: number;
  leadCaptured: boolean;
  visitorName?: string;
}

export function generateBotResponse(
  userMessage: string,
  context: ChatContext
): string {
  const { intent, matchedService, matchedFaq } = detectIntent(userMessage);
  const name = context.visitorName ? ` ${context.visitorName}` : "";

  switch (intent) {
    case "greeting":
      if (context.messageCount === 0) {
        return `Hey there${name}! 👋 Welcome to DigitalOrbit.\n\nI'm here to help you with:\n• 🌐 Web & Mobile Development\n• 🎨 UI/UX Design\n• 📈 Digital Marketing\n• 🤖 AI & Automation\n• ☁️ Cloud & DevOps\n\nHow can I assist you today?`;
      }
      return `Hello again${name}! 😊 How can I help you?`;

    case "farewell":
      return `Goodbye${name}! 👋 It was great chatting with you. Feel free to come back anytime. Have a wonderful day!`;

    case "thanks":
      return `You're welcome${name}! 😊 Is there anything else I can help you with?`;

    case "help":
      return `I can help you with:\n\n🔹 **Service Information** — Ask about any of our services\n🔹 **Pricing** — Get rough estimates for your project\n🔹 **Timelines** — Know how long your project might take\n🔹 **Technology** — Learn about our tech stack\n🔹 **Portfolio** — See our previous work\n🔹 **Contact** — Get in touch with our team\n\nJust ask your question naturally!`;

    case "service_inquiry":
      if (matchedService) {
        const features = matchedService.features.map((f) => `  • ${f}`).join("\n");
        let response = `Great choice! Here's what we offer in **${matchedService.name}**:\n\n${matchedService.shortDescription}\n\n**Key Features:**\n${features}`;
        if (matchedService.startingPrice) {
          response += `\n\n💰 Starting from ${matchedService.startingPrice}`;
        }
        if (!context.leadCaptured) {
          response += "\n\nWould you like to discuss your project requirements? Just share your name and email, and our team will reach out!";
        }
        return response;
      }
      return "We offer a wide range of digital services. Could you tell me more specifically what you're looking for?";

    case "faq":
      return matchedFaq?.response || "That's a great question! Could you provide more details so I can give you the best answer?";

    case "lead_capture":
      if (context.leadCaptured) {
        return `Thanks${name}! We already have your details. Our team will reach out to you shortly to discuss your project. In the meantime, feel free to ask any other questions!`;
      }
      return `That sounds exciting! 🚀 I'd love to connect you with our team for a detailed discussion.\n\nCould you share your:\n• **Name**\n• **Email**\n• **Phone** (optional)\n\nOur team will get back to you within 24 hours!`;

    case "unknown":
    default:
      // Contextual fallback based on message count
      if (context.messageCount <= 1) {
        return `Thanks for your message! I'm DigitalOrbit's assistant. I can help you with information about our services, pricing, timelines, and more.\n\nTry asking something like:\n• "What services do you offer?"\n• "How much does a website cost?"\n• "Tell me about your tech stack"`;
      }
      if (!context.leadCaptured && context.messageCount > 3) {
        return `I'd love to help you further! If you share your name and email, our expert team can provide personalized assistance for your specific needs. 😊\n\nOr feel free to ask me about our services, pricing, or technology!`;
      }
      return `I appreciate your question! While I may not have a specific answer for that, our team can definitely help. Feel free to ask about our services, pricing, timelines, or technology — I'm here to help! 🙂`;
  }
}

// ─── Lead Extraction ──────────────────────────────────────────

export interface ExtractedLeadInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export function extractLeadInfo(message: string): ExtractedLeadInfo {
  const info: ExtractedLeadInfo = {};

  // Extract email
  const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) info.email = emailMatch[0].toLowerCase();

  // Extract phone (Indian format primarily)
  const phoneMatch = message.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  if (phoneMatch) info.phone = phoneMatch[0];

  // Simple name extraction — "my name is X" or "I'm X" or "I am X"
  const namePatterns = [
    /(?:my name is|i'm|i am|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+here/i,
  ];
  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match) {
      info.name = match[1].trim();
      break;
    }
  }

  return info;
}

export const WELCOME_MESSAGE = "Hey there! 👋 Welcome to **DigitalOrbit**.\n\nI'm your AI assistant. I can help you with:\n• 🌐 Web & Mobile Development\n• 🎨 UI/UX Design\n• 📈 Digital Marketing\n• 🤖 AI & Automation\n\nHow can I help you today?";
