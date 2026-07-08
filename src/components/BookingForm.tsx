"use client";

import { useMemo, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import type { Service } from "@/db/schema";

export default function BookingForm({
  services,
  mode,
  initialSlug,
}: {
  services: Service[];
  mode: "sandbox" | "production";
  initialSlug?: string;
}) {
  const [slug, setSlug] = useState(
    initialSlug && services.some((s) => s.slug === initialSlug)
      ? initialSlug
      : services[0]?.slug ?? ""
  );
  const [consultType, setConsultType] = useState("call");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    question: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(
    () => services.find((s) => s.slug === slug),
    [services, slug]
  );

  function update(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone) {
      setError("कृपया नाम और मोबाइल नंबर भरें।");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, serviceSlug: slug, consultType }),
      });
      const data = await res.json();
      if (!data.ok || !data.paymentSessionId) {
        throw new Error(data.error || "भुगतान आरंभ नहीं हो सका।");
      }
      const cashfree = await load({ mode });
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "त्रुटि हुई।");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-amber-500/25 bg-black/30 px-4 py-3 text-amber-50 placeholder:text-amber-200/40 outline-none focus:border-amber-400";

  return (
    <form onSubmit={handlePay} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        {/* Service */}
        <div className="card-dark rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-amber-200">
            1. सेवा चुनें
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setSlug(s.slug)}
                className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                  slug === s.slug
                    ? "border-amber-400 bg-amber-500/10"
                    : "border-amber-500/20 bg-black/20 hover:border-amber-400/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-sm text-amber-100">{s.titleHi}</span>
                </span>
                <span className="font-display font-bold gold-text">
                  ₹{s.price}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Consult type */}
        <div className="card-dark rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-amber-200">
            2. परामर्श माध्यम
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              { v: "call", l: "📞 फोन कॉल" },
              { v: "whatsapp", l: "💬 WhatsApp" },
              { v: "video", l: "🎥 वीडियो कॉल" },
            ].map((o) => (
              <button
                type="button"
                key={o.v}
                onClick={() => setConsultType(o.v)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  consultType === o.v
                    ? "border-amber-400 bg-amber-500/15 text-amber-200"
                    : "border-amber-500/25 text-amber-100/70"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="card-dark rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-amber-200">
            3. आपकी जानकारी
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              className={inputCls}
              placeholder="पूरा नाम *"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
            <input
              className={inputCls}
              placeholder="मोबाइल नंबर *"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
            <input
              className={inputCls}
              placeholder="ईमेल (वैकल्पिक)"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
            <input
              className={inputCls}
              placeholder="जन्म स्थान"
              value={form.birthPlace}
              onChange={(e) => update("birthPlace", e.target.value)}
            />
            <label className="text-xs text-amber-100/60">
              जन्म तिथि
              <input
                className={inputCls}
                type="date"
                value={form.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
              />
            </label>
            <label className="text-xs text-amber-100/60">
              जन्म समय
              <input
                className={inputCls}
                type="time"
                value={form.birthTime}
                onChange={(e) => update("birthTime", e.target.value)}
              />
            </label>
            <label className="text-xs text-amber-100/60">
              परामर्श की पसंदीदा तिथि
              <input
                className={inputCls}
                type="date"
                value={form.preferredDate}
                onChange={(e) => update("preferredDate", e.target.value)}
              />
            </label>
            <label className="text-xs text-amber-100/60">
              पसंदीदा समय
              <input
                className={inputCls}
                type="time"
                value={form.preferredTime}
                onChange={(e) => update("preferredTime", e.target.value)}
              />
            </label>
          </div>
          <textarea
            className={`${inputCls} mt-3`}
            rows={3}
            placeholder="आपका प्रश्न / समस्या"
            value={form.question}
            onChange={(e) => update("question", e.target.value)}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="card-dark rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold gold-text">
            बुकिंग सारांश
          </h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-amber-100/60">सेवा</span>
              <span className="text-amber-100">{selected?.titleHi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-100/60">अवधि</span>
              <span className="text-amber-100">
                {selected?.durationMin} मिनट
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-100/60">माध्यम</span>
              <span className="text-amber-100">
                {consultType === "call"
                  ? "फोन कॉल"
                  : consultType === "whatsapp"
                  ? "WhatsApp"
                  : "वीडियो कॉल"}
              </span>
            </div>
            <div className="my-3 border-t border-amber-500/20" />
            <div className="flex items-center justify-between">
              <span className="text-amber-100">कुल राशि</span>
              <span className="font-display text-2xl font-bold gold-text">
                ₹{selected?.price}
              </span>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-500/15 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="mt-5 w-full rounded-xl gold-gradient py-3 font-semibold text-[#3a2a05] disabled:opacity-60"
          >
            {loading ? "प्रोसेस हो रहा है..." : `सुरक्षित भुगतान करें ₹${selected?.price}`}
          </button>
          <p className="mt-3 text-center text-xs text-amber-100/50">
            🔒 Cashfree द्वारा सुरक्षित भुगतान
            {mode === "sandbox" ? " (टेस्ट मोड)" : ""}
          </p>
        </div>
      </div>
    </form>
  );
}
