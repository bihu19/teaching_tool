"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "th" | "en";

type LangContextType = {
  lang: Lang;
  toggle: () => void;
  t: (th: string, en: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: "th",
  toggle: () => {},
  t: (th) => th,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("th");

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "th" ? "en" : "th"));
  }, []);

  const t = useCallback(
    (th: string, en: string) => (lang === "th" ? th : en),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
