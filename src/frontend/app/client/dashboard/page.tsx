"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Loader2,
  AlertCircle,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  CreditCard,
  ArrowRight,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ClientInfo {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
}

interface Project {
  _id: string;
  projectName: string;
  description: string;
  status: string;
  budget?: number;
  startDate?: string;
  deadline?: string;
  technologies: string[];
}

interface PaymentItem {
  _id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: "Pending" | "Paid" | "Failed" | "Refunded";
  paymentDate?: string;
  createdAt: string;
  projectId?: { _id: string; projectName: string };
}

interface Stats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalInvoiced: number;
  totalPaid: number;
  totalPending: number;
  pendingInvoices: number;
}

type Tab = "overview" | "projects" | "invoices";

export default function ClientDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/client/dashboard");
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load dashboard");
      }
      setClient(json.data.client);
      setProjects(json.data.projects);
      setPayments(json.data.payments);
      setStats(json.data.stats);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLogout = async () => {
    try {
      await fetch("/api/client/auth/logout", { method: "POST" });
      router.push("/client/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Planning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      Testing: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "On Hold": "bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-400",
      Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      Failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      Refunded: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <FolderOpen className="w-4 h-4" /> },
    { id: "invoices", label: "Invoices", icon: <CreditCard className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button onClick={fetchDashboard} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-dark-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Welcome back, <span className="text-primary-600">{client?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{client?.company || client?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-1 mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary-600 text-white shadow-md shadow-primary-500/25"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ─── Overview Tab ─── */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Active Projects</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.activeProjects || 0}</p>
                </div>
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Total Paid</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{(stats?.totalPaid || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Pending Amount</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{(stats?.totalPending || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Pending Invoices</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.pendingInvoices || 0}</p>
                </div>
              </div>

              {/* Quick Actions & Recent */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Recent Projects</h3>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {projects.length === 0 ? (
                    <p className="text-sm text-slate-400 py-4 text-center">No projects yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {projects.slice(0, 4).map((project) => (
                        <div
                          key={project._id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-dark-bg/50 border border-slate-100 dark:border-dark-border/50"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{project.projectName}</p>
                            {project.deadline && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Due: {format(new Date(project.deadline), "MMM dd, yyyy")}
                              </p>
                            )}
                          </div>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pending Invoices */}
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Pending Invoices</h3>
                    <button
                      onClick={() => setActiveTab("invoices")}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {payments.filter((p) => p.status === "Pending").length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">All invoices are cleared!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payments
                        .filter((p) => p.status === "Pending")
                        .slice(0, 4)
                        .map((payment) => (
                          <div
                            key={payment._id}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-dark-bg/50 border border-slate-100 dark:border-dark-border/50"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">#{payment.invoiceNumber}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {payment.projectId?.projectName || "—"}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                                ₹{payment.amount.toLocaleString()}
                              </span>
                              <button
                                onClick={() => router.push(`/client/pay/${payment._id}`)}
                                className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                              >
                                Pay Now
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Projects Tab ─── */}
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">No projects assigned yet.</p>
                  </div>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project._id}
                      className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-5 hover:shadow-lg hover:shadow-primary-500/5 transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{project.projectName}</h4>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{project.description}</p>
                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span key={tech} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md font-medium">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-dark-border/50">
                        {project.budget ? <span>Budget: ₹{project.budget.toLocaleString()}</span> : <span />}
                        {project.deadline && <span>Due: {format(new Date(project.deadline), "MMM dd")}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ─── Invoices Tab ─── */}
          {activeTab === "invoices" && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {payments.length === 0 ? (
                <div className="text-center py-16">
                  <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No invoices yet.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-dark-bg/50 border-b border-slate-200 dark:border-dark-border">
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoice</th>
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project</th>
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="text-left py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                          <th className="text-right py-3.5 px-5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-dark-border/50">
                        {payments.map((payment) => (
                          <tr key={payment._id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-5 font-medium text-slate-900 dark:text-white">#{payment.invoiceNumber}</td>
                            <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">{payment.projectId?.projectName || "—"}</td>
                            <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-white">
                              {payment.currency} {payment.amount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-5">
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">
                              {payment.paymentDate
                                ? format(new Date(payment.paymentDate), "MMM dd, yyyy")
                                : format(new Date(payment.createdAt), "MMM dd, yyyy")}
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              {payment.status === "Pending" ? (
                                <button
                                  onClick={() => router.push(`/client/pay/${payment._id}`)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                                >
                                  <IndianRupee className="w-3 h-3" />
                                  Pay Now
                                </button>
                              ) : payment.status === "Paid" ? (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                                </span>
                              ) : payment.status === "Failed" ? (
                                <button
                                  onClick={() => router.push(`/client/pay/${payment._id}`)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-xs font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                  <XCircle className="w-3 h-3" />
                                  Retry
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
