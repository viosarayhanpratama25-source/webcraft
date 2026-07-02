"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Activity, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, 
  HelpCircle, Receipt, AlertCircle 
} from "lucide-react";

export default function OrderReviewPage() {
  const router = useRouter();

  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const pkgStr = localStorage.getItem("webcraft_order_package");
    const detailsStr = localStorage.getItem("webcraft_order_details");

    if (!pkgStr || !detailsStr) {
      router.push("/order");
      return;
    }

    setSelectedPackage(JSON.parse(pkgStr));
    setOrderDetails(JSON.parse(detailsStr));
  }, [router]);

  const handleCheckoutSubmit = async () => {
    setError("");
    
    if (!agreeTerms) {
      setError("Anda harus menyetujui Syarat & Ketentuan pengerjaan WebCraft.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: orderDetails.packageId,
          projectName: orderDetails.projectName,
          websiteType: orderDetails.websiteType,
          description: orderDetails.description,
          features: orderDetails.features,
          budget: orderDetails.budget,
          deadline: orderDetails.deadline,
          referenceUrls: orderDetails.referenceUrls
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Stash the full order details and package info for the success/whatsapp page before clearing
        localStorage.setItem("webcraft_last_order_details", JSON.stringify(orderDetails));
        localStorage.setItem("webcraft_last_order_package", JSON.stringify(selectedPackage));
        
        // Clear local details drafts
        localStorage.removeItem("webcraft_order_details");
        
        // Save checkout order info
        localStorage.setItem("webcraft_last_success_project_id", data.projectId);
        localStorage.setItem("webcraft_payment_order_id", data.orderId);
        localStorage.setItem("webcraft_payment_amount", orderDetails.budget.toString());
        localStorage.setItem("webcraft_payment_invoice", data.invoiceNumber);

        // Auto-trigger payment webhook to mark it as PAID in the user profile database
        try {
          await fetch("/api/webhooks/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              paymentMethod: "Bank Transfer",
              status: "PAID"
            })
          });
        } catch (e) {
          console.error("Auto-payment webhook error:", e);
        }

        // Redirect directly to success page
        router.push("/order/success");
      } else {
        setError(data.error || "Gagal memproses pemesanan Anda.");
        setLoading(false);
      }
    } catch (err) {
      setError("Gagal menyambungkan ke server.");
      setLoading(false);
    }
  };

  if (!selectedPackage || !orderDetails) return null;

  const formattedPrice = orderDetails.budget.toLocaleString("id-ID");
  const formattedDeadline = new Date(orderDetails.deadline).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans py-12 px-6 relative select-none">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto w-full space-y-8 relative z-10 text-left">
        
        {/* Logo and Back */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <span className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl">
              <Activity className="w-5 h-5 text-white" />
            </span>
            WebCraft
          </Link>
          <Link href="/order/details" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Pengisian Brief
          </Link>
        </div>

        {/* Stepper progress */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-900 rounded-3xl p-5 max-w-2xl mx-auto text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[10px]">1</span>
            <span>Paket</span>
          </div>
          <div className="w-8 border-t border-slate-850"></div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[10px]">2</span>
            <span>Brief Proyek</span>
          </div>
          <div className="w-8 border-t border-slate-800"></div>
          <div className="flex items-center gap-2 text-indigo-400">
            <span className="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px]">3</span>
            <span>Konfirmasi</span>
          </div>
          <div className="w-8 border-t border-slate-800"></div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[10px]">4</span>
            <span>Pembayaran</span>
          </div>
        </div>

        {/* Review details */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-extrabold text-white">Review & Konfirmasi Pesanan</h2>
            <p className="text-xs text-slate-400 mt-1">
              Periksa kembali rincian kesepakatan pengerjaan website Anda sebelum melanjutkan ke proses gerbang pembayaran.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 w-4 h-4" />
              {error}
            </div>
          )}

          {/* Details Summary Card */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl">
                <span className="text-slate-500 font-bold block">Nama Proyek / Bisnis</span>
                <span className="text-white font-extrabold mt-1 block">{orderDetails.projectName}</span>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl">
                <span className="text-slate-500 font-bold block">Tipe Website / Paket</span>
                <span className="text-white font-extrabold mt-1 block">
                  {orderDetails.websiteType} ({selectedPackage.name} Package)
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl text-xs space-y-2">
              <span className="text-slate-500 font-bold block">Detail Deskripsi Ringkasan</span>
              <p className="text-slate-350 leading-relaxed text-slate-300">{orderDetails.description}</p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl text-xs">
              <span className="text-slate-500 font-bold block mb-2">Fitur Khusus yang Disertakan</span>
              {orderDetails.features.length === 0 ? (
                <span className="text-slate-500">Tidak ada fitur tambahan dipilih</span>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {orderDetails.features.map((f: string) => (
                    <span key={f} className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-[10px]">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Summary Panel */}
            <div className="p-5 bg-gradient-to-r from-slate-950 to-indigo-950/15 border border-indigo-950/30 rounded-2xl flex justify-between items-center">
              <div className="text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wide">Target Launching</span>
                <p className="text-slate-200 font-bold mt-0.5">{formattedDeadline}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Total Harga Kontrak</span>
                <p className="text-lg sm:text-xl font-extrabold text-white mt-0.5">Rp {formattedPrice}</p>
              </div>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-indigo-500 bg-slate-950 border-slate-800 focus:ring-indigo-500 accent-indigo-500"
            />
            <label htmlFor="agreeTerms" className="text-xs text-slate-400 leading-relaxed text-left">
              Saya menyatakan bahwa rincian brief proyek di atas sudah benar, serta menyetujui seluruh{" "}
              <Link href="#" className="text-indigo-400 hover:underline">
                Syarat Pembayaran Kontrak
              </Link>{" "}
              yang menetapkan DP 50% di awal dan 50% pelunasan saat uji coba selesai.
            </label>
          </div>

          {/* Stepper buttons */}
          <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-8">
            <Link
              href="/order/details"
              className="px-5 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all"
            >
              Kembali
            </Link>

            <button
              onClick={handleCheckoutSubmit}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow shadow-indigo-500/10 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Konfirmasi Pesanan
                  <ArrowRight className="w-4 w-4" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
