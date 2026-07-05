import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const { id: projectId } = await params;
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    // Verify project belongs to user (unless they are ADMIN or STAFF)
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      const project = await db.project.findFirst({
        where: { id: projectId, userId: user.id }
      });
      if (!project) {
        return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
      }
    }

    const newMessage = await db.projectMessage.create({
      data: {
        projectId,
        senderId: user.id,
        message,
      },
      include: {
        sender: {
          select: { name: true, role: true, avatar: true }
        }
      }
    });

    // Find the project owner's ID to revalidate their dashboard
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { userId: true }
    });
    if (project) {
      revalidateTag(`dashboard-user-${project.userId}`, "max");
    }
    revalidateTag(`project-detail-${projectId}`, "max");

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    console.error("Post message error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
