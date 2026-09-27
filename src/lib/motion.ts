import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

let registered = false;

/**
 * Registra los plugins una sola vez, aunque varias islas de React arranquen a la vez.
 */
export function registerGsap() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
  registered = true;

  // Sólo en desarrollo: permite inspeccionar y forzar ticks desde la consola.
  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>).__gsap = gsap;
    (window as unknown as Record<string, unknown>).__ScrollTrigger = ScrollTrigger;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Curva de llegada del sitio: desaceleración exponencial, sin rebote.
 * Equivale a cubic-bezier(0.16, 1, 0.3, 1).
 */
export const EASE_OUT = 'power4.out';
export const EASE_IN = 'power2.in';

/**
 * ScrollTrigger recalcula sus posiciones cuando terminan de cargar imágenes y
 * fuentes. Sin esto, un trigger creado antes del layout final se queda con
 * coordenadas viejas y la animación no dispara nunca.
 */
export function refreshOnLoad() {
  if (typeof window === 'undefined') return;

  const refresh = () => ScrollTrigger.refresh();

  if (document.fonts?.ready) {
    document.fonts.ready.then(refresh).catch(() => {});
  }

  if (document.readyState === 'complete') {
    requestAnimationFrame(refresh);
  } else {
    window.addEventListener('load', refresh, { once: true });
  }
}

/**
 * Opciones compartidas por todos los reveals de scroll.
 *
 * `once: true` en lugar de toggleActions con reverse: si el trigger se crea
 * cuando la sección ya pasó (hidratación diferida con client:visible), el
 * estado "after" dejaba el contenido en opacity 0 para siempre.
 */
export function revealTrigger(trigger: Element, start = 'top 82%') {
  return {
    trigger,
    start,
    once: true,
    invalidateOnRefresh: true,
  } as const;
}
