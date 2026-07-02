"use client";

import React, { useState } from "react";
import { 
  Receipt, Search, RefreshCw, CheckCircle, 
  AlertCircle, User, Mail, DollarSign, Calendar, ShieldCheck 
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
  createdAt: string;
  projectName: string;
  clientName: string;
  clientEmail: string;
}

interface AdminInvoicesListProps {
  initialInvoices: Invoice[];
}

const validStatuses = ["UNPAID", "PARTIAL", "PAID", "REFUNDED"];

export default function AdminInvoicesList({ initialInvoices }: AdminInvoicesListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState("");
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showNotification = (text: string, type: "success" | "error") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    setUpdatingId(invoiceId);
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
        );
        showNotification("Status tagihan berhasil diperbarui!", "success");
      } else {
        const errData = await res.json();
        showNotification(errData.error || "Gagal memperbarui status tagihan.", "error");
      }
    } catch (err) {
      showNotification("Kesalahan menyambung ke server.", "error");
    } finally {
      setUpdatingId("");
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.projectName.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PAID":
        return { bg: "#ecfdf5", border: "#a7f3d0", text: "#047857" };
      case "PARTIAL":
        return { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" };
      case "UNPAID":
        return { bg: "#fffbeb", border: "#fde68a", text: "#b45309" };
      default:
        return { bg: "#fef2f2", border: "#fca5a5", text: "#b91c1c" };
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
            placeholder="Cari invoice, proyek, atau klien..."
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

      {/* Invoices List Cards (Redesigned from plain table to premium card format) */}
      {filteredInvoices.length === 0 ? (
        <div className="p-12 text-center text-xs space-y-2 border border-dashed rounded-3xl bg-white" style={{ borderColor: "#cbd5e1" }}>
          <Receipt className="w-8 h-8 mx-auto" style={{ color: "#94a3b8" }} />
          <p style={{ color: "#64748b" }}>Tidak ada invoice yang cocok dengan filter pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInvoices.map((inv) => {
            const statusStyle = getStatusBadgeColor(inv.status);
            return (
              <div 
                key={inv.id} 
                className="rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
              >
                
                {/* Header: Invoice number & dates */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Receipt className="w-4 h-4" style={{ color: "#6366f1" }} />
                        <span className="font-mono font-bold text-sm tracking-wider" style={{ color: "#0f172a" }}>
                          {inv.invoiceNumber}
                        </span>
                      </div>
                      <span className="text-[10px] block" style={{ color: "#94a3b8" }}>
                        Dibuat pada: {new Date(inv.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Status indicator */}
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-lg border"
                        style={{ backgroundColor: statusStyle.bg, borderColor: statusStyle.border, color: statusStyle.text }}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Details: Project title, Client & Due Date */}
                <div className="my-5 border-t border-b py-4 space-y-3" style={{ borderColor: "#f1f5f9" }}>
                  
                  {/* Project Info */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: "#94a3b8" }}>Proyek</span>
                    <span className="font-extrabold text-xs block" style={{ color: "#334155" }}>
                      {inv.projectName}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: "#94a3b8" }}>Klien</span>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
                      <User className="w-3.5 h-3.5" style={{ color: "#94a3b8" }} />
                      <span className="font-bold">{inv.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] pl-5.5" style={{ color: "#64748b" }}>
                      <Mail className="w-3 h-3" />
                      <span>{inv.clientEmail}</span>
                    </div>
                  </div>

                  {/* Amount and Due Date Details */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    
                    <div className="flex items-center gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] block uppercase font-bold tracking-wider" style={{ color: "#94a3b8" }}>Nominal Tagihan</span>
                        <span className="font-extrabold block" style={{ color: "#0f172a" }}>
                          Rp {inv.amount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] block uppercase font-bold tracking-wider" style={{ color: "#94a3b8" }}>Jatuh Tempo</span>
                        <span className="font-bold block" style={{ color: "#475569" }}>
                          {new Date(inv.dueDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Footer Controls: Change Payment Status */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" style={{ color: "#94a3b8" }} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Ubah Status Tagihan:
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {updatingId === inv.id ? (
                      <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                    ) : (
                      <select
                        value={inv.status}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value)}
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
