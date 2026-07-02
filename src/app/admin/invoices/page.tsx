import React from "react";
import { db } from "@/lib/prisma";
import AdminInvoicesList from "@/components/AdminInvoicesList";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const invoices = await db.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: {
          project: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            }
          }
        }
      }
    }
  });

  const formattedInvoices = invoices.map(inv => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    amount: inv.amount,
    status: inv.status,
    dueDate: inv.dueDate.toISOString(),
    createdAt: inv.createdAt.toISOString(),
    projectName: inv.order.project.title,
    clientName: inv.order.project.user.name,
    clientEmail: inv.order.project.user.email
  }));

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: "#0f172a" }}>Manajemen Tagihan & Invoice</h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: "#64748b" }}>
          Kelola transaksi masuk klien. Anda dapat menandai invoice sebagai lunas secara manual atau mencatat pengembalian dana.
        </p>
      </div>

      <AdminInvoicesList initialInvoices={formattedInvoices} />
    </div>
  );
}
