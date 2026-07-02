"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock, ShieldAlert, ArrowRight, Activity, Check } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!agreeTerms) {
      setError("Anda harus menyetujui Syarat & Ketentuan kami.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal melakukan registrasi.");
        setLoading(false);
      } else {
        setSuccess(true);
        // Automatically log user in
        const loginRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginRes?.error) {
          // If login fails, just redirect to login page
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        } else {
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem saat mendaftar.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4 py-12">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-white mb-2">
            <span className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/20">
              <Activity className="w-6 h-6 text-white" />
            </span>
            Web<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Craft</span>
          </Link>
          <p className="text-slate-400 text-sm">Daftar akun baru untuk mulai memanage proyek</p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-200 text-sm rounded-2xl flex items-start gap-3">
              <span className="p-1 bg-green-500 text-white rounded-full shrink-0">
                <Check className="w-3. h-3. w-3.5 h-3.5" />
              </span>
              <div>
                <p className="font-semibold text-white">Registrasi Berhasil!</p>
                <p className="text-xs text-green-300 mt-0.5">Mengarahkan Anda ke dashboard...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="name">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <User className="w-5 h-5" />
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="email">
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="phone">
                Nomor Telepon / WhatsApp
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Phone className="w-5 h-5" />
                </span>
                <input
                  id="phone"
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="password">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="confirmPassword">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-indigo-500 bg-slate-950 border-slate-800 focus:ring-indigo-500 focus:ring-offset-slate-900 focus:ring-offset-2 accent-indigo-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 leading-normal">
                Saya menyetujui{" "}
                <Link href="#" className="text-indigo-400 hover:underline">
                  Syarat & Ketentuan
                </Link>{" "}
                serta{" "}
                <Link href="#" className="text-indigo-400 hover:underline">
                  Kebijakan Privasi
                </Link>{" "}
                yang berlaku di WebCraft.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Daftar Akun Baru
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
