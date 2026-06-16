"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isBefore, startOfDay, addWeeks, subWeeks, getDay } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Video, PhoneCall, Loader2, CheckCircle2, Calendar as CalendarIcon, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TIME_SLOTS = [
 "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const SERVICES = [
 "Web Development",
 "Mobile App Development",
 "UI/UX Design",
 "Digital Marketing",
 "AI & Automation",
 "Cloud & DevOps",
 "General Consultation"
];

const MEETING_TYPES = [
 { id: "Google Meet", icon: Video, desc: "Video call via Google Meet" },
 { id: "Zoom", icon: Video, desc: "Video call via Zoom" },
 { id: "Phone", icon: PhoneCall, desc: "Audio call" },
];

export default function BookPage() {
 const [currentDate, setCurrentDate] = useState(new Date());
 const [selectedDate, setSelectedDate] = useState<Date | null>(null);
 const [selectedTime, setSelectedTime] = useState<string | null>(null);
 const [step, setStep] = useState<1 | 2>(1);
 
 const [formData, setFormData] = useState({
 name: "",
 email: "",
 phone: "",
 company: "",
 serviceInterested: "",
 meetingType: "Google Meet",
 notes: "",
 });

 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);
 const [error, setError] = useState<string | null>(null);

 // Calendar logic
 const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
 const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
 const daysInWeek = eachDayOfInterval({ start: startDate, end: endDate });
 const isPast = (date: Date) => isBefore(startOfDay(date), startOfDay(new Date()));
 const isWeekend = (date: Date) => getDay(date) === 0 || getDay(date) === 6;

 const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
 const prevWeek = () => {
 const previous = subWeeks(currentDate, 1);
 if (!isBefore(previous, startOfWeek(new Date(), { weekStartsOn: 1 }))) {
 setCurrentDate(previous);
 }
 };

 const handleDateSelect = (date: Date) => {
 if (isPast(date) || isWeekend(date)) return;
 setSelectedDate(date);
 setSelectedTime(null);
 };

 const handleNextStep = () => {
 if (!selectedDate || !selectedTime) {
 setError("Please select a date and time");
 return;
 }
 setError(null);
 setStep(2);
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError(null);

 try {
 const res = await fetch("/api/bookings", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 ...formData,
 meetingDate: selectedDate?.toISOString(),
 meetingTime: selectedTime,
 }),
 });

 const json = await res.json();
 if (!res.ok || !json.success) {
 throw new Error(json.error || json.errors ? Object.values(json.errors)[0] as string : "Booking failed");
 }

 setSuccess(true);
 } catch (err) {
 setError((err as Error).message);
 } finally {
 setLoading(false);
 }
 };

 if (success) {
 return (
 <div className="min-h-[80vh] flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-xl"
 >
 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
 <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
 </div>
 <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
 <p className="text-muted-foreground mb-6">
 Thank you for booking a call with us. We have sent a confirmation email to <strong>{formData.email}</strong> with the meeting details.
 </p>
 <button
 onClick={() => window.location.href = '/'}
 className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
 >
 Return Home
 </button>
 </motion.div>
 </div>
 );
 }

 return (
 <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
 <div className="text-center mb-12">
 <h1 className="text-4xl font-bold text-foreground mb-4">Book a Discovery Call</h1>
 <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
 Let's discuss how DigitalOrbit can help you build smarter, grow faster, and orbit higher in the digital space.
 </p>
 </div>

 <div className="flex flex-col lg:flex-row gap-8">
 {/* Left Side - Info */}
 <div className="w-full lg:w-1/3">
 <div className="bg-muted border border-border rounded-2xl p-6 lg:p-8 sticky top-24">
 <h3 className="text-xl font-bold text-foreground mb-6">Meeting Details</h3>
 
 <div className="space-y-6">
 <div className="flex gap-4">
 <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center shrink-0">
 <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
 </div>
 <div>
 <p className="font-medium text-foreground">30 Minute Call</p>
 <p className="text-sm text-muted-foreground mt-1">Free consultation</p>
 </div>
 </div>
 
 <div className="flex gap-4">
 <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
 <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
 </div>
 <div>
 <p className="font-medium text-foreground">Format</p>
 <p className="text-sm text-muted-foreground mt-1">Google Meet / Zoom / Phone</p>
 </div>
 </div>

 {selectedDate && selectedTime && (
 <div className="pt-6 border-t border-border">
 <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Selected Time</h4>
 <p className="font-medium text-primary-600 dark:text-primary-400 flex items-center gap-2">
 <CalendarIcon className="w-4 h-4" />
 {format(selectedDate, "EEEE, MMMM dd")}
 </p>
 <p className="font-medium text-muted-foreground mt-1 ml-6">
 {selectedTime}
 </p>
 
 {step === 2 && (
 <button
 onClick={() => setStep(1)}
 className="text-sm text-blue-600 dark:text-blue-400 mt-3 font-medium hover:underline ml-6"
 >
 Change Date/Time
 </button>
 )}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Right Side - Booking Flow */}
 <div className="w-full lg:w-2/3 bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-sm">
 {error && (
 <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50">
 {error}
 </div>
 )}

 <AnimatePresence mode="wait">
 {step === 1 ? (
 <motion.div
 key="step1"
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 transition={{ duration: 0.2 }}
 >
 <h2 className="text-2xl font-bold text-foreground mb-6">Select Date & Time</h2>
 
 {/* Calendar Header */}
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-lg font-semibold text-foreground">
 {format(currentDate, "MMMM yyyy")}
 </h3>
 <div className="flex gap-2">
 <button
 onClick={prevWeek}
 className="p-2 border border-border rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
 >
 <ChevronLeft className="w-5 h-5 text-muted-foreground" />
 </button>
 <button
 onClick={nextWeek}
 className="p-2 border border-border rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
 >
 <ChevronRight className="w-5 h-5 text-muted-foreground" />
 </button>
 </div>
 </div>

 {/* Days Grid */}
 <div className="grid grid-cols-7 gap-2 mb-8">
 {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
 <div key={day} className="text-center text-xs font-semibold text-slate-500 uppercase py-2">
 {day}
 </div>
 ))}
 {daysInWeek.map((date) => {
 const disabled = isPast(date) || isWeekend(date);
 const selected = selectedDate ? isSameDay(date, selectedDate) : false;
 
 return (
 <button
 key={date.toString()}
 onClick={() => handleDateSelect(date)}
 disabled={disabled}
 className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all ${
 disabled 
 ? "opacity-30 cursor-not-allowed text-slate-400" 
 : selected 
 ? "bg-primary-600 text-white shadow-md shadow-primary-500/30" 
 : "bg-muted text-foreground hover:border-primary-500 border border-transparent"
 }`}
 >
 <span className="text-lg font-bold">{format(date, "d")}</span>
 </button>
 );
 })}
 </div>

 {/* Time Slots */}
 {selectedDate && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 >
 <h3 className="text-lg font-semibold text-foreground mb-4">Available Times</h3>
 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
 {TIME_SLOTS.map((time) => (
 <button
 key={time}
 onClick={() => setSelectedTime(time)}
 className={`py-3 rounded-xl text-sm font-medium transition-all ${
 selectedTime === time
 ? "bg-primary-600 text-white shadow-md shadow-primary-500/30"
 : "bg-card border border-border text-muted-foreground hover:border-primary-500"
 }`}
 >
 {time}
 </button>
 ))}
 </div>
 </motion.div>
 )}

 <div className="flex justify-end">
 <button
 onClick={handleNextStep}
 disabled={!selectedDate || !selectedTime}
 className="px-8 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
 >
 Next Step
 </button>
 </div>
 </motion.div>
 ) : (
 <motion.div
 key="step2"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 20 }}
 transition={{ duration: 0.2 }}
 >
 <h2 className="text-2xl font-bold text-foreground mb-6">Your Details</h2>
 
 <form onSubmit={handleSubmit} className="space-y-5">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-muted-foreground">Full Name *</label>
 <input
 required
 type="text"
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-muted-foreground">Email Address *</label>
 <input
 required
 type="email"
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-muted-foreground">Phone Number *</label>
 <input
 required
 type="tel"
 value={formData.phone}
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-sm font-medium text-muted-foreground">Company (Optional)</label>
 <input
 type="text"
 value={formData.company}
 onChange={(e) => setFormData({ ...formData, company: e.target.value })}
 className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-sm font-medium text-muted-foreground">Service Interested In *</label>
 <select
 required
 value={formData.serviceInterested}
 onChange={(e) => setFormData({ ...formData, serviceInterested: e.target.value })}
 className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
 >
 <option value="">Select a service...</option>
 {SERVICES.map((s) => (
 <option key={s} value={s}>{s}</option>
 ))}
 </select>
 </div>

 <div className="space-y-3">
 <label className="text-sm font-medium text-muted-foreground">Meeting Format *</label>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 {MEETING_TYPES.map((type) => (
 <label
 key={type.id}
 className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
 formData.meetingType === type.id
 ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
 : "border-border bg-background hover:border-primary-300"
 }`}
 >
 <input
 type="radio"
 name="meetingType"
 value={type.id}
 checked={formData.meetingType === type.id}
 onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
 className="w-4 h-4 text-primary-600 focus:ring-primary-500"
 />
 <div className="flex items-center gap-2">
 <type.icon className={`w-4 h-4 ${formData.meetingType === type.id ? "text-primary-600" : "text-slate-500"}`} />
 <span className={`text-sm font-medium ${formData.meetingType === type.id ? "text-primary-900 dark:text-primary-100" : "text-muted-foreground"}`}>
 {type.id}
 </span>
 </div>
 </label>
 ))}
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-sm font-medium text-muted-foreground">Additional Notes (Optional)</label>
 <textarea
 rows={3}
 value={formData.notes}
 onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
 placeholder="Briefly describe what you'd like to discuss..."
 className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none"
 />
 </div>

 <div className="pt-4 flex justify-between">
 <button
 type="button"
 onClick={() => setStep(1)}
 className="px-6 py-3 text-muted-foreground font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
 >
 Back
 </button>
 <button
 type="submit"
 disabled={loading}
 className="px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/30"
 >
 {loading ? (
 <>
 <Loader2 className="w-5 h-5 animate-spin" />
 Confirming...
 </>
 ) : (
 "Confirm Booking"
 )}
 </button>
 </div>
 </form>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>
 );
}
