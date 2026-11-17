import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Heart } from 'react-iconly';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Github01Icon,
  Linkedin01Icon,
  InstagramIcon,
  WhatsappIcon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';
import reactLogo from 'thesvg/react';
import angularLogo from 'thesvg/angular';
import astroLogo from 'thesvg/astro';
import nodeLogo from 'thesvg/nodejs';
import javaLogo from 'thesvg/java';
import nextLogo from 'thesvg/nextjs';
import nestLogo from 'thesvg/nestjs';
import pythonLogo from 'thesvg/python';
import flaskLogo from 'thesvg/flask';
import fastapiLogo from 'thesvg/fastapi';
import n8nLogo from 'thesvg/n8n';
import pytorchLogo from 'thesvg/pytorch';
import langchainLogo from 'thesvg/langchain';
import tensorflowLogo from 'thesvg/tensorflow';
import kerasLogo from 'thesvg/keras';
import { links, getMailto } from '../data/site';
import { registerGsap, prefersReducedMotion, EASE_OUT, revealTrigger } from '../lib/motion';
import { useLang, t } from '../lib/i18n';
import {
  getVisitorId,
  getProfileStats,
  registerProfileView,
  setProfileLike,
  type ProfileStats,
} from '../lib/supabase';

interface ProfileProps {
  /** Retrato de la presentación. */
  portrait: { src: string; srcSet?: string };
}

interface Logo {
  slug: string;
  title: string;
  svg: string;
  variants?: Record<string, string>;
}

/*
 * El paquete trae el prólogo XML, que dentro del HTML sobra, y ids genéricos
 * («a», «b», «c»). Con varios logos en la misma página esos ids chocan y un
 * logo termina usando el degradado o la máscara de otro: Angular quedaba
 * invisible. Cada id se prefija con el slug del logo.
 */
