import { db } from "@/db";
import { bookings, services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createCashfreeOrder, cashfreeConfigured } from "@/lib/cashfree";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      serviceSlug,
      consultType,
      preferredDate,
      preferredTime,
      birthDate,
      birthTime,
      birthPlace,
      question,
    } = body ?? {};

    if (!name || !phone || !serviceSlug) {
      return Response.json(
        { ok: false, error: "नाम, मोबाइल नंबर और सेवा आवश्यक है।" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return Response.json(
        { ok: false, error: "कृपया सही मोबाइल नंबर दर्ज करें।" },
        { status: 400 }
      );
    }

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.slug, serviceSlug));

    if (!service) {
      return Response.json(
        { ok: false, error: "सेवा उपलब्ध नहीं है।" },
        { status: 404 }
      );
    }

    const orderId = `ASTRO_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    await db.insert(bookings).values({
      orderId,
      name,
      phone: cleanPhone,
      email: email || null,
      serviceSlug: service.slug,
      serviceTitle: service.titleHi,
      amount: service.price,
      consultType: consultType || "call",
      preferredDate: preferredDate || null,
      preferredTime: preferredTime || null,
      birthDate: birthDate || null,
      birthTime: birthTime || null,
      birthPlace: birthPlace || null,
      question: question || null,
      paymentStatus: "pending",
      bookingStatus: "new",
    });

    if (!cashfreeConfigured()) {
      return Response.json(
        {
          ok: false,
          error:
            "भुगतान गेटवे कॉन्फ़िगर नहीं है। कृपया सीधे कॉल/WhatsApp करें।",
        },
        { status: 503 }
      );
    }

    const origin = new URL(req.url).origin;
    const order = await createCashfreeOrder({
      orderId,
      amount: service.price,
      customerId: `cust_${cleanPhone}`,
      customerName: name,
      customerPhone: cleanPhone,
      customerEmail: email,
      returnUrl: `${origin}/booking/status?order_id={order_id}`,
    });

    return Response.json({
      ok: true,
      orderId,
      paymentSessionId: order.payment_session_id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "कुछ त्रुटि हुई।";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
