"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, CheckCircle2, ArrowRight, LayoutDashboard, 
  Receipt, MessageSquare, ShieldCheck, Home 
} from "lucide-react";

export default function OrderSuccessPage() {
  const [projectId, setProjectId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [waLink, setWaLink] = useState("");

  useEffect(() => {
    const lastProjectId = localStorage.getItem("webcraft_last_success_project_id") || "";
    const lastInvoice = localStorage.getItem("webcraft_payment_invoice") || "INV-2026-0001";
    const detailsStr = localStorage.getItem("webcraft_last_order_details");
    const pkgStr = localStorage.getItem("webcraft_last_order_package");

    setProjectId(lastProjectId);
    setInvoiceNumber(lastInvoice);

    let parsedDetails = null;
    let parsedPackage = null;

    if (detailsStr) {
      parsedDetails = JSON.parse(detailsStr);
      setOrderDetails(parsedDetails);
    }
    if (pkgStr) {
      parsedPackage = JSON.parse(pkgStr);
      setSelectedPackage(parsedPackage);
    }

    // Generate WhatsApp link with full order details
    if (parsedDetails) {
      const waNumber = "6289501113573";
      
      const formattedBudget = parsedDetails.budget.toLocaleString("id-ID");
      const featuresText = parsedDetails.features && parsedDetails.features.length > 0 
        ? parsedDetails.features.join(", ") 
        : "-";
      
      const message = `Halo WebCraft! 🚀
Saya ingin mengonfirmasi pesanan website saya yang baru saja dibuat. Berikut rincian data lengkap website saya:

📄 NO. INVOICE: ${lastInvoice}
🏢 NAMA PROYEK: ${parsedDetails.projectName}
📦 PAKET LAYANAN: ${parsedPackage ? parsedPackage.name : "-"}
🌐 TIPE WEBSITE: ${parsedDetails.websiteType}
📝 DESKRIPSI: ${parsedDetails.description}
🛠️ FITUR KHUSUS: ${featuresText}
📅 TARGET LAUNCHING: ${new Date(parsedDetails.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
💰 ANGGARAN KONTRAK (DP 50%): Rp ${formattedBudget}

Mohon segera diproses lebih lanjut. Terima kasih!`;

      const encodedMessage = encodeURIComponent(message);
      setWaLink(`https://wa.me/${waNumber}?text=${encodedMessage}`);
    } else {
      setWaLink(`https://wa.me/6289501113573?text=${encodeURIComponent("Halo WebCraft! Saya ingin melakukan konfirmasi pesanan website.")}`);
    }
  }, []);

  const formattedBudget = orderDetails ? orderDetails.budget.toLocaleString("id-ID") : "0";
  const formattedDeadline = orderDetails ? new Date(orderDetails.deadline).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "-";

  return (
    <div className="min-h-screen flex items-center justify-center font-sans py-12 px-6 relative select-none" style={{ backgroundColor: "#f8fafc" }}>
      {/* Glow decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(99,102,241,0.05)" }}></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(139,92,246,0.05)" }}></div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        
        {/* Main Card */}
        <div className="rounded-3xl p-6 sm:p-8 shadow-2xl border flex flex-col items-center" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
          
          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight mb-4" style={{ color: "#0f172a" }}>
            <span className="p-2 rounded-xl" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Activity className="w-5 h-5 text-white" />
            </span>
            WebCraft
          </div>

          {/* Success Check circle */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#16a34a" }}>
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: "#0f172a" }}>Pemesanan Sukses!</h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#64748b" }}>
              Pesanan website Anda telah terdaftar dan **sudah masuk ke data profil pengguna (Dashboard)** Anda.
            </p>
          </div>

          {/* INVOICE SLIP (Modal Invoice) */}
          <div className="w-full border rounded-2xl p-5 sm:p-6 mb-6 text-left space-y-4 shadow-sm" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "#cbd5e1" }}>
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4" style={{ color: "#6366f1" }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#475569" }}>Rincian Invoice</span>
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: "#0f172a" }}>{invoiceNumber}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">Nama Proyek / Bisnis</span>
                <span className="font-extrabold mt-1 block" style={{ color: "#0f172a" }}>
                  {orderDetails ? orderDetails.projectName : "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Paket Layanan</span>
                <span className="font-extrabold mt-1 block" style={{ color: "#0f172a" }}>
                  {selectedPackage ? `${selectedPackage.name} Package` : "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Tipe Website</span>
                <span className="font-bold mt-1 block" style={{ color: "#475569" }}>
                  {orderDetails ? orderDetails.websiteType : "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Target Launching</span>
                <span className="font-bold mt-1 block" style={{ color: "#475569" }}>
                  {formattedDeadline}
                </span>
              </div>
            </div>

            {orderDetails?.features && orderDetails.features.length > 0 && (
              <div className="border-t pt-3 text-xs" style={{ borderColor: "#e2e8f0" }}>
                <span className="text-slate-500 font-semibold block mb-1.5">Fitur Khusus yang Disertakan</span>
                <div className="flex flex-wrap gap-1.5">
                  {orderDetails.features.map((feat: string) => (
                    <span 
                      key={feat} 
                      className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                      style={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#475569" }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-3 flex items-center justify-between" style={{ borderColor: "#cbd5e1" }}>
              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider">Total Nilai Kontrak</span>
                <span className="font-extrabold text-lg mt-0.5 block" style={{ color: "#0f172a" }}>
                  Rp {formattedBudget}
                </span>
              </div>
              <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border" style={{ backgroundColor: "#ecfdf5", borderColor: "#a7f3d0", color: "#047857" }}>
                LUNAS (PAID)
              </div>
            </div>
          </div>

          {/* Secure & Auto-save warning */}
          <div className="w-full rounded-2xl p-4 flex gap-3 items-start text-xs text-left mb-6" style={{ backgroundColor: "rgba(99,102,241,0.03)", border: "1px solid rgba(99,102,241,0.08)" }}>
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#6366f1" }} />
            <div>
              <h4 className="font-bold" style={{ color: "#0f172a" }}>Otomatis Tersinkronisasi</h4>
              <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: "#64748b" }}>
                Rincian transaksi, invoice, dan pelacakan milestone pengerjaan website Anda telah tersimpan secara aman di dalam halaman proyek di dashboard profil Anda.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full space-y-3">
            {/* Primary WA Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:opacity-95 shadow-md"
              style={{ 
                background: "linear-gradient(135deg, #22c55e, #16a34a)", 
                color: "#ffffff", 
                boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
                textDecoration: "none"
              }}
            >
              <MessageSquare className="w-4 h-4" />
              Hubungi ke WhatsApp (Konfirmasi Pesanan)
            </a>

            {/* Dashboard Link */}
            <Link
              href={projectId ? `/dashboard/projects/${projectId}` : "/dashboard/projects"}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:bg-indigo-50 border"
              style={{ 
                borderColor: "#6366f1", 
                color: "#4f46e5", 
                backgroundColor: "transparent",
                textDecoration: "none"
              }}
            >
              <LayoutDashboard className="w-4 h-4" />
              Kelola Proyek di Dashboard
            </Link>
            
            {/* Return Home */}
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:bg-slate-100 border"
              style={{ 
                borderColor: "#e2e8f0", 
                color: "#64748b", 
                backgroundColor: "transparent",
                textDecoration: "none"
              }}
            >
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
