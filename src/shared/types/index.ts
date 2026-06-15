import { ComponentType } from "react";

// Export API-specific response type
export * from "./api";

export interface StandardResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// -------------------------------------------------------------
// Frontend / UI Domain Types
// -------------------------------------------------------------

export interface Service {
  id: string;
  icon: ComponentType<any>;
  title: string;
  shortDescription: string;
  description: string;
  color: string;
  features: string[];
}

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  gradient: string;
  image: string;
  stats: {
    users: string;
    growth: string;
  };
  tags: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  cta: string;
  popular?: boolean;
  features: string[];
  notIncluded: string[];
  gradient: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  gradient: string;
}

export interface Stat {
  label: string;
  value: string;
}
