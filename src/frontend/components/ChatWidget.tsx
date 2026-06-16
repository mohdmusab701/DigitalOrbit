"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
 MessageCircle,
 X,
 Send,
 Loader2,
 Bot,
 User,
 Sparkles,
 Minimize2,
} from "lucide-react";

interface Message {
 role: "user" | "bot";
 content: string;
 timestamp: string;
}

function generateSessionId(): string {
 return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function getSessionId(): string {
 if (typeof window === "undefined") return generateSessionId();
 let id = sessionStorage.getItem("do_chat_session");
 if (!id) {
 id = generateSessionId();
 sessionStorage.setItem("do_chat_session", id);
 }
 return id;
}

// Render markdown-light formatting (bold, bullets, line breaks)
function renderContent(text: string) {
 const lines = text.split("\n");
 return lines.map((line, i) => {
 // Bold markers
 let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
 // Bullet points
 if (processed.startsWith("• ") || processed.startsWith("🔹 ")) {
 return (
 <div key={i} className="flex gap-1.5 ml-1">
 <span className="shrink-0">{processed.startsWith("🔹") ? "" : "•"}</span>
 <span dangerouslySetInnerHTML={{ __html: processed.replace(/^[•🔹]\s*/, "") }} />
 </div>
 );
 }
 if (processed.trim() === "") return <br key={i} />;
 return <div key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
 });
}

export default function ChatWidget() {
 const [isOpen, setIsOpen] = useState(false);
 const [messages, setMessages] = useState<Message[]>([]);
 const [input, setInput] = useState("");
 const [loading, setLoading] = useState(false);
 const [initialLoaded, setInitialLoaded] = useState(false);
 const [unread, setUnread] = useState(0);
 const messagesEndRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLInputElement>(null);
 const sessionId = useRef(getSessionId());

 const scrollToBottom = useCallback(() => {
 messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 }, []);

 // Load existing conversation on mount
 useEffect(() => {
 const loadConversation = async () => {
 try {
 const res = await fetch(`/api/chatbot?sessionId=${sessionId.current}`);
 const json = await res.json();
 if (json.success && json.data.messages?.length > 0) {
 setMessages(json.data.messages);
 } else {
 setMessages([
 {
 role: "bot",
 content:
 "Hey there! 👋 Welcome to **DigitalOrbit**.\n\nI'm your AI assistant. I can help you with:\n• 🌐 Web & Mobile Development\n• 🎨 UI/UX Design\n• 📈 Digital Marketing\n• 🤖 AI & Automation\n\nHow can I help you today?",
 timestamp: new Date().toISOString(),
 },
 ]);
 setUnread(1);
 }
 } catch {
 setMessages([
 {
 role: "bot",
 content: "Hey there! 👋 I'm your DigitalOrbit assistant. How can I help you today?",
 timestamp: new Date().toISOString(),
 },
 ]);
 }
 setInitialLoaded(true);
 };
 loadConversation();
 }, []);

 useEffect(() => {
 if (isOpen) {
 scrollToBottom();
 setUnread(0);
 setTimeout(() => inputRef.current?.focus(), 300);
 }
 }, [isOpen, messages, scrollToBottom]);

 const sendMessage = async () => {
 const trimmed = input.trim();
 if (!trimmed || loading) return;

 const userMsg: Message = {
 role: "user",
 content: trimmed,
 timestamp: new Date().toISOString(),
 };

 setMessages((prev) => [...prev, userMsg]);
 setInput("");
 setLoading(true);

 try {
 const res = await fetch("/api/chatbot", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 sessionId: sessionId.current,
 message: trimmed,
 pageUrl: typeof window !== "undefined" ? window.location.href : "",
 }),
 });

 const json = await res.json();
 if (json.success) {
 const botMsg: Message = {
 role: "bot",
 content: json.data.reply,
 timestamp: new Date().toISOString(),
 };
 setMessages((prev) => [...prev, botMsg]);
 if (!isOpen) setUnread((u) => u + 1);
 } else {
 setMessages((prev) => [
 ...prev,
 {
 role: "bot",
 content: "Sorry, something went wrong. Please try again!",
 timestamp: new Date().toISOString(),
 },
 ]);
 }
 } catch {
 setMessages((prev) => [
 ...prev,
 {
 role: "bot",
 content: "Connection error. Please check your internet and try again.",
 timestamp: new Date().toISOString(),
 },
 ]);
 } finally {
 setLoading(false);
 }
 };

 const handleKeyDown = (e: React.KeyboardEvent) => {
 if (e.key === "Enter" && !e.shiftKey) {
 e.preventDefault();
 sendMessage();
 }
 };

 return (
 <>
 {/* Chat Window */}
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, y: 20, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 20, scale: 0.95 }}
 transition={{ duration: 0.25, ease: "easeOut" }}
 className="fixed bottom-24 right-4 sm:right-6 z-[9999] w-[calc(100%-2rem)] sm:w-[400px] h-[520px] bg-card rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 border border-slate-200/50 /50 flex flex-col overflow-hidden"
 >
 {/* Header */}
 <div className="bg-gradient-to-r from-primary-600 to-blue-600 px-5 py-4 flex items-center justify-between shrink-0">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
 <Sparkles className="w-5 h-5 text-white" />
 </div>
 <div>
 <h3 className="text-white font-semibold text-sm">DigitalOrbit AI</h3>
 <div className="flex items-center gap-1.5">
 <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
 <span className="text-white/70 text-xs">Online</span>
 </div>
 </div>
 </div>
 <button
 onClick={() => setIsOpen(false)}
 className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
 aria-label="Minimize chat"
 >
 <Minimize2 className="w-4 h-4 text-white" />
 </button>
 </div>

 {/* Messages */}
 <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth" id="chat-messages">
 {messages.map((msg, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.2, delay: i === messages.length - 1 ? 0.1 : 0 }}
 className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
 >
 {msg.role === "bot" && (
 <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
 <Bot className="w-4 h-4 text-primary-600 dark:text-primary-400" />
 </div>
 )}
 <div
 className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
 msg.role === "user"
 ? "bg-primary-600 text-white rounded-br-md"
 : "bg-muted text-foreground rounded-bl-md border border-slate-200/50 /30"
 }`}
 >
 {renderContent(msg.content)}
 </div>
 {msg.role === "user" && (
 <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
 <User className="w-4 h-4 text-white" />
 </div>
 )}
 </motion.div>
 ))}
 {loading && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="flex gap-2.5"
 >
 <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center shrink-0">
 <Bot className="w-4 h-4 text-primary-600 dark:text-primary-400" />
 </div>
 <div className="bg-muted border border-slate-200/50 /30 px-4 py-3 rounded-2xl rounded-bl-md">
 <div className="flex gap-1">
 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
 </div>
 </div>
 </motion.div>
 )}
 <div ref={messagesEndRef} />
 </div>

 {/* Input */}
 <div className="shrink-0 border-t border-slate-200/50 /50 p-3 bg-card">
 <div className="flex items-center gap-2">
 <input
 ref={inputRef}
 type="text"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 onKeyDown={handleKeyDown}
 placeholder="Type your message..."
 disabled={loading}
 className="flex-1 bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all disabled:opacity-60"
 maxLength={2000}
 />
 <button
 onClick={sendMessage}
 disabled={!input.trim() || loading}
 className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed shadow-md shadow-primary-500/20 disabled:shadow-none"
 aria-label="Send message"
 >
 {loading ? (
 <Loader2 className="w-4 h-4 animate-spin" />
 ) : (
 <Send className="w-4 h-4" />
 )}
 </button>
 </div>
 <p className="text-[10px] text-muted-foreground text-center mt-1.5">
 Powered by DigitalOrbit AI
 </p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Floating Button */}
 <motion.button
 onClick={() => setIsOpen(!isOpen)}
 className="fixed bottom-6 right-4 sm:right-6 z-[9999] w-14 h-14 bg-gradient-to-tr from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white rounded-full flex items-center justify-center shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 transition-shadow"
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 aria-label={isOpen ? "Close chat" : "Open chat"}
 >
 <AnimatePresence mode="wait">
 {isOpen ? (
 <motion.div
 key="close"
 initial={{ rotate: -90, opacity: 0 }}
 animate={{ rotate: 0, opacity: 1 }}
 exit={{ rotate: 90, opacity: 0 }}
 transition={{ duration: 0.15 }}
 >
 <X className="w-6 h-6" />
 </motion.div>
 ) : (
 <motion.div
 key="open"
 initial={{ rotate: 90, opacity: 0 }}
 animate={{ rotate: 0, opacity: 1 }}
 exit={{ rotate: -90, opacity: 0 }}
 transition={{ duration: 0.15 }}
 >
 <MessageCircle className="w-6 h-6" />
 </motion.div>
 )}
 </AnimatePresence>

 {/* Unread Badge */}
 <AnimatePresence>
 {unread > 0 && !isOpen && (
 <motion.span
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 exit={{ scale: 0 }}
 className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
 >
 {unread}
 </motion.span>
 )}
 </AnimatePresence>
 </motion.button>
 </>
 );
}
