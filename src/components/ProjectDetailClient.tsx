"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  FolderKanban, Calendar, Clock, Check, RefreshCw, UploadCloud, 
  FileText, Download, Trash, Send, Paperclip, ShieldCheck, 
  CreditCard, ExternalLink, AlertCircle
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

interface ProjectFile {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  createdAt: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  message: string;
  createdAt: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: string;
  pdfUrl: string;
  createdAt: string;
}

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  budget: number;
  deadline: string;
  createdAt: string;
  clientName: string;
  packageName: string;
  packageDescription: string;
  packageFeatures: string[];
  orderId: string;
  paymentStatus: string;
  paymentMethod: string;
  invoiceUrl: string;
  milestones: Milestone[];
  files: ProjectFile[];
  messages: Message[];
  invoices: Invoice[];
}

interface ProjectDetailClientProps {
  project: ProjectDetail;
  currentUser: any;
}

export default function ProjectDetailClient({ project, currentUser }: ProjectDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dynamic lists from state to allow real-time uploads/chats
  const [filesList, setFilesList] = useState<ProjectFile[]>(project.files);
  const [messagesList, setMessagesList] = useState<Message[]>(project.messages);
  
  // Chat input state
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // File upload state
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate deadline countdown days
  const calculateDaysLeft = () => {
    const today = new Date();
    const deadlineDate = new Date(project.deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  const daysLeft = calculateDaysLeft();

  // Scroll chat to bottom on load or new message
  useEffect(() => {
    if (activeTab === "messages") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesList, activeTab]);

  // Handle post message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMsg) return;

    setSendingMsg(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage })
      });

      if (res.ok) {
        const sentMsg = await res.json();
        setMessagesList((prev) => [
          ...prev,
          {
            id: sentMsg.id,
            senderId: sentMsg.senderId,
            senderName: sentMsg.sender.name,
            senderRole: sentMsg.sender.role,
            senderAvatar: sentMsg.sender.avatar || "",
            message: sentMsg.message,
            createdAt: sentMsg.createdAt
          }
        ]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    } finally {
      setSendingMsg(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/projects/${project.id}/files`, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const uploaded = await res.json();
        setFilesList((prev) => [
          {
            id: uploaded.id,
            fileName: uploaded.fileName,
            fileUrl: uploaded.fileUrl,
            uploadedBy: uploaded.uploadedBy,
            createdAt: uploaded.createdAt
          },
          ...prev
        ]);
      } else {
        const errData = await res.json();
        setUploadError(errData.error || "Gagal mengunggah berkas.");
      }
    } catch (err) {
      setUploadError("Gagal menyambungkan ke server.");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Status Style Formatting
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "REVIEW":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "REVISION":
        return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20";
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold px-3 py-1 border rounded-full ${getStatusBadgeStyles(project.status)}`}>
              {project.status.replace("_", " ")}
            </span>
            <span className="text-slate-500 text-xs font-medium">ID: {project.id}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">{project.title}</h2>
          <p className="text-xs text-slate-400 font-medium">Layanan: {project.type} ({project.packageName} Package)</p>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-4 bg-slate-950 border border-slate-800/80 p-4 rounded-2xl shrink-0">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tersisa</h4>
            <p className="text-base font-extrabold text-white mt-0.5">
              {daysLeft} Hari Kerja
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-900 flex overflow-x-auto gap-2 pb-px text-sm">
        {["overview", "milestones", "files", "messages", "invoices"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 border-b-2 font-bold capitalize transition-all whitespace-nowrap ${
              activeTab === tab
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab === "files" ? `Files (${filesList.length})` : tab}
          </button>
        ))}
      </div>

      {/* Tab Inner Content */}
      <div className="pt-2">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Description & Scope */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider text-slate-400">Deskripsi Proyek</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{project.description}</p>
              </div>

              <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider text-slate-400">Scope & Fitur Paket ({project.packageName})</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{project.packageDescription}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {project.packageFeatures.map((feat, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-xs text-slate-300">
                      <span className="p-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Details Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-6">
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3">Rincian Kontrak</h3>
                
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">Klien</span>
                    <span className="text-white font-bold mt-1 block">{project.clientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Total Anggaran (Budget)</span>
                    <span className="text-white font-bold text-sm mt-1 block">
                      Rp {(project.budget / 1000000).toFixed(1)}jt
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Status Pembayaran</span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 border rounded-full mt-1.5 ${
                      project.paymentStatus === "PAID" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {project.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Metode Pembayaran</span>
                    <span className="text-slate-300 mt-1 block">{project.paymentMethod || "Belum dipilih"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Tanggal Mulai Kontrak</span>
                    <span className="text-slate-300 mt-1 block">
                      {new Date(project.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MILESTONES TAB */}
        {activeTab === "milestones" && (
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-6">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3">Milestone Perkembangan</h3>
            
            {project.milestones.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Belum ada milestone dibuat untuk proyek ini.
              </div>
            ) : (
              <div className="space-y-4">
                {project.milestones.map((ms) => {
                  const isDone = ms.status === "DONE";
                  const isInProgress = ms.status === "IN_PROGRESS";
                  
                  return (
                    <div 
                      key={ms.id} 
                      className={`border rounded-2xl p-4 flex justify-between items-start gap-4 transition-all ${
                        isDone 
                          ? "bg-slate-950/20 border-slate-950 text-slate-400" 
                          : isInProgress
                            ? "bg-indigo-500/5 border-indigo-500/20 text-slate-200"
                            : "bg-slate-900/60 border-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className={`text-sm font-bold ${isDone ? "line-through text-slate-500" : "text-white"}`}>{ms.title}</h4>
                          <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${
                            isDone 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : isInProgress
                                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse"
                                : "bg-slate-950 text-slate-500 border-slate-800"
                          }`}>
                            {ms.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{ms.description}</p>
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono text-right shrink-0">
                        Target: <br />
                        <span className="font-semibold text-slate-400">
                          {new Date(ms.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. FILES TAB */}
        {activeTab === "files" && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider text-slate-400">Unggah Berkas Proyek</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Unggah panduan logo brand, petunjuk warna (brand book), file kawat (wireframes), atau berkas kebutuhan konten tambahan lainnya (maks. 10MB per file).
              </p>

              {uploadError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {uploadError}
                </div>
              )}

              {/* Upload Input */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/20 hover:bg-slate-950/40 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                
                {uploadingFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                    <span className="text-xs text-slate-400">Sedang mengunggah berkas...</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-500" />
                    <span className="text-xs text-slate-300 font-semibold">Klik untuk memilih berkas</span>
                    <span className="text-[10px] text-slate-500">Mendukung format PNG, JPG, PDF, ZIP (Maks. 10MB)</span>
                  </>
                )}
              </div>
            </div>

            {/* Files List */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-6">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3">Daftar Berkas Terunggah</h3>

              {filesList.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Belum ada berkas terunggah.
                </div>
              ) : (
                <div className="divide-y divide-slate-900/60">
                  {filesList.map((file) => (
                    <div key={file.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 text-left">
                          <h4 className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md" title={file.fileName}>
                            {file.fileName}
                          </h4>
                          <p className="text-[9px] text-slate-500 mt-0.5">
                            Diunggah oleh: {file.uploadedBy} • {new Date(file.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl"
                        title="Download Berkas"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. MESSAGES (CHAT) TAB */}
        {activeTab === "messages" && (
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl shadow-xl flex flex-col h-[520px] overflow-hidden">
            
            {/* Header info */}
            <div className="p-4 border-b border-slate-900 bg-slate-900/50 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-bold text-white">Saluran Obrolan Proyek</span>
              </div>
              <span className="text-slate-500">Klien ↔ Tim cleavCraft</span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/20">
              {messagesList.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Belum ada percakapan. Kirim pesan pertama untuk memulai konsultasi!
                </div>
              ) : (
                messagesList.map((msg) => {
                  const isCurrentUser = msg.senderId === currentUser.id;
                  const isStaff = msg.senderRole === "ADMIN" || msg.senderRole === "STAFF";

                  return (
                    <div 
                      key={msg.id} 
                      className={`flex gap-3 max-w-[85%] ${isCurrentUser ? "ml-auto flex-row-reverse text-right" : "mr-auto text-left"}`}
                    >
                      {/* Avatar */}
                      <img 
                        src={msg.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
                        alt={msg.senderName} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0 mt-1"
                      />
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="font-bold text-slate-400">{msg.senderName}</span>
                          {isStaff && (
                            <span className="text-[8px] font-extrabold bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 px-1 py-px rounded">
                              Agensi
                            </span>
                          )}
                        </div>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isCurrentUser 
                            ? "bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-tr-none shadow-md shadow-indigo-500/5" 
                            : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                        }`}>
                          {msg.message}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Send Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-900 bg-slate-900/50 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tulis pesan ke tim cleavCraft..."
                className="flex-1 px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200 placeholder-slate-600"
              />
              <button
                type="submit"
                disabled={sendingMsg || !newMessage.trim()}
                className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 5. INVOICES TAB */}
        {activeTab === "invoices" && (
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-6">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-3">Invoice & Pembayaran</h3>

            {project.invoices.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Belum ada invoice diterbitkan untuk proyek ini.
              </div>
            ) : (
              <div className="space-y-4">
                {project.invoices.map((inv) => {
                  const isPaid = inv.status === "PAID";
                  
                  return (
                    <div 
                      key={inv.id}
                      className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-800 transition-all"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-left space-y-1">
                          <h4 className="text-sm font-bold text-white">Tagihan #{inv.invoiceNumber}</h4>
                          <div className="flex gap-2 items-center flex-wrap">
                            <span className="text-[10px] text-slate-500">
                              Jatuh Tempo: {new Date(inv.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${
                              isPaid 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>
                              {inv.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-500">Nominal</span>
                          <p className="text-sm font-bold text-white">Rp {(inv.amount / 1000000).toFixed(1)}jt</p>
                        </div>
                        
                        {isPaid ? (
                          <a
                            href={inv.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
                          >
                            Download PDF
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <Link
                            href={`/dashboard/invoices`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-xs font-semibold shadow shadow-indigo-500/10 transition-transform hover:scale-102"
                          >
                            Bayar Sekarang
                            <CreditCard className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
