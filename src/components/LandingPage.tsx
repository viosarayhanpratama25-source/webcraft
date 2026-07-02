"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  Activity, Monitor, ShoppingBag, Layers, Code, Search, Settings, 
  ChevronRight, ArrowRight, Star, Check, Phone, Mail, MapPin, 
  ChevronDown, HelpCircle, Plus, Minus, Send, Menu, X, ExternalLink,
  Lock, LayoutDashboard, LogOut, CheckCircle2, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PackageProps {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  deliveryTime: number;
}

interface TestimonialProps {
  id: string;
  name: string;
  avatar: string;
  company: string;
  rating: number;
  quote: string;
}

interface BlogProps {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  publishedAt: string;
}

// Draggable Image Carousel Component
function ProjectImageCarousel({ project }: { project: any }) {
  const images: string[] = project.images?.length ? project.images : [project.image, project.imageAlt].filter(Boolean);

  const [current, setCurrent] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [dragDelta, setDragDelta] = React.useState(0);

  const goTo = (idx: number) => setCurrent(Math.max(0, Math.min(images.length - 1, idx)));

  const onMouseDown = (e: React.MouseEvent) => { setDragging(true); setStartX(e.clientX); setDragDelta(0); };
  const onMouseMove = (e: React.MouseEvent) => { if (!dragging) return; setDragDelta(e.clientX - startX); };
  const onMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragDelta < -60) goTo(current + 1);
    else if (dragDelta > 60) goTo(current - 1);
    setDragDelta(0);
  };
  const onTouchStart = (e: React.TouchEvent) => { setStartX(e.touches[0].clientX); setDragDelta(0); };
  const onTouchMove = (e: React.TouchEvent) => { setDragDelta(e.touches[0].clientX - startX); };
  const onTouchEnd = () => {
    if (dragDelta < -50) goTo(current + 1);
    else if (dragDelta > 50) goTo(current - 1);
    setDragDelta(0);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden relative select-none"
      style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.08)", userSelect: "none" }}
    >
      {/* Slide Track */}
      <div
        className="relative overflow-hidden"
        style={{ height: "340px", cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            display: "flex",
            width: `${images.length * 100}%`,
            height: "100%",
            transform: `translateX(calc(${-current * (100 / images.length)}% + ${dragging ? dragDelta : 0}px))`,
            transition: dragging ? "none" : "transform 0.42s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              style={{
                width: `${100 / images.length}%`,
                flexShrink: 0,
                height: "100%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  display: "block",
                  pointerEvents: "none",
                }}
              />
              {/* Subtle gradient overlay bottom */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to top, rgba(10,15,30,0.7), transparent)", pointerEvents: "none" }} />
              {/* Slide counter */}
              <div style={{ position: "absolute", top: "10px", right: "12px", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)", padding: "3px 8px", borderRadius: "99px", letterSpacing: "0.05em" }}>
                {i + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>

        {/* Prev arrow */}
        {current > 0 && (
          <button onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", width: "34px", height: "34px", borderRadius: "50%", background: "rgba(10,15,30,0.75)", border: "1px solid rgba(255,255,255,0.15)", color: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, backdropFilter: "blur(8px)", transition: "all 0.2s" }}
          ><ChevronRight style={{ width: "16px", height: "16px", transform: "rotate(180deg)" }} /></button>
        )}
        {/* Next arrow */}
        {current < images.length - 1 && (
          <button onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}
            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "34px", height: "34px", borderRadius: "50%", background: "rgba(10,15,30,0.75)", border: "1px solid rgba(255,255,255,0.15)", color: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, backdropFilter: "blur(8px)", transition: "all 0.2s" }}
          ><ChevronRight style={{ width: "16px", height: "16px" }} /></button>
        )}
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px 0 12px" }}>
        {images.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width: i === current ? "22px" : "6px", height: "6px", borderRadius: "99px", background: i === current ? "#6366f1" : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }}
          />
        ))}
        <span style={{ marginLeft: "8px", fontSize: "8px", color: "rgba(148,163,184,0.4)", userSelect: "none" }}>← geser →</span>
      </div>
    </div>
  );
}


const renderProjectMockups = (project: any) => {
  let buttonColor = "bg-gradient-to-r from-indigo-500 to-violet-500";
  let secondaryColor = "text-indigo-400";
  
  if (project.category === "E-Commerce") {
    buttonColor = "bg-gradient-to-r from-violet-500 to-fuchsia-500";
    secondaryColor = "text-violet-400";
  } else if (project.category === "Company Profile") {
    buttonColor = "bg-gradient-to-r from-teal-500 to-emerald-500";
    secondaryColor = "text-teal-400";
  } else if (project.category === "Landing Page") {
    buttonColor = "bg-gradient-to-r from-sky-500 to-blue-500";
    secondaryColor = "text-sky-400";
  }

  const titleWord1 = project.title.split(" ")[0] || "Project";
  const titleWord2 = project.title.split(" ").slice(1).join(" ") || "";

  return (
    <ProjectImageCarousel project={project} />
  );
};

interface LandingPageProps {
  packages: PackageProps[];
  testimonials: TestimonialProps[];
  blogs: BlogProps[];
}

