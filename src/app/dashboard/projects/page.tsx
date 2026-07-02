import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import ClientProjectsList from "@/components/ClientProjectsList";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  // Fetch all projects for the logged-in client
  const projects = await db.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        include: {
          package: true
        }
      }
    }
  });

  // Map database projects to UI-ready structure
  const projectsData = projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    type: project.type,
    status: project.status,
    budget: project.budget,
    deadline: project.deadline.toISOString(),
    createdAt: project.createdAt.toISOString(),
    packageName: project.orders[0]?.package.name || "Custom",
    price: project.orders[0]?.totalPrice || project.budget,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">Proyek Saya</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Daftar website yang sedang dikerjakan maupun proyek yang telah selesai dikembangkan.
        </p>
      </div>

      <ClientProjectsList initialProjects={projectsData} />
    </div>
  );
}
