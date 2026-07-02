import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ProjectDetailClient from "@/components/ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;
  const { id } = await params;

  // Query project details
  const project = await db.project.findUnique({
    where: { id },
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

  if (!project) {
    notFound();
  }

  // Ensure security: CLIENTs can only view their own projects
  if (user.role === "CLIENT" && project.userId !== user.id) {
    redirect("/dashboard/projects");
  }

  // Format data
  const projectData = {
    id: project.id,
    title: project.title,
    description: project.description,
    type: project.type,
    status: project.status,
    budget: project.budget,
    deadline: project.deadline.toISOString(),
    createdAt: project.createdAt.toISOString(),
    clientName: project.user.name,
    packageName: project.orders[0]?.package.name || "Custom",
    packageDescription: project.orders[0]?.package.description || "",
    packageFeatures: project.orders[0]?.package.features ? JSON.parse(project.orders[0].package.features) : [],
    orderId: project.orders[0]?.id || "",
    paymentStatus: project.orders[0]?.paymentStatus || "UNPAID",
    paymentMethod: project.orders[0]?.paymentMethod || "",
    invoiceUrl: project.orders[0]?.invoiceUrl || "",
    milestones: project.milestones.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      status: m.status,
      dueDate: m.dueDate.toISOString(),
    })),
    files: project.files.map(f => ({
      id: f.id,
      fileName: f.fileName,
      fileUrl: f.fileUrl,
      uploadedBy: f.uploadedBy,
      createdAt: f.createdAt.toISOString(),
    })),
    messages: project.messages.map(m => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.sender.name,
      senderRole: m.sender.role,
      senderAvatar: m.sender.avatar || "",
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    })),
    invoices: project.orders[0]?.invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      amount: inv.amount,
      dueDate: inv.dueDate.toISOString(),
      status: inv.status,
      pdfUrl: inv.pdfUrl || "",
      createdAt: inv.createdAt.toISOString(),
    })) || []
  };

  return (
    <ProjectDetailClient 
      project={projectData} 
      currentUser={user} 
    />
  );
}
