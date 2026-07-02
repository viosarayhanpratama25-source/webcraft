import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import ClientInvoicesList from "@/components/ClientInvoicesList";

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  // Fetch all invoices for projects that belong to the logged-in client
  const invoices = await db.invoice.findMany({
    where: {
      order: {
        project: {
          userId: user.id
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      order: {
        include: {
          project: {
            select: { title: true }
          }
        }
      }
    }
  });

  const invoicesData = invoices.map(inv => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    amount: inv.amount,
    dueDate: inv.dueDate.toISOString(),
    status: inv.status,
    pdfUrl: inv.pdfUrl || "",
    createdAt: inv.createdAt.toISOString(),
    projectTitle: inv.order.project.title,
    paymentMethod: inv.order.paymentMethod || "Bank Transfer",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">Invoice Tagihan</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Daftar invoice resmi dan status penagihan termin proyek Anda.
        </p>
      </div>

      <ClientInvoicesList initialInvoices={invoicesData} />
    </div>
  );
}
