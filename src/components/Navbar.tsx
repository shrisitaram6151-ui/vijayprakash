"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const LINKS = [
  { href: "/#services", label: "सेवाएँ" },
  { href: "/#about", label: "परिचय" },
  { href: "/#testimonials", label: "अनुभव" },
  { href: "/#contact", label: "संपर्क" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-amber-500/20 bg-[#0d0906]/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full gold-gradient text-xl">
            🕉️
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold gold-text">
              {SITE.nameEn}
            </span>
            <span className="block text-[11px] text-amber-200/70">
              ज्योतिषाचार्य
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-amber-100/80 transition hover:text-amber-300"
            >
              {l.label}
            </a>
          ))}
          <LanguageSwitcher />
          <a
            href="/booking"
            className="rounded-full gold-gradient px-6 py-2.5 text-sm font-semibold text-[#3a2a05] shadow-lg shadow-amber-900/40"
          >
            परामर्श बुक करें
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-amber-500/30 p-2 text-amber-200 md:hidden"
          aria-label="menu"
        >
          <div className="space-y-1">
            <span className="block h-0.5 w-5 bg-amber-300" />
            <span className="block h-0.5 w-5 bg-amber-300" />
            <span className="block h-0.5 w-5 bg-amber-300" />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-amber-500/20 bg-[#0d0906] px-4 py-6 md:hidden space-y-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-lg text-amber-100/85"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-4 border-t border-amber-500/10 space-y-3">
            <LanguageSwitcher />
            <a
              href="/booking"
              onClick={() => setOpen(false)}
              className="block rounded-full gold-gradient px-4 py-3 text-center font-bold text-[#3a2a05]"
            >
              परामर्श बुक करें
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
