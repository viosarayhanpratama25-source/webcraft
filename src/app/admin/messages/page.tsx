import React from "react";
import { db } from "@/lib/prisma";
import AdminMessagesList from "@/components/AdminMessagesList";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const submissions = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" }
  });

  const formattedSubmissions = submissions.map((sub: any) => ({
    id: sub.id,
    name: sub.name,
    email: sub.email,
    phone: sub.phone || "",
    message: sub.message,
    serviceType: sub.serviceType,
    status: sub.status,
    createdAt: sub.createdAt.toISOString()
  }));

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: "#0f172a" }}>Manajemen Pesan Masuk</h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: "#64748b" }}>
          Daftar pesan konsultasi dan pertanyaan yang dikirimkan oleh calon pelanggan melalui formulir kontak di beranda.
        </p>
      </div>

      <AdminMessagesList initialMessages={formattedSubmissions} />
    </div>
  );
}
