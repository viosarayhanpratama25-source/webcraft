import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCachedOrders } from "@/lib/cached-data";
import { Calendar, ShoppingBag, ExternalLink } from "lucide-react";
import Link from "next/link";

function OrdersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-900/30 rounded-xl"></div>
      <div className="h-4 w-96 bg-slate-900/20 rounded-lg mt-2"></div>
      <div className="h-64 w-full bg-slate-900/20 rounded-3xl mt-6"></div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersContent />
    </Suspense>
  );
}

async function OrdersContent() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  // Fetch all orders using the high-performance server cache helper
  const orders = await getCachedOrders(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">Riwayat Pesanan</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Daftar riwayat pemesanan website dan status kelayakan pembayaran Anda.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-12 text-center text-slate-500 text-sm">
          <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          Belum ada riwayat pesanan terdaftar.
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-900/80 bg-slate-900/50 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4 sm:p-5">Order ID</th>
                  <th className="p-4 sm:p-5">Proyek / Layanan</th>
                  <th className="p-4 sm:p-5">Paket</th>
                  <th className="p-4 sm:p-5">Total Harga</th>
                  <th className="p-4 sm:p-5">Status Bayar</th>
                  <th className="p-4 sm:p-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-xs sm:text-sm">
                {orders.map((order) => {
                  const isPaid = order.paymentStatus === "PAID";
                  const formattedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  });

                  return (
                    <tr key={order.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="p-4 sm:p-5 font-mono text-[10px] text-slate-500">
                        {order.id}
                        <span className="flex items-center gap-1 mt-1 text-[9px]">
                          <Calendar className="w-3 h-3 text-slate-600" />
                          {formattedDate}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5">
                        <div className="font-bold text-white leading-normal">{order.project.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Metode: {order.paymentMethod || "Belum dipilih"}</div>
                      </td>
                      <td className="p-4 sm:p-5 font-semibold text-slate-300">
                        {order.package.name}
                      </td>
                      <td className="p-4 sm:p-5 font-bold text-white">
                        Rp {(order.totalPrice / 1000000).toFixed(1)}jt
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 border rounded-full ${
                          isPaid 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex gap-2 justify-end">
                          <Link
                            href={`/dashboard/projects/${order.projectId}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
                          >
                            Kelola Proyek
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
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
