"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Mail,
  Phone,
  MessageSquare,
  Building2,
  Briefcase,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

// ─── Service options for the dropdown ──────────────────────────

const SERVICE_OPTIONS = [
  "Website Development",
  "Mobile App Development",
  "UI/UX Design",
  "AI Solutions",
  "Cloud & DevOps",
  "Digital Marketing",
  "Other",
] as const;

// ─── Toast notification component ──────────────────────────────

interface ToastProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

function Toast({ type, message, onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-6 right-6 z-50 max-w-sm w-full px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm flex items-start gap-3 ${
        type === "success"
          ? "bg-emerald-50/95 dark:bg-emerald-950/95 border-emerald-200 dark:border-emerald-800 shadow-emerald-500/10"
          : "bg-red-50/95 dark:bg-red-950/95 border-red-200 dark:border-red-800 shadow-red-500/10"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          type === "success"
            ? "bg-emerald-100 dark:bg-emerald-900/50"
            : "bg-red-100 dark:bg-red-900/50"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold ${
            type === "success"
              ? "text-emerald-900 dark:text-emerald-100"
              : "text-red-900 dark:text-red-100"
          }`}
        >
          {type === "success" ? "Message Sent!" : "Something Went Wrong"}
        </p>
        <p
          className={`text-xs mt-0.5 ${
            type === "success"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </motion.div>
  );
}

// ─── Form field error label ────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-red-500 dark:text-red-400 mt-1.5 flex items-center gap-1"
    >
      <AlertCircle className="w-3 h-3" />
      {message}
    </motion.p>
  );
}

// ─── Main ContactForm component ────────────────────────────────

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss toast after 5s
  const showToast = (type: "success" | "error", message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Server returned validation errors
        if (data.errors && typeof data.errors === "object") {
          setFieldErrors(data.errors);
        }
        showToast(
          "error",
          data.error || "Failed to send message. Please try again."
        );
        return;
      }

      // Success — reset form and show toast
      showToast(
        "success",
        "We'll get back to you within 24 hours."
      );
      setFormData(INITIAL_FORM);
    } catch {
      showToast(
        "error",
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all";
  const inputNormal =
    "border-slate-200 dark:border-dark-border";
  const inputError =
    "border-red-300 dark:border-red-700 focus:ring-red-500/20 focus:border-red-500";

  return (
    <>
      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Name & Phone — 2-column row on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label
              htmlFor="contact-name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`${inputBase} ${fieldErrors.name ? inputError : inputNormal}`}
                placeholder="John Doe"
              />
            </div>
            <FieldError message={fieldErrors.name} />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="contact-phone"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Phone <span className="text-slate-400">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`${inputBase} ${fieldErrors.phone ? inputError : inputNormal}`}
                placeholder="+1 (234) 567-890"
              />
            </div>
            <FieldError message={fieldErrors.phone} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Email Address <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`${inputBase} ${fieldErrors.email ? inputError : inputNormal}`}
              placeholder="john@company.com"
            />
          </div>
          <FieldError message={fieldErrors.email} />
        </div>

        {/* Company & Service — 2-column row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Company */}
          <div>
            <label
              htmlFor="contact-company"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Company <span className="text-slate-400">(Optional)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                id="contact-company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`${inputBase} ${fieldErrors.company ? inputError : inputNormal}`}
                placeholder="Company Name"
              />
            </div>
            <FieldError message={fieldErrors.company} />
          </div>

          {/* Service */}
          <div>
            <label
              htmlFor="contact-service"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Service Interested In
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                id="contact-service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`${inputBase} ${fieldErrors.service ? inputError : inputNormal} appearance-none cursor-pointer`}
              >
                <option value="">Select a service</option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {/* Custom dropdown chevron */}
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <FieldError message={fieldErrors.service} />
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Message <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className={`${inputBase} ${fieldErrors.message ? inputError : inputNormal} resize-none`}
              placeholder="Tell us about your project..."
            />
          </div>
          <FieldError message={fieldErrors.message} />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={isSubmitting ? {} : { scale: 1.01 }}
          whileTap={isSubmitting ? {} : { scale: 0.99 }}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 font-semibold rounded-xl transition-all shadow-lg ${
            isSubmitting
              ? "bg-primary-400 dark:bg-primary-800 cursor-not-allowed shadow-primary-400/15"
              : "bg-primary-600 hover:bg-primary-700 shadow-primary-600/25 hover:shadow-primary-600/40"
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>
    </>
  );
}
