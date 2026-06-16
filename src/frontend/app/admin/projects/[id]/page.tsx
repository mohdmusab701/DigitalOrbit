"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
 ChevronLeft,
 Save,
 Trash2,
 AlertCircle,
 Loader2,
 FolderOpen,
} from "lucide-react";

interface Client {
 _id: string;
 name: string;
 company: string;
}

export default function AdminProjectDetailsPage() {
 const router = useRouter();
 const params = useParams();
 const id = params.id as string;
 const isNew = id === "new";

 const [loading, setLoading] = useState(!isNew);
 const [saving, setSaving] = useState(false);
 const [deleting, setDeleting] = useState(false);
 const [error, setError] = useState<string | null>(null);
 
 const [clients, setClients] = useState<Client[]>([]);

 const [formData, setFormData] = useState({
 projectName: "",
 clientId: "",
 description: "",
 budget: "",
 startDate: "",
 deadline: "",
 status: "Planning",
 technologies: "",
 });

 // Fetch clients for dropdown
 useEffect(() => {
 const fetchClients = async () => {
 try {
 const res = await fetch("/api/admin/clients?limit=100");
 const json = await res.json();
 if (json.success) {
 setClients(json.data.clients);
 }
 } catch (err) {
 console.error("Failed to fetch clients", err);
 }
 };
 fetchClients();
 }, []);

 // Fetch project details if not new
 useEffect(() => {
 if (isNew) return;
 const fetchProject = async () => {
 try {
 const res = await fetch(`/api/admin/client-projects/${id}`);
 const json = await res.json();
 if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch project");
 
 const project = json.data;
 setFormData({
 projectName: project.projectName || "",
 clientId: project.clientId?._id || "",
 description: project.description || "",
 budget: project.budget ? String(project.budget) : "",
 startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
 deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : "",
 status: project.status || "Planning",
 technologies: project.technologies?.join(", ") || "",
 });
 } catch (err) {
 setError((err as Error).message);
 } finally {
 setLoading(false);
 }
 };
 fetchProject();
 }, [id, isNew]);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setSaving(true);
 setError(null);

 const payload = {
 ...formData,
 budget: formData.budget ? Number(formData.budget) : undefined,
 technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
 };

 try {
 const url = isNew ? `/api/admin/client-projects` : `/api/admin/client-projects/${id}`;
 const method = isNew ? "POST" : "PATCH";

 const res = await fetch(url, {
 method,
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(payload)
 });
 const json = await res.json();

 if (!res.ok || !json.success) {
 throw new Error(json.error || "Failed to save project");
 }

 router.push("/admin/projects");
 router.refresh();
 } catch (err) {
 setError((err as Error).message);
 } finally {
 setSaving(false);
 }
 };

 const handleDelete = async () => {
 if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
 setDeleting(true);
 try {
 const res = await fetch(`/api/admin/client-projects/${id}`, { method: "DELETE" });
 const json = await res.json();
 if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete project");
 
 router.push("/admin/projects");
 router.refresh();
 } catch (err) {
 setError((err as Error).message);
 setDeleting(false);
 }
 };

 if (loading) {
 return (
 <div className="p-8 flex justify-center items-center min-h-[400px]">
 <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
 </div>
 );
 }

 return (
 <div className="p-8 max-w-4xl mx-auto">
 <div className="flex items-center justify-between mb-8">
 <div>
 <button 
 onClick={() => router.push("/admin/projects")}
 className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors mb-2"
 >
 <ChevronLeft className="w-4 h-4" /> Back to Projects
 </button>
 <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
 <FolderOpen className="w-8 h-8 text-primary-500" />
 {isNew ? "Create New Project" : "Edit Project"}
 </h1>
 </div>
 {!isNew && (
 <button
 onClick={handleDelete}
 disabled={deleting}
 className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
 >
 {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
 Delete
 </button>
 )}
 </div>

 {error && (
 <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6">
 <AlertCircle className="w-5 h-5 shrink-0" />
 <p>{error}</p>
 </div>
 )}

 <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="block text-sm font-medium text-muted-foreground">Project Name <span className="text-red-500">*</span></label>
 <input
 required
 type="text"
 value={formData.projectName}
 onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
 placeholder="e.g. Website Redesign"
 className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30"
 />
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-muted-foreground">Assign Client <span className="text-red-500">*</span></label>
 <select
 required
 value={formData.clientId}
 onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
 className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 appearance-none cursor-pointer"
 >
 <option value="" disabled>Select a client...</option>
 {clients.map(client => (
 <option key={client._id} value={client._id}>{client.name} ({client.company || 'No Company'})</option>
 ))}
 </select>
 </div>
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-muted-foreground">Description <span className="text-red-500">*</span></label>
 <textarea
 required
 rows={4}
 value={formData.description}
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 placeholder="Detailed description of the project scope and goals..."
 className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <label className="block text-sm font-medium text-muted-foreground">Status</label>
 <select
 value={formData.status}
 onChange={(e) => setFormData({ ...formData, status: e.target.value })}
 className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 appearance-none cursor-pointer"
 >
 <option value="Planning">Planning</option>
 <option value="In Progress">In Progress</option>
 <option value="Testing">Testing</option>
 <option value="Completed">Completed</option>
 <option value="On Hold">On Hold</option>
 </select>
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-muted-foreground">Budget (USD)</label>
 <input
 type="number"
 min="0"
 value={formData.budget}
 onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
 placeholder="e.g. 5000"
 className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30"
 />
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-muted-foreground">Technologies</label>
 <input
 type="text"
 value={formData.technologies}
 onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
 placeholder="React, Node.js, MongoDB"
 className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="block text-sm font-medium text-muted-foreground">Start Date</label>
 <input
 type="date"
 value={formData.startDate}
 onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
 className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30"
 />
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-muted-foreground">Deadline</label>
 <input
 type="date"
 value={formData.deadline}
 onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
 className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30"
 />
 </div>
 </div>

 <div className="pt-6 border-t border-border flex justify-end gap-3">
 <button
 type="button"
 onClick={() => router.push("/admin/projects")}
 className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-muted-foreground rounded-lg transition-colors font-medium text-sm"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={saving}
 className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
 >
 {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
 {isNew ? "Create Project" : "Save Changes"}
 </button>
 </div>
 </form>
 </div>
 );
}
