"use client";

import { useState } from "react";

export default function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "त्रुटि");
      setStatus("done");
      setName("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "त्रुटि");
    }
  }

  if (status === "done") {
    return (
      <div className="card-dark rounded-2xl p-8 text-center">
        <div className="text-4xl">🙏</div>
        <h3 className="mt-3 font-display text-xl gold-text">धन्यवाद!</h3>
        <p className="mt-2 text-amber-100/80">
          आपका अनुरोध प्राप्त हो गया है। महाराज जी की ओर से जल्द ही आपको कॉल किया
          जाएगा।
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-amber-300 underline"
        >
          नया अनुरोध भेजें
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-dark rounded-2xl p-6 sm:p-8">
      <h3 className="font-display text-xl gold-text">निःशुल्क कॉल बैक अनुरोध</h3>
      <p className="mt-1 text-sm text-amber-100/70">
        अपना नंबर छोड़ें, महाराज जी स्वयं संपर्क करेंगे।
      </p>
      <div className="mt-4 space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="आपका नाम"
          className="w-full rounded-xl border border-amber-500/25 bg-black/30 px-4 py-3 text-amber-50 placeholder:text-amber-200/40 outline-none focus:border-amber-400"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          type="tel"
          placeholder="मोबाइल नंबर"
          className="w-full rounded-xl border border-amber-500/25 bg-black/30 px-4 py-3 text-amber-50 placeholder:text-amber-200/40 outline-none focus:border-amber-400"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="आपकी समस्या (वैकल्पिक)"
          className="w-full rounded-xl border border-amber-500/25 bg-black/30 px-4 py-3 text-amber-50 placeholder:text-amber-200/40 outline-none focus:border-amber-400"
        />
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <button
        disabled={status === "loading"}
        className="mt-4 w-full rounded-xl gold-gradient py-3 font-semibold text-[#3a2a05] disabled:opacity-60"
      >
        {status === "loading" ? "भेजा जा रहा है..." : "कॉल बैक अनुरोध भेजें"}
      </button>
    </form>
  );
}
