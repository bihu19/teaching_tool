"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

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

  const value = useMemo(() => ({ lang, toggle, t }), [lang, toggle, t]);

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
