"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Loader2,
  AlertCircle,
  Search,
  MessageSquare,
  Users,
  UserCheck,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  UserPlus,
  X,
  Download,
  Filter,
  Bot,
  User,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

interface Conversation {
  _id: string;
  sessionId: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  messages: Message[];
  messageCount: number;
  lastMessage: string;
  status: "active" | "closed" | "converted";
  leadCaptured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  leads: number;
  active: number;
  converted: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminConversationsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [leadFilter, setLeadFilter] = useState(false);

  // View chat modal
  const [viewChat, setViewChat] = useState<Conversation | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewMessages, setViewMessages] = useState<Message[]>([]);

  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "15",
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (leadFilter) params.set("leadOnly", "true");

      const res = await fetch(`/api/admin/conversations?${params}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch");

      setConversations(json.data.conversations);
      setStats(json.data.stats);
      setPagination(json.data.pagination);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter, leadFilter]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchConversations();
  };

  const handleViewChat = async (conv: Conversation) => {
    setViewChat(conv);
    setViewLoading(true);
    try {
      const res = await fetch(`/api/admin/conversations/${conv._id}`);
      const json = await res.json();
      if (json.success) {
        setViewMessages(json.data.messages || []);
      }
    } catch {
      setViewMessages(conv.messages || []);
    } finally {
      setViewLoading(false);
    }
  };

  const handleConvertToLead = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ convertToLead: true }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to convert");
      await fetchConversations();
      if (viewChat?._id === id) setViewChat(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this conversation?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/conversations/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete");
      await fetchConversations();
      if (viewChat?._id === id) setViewChat(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    if (!conversations.length) return;
    const headers = ["Session ID", "Visitor Name", "Email", "Phone", "Messages", "Status", "Lead", "Date"];
    const rows = conversations.map((c) => [
      c.sessionId,
      c.visitorName || "",
      c.visitorEmail || "",
      c.visitorPhone || "",
      c.messageCount.toString(),
      c.status,
      c.leadCaptured ? "Yes" : "No",
      format(new Date(c.createdAt), "yyyy-MM-dd HH:mm"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversations_${format(new Date(), "yyyyMMdd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      closed: "bg-slate-100 text-slate-600 dark:bg-slate-700/30 dark:text-slate-400",
      converted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
    return styles[status] || styles.active;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => router.push("/admin")}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Chat Conversations</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-10">Monitor chatbot conversations and convert leads.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!conversations.length}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Chats", value: stats.total, icon: MessageSquare, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
            { label: "Active", value: stats.active, icon: TrendingUp, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
            { label: "Leads Captured", value: stats.leads, icon: Users, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
            { label: "Converted", value: stats.converted, icon: UserCheck, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </form>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="converted">Converted</option>
        </select>
        <button
          onClick={() => { setLeadFilter(!leadFilter); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
            leadFilter
              ? "bg-primary-600 text-white border-primary-600"
              : "bg-white dark:bg-dark-card text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-white/5"
          }`}
        >
          <Filter className="w-4 h-4 inline mr-1.5" />
          Leads Only
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No conversations found.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-dark-bg/50 border-b border-slate-200 dark:border-dark-border">
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Visitor</th>
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Message</th>
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Messages</th>
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-dark-border/50">
                  {conversations.map((conv) => (
                    <tr key={conv._id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-5">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {conv.visitorName || "Anonymous"}
                            {conv.leadCaptured && (
                              <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-semibold">LEAD</span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{conv.visitorEmail || conv.sessionId.slice(0, 20)}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                        {conv.lastMessage || "—"}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">{conv.messageCount}</td>
                      <td className="py-3.5 px-5">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadge(conv.status)}`}>
                          {conv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">
                        {format(new Date(conv.createdAt), "MMM dd, HH:mm")}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewChat(conv)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title="View chat"
                          >
                            <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          </button>
                          {conv.leadCaptured && conv.status !== "converted" && (
                            <button
                              onClick={() => handleConvertToLead(conv._id)}
                              disabled={actionLoading === conv._id}
                              className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Convert to lead"
                            >
                              {actionLoading === conv._id ? (
                                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                              ) : (
                                <UserPlus className="w-4 h-4 text-blue-500" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(conv._id)}
                            disabled={actionLoading === conv._id}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-300 px-2">
                  {currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Chat Modal */}
      <AnimatePresence>
        {viewChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewChat(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {viewChat.visitorName || "Anonymous Visitor"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {viewChat.visitorEmail || viewChat.sessionId.slice(0, 25)}
                    {viewChat.visitorPhone && ` • ${viewChat.visitorPhone}`}
                  </p>
                </div>
                <button
                  onClick={() => setViewChat(null)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {viewLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                  </div>
                ) : (
                  viewMessages.map((msg, i) => (
                    <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "bot" && (
                        <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary-600 text-white rounded-br-sm"
                            : "bg-slate-100 dark:bg-dark-bg/80 text-slate-700 dark:text-slate-300 rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-slate-200 dark:border-dark-border flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-400">
                  {format(new Date(viewChat.createdAt), "MMM dd, yyyy HH:mm")}
                </span>
                <div className="flex items-center gap-2">
                  {viewChat.leadCaptured && viewChat.status !== "converted" && (
                    <button
                      onClick={() => handleConvertToLead(viewChat._id)}
                      disabled={actionLoading === viewChat._id}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5 inline mr-1" />
                      Convert to Lead
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(viewChat._id)}
                    disabled={actionLoading === viewChat._id}
                    className="px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
