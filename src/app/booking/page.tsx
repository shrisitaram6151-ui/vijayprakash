import Link from "next/link";
import { db } from "@/db";
import { services as servicesTable } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { ensureSeed } from "@/lib/seed";
import { CASHFREE_MODE } from "@/lib/cashfree";
import BookingForm from "@/components/BookingForm";
import Navbar from "@/components/Navbar";
import FloatingContact from "@/components/FloatingContact";

export const dynamic = "force-dynamic";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  await ensureSeed();
  const sp = await searchParams;
  const services = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.active, true))
    .orderBy(asc(servicesTable.sortOrder));

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <Link href="/" className="text-sm text-amber-300">
            ← मुख्य पृष्ठ
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold gold-text">
            परामर्श बुकिंग
          </h1>
          <p className="text-amber-100/70">
            नीचे विवरण भरें और सुरक्षित भुगतान करके अपना परामर्श सुनिश्चित करें।
          </p>
        </div>
        <BookingForm
          services={services}
          mode={CASHFREE_MODE}
          initialSlug={sp.service}
        />
      </main>
      <FloatingContact />
    </>
  );
}
