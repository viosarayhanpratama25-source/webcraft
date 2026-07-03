import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { 
  FolderKanban, DollarSign, FileText, ArrowUpRight, 
  MessageSquare, Calendar, ChevronRight, Activity, ShoppingCart
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  // 1. Fetch Stats
  const activeProjectsCount = await db.project.count({
    where: {
      userId: user.id,
      status: {
        in: ["PENDING", "IN_PROGRESS", "REVIEW", "REVISION"]
      }
    }
  });

  const paidOrders = await db.projectOrder.findMany({
    where: {
      project: { userId: user.id },
      paymentStatus: "PAID"
    },
    select: { totalPrice: true }
  });
  const totalSpent = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  const pendingInvoicesCount = await db.invoice.count({
    where: {
      order: { project: { userId: user.id } },
      status: "UNPAID"
    }
  });

  // 2. Fetch Projects
  const recentProjects = await db.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      orders: {
        include: {
          package: {
            select: { name: true }
          }
        }
      }
    }
  });

  // 3. Fetch Recent Messages
  const recentMessages = await db.projectMessage.findMany({
    where: {
      project: { userId: user.id }
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      sender: {
        select: { name: true, role: true }
      },
      project: {
        select: { title: true }
      }
    }
  });

  // 4. Construct a dynamic activity timeline
  const activities = [];

  // Add Project creations to activity
  const userProjects = await db.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3
  });
  for (const p of userProjects) {
    activities.push({
      type: "PROJECT_CREATE",
      title: `Proyek '${p.title}' dibuat`,
      desc: "Menunggu pembayaran awal atau kelengkapan berkas brief proyek.",
      time: p.createdAt,
    });
  }

  // Add Invoices to activity
  const userInvoices = await db.invoice.findMany({
    where: { order: { project: { userId: user.id } } },
    orderBy: { createdAt: "desc" },
    take: 3
  });
  for (const inv of userInvoices) {
    activities.push({
      type: "INVOICE",
      title: `Invoice #${inv.invoiceNumber} diterbitkan`,
      desc: `Tagihan sebesar Rp ${(inv.amount / 1000000).toFixed(1)}jt dengan status: ${inv.status}.`,
      time: inv.createdAt,
    });
  }

  // Sort activities by time desc
  activities.sort((a, b) => b.time.getTime() - a.time.getTime());
  const finalActivities = activities.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Selamat Datang Kembali, {user.name}!</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg leading-relaxed">
            Kelola proyek Anda, hubungi tim developer, unggah panduan brand, atau lakukan pembayaran tagihan secara aman di satu dashboard terpusat.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/order"
            className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-md shadow-indigo-500/10 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Pesan Website Baru
          </Link>
          <Link
            href="/dashboard/invoices"
            className="px-5 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold rounded-2xl text-xs sm:text-sm transition-all"
          >
            Lihat Tagihan
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Proyek Aktif</h4>
            <p className="text-2xl font-extrabold text-white mt-0.5">{activeProjectsCount}</p>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pengeluaran</h4>
            <p className="text-2xl font-extrabold text-white mt-0.5">
              Rp {(totalSpent / 1000000).toFixed(1)}jt
            </p>
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-rose-500/10 text-rose-400 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice Belum Lunas</h4>
            <p className="text-2xl font-extrabold text-white mt-0.5">{pendingInvoicesCount}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Recent Projects & Chats */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recent Projects Card */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-indigo-400" />
                Proyek Terbaru Anda
              </h3>
              <Link href="/dashboard/projects" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Semua Proyek
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Belum ada proyek yang terdaftar. <br />
                <Link href="/order" className="text-indigo-400 font-semibold hover:underline mt-2 inline-block">Mulai pesan sekarang</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => {
                  const statusColors: Record<string, string> = {
                    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    REVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                    REVISION: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
                    COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
                  };
                  const packName = project.orders[0]?.package.name || "Custom";

                  return (
                    <div 
                      key={project.id}
                      className="bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                    >
                      <div>
                        <h4 className="font-bold text-white text-sm">{project.title}</h4>
                        <div className="flex gap-2 items-center mt-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                            {packName} Package
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Deadline: {project.deadline.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 border rounded-full ${statusColors[project.status]}`}>
                          {project.status.replace("_", " ")}
                        </span>
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Messages Card */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                Pesan & Obrolan Terbaru
              </h3>
            </div>

            {recentMessages.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Belum ada obrolan terbaru.
              </div>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((msg) => {
                  const isAdmin = msg.sender.role === "ADMIN" || msg.sender.role === "STAFF";
                  return (
                    <div key={msg.id} className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{msg.sender.name}</span>
                          {isAdmin && (
                            <span className="text-[9px] font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                              Tim cleavCraft
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {msg.createdAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>
                      <div className="text-[10px] text-slate-500 text-right">
                        Proyek: <span className="text-slate-400 italic font-medium">{msg.project.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Activity Timeline */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-900 pb-4">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                Aktivitas Terbaru
              </h3>
            </div>

            {finalActivities.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Belum ada aktivitas terekam.
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 border-l border-slate-900">
                {finalActivities.map((act, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle timeline */}
                    <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-950"></span>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-xs font-bold text-white">{act.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{act.desc}</p>
                      <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono pt-1">
                        <Calendar className="w-3 h-3" />
                        {act.time.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
