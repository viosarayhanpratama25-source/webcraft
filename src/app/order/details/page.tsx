"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Activity, ArrowLeft, ArrowRight, FolderOpen, Link2, 
  Plus, Trash, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, Check
} from "lucide-react";

export default function OrderDetailsPage() {
  const router = useRouter();
  
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // Form Fields State
  const [projectName, setProjectName] = useState("");
  const [websiteType, setWebsiteType] = useState("Website Company Profile");
  const [description, setDescription] = useState("");
  const [referenceUrls, setReferenceUrls] = useState<string[]>([""]);
  const [budget, setBudget] = useState(1500000);
  const [deadline, setDeadline] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  
  const [error, setError] = useState("");

  // Load package from localStorage
  useEffect(() => {
    const pkgStr = localStorage.getItem("webcraft_order_package");
    if (!pkgStr) {
      router.push("/order");
      return;
    }
    const pkg = JSON.parse(pkgStr);
    setSelectedPackage(pkg);
    setBudget(pkg.price);
    
    // Set default features based on package
    if (pkg.name === "Starter") {
      setWebsiteType("Landing Page");
      setFeatures(["Responsive Design", "Basic SEO"]);
    } else if (pkg.name === "Professional") {
      setWebsiteType("Website Company Profile");
      setFeatures(["Responsive Design", "Basic SEO", "Contact Form", "CMS Integration"]);
    } else if (pkg.name === "Enterprise") {
      setWebsiteType("Custom");
      setFeatures(["Responsive Design", "Advanced SEO", "Contact Form", "CMS Integration", "Payment Gateway", "Custom Features"]);
    }

    // Set default deadline (today + package deliveryTime)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + pkg.deliveryTime);
    setDeadline(defaultDate.toISOString().split("T")[0]);

    // Load any draft details if they exist
    const draftStr = localStorage.getItem("webcraft_order_details");
    if (draftStr) {
      const draft = JSON.parse(draftStr);
      setProjectName(draft.projectName || "");
      setWebsiteType(draft.websiteType || "");
      setDescription(draft.description || "");
      setReferenceUrls(draft.referenceUrls || [""]);
      setBudget(draft.budget || pkg.price);
      setDeadline(draft.deadline || "");
      setFeatures(draft.features || []);
    }
  }, [router]);

  const handleAddUrl = () => {
    setReferenceUrls([...referenceUrls, ""]);
  };

  const handleRemoveUrl = (idx: number) => {
    if (referenceUrls.length === 1) return;
    setReferenceUrls(referenceUrls.filter((_, i) => i !== idx));
  };

  const handleUrlChange = (idx: number, val: string) => {
    const updated = [...referenceUrls];
    updated[idx] = val;
    setReferenceUrls(updated);
  };

  const toggleFeature = (feat: string) => {
    if (features.includes(feat)) {
      setFeatures(features.filter(f => f !== feat));
    } else {
      setFeatures([...features, feat]);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!projectName.trim()) {
      setError("Nama proyek wajib diisi.");
      return;
    }

    if (!description.trim()) {
      setError("Deskripsi proyek wajib diisi.");
      return;
    }

    if (!deadline) {
      setError("Pilihlah target tenggat waktu (deadline).");
      return;
    }

    const orderDetails = {
      packageId: selectedPackage.id,
      projectName,
      websiteType,
      description,
      referenceUrls: referenceUrls.filter(url => url.trim() !== ""),
      budget,
      deadline,
      features,
    };

    localStorage.setItem("webcraft_order_details", JSON.stringify(orderDetails));
    router.push("/order/review");
  };

  const handleSaveDraft = () => {
    const orderDetails = {
      packageId: selectedPackage?.id || "",
      projectName,
      websiteType,
      description,
      referenceUrls: referenceUrls.filter(url => url.trim() !== ""),
      budget,
      deadline,
      features,
    };
    localStorage.setItem("webcraft_order_details", JSON.stringify(orderDetails));
    alert("Draft order brief berhasil disimpan di peramban Anda!");
  };

  if (!selectedPackage) return null;

  const availableFeatures = [
    "Contact Form",
    "Blog / Artikel",
    "Galeri Portofolio",
    "Sistem Pembayaran",
    "Multi-bahasa",
    "SEO Analytics Suite",
    "Integrasi Chat WhatsApp",
    "Dashboard Admin",
    "CMS (Manajemen Konten)",
    "Keamanan SSL & Backup"
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans py-12 px-6 relative select-none">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full space-y-8 relative z-10 text-left">
        
        {/* Logo and Back */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <span className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl">
              <Activity className="w-5 h-5 text-white" />
            </span>
            cleavCraft
          </Link>
          <Link href="/order" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Pemilihan Paket
          </Link>
        </div>

        {/* Stepper progress */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-900 rounded-3xl p-5 max-w-2xl mx-auto text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[10px]">1</span>
            <span>Paket</span>
          </div>
          <div className="w-8 border-t border-slate-850"></div>
          <div className="flex items-center gap-2 text-indigo-400">
            <span className="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
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

        {/* Form Container */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="border-b border-slate-800 pb-5 mb-6">
            <h2 className="text-xl font-extrabold text-white">Detail Pengisian Brief Website</h2>
            <p className="text-xs text-slate-400 mt-1">
              Lengkapi berkas spesifikasi di bawah agar tim developer kami memahami visi desain website Anda secara utuh.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-2xl">
              {error}
            </div>
          )}

          <form onSubmit={handleContinue} className="space-y-6">
            
            {/* Project Name and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Nama Proyek / Bisnis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toko Hijab Cantik Mandiri"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Tipe Website</label>
                <select
                  value={websiteType}
                  onChange={(e) => setWebsiteType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-300 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Website Company Profile">Website Company Profile</option>
                  <option value="E-Commerce">E-Commerce / Toko Online</option>
                  <option value="Landing Page">Landing Page Promosi</option>
                  <option value="Custom">Aplikasi Web Kustom</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Deskripsi Kebutuhan & Target Web</label>
              <textarea
                required
                rows={5}
                placeholder="Deskripsikan profil bisnis Anda, fitur yang paling esensial, target pengunjung utama, serta referensi skema warna yang diinginkan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500"
              ></textarea>
            </div>

            {/* Dynamic Reference URLs */}
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Tautan Referensi Website Lain (Opsional)
              </label>
              <div className="space-y-3">
                {referenceUrls.map((url, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-600">
                        <Link2 className="w-4.5 h-4.5 w-4 h-4" />
                      </span>
                      <input
                        type="url"
                        placeholder="https://website-referensi.com"
                        value={url}
                        onChange={(e) => handleUrlChange(idx, e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    {referenceUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUrl(idx)}
                        className="p-2.5 bg-slate-950 border border-slate-900 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 rounded-xl"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddUrl}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Link Referensi
              </button>
            </div>

            {/* Features checkboxes */}
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Fitur Tambahan yang Diinginkan</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableFeatures.map((feat) => {
                  const isChecked = features.includes(feat);
                  return (
                    <div
                      key={feat}
                      onClick={() => toggleFeature(feat)}
                      className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isChecked 
                          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" 
                          : "bg-slate-950/40 border-slate-900 hover:border-slate-800 text-slate-400"
                      }`}
                    >
                      <span className="text-xs font-semibold select-none">{feat}</span>
                      <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isChecked 
                          ? "bg-indigo-500 border-indigo-500 text-white" 
                          : "border-slate-800 bg-slate-950 text-transparent"
                      }`}>
                        <Check className="w-3 h-3" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Budget and Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Komitmen Budget Proyek (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-100 focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                <span className="text-[10px] text-indigo-400 mt-1 block">
                  Harga standar paket {selectedPackage.name}: Rp {selectedPackage.price.toLocaleString("id-ID")}
                </span>
              </div>
              
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Target Peluncuran (Deadline)</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-300 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Simulated file upload link */}
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Unggah File Layout / Logo Asset</label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="Tautan Google Drive asset, Figma, atau logo (opsional)"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Stepper buttons */}
            <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-8">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all"
              >
                Simpan ke Draft
              </button>

              <div className="flex gap-3">
                <Link
                  href="/order"
                  className="px-5 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all"
                >
                  Kembali
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  Lanjutkan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
