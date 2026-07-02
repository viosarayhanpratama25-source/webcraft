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
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["UNPAID", "PARTIAL", "PAID", "REFUNDED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const invoice = await db.invoice.update({
      where: { id },
      data: { status }
    });

    // Also update order status if PAID
    const invData = await db.invoice.findUnique({
      where: { id },
      select: { orderId: true }
    });

    if (invData?.orderId) {
      await db.projectOrder.update({
        where: { id: invData.orderId },
        data: { paymentStatus: status }
      });
    }

    return NextResponse.json({ message: "Invoice status updated successfully", invoice });
  } catch (error) {
    console.error("Update invoice error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
