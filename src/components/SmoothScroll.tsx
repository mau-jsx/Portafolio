import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsap, prefersReducedMotion, refreshOnLoad } from '../lib/motion';

/**
 * Scroll suave global. No renderiza nada: sólo conecta Lenis con el ticker de
 * GSAP para que ScrollTrigger y el scroll compartan el mismo reloj.
 */
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    registerGsap();
    refreshOnLoad();

    if (prefersReducedMotion()) return;

    /*
     * Scroll cinematográfico: la rueda no mueve la página, la empuja. Con lerp
     * bajo el contenido llega con retardo y frena largo, como una cámara sobre
     * un dolly. El multiplicador por debajo de 1 evita que un golpe de rueda
     * se coma media pantalla.
     */
    /*
     * Firefox (y sus derivados, como Zen) reporta cada golpe de rueda con un
     * salto bastante más grande que Chrome. Con el mismo multiplicador, el
     * mismo giro recorre casi el doble de página: se lo compensa sólo ahí.
     */
    const isGecko = /firefox/i.test(navigator.userAgent);

    const lenis = new Lenis({
      lerp: 0.055,
      wheelMultiplier: isGecko ? 0.45 : 0.85,
      touchMultiplier: 1.4,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.09,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Trabajo lo usa para avanzar una tarjeta por gesto de rueda.
    window.__lenis = lenis;

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /*
     * Salto entre secciones. Un scroll animado recorrería toda la página en el
     * camino, pin de Trabajo incluido. En cambio: un velo del color del fondo
     * tapa la página, el scroll salta de golpe con todo tapado y el velo se
     * va. El navbar queda por encima del velo, así no parpadea.
     */
    const veil = document.createElement('div');
    veil.setAttribute('aria-hidden', 'true');
    Object.assign(veil.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '45',
      background: 'var(--bg)',
      opacity: '0',
      pointerEvents: 'none',
    });
    document.body.appendChild(veil);

    let jump: gsap.core.Timeline | null = null;

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;

      event.preventDefault();
      jump?.kill();

      jump = gsap
        .timeline()
        .to(veil, { opacity: 1, duration: 0.28, ease: 'power2.in' })
        .add(() => {
          lenis.scrollTo(target, { offset: 0, immediate: true, force: true });
          ScrollTrigger.update();
        })
        .to(veil, { opacity: 0, duration: 0.5, ease: 'power2.out' }, '+=0.08');
    };

    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      jump?.kill();
      veil.remove();
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return null;
}
