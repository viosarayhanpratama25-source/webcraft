import { db } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getCachedPackages() {
  "use cache";
  cacheLife("days");
  cacheTag("packages");

  try {
    const packages = await db.projectPackage.findMany();
    return packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      features: JSON.parse(pkg.features),
      deliveryTime: pkg.deliveryTime
    }));
  } catch (err) {
    console.warn("Failed to fetch packages from DB, using fallback mock packages:", err);
    return [
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
}

export async function getCachedBlogs() {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout limit

    const res = await fetch("https://dev.to/api/articles?tag=indonesia&per_page=3", {
      signal: controller.signal,
      headers: {
        "User-Agent": "cleavCraft-App/1.0"
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Failed to load dev.to articles");

    const devToArticles = await res.json();
    return devToArticles.map((b: any) => ({
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
      return blogs.map(b => ({
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
      return [
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
}

export async function getDashboardData(userId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`dashboard-user-${userId}`);

  // Fetch Stats
  const activeProjectsCount = await db.project.count({
    where: {
      userId,
      status: {
        in: ["PENDING", "IN_PROGRESS", "REVIEW", "REVISION"]
      }
    }
  });

  const paidOrders = await db.projectOrder.findMany({
    where: {
      project: { userId },
      paymentStatus: "PAID"
    },
    select: { totalPrice: true }
  });
  const totalSpent = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  const pendingInvoicesCount = await db.invoice.count({
    where: {
      order: { project: { userId } },
      status: "UNPAID"
    }
  });

  // Fetch Projects
  const recentProjects = await db.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      orders: {
        include: {
          package: {
            select: { name: true }
          }
        }
      }
    }
  });

  // Fetch Recent Messages
  const recentMessages = await db.projectMessage.findMany({
    where: {
      project: { userId }
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      sender: {
        select: { name: true, role: true }
      },
      project: {
        select: { title: true }
      }
    }
  });

  // Construct a dynamic activity timeline
  const activities = [];

  // Add Project creations to activity
  const userProjects = await db.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3
  });
  for (const p of userProjects) {
    activities.push({
      type: "PROJECT_CREATE",
      title: `Proyek '${p.title}' dibuat`,
      desc: "Menunggu pembayaran awal atau kelengkapan berkas brief proyek.",
      time: p.createdAt,
    });
  }

  // Add Invoices to activity
  const userInvoices = await db.invoice.findMany({
    where: { order: { project: { userId } } },
    orderBy: { createdAt: "desc" },
    take: 3
  });
  for (const inv of userInvoices) {
    activities.push({
      type: "INVOICE",
      title: `Invoice #${inv.invoiceNumber} diterbitkan`,
      desc: `Tagihan sebesar Rp ${(inv.amount / 1000000).toFixed(1)}jt dengan status: ${inv.status}.`,
      time: inv.createdAt,
    });
  }

  // Sort activities by time desc
  activities.sort((a, b) => b.time.getTime() - a.time.getTime());
  const finalActivities = activities.slice(0, 5);

  return {
    activeProjectsCount,
    totalSpent,
    pendingInvoicesCount,
    recentProjects,
    recentMessages,
    finalActivities
  };
}

export async function getCachedInvoices(userId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`invoices-user-${userId}`);

  const invoices = await db.invoice.findMany({
    where: {
      order: {
        project: {
          userId
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      order: {
        include: {
          project: {
            select: { title: true }
          }
        }
      }
    }
  });

  return invoices.map(inv => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    amount: inv.amount,
    dueDate: inv.dueDate.toISOString(),
    status: inv.status,
    pdfUrl: inv.pdfUrl || "",
    createdAt: inv.createdAt.toISOString(),
    projectTitle: inv.order.project.title,
    paymentMethod: inv.order.paymentMethod || "Bank Transfer",
  }));
}

export async function getCachedOrders(userId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`orders-user-${userId}`);

  const orders = await db.projectOrder.findMany({
    where: {
      project: {
        userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: {
        select: { title: true }
      },
      package: {
        select: { name: true }
      }
    }
  });

  return orders.map(order => ({
    id: order.id,
    projectId: order.projectId,
    totalPrice: order.totalPrice,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    invoiceUrl: order.invoiceUrl,
    createdAt: order.createdAt.toISOString(),
    project: {
      title: order.project.title
    },
    package: {
      name: order.package.name
    }
  }));
}

export async function getCachedProjects(userId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`projects-user-${userId}`);

  const projects = await db.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        include: {
          package: true
        }
      }
    }
  });

  return projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    type: project.type,
    status: project.status,
    budget: project.budget,
    deadline: project.deadline.toISOString(),
    createdAt: project.createdAt.toISOString(),
    packageName: project.orders[0]?.package.name || "Custom",
    price: project.orders[0]?.totalPrice || project.budget,
  }));
}

export async function getCachedProjectDetail(projectId: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`project-detail-${projectId}`);

  return db.project.findUnique({
    where: { id: projectId },
    include: {
      user: {
        select: { name: true, email: true, phone: true }
      },
      milestones: {
        orderBy: { dueDate: "asc" }
      },
      files: {
        orderBy: { createdAt: "desc" }
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: { name: true, role: true, avatar: true }
          }
        }
      },
      orders: {
        include: {
          package: true,
          invoices: true,
        }
      }
    }
  });
}
