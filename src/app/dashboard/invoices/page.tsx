import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCachedInvoices } from "@/lib/cached-data";
import ClientInvoicesList from "@/components/ClientInvoicesList";

function InvoicesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-900/30 rounded-xl"></div>
      <div className="h-4 w-96 bg-slate-900/20 rounded-lg mt-2"></div>
      <div className="h-64 w-full bg-slate-900/20 rounded-3xl mt-6"></div>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<InvoicesSkeleton />}>
      <InvoicesContent />
    </Suspense>
  );
}

async function InvoicesContent() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  // Fetch all invoices using the high-performance server cache helper
  const invoicesData = await getCachedInvoices(user.id);

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
