"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "गलत पासवर्ड");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "त्रुटि");
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form
        onSubmit={submit}
        className="card-dark w-full max-w-sm rounded-3xl p-8 text-center"
      >
        <div className="text-4xl">🔐</div>
        <h1 className="mt-3 font-display text-2xl font-bold gold-text">
          एडमिन लॉगिन
        </h1>
        <p className="mt-1 text-sm text-amber-100/60">
          केवल अधिकृत उपयोगकर्ता के लिए
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="पासवर्ड"
          className="mt-6 w-full rounded-xl border border-amber-500/25 bg-black/30 px-4 py-3 text-amber-50 outline-none focus:border-amber-400"
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          disabled={loading}
          className="mt-4 w-full rounded-xl gold-gradient py-3 font-semibold text-[#3a2a05] disabled:opacity-60"
        >
          {loading ? "..." : "लॉगिन"}
        </button>
      </form>
    </main>
  );
}
