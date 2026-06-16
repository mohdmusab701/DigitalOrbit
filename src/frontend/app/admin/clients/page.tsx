"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
 LogOut,
 Loader2,
 Inbox,
 ChevronLeft,
 ChevronRight,
 AlertCircle,
 Phone,
 Mail,
 Clock,
 Users,
 UserCheck,
 UserX,
 Plus,
 Search,
 Filter,
 Edit3,
 Trash2,
 X,
 ArrowLeft,
 Building2,
 MapPin,
 StickyNote,
 FolderOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────

interface Client {
 _id: string;
 name: string;
 email: string;
 phone: string;
 company: string;
 address: string;
 notes: string;
 status: "active" | "inactive";
 createdAt: string;
}

interface Pagination {
 total: number;
 page: number;
 limit: number;
 totalPages: number;
}

interface Stats {
 total: number;
 active: number;
 inactive: number;
}

// ─── Component ────────────────────────────────────────────────

export default function ClientsPage() {
 const router = useRouter();

 // Data state
 const [clients, setClients] = useState<Client[]>([]);
 const [pagination, setPagination] = useState<Pagination | null>(null);
 const [stats, setStats] = useState<Stats | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 // Pagination & filter state
 const [currentPage, setCurrentPage] = useState(1);
 const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState("");
 const [debouncedSearch, setDebouncedSearch] = useState("");

 // Modal state
 const [modalOpen, setModalOpen] = useState(false);
 const [editingClient, setEditingClient] = useState<Client | null>(null);
 const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isDeleting, setIsDeleting] = useState(false);
 const [formErrors, setFormErrors] = useState<Record<string, string>>({});

 // Form state
 const [formData, setFormData] = useState({
 name: "",
 email: "",
 phone: "",
 company: "",
 address: "",
 notes: "",
 status: "active" as "active" | "inactive",
 });

 // Toast state
 const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

 // ─── Debounce search ─────────────────────────────────────────

 useEffect(() => {
 const timer = setTimeout(() => {
 setDebouncedSearch(searchQuery);
 setCurrentPage(1);
 }, 400);
 return () => clearTimeout(timer);
 }, [searchQuery]);

 // ─── Fetch clients ────────────────────────────────────────────

 const fetchClients = useCallback(async (page: number, search: string, status: string) => {
 setLoading(true);
 setError(null);
 try {
 const params = new URLSearchParams({
 page: String(page),
 limit: "10",
 });
 if (search.trim()) params.set("search", search.trim());
 if (status) params.set("status", status);

 const res = await fetch(`/api/admin/clients?${params.toString()}`);
 const json = await res.json();

 if (!res.ok || !json.success) {
 throw new Error(json.error || "Failed to fetch clients");
 }

 setClients(json.data.clients);
 setPagination(json.data.pagination);
 setStats(json.data.stats);
 } catch (err) {
 setError((err as Error).message);
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => {
 fetchClients(currentPage, debouncedSearch, statusFilter);
 }, [currentPage, debouncedSearch, statusFilter, fetchClients]);

 // ─── Helpers ──────────────────────────────────────────────────

 const showToast = (message: string, type: "success" | "error") => {
 setToast({ message, type });
 setTimeout(() => setToast(null), 3500);
 };

 const resetForm = () => {
 setFormData({ name: "", email: "", phone: "", company: "", address: "", notes: "", status: "active" });
 setFormErrors({});
 setEditingClient(null);
 };

 const openAddModal = () => {
 resetForm();
 setModalOpen(true);
 };

 const openEditModal = (client: Client) => {
 setEditingClient(client);
 setFormData({
 name: client.name,
 email: client.email,
 phone: client.phone,
 company: client.company,
 address: client.address,
 notes: client.notes,
 status: client.status,
 });
 setFormErrors({});
 setModalOpen(true);
 };

 const closeModal = () => {
 setModalOpen(false);
 resetForm();
 };

 // ─── CRUD handlers ───────────────────────────────────────────

 const handleSubmit = async () => {
 setIsSubmitting(true);
 setFormErrors({});

 try {
 const url = editingClient
 ? `/api/admin/clients/${editingClient._id}`
 : "/api/admin/clients";
 const method = editingClient ? "PATCH" : "POST";

 const res = await fetch(url, {
 method,
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(formData),
 });
 const json = await res.json();

 if (!res.ok || !json.success) {
 if (json.errors) {
 setFormErrors(json.errors);
 }
 throw new Error(json.error || "Failed to save client");
 }

 showToast(
 editingClient ? "Client updated successfully!" : "Client created successfully!",
 "success"
 );
 closeModal();
 await fetchClients(currentPage, debouncedSearch, statusFilter);
 } catch (err) {
 if (Object.keys(formErrors).length === 0) {
 showToast((err as Error).message, "error");
 }
 } finally {
 setIsSubmitting(false);
 }
 };

 const handleDelete = async (id: string) => {
 setIsDeleting(true);
 try {
 const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
 const json = await res.json();

 if (!res.ok || !json.success) {
 throw new Error(json.error || "Failed to delete client");
 }

 setDeleteModalId(null);
 showToast("Client deleted successfully!", "success");

 if (clients.length === 1 && currentPage > 1) {
 setCurrentPage(currentPage - 1);
 } else {
 await fetchClients(currentPage, debouncedSearch, statusFilter);
 }
 } catch (err) {
 showToast((err as Error).message, "error");
 } finally {
 setIsDeleting(false);
 }
 };

 const handleStatusToggle = async (client: Client) => {
 const newStatus = client.status === "active" ? "inactive" : "active";
 try {
 const res = await fetch(`/api/admin/clients/${client._id}`, {
 method: "PATCH",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ status: newStatus }),
 });
 const json = await res.json();

 if (!res.ok || !json.success) {
 throw new Error(json.error || "Failed to update status");
 }

 await fetchClients(currentPage, debouncedSearch, statusFilter);
 showToast(`Client marked as ${newStatus}`, "success");
 } catch (err) {
 showToast((err as Error).message, "error");
 }
 };

 const handleLogout = async () => {
 try {
 await fetch("/api/auth/logout", { method: "POST" });
 router.push("/admin/login");
 router.refresh();
 } catch (error) {
 console.error("Logout failed:", error);
 }
 };

 // ─── Render ───────────────────────────────────────────────────

 return (
 <div className="p-4 sm:p-8 max-w-7xl mx-auto">
 {/* Toast Notification */}
 {toast && (
 <div
 className={`fixed top-6 right-6 z-[60] px-5 py-3 rounded-xl shadow-lg border backdrop-blur-sm flex items-center gap-3 animate-in slide-in-from-right duration-300 ${
 toast.type === "success"
 ? "bg-green-50/95 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
 : "bg-red-50/95 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
 }`}
 >
 {toast.type === "success" ? (
 <UserCheck className="w-4 h-4 shrink-0" />
 ) : (
 <AlertCircle className="w-4 h-4 shrink-0" />
 )}
 <span className="text-sm font-medium">{toast.message}</span>
 </div>
 )}

 {/* Header */}
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
 <div>
 <div className="flex items-center gap-3 mb-1">
 <button
 onClick={() => router.push("/admin")}
 className="p-1.5 text-slate-400 hover:text-muted-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-white/10 rounded-lg transition-colors"
 title="Back to Dashboard"
 >
 <ArrowLeft className="w-5 h-5" />
 </button>
 <h1 className="text-3xl font-bold text-foreground">Clients</h1>
 </div>
 <p className="text-sm text-muted-foreground ml-10">
 Manage your client relationships and records.
 </p>
 </div>
 <div className="flex items-center gap-3">
 <button
 onClick={() => router.push("/admin/projects")}
 className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-muted-foreground hover:bg-muted dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium shadow-sm"
 >
 <FolderOpen className="w-4 h-4" />
 Projects
 </button>
 <button
 onClick={openAddModal}
 className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors text-sm font-semibold shadow-sm shadow-primary-500/25"
 >
 <Plus className="w-4 h-4" />
 Add Client
 </button>
 <button
 onClick={handleLogout}
 className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl transition-colors text-sm font-medium"
 >
 <LogOut className="w-4 h-4" />
 Logout
 </button>
 </div>
 </div>

 {/* Stats Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
 <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
 <div className="w-12 h-12 bg-muted dark:bg-white/5 rounded-xl flex items-center justify-center shrink-0">
 <Users className="w-6 h-6 text-muted-foreground" />
 </div>
 <div>
 <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Clients</p>
 <h3 className="text-2xl font-bold text-foreground">{stats?.total || 0}</h3>
 </div>
 </div>
 <div className="bg-card border border-green-100 dark:border-green-900/30 rounded-xl p-5 shadow-sm flex items-center gap-4">
 <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center shrink-0">
 <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
 </div>
 <div>
 <p className="text-xs font-medium text-green-600/70 dark:text-green-400/70 uppercase tracking-wide">Active</p>
 <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">{stats?.active || 0}</h3>
 </div>
 </div>
 <div className="bg-card border border-red-100 dark:border-red-900/30 rounded-xl p-5 shadow-sm flex items-center gap-4">
 <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center shrink-0">
 <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
 </div>
 <div>
 <p className="text-xs font-medium text-red-600/70 dark:text-red-400/70 uppercase tracking-wide">Inactive</p>
 <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">{stats?.inactive || 0}</h3>
 </div>
 </div>
 </div>

 {/* Search & Filter Bar */}
 <div className="flex flex-col sm:flex-row gap-3 mb-6">
 <div className="relative flex-1">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 placeholder="Search by name, email, or company..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
 />
 {searchQuery && (
 <button
 onClick={() => setSearchQuery("")}
 className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-muted-foreground dark:hover:text-slate-300"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 <div className="relative">
 <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
 <select
 value={statusFilter}
 onChange={(e) => {
 setStatusFilter(e.target.value);
 setCurrentPage(1);
 }}
 className="pl-10 pr-10 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all min-w-[160px]"
 >
 <option value="">All Statuses</option>
 <option value="active">Active</option>
 <option value="inactive">Inactive</option>
 </select>
 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
 <svg className="h-3 w-3 fill-current text-slate-400" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
 </div>
 </div>
 </div>

 {/* Client Table */}
 {error ? (
 <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
 <AlertCircle className="w-5 h-5 shrink-0" />
 <p>{error}</p>
 </div>
 ) : loading && clients.length === 0 ? (
 <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
 <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
 <p className="text-muted-foreground">Loading clients...</p>
 </div>
 ) : clients.length === 0 ? (
 <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
 <Inbox className="w-8 h-8 text-slate-400" />
 </div>
 <h3 className="text-xl font-semibold text-foreground mb-2">
 {debouncedSearch || statusFilter ? "No clients match your filters" : "No clients yet"}
 </h3>
 <p className="text-muted-foreground max-w-sm mb-4">
 {debouncedSearch || statusFilter
 ? "Try adjusting your search or filters."
 : "Add your first client to get started."}
 </p>
 {!debouncedSearch && !statusFilter && (
 <button
 onClick={openAddModal}
 className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors text-sm font-semibold"
 >
 <Plus className="w-4 h-4" />
 Add Client
 </button>
 )}
 </div>
 ) : (
 <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm relative">
 {loading && (
 <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10">
 <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
 </div>
 )}
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse whitespace-nowrap">
 <thead>
 <tr className="bg-muted dark:bg-white/5 border-b border-border">
 <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
 <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
 <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
 <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
 <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
 <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
 {clients.map((client) => (
 <tr key={client._id} className="hover:bg-muted dark:hover:bg-card/[0.02] transition-colors group">
 <td className="px-6 py-4">
 <div className="font-medium text-foreground">{client.name}</div>
 <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
 <Clock className="w-3 h-3" />
 {format(new Date(client.createdAt), "MMM d, yyyy")}
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
 {client.company ? (
 <>
 <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
 {client.company}
 </>
 ) : (
 <span className="text-slate-400 italic">—</span>
 )}
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
 <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
 {client.email}
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
 {client.phone ? (
 <>
 <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
 {client.phone}
 </>
 ) : (
 <span className="text-slate-400 italic">—</span>
 )}
 </div>
 </td>
 <td className="px-6 py-4">
 <button
 onClick={() => handleStatusToggle(client)}
 className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize transition-all hover:scale-105 cursor-pointer ${
 client.status === "active"
 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
 : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
 }`}
 >
 {client.status === "active" ? (
 <UserCheck className="w-3 h-3 mr-1" />
 ) : (
 <UserX className="w-3 h-3 mr-1" />
 )}
 {client.status}
 </button>
 </td>
 <td className="px-6 py-4 text-right">
 <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
 <button
 onClick={() => openEditModal(client)}
 className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
 title="Edit Client"
 >
 <Edit3 className="w-4 h-4" />
 </button>
 <button
 onClick={() => setDeleteModalId(client._id)}
 className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
 title="Delete Client"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 {pagination && pagination.totalPages > 1 && (
 <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted">
 <p className="text-sm text-muted-foreground">
 Showing page <span className="font-medium text-foreground">{pagination.page}</span> of{" "}
 <span className="font-medium text-foreground">{pagination.totalPages}</span>
 <span className="ml-2 text-slate-400">({pagination.total} result{pagination.total !== 1 ? "s" : ""})</span>
 </p>
 <div className="flex items-center gap-2">
 <button
 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
 disabled={currentPage === 1}
 className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 <button
 onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
 disabled={currentPage === pagination.totalPages}
 className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 )}
 </div>
 )}

 {/* ─── Add / Edit Client Modal ─────────────────────────────── */}
 {modalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
 <div className="bg-card border border-border rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-xl font-bold text-foreground">
 {editingClient ? "Edit Client" : "Add New Client"}
 </h3>
 <button
 onClick={closeModal}
 className="p-1.5 text-slate-400 hover:text-muted-foreground dark:hover:text-slate-300 hover:bg-muted dark:hover:bg-white/10 rounded-lg transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="space-y-4">
 {/* Name */}
 <div>
 <label className="block text-sm font-medium text-muted-foreground mb-1.5">
 Name <span className="text-red-500">*</span>
 </label>
 <input
 type="text"
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 placeholder="DigitalOrbit"
 className={`w-full px-4 py-2.5 bg-background border rounded-xl text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all ${
 formErrors.name ? "border-red-300 dark:border-red-700" : "border-border"
 }`}
 />
 {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
 </div>

 {/* Email */}
 <div>
 <label className="block text-sm font-medium text-muted-foreground mb-1.5">
 Email <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="email"
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 placeholder="john@company.com"
 className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all ${
 formErrors.email ? "border-red-300 dark:border-red-700" : "border-border"
 }`}
 />
 </div>
 {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
 </div>

 {/* Phone + Company (side by side) */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-muted-foreground mb-1.5">Phone</label>
 <div className="relative">
 <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="tel"
 value={formData.phone}
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 placeholder="+91 9335289386"
 className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all ${
 formErrors.phone ? "border-red-300 dark:border-red-700" : "border-border"
 }`}
 />
 </div>
 {formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
 </div>
 <div>
 <label className="block text-sm font-medium text-muted-foreground mb-1.5">Company</label>
 <div className="relative">
 <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 value={formData.company}
 onChange={(e) => setFormData({ ...formData, company: e.target.value })}
 placeholder="Acme Inc."
 className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all ${
 formErrors.company ? "border-red-300 dark:border-red-700" : "border-border"
 }`}
 />
 </div>
 {formErrors.company && <p className="mt-1 text-xs text-red-500">{formErrors.company}</p>}
 </div>
 </div>

 {/* Address */}
 <div>
 <label className="block text-sm font-medium text-muted-foreground mb-1.5">Address</label>
 <div className="relative">
 <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
 <input
 type="text"
 value={formData.address}
 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
 placeholder="123 Main St, City, State 12345"
 className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all ${
 formErrors.address ? "border-red-300 dark:border-red-700" : "border-border"
 }`}
 />
 </div>
 {formErrors.address && <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>}
 </div>

 {/* Notes */}
 <div>
 <label className="block text-sm font-medium text-muted-foreground mb-1.5">Notes</label>
 <div className="relative">
 <StickyNote className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
 <textarea
 value={formData.notes}
 onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
 placeholder="Any notes about this client..."
 rows={3}
 className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-none ${
 formErrors.notes ? "border-red-300 dark:border-red-700" : "border-border"
 }`}
 />
 </div>
 {formErrors.notes && <p className="mt-1 text-xs text-red-500">{formErrors.notes}</p>}
 </div>

 {/* Status */}
 <div>
 <label className="block text-sm font-medium text-muted-foreground mb-1.5">Status</label>
 <div className="flex gap-3">
 <button
 type="button"
 onClick={() => setFormData({ ...formData, status: "active" })}
 className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
 formData.status === "active"
 ? "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
 : "bg-background border-border text-muted-foreground hover:border-green-300 dark:hover:border-green-700"
 }`}
 >
 <UserCheck className="w-4 h-4" />
 Active
 </button>
 <button
 type="button"
 onClick={() => setFormData({ ...formData, status: "inactive" })}
 className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
 formData.status === "inactive"
 ? "bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400"
 : "bg-background border-border text-muted-foreground hover:border-red-300 dark:hover:border-red-700"
 }`}
 >
 <UserX className="w-4 h-4" />
 Inactive
 </button>
 </div>
 </div>
 </div>

 {/* Modal Actions */}
 <div className="flex gap-3 mt-6 pt-4 border-t border-border">
 <button
 onClick={closeModal}
 disabled={isSubmitting}
 className="flex-1 px-4 py-2.5 bg-muted hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-muted-foreground rounded-xl transition-colors font-medium text-sm disabled:opacity-50"
 >
 Cancel
 </button>
 <button
 onClick={handleSubmit}
 disabled={isSubmitting}
 className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-primary-500/25"
 >
 {isSubmitting ? (
 <>
 <Loader2 className="w-4 h-4 animate-spin" />
 {editingClient ? "Updating..." : "Creating..."}
 </>
 ) : editingClient ? (
 "Update Client"
 ) : (
 "Create Client"
 )}
 </button>
 </div>
 </div>
 </div>
 )}

 {/* ─── Delete Confirmation Modal ───────────────────────────── */}
 {deleteModalId && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
 <div className="bg-card border border-border rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
 <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
 <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
 </div>
 <h3 className="text-lg font-bold text-foreground text-center mb-2">Delete Client</h3>
 <p className="text-muted-foreground text-center text-sm mb-6">
 Are you sure you want to permanently delete this client? This action cannot be undone.
 </p>
 <div className="flex gap-3">
 <button
 onClick={() => setDeleteModalId(null)}
 disabled={isDeleting}
 className="flex-1 px-4 py-2 bg-muted hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-muted-foreground rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
 >
 Cancel
 </button>
 <button
 onClick={() => handleDelete(deleteModalId)}
 disabled={isDeleting}
 className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
 >
 {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
 {isDeleting ? "Deleting..." : "Delete"}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
