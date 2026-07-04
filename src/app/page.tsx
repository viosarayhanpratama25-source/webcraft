import React from "react";
import { db } from "@/lib/prisma";
import LandingPage from "@/components/LandingPage";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  // Fetch packages with fallback to mock data in case DB is offline/unreachable during Vercel build
  let packagesData = [];
  try {
    const packages = await db.projectPackage.findMany();
    packagesData = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      features: JSON.parse(pkg.features),
      deliveryTime: pkg.deliveryTime
    }));
  } catch (err) {
    console.warn("Failed to fetch packages from DB, using fallback mock packages:", err);
    packagesData = [
      {
        id: "pkg-starter",
        name: "Starter",
        description: "Cocok untuk portofolio, landing page sederhana, atau CV online.",
        price: 1500000,
        features: [
          "1 Halaman (Landing Page)",
          "Desain Responsive (Mobile & Desktop)",
          "Basic SEO Optimization",
          "Pengerjaan 7 Hari",
          "Gratis Domain & Hosting 1 Tahun",
          "Free Support & Maintenance 6 Bulan"
        ],
        deliveryTime: 7,
      },
      {
        id: "pkg-professional",
        name: "Professional",
        description: "Solusi terbaik untuk bisnis UKM, profile perusahaan, atau blog dinamis.",
        price: 5000000,
        features: [
          "Hingga 5 Halaman Utama",
          "Integrasi CMS (Mudah Edit Konten)",
          "Advanced SEO & Analytics Setup",
          "Form Kontak & Integrasi WhatsApp",
          "Pengerjaan 14 Hari",
          "Gratis Domain & Hosting Premium 1 Tahun",
          "Priority Support & Maintenance 6 Bulan"
        ],
        deliveryTime: 14,
      },
      {
        id: "pkg-enterprise",
        name: "Enterprise",
        description: "Untuk sistem e-commerce kustom, aplikasi web kompleks, atau integrasi API.",
        price: 10000000,
        features: [
          "Halaman Tidak Terbatas (Kustom)",
          "Fullstack Web App / E-Commerce",
          "Integrasi API & Sistem Pembayaran",
          "Keamanan Tingkat Tinggi",
          "Pengerjaan 30+ Hari",
          "Cloud Hosting Setup (AWS / Vercel)",
          "Dedicated Support & Maintenance 6 Bulan"
        ],
        deliveryTime: 30,
      }
    ];
  }
  
  /* 
  // Testimonial query is disabled for performance optimization (currently inactive in UI)
  const testimonials = await db.testimonial.findMany({
    where: { isPublished: true },
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
        }
      },
      project: {
        select: {
          title: true,
          type: true,
        }
      }
    }
  });

  const testimonialsData = testimonials.map(t => ({
    id: t.id,
    name: t.user.name,
    avatar: t.user.avatar || "/placeholder-avatar.png",
    company: t.project.title,
    rating: t.rating,
    quote: t.content
  }));
  */
  const testimonialsData: any[] = [];

  // Fetch external developer articles via public Dev.to API (100% legal, officially supported)
  // Queries "indonesia" topic to get relevant developer articles in Indonesian language.
  // Falls back to local database articles in case of offline development or API failure.
  let blogsData = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout limit

    const res = await fetch("https://dev.to/api/articles?tag=indonesia&per_page=3", {
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: controller.signal,
      headers: {
        "User-Agent": "cleavCraft-App/1.0"
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Failed to load dev.to articles");
    
    const devToArticles = await res.json();
    blogsData = devToArticles.map((b: any) => ({
      id: b.id.toString(),
      title: b.title,
      slug: b.slug,
      content: b.description || "",
      coverImage: b.cover_image || b.social_image || "/placeholder-blog.png",
      publishedAt: b.published_at ? new Date(b.published_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }) : "",
      url: b.url
    }));
  } catch (err) {
    console.warn("Dev.to API offline or failed, using local database fallback:", err);
    try {
      const blogs = await db.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3
      });
      blogsData = blogs.map(b => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        content: b.content,
        coverImage: b.coverImage,
        publishedAt: b.publishedAt ? b.publishedAt.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }) : "",
        url: ""
      }));
    } catch (dbErr) {
      console.warn("Database also unreachable for blog posts, using fallback mock blogs:", dbErr);
      blogsData = [
        {
          id: "mock-blog-1",
          title: "5 Alasan Mengapa UKM Wajib Memiliki Website Sendiri di Tahun 2026",
          slug: "5-alasan-ukm-wajib-memiliki-website-sendiri",
          content: "Di era digital yang serba cepat ini, memiliki website bukan lagi pilihan melainkan keharusan bagi pelaku usaha kecil dan menengah (UKM). Dengan memiliki website sendiri, Anda dapat meningkatkan kredibilitas bisnis, memperluas jangkauan pasar hingga ke pelosok negeri, dan mengontrol branding secara penuh.",
          coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
          publishedAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }),
          url: ""
        },
        {
          id: "mock-blog-2",
          title: "Mengenal Next.js App Router untuk Pembuatan Website Modern dan Cepat",
          slug: "mengenal-nextjs-app-router-untuk-website-modern",
          content: "Next.js telah menjadi standar industri dalam pengembangan frontend berbasis React. Dengan dirilisnya App Router, Next.js membawa inovasi besar seperti React Server Components (RSC) yang mereduksi ukuran bundle JavaScript di sisi klien, optimasi loading gambar, static routing yang fleksibel, dan performa pemuatan yang luar biasa.",
          coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
          publishedAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }),
          url: ""
        }
      ];
    }
  }

  return (
    <LandingPage 
      packages={packagesData} 
      testimonials={[]} // Dinonaktifkan sementara, ubah kembali ke testimonialsData jika sudah ada client
      blogs={blogsData} 
    />
  );
}
