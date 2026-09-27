import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Heart } from 'react-iconly';
import reactLogo from 'thesvg/react';
import nextLogo from 'thesvg/nextjs';
import angularLogo from 'thesvg/angular';
import astroLogo from 'thesvg/astro';
import typescriptLogo from 'thesvg/typescript';
import tailwindLogo from 'thesvg/tailwindcss';
import gsapLogo from 'thesvg/gsap';
import flutterLogo from 'thesvg/flutter';
import reactNativeLogo from 'thesvg/reactnative';
import nodeLogo from 'thesvg/nodejs';
import nestLogo from 'thesvg/nestjs';
import javaLogo from 'thesvg/java';
import springLogo from 'thesvg/spring-boot';
import postgresLogo from 'thesvg/postgresql';
import prismaLogo from 'thesvg/prisma';
import supabaseLogo from 'thesvg/supabase';
import { profile, links, recognition, getMailto } from '../data/site';
import { registerGsap, prefersReducedMotion, EASE_OUT, revealTrigger } from '../lib/motion';
import {
  getVisitorId,
  getProfileStats,
  registerProfileView,
  setProfileLike,
  type ProfileStats,
} from '../lib/supabase';

interface ProfileProps {
  /** Retrato; el mismo que viaja entre el hero y la barra. */
  portrait: { src: string; srcSet?: string };
}

interface Logo {
  slug: string;
  title: string;
  svg: string;
  variants?: Record<string, string>;
}

/* El paquete trae el prólogo XML: dentro del HTML sobra. */
const clean = (markup: string) => markup.replace(/<\?xml[^>]*\?>/, '').trim();

/*
 * Panal: las filas se corren medio paso y se acercan en vertical por 0.866
 * (la altura del triángulo equilátero). Eso es lo que hace que los círculos
 * encastren entre sí en vez de quedar en una grilla cuadrada.
 */
const D = 52; // diámetro de cada celda, en px
const STEP_X = 56; // paso horizontal: el diámetro más un aire mínimo
const STEP_Y = Math.round(STEP_X * 0.866);

interface Hive {
  label: string;
  /** Cuántas celdas lleva cada fila, de arriba hacia abajo. */
  rows: number[];
  logos: Logo[];
}

const HIVES: Hive[] = [
  {
    label: 'Frontend',
    rows: [5, 4],
    logos: [
      reactLogo,
      nextLogo,
      angularLogo,
      astroLogo,
      typescriptLogo,
      tailwindLogo,
      gsapLogo,
      flutterLogo,
      reactNativeLogo,
    ],
  },
  {
    label: 'Backend',
    rows: [4, 3],
    logos: [nodeLogo, nestLogo, javaLogo, springLogo, postgresLogo, prismaLogo, supabaseLogo],
  },
];

/** Coloca cada logo en su celda y devuelve además el tamaño del panal. */
function layout({ rows }: Hive) {
  const widest = Math.max(...rows);
  const cells = rows.flatMap((count, row) => {
    const indent = ((widest - count) * STEP_X) / 2;
    return Array.from({ length: count }, (_, col) => ({
      left: indent + col * STEP_X,
      top: row * STEP_Y,
    }));
  });

  return {
    cells,
    width: (widest - 1) * STEP_X + D,
    height: (rows.length - 1) * STEP_Y + D,
  };
}

/** 18400 → «18,4K». Arriba de mil el número exacto no aporta nada. */
function formatCount(value: number): string {
  if (value < 1000) return String(value);
  return `${(value / 1000).toFixed(1).replace('.0', '').replace('.', ',')}K`;
}

/** Una visita por día y por navegador: recargar no infla el número. */
const VIEW_KEY = 'perfil:visita';

/* Íconos de las tarjetas: van inline, son cuatro y no justifican un paquete. */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" {...stroke}>
    <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="3" />
    <path d="m4.5 8 6.4 4.4a2 2 0 0 0 2.2 0L19.5 8" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" {...stroke}>
    <rect x="3" y="3" width="18" height="18" rx="5.2" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" {...stroke}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5.5H4.5v1A3.5 3.5 0 0 0 7.6 10M17 5.5h2.5v1a3.5 3.5 0 0 1-3.1 3.5" />
    <path d="M12 14v3.5M8.5 20.5h7M10 20.5c0-1.7.9-3 2-3s2 1.3 2 3" />
  </svg>
);

interface Card {
  icon: () => JSX.Element;
  label: string;
  value: string;
  note: string;
  href?: string;
  /** El enlace se arma en el navegador, para no publicar la dirección. */
  mail?: boolean;
}

