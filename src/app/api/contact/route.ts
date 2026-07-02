import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, serviceType } = await req.json();

    if (!name || !email || !message || !serviceType) {
      return NextResponse.json(
        { error: "Nama, email, pesan, dan jenis layanan wajib diisi" },
        { status: 400 }
      );
    }

    const submission = await db.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        serviceType,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { message: "Pesan berhasil dikirim", submissionId: submission.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pesan Anda" },
      { status: 500 }
    );
  }
}
