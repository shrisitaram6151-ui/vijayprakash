import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCashfreeOrder } from "@/lib/cashfree";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SITE, telLink, waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function StatusPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const sp = await searchParams;
  const orderId = sp.order_id;

  let paid = false;
  let status = "UNKNOWN";
  let notFound = true;

  if (orderId) {
    try {
      const order = await getCashfreeOrder(orderId);
      status = order.order_status;
      paid = status === "PAID";
      notFound = false;
      const newStatus = paid
        ? "paid"
        : status === "ACTIVE"
        ? "pending"
        : "failed";
      await db
        .update(bookings)
        .set({
          paymentStatus: newStatus,
          bookingStatus: paid ? "confirmed" : "new",
        })
        .where(eq(bookings.orderId, orderId));
    } catch {
      notFound = true;
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 py-16">
        <div className="card-dark w-full rounded-3xl p-8 text-center">
          {paid ? (
            <>
              <div className="text-6xl animate-bounce">🙏</div>
              <h1 className="mt-4 font-display text-2xl font-bold gold-text">
                भुगतान सफल!
              </h1>
              <p className="mt-3 text-sm text-amber-100/80">
                {SITE.trustName} में आपकी बुकिंग सुनिश्चित हो गई है।
              </p>
              
              <div className="mt-6 space-y-4 rounded-2xl bg-black/40 p-6 border border-amber-500/20">
                <div className="text-xs text-amber-100/50 uppercase tracking-widest">परामर्श हेतु संपर्क करें</div>
                <div className="space-y-3">
                  <a href={telLink(SITE.phone1)} className="flex items-center justify-between rounded-xl bg-amber-500/10 p-3 text-amber-100 hover:bg-amber-500/20 transition">
                    <span>📞 {SITE.phone1}</span>
                    <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded italic">Primary</span>
                  </a>
                  <a href={telLink(SITE.phone2)} className="flex items-center justify-between rounded-xl bg-amber-500/10 p-3 text-amber-100 hover:bg-amber-500/20 transition">
                    <span>📞 {SITE.phone2}</span>
                    <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded italic">Alternate</span>
                  </a>
                  <a href={waLink(`नमस्ते महाराज जी, मैंने परामर्श बुक किया है। ऑर्डर आईडी: ${orderId}`)} target="_blank" className="flex items-center justify-between rounded-xl bg-green-500/10 p-3 text-green-300 hover:bg-green-500/20 transition">
                    <span>💬 WhatsApp Support</span>
                  </a>
                </div>
              </div>

              <div className="mt-6 text-xs text-amber-100/40">
                ऑर्डर आईडी: <span className="text-amber-500/60 font-mono">{orderId}</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl">{notFound ? "❓" : "⚠️"}</div>
              <h1 className="mt-4 font-display text-2xl font-bold text-amber-200">
                {notFound ? "ऑर्डर नहीं मिला" : "भुगतान अपूर्ण"}
              </h1>
              <p className="mt-3 text-amber-100/80">
                {notFound
                  ? "कृपया दोबारा प्रयास करें।"
                  : `भुगतान की स्थिति: ${status}। यदि राशि कट गई है तो कृपया संपर्क करें।`}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/booking"
                  className="rounded-full gold-gradient px-5 py-2.5 font-semibold text-[#3a2a05]"
                >
                  पुनः प्रयास करें
                </Link>
                <a
                  href={telLink(SITE.helpline)}
                  className="rounded-full border border-amber-400/40 px-5 py-2.5 font-semibold text-amber-200"
                >
                  Helpline: {SITE.helpline}
                </a>
              </div>
            </>
          )}
          <div className="mt-8">
            <Link href="/" className="text-sm text-amber-300 underline">
              मुख्य पृष्ठ पर लौटें
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
