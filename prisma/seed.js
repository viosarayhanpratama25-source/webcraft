const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from project root .env
dotenv.config({ path: path.join(__dirname, "../.env") });

const dbUrl = process.env.DATABASE_URL || "";
let prisma;

if (dbUrl.startsWith("file:") || dbUrl.includes(".db") || !dbUrl) {
  try {
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3({ url: dbUrl || "file:dev.db" });
    prisma = new PrismaClient({ adapter });
  } catch (e) {
    console.warn("Failing back to standard PrismaClient:", e);
    prisma = new PrismaClient();
  }
} else {
  // PostgreSQL configuration using Prisma 7 Pg adapter
  try {
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } catch (e) {
    console.error("Failed to load PostgreSQL adapter:", e);
    prisma = new PrismaClient();
  }
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.contactSubmission.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.projectMessage.deleteMany({});
  await prisma.projectFile.deleteMany({});
  await prisma.projectMilestone.deleteMany({});
  await prisma.projectOrder.deleteMany({});
  await prisma.projectPackage.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed project packages
  const packages = [
    {
      name: "Starter",
      description: "Cocok untuk portofolio, landing page sederhana, atau CV online.",
      price: 1500000,
      features: JSON.stringify([
        "1 Halaman (Landing Page)",
        "Desain Responsive (Mobile & Desktop)",
        "Basic SEO Optimization",
        "Pengerjaan 7 Hari",
        "Gratis Domain & Hosting 1 Tahun",
        "Free Support & Maintenance 6 Bulan"
      ]),
      deliveryTime: 7,
    },
    {
      name: "Professional",
      description: "Solusi terbaik untuk bisnis UKM, profile perusahaan, atau blog dinamis.",
      price: 5000000,
      features: JSON.stringify([
        "Hingga 5 Halaman Utama",
        "Integrasi CMS (Mudah Edit Konten)",
        "Advanced SEO & Analytics Setup",
        "Form Kontak & Integrasi WhatsApp",
        "Pengerjaan 14 Hari",
        "Gratis Domain & Hosting Premium 1 Tahun",
        "Priority Support & Maintenance 6 Bulan"
      ]),
      deliveryTime: 14,
    },
    {
      name: "Enterprise",
      description: "Untuk sistem e-commerce kustom, aplikasi web kompleks, atau integrasi API.",
      price: 10000000,
      features: JSON.stringify([
        "Halaman Tidak Terbatas (Kustom)",
        "Fullstack Web App / E-Commerce",
        "Integrasi API & Sistem Pembayaran",
        "Keamanan Tingkat Tinggi",
        "Pengerjaan 30+ Hari",
        "Cloud Hosting Setup (AWS / Vercel)",
        "Dedicated Support & Maintenance 6 Bulan"
      ]),
      deliveryTime: 30,
    },
  ];

  const createdPackages = [];
  for (const pkg of packages) {
    const created = await prisma.projectPackage.create({ data: pkg });
    createdPackages.push(created);
    console.log(`Created package: ${created.name}`);
  }

  // Seed users with roles
  const salt = await bcrypt.genSalt(12);
  const adminPassword = await bcrypt.hash("admin123", salt);
  const clientPassword = await bcrypt.hash("client123", salt);
  const staffPassword = await bcrypt.hash("staff123", salt);

  const adminUser = await prisma.user.create({
    data: {
      name: "Super Admin WebCraft",
      email: "admin@webcraft.com",
      password: adminPassword,
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      phone: "081234567890",
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      name: "Rian Wijaya",
      email: "client@webcraft.com",
      password: clientPassword,
      role: "CLIENT",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      phone: "089876543210",
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      name: "Siti Rahma",
      email: "staff@webcraft.com",
      password: staffPassword,
      role: "STAFF",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      phone: "082345678901",
    },
  });

  console.log("Users seeded successfully!");

  // Create an initial sample project for Rian Wijaya (Client)
  const project = await prisma.project.create({
    data: {
      userId: clientUser.id,
      title: "E-Commerce Hijab Cantik",
      description: "Pembuatan website e-commerce dengan katalog produk hijab, keranjang belanja, dan integrasi pembayaran lokal.",
      type: "E-Commerce",
      status: "IN_PROGRESS",
      budget: 5000000,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    },
  });

  // Create sample project order
  const order = await prisma.projectOrder.create({
    data: {
      projectId: project.id,
      packageId: createdPackages[1].id, // Professional package
      totalPrice: 5000000,
      paymentStatus: "PAID",
      paymentMethod: "Credit Card",
      invoiceUrl: "/invoices/INV-2026-001.pdf",
    },
  });

  // Create Invoice
  await prisma.invoice.create({
    data: {
      orderId: order.id,
      invoiceNumber: "INV-2026-001",
      amount: 5000000,
      dueDate: new Date(),
      status: "PAID",
      pdfUrl: "/invoices/INV-2026-001.pdf",
    },
  });

  // Create milestones
  const milestones = [
    { title: "Konsultasi & Wireframing", description: "Diskusi kebutuhan detail dan persetujuan layout awal.", status: "DONE", dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { title: "Desain UI/UX Halaman Utama", description: "Penyusunan mockup visual halaman depan, detail, dan checkout.", status: "DONE", dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { title: "Front-end & CMS Integration", description: "Coding antarmuka Next.js dan penyambungan database.", status: "IN_PROGRESS", dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) },
    { title: "Integrasi Payment Gateway", description: "Penyambungan Midtrans API dan testing transaksi.", status: "TODO", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { title: "Launch & Go Live", description: "Setup domain klien dan deploy ke cloud hosting.", status: "TODO", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
  ];

  for (const ms of milestones) {
    await prisma.projectMilestone.create({
      data: {
        projectId: project.id,
        ...ms,
      },
    });
  }

  // Create files
  await prisma.projectFile.create({
    data: {
      projectId: project.id,
      fileName: "logo-hijab-cantik-vector.png",
      fileUrl: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=150",
      uploadedBy: clientUser.id,
    },
  });

  await prisma.projectFile.create({
    data: {
      projectId: project.id,
      fileName: "brief-kebutuhan-fitur.pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedBy: clientUser.id,
    },
  });

  // Create chat messages
  await prisma.projectMessage.create({
    data: {
      projectId: project.id,
      senderId: clientUser.id,
      message: "Halo tim WebCraft, logo dan brief detail sudah saya upload ya. Apakah bisa mulai diproses?",
    },
  });

  await prisma.projectMessage.create({
    data: {
      projectId: project.id,
      senderId: staffUser.id,
      message: "Halo Pak Rian! Terima kasih. Logo dan brief sudah kami terima. Kami akan segera memulai tahap wireframing hari ini. Update berkala akan kami infokan melalui tab Milestones di sini.",
    },
  });

  // Create Testimonial (Published)
  await prisma.testimonial.create({
    data: {
      userId: clientUser.id,
      projectId: project.id,
      rating: 5,
      content: "Pelayanan sangat profesional! Tim WebCraft sangat cepat tanggap dan hasil pengerjaan website e-commerce kami sangat memuaskan, responsif di handphone, dan sistem pembayaran otomatis berjalan lancar.",
      isPublished: true,
    },
  });

  // Create Blog Posts
  await prisma.blogPost.create({
    data: {
      title: "5 Alasan Mengapa UKM Wajib Memiliki Website Sendiri di Tahun 2026",
      slug: "5-alasan-ukm-wajib-memiliki-website-sendiri",
      content: "Di era digital yang serba cepat ini, memiliki website bukan lagi pilihan melainkan keharusan bagi pelaku usaha kecil dan menengah (UKM). Dengan memiliki website sendiri, Anda dapat meningkatkan kredibilitas bisnis, memperluas jangkauan pasar hingga ke pelosok negeri, mengontrol branding secara penuh, membuka toko 24 jam tanpa biaya tambahan, dan melakukan analisis perilaku pengunjung secara tepat melalui Google Analytics atau Pixel Facebook.",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      authorId: adminUser.id,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Mengenal Next.js App Router untuk Pembuatan Website Modern dan Cepat",
      slug: "mengenal-nextjs-app-router-untuk-website-modern",
      content: "Next.js telah menjadi standar industri dalam pengembangan frontend berbasis React. Dengan dirilisnya App Router, Next.js membawa inovasi besar seperti React Server Components (RSC) yang mereduksi ukuran bundle JavaScript di sisi klien, optimasi loading gambar, static routing yang fleksibel, server actions untuk interaksi database langsung tanpa API endpoints tambahan, dan performa pemuatan yang luar biasa. Pelajari bagaimana WebCraft memanfaatkan teknologi ini untuk membangun website terbaik untuk Anda.",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
      authorId: adminUser.id,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  // Seed Contact Submissions
  await prisma.contactSubmission.create({
    data: {
      name: "Budi Santoso",
      email: "budi@gmail.com",
      phone: "08111222333",
      message: "Halo, saya tertarik untuk membuat website profile sekolah. Berapa biaya estimasi jika kami butuh fitur galeri foto, database guru, dan pengumuman?",
      serviceType: "Website Company Profile",
      status: "NEW",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
