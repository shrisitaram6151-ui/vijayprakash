import { verifyPassword, setAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password || !verifyPassword(password)) {
      return Response.json(
        { ok: false, error: "गलत पासवर्ड।" },
        { status: 401 }
      );
    }
    await setAdminSession();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "त्रुटि" }, { status: 500 });
  }
}
