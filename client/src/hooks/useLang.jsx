import { createContext, useContext, useState } from 'react';
import { LANGS } from '../data/langs';

const LangCtx = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('sp_lang') || 'en');
  const L = LANGS[lang] || LANGS.en;
  const t = k => L[k] || LANGS.en[k] || k;
  const changeLang = code => { setLang(code); localStorage.setItem('sp_lang', code); };
  return (
    <LangCtx.Provider value={{ lang, L, t, changeLang, LANGS, dir: L.dir || 'ltr' }}>
      {children}
    </LangCtx.Provider>
  );
}

export const useLang = () => useContext(LangCtx);
