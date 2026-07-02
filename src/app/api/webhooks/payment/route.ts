import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId, paymentMethod, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const order = await db.projectOrder.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order payment status
    await db.projectOrder.update({
      where: { id: orderId },
      data: {
        paymentStatus: status, // PAID or UNPAID
        paymentMethod: paymentMethod || "Bank Transfer",
      }
    });

    // Update invoices linked to this order
    await db.invoice.updateMany({
      where: { orderId },
      data: { status }
    });

    // Also update project status to IN_PROGRESS if PAID
    if (status === "PAID") {
      await db.project.update({
        where: { id: order.projectId },
        data: { status: "IN_PROGRESS" }
      });
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("Webhook payment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
