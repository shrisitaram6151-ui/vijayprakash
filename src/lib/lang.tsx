"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "hi" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: "hi",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("hi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "en") setLangState("en");
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center rounded-full border border-amber-500/30 bg-black/30 p-0.5">
      <button
        onClick={() => setLang("hi")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
          lang === "hi" ? "gold-gradient text-[#3a2a05]" : "text-amber-200/70"
        }`}
      >
        हिंदी
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
          lang === "en" ? "gold-gradient text-[#3a2a05]" : "text-amber-200/70"
        }`}
      >
        English
      </button>
    </div>
  );
}

export function T({ hi, en }: { hi: string; en: string }) {
  const { lang } = useLang();
  return <>{lang === "hi" ? hi : en}</>;
}
