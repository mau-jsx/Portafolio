import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsap, prefersReducedMotion, refreshOnLoad } from '../lib/motion';

/**
 * Scroll suave global. No renderiza nada: sólo conecta Lenis con el ticker de
 * GSAP para que ScrollTrigger y el scroll compartan el mismo reloj.
 */
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
    const lenis = new Lenis({
      lerp: 0.055,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.09,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Los anchors del menú tienen que viajar por Lenis, no por el scroll nativo.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        offset: 0,
        duration: 1.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 5),
      });
    };

    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
