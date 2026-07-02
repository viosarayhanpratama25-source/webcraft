import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

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

    // Verify project belongs to user (unless ADMIN/STAFF)
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      const project = await db.project.findFirst({
        where: { id: projectId, userId: user.id }
      });
      if (!project) {
        return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
      }
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Save mock upload detail to database
    // In production, you would upload this file to Cloudinary / AWS S3
    const newFile = await db.projectFile.create({
      data: {
        projectId,
        fileName: file.name,
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Dummy placeholder url
        uploadedBy: user.name,
      }
    });

    return NextResponse.json(newFile, { status: 201 });
  } catch (error: any) {
    console.error("Upload file error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
