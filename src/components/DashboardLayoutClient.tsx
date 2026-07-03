"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  Activity, LayoutDashboard, FolderKanban, ShoppingCart, 
  Receipt, User, LogOut, Menu, X, ChevronLeft, ChevronRight, Bell
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: any;
}

const menuItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Proyek Saya", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Pesanan", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Invoice", href: "/dashboard/invoices", icon: Receipt },
  { name: "Profil Saya", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayoutClient({ children, user }: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const NavLink = ({ item, onClick }: { item: typeof menuItems[0]; onClick?: () => void }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
    return (
      <Link
        href={item.href}
        onClick={onClick}
        title={item.name}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.75rem 1rem",
          borderRadius: "1rem",
          fontSize: "0.875rem",
          fontWeight: 600,
          transition: "all 0.15s",
          border: isActive ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
          backgroundColor: isActive ? "rgba(99,102,241,0.08)" : "transparent",
          color: isActive ? "#4f46e5" : "#64748b",
          justifyContent: !sidebarOpen && !onClick ? "center" : undefined,
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#f1f5f9";
            (e.currentTarget as HTMLElement).style.color = "#0f172a";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#64748b";
          }
        }}
      >
        <Icon className="w-5 h-5 shrink-0" style={{ color: isActive ? "#4f46e5" : "inherit" }} />
        {(sidebarOpen || onClick) && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <div className="flex h-full min-h-screen" style={{ backgroundColor: "#f8fafc" }}>

      {/* DESKTOP SIDEBAR */}
      <aside
        className="hidden md:flex flex-col relative flex-shrink-0 transition-all duration-300"
        style={{
          width: sidebarOpen ? "240px" : "72px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e2e8f0",
        }}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "absolute",
            right: "-12px",
            top: "32px",
            padding: "6px",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            color: "#64748b",
            borderRadius: "9999px",
            cursor: "pointer",
          }}
        >
          {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Brand */}
        <div style={{
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderBottom: "1px solid #e2e8f0",
          justifyContent: !sidebarOpen ? "center" : undefined,
        }}>
          <span style={{ padding: "0.5rem", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "0.75rem" }}>
            <Activity className="w-5 h-5" style={{ color: "#ffffff" }} />
          </span>
          {sidebarOpen && (
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
              Web<span style={{ background: "linear-gradient(90deg, #4f46e5, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Craft</span>
            </span>
          )}
        </div>

        {/* Menu Links */}
        <nav style={{ flex: 1, padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {menuItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer User Info / Logout */}
        <div style={{ padding: "1rem", borderTop: "1px solid #e2e8f0" }}>
          {sidebarOpen ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "1rem",
              padding: "0.75rem",
              marginBottom: "0.75rem",
            }}>
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                alt={user.name}
                style={{ width: "36px", height: "36px", borderRadius: "9999px", objectFit: "cover", border: "1px solid #e2e8f0" }}
              />
              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</h4>
                <p style={{ fontSize: "10px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.role}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                alt={user.name}
                style={{ width: "36px", height: "36px", borderRadius: "9999px", objectFit: "cover", border: "1px solid #e2e8f0" }}
              />
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Keluar"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#ef4444",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              justifyContent: !sidebarOpen ? "center" : undefined,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#fef2f2";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              style={{ position: "absolute", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)" }}
            ></motion.div>

            {/* Sidebar content */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              style={{
                width: "240px",
                backgroundColor: "#ffffff",
                borderRight: "1px solid #e2e8f0",
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #e2e8f0",
                }}>
                  <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                    <span style={{ padding: "0.5rem", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "0.75rem" }}>
                      <Activity className="w-5 h-5" style={{ color: "#ffffff" }} />
                    </span>
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>cleavCraft</span>
                  </Link>
                  <button onClick={() => setMobileSidebarOpen(false)} style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav style={{ padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {menuItems.map((item) => (
                    <NavLink key={item.name} item={item} onClick={() => setMobileSidebarOpen(false)} />
                  ))}
                </nav>
              </div>

              <div style={{ padding: "1rem", borderTop: "1px solid #e2e8f0" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "1rem",
                  padding: "0.75rem",
                  marginBottom: "0.75rem",
                }}>
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                    alt={user.name}
                    style={{ width: "36px", height: "36px", borderRadius: "9999px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                  />
                  <div>
                    <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{user.name}</h4>
                    <p style={{ fontSize: "10px", color: "#94a3b8" }}>{user.role}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "1rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#ef4444",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Keluar</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
        
        {/* Header Bar */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden"
              style={{
                padding: "0.5rem",
                color: "#64748b",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "0.75rem",
                cursor: "pointer",
              }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block" style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Portal Klien cleavCraft
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Notification Bell */}
            <button style={{
              padding: "0.625rem",
              color: "#64748b",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              position: "relative",
              cursor: "pointer",
            }}>
              <Bell className="w-4 h-4" />
              <span style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                width: "6px",
                height: "6px",
                backgroundColor: "#6366f1",
                borderRadius: "9999px",
              }}></span>
            </button>

            {/* User Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span className="hidden sm:block" style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{user.name}</span>
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                alt={user.name}
                style={{ width: "32px", height: "32px", borderRadius: "9999px", objectFit: "cover", border: "1px solid #e2e8f0" }}
              />
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main style={{ padding: "2rem", flex: 1 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
