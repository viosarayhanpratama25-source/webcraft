import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const body = await req.json();
    const { 
      packageId, 
      projectName, 
      websiteType, 
      description, 
      features, 
      budget, 
      deadline,
      referenceUrls
    } = body;

    if (!packageId || !projectName || !websiteType || !description || !budget || !deadline) {
      return NextResponse.json({ error: "Field wajib belum lengkap" }, { status: 400 });
    }

    // Fetch the selected package to double check pricing
    const pkg = await db.projectPackage.findUnique({
      where: { id: packageId }
    });
    if (!pkg) {
      return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 });
    }

    // 1. Create Project
    const project = await db.project.create({
      data: {
        userId: user.id,
        title: projectName,
        description: `${description}\n\nReferensi URL: ${referenceUrls?.join(", ")}`,
        type: websiteType,
        status: "PENDING",
        budget: parseFloat(budget),
        deadline: new Date(deadline),
      }
    });

    // 2. Create Project Order
    const order = await db.projectOrder.create({
      data: {
        projectId: project.id,
        packageId: pkg.id,
        totalPrice: parseFloat(budget),
        paymentStatus: "UNPAID",
      }
    });

    // 3. Create Default Milestones
    const milestones = [
      { title: "Konsultasi & Briefing Proyek", description: "Penyamaan visi detail proyek, brand board, dan layout kasar.", status: "TODO", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      { title: "UI/UX Mockup Desain", description: "Penyusunan desain mockup resolusi tinggi halaman utama.", status: "TODO", dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) },
      { title: "Coding & Integrasi Database", description: "Implementasi frontend Next.js dan backend database SQLite.", status: "TODO", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
      { title: "Testing, Uji Coba & SEO", description: "Audit fungsional, performa kecepatan core web vitals, dan indexing Google.", status: "TODO", dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) },
      { title: "Web Launch & Go Live", description: "Penghubungan domain kustom dan rilis hosting cloud.", status: "TODO", dueDate: new Date(deadline) },
    ];

    for (const ms of milestones) {
      await db.projectMilestone.create({
        data: {
          projectId: project.id,
          title: ms.title,
          description: ms.description,
          status: ms.status,
          dueDate: ms.dueDate,
        }
      });
    }

    // 4. Create Invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoice = await db.invoice.create({
      data: {
        orderId: order.id,
        invoiceNumber,
        amount: parseFloat(budget),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days payment limit
        status: "UNPAID",
      }
    });

    return NextResponse.json({
      message: "Order created successfully",
      projectId: project.id,
      orderId: order.id,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber
    }, { status: 201 });

  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