const clean = (markup: string, prefix = 'logo') =>
  markup
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/\bid="([^"]+)"/g, `id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}-$1"`)
    .trim();

/*
 * Nubes del fondo: los mismos tonos que el mar de nubes de la foto del hero
 * (blanco, rosa pálido y lavanda). Posición, tamaño y velocidad a mano, para
 * que no se lean como una grilla.
 */
const CLOUDS = [
  { left: '-12%', top: '0%', w: '62rem', h: '18rem', color: '#ffffff', speed: 70 },
  { left: '38%', top: '4%', w: '58rem', h: '16rem', color: '#f6dfd8', speed: 85 },
  { left: '-6%', top: '34%', w: '46rem', h: '15rem', color: '#ece8f4', speed: 95 },
  { left: '30%', top: '42%', w: '54rem', h: '17rem', color: '#ffffff', speed: 80 },
  { left: '62%', top: '30%', w: '44rem', h: '15rem', color: '#f8e6e0', speed: 90 },
  { left: '8%', top: '66%', w: '60rem', h: '16rem', color: '#f3eef6', speed: 100 },
  { left: '55%', top: '70%', w: '50rem', h: '15rem', color: '#ffffff', speed: 75 },
];

/** 18400 → «18,4K». Arriba de mil el número exacto no aporta nada. */
function formatCount(value: number): string {
  if (value < 1000) return String(value);
  return `${(value / 1000).toFixed(1).replace('.0', '').replace('.', ',')}K`;
}

/** Una visita por día y por navegador: recargar no infla el número. */
const VIEW_KEY = 'perfil:visita';

/* Trazo compartido de los íconos dibujados a mano. */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" {...stroke}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

/* Frases de la nota del avatar, en el orden en que aparecen. */
const NOTES = [
  'no tengo miedo de crear',
  '¿diseñamos algo?',
  '¿lo construimos juntos?',
  'de la idea al deploy',
  'pixel a pixel',
  'café y código',
  '¿arrancamos?',
];

/* Las mismas frases en inglés, en el mismo orden. */
const NOTES_EN = [
  'not afraid to create',
  'shall we design something?',
  'build it together?',
  'from idea to deploy',
  'pixel by pixel',
  'coffee and code',
  'ready to start?',
];

export default function Profile({ portrait }: ProfileProps) {
  const rootRef = useRef<HTMLElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);
  const lang = useLang();
  const en = lang === 'en';
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [busy, setBusy] = useState(false);
  // Vacío en el HTML servido; se llena recién al hidratar, en el navegador.
  const [mailto, setMailto] = useState('');

  useEffect(() => setMailto(getMailto()), []);

  // Nota del avatar: rota entre frases, con un fundido corto entre una y otra.
  const [noteIndex, setNoteIndex] = useState(0);
  const [noteVisible, setNoteVisible] = useState(true);

  useEffect(() => {
    let swap: number | undefined;
    const timer = window.setInterval(() => {
      setNoteVisible(false);
      swap = window.setTimeout(() => {
        setNoteIndex((i) => (i + 1) % NOTES.length);
        setNoteVisible(true);
      }, 260);
    }, 2800);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(swap);
    };
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

  /*
   * Vidrio esmerilado: blanco translúcido con desenfoque, borde claro y un
   * brillo arriba. Se apoya sobre las manchas de color del fondo.
   */
  const glass =
    'border border-white/70 bg-white/45 shadow-[0_8px_24px_-14px_rgb(10_10_10/0.35),inset_0_1px_0_rgb(255_255_255/0.85)] backdrop-blur-md dark:border-white/15 dark:bg-white/10 dark:shadow-[0_8px_24px_-14px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.12)]';

  /* Pieza en línea del relato: logo + palabra en una cápsula de vidrio. */
  const chip = (logo: Logo, word: string) => {
    const dark = logo.variants?.dark;
    return (
      <span
        className={`${glass} mx-[0.05em] inline-flex items-center gap-[0.25em] whitespace-nowrap rounded-full py-[0.06em] pl-[0.22em] pr-[0.42em] align-[0.06em] text-[0.8em] leading-[1.3]`}
      >
        <span
          aria-hidden="true"
          className={`grid h-[0.95em] w-[0.95em] place-items-center [&>svg]:h-full [&>svg]:w-full ${dark ? 'dark:hidden' : ''}`}
          dangerouslySetInnerHTML={{ __html: clean(logo.svg, logo.slug) }}
        />
        {dark && (
          <span
            aria-hidden="true"
            className="hidden h-[0.95em] w-[0.95em] place-items-center dark:grid [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: clean(dark, `${logo.slug}-dark`) }}
          />
        )}
        {word}
      </span>
    );
  };

  /* Redes: sólo íconos, en fila debajo del relato. El correo se arma al hidratar. */
  const socials = [
    { label: 'GitHub', href: links.github, icon: <HugeiconsIcon icon={Github01Icon} size={24} strokeWidth={1.6} /> },
    { label: 'LinkedIn', href: links.linkedin, icon: <HugeiconsIcon icon={Linkedin01Icon} size={24} strokeWidth={1.6} /> },
    { label: 'Instagram', href: links.instagram, icon: <HugeiconsIcon icon={InstagramIcon} size={24} strokeWidth={1.6} /> },
    { label: 'WhatsApp', href: links.whatsapp, icon: <HugeiconsIcon icon={WhatsappIcon} size={24} strokeWidth={1.6} /> },
    { label: 'Email', href: mailto, icon: <HugeiconsIcon icon={Mail01Icon} size={24} strokeWidth={1.6} /> },
  ];

  return (
    <section
      ref={rootRef}
      id="perfil"
      aria-label={t(lang, 'Perfil', 'Profile')}
      className="relative isolate overflow-x-clip"
    >
      {/*
        Mar de nubes: sigue las nubes del pie del hero y se derrama entre los
        párrafos. Arranca por encima de la sección (pisa el final del hero, así
        no hay corte) y se desvanece abajo. Cada nube deriva despacio.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-48 bottom-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_72%,transparent)] dark:opacity-25"
      >
        {CLOUDS.map((cloud, i) => (
          <div
            key={i}
            className="cloud-drift absolute rounded-[50%] blur-2xl"
            style={{
              left: cloud.left,
              top: cloud.top,
              width: cloud.w,
              height: cloud.h,
              background: `radial-gradient(closest-side, ${cloud.color} 0%, ${cloud.color}cc 45%, transparent 100%)`,
              animationDuration: `${cloud.speed}s`,
              animationDelay: `-${i * 7}s`,
            }}
          />
        ))}
      </div>

      {/*
        Todo centrado en una sola columna: el relato arriba y, debajo, el CV y
        las redes en una fila. Alto según el contenido, no una pantalla entera.
      */}
      <div className="flex flex-col items-center px-[clamp(1.25rem,4vw,4rem)] py-20 text-center">
        {/* ── Relato: hablo como hablo, con las cosas en línea ── */}
        <div className="flex max-w-[62rem] flex-col items-center">
          {/* Avatar arriba de todo, con su nota flotando encima, como en Instagram. */}
          <div data-profile-avatar className="relative mt-14">
            <span className="float-soft pointer-events-none absolute bottom-[calc(100%+0.7rem)] left-1/2 z-10 -translate-x-1/2">
              <span className="relative block whitespace-nowrap rounded-[1.1rem] bg-white px-3.5 py-2 text-[0.9rem] font-medium leading-tight text-[#0a0a0a] shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] sm:px-4 sm:py-2.5 sm:text-lg">
                <span
                  aria-live="off"
                  className={`block transition-[opacity,transform] duration-200 ease-out ${
                    noteVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                  }`}
                >
                  {(en ? NOTES_EN : NOTES)[noteIndex]}
                </span>
                <span aria-hidden="true" className="absolute -bottom-2 left-[42%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_4px_10px_-4px_rgb(0_0_0/0.3)]" />
                <span aria-hidden="true" className="absolute -bottom-[0.95rem] left-[36%] h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </span>
            <span className={`${glass} block h-24 w-24 overflow-hidden rounded-full p-1`}>
              <img
                src={portrait.src}
                srcSet={portrait.srcSet}
                sizes="6rem"
                alt="Mauricio Heredia"
                decoding="async"
                className="h-full w-full rounded-full bg-[#efe9df] object-cover"
              />
            </span>
          </div>

          <h2
            data-profile-text
            className="mt-8 text-[clamp(2.25rem,4.2vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[var(--fg)] [text-wrap:balance]"
          >
            {t(lang, 'Del diseño al código', 'From design to code')}
          </h2>

          {/* Relato corto: no más de diez renglones en escritorio. */}
          <div
            data-profile-text
            className="mt-6 flex flex-col gap-[0.7em] text-[clamp(1.05rem,1.55vw,1.75rem)] font-medium leading-[1.55] tracking-[-0.015em] text-[var(--fg)] [text-wrap:pretty]"
          >
            <p>
              {t(lang, 'Hola, soy Mauricio Heredia, desarrollador fullstack de', 'Hi, I’m Mauricio Heredia, a full stack developer from')}{' '}
              <span
                className={`${glass} mx-[0.05em] inline-flex items-center gap-[0.22em] whitespace-nowrap rounded-full py-[0.06em] pl-[0.26em] pr-[0.42em] align-[0.06em] text-[0.8em] leading-[1.3]`}
              >
                <span className="text-[var(--accent)] [&_svg]:h-[0.95em] [&_svg]:w-[0.95em]">
                  <PinIcon />
                </span>
                Formosa Capital
              </span>
              {t(
                lang,
                ', Argentina, con 3 años de experiencia creando interfaces web.',
                ', Argentina, with 3 years of experience building web interfaces.',
              )}
            </p>

            <p className="text-[var(--fg-muted)]">
              {en ? (
                <>
                  My strength is frontend with {chip(nextLogo, 'Next.js')} {chip(angularLogo, 'Angular')}{' '}
                  {chip(astroLogo, 'Astro')} and {chip(reactLogo, 'React')}, but I also build full
                  applications with {chip(nodeLogo, 'Node')} {chip(nestLogo, 'Nest')}{' '}
                  {chip(javaLogo, 'Java')} and {chip(pythonLogo, 'Python')}, using{' '}
                  {chip(flaskLogo, 'Flask')} or {chip(fastapiLogo, 'FastAPI')}.
                </>
              ) : (
                <>
                  Mi fuerte es el frontend con {chip(nextLogo, 'Next.js')} {chip(angularLogo, 'Angular')}{' '}
                  {chip(astroLogo, 'Astro')} y {chip(reactLogo, 'React')}, pero también construyo
                  aplicaciones completas con {chip(nodeLogo, 'Node')} {chip(nestLogo, 'Nest')}{' '}
                  {chip(javaLogo, 'Java')} y {chip(pythonLogo, 'Python')}, con{' '}
                  {chip(flaskLogo, 'Flask')} o {chip(fastapiLogo, 'FastAPI')}.
                </>
              )}
            </p>

            <p className="text-[var(--fg-muted)]">
              {en ? (
                <>
                  In my own projects I build automations with {chip(n8nLogo, 'n8n')} and explore AI
                  with {chip(pytorchLogo, 'PyTorch')} {chip(langchainLogo, 'LangChain')} and{' '}
                  {chip(tensorflowLogo, 'TensorFlow')} together with {chip(kerasLogo, 'Keras')}.
                </>
              ) : (
                <>
                  En proyectos propios armo automatizaciones con {chip(n8nLogo, 'n8n')} y exploro IA
                  con {chip(pytorchLogo, 'PyTorch')} {chip(langchainLogo, 'LangChain')} y{' '}
                  {chip(tensorflowLogo, 'TensorFlow')} junto a {chip(kerasLogo, 'Keras')}.
                </>
              )}
            </p>
          </div>

          {/* Cierre: CV y el me gusta, chicos, debajo del relato. */}
          <div data-profile-card className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={links.cv}
              download
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[var(--fg)] px-6 text-[0.95rem] font-semibold text-[var(--bg)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" {...stroke}>
                <path d="M12 3.5v11m0 0 4-4m-4 4-4-4" />
                <path d="M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
              </svg>
              {t(lang, 'Descargar CV', 'Download CV')}
            </a>

            {/* Sin datos todavía no se muestra, para no ofrecer un botón muerto. */}
            {stats && (
              <>
                <button
                  type="button"
                  onClick={toggleLike}
                  aria-pressed={liked}
                  aria-label={liked ? t(lang, 'Quitar me gusta', 'Unlike') : t(lang, 'Me gusta', 'Like')}
                  className={`${glass} inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-[0.95rem] font-medium transition-colors duration-200 ${
                    liked ? 'text-[#d32f2f] dark:text-[#ff8a80]' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                  }`}
                >
                  <span ref={heartRef} className="inline-flex">
                    <Heart
                      set={liked ? 'bulk' : 'light'}
                      primaryColor={liked ? '#d32f2f' : 'currentColor'}
                      size={20}
                    />
                  </span>
                  <span className="tnum">{formatCount(stats.likes)}</span>
                </button>
                <span className="text-sm text-[var(--fg-faint)]">
                  <span className="tnum font-semibold text-[var(--fg-muted)]">
                    {formatCount(stats.views)}
                  </span>{' '}
                  {t(lang, 'visitas', 'views')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Redes: sólo íconos, en fila ── */}
        <ul
          aria-label={t(lang, 'Redes', 'Socials')}
          className="mt-5 flex list-none flex-row flex-wrap justify-center gap-3"
        >
          {socials.map(({ label, href, icon }) => (
            <li key={label} data-hive-cell>
              <a
                href={href || undefined}
                aria-label={label}
                title={label}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={`${glass} grid h-16 w-16 place-items-center rounded-full text-[var(--fg)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--fg)] hover:text-[var(--bg)] dark:hover:bg-[var(--fg)]`}
              >
                {icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
