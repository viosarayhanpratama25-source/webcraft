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
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["PENDING", "IN_PROGRESS", "REVIEW", "REVISION", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const project = await db.project.update({
      where: { id },
      data: { status }
    });

    revalidateTag(`dashboard-user-${project.userId}`, "max");
    revalidateTag(`projects-user-${project.userId}`, "max");
    revalidateTag(`project-detail-${id}`, "max");

    return NextResponse.json({ message: "Status updated successfully", project });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
