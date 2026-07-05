import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "@/components/DashboardLayoutClient";

// Simple sidebar skeleton fallback
function DashboardLayoutSkeleton() {
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLayoutSkeleton />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

async function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <DashboardLayoutClient user={session.user}>
      {children}
    </DashboardLayoutClient>
  );
}