export default function LandingPage({ packages, testimonials, blogs }: LandingPageProps) {
  const { data: session } = useSession();
  const user = session?.user as any;
  
  // Navigation Menu Toggle (Mobile)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Portfolio Tabs and Modal
  const [portfolioTab, setPortfolioTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  // Testimonials Auto-scroll Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Chatbot Widget State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role:"user"|"bot", text:string, time:string}>>([{
    role: "bot",
    text: "Halo! 👋 Saya **WebCraft AI**, asisten virtual Anda. Saya siap membantu menjawab pertanyaan seputar layanan, harga, dan proses pembuatan website. Ada yang bisa saya bantu?",
    time: new Date().toLocaleTimeString("id-ID", {hour:"2-digit",minute:"2-digit"})
  }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, chatLoading]);

  const WA_NUMBER = "6289501113573";
  const sendChatMessage = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const time = new Date().toLocaleTimeString("id-ID", {hour:"2-digit",minute:"2-digit"});
    const userMsg = { role: "user" as const, text, time };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatMessages, userMsg].map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })) })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: "bot", text: data.reply || "Maaf, saya tidak bisa menjawab saat ini.", time: new Date().toLocaleTimeString("id-ID", {hour:"2-digit",minute:"2-digit"}) }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "bot", text: "Terjadi kesalahan koneksi. Silakan hubungi kami via WhatsApp.", time: new Date().toLocaleTimeString("id-ID", {hour:"2-digit",minute:"2-digit"}) }]);
    } finally {
      setChatLoading(false);
    }
  };
  const quickChips = ["Berapa harga website?", "Berapa lama pengerjaannya?", "Apa saja yang termasuk?", "Apakah ada revisi?"];
  const waOrderUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo WebCraft! Saya tertarik untuk memesan layanan pembuatan website. Bisa bantu saya?")}`;
  const formatBotText = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactService, setContactService] = useState("Website Company Profile");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Auto-scroll testimonials carousel
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  // Contact submit handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError("");
    setContactSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          serviceType: contactService,
          message: contactMessage
        })
      });

      if (res.ok) {
        setContactSuccess(true);
        setContactName("");
        setContactEmail("");
        setContactPhone("");
        setContactMessage("");
      } else {
        const errData = await res.json();
        setContactError(errData.error || "Gagal mengirim pesan.");
      }
    } catch (err) {
      setContactError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setContactLoading(false);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setNewsletterEmail("");
    setTimeout(() => setNewsletterSuccess(false), 4000);
  };

  // Mock Portfolio Data
  const portfolios = [
    {
      id: "p1",
      title: "MeetDocu",
      category: "Company Profile",
      image: "/portfolio/meetdocu-1.png",
      imageAlt: "/portfolio/meetdocu-2.png",
      images: [
        "/portfolio/meetdocu-1.png",
        "/portfolio/meetdocu-2.png",
        "/portfolio/meetdocu-3.png",
        "/portfolio/meetdocu-4.png",
      ],
      description: "Aplikasi manajemen dokumentasi rapat perusahaan secara digital. Dilengkapi sistem login aman, integrasi Zoho SSO, pencatatan agenda otomatis, dan arsip dokumen meeting yang terstruktur dan mudah dicari.",
      stack: ["React.js", "Node.js", "PostgreSQL", "Zoho OAuth", "Tailwind CSS"],
      testimonial: "Dokumentasi rapat kami menjadi sangat terorganisir. Tidak ada lagi file tersebar di berbagai folder!",
      before: "Dokumentasi meeting masih manual via file Word & folder tidak terstruktur",
      after: "Sistem pencatatan digital terpusat dengan akses aman berbasis role dan SSO"
    },
    {
      id: "p2",
      title: "Sistem Pelatihan Proxsis",
      category: "Landing Page",
      image: "/portfolio/webtraining-thumbnail.png",
      imageAlt: "/portfolio/webtraining-2.png",
      images: [
        "/portfolio/webtraining-thumbnail.png",
        "/portfolio/webtraining-1.png",
        "/portfolio/webtraining-2.png",
        "/portfolio/webtraining-3.png",
      ],
      description: "Platform manajemen pelatihan dan pengembangan SDM korporat. Menampilkan dashboard progress pelatihan real-time, jadwal training, tracking kehadiran, sertifikat digital, dan laporan pengembangan bulanan.",
      stack: ["Next.js App Router", "Prisma ORM", "PostgreSQL", "Chart.js", "Tailwind CSS"],
      testimonial: "Realisasi jam pelatihan karyawan naik 60% karena mudahnya memantau progress via dashboard.",
      before: "Data pelatihan masih manual di spreadsheet Excel yang sulit dimonitor",
      after: "Dashboard terpusat real-time dengan auto-reminder jadwal dan laporan analitik"
    },
  ];

  const filteredPortfolios = portfolioTab === "All" 
    ? portfolios 
    : portfolios.filter(p => p.category === portfolioTab);

  // FAQ Data
  const faqs = [
    { q: "Berapa lama proses pembuatan website?", a: "Tergantung tingkat kompleksitas website. Paket Starter memerlukan waktu sekitar 7 hari, Paket Professional 14 hari, dan Paket Enterprise berkisar antara 30 hingga 60 hari." },
    { q: "Apakah saya harus menyiapkan hosting dan domain?", a: "Tidak perlu. Semua paket layanan kami sudah termasuk gratis domain (.com / .id) dan hosting cloud premium selama 1 tahun pertama." },
    { q: "Apakah website yang dibuat bisa diedit sendiri nantinya?", a: "Ya! Untuk Paket Professional dan Enterprise, kami mengintegrasikan Sistem Manajemen Konten (CMS) yang memudahkan Anda menambah, mengedit, atau menghapus teks dan gambar tanpa perlu memahami kode pemrograman." },
    { q: "Bagaimana dengan sistem pembayarannya?", a: "Pembayaran dapat dicicil 2 kali (DP 50% di awal dan pelunasan 50% setelah website selesai ditesting dan siap dirilis), atau pembayaran penuh melalui gateway aman (Midtrans/Stripe) di dashboard." },
    { q: "Apakah website sudah SEO Friendly?", a: "Tentu saja. Semua website dirancang mengikuti praktik SEO terbaik meliputi struktur tag HTML yang tepat, optimasi kecepatan, kompresi gambar, skema metadata, dan submit sitemap ke Google Search Console." },
    { q: "Apakah ada garansi jika website mengalami error?", a: "Ya, kami memberikan garansi pemeliharaan (maintenance) gratis terhadap error atau bug sistem selama 3 bulan pertama setelah website diluncurkan." },
    { q: "Bagaimana cara melakukan revisi desain?", a: "Proses revisi dilakukan pada tahap wireframe dan desain UI/UX sebelum coding dimulai. Paket Starter mendapat 2x revisi, Professional 3x, dan Enterprise mendapat revisi tidak terbatas." },
    { q: "Apakah WebCraft melayani custom web application?", a: "Ya, kami melayani pembuatan sistem kustom seperti dashboard internal, e-learning, portal agen, sistem booking, dan integrasi pihak ketiga pada Paket Enterprise." }
  ];

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative">
      
      {/* 1. HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <span className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl shadow-md shadow-indigo-500/10">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </span>
            Web<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Craft</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#services" className="hover:text-white transition-colors">Layanan</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portofolio</a>
            <a href="#pricing" className="hover:text-white transition-colors">Paket Harga</a>
            <a href="#timeline" className="hover:text-white transition-colors">Proses Kami</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-white transition-colors">Kontak</a>
          </nav>

          {/* Desktop Authentication Button */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href={user.role === "ADMIN" || user.role === "STAFF" ? "/admin" : "/dashboard"}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 font-semibold hover:bg-indigo-500/20 text-sm transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="p-2 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/10"
              >
                <Lock className="w-4 h-4" />
                Masuk Klien
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 absolute top-[73px] left-0 w-full z-40 px-6 py-6 space-y-4 shadow-xl"
          >
            <nav className="flex flex-col gap-4 text-slate-300 font-medium">
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Layanan</a>
              <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Portofolio</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Paket Harga</a>
              <a href="#timeline" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Proses Kami</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">FAQ</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Kontak</a>
            </nav>
            <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link 
                    href={user.role === "ADMIN" || user.role === "STAFF" ? "/admin" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard ({user.name})
                  </Link>
                  <button 
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 border border-slate-800 text-slate-400 rounded-xl hover:text-white"
                  >
                    Keluar Akun
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl text-center shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Masuk Klien Portal
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center px-6 overflow-hidden">
        {/* Animated Gradient Background and Code Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        
        {/* Code elements floating */}
        <div className="absolute top-20 right-[15%] opacity-20 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg p-3 hidden lg:block pointer-events-none select-none">
          <p className="text-violet-400">const website = {"{"}</p>
          <p className="pl-4 text-indigo-300">speed: &quot;100%&quot;,</p>
          <p className="pl-4 text-emerald-300">seoReady: true,</p>
          <p className="pl-4 text-amber-300">responsive: true</p>
          <p className="text-violet-400">{"};"}</p>
        </div>

        <div className="absolute bottom-20 left-[10%] opacity-20 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg p-3 hidden lg:block pointer-events-none select-none">
          <p className="text-emerald-400">&lt;div className=&quot;premium-ux&quot;&gt;</p>
          <p className="pl-4 text-slate-400">&lt;AnimatedGradient /&gt;</p>
          <p className="text-emerald-400">&lt;/div&gt;</p>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-16">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              Agensi Digital Next-Generation
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Wujudkan Website <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Impian Anda
              </span>{" "}
              Bersama Kami
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              Kami merancang dan mengembangkan website berperforma tinggi, responsif, dan ramah SEO dengan UI/UX premium yang dirancang khusus untuk meningkatkan bisnis Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link 
                href="/order"
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 group transition-all"
              >
                Mulai Proyek Anda
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#portfolio"
                className="px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900/80 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all"
              >
                Lihat Portofolio
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block relative" style={{ perspective: "1200px" }}>
            {/* 3D floating scene */}
            <style>{`
              @keyframes float3d {
                0%, 100% { transform: rotateX(8deg) rotateY(-12deg) translateY(0px); }
                50% { transform: rotateX(8deg) rotateY(-12deg) translateY(-18px); }
              }
              @keyframes floatCard1 {
                0%, 100% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(-10px) translateX(4px); }
              }
              @keyframes floatCard2 {
                0%, 100% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(-14px) translateX(-3px); }
              }
              @keyframes floatCard3 {
                0%, 100% { transform: translateY(0px) translateX(0px); }
                33% { transform: translateY(-8px) translateX(6px); }
                66% { transform: translateY(4px) translateX(-4px); }
              }
              @keyframes orbitRing {
                from { transform: rotateX(75deg) rotateZ(0deg); }
                to { transform: rotateX(75deg) rotateZ(360deg); }
              }
              @keyframes pulseGlow {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.05); }
              }
              @keyframes shimmer3d {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              @keyframes typingBar {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
              .card-3d-main {
                animation: float3d 5s ease-in-out infinite;
                transform-style: preserve-3d;
              }
              .float-card-1 { animation: floatCard1 4s ease-in-out infinite; }
              .float-card-2 { animation: floatCard2 5.5s ease-in-out infinite; }
              .float-card-3 { animation: floatCard3 6s ease-in-out infinite; }
              .orbit-ring { animation: orbitRing 12s linear infinite; }
              .pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
            `}</style>

            <div className="relative w-full h-[420px] flex items-center justify-center">

              {/* Ambient glow behind */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full pulse-glow" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.10) 50%, transparent 70%)" }}></div>
              </div>

              {/* Orbit ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="orbit-ring w-80 h-80 rounded-full border border-indigo-500/15" style={{ transformStyle: "preserve-3d" }}>
                  <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-indigo-400/60 shadow-lg" style={{ boxShadow: "0 0 12px rgba(99,102,241,0.8)" }}></div>
                  <div className="absolute top-1/2 -right-2 w-3 h-3 rounded-full bg-violet-400/60" style={{ boxShadow: "0 0 10px rgba(139,92,246,0.8)" }}></div>
                </div>
              </div>

              {/* Main 3D Browser Card */}
              <div className="card-3d-main relative z-20 w-[300px]"
                style={{
                  background: "linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(30,27,75,0.98) 100%)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: "20px",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
                  transformStyle: "preserve-3d",
                }}>

                {/* Browser top bar */}
                <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.5)" }}></div>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 6px rgba(245,158,11,0.5)" }}></div>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.5)" }}></div>
                    <div style={{ flex: 1, height: "22px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", marginLeft: "8px", display: "flex", alignItems: "center", paddingLeft: "8px", gap: "4px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(34,197,94,0.6)" }}></div>
                      <span style={{ fontSize: "9px", color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>webcraft.id/dashboard</span>
                    </div>
                  </div>

                  {/* Nav tabs */}
                  <div style={{ display: "flex", gap: "4px" }}>
                    {["Overview", "Proyek", "Invoice"].map((tab, i) => (
                      <div key={tab} style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "9px",
                        fontWeight: 600,
                        background: i === 0 ? "rgba(99,102,241,0.2)" : "transparent",
                        color: i === 0 ? "#a5b4fc" : "rgba(148,163,184,0.5)",
                        border: i === 0 ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent"
                      }}>{tab}</div>
                    ))}
                  </div>
                </div>

                {/* Dashboard content */}
                <div style={{ padding: "14px 16px" }}>
                  {/* Stats row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                    {[
                      { label: "Proyek", value: "12", color: "#6366f1" },
                      { label: "Selesai", value: "9", color: "#22c55e" },
                      { label: "Klien", value: "120+", color: "#a78bfa" },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "8px", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                        <div style={{ fontSize: "14px", fontWeight: 800, color }}>{value}</div>
                        <div style={{ fontSize: "8px", color: "rgba(148,163,184,0.6)", marginTop: "2px" }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "9px", color: "rgba(148,163,184,0.8)", fontWeight: 600 }}>E-Commerce Hijab Cantik</span>
                      <span style={{ fontSize: "9px", color: "#6366f1", fontWeight: 700 }}>72%</span>
                    </div>
                    <div style={{ height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg, #6366f1, #a78bfa)", borderRadius: "999px" }}></div>
                    </div>
                  </div>

                  {/* Activity list */}
                  {[
                    { dot: "#22c55e", text: "Landing page selesai", time: "2 jam lalu" },
                    { dot: "#6366f1", text: "Revisi desain dikirim", time: "5 jam lalu" },
                    { dot: "#f59e0b", text: "Menunggu review klien", time: "1 hari lalu" },
                  ].map(({ dot, text, time }, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, flexShrink: 0, boxShadow: `0 0 6px ${dot}` }}></div>
                      <span style={{ fontSize: "9px", color: "rgba(226,232,240,0.8)", flex: 1 }}>{text}</span>
                      <span style={{ fontSize: "8px", color: "rgba(100,116,139,0.7)" }}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Card: Deploy Sukses */}
              <div className="float-card-1 absolute z-30"
                style={{
                  bottom: "28px",
                  right: "-10px",
                  background: "rgba(15,23,42,0.97)",
                  border: "1px solid rgba(34,197,94,0.35)",
                  borderRadius: "16px",
                  padding: "12px 14px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 24px rgba(34,197,94,0.08)",
                  backdropFilter: "blur(16px)",
                  minWidth: "188px",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
                  <div style={{ position: "relative", width: "8px", height: "8px", flexShrink: 0 }}>
                    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(34,197,94,0.4)", transform: "scale(2)", animation: "pulseGlow 1.5s ease-in-out infinite" }}></span>
                    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22c55e" }}></span>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#22c55e", letterSpacing: "0.04em" }}>DEPLOY SUKSES</span>
                  <span style={{ marginLeft: "auto", fontSize: "8px", color: "rgba(148,163,184,0.5)", background: "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.06)" }}>baru saja</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(34,197,94,0.06)", borderRadius: "8px", padding: "6px 8px", marginBottom: "7px", border: "1px solid rgba(34,197,94,0.12)" }}>
                  <CheckCircle2 style={{ width: "12px", height: "12px", color: "#22c55e", flexShrink: 0 }} />
                  <span style={{ fontSize: "9px", color: "rgba(226,232,240,0.85)", fontFamily: "monospace" }}>hijabcantik.id</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[
                    { label: "Build", value: "2.4s", color: "#a78bfa" },
                    { label: "Score", value: "98", color: "#fbbf24" },
                    { label: "CDN", value: "ON", color: "#22c55e" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "4px 2px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, color }}>{value}</div>
                      <div style={{ fontSize: "7px", color: "rgba(100,116,139,0.8)", marginTop: "1px" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Card: Tech Stack */}
              <div className="float-card-2 absolute z-30"
                style={{
                  top: "18px",
                  right: "-24px",
                  background: "rgba(15,23,42,0.95)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: "14px",
                  padding: "10px 12px",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.5)",
                  backdropFilter: "blur(12px)",
                }}>
                <div style={{ fontSize: "8px", color: "rgba(148,163,184,0.6)", marginBottom: "6px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Tech Stack</div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[
                    { label: "Next.js", color: "#f1f5f9" },
                    { label: "Prisma", color: "#a78bfa" },
                    { label: "Tailwind", color: "#38bdf8" },
                  ].map(({ label, color }) => (
                    <div key={label} style={{ padding: "3px 7px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "8px", fontWeight: 600, color }}>{label}</div>
                  ))}
                </div>
              </div>

              {/* Floating Card: Speed */}
              <div className="float-card-3 absolute z-30"
                style={{
                  top: "60px",
                  left: "-28px",
                  background: "rgba(15,23,42,0.95)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  borderRadius: "14px",
                  padding: "10px 14px",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.5)",
                  backdropFilter: "blur(12px)",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap style={{ width: "14px", height: "14px", color: "#f59e0b" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#fbbf24", lineHeight: 1 }}>0.82ms</div>
                    <div style={{ fontSize: "8px", color: "rgba(148,163,184,0.6)", marginTop: "2px" }}>Response time</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Layanan Kami</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Solusi Web Development Terintegrasi</h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Kami menawarkan solusi pembuatan website komprehensif mulai dari rancangan visual, integrasi basis data, hingga optimasi performa berkelanjutan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 rounded-3xl p-6 transition-all group duration-300">
              <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <Monitor className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Website Company Profile</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Representasikan identitas dan kredibilitas bisnis Anda dengan website profil profesional, bersih, dan informatif.
              </p>
              <a href="#contact" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300">
                Pelajari Lebih Lanjut
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Service 2 */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 rounded-3xl p-6 transition-all group duration-300">
              <div className="p-4 bg-violet-500/10 text-violet-400 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Toko Online / E-Commerce</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Tingkatkan penjualan dengan toko online mandiri yang dilengkapi katalog dinamis, keranjang belanja, dan sistem checkout pembayaran otomatis.
              </p>
              <a href="#contact" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300">
                Pelajari Lebih Lanjut
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Service 3 */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 rounded-3xl p-6 transition-all group duration-300">
              <div className="p-4 bg-fuchsia-500/10 text-fuchsia-400 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Landing Page Promosi</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Konversikan traffic kampanye iklan Anda menjadi leads pelanggan dengan landing page satu halaman yang berfokus penuh pada konversi.
              </p>
              <a href="#contact" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300">
                Pelajari Lebih Lanjut
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Service 4 */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 rounded-3xl p-6 transition-all group duration-300">
              <div className="p-4 bg-sky-500/10 text-sky-400 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Web Application Kustom</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Rancang dan kembangkan web internal kompleks, sistem portal reservasi, hingga dashboard data terintegrasi yang disesuaikan kebutuhan internal.
              </p>
              <a href="#contact" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300">
                Pelajari Lebih Lanjut
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Service 5 */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 rounded-3xl p-6 transition-all group duration-300">
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Optimasi SEO & Analytics</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Dapatkan visibilitas pencarian Google secara maksimal dengan penataan konten berbasis keyword, optimasi performa skor Core Web Vitals.
              </p>
              <a href="#contact" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300">
                Pelajari Lebih Lanjut
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Service 6 */}
            <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 rounded-3xl p-6 transition-all group duration-300">
              <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Pemeliharaan & Maintenance</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Fokuslah pada bisnis utama Anda, sementara tim kami merawat hosting, memperbarui domain, memperbaiki bug, dan mem-backup database web secara periodik.
              </p>
              <a href="#contact" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300">
                Pelajari Lebih Lanjut
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO SECTION */}
      <section id="portfolio" className="py-24 bg-slate-900/20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="text-left max-w-xl space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Portofolio Kami</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Hasil Karya Terbaik</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Kami bangga telah berkolaborasi dengan bisnis lokal maupun korporasi dalam meluncurkan solusi web yang menghasilkan dampak nyata.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 text-sm bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shrink-0 self-start md:self-end">
              {["All", "Company Profile", "E-Commerce", "Landing Page"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPortfolioTab(tab)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    portfolioTab === tab 
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/10" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPortfolios.map((project) => (
              <div 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden shadow-lg hover:border-slate-800 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 gap-3 duration-300">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full self-start">
                      {project.category}
                    </span>
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      {project.title}
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex gap-2 flex-wrap pt-2">
                      {project.stack.slice(0, 3).map((st) => (
                        <span key={st} className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between border-t border-slate-900">
                  <div>
                    <h5 className="font-bold text-white">{project.title}</h5>
                    <p className="text-xs text-slate-500">{project.category}</p>
                  </div>
                  <span className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              ></motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
              >
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{selectedProject.category}</span>
                    <h3 className="text-2xl font-extrabold text-white mt-1">{selectedProject.title}</h3>
                  </div>

                  {renderProjectMockups(selectedProject)}

                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">Tentang Proyek</h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{selectedProject.description}</p>
                  </div>


                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">Teknologi yang Digunakan</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProject.stack.map((st: string) => (
                        <span key={st} className="text-xs font-mono text-slate-300 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedProject.testimonial && (
                    <div className="p-5 bg-gradient-to-r from-slate-950 to-indigo-950/20 border border-slate-800 rounded-2xl relative">
                      <span className="absolute -top-3 left-4 text-3xl font-serif text-indigo-500/40 select-none">“</span>
                      <p className="text-xs sm:text-sm italic text-slate-300 leading-relaxed mb-3 pl-2">
                        {selectedProject.testimonial}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-2">
                        — Pemilik Bisnis, {selectedProject.title}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 5. PRICING PACKAGES */}
      <section id="pricing" className="py-24 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Pilihan Paket</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Investasi Website Sesuai Kebutuhan</h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Pilih paket pengerjaan transparan tanpa biaya tersembunyi. Mulai buat sekarang atau hubungi kami untuk kustomisasi khusus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg) => {
              const isRecommended = pkg.name === "Professional";
              return (
                <div 
                  key={pkg.id}
                  className={`bg-slate-900/40 border rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 hover:scale-[1.02] ${
                    isRecommended 
                      ? "border-indigo-500 bg-slate-900/60 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/30" 
                      : "border-slate-900 hover:border-slate-800"
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow">
                      Rekomendasi Utama
                    </span>
                  )}

                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{pkg.name}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6 h-12">
                      {pkg.description}
                    </p>
                    
                    <div className="mb-6">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white">
                        Rp {(pkg.price / 1000000).toFixed(1)}jt
                      </span>
                      {pkg.name === "Enterprise" && <span className="text-slate-400 text-xs font-semibold ml-1">+</span>}
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Estimasi {pkg.deliveryTime} Hari Kerja</p>
                    </div>

                    <div className="border-t border-slate-900 pt-6 space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                            isRecommended ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"
                          }`}>
                            <Check className="w-3 h-3" />
                          </span>
                          <span className="text-xs sm:text-sm text-slate-300 leading-normal">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link 
                    href={`/order?package=${pkg.id}`}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-center tracking-wide flex items-center justify-center gap-2 group mt-8 transition-all ${
                      isRecommended 
                        ? "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow shadow-indigo-500/20" 
                        : "bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-200 hover:text-white"
                    }`}
                  >
                    Pilih Paket
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Custom Package CTA */}
          <div className="text-center mt-12 text-slate-400 text-sm">
            Butuh fitur khusus yang berbeda?{" "}
            <a href="#contact" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
              Konsultasikan proyek kustom Anda sekarang
            </a>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-slate-900/20 border-t border-slate-900 relative">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">Testimonial</h2>
            <h3 className="text-3xl font-extrabold text-white mb-12">Apa Kata Klien Kami</h3>

            <div className="relative min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Quotes Icon */}
                  <span className="text-5xl font-serif text-indigo-500/20 leading-none select-none">“</span>
                  
                  <p className="text-base sm:text-lg italic text-slate-200 leading-relaxed font-light px-4">
                    {testimonials[testimonialIndex].quote}
                  </p>

                  <div className="flex justify-center items-center gap-1 text-amber-400">
                    {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <div className="flex flex-col items-center pt-4">
                    <img 
                      src={testimonials[testimonialIndex].avatar} 
                      alt={testimonials[testimonialIndex].name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-800 bg-slate-950 mb-2 shadow" 
                    />
                    <h5 className="font-bold text-white text-sm">{testimonials[testimonialIndex].name}</h5>
                    <p className="text-xs text-slate-500">{testimonials[testimonialIndex].company}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    testimonialIndex === idx ? "bg-indigo-500 w-6" : "bg-slate-800 hover:bg-slate-700"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. PROCESS TIMELINE */}
      <section id="timeline" className="py-24 border-t border-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Cara Kerja</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Alur Pengerjaan Sistematis</h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Kami merancang alur pengerjaan yang transparan dan kolaboratif agar hasil website sesuai dengan ekspektasi bisnis Anda.
            </p>
          </div>

          {/* Stepper container */}
          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 pt-6">
            
            {/* Step 1 */}
            <div className="space-y-4 relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl font-bold text-lg">
                1
              </div>
              <h4 className="text-base font-bold text-white pt-2">1. Konsultasi & Brief</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Diskusi awal mendetail terkait target pasar, preferensi visual, sitemap utama, dan penawaran anggaran proyek.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-2xl font-bold text-lg">
                2
              </div>
              <h4 className="text-base font-bold text-white pt-2">2. Desain UI/UX</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Penyusunan kerangka layout (wireframing) dan mockup visual warna lengkap agar Anda bisa melihat prototipe sebelum coding.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 rounded-2xl font-bold text-lg">
                3
              </div>
              <h4 className="text-base font-bold text-white pt-2">3. Coding / Dev</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Proses coding backend dan frontend menggunakan framework Next.js 16 untuk menjamin kecepatan render website optimal.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-2xl font-bold text-lg">
                4
              </div>
              <h4 className="text-base font-bold text-white pt-2">4. Uji Coba & SEO</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Pengujian fungsional tombol di berbagai gadget, audit kecepatan, serta penyambungan sitemap awal ke pencarian Google.
              </p>
            </div>

            {/* Step 5 */}
            <div className="space-y-4 relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl font-bold text-lg">
                5
              </div>
              <h4 className="text-base font-bold text-white pt-2">5. Rilis & Support</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Website dideploy di cloud hosting, domain disambungkan, serta penyerahan panduan pengelolaan CMS untuk Anda.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-24 bg-slate-900/20 border-t border-slate-900 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Tanya Jawab</h2>
            <h3 className="text-3xl font-extrabold text-white">Pertanyaan yang Sering Diajukan</h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Temukan jawaban atas pertanyaan umum seputar durasi pengerjaan, revisi, optimalisasi SEO, dan sistem pembayaran kami.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-bold text-slate-200 text-sm sm:text-base flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                      {faq.q}
                    </span>
                    <span className="p-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg shrink-0 ml-4">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-900/60 pl-14">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CONTACT / CTA SECTION */}
      <section id="contact" className="py-24 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Hubungi Kami</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Mari Mulai Diskusikan Proyek Website Anda</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Isi formulir kontak, dan manajer proyek kami akan menghubungi Anda dalam waktu kurang dari 24 jam untuk menjadwalkan konsultasi video call gratis.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Hubungi Telepon</h4>
                  <p className="text-sm text-slate-400 mt-0.5">+62 895 0111 3573</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Kirim Email</h4>
                  <p className="text-sm text-slate-400 mt-0.5">halo@webcraft.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Kantor Utama</h4>
                  <p className="text-sm text-slate-400 mt-0.5">Sudirman Central Business District, Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/60 backdrop-blur border border-slate-900 rounded-3xl p-8 shadow-xl">
              {contactSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Pesan Terkirim!</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Terima kasih telah menghubungi WebCraft. Pesan Anda sudah kami terima dan tim sales kami akan segera menghubungi Anda kembali.
                  </p>
                  <button
                    onClick={() => setContactSuccess(false)}
                    className="mt-6 px-6 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-sm"
                  >
                    Kirim Pesan Baru
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  {contactError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-2xl">
                      {contactError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Alamat Email</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Nomor Telepon</label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="081234567890"
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Pilih Layanan</label>
                      <select
                        value={contactService}
                        onChange={(e) => setContactService(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-300 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Website Company Profile">Website Company Profile</option>
                        <option value="E-Commerce">E-Commerce / Toko Online</option>
                        <option value="Landing Page">Landing Page Promosi</option>
                        <option value="Custom Web Application">Web Application Kustom</option>
                        <option value="SEO & Analytics">Optimasi SEO & Analytics</option>
                        <option value="Maintenance">Pemeliharaan & Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Detail Pesan / Deskripsi Proyek</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Jelaskan secara singkat kebutuhan website, perkiraan halaman, dan target peluncuran proyek Anda..."
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-900 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-indigo-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group transition-all disabled:opacity-50"
                  >
                    {contactLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        Kirim Pesan
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 10. NEWS / RECENT BLOG POSTS */}
      {blogs.length > 0 && (
        <section className="py-24 bg-slate-900/20 border-t border-slate-900 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Blog WebCraft</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Artikel & Wawasan Terbaru</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Pelajari strategi pengembangan digital, tips desain visual, serta tren coding untuk mempercepat perkembangan platform Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article 
                  key={blog.id}
                  className="bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-3xl overflow-hidden shadow transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {blog.coverImage && (
                      <img 
                        src={blog.coverImage} 
                        alt={blog.title} 
                        className="w-full aspect-[16/10] object-cover bg-slate-950"
                      />
                    )}
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{blog.publishedAt}</span>
                      <h4 className="text-base font-bold text-white line-clamp-2 hover:text-indigo-400 transition-colors">
                        <Link href="#">{blog.title}</Link>
                      </h4>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                        {blog.content}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-2">
                    <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300">
                      Baca Selengkapnya
                      <ArrowRight className="w-4.5 h-4.5 w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 px-6 py-16 relative mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
              <span className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl">
                <Activity className="w-5 h-5 text-white" />
              </span>
              Web<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Craft</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              WebCraft adalah agensi digital modern yang berdedikasi menciptakan website premium dan aplikasi kustom dengan kecepatan performa optimal untuk akselerasi bisnis Indonesia.
            </p>
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} WebCraft. Hak Cipta Dilindungi.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Tautan Cepat</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#services" className="hover:text-white transition-colors">Layanan Agensi</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Portofolio Karya</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Paket & Harga</a></li>
              <li><a href="#timeline" className="hover:text-white transition-colors">Alur Kerja Stepper</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Pertanyaan Umum</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Legalitas</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Ketentuan Lisensi</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Bantuan Support</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Newsletter</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Langganan artikel mingguan untuk tips performa web, optimasi SEO, dan tren teknologi modern.
            </p>
            
            {newsletterSuccess ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4" />
                Langganan Berhasil!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email Anda"
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200 placeholder-slate-600 flex-1 min-w-0"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all shrink-0 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </footer>

      {/* FLOATING CHATBOT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Chat Window */}
        {chatOpen && (
          <div
            style={{
              width: "400px",
              maxWidth: "calc(100vw - 32px)",
              height: "540px",
              maxHeight: "calc(100vh - 120px)",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "24px",
              boxShadow: "0 32px 64px rgba(15,23,42,0.18), 0 0 0 1px rgba(99,102,241,0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "chatSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <style>{`
              @keyframes chatSlideUp {
                from { opacity:0; transform: translateY(20px) scale(0.95); }
                to { opacity:1; transform: translateY(0) scale(1); }
              }
              @keyframes botTyping {
                0%,80%,100%{transform:scale(0.6);opacity:0.4}
                40%{transform:scale(1);opacity:1}
              }
              .typing-dot { animation: botTyping 1.2s infinite ease-in-out; }
              .typing-dot:nth-child(2) { animation-delay:0.2s; }
              .typing-dot:nth-child(3) { animation-delay:0.4s; }
            `}</style>

            {/* Header */}
            <div style={{ padding: "16px 18px", background: "linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🤖</div>
                <span style={{ position: "absolute", bottom: 0, right: 0, width: "11px", height: "11px", background: "#22c55e", borderRadius: "50%", border: "2px solid #ffffff" }}></span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>WebCraft AI</div>
                <div style={{ fontSize: "10px", color: "#16a34a", fontWeight: 600 }}>● Online sekarang</div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <a href={waOrderUrl} target="_blank" rel="noopener noreferrer"
                  style={{ padding: "5px 10px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "8px", fontSize: "10px", fontWeight: 700, color: "#16a34a", textDecoration: "none", whiteSpace: "nowrap" }}
                >WhatsApp →</a>
                <button onClick={() => setChatOpen(false)}
                  style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#ffffff", border: "1px solid #e2e8f0", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                >✕</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px",
              scrollbarWidth: "thin", scrollbarColor: "rgba(99,102,241,0.2) transparent" }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: "8px", alignItems: "flex-end" }}>
                  {msg.role === "bot" && (
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>🤖</div>
                  )}
                  <div style={{ maxWidth: "75%" }}>
                    <div style={{
                      padding: "10px 13px",
                      borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: msg.role === "user" ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#f1f5f9",
                      border: msg.role === "user" ? "none" : "1px solid #e2e8f0",
                      fontSize: "12px",
                      lineHeight: 1.6,
                      color: msg.role === "user" ? "#ffffff" : "#1e293b",
                    }} dangerouslySetInnerHTML={{ __html: formatBotText(msg.text) }} />
                    <div style={{ fontSize: "9px", color: "#94a3b8", marginTop: "3px", textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🤖</div>
                  <div style={{ padding: "12px 14px", borderRadius: "18px 18px 18px 4px", background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0,1,2].map(n => <span key={n} className="typing-dot" style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#4f46e5" }}></span>)}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick chips */}
            {chatMessages.length <= 2 && (
              <div style={{ padding: "0 14px 10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {quickChips.map(chip => (
                  <button key={chip} onClick={() => sendChatMessage(chip)}
                    style={{ padding: "5px 10px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "99px", fontSize: "10px", fontWeight: 600, color: "#4f46e5", cursor: "pointer", whiteSpace: "nowrap" }}
                  >{chip}</button>
                ))}
              </div>
            )}

            {/* WhatsApp CTA Banner */}
            <div style={{ margin: "0 14px 10px", padding: "10px 14px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "18px" }}>💬</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>Siap lanjut ke pemesanan?</div>
                <div style={{ fontSize: "9px", color: "#64748b" }}>Chat langsung dengan tim kami</div>
              </div>
              <a href={waOrderUrl} target="_blank" rel="noopener noreferrer"
                style={{ padding: "7px 12px", background: "linear-gradient(135deg,#22c55e,#16a34a)", borderRadius: "10px", fontSize: "10px", fontWeight: 700, color: "#ffffff", textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(34,197,94,0.2)" }}
              >Pesan via WA</a>
            </div>

            {/* Input Area */}
            <div style={{ padding: "12px 14px 14px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChatMessage(chatInput)}
                placeholder="Ketik pertanyaan Anda..."
                style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "10px 14px", fontSize: "12px", color: "#0f172a", outline: "none", resize: "none" }}
              />
              <button
                onClick={() => sendChatMessage(chatInput)}
                disabled={!chatInput.trim() || chatLoading}
                style={{ width: "40px", height: "40px", borderRadius: "12px", background: chatInput.trim() ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#f1f5f9", border: "none", color: chatInput.trim() ? "#ffffff" : "#cbd5e1", cursor: chatInput.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", boxShadow: chatInput.trim() ? "0 4px 12px rgba(79,70,229,0.3)" : "none" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setChatOpen(o => !o)}
          style={{
            height: "56px", borderRadius: "28px",
            padding: "0 20px",
            background: chatOpen ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#22c55e,#16a34a)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            boxShadow: chatOpen ? "0 8px 24px rgba(99,102,241,0.5)" : "0 8px 24px rgba(34,197,94,0.4)",
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            transform: chatOpen ? "rotate(0deg)" : "rotate(0deg)",
            animation: chatOpen ? "none" : "bounce 2s infinite",
          }}
          title={chatOpen ? "Tutup chat" : "Chat dengan kami"}
        >
          {chatOpen ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap" }}>Tutup</span>
            </>
          ) : (
            <>
              <svg className="w-5.5 h-5.5" fill="white" viewBox="0 0 24 24" style={{ flexShrink: 0, width: "22px", height: "22px" }}>
                <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.473 1.332 4.978L2 22l5.244-1.373a9.92 9.92 0 0 0 4.768 1.218h.004c5.506 0 9.988-4.482 9.988-9.988 0-2.66-1.036-5.159-2.92-7.046C17.172 3.036 14.672 2 12.012 2z"/>
              </svg>
              <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap" }}>AI Assistant</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
