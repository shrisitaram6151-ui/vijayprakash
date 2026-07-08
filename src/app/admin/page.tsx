import { db } from "@/db";
import { bookings as bTable, callbacks as cTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin />;
  }

  const bookings = await db
    .select()
    .from(bTable)
    .orderBy(desc(bTable.createdAt));
  const callbacks = await db
    .select()
    .from(cTable)
    .orderBy(desc(cTable.createdAt));

  const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");
  const stats = {
    total: bookings.length,
    paid: paidBookings.length,
    revenue: paidBookings.reduce((sum, b) => sum + b.amount, 0),
    pending: callbacks.filter((c) => !c.handled).length,
  };

  return (
    <AdminDashboard
      bookings={bookings}
      callbacks={callbacks}
      stats={stats}
    />
  );
}
