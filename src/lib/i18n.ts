import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/*
 * Idioma del sitio. Cada isla de Astro es su propio árbol de React, así que
 * el idioma no vive en un contexto: vive en `<html lang>` y en localStorage,
 * y un evento avisa a todas las islas cuando cambia. El HTML servido sale en
 * español; el script del layout aplica la elección guardada antes de pintar.
 */
export type Lang = 'es' | 'en';

const KEY = 'lang';
const EVENT = 'langchange';

export const readLang = (): Lang =>
  typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'es';

/** Cambia el idioma de todo el sitio, también los textos fijos del layout. */
export function setLang(next: Lang) {
  document.documentElement.lang = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Sin almacenamiento el cambio vale igual, sólo no se recuerda.
  }
  applyStaticText(next);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  // Los textos cambian de largo: los pines y disparadores se vuelven a medir.
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

/** Textos fuera de React (pie, enlace de salto): llevan `data-es` y `data-en`. */
export function applyStaticText(lang: Lang) {
  document.querySelectorAll<HTMLElement>('[data-en]').forEach((el) => {
    const text = lang === 'en' ? el.dataset.en : el.dataset.es;
    if (text != null) el.textContent = text;
  });
}

/** El idioma actual; se actualiza en cada isla cuando alguien lo cambia. */
export function useLang(): Lang {
  const [lang, setState] = useState<Lang>('es');

  useEffect(() => {
    const sync = () => setState(readLang());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  return lang;
}

/** Elige el texto según el idioma: `t(lang, 'Hola', 'Hi')`. */
export const t = (lang: Lang, es: string, en: string) => (lang === 'en' ? en : es);
