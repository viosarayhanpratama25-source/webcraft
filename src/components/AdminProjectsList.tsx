"use client";

import React, { useState } from "react";
import { 
  FolderKanban, Search, RefreshCw, CheckCircle, 
  AlertCircle, User, Mail, Phone, DollarSign, 
  Calendar, Layers, Shield 
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  budget: number;
  deadline: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  packageName: string;
}

interface AdminProjectsListProps {
  initialProjects: Project[];
}

const validStatuses = ["PENDING", "IN_PROGRESS", "REVIEW", "REVISION", "COMPLETED", "CANCELLED"];

export default function AdminProjectsList({ initialProjects }: AdminProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState("");
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showNotification = (text: string, type: "success" | "error") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    setUpdatingId(projectId);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((proj) => (proj.id === projectId ? { ...proj, status: newStatus } : proj))
        );
        showNotification("Status proyek berhasil diperbarui!", "success");
      } else {
        const errData = await res.json();
        showNotification(errData.error || "Gagal memperbarui status.", "error");
      }
    } catch (err) {
      showNotification("Kesalahan menyambung ke server.", "error");
    } finally {
      setUpdatingId("");
    }
  };

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = 
      proj.title.toLowerCase().includes(search.toLowerCase()) || 
      proj.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { bg: "#ecfdf5", border: "#a7f3d0", text: "#047857" };
      case "IN_PROGRESS":
        return { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" };
      case "PENDING":
        return { bg: "#fffbeb", border: "#fde68a", text: "#b45309" };
      case "REVIEW":
        return { bg: "#faf5ff", border: "#e9d5ff", text: "#6b21a8" };
      case "REVISION":
        return { bg: "#fdf2f8", border: "#fbcfe8", text: "#be185d" };
      default:
        return { bg: "#fef2f2", border: "#fca5a5", text: "#b91c1c" };
    }
  };

  const getPackageBadgeColor = (pkgName: string) => {
    switch (pkgName) {
      case "Starter":
        return { bg: "#f8fafc", border: "#cbd5e1", text: "#475569" };
      case "Professional":
        return { bg: "#e0e7ff", border: "#c7d2fe", text: "#4338ca" };
      case "Enterprise":
        return { bg: "#fae8ff", border: "#f5d0fe", text: "#86198f" };
      default:
        return { bg: "#f1f5f9", border: "#cbd5e1", text: "#334155" };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl flex items-center gap-2.5 text-xs font-bold shadow-lg border animate-bounce"
          style={{ 
            backgroundColor: notification.type === "success" ? "#ecfdf5" : "#fef2f2",
            borderColor: notification.type === "success" ? "#a7f3d0" : "#fecaca",
            color: notification.type === "success" ? "#047857" : "#b91c1c"
          }}
        >
          {notification.type === "success" ? <CheckCircle className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
          {notification.text}
        </div>
      )}

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center" style={{ color: "#94a3b8" }}>
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari nama proyek / klien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border"
            style={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#0f172a" }}
          />
        </div>

        {/* Tab status filters */}
        <div className="flex flex-wrap gap-1.5 border p-1 rounded-2xl bg-white" style={{ borderColor: "#e2e8f0" }}>
          {["ALL", ...validStatuses].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all border-0 cursor-pointer"
              style={{ 
                backgroundColor: statusFilter === status ? "#4f46e5" : "transparent",
                color: statusFilter === status ? "#ffffff" : "#64748b"
              }}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Projects Grid Cards (Redesigned from table to premium cards) */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center text-xs space-y-2 border border-dashed rounded-3xl bg-white" style={{ borderColor: "#cbd5e1" }}>
          <FolderKanban className="w-8 h-8 mx-auto" style={{ color: "#94a3b8" }} />
          <p style={{ color: "#64748b" }}>Tidak ada proyek yang cocok dengan filter pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => {
            const statusStyle = getStatusBadgeColor(proj.status);
            const packageStyle = getPackageBadgeColor(proj.packageName);
            return (
              <div 
                key={proj.id} 
                className="rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
              >
                
                {/* Header: Project Title, ID, and Badges */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-base leading-snug" style={{ color: "#0f172a" }}>
                        {proj.title}
                      </h3>
                      <span className="text-[9px] font-mono block" style={{ color: "#94a3b8" }}>
                        PROJ-ID: {proj.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Package Badge */}
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-lg border"
                        style={{ backgroundColor: packageStyle.bg, borderColor: packageStyle.border, color: packageStyle.text }}
                      >
                        {proj.packageName}
                      </span>
                    </div>
                  </div>

                  {/* Project description brief */}
                  <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>
                    {proj.description}
                  </p>
                </div>

                {/* Body Details: Client info & Metadata */}
                <div className="my-5 border-t border-b py-4 space-y-3" style={{ borderColor: "#f1f5f9" }}>
                  
                  {/* Client name / contact */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#334155" }}>
                      <User className="w-4 h-4" style={{ color: "#94a3b8" }} />
                      <span className="font-bold">{proj.clientName}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pl-6" style={{ color: "#64748b" }}>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {proj.clientEmail}
                      </span>
                      <a href={`https://wa.me/${proj.clientPhone.replace(/[^0-9]/g, "")}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 font-semibold hover:underline"
                        style={{ color: "#16a34a" }}
                      >
                        <Phone className="w-3 h-3" /> {proj.clientPhone}
                      </a>
                    </div>
                  </div>

                  {/* Budget & Deadline Row */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    
                    <div className="flex items-center gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] block uppercase font-bold tracking-wider" style={{ color: "#94a3b8" }}>Anggaran</span>
                        <span className="font-extrabold block" style={{ color: "#0f172a" }}>
                          Rp {proj.budget.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] block uppercase font-bold tracking-wider" style={{ color: "#94a3b8" }}>Deadline</span>
                        <span className="font-bold block" style={{ color: "#475569" }}>
                          {new Date(proj.deadline).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Footer Footer: Status Select and update status */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusStyle.text }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: statusStyle.text }}>
                      {proj.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {updatingId === proj.id ? (
                      <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" style={{ color: "#94a3b8" }} />
                        <select
                          value={proj.status}
                          onChange={(e) => handleStatusChange(proj.id, e.target.value)}
                          className="p-2 border rounded-xl font-bold text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          style={{
                            backgroundColor: statusStyle.bg,
                            borderColor: statusStyle.border,
                            color: statusStyle.text
                          }}
                        >
                          {validStatuses.map((st) => (
                            <option key={st} value={st} className="font-semibold bg-white text-slate-800">
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
