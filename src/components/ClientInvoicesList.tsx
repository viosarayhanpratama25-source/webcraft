"use client";

import React, { useState } from "react";
import { FileText, Download, Printer, ExternalLink, X, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: string;
  pdfUrl: string;
  createdAt: string;
  projectTitle: string;
  paymentMethod: string;
}

export default function ClientInvoicesList({ initialInvoices }: { initialInvoices: InvoiceData[] }) {
  const [filter, setFilter] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  const filteredInvoices = initialInvoices.filter((inv) => {
    if (filter === "ALL") return true;
    return inv.status === filter;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Filter Tabs */}
      <div className="flex gap-2 text-sm bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit">
        {[
          { name: "Semua", value: "ALL" },
          { name: "Lunas", value: "PAID" },
          { name: "Belum Lunas", value: "UNPAID" }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filter === tab.value 
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/10" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-12 text-center text-slate-500 text-sm">
          <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          Tidak ada invoice terdaftar untuk kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInvoices.map((inv) => {
            const isPaid = inv.status === "PAID";
            const formattedDueDate = new Date(inv.dueDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric"
            });

            return (
              <div 
                key={inv.id}
                className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide">
                      Invoice #{inv.invoiceNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-normal">{inv.projectTitle}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Jatuh Tempo: {formattedDueDate}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 border rounded-full ${
                    isPaid 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {inv.status}
                  </span>
                </div>

                <div className="flex justify-between items-end border-t border-slate-900/80 pt-4">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Total</span>
                    <p className="text-base font-extrabold text-white">Rp {(inv.amount / 1000000).toFixed(1)}jt</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
                    >
                      Detail
                    </button>
                    {!isPaid && (
                      <button
                        onClick={() => alert(`Lakukan transfer sebesar Rp ${inv.amount.toLocaleString()} ke Bank BCA Rek: 123456789 a.n WebCraft Indonesia. Konfirmasi otomatis akan diverifikasi tim kami.`)}
                        className="px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-xl text-xs shadow shadow-indigo-500/10 transition-all"
                      >
                        Bayar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Print Preview Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoice(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 print:absolute print:inset-0 print:bg-white print:text-black print:p-0 print:border-none print:w-full print:max-w-none print:shadow-none"
            >
              {/* Close and Print Actions */}
              <div className="absolute top-4 right-4 flex items-center gap-2 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-900 flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Print layout container */}
              <div className="space-y-6 pt-6 print:pt-0 print:text-slate-900 text-slate-100 text-left">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-800/80 pb-6 print:border-slate-300">
                  <div>
                    <h3 className="text-lg font-bold tracking-wider uppercase text-white print:text-black">WEBCRAFT</h3>
                    <p className="text-[10px] text-slate-500 print:text-slate-600 mt-1 max-w-xs leading-relaxed">
                      Jasa Pembuatan Website & Aplikasi Web Kustom Premium. SCBD, Jakarta, Indonesia.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">INVOICE RESMI</span>
                    <h4 className="text-sm font-bold text-white print:text-slate-900 mt-1">#{selectedInvoice.invoiceNumber}</h4>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-800/80 pb-6 print:border-slate-300">
                  <div>
                    <span className="text-slate-500 font-bold uppercase tracking-wider block">Ditagihkan Kepada:</span>
                    <h5 className="font-bold text-white print:text-slate-900 mt-1.5 block">Klien WebCraft</h5>
                    <p className="text-[10px] text-slate-400 print:text-slate-500 mt-0.5 leading-normal">
                      Proyek: {selectedInvoice.projectTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <div>
                      <span className="text-slate-500 font-bold uppercase tracking-wider block">Tanggal Terbit:</span>
                      <span className="text-slate-300 print:text-slate-700 mt-1 block">
                        {new Date(selectedInvoice.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-slate-500 font-bold uppercase tracking-wider block">Jatuh Tempo:</span>
                      <span className="text-slate-300 print:text-slate-700 mt-1 block">
                        {new Date(selectedInvoice.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Billing Item Table */}
                <div className="space-y-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Rincian Pembayaran</span>
                  
                  <div className="bg-slate-950/40 border border-slate-850 rounded-2xl overflow-hidden print:border-slate-300">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-900/60 text-slate-400 print:bg-slate-100 print:text-slate-800 border-b border-slate-850 print:border-slate-300 font-bold">
                          <th className="p-3 text-left">Deskripsi Termin Proyek</th>
                          <th className="p-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 text-slate-200 print:text-slate-800 leading-normal">
                            Jasa Pembuatan & Pengembangan Website &ldquo;{selectedInvoice.projectTitle}&rdquo;
                            <span className="text-[10px] text-slate-500 block mt-1">Sesuai paket layanan yang disepakati</span>
                          </td>
                          <td className="p-3 text-right text-white print:text-slate-950 font-bold">
                            Rp {selectedInvoice.amount.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Total / Payment instructions */}
                <div className="flex flex-col sm:flex-row justify-between gap-6 border-t border-slate-800/80 pt-6 print:border-slate-300">
                  <div className="text-xs space-y-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block">Metode Pembayaran:</span>
                    <span className="text-slate-300 print:text-slate-700 block flex items-center gap-1.5 mt-1">
                      <CreditCard className="w-4 h-4 text-slate-500 print:hidden" />
                      {selectedInvoice.paymentMethod}
                    </span>
                    <p className="text-[9px] text-slate-500 print:text-slate-600 mt-1.5 leading-relaxed">
                      Plese transfer to Bank BCA Rek: 123456789 a.n WebCraft. <br />
                      Invoice ini sah diterbitkan secara digital oleh sistem WebCraft.
                    </p>
                  </div>
                  <div className="text-right self-end">
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Tagihan</span>
                    <p className="text-2xl font-extrabold text-white print:text-slate-950 mt-1">
                      Rp {selectedInvoice.amount.toLocaleString("id-ID")}
                    </p>
                    <span className="inline-block text-[9px] font-extrabold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded-full mt-2">
                      {selectedInvoice.status}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
