"use client";

import { useEffect, useState } from "react";

const LANGUAGES = [
  { code: "hi", label: "हिन्दी", short: "HI" },
  { code: "en", label: "English", short: "EN" },
  { code: "gu", label: "ગુજરાતી", short: "GU" },
  { code: "mr", label: "मराठी", short: "MR" },
  { code: "bn", label: "বাংলা", short: "BN" },
  { code: "pa", label: "ਪੰਜਾਬੀ", short: "PA" },
  { code: "ta", label: "தமிழ்", short: "TA" },
  { code: "te", label: "తెలుగు", short: "TE" },
  { code: "kn", label: "ಕನ್ನಡ", short: "KN" },
];

function setCookie(name: string, value: string) {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const found = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.split("=")[1]) : "";
}

function getCurrentLang() {
  const cookie = readCookie("googtrans");
  const parts = cookie.split("/").filter(Boolean);
  return parts[1] || "hi";
}

function triggerGoogleTranslate(lang: string) {
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!select) return false;
  select.value = lang;
  select.dispatchEvent(new Event("change"));
  return true;
}

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState("hi");

  useEffect(() => {
    setLanguage(getCurrentLang());

    const win = window as typeof window & {
      googleTranslateElementInit?: () => void;
      google?: {
        translate?: {
          TranslateElement?: new (
            options: Record<string, unknown>,
            elementId: string
          ) => unknown;
        };
      };
    };

    win.googleTranslateElementInit = () => {
      if (!win.google?.translate?.TranslateElement) return;
      new win.google.translate.TranslateElement(
        {
          pageLanguage: "hi",
          includedLanguages: LANGUAGES.map((item) => item.code).join(","),
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  function changeLanguage(nextLang: string) {
    setLanguage(nextLang);
    localStorage.setItem("selectedLanguage", nextLang);

    if (nextLang === "hi") {
      setCookie("googtrans", "/hi/hi");
    } else {
      setCookie("googtrans", `/hi/${nextLang}`);
    }

    const applied = triggerGoogleTranslate(nextLang);
    if (!applied) {
      setTimeout(() => triggerGoogleTranslate(nextLang), 700);
    }
  }

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="language-select">
        Select language
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(event) => changeLanguage(event.target.value)}
        className="notranslate rounded-full border border-amber-500/30 bg-black/35 px-3 py-2 text-xs font-semibold text-amber-100 outline-none transition hover:border-amber-400 focus:border-amber-300"
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code} className="bg-[#0d0906]">
            {item.short} • {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
