"use client";

import { telLink, waLink } from "@/lib/site";

import Link from "next/link";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-3">
      <Link
        href="/booking"
        className="flex h-14 items-center gap-2 rounded-full gold-gradient px-4 font-bold text-[#3a2a05] shadow-lg shadow-amber-900/50 transition hover:scale-105"
      >
        <span className="text-xl">🕉️</span>
        <span className="hidden sm:inline">परामर्श बुक करें</span>
      </Link>
    </div>
  );
}
