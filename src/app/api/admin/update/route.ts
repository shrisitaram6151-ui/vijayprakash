import { db } from "@/db";
import { bookings, callbacks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const { type, id, bookingStatus, handled } = await req.json();
    if (type === "booking" && id) {
      await db
        .update(bookings)
        .set({ bookingStatus })
        .where(eq(bookings.id, Number(id)));
      return Response.json({ ok: true });
    }
    if (type === "callback" && id) {
      await db
        .update(callbacks)
        .set({ handled: Boolean(handled) })
        .where(eq(callbacks.id, Number(id)));
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  } catch {
    return Response.json({ ok: false, error: "error" }, { status: 500 });
  }
}
