import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCashfreeOrder } from "@/lib/cashfree";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SITE, telLink, waLink } from "@/lib/site";
import { T } from "@/lib/lang";
import { sendWhatsAppNotification, formatBookingNotification } from "@/lib/notify";

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

      const [existing] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.orderId, orderId));
      const wasAlreadyPaid = existing?.paymentStatus === "paid";

      await db
        .update(bookings)
        .set({
          paymentStatus: newStatus,
          bookingStatus: paid ? "confirmed" : "new",
        })
        .where(eq(bookings.orderId, orderId));

      if (paid && !wasAlreadyPaid && existing) {
        sendWhatsAppNotification(
          formatBookingNotification(existing)
        ).catch(() => {});
      }
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
              <div className="text-6xl">🎉</div>
              <h1 className="mt-4 font-display text-2xl font-bold gold-text">
                <T hi="भुगतान सफल!" en="Payment Successful!" />
              </h1>
              <p className="mt-3 text-amber-100/80">
                <T
                  hi="आपकी बुकिंग सुनिश्चित हो गई है। महाराज जी जल्द ही आपके दिए गए समय पर संपर्क करेंगे।"
                  en="Your booking is confirmed. Maharaj Ji will contact you at your scheduled time soon."
                />
                <br />
                <span className="text-amber-300">{orderId}</span>
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={waLink(
                    `नमस्ते महाराज जी, मैंने परामर्श बुक किया है (Order: ${orderId})।`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#25D366] px-5 py-2.5 font-semibold text-white"
                >
                  <T hi="WhatsApp पर सूचित करें" en="Notify on WhatsApp" />
                </a>
                <a
                  href={telLink()}
                  className="rounded-full gold-gradient px-5 py-2.5 font-semibold text-[#3a2a05]"
                >
                  📞 <T hi="कॉल करें" en="Call Now" />
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl">{notFound ? "❓" : "⚠️"}</div>
              <h1 className="mt-4 font-display text-2xl font-bold text-amber-200">
                {notFound ? (
                  <T hi="ऑर्डर नहीं मिला" en="Order Not Found" />
                ) : (
                  <T hi="भुगतान अपूर्ण" en="Payment Incomplete" />
                )}
              </h1>
              <p className="mt-3 text-amber-100/80">
                {notFound ? (
                  <T hi="कृपया दोबारा प्रयास करें।" en="Please try again." />
                ) : (
                  <>
                    <T hi="भुगतान की स्थिति" en="Payment status" />:{" "}
                    <b>{status}</b>.{" "}
                    <T
                      hi="यदि राशि कट गई है तो कृपया संपर्क करें।"
                      en="If amount was deducted please contact us."
                    />
                  </>
                )}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/booking"
                  className="rounded-full gold-gradient px-5 py-2.5 font-semibold text-[#3a2a05]"
                >
                  <T hi="पुनः प्रयास करें" en="Try Again" />
                </Link>
                <a
                  href={telLink()}
                  className="rounded-full border border-amber-400/40 px-5 py-2.5 font-semibold text-amber-200"
                >
                  {SITE.phone}
                </a>
              </div>
            </>
          )}
          <div className="mt-8">
            <Link href="/" className="text-sm text-amber-300 underline">
              <T hi="मुख्य पृष्ठ पर लौटें" en="Return to Home" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
