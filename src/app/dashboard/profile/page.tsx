import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ClientProfileForm from "@/components/ClientProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">Profil Pengguna</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Kelola nama, nomor telepon, foto profil, dan kata sandi masuk Anda.
        </p>
      </div>

      <ClientProfileForm initialUser={user} />
    </div>
  );
}
