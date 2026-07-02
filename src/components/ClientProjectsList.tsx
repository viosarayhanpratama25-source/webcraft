"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, FolderKanban, Calendar, ArrowRight } from "lucide-react";

interface ProjectData {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  budget: number;
  deadline: string;
  createdAt: string;
  packageName: string;
  price: number;
}

export default function ClientProjectsList({ initialProjects }: { initialProjects: ProjectData[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "PENDING": return 15;
      case "IN_PROGRESS": return 50;
      case "REVIEW": return 80;
      case "REVISION": return 90;
      case "COMPLETED": return 100;
      case "CANCELLED": return 0;
      default: return 0;
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "REVIEW":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "REVISION":
        return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20";
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const filteredProjects = initialProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) || 
                          project.packageName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari proyek atau paket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 text-xs flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-300 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">Dalam Pengerjaan</option>
            <option value="REVIEW">Review Client</option>
            <option value="REVISION">Revisi Desain</option>
            <option value="COMPLETED">Selesai</option>
            <option value="CANCELLED">Batal</option>
          </select>
        </div>
      </div>

      {/* Projects List/Table */}
      {filteredProjects.length === 0 ? (
        <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-12 text-center text-slate-500 text-sm">
          <FolderKanban className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          Tidak ada proyek ditemukan dengan kriteria tersebut.
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-900/80 bg-slate-900/50 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4 sm:p-5">Nama Proyek</th>
                  <th className="p-4 sm:p-5 hidden md:table-cell">Paket</th>
                  <th className="p-4 sm:p-5">Progress</th>
                  <th className="p-4 sm:p-5 hidden sm:table-cell">Deadline</th>
                  <th className="p-4 sm:p-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-xs sm:text-sm">
                {filteredProjects.map((project) => {
                  const progress = getProgressPercentage(project.status);
                  const statusStyle = getStatusBadgeStyles(project.status);
                  const formattedDeadline = new Date(project.deadline).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  });

                  return (
                    <tr 
                      key={project.id} 
                      className="hover:bg-slate-900/20 transition-colors group"
                    >
                      <td className="p-4 sm:p-5">
                        <div className="font-bold text-white leading-normal">{project.title}</div>
                        <div className="text-[10px] text-slate-500 mt-1 md:hidden">
                          Paket: {project.packageName}
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 font-semibold text-slate-300 hidden md:table-cell">
                        {project.packageName}
                      </td>
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 border rounded-full shrink-0 ${statusStyle}`}>
                            {project.status.replace("_", " ")}
                          </span>
                          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-[120px]">
                            <div className="h-1.5 bg-slate-950 rounded-full flex-1 overflow-hidden border border-slate-800">
                              <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">{progress}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-400 font-medium hidden sm:table-cell">
                        <span className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {formattedDeadline}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-right">
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all group-hover:border-slate-700"
                        >
                          Kelola
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
