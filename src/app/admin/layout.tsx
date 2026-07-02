import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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
