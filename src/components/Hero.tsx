import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { profile } from '../data/site';
import { registerGsap, prefersReducedMotion, EASE_OUT } from '../lib/motion';

interface Media {
  src: string;
  srcSet?: string;
}

interface HeroProps {
  /** La foto del titular, ya optimizada por Astro. */
  photo: Media;
  /** Retrato de la presentación; el mismo que después viaja al nav. */
  portrait: Media;
  /** Captura que acompaña a la palabra «fullstack». */
  fullstack: Media;
  /** Captura que acompaña a la palabra «interfaces». */
  frontend: Media;
}

/*
 * Dos niveles: arriba la presentación en cuerpo chico (quién soy) y abajo el
 * titular grande (qué hago). Las capturas viven dentro de las píldoras y se
 * miden en `em`, así crecen con la tipografía en vez de romper el renglón.
 */
export default function Hero({ photo, portrait, fullstack, frontend }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  // El retrato es de acá hasta que la barra se lo lleva.
  const [holdsAvatar, setHoldsAvatar] = useState(true);

  useEffect(() => {
    const onHolder = (event: Event) =>
      setHoldsAvatar((event as CustomEvent<{ holder: string }>).detail?.holder === 'hero');

    window.addEventListener('portfolio:nav-avatar', onHolder);
    return () => window.removeEventListener('portfolio:nav-avatar', onHolder);
  }, []);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: EASE_OUT } })
        .from('[data-hero-intro]', { opacity: 0, y: 14, duration: 0.7 })
        .from('[data-hero-line]', { yPercent: 105, duration: 0.9, stagger: 0.08 }, 0.15)
        .from('[data-hero-media]', { opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.09 }, 0.45);

      /*
       * Salida: se apagan las palabras, nunca el retrato. Tiene que llegar
       * entero al nav; si se va con el fundido, el imán agarra algo invisible.
       */
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

  /* Cada pieza se inclina apenas al pasar el mouse, sólo con puntero fino. */
  const mediaClass =
    'shrink-0 align-middle transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:hover:-rotate-2 [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.03]';

  /* Píldora: la palabra clave, con su captura recortada al óvalo. */
  const pillClass =
    'inline-flex shrink-0 items-center gap-[0.26em] whitespace-nowrap rounded-full border border-[var(--rule)] bg-[var(--bg-raised)] py-[0.1em] pl-[0.16em] pr-[0.5em] shadow-[0_14px_38px_-24px_rgb(0_0_0/0.6)]';

  const shotClass = 'h-[0.92em] w-[1.9em] shrink-0 overflow-hidden rounded-full object-cover';

  return (
    <section
      ref={rootRef}
      id="inicio"
      className="shell flex min-h-[100svh] flex-col items-center justify-center pb-20 pt-28 text-center"
    >
      {/* Presentación: cuerpo chico, para que el titular quede solo arriba. */}
      <p
        data-hero-intro
        data-avatar-card="hero"
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[clamp(0.95rem,1.5vw,1.15rem)] text-[var(--fg-muted)]"
      >
        <span data-hero-exit>Hola, soy</span>

        {/* Fuera del fundido: este retrato es el que vuela al nav. */}
        <span
          className={`${mediaClass} inline-block h-9 w-9 overflow-hidden rounded-full bg-[#efe9df] shadow-[0_8px_22px_-14px_rgb(0_0_0/0.6)]`}
        >
          <img
            {...(holdsAvatar ? { 'data-flip-id': 'nav-avatar' } : {})}
            src={portrait.src}
            srcSet={portrait.srcSet}
            sizes="5rem"
            alt=""
            fetchPriority="high"
            decoding="async"
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              holdsAvatar ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </span>

        <span data-hero-exit className="inline-flex items-center gap-1.5 font-semibold text-[var(--fg)]">
          {profile.name}
          <span
            title="Disponible"
            className="grid h-[1.05rem] w-[1.05rem] shrink-0 place-items-center rounded-full bg-[var(--accent)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3"
              fill="none"
              stroke="#fff"
              strokeWidth={3.4}
              aria-hidden="true"
            >
              <path d="M5 12.5 10 17.5 19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </p>

      <h1 className="mt-6 max-w-[22ch] text-[clamp(1.75rem,4.4vw,3.4rem)] font-bold leading-[1.22] tracking-[-0.035em] text-[var(--fg)]">
        <span className="flex flex-wrap items-center justify-center gap-x-[0.26em] gap-y-[0.14em]">
          <span data-hero-exit className="line-mask">
            <span data-hero-line className="block">
              Desarrollador de software
            </span>
          </span>

          <span data-hero-exit className="line-mask">
            <span data-hero-line className={pillClass}>
              <img
                data-hero-media
                src={fullstack.src}
                srcSet={fullstack.srcSet}
                sizes="(min-width: 768px) 12vw, 22vw"
                alt=""
                decoding="async"
                className={`${mediaClass} ${shotClass}`}
              />
              fullstack
            </span>
          </span>
        </span>

        <span className="flex flex-wrap items-center justify-center gap-x-[0.26em] gap-y-[0.14em]">
          <span data-hero-exit className="line-mask">
            <span data-hero-line className="block">
              enfocado en construir
            </span>
          </span>

          <span data-hero-exit className="line-mask">
            <span data-hero-line className={pillClass}>
              <img
                data-hero-media
                src={frontend.src}
                srcSet={frontend.srcSet}
                sizes="(min-width: 768px) 12vw, 22vw"
                alt=""
                decoding="async"
                className={`${mediaClass} ${shotClass}`}
              />
              interfaces
            </span>
          </span>
        </span>

        <span className="flex flex-wrap items-center justify-center gap-x-[0.26em] gap-y-[0.14em]">
          <span data-hero-exit className="line-mask">
            <span data-hero-line className="block">
              que se sienten
            </span>
          </span>

          <span data-hero-exit className="line-mask">
            <span data-hero-line className={pillClass}>
              <img
                data-hero-media
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="(min-width: 768px) 12vw, 22vw"
                alt=""
                decoding="async"
                className={`${mediaClass} ${shotClass} scale-100 object-center`}
              />
              únicas
            </span>
          </span>
        </span>
      </h1>
    </section>
  );
}
