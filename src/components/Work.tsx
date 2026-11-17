import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import reactLogo from 'thesvg/react';
import nextLogo from 'thesvg/nextjs';
import reactNativeLogo from 'thesvg/reactnative';
import typescriptLogo from 'thesvg/typescript';
import tailwindLogo from 'thesvg/tailwindcss';
import flutterLogo from 'thesvg/flutter';
import javaLogo from 'thesvg/java';
import springLogo from 'thesvg/spring-boot';
import nodeLogo from 'thesvg/nodejs';
import nestLogo from 'thesvg/nestjs';
import prismaLogo from 'thesvg/prisma';
import postgresLogo from 'thesvg/postgresql';
import supabaseLogo from 'thesvg/supabase';
import { work, profile, type WorkIcon, type WorkCategory } from '../data/site';
import { registerGsap, prefersReducedMotion, EASE_OUT, revealTrigger } from '../lib/motion';
import { useLang, t, type Lang } from '../lib/i18n';

export interface RepoInfo {
  /** Último push al repositorio, leído de GitHub al compilar. */
  pushedAt: string;
}

interface Media {
  src: string;
  srcSet?: string;
}

interface WorkProps {
  /** Datos traídos de GitHub al compilar, por `owner/repo`. */
  repos: Record<string, RepoInfo>;
  /** Retrato: firma cada tarjeta abajo a la izquierda. */
  portrait: Media;
  /** Fondo de las tarjetas; cada proyecto lo tiñe con su color. */
  cover: Media;
}

/* El paquete trae el prólogo XML: dentro del HTML sobra. */
const clean = (markup: string) => markup.replace(/<\?xml[^>]*\?>/, '').trim();

const TECH_LOGOS: Record<string, { svg: string; variants?: Record<string, string> }> = {
  React: reactLogo,
  'Next.js': nextLogo,
  'React Native': reactNativeLogo,
  TypeScript: typescriptLogo,
  'Tailwind CSS': tailwindLogo,
  Flutter: flutterLogo,
  Java: javaLogo,
  'Java Spring Boot': springLogo,
  'Node.js': nodeLogo,
  'Nest.js': nestLogo,
  Prisma: prismaLogo,
  PostgreSQL: postgresLogo,
  Supabase: supabaseLogo,
};

/*
 * Un símbolo por proyecto. No hay capturas, así que el ícono carga el trabajo
 * de decir de qué se trata: un carrito es una tienda, una espiga es el campo.
 */
const ICON_PATHS: Record<WorkIcon, string> = {
  gobierno: 'M3.5 20.5h17M5 20.5V10m4 10.5V10m6 10.5V10m4 10.5V10M2.75 10 12 4l9.25 6',
  tienda: 'M4 7.5h16l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 7.5Zm4.5 0V6a3.5 3.5 0 1 1 7 0v1.5',
  gastronomia: 'M7 3.5v8m-2.5-8v5a2.5 2.5 0 0 0 5 0v-5M7 11.5v9m10-17c-2 1-3 3-3 5.5s1 3 3 3v8',
  educacion: 'M12 6.5 3.5 10 12 13.5 20.5 10 12 6.5Zm6 5.5v4.5c0 1.4-2.7 2.5-6 2.5s-6-1.1-6-2.5V12',
  galeria: 'M3.5 5.5h17v13h-17v-13Zm0 9.5 4.5-4 4 3.5 3.5-3 5 4.5M15.5 9.5h.01',
  viaje: 'M10.5 19.5 12 14l7.5-2.2a2 2 0 0 0-1-3.9L11 10 7.5 5.5l-2 .6L8 11l-3.5 1-2-1.5-1.2.4 2 3.4 2 3.4 1.2-.4-.2-2.5L10 13l-1.5 7 2-.5Z',
  deporte:
    'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm0 0c2.5 2.2 4 5.2 4 8.5s-1.5 6.3-4 8.5m0-17c-2.5 2.2-4 5.2-4 8.5s1.5 6.3 4 8.5M3.7 9.5h16.6M3.7 14.5h16.6',
  agro: 'M12 20.5V9m0 0c0-2.8 2-5 4.5-5.5.4 2.8-1 5.5-4.5 5.5Zm0 3.5c0-2.5-1.8-4.5-4-5-.4 2.5.9 5 4 5Zm-8 6.5h16',
  infra: 'M4 4.5h16v5H4v-5Zm0 10h16v5H4v-5ZM7.5 7h.01M7.5 17h.01',
};

