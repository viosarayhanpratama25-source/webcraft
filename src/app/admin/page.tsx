import React from "react";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { 
  FolderKanban, DollarSign, Receipt, Mail, 
  ArrowRight, ShieldCheck, Clock 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  // Query counts and stats from DB
  const totalProjects = await db.project.count();
  
  const projectsBudgetSum = await db.project.aggregate({
    _sum: { budget: true }
  });
  const grossRevenue = projectsBudgetSum._sum.budget || 0;

  const unpaidInvoices = await db.invoice.count({
    where: { status: "UNPAID" }
  });

  const totalInquiries = await db.contactSubmission.count({
    where: { status: "NEW" }
  });

  const recentProjects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });

  const recentInquiries = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 3
  });

  const stats = [
    { name: "Total Proyek", value: totalProjects.toString(), icon: FolderKanban, color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
    { name: "Total Anggaran", value: `Rp ${(grossRevenue / 1000000).toFixed(1)}jt`, icon: DollarSign, color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
    { name: "Invoice Belum Bayar", value: unpaidInvoices.toString(), icon: Receipt, color: "#eab308", bg: "rgba(234,179,8,0.08)" },
    { name: "Pesan Baru", value: totalInquiries.toString(), icon: Mail, color: "#ec4899", bg: "rgba(236,72,153,0.08)" },
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Welcome & Banner */}
      <div className="rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border shadow-sm" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: "#0f172a" }}>Overview Panel Admin</h1>
          <p className="text-xs sm:text-sm" style={{ color: "#64748b" }}>
            Selamat datang kembali! Kelola seluruh portofolio proyek klien, tagihan invoice, dan pantau pesan masuk dari prospek.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border bg-indigo-50 text-indigo-600 border-indigo-200">
          <ShieldCheck className="w-4 h-4" />
          Status Sistem: Aktif
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="p-5 rounded-2xl border shadow-sm space-y-4" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block" style={{ color: "#94a3b8" }}>{stat.name}</span>
                <span className="text-lg sm:text-xl font-extrabold mt-1 block" style={{ color: "#0f172a" }}>{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Projects & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Projects Table */}
        <div className="lg:col-span-2 rounded-3xl p-5 sm:p-6 border shadow-sm space-y-5" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "#f1f5f9" }}>
            <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: "#475569" }}>Proyek Terbaru</h3>
            <Link href="/admin/projects" className="text-xs font-semibold hover:underline flex items-center gap-1" style={{ color: "#4f46e5" }}>
              Semua Proyek <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr style={{ color: "#94a3b8" }}>
                  <th className="pb-3 font-semibold">Nama Proyek</th>
                  <th className="pb-3 font-semibold">Klien</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Anggaran</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#f1f5f9" }}>
                {recentProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold" style={{ color: "#0f172a" }}>
                      <Link href={`/admin/projects#${proj.id}`} className="hover:underline">
                        {proj.title}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-500">{proj.user.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{
                        backgroundColor: 
                          proj.status === "COMPLETED" ? "#ecfdf5" : 
                          proj.status === "IN_PROGRESS" ? "#eff6ff" : 
                          proj.status === "PENDING" ? "#fffbeb" : "#fef2f2",
                        color: 
                          proj.status === "COMPLETED" ? "#047857" : 
                          proj.status === "IN_PROGRESS" ? "#1d4ed8" : 
                          proj.status === "PENDING" ? "#b45309" : "#b91c1c"
                      }}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-extrabold" style={{ color: "#0f172a" }}>
                      Rp {proj.budget.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="rounded-3xl p-5 sm:p-6 border shadow-sm space-y-5" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "#f1f5f9" }}>
            <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: "#475569" }}>Pesan Hubungi</h3>
            <Link href="/admin/messages" className="text-xs font-semibold hover:underline flex items-center gap-1" style={{ color: "#4f46e5" }}>
              Semua Pesan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentInquiries.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Belum ada pesan masuk.</p>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="p-3 border rounded-xl space-y-2 text-xs" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: "#0f172a" }}>{inq.name}</span>
                    <span className="text-[9px]" style={{ color: "#94a3b8" }}>{inq.serviceType}</span>
                  </div>
                  <p className="text-slate-500 line-clamp-2 leading-relaxed">{inq.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
