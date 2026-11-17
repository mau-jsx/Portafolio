import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { HugeiconsIcon } from '@hugeicons/react';
import { Idea01Icon, PaintBrush01Icon, Rocket01Icon, SparklesIcon } from '@hugeicons/core-free-icons';
import type { ReactNode } from 'react';
import { registerGsap, prefersReducedMotion, EASE_OUT } from '../lib/motion';
import { useLang } from '../lib/i18n';

interface Media {
  src: string;
  srcSet?: string;
}

interface HeroProps {
  /** Ya no va en el titular: el retrato vive en Perfil y en el navbar. */
  portrait?: Media;
  /** Fondo: cielo despejado arriba, montaña sobre las nubes abajo. */
  sky: Media;
  /* Se siguen recibiendo desde la página; este hero ya no las usa. */
  photo?: Media;
  fullstack?: Media;
  frontend?: Media;
}

/*
 * Titular largo y centrado en Poppins, con stickers de color entre las
 * palabras, sobre el cielo limpio de la foto. Cada palabra tiene su propia
 * máscara, así el corte de renglón lo decide el navegador en cualquier ancho.
 * Las piezas se miden en `em`, así crecen con la tipografía y nunca rompen el
 * renglón.
 */
export default function Hero({ sky }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const en = useLang() === 'en';

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: EASE_OUT } })
        .from('[data-hero-sky]', { scale: 1.05, opacity: 0, duration: 1.4 }, 0)
        .from('[data-hero-line]', { yPercent: 110, duration: 0.8, stagger: 0.035 }, 0.2)
        .from(
          '[data-hero-media]',
          { opacity: 0, scale: 0.6, rotate: -8, duration: 0.45, stagger: 0.07, ease: 'back.out(1.6)' },
          0.45,
        );

      // Salida: los renglones se apagan y suben un poco al bajar.
      gsap.to('[data-hero-exit]', {
        yPercent: -14,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /*
   * Stickers en línea: cada uno con su color y su inclinación, con borde blanco
   * como una calcomanía pegada en el cielo. Al pasar el mouse se enderezan.
   */
  const sticker = (icon: typeof Idea01Icon, color: string, tilt: string, delay: string) => (
    <span
      data-hero-media
      aria-hidden="true"
      className={`mx-[0.1em] inline-block align-[-0.1em] ${tilt} transition-transform duration-300 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:rotate-0 [@media(hover:hover)_and_(pointer:fine)]:hover:scale-110`}
    >
      <span
        className="float-soft grid h-[0.9em] w-[0.9em] place-items-center rounded-[0.26em] border-[0.055em] border-white text-[#0a0a0a] shadow-[0_0.2em_0.4em_-0.14em_rgb(10_10_10/0.4)]"
        style={{ backgroundColor: color, animationDelay: delay }}
      >
        <HugeiconsIcon icon={icon} className="h-[0.48em] w-[0.48em]" strokeWidth={2} />
      </span>
    </span>
  );

  /* Cada palabra sube desde su propia máscara; los stickers quedan afuera para no recortar sus puntas. */
  const words = (text: string): ReactNode[] =>
    text.split(' ').flatMap((word, i) => [
      i > 0 ? ' ' : null,
      <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
        <span data-hero-line className="inline-block">
          {word}
        </span>
      </span>,
    ]);

  return (
    <section
      ref={rootRef}
      id="inicio"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[var(--bg)] pb-[34svh] pt-28"
    >
      {/*
       * Fondo: el titular vive en el cielo limpio de arriba; la montaña y las
       * nubes quedan abajo. object-position al 90% deja siempre a la vista el
       * pie de la foto, y el degradado lo funde con el papel de la página.
       */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          data-hero-sky
          src={sky.src}
          srcSet={sky.srcSet}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[50%_90%]"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--bg)]" />
      </div>

      <h1
        data-hero-exit
        className="mx-auto w-full px-[clamp(1.25rem,5vw,4rem)] text-center text-[clamp(2.5rem,4.6vw,6rem)] font-bold leading-[1.12] tracking-[-0.04em] text-[#0a0a0a] [text-wrap:pretty]"
      >
        {/* En compu, tres renglones fijos y anchos; en pantallas chicas corta el navegador. */}
        <span className="lg:block lg:whitespace-nowrap">
          {words(en ? 'I turn your ideas' : 'Convierto tus ideas')} {sticker(Idea01Icon, '#ffd25c', '-rotate-[9deg]', '1.2s')} {words(en ? 'into interfaces' : 'en interfaces')}{' '}
          {sticker(PaintBrush01Icon, '#ff8fd6', 'rotate-[7deg]', '1.9s')}
        </span>{' '}
        <span className="lg:block lg:whitespace-nowrap">
          {words(en ? 'that look amazing and work' : 'que se ven increíbles y funcionan')} {sticker(Rocket01Icon, '#6fe3b0', '-rotate-[5deg]', '2.6s')}
        </span>{' '}
        <span className="lg:block lg:whitespace-nowrap">
          {words(en ? 'from the very first click' : 'desde el primer clic')} {sticker(SparklesIcon, '#b9a6ff', 'rotate-[10deg]', '3.3s')}
        </span>
      </h1>
    </section>
  );
}
