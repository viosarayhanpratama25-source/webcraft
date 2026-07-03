"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Activity, CreditCard, ShieldCheck, CheckCircle2, ChevronRight, 
  HelpCircle, Receipt, ArrowRight, AlertCircle, Copy, Check 
} from "lucide-react";

function OrderPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stashedOrderId = localStorage.getItem("webcraft_payment_order_id") || searchParams.get("orderId") || "";
    const stashedAmount = localStorage.getItem("webcraft_payment_amount") || "";
    const stashedInvoice = localStorage.getItem("webcraft_payment_invoice") || "";

    if (!stashedOrderId) {
      router.push("/order");
      return;
    }

    setOrderId(stashedOrderId);
    setAmount(stashedAmount || "5000000");
    setInvoiceNumber(stashedInvoice || "INV-2026-002");
  }, [router, searchParams]);

  const handleCopyVa = () => {
    navigator.clipboard.writeText("123456789012");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError("");

    try {
      // Simulate webhook payment callback trigger
      const res = await fetch("/api/webhooks/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentMethod,
          status: "PAID"
        })
      });

      if (res.ok) {
        // Clear payment storage
        localStorage.removeItem("webcraft_payment_order_id");
        localStorage.removeItem("webcraft_payment_amount");
        localStorage.removeItem("webcraft_payment_invoice");
        
        // Save order ID for success page redirection
        localStorage.setItem("webcraft_last_success_project_id", orderId);

        router.push("/order/success");
      } else {
        setError("Gagal memproses konfirmasi transaksi.");
        setLoading(false);
      }
    } catch (err) {
      setError("Gagal menyambungkan ke server.");
      setLoading(false);
    }
  };

  if (!orderId) return null;

  const formattedAmount = parseInt(amount).toLocaleString("id-ID");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans py-12 px-6 relative select-none">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl mx-auto w-full space-y-8 relative z-10 text-left">
        
        {/* Logo and Back */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <span className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl">
              <Activity className="w-5 h-5 text-white" />
            </span>
            WebCraft
          </Link>
          <span className="text-xs text-slate-500 font-semibold">Proses Checkout Pembayaran</span>
        </div>

        {/* Stepper progress */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-900 rounded-3xl p-5 text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[10px]">1</span>
            <span>Paket</span>
          </div>
          <div className="w-6 border-t border-slate-850"></div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[10px]">2</span>
            <span>Brief Proyek</span>
          </div>
          <div className="w-6 border-t border-slate-850"></div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[10px]">3</span>
            <span>Konfirmasi</span>
          </div>
          <div className="w-6 border-t border-slate-800"></div>
          <div className="flex items-center gap-2 text-indigo-400">
            <span className="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px]">4</span>
            <span>Pembayaran</span>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-5">
            <h2 className="text-xl font-extrabold text-white">Metode Pembayaran</h2>
            <p className="text-xs text-slate-400 mt-1">
              Pilih kanal pembayaran pilihan Anda di bawah untuk melunasi tagihan invoice proyek #{invoiceNumber}.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-2xl">
              {error}
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Bank Transfer", value: "Bank Transfer" },
              { name: "Credit Card", value: "Credit Card" },
              { name: "E-Wallet", value: "E-Wallet" }
            ].map((method) => {
              const isSelected = paymentMethod === method.value;
              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`p-3 border rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 ring-1 ring-indigo-500/20"
                      : "bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-400"
                  }`}
                >
                  <CreditCard className={`w-5 h-5 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                  {method.name}
                </button>
              );
            })}
          </div>

          {/* Payment Method Details */}
          {paymentMethod === "Bank Transfer" ? (
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 space-y-4 text-xs text-left">
              <div>
                <span className="text-slate-500 font-bold block">Nominal Pembayaran</span>
                <span className="text-white font-extrabold text-base mt-1 block">Rp {formattedAmount}</span>
              </div>
              <div className="border-t border-slate-900 pt-3">
                <span className="text-slate-500 font-bold block">Bank Tujuan</span>
                <span className="text-slate-300 font-bold mt-1.5 block">Bank Central Asia (BCA) Virtual Account</span>
              </div>
              <div className="border-t border-slate-900 pt-3">
                <span className="text-slate-500 font-bold block">Nomor Virtual Account</span>
                <div className="flex gap-2 items-center mt-1.5">
                  <span className="text-white font-mono font-bold text-sm tracking-wider">123456789012</span>
                  <button
                    onClick={handleCopyVa}
                    className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[9px] font-semibold">{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 text-center text-xs text-slate-500 leading-relaxed">
              Kanal pembayaran otomatis Credit Card / E-Wallet via gateway Midtrans aktif. Anda akan diarahkan ke pop-up pembayaran otomatis.
            </div>
          )}

          {/* Payment Guide */}
          <div className="bg-indigo-500/5 border border-indigo-950/30 rounded-2xl p-4 flex gap-3 items-start text-xs text-left">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-indigo-300">Transaksi Dijamin Aman</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Seluruh aktivitas transaksi pembayaran dan enkripsi data di WebCraft dilindungi sistem enkripsi SSL tingkat tinggi serta gateway bersertifikasi PCI-DSS.
              </p>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleConfirmPayment}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Konfirmasi Simulasi Pembayaran
                <ArrowRight className="w-4.5 h-4.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default function OrderPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <span className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    }>
      <OrderPaymentContent />
    </Suspense>
  );
}
