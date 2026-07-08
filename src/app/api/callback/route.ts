import { db } from "@/db";
import { callbacks } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, phone, message } = await req.json();
    if (!name || !phone) {
      return Response.json(
        { ok: false, error: "नाम और मोबाइल नंबर आवश्यक है।" },
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
    await db.insert(callbacks).values({
      name,
      phone: cleanPhone,
      message: message || null,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "कुछ त्रुटि हुई।" }, { status: 500 });
  }
}
