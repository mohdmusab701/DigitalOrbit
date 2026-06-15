"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Trash2,
  X,
  CreditCard,
  ArrowLeft,
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";

interface Client {
  _id: string;
  name: string;
  email: string;
  company: string;
}

interface Project {
  _id: string;
  projectName: string;
}

interface Payment {
  _id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: "Pending" | "Paid" | "Failed" | "Refunded";
  clientId: Client;
  projectId: Project;
  paymentDate?: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Stats {
  totalRevenue: number;
  pending: number;
  paid: number;
  failed: number;
}

export default function AdminPaymentsPage() {
  const router = useRouter();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    amount: "",
    currency: "INR",
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPayments = useCallback(async (page: number, search: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch payments");

      setPayments(json.data.payments);
      setPagination(json.data.pagination);
      setStats(json.data.stats);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments(currentPage, debouncedSearch, statusFilter);
  }, [currentPage, debouncedSearch, statusFilter, fetchPayments]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openAddModal = async () => {
    setFormData({ clientId: "", projectId: "", amount: "", currency: "INR" });
    setFormErrors({});
    setModalOpen(true);
    
    try {
      const resC = await fetch("/api/admin/clients?limit=100");
      const jsonC = await resC.json();
      if (jsonC.success) setClients(jsonC.data.clients);

      const resP = await fetch("/api/admin/client-projects?limit=100");
      const jsonP = await resP.json();
      if (jsonP.success) setProjects(jsonP.data.projects);
    } catch (err) {
      console.error("Failed to fetch clients/projects for dropdown", err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleCreateInvoice = async () => {
    setIsSubmitting(true);
    setFormErrors({});
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.errors) setFormErrors(json.errors);
        throw new Error(json.error || "Failed to create invoice");
      }

      showToast("Invoice generated and sent successfully!", "success");
      closeModal();
      await fetchPayments(1, debouncedSearch, statusFilter);
    } catch (err) {
      if (Object.keys(formErrors).length === 0) showToast((err as Error).message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/payments/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete payment");

      setDeleteModalId(null);
      showToast("Invoice deleted successfully!", "success");
      await fetchPayments(currentPage, debouncedSearch, statusFilter);
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
      case "Refunded":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {toast && (
        <div className={`fixed top-6 right-6 z-[60] px-5 py-3 rounded-xl shadow-lg border backdrop-blur-sm flex items-center gap-3 animate-in slide-in-from-right duration-300 ${
          toast.type === "success" ? "bg-green-50/95 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" : "bg-red-50/95 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => router.push("/admin")}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Payments</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-10">Manage invoices and track revenue.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors text-sm font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{(stats?.totalRevenue || 0).toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card border border-green-100 dark:border-green-900/30 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-green-600/70 dark:text-green-400/70 uppercase tracking-wide">Paid Invoices</p>
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">{stats?.paid || 0}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card border border-yellow-100 dark:border-yellow-900/30 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-yellow-600/70 dark:text-yellow-400/70 uppercase tracking-wide">Pending</p>
            <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats?.pending || 0}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card border border-red-100 dark:border-red-900/30 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-red-600/70 dark:text-red-400/70 uppercase tracking-wide">Failed</p>
            <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">{stats?.failed || 0}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice number, client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="pl-10 pr-10 py-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-700 dark:text-slate-300 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30 min-w-[160px]"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            <svg className="h-3 w-3 fill-current text-slate-400" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-dark-border">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice / Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client / Project</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p>No invoices found.</p>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" /> {payment.invoiceNumber}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {format(new Date(payment.createdAt), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{payment.clientId?.name}</div>
                      <div className="text-xs text-slate-500">{payment.projectId?.projectName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteModalId(payment._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-dark-border flex items-center justify-between bg-slate-50/50 dark:bg-dark-bg/50">
            <p className="text-sm text-slate-600">
              Showing page <span className="font-medium">{pagination.page}</span> of <span className="font-medium">{pagination.totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={currentPage === pagination.totalPages} className="p-2 rounded-lg border border-slate-200 disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Invoice</h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Client <span className="text-red-500">*</span></label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl text-sm"
                >
                  <option value="" disabled>Select Client</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.company})</option>)}
                </select>
                {formErrors.clientId && <p className="mt-1 text-xs text-red-500">{formErrors.clientId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Project <span className="text-red-500">*</span></label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl text-sm"
                >
                  <option value="" disabled>Select Project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                </select>
                {formErrors.projectId && <p className="mt-1 text-xs text-red-500">{formErrors.projectId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Amount <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl text-sm"
                  />
                  {formErrors.amount && <p className="mt-1 text-xs text-red-500">{formErrors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    readOnly
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-bg/50 border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-dark-border">
              <button onClick={closeModal} disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm">Cancel</button>
              <button onClick={handleCreateInvoice} disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold text-sm flex justify-center items-center gap-2">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : "Generate Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card border border-slate-200 rounded-2xl p-6 w-full max-w-sm text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Delete Invoice?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModalId(null)} className="flex-1 py-2 bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteModalId)} disabled={isSubmitting} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
