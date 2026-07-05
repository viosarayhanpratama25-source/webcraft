import React, { Suspense } from "react";
import { getCachedPackages } from "@/lib/cached-data";
import ClientOrderPackage from "@/components/ClientOrderPackage";

export default async function OrderPage() {
  const packagesData = await getCachedPackages();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <span className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    }>
      <ClientOrderPackage packages={packagesData} />
    </Suspense>
  );
}