const CARDS: Card[] = [
  { icon: GithubIcon, label: 'GitHub', value: '@mau-jsx', note: 'Todo el código', href: links.github },
  // El correo no lleva valor visible ni href fijo: se arma al hidratar.
  { icon: MailIcon, label: 'Email', value: 'Escribime', note: 'Respondo rápido', mail: true },
  { icon: InstagramIcon, label: 'Instagram', value: '@mau.jsx', note: 'El detrás', href: links.instagram },
  {
    icon: TrophyIcon,
    label: 'Hackatón',
    value: recognition.title,
    note: 'Politécnico Formosa · 24 h',
  },
];

export default function Profile({ portrait }: ProfileProps) {
  const rootRef = useRef<HTMLElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);
  // El retrato es de la barra hasta que esta sección entra en pantalla.
  const [holdsAvatar, setHoldsAvatar] = useState(false);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [busy, setBusy] = useState(false);
  // Vacío en el HTML servido; se llena recién al hidratar, en el navegador.
  const [mailto, setMailto] = useState('');

  useEffect(() => setMailto(getMailto()), []);

  useEffect(() => {
    const onHolder = (event: Event) =>
      setHoldsAvatar((event as CustomEvent<{ holder: string }>).detail?.holder === 'perfil');

    window.addEventListener('portfolio:nav-avatar', onHolder);
    return () => window.removeEventListener('portfolio:nav-avatar', onHolder);
  }, []);

  useEffect(() => {
    const visitor = getVisitorId();
    const today = new Date().toISOString().slice(0, 10);
    let seen = false;
    try {
      seen = localStorage.getItem(VIEW_KEY) === today;
    } catch {
      seen = false;
    }

    const task = seen ? getProfileStats(visitor) : registerProfileView(visitor);
    void task
      .then((next) => {
        setStats(next);
        if (!seen) {
          try {
            localStorage.setItem(VIEW_KEY, today);
          } catch {
            // Sin almacenamiento la visita se cuenta igual; no es grave.
          }
        }
      })
      // Si la base no responde, la sección se ve igual: sólo sin números.
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: revealTrigger(root, 'top 78%'), defaults: { ease: EASE_OUT } })
        .from('[data-profile-avatar]', { opacity: 0, y: 18, duration: 0.7 })
        .from('[data-profile-text]', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, 0.12)
        .from(
          '[data-hive-cell]',
          { opacity: 0, scale: 0.6, duration: 0.6, stagger: { each: 0.045, from: 'center' } },
          0.2,
        )
        .from('[data-profile-card]', { opacity: 0, y: 22, duration: 0.7, stagger: 0.08 }, 0.35);
    }, root);

    return () => ctx.revert();
  }, []);

  const liked = stats?.liked ?? false;

  const toggleLike = () => {
    if (!stats || busy) return;
    const want = !liked;
    setBusy(true);

    // Respuesta inmediata: el número se corrige solo si la base dice otra cosa.
    setStats({ ...stats, liked: want, likes: stats.likes + (want ? 1 : -1) });

    if (want && heartRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        heartRef.current,
        { scale: 0.7 },
        { scale: 1, duration: 0.55, ease: 'back.out(3)' },
      );
    }

    void setProfileLike(getVisitorId(), want)
      .then(setStats)
      .catch(() => setStats(stats))
      .finally(() => setBusy(false));
  };

  return (
    <section ref={rootRef} id="perfil" aria-label="Perfil" className="shell py-24 sm:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
        <div data-avatar-card="perfil" className="max-w-[44rem]">
          {/* Sin marco ni círculo: el dibujo solo, apoyado sobre el fondo. */}
          <div data-profile-avatar className="flex flex-wrap items-center gap-4">
            <img
              {...(holdsAvatar ? { 'data-flip-id': 'nav-avatar' } : {})}
              src={portrait.src}
              srcSet={portrait.srcSet}
              sizes="6rem"
              alt=""
              decoding="async"
              className={`h-20 w-20 shrink-0 object-contain transition-opacity duration-300 sm:h-24 sm:w-24 ${
                holdsAvatar ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <p className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-none tracking-[-0.035em] text-[var(--fg)]">
              ¡Hola!
            </p>

            {/*
              El me gusta va acá, chico y al costado: se ofrece, no se reclama.
              Sin datos todavía no se muestra, para no ofrecer un botón muerto.
            */}
            {stats && (
              <button
                type="button"
                onClick={toggleLike}
                aria-pressed={liked}
                aria-label={liked ? 'Quitar me gusta' : 'Me gusta'}
                className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                  liked
                    ? 'border-transparent bg-[#fdeaea] text-[#d32f2f] dark:bg-[#3a1616] dark:text-[#ff8a80]'
                    : 'border-[var(--rule)] text-[var(--fg-muted)] hover:border-[var(--fg-faint)] hover:text-[var(--fg)]'
                }`}
              >
                <span ref={heartRef} className="inline-flex">
                  <Heart
                    set={liked ? 'bulk' : 'light'}
                    primaryColor={liked ? '#d32f2f' : 'currentColor'}
                    size={18}
                  />
                </span>
                <span className="tnum">{formatCount(stats.likes)}</span>
              </button>
            )}

            {/* Las visitas no se tocan: van como dato, sin forma de botón. */}
            {stats && (
              <p className="text-sm text-[var(--fg-faint)]">
                <span className="tnum font-semibold text-[var(--fg-muted)]">
                  {formatCount(stats.views)}
                </span>{' '}
                visitas
              </p>
            )}
          </div>

          <h2
            data-profile-text
            className="mt-8 text-[clamp(1.4rem,2.8vw,2.1rem)] font-semibold leading-[1.28] tracking-[-0.03em] text-[var(--fg)]"
          >
            Diseño y construyo experiencias de usuario.{' '}
            <span className="text-[var(--fg-faint)]">
              UI/UX aplicado al frontend, desde {profile.location}.
            </span>
          </h2>

          <p
            data-profile-text
            className="mt-6 max-w-[38rem] text-base leading-relaxed text-[var(--fg-muted)] sm:text-lg"
          >
            {profile.about}
          </p>

          <a
            data-profile-text
            href={links.cv}
            download
            className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-[var(--fg)] px-6 py-3.5 text-sm font-semibold text-[var(--bg)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" {...stroke}>
              <path d="M12 3.5v11m0 0 4-4m-4 4-4-4" />
              <path d="M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
            </svg>
            Descargar CV
          </a>
        </div>

        {/* La columna derecha va a un ancho fijo: los panales y las tarjetas
            comparten borde, así no queda aire suelto entre bloques. */}
        <div className="flex flex-col gap-12 lg:w-[34rem]">
          <div className="flex flex-wrap gap-x-10 gap-y-9">
          {HIVES.map((hive) => {
            const { cells, width, height } = layout(hive);

            return (
              <div key={hive.label}>
                <p className="type-label mb-4 text-[var(--fg-faint)]">{hive.label}</p>

                <ul
                  aria-label={`Tecnologías · ${hive.label}`}
                  style={{ width, height }}
                  className="relative list-none"
                >
                  {hive.logos.map((logo, index) => {
                    const cell = cells[index];
                    if (!cell) return null;
                    const dark = logo.variants?.dark;

                    return (
                      <li
                        key={logo.slug}
                        data-hive-cell
                        title={logo.title}
                        style={{ left: cell.left, top: cell.top, width: D, height: D }}
                        className="absolute"
                      >
                        <span className="grid h-full w-full place-items-center rounded-full border border-[var(--rule)] bg-[var(--bg-raised)] shadow-[0_12px_28px_-20px_rgb(0_0_0/0.6)] transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:hover:scale-110">
                          <span
                            aria-hidden="true"
                            className={`col-start-1 row-start-1 block h-[44%] w-[44%] [&>svg]:h-full [&>svg]:w-full ${
                              dark ? 'dark:hidden' : ''
                            }`}
                            dangerouslySetInnerHTML={{ __html: clean(logo.svg) }}
                          />
                          {dark && (
                            <span
                              aria-hidden="true"
                              className="col-start-1 row-start-1 hidden h-[44%] w-[44%] dark:block [&>svg]:h-full [&>svg]:w-full"
                              dangerouslySetInnerHTML={{ __html: clean(dark) }}
                            />
                          )}
                          <span className="sr-only">{logo.title}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          </div>

          {/*
            Cuatro tarjetas en retrato, debajo de las tecnologías: tres son
            puertas de salida y la última es el logro. Mismo alto, para que se
            lean como bloque y no sobre aire en la columna.
          */}
          <ul className="grid list-none grid-cols-2 gap-4">
            {CARDS.map(({ icon: Icon, label, value, note, href, mail }) => {
              const target = mail ? mailto : href;
          const body = (
            <>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--rule)] text-[var(--fg)] transition-colors duration-200 group-hover:border-transparent group-hover:bg-[var(--fg)] group-hover:text-[var(--bg)]">
                <Icon />
              </span>

              <span className="mt-auto block">
                <span className="type-label block text-[var(--fg-faint)]">{label}</span>
                <span className="mt-1.5 block truncate text-base font-semibold tracking-[-0.01em] text-[var(--fg)]">
                  {value}
                </span>
                <span className="mt-1 block text-sm text-[var(--fg-muted)]">{note}</span>
              </span>
            </>
          );

          const shell =
            'group flex h-full min-h-[9.5rem] flex-col rounded-2xl border border-[var(--rule)] bg-[var(--bg-raised)] p-5 transition-all duration-300';

          return (
            <li key={label} data-profile-card>
              {target ? (
                <a
                  href={target}
                  {...(target.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className={`${shell} hover:-translate-y-1 hover:shadow-[0_22px_44px_-30px_rgb(0_0_0/0.7)]`}
                >
                  {body}
                </a>
              ) : (
                <div className={shell}>{body}</div>
              )}
            </li>
          );
        })}
          </ul>
        </div>
      </div>
    </section>
  );
}
