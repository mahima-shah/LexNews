import { useState, useEffect } from "react";

// null = English (default, no translation)
// "mr" = Marathi, "hi" = Hindi, "kn" = Kannada
const LANG_KEY = "lexnews_lang";

export const LANGUAGES = [
  { code: null,  label: "English",  native: "English" },
  { code: "hi",  label: "Hindi",    native: "हिन्दी" },
  { code: "mr",  label: "Marathi",  native: "मराठी" },
  { code: "kn",  label: "Kannada",  native: "ಕನ್ನಡ" },
];

export function useLang() {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || null; }
    catch { return null; }
  });

  const setLang = (code) => {
    setLangState(code);
    try {
      if (code) localStorage.setItem(LANG_KEY, code);
      else localStorage.removeItem(LANG_KEY);
    } catch {}
  };

  return { lang, setLang };
}