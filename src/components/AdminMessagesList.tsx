"use client";

import React, { useState } from "react";
import { Mail, Search, RefreshCw, CheckCircle, AlertCircle, Phone } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  serviceType: string;
  status: string;
  createdAt: string;
}

interface AdminMessagesListProps {
  initialMessages: Message[];
}

const validStatuses = ["NEW", "READ", "RESOLVED"];

export default function AdminMessagesList({ initialMessages }: AdminMessagesListProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState("");
  const [notification, setNotification] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showNotification = (text: string, type: "success" | "error") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    setUpdatingId(messageId);
    try {
      const res = await fetch(`/api/admin/messages/${messageId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, status: newStatus } : msg))
        );
        showNotification("Status pesan berhasil diperbarui!", "success");
      } else {
        const errData = await res.json();
        showNotification(errData.error || "Gagal memperbarui status pesan.", "error");
      }
    } catch (err) {
      showNotification("Kesalahan menyambung ke server.", "error");
    } finally {
      setUpdatingId("");
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase()) ||
      msg.serviceType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl flex items-center gap-2.5 text-xs font-bold shadow-lg border animate-bounce"
          style={{ 
            backgroundColor: notification.type === "success" ? "#ecfdf5" : "#fef2f2",
            borderColor: notification.type === "success" ? "#a7f3d0" : "#fecaca",
            color: notification.type === "success" ? "#047857" : "#b91c1c"
          }}
        >
          {notification.type === "success" ? <CheckCircle className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
          {notification.text}
        </div>
      )}

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari pengirim, pesan, atau topik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 border"
            style={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#0f172a" }}
          />
        </div>

        {/* Tab status filters */}
        <div className="flex flex-wrap gap-1.5 border p-1 rounded-xl bg-white" style={{ borderColor: "#e2e8f0" }}>
          {["ALL", ...validStatuses].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
                statusFilter === status 
                  ? "bg-indigo-500 text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Messages List */}
      <div className="border rounded-2xl overflow-hidden shadow-sm bg-white" style={{ borderColor: "#e2e8f0" }}>
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <Mail className="w-8 h-8 mx-auto text-slate-300" />
            <p>Tidak ada pesan masuk yang cocok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b" style={{ backgroundColor: "#f8fafc", color: "#64748b", borderColor: "#e2e8f0" }}>
                  <th className="p-4 font-bold">Pengirim</th>
                  <th className="p-4 font-bold">Kategori Layanan</th>
                  <th className="p-4 font-bold">Isi Pesan</th>
                  <th className="p-4 font-bold">Tanggal Kirim</th>
                  <th className="p-4 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#f1f5f9" }}>
                {filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Sender Details */}
                    <td className="p-4 space-y-1">
                      <span className="font-bold text-slate-900 block">{msg.name}</span>
                      <span className="text-[10px] text-slate-400 block">{msg.email}</span>
                      <a href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-[10px] hover:underline flex items-center gap-1 mt-1 font-semibold" style={{ color: "#16a34a" }}>
                        <Phone className="w-3 h-3" /> {msg.phone}
                      </a>
                    </td>

                    {/* Service Type */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold border" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0", color: "#6366f1" }}>
                        {msg.serviceType}
                      </span>
                    </td>

                    {/* Message Content */}
                    <td className="p-4 max-w-md">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {updatingId === msg.id ? (
                          <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                        ) : (
                          <select
                            value={msg.status}
                            onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                            className="p-2 border rounded-xl font-bold text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                            style={{
                              backgroundColor: 
                                msg.status === "RESOLVED" ? "#ecfdf5" : 
                                msg.status === "READ" ? "#eff6ff" : "#fffbeb",
                              borderColor:
                                msg.status === "RESOLVED" ? "#a7f3d0" : 
                                msg.status === "READ" ? "#bfdbfe" : "#fde68a",
                              color: 
                                msg.status === "RESOLVED" ? "#047857" : 
                                msg.status === "READ" ? "#1d4ed8" : "#b45309"
                            }}
                          >
                            {validStatuses.map((st) => (
                              <option key={st} value={st} className="font-semibold bg-white text-slate-800">
                                {st}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
