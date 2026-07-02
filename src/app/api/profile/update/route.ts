import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const body = await req.json();
    
    // Check if it's a password update or details update
    if (body.action === "UPDATE_PASSWORD") {
      const { oldPassword, newPassword } = body;
      
      if (!oldPassword || !newPassword) {
        return NextResponse.json({ error: "Semua field sandi wajib diisi" }, { status: 400 });
      }

      const dbUser = await db.user.findUnique({
        where: { id: user.id }
      });

      if (!dbUser) {
        return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
      }

      const isValid = await bcrypt.compare(oldPassword, dbUser.password);
      if (!isValid) {
        return NextResponse.json({ error: "Kata sandi lama salah" }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      await db.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword }
      });

      return NextResponse.json({ message: "Kata sandi berhasil diperbarui" });
    } else {
      // General Details Update
      const { name, phone, avatar } = body;

      if (!name) {
        return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
      }

      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          name,
          phone: phone || null,
          avatar: avatar || null,
        }
      });

      return NextResponse.json({
        message: "Profil berhasil diperbarui",
        user: {
          name: updatedUser.name,
          phone: updatedUser.phone,
          avatar: updatedUser.avatar,
        }
      });
    }
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
