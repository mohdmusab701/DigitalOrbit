"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
 Loader2, AlertCircle, Search, Calendar, CheckCircle2,
 XCircle, Clock, Video, PhoneCall, Trash2, ArrowLeft, MoreVertical, Building, Eye, X, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
 _id: string;
 name: string;
 email: string;
 phone: string;
 company?: string;
 serviceInterested: string;
 meetingDate: string;
 meetingTime: string;
 meetingType: string;
 status: "pending" | "approved" | "rejected" | "rescheduled" | "completed" | "cancelled";
 notes?: string;
 googleEventId?: string;
 createdAt: string;
}

export default function AdminBookingsPage() {
 const router = useRouter();
 const [bookings, setBookings] = useState<Booking[]>([]);
 const [stats, setStats] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [search, setSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState("");
 
 // Action states
 const [actionLoading, setActionLoading] = useState<string | null>(null);
 
 // View/Edit Modal
 const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
 const [editStatus, setEditStatus] = useState<string>("");
 const [editMeetingLink, setEditMeetingLink] = useState("");

 const fetchBookings = useCallback(async () => {
 setLoading(true);
 setError(null);
 try {
 const params = new URLSearchParams({ limit: "50" });
 if (search) params.set("search", search);
 if (statusFilter) params.set("status", statusFilter);

 const res = await fetch(`/api/admin/bookings?${params}`);
 const json = await res.json();
 if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch");

 setBookings(json.data.bookings);
 setStats(json.data.stats);
 } catch (err) {
 setError((err as Error).message);
 } finally {
 setLoading(false);
 }
 }, [search, statusFilter]);

 useEffect(() => {
 fetchBookings();
 }, [fetchBookings]);

 const handleUpdateStatus = async (id: string, newStatus: string, link?: string) => {
 setActionLoading(id);
 try {
 const res = await fetch(`/api/admin/bookings/${id}`, {
 method: "PATCH",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ status: newStatus, meetingLink: link }),
 });
 const json = await res.json();
 if (!res.ok || !json.success) throw new Error(json.error || "Failed to update");
 await fetchBookings();
 if (selectedBooking?._id === id) {
 setSelectedBooking(null);
 }
 } catch (err) {
 alert((err as Error).message);
 } finally {
 setActionLoading(null);
 }
 };

 const handleDelete = async (id: string) => {
 if (!confirm("Delete this booking permanently?")) return;
 setActionLoading(id);
 try {
 const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
 const json = await res.json();
 if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
 await fetchBookings();
 if (selectedBooking?._id === id) setSelectedBooking(null);
 } catch (err) {
 alert((err as Error).message);
 } finally {
 setActionLoading(null);
 }
 };

 const getStatusBadge = (status: string) => {
 const styles: Record<string, string> = {
 pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
 approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
 rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
 rescheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
 completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
 cancelled: "bg-muted text-muted-foreground dark:bg-slate-800 dark:text-slate-400",
 };
 return styles[status] || styles.pending;
 };

 const getTypeIcon = (type: string) => {
 if (type === "Phone") return <PhoneCall className="w-4 h-4" />;
 if (type === "Zoom") return <Video className="w-4 h-4 text-blue-500" />;
 return <Video className="w-4 h-4 text-green-500" />;
 };

 return (
 <div className="p-8 max-w-7xl mx-auto">
 {/* Header */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
 <div>
 <div className="flex items-center gap-3 mb-1">
 <button
 onClick={() => router.push("/admin")}
 className="p-1.5 hover:bg-muted dark:hover:bg-white/5 rounded-lg transition-colors"
 >
 <ArrowLeft className="w-5 h-5 text-muted-foreground" />
 </button>
 <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
 </div>
 <p className="text-sm text-muted-foreground ml-10">Manage Discovery Calls and Appointments.</p>
 </div>
 </div>

 {/* Stats */}
 {stats && (
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
 {[
 { label: "Total Bookings", value: stats.total, color: "bg-blue-100 text-blue-600" },
 { label: "Pending Review", value: stats.pending, color: "bg-amber-100 text-amber-600" },
 { label: "Approved Meetings", value: stats.approved, color: "bg-green-100 text-green-600" },
 { label: "Cancelled", value: stats.cancelled, color: "bg-muted text-muted-foreground" },
 ].map((stat) => (
 <div key={stat.label} className="bg-card border border-border rounded-2xl p-5">
 <div className="flex items-center gap-3 mb-2">
 <div className={`w-3 h-3 rounded-full ${stat.color.split(' ')[0]}`} />
 <span className="text-sm text-muted-foreground">{stat.label}</span>
 </div>
 <p className="text-2xl font-bold text-foreground">{stat.value}</p>
 </div>
 ))}
 </div>
 )}

 {/* Filters */}
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
 <div className="relative flex-1">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 onBlur={fetchBookings}
 onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
 placeholder="Search by name, email..."
 className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary-500"
 />
 </div>
 <select
 value={statusFilter}
 onChange={(e) => { setStatusFilter(e.target.value); }}
 className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground focus:ring-2 focus:ring-primary-500"
 >
 <option value="">All Statuses</option>
 <option value="pending">Pending</option>
 <option value="approved">Approved</option>
 <option value="rejected">Rejected</option>
 <option value="cancelled">Cancelled</option>
 </select>
 </div>

 {/* Main Content */}
 {loading ? (
 <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
 ) : error ? (
 <div className="bg-red-50 text-red-600 p-4 rounded-xl flex gap-2"><AlertCircle className="w-5 h-5 shrink-0" /><p>{error}</p></div>
 ) : bookings.length === 0 ? (
 <div className="text-center py-20 border border-border rounded-2xl bg-card">
 <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
 <p className="text-muted-foreground">No bookings found.</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
 {bookings.map((booking) => (
 <motion.div
 key={booking._id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
 >
 {/* Card Header */}
 <div className="p-5 border-b border-border flex justify-between items-start">
 <div>
 <h3 className="font-bold text-foreground">{booking.name}</h3>
 <p className="text-sm text-muted-foreground truncate">{booking.email}</p>
 </div>
 <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${getStatusBadge(booking.status)}`}>
 {booking.status}
 </span>
 </div>
 
 {/* Card Body */}
 <div className="p-5 flex-1 space-y-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center shrink-0">
 <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
 </div>
 <div>
 <p className="font-semibold text-foreground">{format(parseISO(booking.meetingDate), "EEEE, MMM dd")}</p>
 <p className="text-sm text-muted-foreground">{booking.meetingTime}</p>
 </div>
 </div>

 <div className="space-y-2 text-sm">
 <div className="flex items-center gap-2 text-muted-foreground">
 <Briefcase className="w-4 h-4 shrink-0 text-slate-400" />
 <span className="truncate">{booking.serviceInterested}</span>
 </div>
 <div className="flex items-center gap-2 text-muted-foreground">
 {getTypeIcon(booking.meetingType)}
 <span>{booking.meetingType}</span>
 </div>
 {booking.company && (
 <div className="flex items-center gap-2 text-muted-foreground">
 <Building className="w-4 h-4 shrink-0 text-slate-400" />
 <span className="truncate">{booking.company}</span>
 </div>
 )}
 </div>
 </div>

 {/* Card Footer */}
 <div className="p-4 bg-muted border-t border-border flex items-center justify-between">
 <span className="text-xs text-slate-400">Created {format(parseISO(booking.createdAt), "MMM dd")}</span>
 <button
 onClick={() => {
 setSelectedBooking(booking);
 setEditStatus(booking.status);
 setEditMeetingLink("");
 }}
 className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 px-3 py-1.5 bg-card border border-border rounded-lg shadow-sm"
 >
 Manage
 </button>
 </div>
 </motion.div>
 ))}
 </div>
 )}

 {/* Manage Modal */}
 <AnimatePresence>
 {selectedBooking && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
 onClick={() => setSelectedBooking(null)}
 >
 <motion.div
 initial={{ scale: 0.95, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.95, opacity: 0 }}
 onClick={(e) => e.stopPropagation()}
 className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
 >
 <div className="px-6 py-4 border-b border-border flex items-center justify-between">
 <h2 className="text-lg font-bold text-foreground">Manage Booking</h2>
 <button onClick={() => setSelectedBooking(null)} className="p-1.5 hover:bg-muted dark:hover:bg-white/5 rounded-lg">
 <X className="w-5 h-5 text-slate-400" />
 </button>
 </div>

 <div className="p-6 space-y-6">
 {/* Details */}
 <div className="grid grid-cols-2 gap-4 text-sm">
 <div>
 <span className="text-muted-foreground block mb-1">Visitor Name</span>
 <strong className="text-foreground">{selectedBooking.name}</strong>
 </div>
 <div>
 <span className="text-muted-foreground block mb-1">Email</span>
 <a href={`mailto:${selectedBooking.email}`} className="text-primary-600 hover:underline">{selectedBooking.email}</a>
 </div>
 <div>
 <span className="text-muted-foreground block mb-1">Phone</span>
 <a href={`tel:${selectedBooking.phone}`} className="text-primary-600 hover:underline">{selectedBooking.phone}</a>
 </div>
 <div>
 <span className="text-muted-foreground block mb-1">Date & Time</span>
 <strong className="text-foreground">{format(parseISO(selectedBooking.meetingDate), "MMM dd, yyyy")} at {selectedBooking.meetingTime}</strong>
 </div>
 </div>

 {selectedBooking.notes && (
 <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
 <span className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider mb-2 block">Notes provided</span>
 <p className="text-sm text-amber-900 dark:text-amber-200">{selectedBooking.notes}</p>
 </div>
 )}

 {/* Status Update Form */}
 <div className="space-y-4 pt-4 border-t border-border">
 <div>
 <label className="block text-sm font-medium text-muted-foreground mb-1.5">Change Status</label>
 <select
 value={editStatus}
 onChange={(e) => setEditStatus(e.target.value)}
 className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm"
 >
 <option value="pending">Pending</option>
 <option value="approved">Approved</option>
 <option value="rescheduled">Rescheduled</option>
 <option value="completed">Completed</option>
 <option value="rejected">Rejected</option>
 <option value="cancelled">Cancelled</option>
 </select>
 </div>

 {editStatus === "approved" && selectedBooking.meetingType !== "Phone" && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
 <label className="block text-sm font-medium text-muted-foreground mb-1.5">Meeting Link (sent via email)</label>
 <input
 type="url"
 value={editMeetingLink}
 onChange={(e) => setEditMeetingLink(e.target.value)}
 placeholder="https://meet.google.com/..."
 className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm"
 />
 </motion.div>
 )}

 <div className="flex items-center justify-between pt-4">
 <button
 onClick={() => handleDelete(selectedBooking._id)}
 disabled={actionLoading === selectedBooking._id}
 className="text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition-colors"
 >
 Delete Booking
 </button>
 <button
 onClick={() => handleUpdateStatus(selectedBooking._id, editStatus, editMeetingLink)}
 disabled={actionLoading === selectedBooking._id || editStatus === selectedBooking.status}
 className="text-sm bg-primary-600 text-white hover:bg-primary-700 px-5 py-2 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
 >
 {actionLoading === selectedBooking._id && <Loader2 className="w-4 h-4 animate-spin" />}
 Save Changes
 </button>
 </div>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
