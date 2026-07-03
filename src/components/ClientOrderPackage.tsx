"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Activity, Check, ArrowRight, ArrowLeft } from "lucide-react";

interface PackageProps {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  deliveryTime: number;
}

export default function ClientOrderPackage({ packages }: { packages: PackageProps[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPkgId = searchParams.get("package") || "";

  const [selectedPkgId, setSelectedPkgId] = useState("");

  // Select recommended or query package
  useEffect(() => {
    if (initialPkgId) {
      setSelectedPkgId(initialPkgId);
    } else {
      const professionalPkg = packages.find(p => p.name === "Professional");
      if (professionalPkg) {
        setSelectedPkgId(professionalPkg.id);
      } else if (packages.length > 0) {
        setSelectedPkgId(packages[0].id);
      }
    }
  }, [initialPkgId, packages]);

  const handleContinue = () => {
    if (!selectedPkgId) return;
    const selectedPkg = packages.find(p => p.id === selectedPkgId);
    if (selectedPkg) {
      localStorage.setItem("webcraft_order_package", JSON.stringify(selectedPkg));
      router.push("/order/details");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans py-12 px-6 relative select-none">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto w-full space-y-10 relative z-10 text-left">
        
        {/* Logo and Back */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <span className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl">
              <Activity className="w-5 h-5 text-white" />
            </span>
            cleavCraft
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Stepper progress */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-900 rounded-3xl p-5 max-w-2xl mx-auto text-xs font-semibold">
          <div className="flex items-center gap-2 text-indigo-400">
            <span className="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
            <span>Paket</span>
          </div>
          <div className="w-8 border-t border-slate-800"></div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[10px]">2</span>
            <span>Brief Proyek</span>
          </div>
          <div className="w-8 border-t border-slate-800"></div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[10px]">3</span>
            <span>Konfirmasi</span>
          </div>
          <div className="w-8 border-t border-slate-800"></div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[10px]">4</span>
            <span>Pembayaran</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Pilih Paket Pengembangan</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Pilihlah salah satu dari 3 kategori paket standar pengerjaan di bawah. Hubungi kami jika membutuhkan kustomisasi penawaran budget yang lain.
          </p>
        </div>

        {/* Package selector cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isSelected = selectedPkgId === pkg.id;
            return (
              <div 
                key={pkg.id}
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`bg-slate-900/40 border rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                  isSelected 
                    ? "border-indigo-500 bg-slate-900/60 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5 scale-[1.02]" 
                    : "border-slate-900 hover:border-slate-800 hover:scale-[1.01]"
                }`}
              >
                {pkg.name === "Professional" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-[9px] font-bold uppercase tracking-wider text-white shadow">
                    Rekomendasi Utama
                  </span>
                )}

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-base">{pkg.name}</h3>
                      <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 tracking-wider">
                        Target {pkg.deliveryTime} Hari Kerja
                      </p>
                    </div>
                    {/* Check indicator */}
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                      isSelected 
                        ? "bg-indigo-500 border-indigo-500 text-white" 
                        : "border-slate-800 bg-slate-950 text-transparent"
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed mt-4 h-12">
                    {pkg.description}
                  </p>

                  <div className="mt-4">
                    <span className="text-xl sm:text-2xl font-extrabold text-white">
                      Rp {(pkg.price / 1000000).toFixed(1)}jt
                    </span>
                  </div>

                  <div className="border-t border-slate-900 mt-6 pt-4 space-y-2.5">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-300">
                        <span className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                          isSelected ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-500"
                        }`}>
                          <Check className="w-3 h-3" />
                        </span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPkgId(pkg.id);
                    handleContinue();
                  }}
                  className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-bold text-center transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow"
                      : "bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300"
                  }`}
                >
                  Pilih Paket
                </button>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center bg-slate-900/60 border border-slate-900 rounded-3xl p-6">
          <div className="text-left">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Paket Terpilih</span>
            <h4 className="font-extrabold text-white mt-1">
              {packages.find(p => p.id === selectedPkgId)?.name || "Silakan pilih paket"} Package
            </h4>
          </div>
          
          <button
            onClick={handleContinue}
            disabled={!selectedPkgId}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 group shadow transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            Lanjutkan ke Detail Brief
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Custom Package Contact */}
        <div className="text-center text-slate-500 text-xs">
          Butuh spesifikasi kustom atau integrasi web yang kompleks?{" "}
          <Link href="/#contact" className="text-indigo-400 hover:underline font-semibold">Hubungi Sales Agensi kami</Link>
        </div>

      </div>
    </div>
  );
}
