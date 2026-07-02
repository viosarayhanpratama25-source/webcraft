"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Phone, Lock, Save, ShieldAlert, CheckCircle } from "lucide-react";

export default function ClientProfileForm({ initialUser }: { initialUser: any }) {
  const { update } = useSession();
  
  // Profile details states
  const [name, setName] = useState(initialUser.name || "");
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [avatar, setAvatar] = useState(initialUser.avatar || "");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsSuccess, setDetailsSuccess] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Password details states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Notification preferences states (fake toggles)
  const [notifyOrder, setNotifyOrder] = useState(true);
  const [notifyMilestone, setNotifyMilestone] = useState(true);
  const [notifyChat, setNotifyChat] = useState(true);

  // Update profile details
  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsLoading(true);
    setDetailsError("");
    setDetailsSuccess(false);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, avatar, action: "UPDATE_DETAILS" })
      });

      const data = await res.json();

      if (res.ok) {
        setDetailsSuccess(true);
        // Sync details with NextAuth Session
        await update({ name, avatar, phone });
        setTimeout(() => setDetailsSuccess(false), 3000);
      } else {
        setDetailsError(data.error || "Gagal memperbarui profil.");
      }
    } catch (err) {
      setDetailsError("Gagal menyambungkan ke server.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Update password details
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Sandi baru dan konfirmasi sandi baru tidak cocok.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword, action: "UPDATE_PASSWORD" })
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(data.error || "Gagal memperbarui kata sandi.");
      }
    } catch (err) {
      setPasswordError("Gagal menyambungkan ke server.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Personal details */}
      <div className="lg:col-span-8 space-y-6 text-left">
        
        {/* Profile Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-extrabold text-white text-base">Informasi Personal</h3>
          
          {detailsSuccess && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-200 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Profil berhasil diperbarui.
            </div>
          )}

          {detailsError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-2xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              {detailsError}
            </div>
          )}

          <form onSubmit={handleUpdateDetails} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Nama Lengkap</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-900 rounded-2xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Alamat Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-600">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    disabled
                    value={initialUser.email}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950/20 border border-slate-900/60 rounded-2xl text-xs text-slate-500 cursor-not-allowed"
                    title="Alamat email tidak dapat diubah"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Nomor Telepon</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <Phone className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-900 rounded-2xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Avatar URL (Link Foto)</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-900 rounded-2xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={detailsLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-2xl text-xs flex items-center gap-2 transition-all shadow shadow-indigo-500/10 disabled:opacity-50"
              >
                {detailsLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-extrabold text-white text-base">Ganti Kata Sandi</h3>

          {passwordSuccess && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-200 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Kata sandi berhasil diperbarui.
            </div>
          )}

          {passwordError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-2xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              {passwordError}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Kata Sandi Lama</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-900 rounded-2xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Kata Sandi Baru</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-900 rounded-2xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Konfirmasi Sandi Baru</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-900 rounded-2xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-2xl text-xs flex items-center gap-2 transition-all shadow shadow-indigo-500/10 disabled:opacity-50"
              >
                {passwordLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Ubah Kata Sandi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Right Column: Preferences */}
      <div className="lg:col-span-4 space-y-6 text-left">
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-6">
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3">
            Preferensi Notifikasi
          </h3>
          
          <div className="space-y-4 text-xs">
            {/* Notify 1 */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white">Status Pesanan Baru</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Kirim email saat status invoice diterbitkan.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyOrder}
                onChange={(e) => setNotifyOrder(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded text-indigo-500 bg-slate-950 border-slate-800 focus:ring-indigo-500"
              />
            </div>

            {/* Notify 2 */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white">Milestone Selesai</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Kirim notifikasi saat pengerjaan milestone selesai.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyMilestone}
                onChange={(e) => setNotifyMilestone(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded text-indigo-500 bg-slate-950 border-slate-800 focus:ring-indigo-500"
              />
            </div>

            {/* Notify 3 */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white">Pesan Chat Masuk</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Kirim email jika tim developer mengirim Anda pesan.</p>
              </div>
              <input
                type="checkbox"
                checked={notifyChat}
                onChange={(e) => setNotifyChat(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded text-indigo-500 bg-slate-950 border-slate-800 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
