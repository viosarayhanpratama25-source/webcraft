import React from "react";
import { db } from "@/lib/prisma";
import AdminProjectsList from "@/components/AdminProjectsList";


export default async function AdminProjectsPage() {
  // Query all projects with user details and orders
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true, phone: true }
      },
      orders: {
        include: { package: true }
      }
    }
  });

  // Format projects data for the client component
  const formattedProjects = projects.map((proj: any) => ({
    id: proj.id,
    title: proj.title,
    description: proj.description,
    type: proj.type,
    status: proj.status,
    budget: proj.budget,
    deadline: proj.deadline.toISOString(),
    createdAt: proj.createdAt.toISOString(),
    clientName: proj.user.name,
    clientEmail: proj.user.email,
    clientPhone: proj.user.phone || "",
    packageName: proj.orders[0]?.package.name || "Custom"
  }));

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: "#0f172a" }}>Manajemen Proyek Klien</h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: "#64748b" }}>
          Daftar seluruh proyek pembuatan website aktif. Anda dapat memantau detail brief serta memperbarui status kemajuan proyek di sini.
        </p>
      </div>

      <AdminProjectsList initialProjects={formattedProjects} />
    </div>
  );
}
