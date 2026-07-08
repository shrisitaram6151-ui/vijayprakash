"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Booking, Callback } from "@/db/schema";

const BOOKING_STATUSES = ["new", "confirmed", "completed", "cancelled"];
const statusColor: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-300",
  confirmed: "bg-green-500/20 text-green-300",
  completed: "bg-amber-500/20 text-amber-300",
  cancelled: "bg-red-500/20 text-red-300",
};
const payColor: Record<string, string> = {
  paid: "bg-green-500/20 text-green-300",
  pending: "bg-yellow-500/20 text-yellow-300",
  failed: "bg-red-500/20 text-red-300",
};

export default function AdminDashboard({
  bookings,
  callbacks,
  stats,
}: {
  bookings: Booking[];
  callbacks: Callback[];
  stats: { total: number; paid: number; revenue: number; pending: number };
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"bookings" | "callbacks">("bookings");

  async function updateBooking(id: number, bookingStatus: string) {
    await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "booking", id, bookingStatus }),
    });
    router.refresh();
  }

  async function toggleCallback(id: number, handled: boolean) {
    await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "callback", id, handled }),
    });
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold gold-text">
          🕉️ एडमिन पैनल
        </h1>
        <div className="flex gap-2">
          <a
            href="/"
            className="rounded-full border border-amber-500/30 px-4 py-2 text-sm text-amber-200"
          >
            साइट देखें
          </a>
          <button
            onClick={logout}
            className="rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-300"
          >
            लॉगआउट
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "कुल बुकिंग", v: stats.total, i: "📋" },
          { l: "भुगतान प्राप्त", v: stats.paid, i: "✅" },
          { l: "कुल आय", v: `₹${stats.revenue}`, i: "💰" },
          { l: "कॉल बैक अनुरोध", v: stats.pending, i: "📞" },
        ].map((s) => (
          <div key={s.l} className="card-dark rounded-2xl p-5">
            <div className="text-2xl">{s.i}</div>
            <div className="mt-2 font-display text-2xl font-bold gold-text">
              {s.v}
            </div>
            <div className="text-xs text-amber-100/60">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2">
        <button
          onClick={() => setTab("bookings")}
          className={`rounded-full px-5 py-2 text-sm font-semibold ${
            tab === "bookings"
              ? "gold-gradient text-[#3a2a05]"
              : "border border-amber-500/30 text-amber-200"
          }`}
        >
          बुकिंग ({bookings.length})
        </button>
        <button
          onClick={() => setTab("callbacks")}
          className={`rounded-full px-5 py-2 text-sm font-semibold ${
            tab === "callbacks"
              ? "gold-gradient text-[#3a2a05]"
              : "border border-amber-500/30 text-amber-200"
          }`}
        >
          कॉल बैक ({callbacks.length})
        </button>
      </div>

      {tab === "bookings" ? (
        <div className="mt-4 space-y-3">
          {bookings.length === 0 && (
            <p className="text-amber-100/50">कोई बुकिंग नहीं।</p>
          )}
          {bookings.map((b) => (
            <div key={b.id} className="card-dark rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-amber-100">
                      {b.name}
                    </span>
                    <a
                      href={`tel:${b.phone}`}
                      className="text-sm text-amber-300"
                    >
                      📞 {b.phone}
                    </a>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        payColor[b.paymentStatus] || "bg-white/10"
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        statusColor[b.bookingStatus] || "bg-white/10"
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-amber-100/70">
                    {b.serviceTitle} • ₹{b.amount} • {b.consultType}
                  </div>
                  <div className="mt-1 text-xs text-amber-100/50">
                    {b.email && <>✉ {b.email} • </>}
                    {b.birthDate && <>जन्म: {b.birthDate} {b.birthTime} </>}
                    {b.birthPlace && <>({b.birthPlace}) </>}
                  </div>
                  {(b.preferredDate || b.preferredTime) && (
                    <div className="mt-1 text-xs text-amber-300">
                      पसंदीदा समय: {b.preferredDate} {b.preferredTime}
                    </div>
                  )}
                  {b.question && (
                    <div className="mt-2 rounded-lg bg-black/30 p-2 text-xs text-amber-100/80">
                      ❓ {b.question}
                    </div>
                  )}
                  <div className="mt-1 text-[10px] text-amber-100/40">
                    {b.orderId} •{" "}
                    {new Date(b.createdAt).toLocaleString("hi-IN")}
                  </div>
                </div>
                <select
                  value={b.bookingStatus}
                  onChange={(e) => updateBooking(b.id, e.target.value)}
                  className="rounded-lg border border-amber-500/30 bg-black/40 px-3 py-1.5 text-sm text-amber-100"
                >
                  {BOOKING_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {callbacks.length === 0 && (
            <p className="text-amber-100/50">कोई अनुरोध नहीं।</p>
          )}
          {callbacks.map((c) => (
            <div
              key={c.id}
              className="card-dark flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-100">{c.name}</span>
                  <a href={`tel:${c.phone}`} className="text-sm text-amber-300">
                    📞 {c.phone}
                  </a>
                  {c.handled && (
                    <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-300">
                      हो गया
                    </span>
                  )}
                </div>
                {c.message && (
                  <p className="mt-1 text-sm text-amber-100/70">{c.message}</p>
                )}
                <div className="mt-1 text-[10px] text-amber-100/40">
                  {new Date(c.createdAt).toLocaleString("hi-IN")}
                </div>
              </div>
              <button
                onClick={() => toggleCallback(c.id, !c.handled)}
                className="rounded-lg border border-amber-500/30 px-3 py-1.5 text-sm text-amber-200"
              >
                {c.handled ? "पुनः खोलें" : "पूर्ण चिह्नित करें"}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
