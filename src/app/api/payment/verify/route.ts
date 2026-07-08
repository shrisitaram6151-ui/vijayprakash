import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCashfreeOrder } from "@/lib/cashfree";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");
  if (!orderId) {
    return Response.json({ ok: false, error: "order_id required" }, { status: 400 });
  }

  try {
    const order = await getCashfreeOrder(orderId);
    const paid = order.order_status === "PAID";

    const newStatus = paid ? "paid" : order.order_status === "ACTIVE" ? "pending" : "failed";
    await db
      .update(bookings)
      .set({
        paymentStatus: newStatus,
        bookingStatus: paid ? "confirmed" : "new",
      })
      .where(eq(bookings.orderId, orderId));

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.orderId, orderId));

    return Response.json({
      ok: true,
      paid,
      status: order.order_status,
      booking: booking ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "verify failed";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
