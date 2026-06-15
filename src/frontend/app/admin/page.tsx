"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { LogOut, Loader2, Inbox, ChevronLeft, ChevronRight, AlertCircle, Phone, Mail, Clock, Users, Sparkles, Send, RefreshCw, CheckCircle2, XCircle, Trash2, UserPlus, X, Briefcase, FolderOpen, CreditCard, MessageSquare, Calendar } from "lucide-react";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: "new" | "contacted" | "proposal sent" | "in progress" | "converted" | "rejected";
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
  newLeads: number;
  contacted: number;
  converted: number;
  rejected: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [convertModalLead, setConvertModalLead] = useState<Lead | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertFormData, setConvertFormData] = useState({ address: "", notes: "" });
  const [convertError, setConvertError] = useState<string | null>(null);

  const fetchLeads = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/contacts?page=${page}&limit=10`);
      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch leads");
      }

      setLeads(json.data.leads);
      setPagination(json.data.pagination);
      setStats(json.data.stats);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update status");
      }
      
      // Refresh the current page to get updated stats and lead list
      await fetchLeads(currentPage);
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update lead status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE"
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete lead");
      }
      
      setDeleteModalId(null);
      // If we deleted the last item on the page, go to prev page
      if (leads.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchLeads(currentPage);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete lead. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConvertOpen = (lead: Lead) => {
    setConvertModalLead(lead);
    setConvertFormData({ address: "", notes: "" });
    setConvertError(null);
  };

  const handleConvertSubmit = async () => {
    if (!convertModalLead) return;
    setIsConverting(true);
    setConvertError(null);
    try {
      const res = await fetch("/api/admin/clients/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: convertModalLead._id,
          address: convertFormData.address,
          notes: convertFormData.notes,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to convert lead");
      }
      setConvertModalLead(null);
      await fetchLeads(currentPage);
    } catch (error) {
      setConvertError((error as Error).message);
    } finally {
      setIsConverting(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
      case "proposal sent": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800";
      case "in progress": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800";
      case "converted": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage inbound leads and contact requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/payments")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            Payments
          </button>
          <button
            onClick={() => router.push("/admin/projects")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <FolderOpen className="w-4 h-4" />
            Projects
          </button>
          <button
            onClick={() => router.push("/admin/clients")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <Briefcase className="w-4 h-4" />
            Clients
          </button>
          <button
            onClick={() => router.push("/admin/conversations")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Chats
          </button>
          <button
            onClick={() => router.push("/admin/bookings")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            Bookings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Leads</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.total || 0}</h3>
        </div>
        <div className="bg-white dark:bg-dark-card border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wide">New Leads</p>
          <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats?.newLeads || 0}</h3>
        </div>
        <div className="bg-white dark:bg-dark-card border border-yellow-100 dark:border-yellow-900/30 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-2">
            <Send className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-xs font-medium text-yellow-600/70 dark:text-yellow-400/70 uppercase tracking-wide">Contacted</p>
          <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats?.contacted || 0}</h3>
        </div>
        <div className="bg-white dark:bg-dark-card border border-green-100 dark:border-green-900/30 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-xs font-medium text-green-600/70 dark:text-green-400/70 uppercase tracking-wide">Converted</p>
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">{stats?.converted || 0}</h3>
        </div>
        <div className="bg-white dark:bg-dark-card border border-red-100 dark:border-red-900/30 rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-xs font-medium text-red-600/70 dark:text-red-400/70 uppercase tracking-wide">Rejected</p>
          <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">{stats?.rejected || 0}</h3>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      ) : loading && leads.length === 0 ? (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-dark-bg rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No leads found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            You don't have any contact requests yet. When users submit the contact form, they will appear here.
          </p>
        </div>
      ) : (
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
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service / Company</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-1/3">Message</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status & Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-medium text-slate-900 dark:text-white mb-1">{lead.name}</div>
                      <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{lead.email}</div>
                        {lead.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{lead.phone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {lead.service || <span className="text-slate-400">Not specified</span>}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {lead.company || <span className="text-slate-400 italic">No company</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-normal">
                      <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 max-w-sm" title={lead.message}>
                        {lead.message}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="mb-2 relative">
                        <select 
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          disabled={updatingId === lead._id}
                          className={`appearance-none outline-none cursor-pointer inline-flex items-center px-3 py-1 pr-8 rounded-full text-xs font-medium capitalize transition-colors ${getStatusColor(lead.status)} ${updatingId === lead._id ? 'opacity-50' : 'hover:opacity-80'}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="proposal sent">Proposal Sent</option>
                          <option value="in progress">In Progress</option>
                          <option value="converted">Converted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {updatingId === lead._id ? (
                           <RefreshCw className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-slate-500" />
                        ) : (
                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                             <svg className="h-3 w-3 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                           </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-60 hover:opacity-100 transition-opacity">
                        {lead.status !== "converted" && (
                          <button
                            onClick={() => handleConvertOpen(lead)}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Convert to Client"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteModalId(lead._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Lead"
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

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-dark-border flex items-center justify-between bg-slate-50/50 dark:bg-dark-bg/50">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing page <span className="font-medium text-slate-900 dark:text-white">{pagination.page}</span> of{" "}
                <span className="font-medium text-slate-900 dark:text-white">{pagination.totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Convert Lead to Client Modal */}
      {convertModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Convert to Client</h3>
              <button
                onClick={() => setConvertModalLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {convertError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {convertError}
              </div>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              You are about to convert <strong className="text-slate-700 dark:text-slate-300">{convertModalLead.name}</strong> into a Client. You can optionally add more details below.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Address (Optional)</label>
                <input
                  type="text"
                  value={convertFormData.address}
                  onChange={(e) => setConvertFormData({ ...convertFormData, address: e.target.value })}
                  placeholder="123 Main St, City"
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notes (Optional)</label>
                <textarea
                  value={convertFormData.notes}
                  onChange={(e) => setConvertFormData({ ...convertFormData, notes: e.target.value })}
                  placeholder="Initial notes about this client..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-dark-border">
              <button
                onClick={() => setConvertModalLead(null)}
                disabled={isConverting}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl transition-colors font-medium text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConvertSubmit}
                disabled={isConverting}
                className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isConverting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isConverting ? "Converting..." : "Convert to Client"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">Delete Lead</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-6">
              Are you sure you want to permanently delete this lead? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalId(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
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