/* Pestañas de la sección: cada una arma su propia rueda de tarjetas. */
const GROUPS: { id: WorkCategory; label: string; labelEn: string; items: typeof work }[] = (
  [
    { id: 'freelance', label: 'Freelance', labelEn: 'Freelance' },
    { id: 'personal', label: 'Personales', labelEn: 'Personal' },
    { id: 'logro', label: 'Logros', labelEn: 'Awards' },
  ] as const
).map((group) => ({ ...group, items: work.filter((entry) => entry.category === group.id) }));

const slugOf = (href?: string) => href?.match(/github\.com\/([^/]+\/[^/?#]+)/)?.[1];

/** «hace 2 meses»: el dato importa como antigüedad, no como fecha exacta. */
function since(iso: string, lang: Lang): string {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  if (days < 30) return rtf.format(-days, 'day');
  if (days < 365) return rtf.format(-Math.round(days / 30), 'month');
  return rtf.format(-Math.round(days / 365), 'year');
}

function TechMark({ name }: { name: string }) {
  const logo = TECH_LOGOS[name];
  if (!logo) return null;
  const dark = logo.variants?.dark;

  return (
    <span className="grid h-4 w-4 shrink-0 place-items-center">
      <span
        aria-hidden="true"
        className={`col-start-1 row-start-1 block h-full w-full [&>svg]:h-full [&>svg]:w-full ${
          dark ? 'dark:hidden' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: clean(logo.svg) }}
      />
      {dark && (
        <span
          aria-hidden="true"
          className="col-start-1 row-start-1 hidden h-full w-full dark:block [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: clean(dark) }}
        />
      )}
    </span>
  );
}

/* Íconos de las filas de datos del detalle, con el mismo trazo de todo el sitio. */
const META_ICONS = {
  client: 'M3 7.5h18v12H3v-12Zm5.5 0V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5',
  role: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7.5 8.5a7.5 7.5 0 0 1 15 0',
  period: 'M3.5 5h17v15h-17V5Zm0 4.5h17M8 3.5v3M16 3.5v3',
  commit: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 12h5.5m7 0H21',
} as const;

const TROPHY =
  'M7 4h10v5a5 5 0 0 1-10 0V4Zm0 1.5H4.5v1A3.5 3.5 0 0 0 7.6 10M17 5.5h2.5v1a3.5 3.5 0 0 1-3.1 3.5M12 14v3.5m-3.5 3h7m-5.5 0c0-1.7.9-3 2-3s2 1.3 2 3';

function Glyph({ d, className = 'h-4 w-4' }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/*
 * Rueda de tarjetas. La activa queda al centro; la anterior se corre arriba y
 * la siguiente abajo, casi un alto entero, así de cada una sólo asoma el borde
 * que da a la activa (el inferior de la que pasó, el superior de la que viene),
 * inclinado y esmerilado. La distancia es continua para que el giro sea suave.
 */
function paint(cards: (HTMLElement | null)[], pos: number) {
  cards.forEach((card, i) => {
    if (!card) return;
    const offset = i - pos;
    const far = Math.abs(offset);
    const side = Math.sign(offset);
    const h = card.offsetHeight;
    const near = Math.min(far, 1);
    const beyond = Math.max(far - 1, 0);

    const y = side * (near * h * 1.06 + beyond * h * 0.7);
    const x = -Math.min(far, 2) * h * 0.08;
    const rotate = side * Math.min(far, 2) * 9;
    const scale = 1 - Math.min(far, 2) * 0.07;

    card.style.transform = `translate(${x}px, calc(-50% + ${y}px)) rotate(${rotate}deg) scale(${scale})`;
    card.style.opacity = String(Math.max(0, 1 - beyond * 1.2));
    card.style.zIndex = String(Math.round(20 - far * 2));
    card.style.pointerEvents = far > 1.4 ? 'none' : '';

    // Vidrio sobre las vecinas; su texto se apaga antes, a media distancia.
    const glass = card.querySelector<HTMLElement>('[data-card-glass]');
    if (glass) glass.style.opacity = String(Math.min(1, far * 1.5));
    card.querySelectorAll<HTMLElement>('[data-card-content]').forEach((el) => {
      el.style.opacity = String(Math.max(0, 1 - far * 2.5));
    });
  });
}

/**
 * Trabajo, un proyecto por tramo de scroll. La sección se pinnea y el scroll
 * hace girar la rueda de tarjetas de la izquierda; a la derecha, la
 * descripción del proyecto activo. En celular no entra al lado: «Ver» la abre
 * en una hoja que sube desde abajo.
 */
export default function Work({ repos, portrait, cover }: WorkProps) {
  const rootRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  // Posición actual de la rueda, compartida con el efecto que la repinta.
  const positionRef = useRef({ value: 0 });
  // En pantallas chicas el detalle va en una hoja que sube desde abajo.
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<WorkCategory>('freelance');
  const lang = useLang();
  // En inglés cada entrada toma sus textos de `en`; id, stack y colores no cambian.
  const items = useMemo(() => {
    const list = GROUPS.find((group) => group.id === category)!.items;
    return lang === 'en' ? list.map((entry) => ({ ...entry, ...entry.en })) : list;
  }, [category, lang]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const active = items[Math.min(index, items.length - 1)];
  const repo = repos[slugOf(active.href) ?? ''];

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const last = Math.max(items.length - 1, 0);
    cardRefs.current = cardRefs.current.slice(0, items.length);

    // Posición con su propia inercia: aunque el scroll dé un salto, las
    // tarjetas llegan deslizándose y nunca cambian de golpe.
    const position = positionRef.current;
    const render = (pos: number) => paint(cardRefs.current, pos);
    const glide = gsap.quickTo(position, 'value', {
      // Siempre desliza, como el scroll suave: con duración 0 la rueda no se repinta.
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => render(position.value),
    });
    render(0);
    // Tarjeta a la que va la rueda. Sólo se llama a `glide` cuando cambia:
    // llamarlo en cada evento de scroll reiniciaría la curva y nunca asentaría.
    let target = 0;
    // Mientras se avanza por rueda, el scroll lo mueve Lenis: los pasos
    // intermedios no deben devolver la rueda a la tarjeta anterior.
    let stepping = false;

    let onWheel = (_event: WheelEvent) => {};

    const ctx = gsap.context(() => {
      // Un tramo de scroll por proyecto. Sin snap: con Lenis encima tironea.
      triggerRef.current = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${last * window.innerHeight * 0.5}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // El pin agrega scroll: tiene que medirse antes que los triggers de
        // abajo, o el nav cree que Contacto empieza donde todavía hay pin.
        refreshPriority: 1,
        onUpdate: (self) => {
          if (stepping) return;
          const next = Math.round(self.progress * last);
          if (next === target) return;
          target = next;
          glide(next);
          setIndex(next);
        },
        // Al medir (al crearse, al recargar o al cambiar el tamaño) las
        // tarjetas saltan a donde está el scroll, sin deslizar: si arrancaran
        // en 0, mostrarían un proyecto y el detalle otro.
        onRefresh: (self) => {
          target = Math.round(self.progress * last);
          position.value = target;
          render(target);
          setIndex(target);
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      /*
       * Un gesto de rueda, una tarjeta. Sin esto la tarjeta depende de cuánto
       * se scrollea, y un gesto con inercia (sobre todo en touchpad) cruza
       * varias de una. Se escucha en captura sobre `document` para llegar
       * antes que Lenis, que escucha en `window`.
       */
      let busyUntil = 0;
      let quietUntil = 0;

      onWheel = (event: WheelEvent) => {
        const st = triggerRef.current;
        const lenis = window.__lenis;
        if (!st || !lenis || !event.deltaY) return;

        const y = lenis.scroll;
        if (y < st.start - 2 || y > st.end + 2) return;

        // En la primera y la última, la rueda sigue normal: así se sale.
        const next = target + Math.sign(event.deltaY);
        if (next < 0 || next > last) return;

        event.preventDefault();
        event.stopPropagation();

        // Un gesto es una ráfaga de eventos: sólo cuenta el primero, después
        // de una pausa y con el paso anterior ya terminado.
        const now = performance.now();
        const fresh = now > quietUntil;
        quietUntil = now + 170;
        if (!fresh || now < busyUntil) return;
        busyUntil = now + 850;

        stepping = true;
        target = next;
        glide(next);
        setIndex(next);
        lenis.scrollTo(st.start + (st.end - st.start) * (next / last), {
          duration: 0.8,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          lock: true,
          onComplete: () => {
            stepping = false;
          },
        });
      };

      document.addEventListener('wheel', onWheel, { capture: true, passive: false });

      if (prefersReducedMotion()) return;

      gsap.from('[data-work-panel]', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: EASE_OUT,
        scrollTrigger: { trigger: root, start: 'top 75%' },
      });
    }, root);

    return () => {
      document.removeEventListener('wheel', onWheel, { capture: true });
      ctx.revert();
    };
    // Cada pestaña rehace el pin: el tramo de scroll depende de cuántas tarjetas hay.
  }, [category]);

  const triggerRef = useRef<ScrollTrigger | null>(null);

  const setIndexFromCard = (target: number) => {
    const st = triggerRef.current;
    if (!st) return setIndex(target);
    const y = st.start + (st.end - st.start) * (target / Math.max(items.length - 1, 1));
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const toggle = () => setOpen((value) => !value);

  /* Al cambiar de pestaña se vuelve al principio del pin: arranca en la primera tarjeta. */
  const selectCategory = (next: WorkCategory) => {
    if (next === category) return;
    const st = triggerRef.current;
    if (st && window.scrollY > st.start) {
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(st.start, { immediate: true });
      else window.scrollTo({ top: st.start });
    }
    setOpen(false);
    setIndex(0);
    setCategory(next);
  };

  // Hoja del celular: entra desde abajo y se cierra con Esc.
  useEffect(() => {
    if (!open || !isMobile) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);

    const sheet = document.querySelector('[data-work-sheet]');
    const tween =
      sheet && !prefersReducedMotion()
        ? gsap.fromTo(sheet, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'power3.out' })
        : null;

    return () => {
      window.removeEventListener('keydown', onKey);
      tween?.kill();
    };
  }, [open, isMobile]);

  // La descripción se rehace en cada cambio de proyecto.
  useEffect(() => {
    const detail = detailRef.current;
    if (!detail || prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      detail.querySelectorAll('[data-detail-part]'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: EASE_OUT, overwrite: true },
    );

    return () => tween.kill();
  }, [open, index, isMobile, category]);

  /* El contenido del detalle: el mismo en la columna y en la hoja. */
  const detail = (
    <>
      <div data-detail-part className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-xl"
          style={{
            backgroundColor: `color-mix(in srgb, ${active.accent} 15%, transparent)`,
            color: active.accent,
          }}
        >
          <Glyph d={ICON_PATHS[active.icon]} className="h-5 w-5" />
        </span>

        {active.award && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fbeec7] px-2.5 py-1 text-xs font-semibold text-[#8a6300] dark:bg-[#3a2e10] dark:text-[#e9c86a]">
            <Glyph d={TROPHY} className="h-3.5 w-3.5" />
            {active.award} · {t(lang, 'Hackatón del Instituto Politécnico Formosa', 'Instituto Politécnico Formosa Hackathon')}
          </span>
        )}

      </div>

      <h3
        data-detail-part
        className="mt-5 text-[clamp(1.9rem,3.6vw,2.9rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[var(--fg)]"
      >
        {active.title}
      </h3>

      <dl data-detail-part className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
        {[
          { icon: META_ICONS.client, label: t(lang, 'Para', 'Client'), value: active.client },
          { icon: META_ICONS.role, label: t(lang, 'Mi rol', 'My role'), value: active.role },
          { icon: META_ICONS.period, label: t(lang, 'Período', 'Period'), value: active.period },
          ...(repo
            ? [{ icon: META_ICONS.commit, label: t(lang, 'Último commit', 'Last commit'), value: since(repo.pushedAt, lang) }]
            : []),
        ].map((row) => (
          <div key={row.label} className="flex items-start gap-2.5">
            <span className="mt-0.5 text-[var(--fg-faint)]">
              <Glyph d={row.icon} />
            </span>
            <span className="min-w-0">
              <dt className="text-xs text-[var(--fg-faint)]">{row.label}</dt>
              <dd className="font-medium text-[var(--fg)]">{row.value}</dd>
            </span>
          </div>
        ))}
      </dl>

      <p
        data-detail-part
        className="mt-6 max-w-[60ch] text-[0.975rem] leading-relaxed text-[var(--fg-muted)]"
      >
        {active.description}
      </p>

      <ul data-detail-part className="mt-6 flex list-none flex-wrap gap-2">
        {active.stack.map((name) => (
          <li
            key={name}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rule)] px-3 py-1.5 text-xs font-medium text-[var(--fg-muted)]"
          >
            <TechMark name={name} />
            {name}
          </li>
        ))}
      </ul>

      <div data-detail-part className="mt-8 flex flex-wrap items-center gap-4">
        {active.href && (
          <a
            href={active.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-5 py-3 text-sm font-semibold text-[var(--bg)] transition-opacity duration-200 hover:opacity-85"
          >
            {active.hrefLabel ?? t(lang, 'Ver más', 'See more')}
            <Glyph d="M7 17 17 7M8 7h9v9" />
          </a>
        )}
        {!isMobile && items.length > 1 && (
          <p className="text-xs text-[var(--fg-faint)]">
            {t(lang, 'Seguí scrolleando para el siguiente.', 'Keep scrolling for the next one.')}
          </p>
        )}
      </div>
    </>
  );

  return (
    <section
      ref={rootRef}
      id="trabajo"
      aria-label={t(lang, 'Trabajo', 'Work')}
      className="shell flex h-[100svh] flex-col pb-8 pt-24"
    >
      <header className="flex items-end justify-between gap-6 pb-5">
        <div>
          <p className="type-label text-[var(--fg-faint)]">{t(lang, 'Trabajo', 'Work')}</p>
          <h2 className="mt-2 text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-none tracking-[-0.035em] text-[var(--fg)]">
            {t(lang, 'Lo que construí', 'What I built')}
          </h2>
        </div>

        <p className="tnum text-sm text-[var(--fg-faint)]">
          <span className="text-lg font-semibold text-[var(--fg)]">
            {String(index + 1).padStart(2, '0')}
          </span>
          {' / '}
          {String(items.length).padStart(2, '0')}
        </p>
      </header>

      {/* Pestañas: una categoría a la vez, con cuántas entradas tiene. */}
      <div role="tablist" aria-label={t(lang, 'Tipo de trabajo', 'Type of work')} className="-mt-1 flex gap-1 pb-5 sm:gap-1.5">
        {GROUPS.map((group) => {
          const selected = group.id === category;
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="trabajo-detalle"
              onClick={() => selectCategory(group.id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm sm:gap-2 sm:px-4 font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)] ${
                selected
                  ? 'bg-[var(--fg)] text-[var(--bg)]'
                  : 'text-[var(--fg-muted)] hover:bg-[color-mix(in_srgb,var(--fg)_7%,transparent)] hover:text-[var(--fg)]'
              }`}
            >
              {lang === 'en' ? group.labelEn : group.label}
              <span className={`tnum text-xs ${selected ? 'opacity-60' : 'text-[var(--fg-faint)]'}`}>
                {group.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/*
        Izquierda la rueda de tarjetas, derecha la descripción. El fundido de
        arriba y abajo deja asomar a las vecinas sin cortarlas en seco.
      */}
      <div
        data-work-panel
        className="grid min-h-0 flex-1 justify-items-center gap-12 md:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] md:justify-items-stretch"
      >
        <div className="relative h-full w-full">
          {/*
            El fundido de arriba y abajo va en un envoltorio más ancho que las
            tarjetas: una máscara también recorta a los costados, y así ninguna
            tarjeta inclinada queda cortada en línea recta.
          */}
          <div className="absolute inset-y-0 -inset-x-24 [mask-image:linear-gradient(to_bottom,transparent,#000_16%,#000_84%,transparent)]">
          {items.map((entry, i) => {
            const offset = i - index;

            return (
              <article
                key={entry.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                aria-hidden={offset !== 0}
                onClick={() => offset !== 0 && setIndexFromCard(i)}
                // Primer cuadro: sólo la activa. Después `paint` escribe directo.
                style={{ zIndex: 20 - i * 2, opacity: i === 0 ? 1 : 0, transform: 'translateY(-50%)' }}
                className={`absolute left-1/2 top-1/2 -ml-[min(11rem,40vw)] flex h-[min(30rem,60%)] w-[min(22rem,80vw)] flex-col overflow-hidden rounded-[1.6rem] text-white shadow-[0_40px_80px_-50px_rgb(0_0_0/0.7)] will-change-transform ${
                  offset !== 0 ? 'cursor-pointer' : ''
                }`}
              >
                {/* El mismo fondo para todas, encuadrado distinto y teñido. */}
                <img
                  src={cover.src}
                  srcSet={cover.srcSet}
                  sizes="24rem"
                  alt=""
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full scale-110 object-cover"
                  style={{ objectPosition: `50% ${(i * 37) % 100}%` }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, color-mix(in srgb, ${entry.accent} 70%, #000) 0%, color-mix(in srgb, ${entry.accent} 30%, transparent) 45%, rgb(0 0 0 / 0.25) 100%)`,
                  }}
                />

                <span
                  aria-hidden="true"
                  data-card-glass
                  className="pointer-events-none absolute inset-0 z-10 border border-white/50 bg-white/45 dark:border-white/10 dark:bg-black/35"
                  style={{ opacity: i === 0 ? 0 : 1, borderRadius: 'inherit' }}
                />

                <div data-card-content className="relative flex items-start justify-between gap-3 p-6" style={{ opacity: i === 0 ? 1 : 0 }}>
                  <div>
                    <h3 className="text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em]">
                      {entry.title}
                    </h3>
                    <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/80">
                      {entry.role}
                    </p>
                  </div>

                  <span className="tnum shrink-0 rounded-full border border-white/30 bg-black/25 px-3 py-1 text-xs font-semibold tracking-[0.08em] backdrop-blur-sm">
                    {entry.year}
                  </span>
                </div>

                {/* Símbolo del proyecto, en vidrio, flotando en el medio. */}
                <div data-card-content className="relative grid flex-1 place-items-center" style={{ opacity: i === 0 ? 1 : 0 }}>
                  <span className="grid h-20 w-20 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md">
                    <Glyph d={ICON_PATHS[entry.icon]} className="h-9 w-9" />
                  </span>
                </div>

                <div data-card-content className="relative flex items-end justify-between gap-3 p-5" style={{ opacity: i === 0 ? 1 : 0 }}>
                  <span className="flex items-center gap-3">
                    <span className="grid h-14 w-12 place-items-center overflow-hidden rounded-[1.1rem] bg-[#f3eee3]">
                      <img
                        src={portrait.src}
                        srcSet={portrait.srcSet}
                        sizes="3rem"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="text-sm leading-tight">
                      <span className="block font-semibold">{profile.name}</span>
                      {/* En la tarjeta, sólo el trofeo: el detalle cuenta de qué es. */}
                      {entry.award ? (
                        <span title={entry.award} className="mt-1 block text-[#ffd76a]">
                          <Glyph d={TROPHY} className="h-6 w-6" />
                          <span className="sr-only">{entry.award}</span>
                        </span>
                      ) : (
                        <span className="text-white/70">{t(lang, 'Desarrollador', 'Developer')}</span>
                      )}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={open}
                    aria-controls="trabajo-detalle"
                    tabIndex={offset === 0 ? 0 : -1}
                    className="group flex shrink-0 items-center rounded-full bg-[#141414] py-1 pl-4 pr-1 text-sm font-medium text-white transition-colors duration-200 hover:bg-black md:hidden"
                  >
                    {open ? t(lang, 'Cerrar', 'Close') : t(lang, 'Ver', 'View')}
                    <span className="ml-3 grid h-9 w-9 place-items-center rounded-full bg-white/10">
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-4 w-4 transition-transform duration-500 ${open ? 'rotate-45' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
          </div>
        </div>

        {/* Escritorio: la descripción del proyecto activo, siempre a la vista. */}
        {!isMobile && (
          <div
            ref={detailRef}
            id="trabajo-detalle"
            className="flex min-w-0 flex-col justify-center overflow-y-auto border-l border-[var(--rule)] px-12 py-6"
          >
            {detail}
          </div>
        )}
      </div>

      {/*
        Celular: no hay lugar para dos columnas, así que el detalle sube en una
        hoja. `data-lenis-prevent` deja que se scrollee por dentro.
      */}
      {open && isMobile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-[90] flex items-end"
        >
          <button
            type="button"
            aria-label={t(lang, 'Cerrar', 'Close')}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/45"
          />
          <div
            data-work-sheet
            data-lenis-prevent
            ref={detailRef}
            id="trabajo-detalle"
            className="relative flex max-h-[86svh] w-full flex-col overflow-y-auto rounded-t-[1.75rem] bg-[var(--bg-raised)] px-5 pb-8 pt-3"
          >
            <span
              aria-hidden="true"
              className="mx-auto mb-4 block h-1 w-10 rounded-full bg-[var(--rule-strong)]"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t(lang, 'Cerrar detalle', 'Close details')}
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-[var(--rule)] text-[var(--fg-muted)]"
            >
              <Glyph d="M6 6l12 12M18 6 6 18" />
            </button>
            {detail}
          </div>
        </div>
      )}
    </section>
  );
}
