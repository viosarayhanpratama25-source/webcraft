"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Mail, Lock, ShieldAlert, ArrowRight, Activity } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const u = session.user as any;
      if (u.role === "ADMIN" || u.role === "STAFF") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error || "Login gagal. Cek kembali email dan password Anda.");
        setLoading(false);
      } else {
        router.refresh();
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4" style={{ backgroundColor: "#f8fafc" }}>
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(99,102,241,0.07)" }}></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(139,92,246,0.07)" }}></div>

      <div className="w-full max-w-md z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight mb-2" style={{ color: "#0f172a" }}>
            <span className="p-2 rounded-xl shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Activity className="w-6 h-6" style={{ color: "#ffffff" }} />
            </span>
            Web<span style={{ background: "linear-gradient(90deg, #4f46e5, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Craft</span>
          </Link>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>Masuk untuk mengelola proyek website Anda</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl p-8 shadow-xl border" style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}>
          {error && (
            <div className="mb-6 p-4 rounded-2xl flex items-start gap-3 text-sm" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", border: "1px solid #fecaca", color: "#b91c1c" }}>
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="email" style={{ color: "#475569" }}>
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center" style={{ color: "#94a3b8" }}>
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider" htmlFor="password" style={{ color: "#475569" }}>
                  Kata Sandi
                </label>
                <Link href="/auth/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: "#4f46e5" }}>
                  Lupa Sandi?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center" style={{ color: "#94a3b8" }}>
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6)", color: "#ffffff", boxShadow: "0 4px 24px rgba(99,102,241,0.18)" }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "#e2e8f0" }}></div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>atau masuk dengan</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#e2e8f0" }}></div>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-200 group"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#1e293b",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#cbd5e1";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.10)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f8fafc";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff";
            }}
          >
            <span className="w-5 h-5 flex-shrink-0">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </span>
            <span style={{ fontWeight: 600, letterSpacing: "0.01em" }}>Login dengan Google</span>
          </button>
        </div>

        {/* Register link */}
        <div className="text-center mt-6 text-sm" style={{ color: "#64748b" }}>
          Belum punya akun?{" "}
          <Link href="/auth/register" className="font-semibold hover:underline" style={{ color: "#4f46e5" }}>
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8fafc" }}>
        <span className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}></span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
