"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
 Loader2,
 FolderOpen,
 ChevronLeft,
 ChevronRight,
 AlertCircle,
 Plus,
 RefreshCw,
 Search,
 CheckCircle2,
 XCircle,
 PlayCircle,
 PauseCircle,
 Clock,
 Briefcase
} from "lucide-react";

interface Client {
 _id: string;
 name: string;
 company: string;
}

interface ClientProject {
 _id: string;
 projectName: string;
 clientId: Client;
 description: string;
 budget?: number;
 startDate?: string;
 deadline?: string;
 status: "Planning" | "In Progress" | "Testing" | "Completed" | "On Hold";
 technologies: string[];
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
 completed: number;
}

export default function AdminProjectsPage() {
 const router = useRouter();
 const [projects, setProjects] = useState<ClientProject[]>([]);
 const [pagination, setPagination] = useState<Pagination | null>(null);
 const [stats, setStats] = useState<Stats | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 
 // Filters
 const [currentPage, setCurrentPage] = useState(1);
 const [search, setSearch] = useState("");
 const [debouncedSearch, setDebouncedSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState("");

 useEffect(() => {
 const timer = setTimeout(() => setDebouncedSearch(search), 500);
 return () => clearTimeout(timer);
 }, [search]);

 const fetchProjects = async (page: number, searchQuery: string, status: string) => {
 setLoading(true);
 setError(null);
 try {
 const query = new URLSearchParams({
 page: page.toString(),
 limit: "10",
 ...(searchQuery && { search: searchQuery }),
 ...(status && { status })
 });

 const res = await fetch(`/api/admin/client-projects?${query.toString()}`);
 const json = await res.json();
 
 if (!res.ok || !json.success) {
 throw new Error(json.error || "Failed to fetch projects");
 }

 setProjects(json.data.projects);
 setPagination(json.data.pagination);
 setStats(json.data.stats);
 } catch (err) {
 setError((err as Error).message);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchProjects(currentPage, debouncedSearch, statusFilter);
 }, [currentPage, debouncedSearch, statusFilter]);

 const handlePrevPage = () => {
 if (currentPage > 1) setCurrentPage(currentPage - 1);
 };

 const handleNextPage = () => {
 if (pagination && currentPage < pagination.totalPages) {
 setCurrentPage(currentPage + 1);
 }
 };

 const getStatusIcon = (status: string) => {
 switch (status) {
 case "Planning": return <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
 case "In Progress": return <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
 case "Testing": return <RefreshCw className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
 case "Completed": return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
 case "On Hold": return <PauseCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
 default: return <Clock className="w-4 h-4 text-slate-400" />;
 }
 };

 const getStatusColor = (status: string) => {
 switch (status) {
 case "Planning": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
 case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
 case "Testing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
 case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
 case "On Hold": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
 default: return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-border";
 }
 };

 return (
 <div className="p-8 max-w-7xl mx-auto">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
 <div>
 <button 
 onClick={() => router.push("/admin")}
 className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors mb-2"
 >
 <ChevronLeft className="w-4 h-4" /> Back to Dashboard
 </button>
 <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
 <p className="text-sm text-muted-foreground mt-1">Manage and track client projects.</p>
 </div>
 <button
 onClick={() => router.push("/admin/projects/new")}
 className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
 >
 <Plus className="w-4 h-4" />
 New Project
 </button>
 </div>

 {/* Stats Cards */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
 <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
 <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center">
 <FolderOpen className="w-6 h-6 text-muted-foreground" />
 </div>
 <div>
 <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
 <h3 className="text-2xl font-bold text-foreground">{stats?.total || 0}</h3>
 </div>
 </div>
 <div className="bg-card border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 shadow-sm flex items-center gap-4">
 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
 <PlayCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
 </div>
 <div>
 <p className="text-sm font-medium text-blue-600/70 dark:text-blue-400/70">Active Projects</p>
 <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats?.active || 0}</h3>
 </div>
 </div>
 <div className="bg-card border border-green-100 dark:border-green-900/30 rounded-xl p-4 shadow-sm flex items-center gap-4">
 <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
 <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
 </div>
 <div>
 <p className="text-sm font-medium text-green-600/70 dark:text-green-400/70">Completed</p>
 <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">{stats?.completed || 0}</h3>
 </div>
 </div>
 </div>

 {/* Filters */}
 <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
 <div className="relative flex-1">
 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <input
 type="text"
 placeholder="Search projects by name..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30"
 />
 </div>
 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="w-full sm:w-48 px-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 appearance-none cursor-pointer"
 >
 <option value="">All Statuses</option>
 <option value="Planning">Planning</option>
 <option value="In Progress">In Progress</option>
 <option value="Testing">Testing</option>
 <option value="Completed">Completed</option>
 <option value="On Hold">On Hold</option>
 </select>
 </div>

 {/* Projects Table */}
 {error ? (
 <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
 <AlertCircle className="w-5 h-5" />
 <p>{error}</p>
 </div>
 ) : loading && projects.length === 0 ? (
 <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
 <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
 <p className="text-muted-foreground">Loading projects...</p>
 </div>
 ) : projects.length === 0 ? (
 <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
 <FolderOpen className="w-8 h-8 text-slate-400" />
 </div>
 <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
 <p className="text-muted-foreground max-w-sm mb-6">
 {search || statusFilter ? "No projects match your current filters." : "You haven't created any projects yet."}
 </p>
 {!(search || statusFilter) && (
 <button
 onClick={() => router.push("/admin/projects/new")}
 className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
 >
 Create First Project
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
 <tr className="bg-slate-50 dark:bg-white/5 border-b border-border">
 <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Name</th>
 <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
 <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
 <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deadline</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
 {projects.map((project) => (
 <tr 
 key={project._id} 
 onClick={() => router.push(`/admin/projects/${project._id}`)}
 className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
 >
 <td className="px-6 py-4">
 <div className="font-medium text-foreground flex items-center gap-2">
 <FolderOpen className="w-4 h-4 text-primary-500" />
 {project.projectName}
 </div>
 <div className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
 {project.technologies.slice(0, 3).join(", ")}
 {project.technologies.length > 3 && ` +${project.technologies.length - 3}`}
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="text-sm text-foreground font-medium">
 {project.clientId?.name || "Unknown"}
 </div>
 <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
 <Briefcase className="w-3 h-3" />
 {project.clientId?.company || "No Company"}
 </div>
 </td>
 <td className="px-6 py-4">
 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
 {getStatusIcon(project.status)}
 {project.status}
 </span>
 </td>
 <td className="px-6 py-4">
 <div className="text-sm text-muted-foreground">
 {project.deadline ? format(new Date(project.deadline), "MMM d, yyyy") : <span className="text-slate-400 italic">No deadline</span>}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Pagination Controls */}
 {pagination && pagination.totalPages > 1 && (
 <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted">
 <p className="text-sm text-muted-foreground">
 Showing page <span className="font-medium text-foreground">{pagination.page}</span> of{" "}
 <span className="font-medium text-foreground">{pagination.totalPages}</span>
 </p>
 <div className="flex items-center gap-2">
 <button
 onClick={handlePrevPage}
 disabled={currentPage === 1}
 className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 <button
 onClick={handleNextPage}
 disabled={currentPage === pagination.totalPages}
 className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 )}
 </div>
 )}
 </div>
 );
}
