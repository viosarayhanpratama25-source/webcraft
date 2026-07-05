import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCachedProjects } from "@/lib/cached-data";
import ClientProjectsList from "@/components/ClientProjectsList";

function ProjectsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-900/30 rounded-xl"></div>
      <div className="h-4 w-96 bg-slate-900/20 rounded-lg mt-2"></div>
      <div className="h-64 w-full bg-slate-900/20 rounded-3xl mt-6"></div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsContent />
    </Suspense>
  );
}

async function ProjectsContent() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  // Fetch all projects using the high-performance server cache helper
  const projectsData = await getCachedProjects(user.id);

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
