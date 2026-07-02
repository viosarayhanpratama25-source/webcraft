import React, { Suspense } from "react";
export const dynamic = "force-dynamic";
import { db } from "@/lib/prisma";
import ClientOrderPackage from "@/components/ClientOrderPackage";

export default async function OrderPage() {
  const packages = await db.projectPackage.findMany();

  const packagesData = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    features: JSON.parse(pkg.features),
    deliveryTime: pkg.deliveryTime
  }));

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
