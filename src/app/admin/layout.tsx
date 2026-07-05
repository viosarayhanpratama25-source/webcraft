import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/AdminLayoutClient";

// Simple admin sidebar skeleton fallback
function AdminLayoutSkeleton() {
  return (
    <div className="flex h-full min-h-screen bg-slate-50 animate-pulse">
      <div className="hidden md:block w-[240px] bg-white border-r border-slate-200"></div>
      <div className="flex-1 flex flex-col">
        <header className="h-[65px] bg-white/80 border-b border-slate-200"></header>
        <main className="p-8 flex-1"></main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminLayoutSkeleton />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}

async function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const user = session.user as any;
  if (user.role !== "ADMIN" && user.role !== "STAFF") {
    redirect("/dashboard");
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
