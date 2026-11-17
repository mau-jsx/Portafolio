import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HugeiconsIcon } from '@hugeicons/react';
// Iconly para la interfaz. Hugeicons queda sólo para lo que Iconly gratis no
// trae: logos de marca y el globo del idioma.
import {
  Globe02Icon,
  Github01Icon,
  Linkedin01Icon,
  WhatsappIcon,
} from '@hugeicons/core-free-icons';
import { Home, User, Work, Call, ChevronDown, Message } from 'react-iconly';
import { navItems, links, getMailto } from '../data/site';
import { registerGsap, prefersReducedMotion, refreshOnLoad } from '../lib/motion';
import { useLang, setLang, t } from '../lib/i18n';

/** Umbral de despegue: lo que hay que bajar para que la barra se compacte. */
const DETACH_AT = 72;

/** Un icono por sección. */
const SECTION_ICONS: Record<string, typeof Home> = {
  inicio: Home,
  perfil: User,
  trabajo: Work,
  contacto: Call,
};

/** Nombre de cada sección en inglés; el español sale de `navItems`. */
const LABELS_EN: Record<string, string> = {
  inicio: 'Home',
  perfil: 'Profile',
  trabajo: 'Work',
  contacto: 'Contact',
};

/** Redes al pie del menú de la cápsula. */
const SOCIALS = [
  { label: 'GitHub', href: links.github, icon: <HugeiconsIcon icon={Github01Icon} size={16} strokeWidth={1.7} /> },
  { label: 'LinkedIn', href: links.linkedin, icon: <HugeiconsIcon icon={Linkedin01Icon} size={16} strokeWidth={1.7} /> },
  { label: 'WhatsApp', href: links.whatsapp, icon: <HugeiconsIcon icon={WhatsappIcon} size={16} strokeWidth={1.7} /> },
  // Sin href fijo: el correo se arma al hidratar, no viaja en el HTML.
  { label: 'Email', href: '', icon: <Message set="light" primaryColor="currentColor" size={17} /> },
];

interface NavProps {
  /** Retrato de la pestaña y de la cápsula, ya optimizado por Astro. */
  avatar: string;
}

export default function Nav({ avatar }: NavProps) {
  const lang = useLang();
  const labelOf = (item: (typeof navItems)[number]) =>
    lang === 'en' ? LABELS_EN[item.href.slice(1)] : item.label;
  // Vacío en el HTML servido; se llena recién al hidratar, en el navegador.
  const [mailto, setMailto] = useState('');

  useEffect(() => setMailto(getMailto()), []);

  const [detached, setDetached] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelAnimates, setPanelAnimates] = useState(false);
  const [active, setActive] = useState('inicio');

  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  // El vuelo en curso, para cortarlo si llega otro cambio antes de que termine.
  const flipTween = useRef<gsap.core.Timeline | null>(null);
  // El vuelo de vuelta a una tarjeta espera un cuadro; si llega otro cambio
  // antes, ese vuelo pendiente se cancela en vez de correr con datos viejos.
  const flipFrame = useRef(0);

  /*
   * Arriba y con ancho, la barra completa: pestaña con tu nombre sobre la
   * barra de secciones. Al bajar — o en pantallas angostas, donde las
   * etiquetas no entran — todo se junta en una cápsula que despliega el menú.
   */
  const compact = detached || !isWide;

  /*
   * La cápsula lleva su propio retrato, siempre. Antes uno solo viajaba entre
   * el hero, la barra y Perfil, y en cada pase desaparecía de un lado antes
   * de aparecer en el otro.
   */
  const hasAvatar = true;

  /*
   * Medidas que Flip escribe en línea mientras anima. Se borran a mano al
   * terminar y antes de medir: si alguna queda, la barra se queda con el ancho
   * de la cápsula (pasaba en Firefox, donde los cambios llegan más seguidos).
   */
  const clearFlipSizes = () =>
    gsap.set('[data-flip-id]', { clearProps: 'width,height,transform,top,left,position' });

  /* Foto del estado actual justo antes de cambiar de forma, para Flip. */
  const captureFlip = () => {
    // Si un vuelo sigue en curso se termina de golpe: limpia el ancho y el
    // alto que escribió. Medir a mitad de camino deja ese tamaño pegado.
    cancelAnimationFrame(flipFrame.current);
    flipTween.current?.progress(1).kill();
    flipTween.current = null;
    clearFlipSizes();
    flipState.current = Flip.getState('[data-flip-id]');
  };

  /* Ancho disponible: debajo de md la barra completa no entra. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsWide(mq.matches);

    const onChange = (event: MediaQueryListEvent) => {
      captureFlip();
      setIsWide(event.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Despegue y sección activa. */
  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: DETACH_AT,
        end: 'max',
        onToggle: (self) => {
          captureFlip();
          setDetached(self.isActive);
        },
      });

      navItems.forEach(({ href }) => {
        const section = document.getElementById(href.slice(1));
        if (!section) return;

        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActive(href.slice(1)),
        });
      });
    });

    // Las posiciones se miden antes de que entren la tipografía y las
    // imágenes; el helper vuelve a medir cuando todo cargó.
    refreshOnLoad();

    return () => ctx.revert();
  }, []);

  /*
   * El cambio de forma: la superficie y el avatar viajan de un estado al otro
   * (mismo data-flip-id en ambos) y el contenido nuevo entra con un fundido
   * corto, para no verse estirado mientras la caja crece o se encoge.
   */
  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    setMenuOpen(false);
    // El panel se monta de nuevo con cada cambio de forma: sin transición
    // hasta que se toque la cápsula, o nace animando de visible a oculto.
    setPanelAnimates(false);

    if (!state || prefersReducedMotion()) return;

    const flight = () => {
      flipTween.current = Flip.from(state, {
        targets: document.querySelectorAll('[data-flip-id]'),
        duration: 0.6,
        ease: 'expo.out',
        nested: true,
        prune: true,
        onComplete: clearFlipSizes,
      });
    };

    flight();
    // fromTo y no from: si un fundido se corta a la mitad, `from` tomaría
    // esa opacidad a medias como destino y el contenido quedaría apagado.
    gsap.fromTo(
      '[data-nav-content]',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, delay: 0.18, ease: 'power1.out', overwrite: true },
    );
  }, [compact]);

  /* Menú de la cápsula: foco adentro al abrir, Escape y click afuera cierran. */
  useEffect(() => {
    if (!menuOpen) return;

    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };

    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [menuOpen]);

  const activeItem = navItems.find((item) => item.href.slice(1) === active) ?? navItems[0];
  const ActiveIcon = SECTION_ICONS[activeItem.href.slice(1)];

  const iconButton =
    'grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--fg-muted)] transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--accent)_24%,transparent)] hover:text-[var(--fg)]';

  /* Enlace de sección: el activo lleva píldora verde y el icono en su disco. */
  const sectionLink = (item: (typeof navItems)[number], stacked = false) => {
    const id = item.href.slice(1);
    const isActive = active === id;
    const Icon = SECTION_ICONS[id];

    return (
      <a
        key={item.href}
        href={item.href}
        onClick={() => setMenuOpen(false)}
        aria-current={isActive ? 'true' : undefined}
        className={`flex min-h-11 items-center gap-2.5 rounded-full pr-4 text-[0.95rem] font-medium transition-all duration-300 ${
          stacked ? 'w-full' : ''
        } ${
          isActive
            ? 'bg-[color-mix(in_srgb,var(--accent)_52%,transparent)] pl-1.5 text-[var(--fg)]'
            : 'pl-3.5 text-[var(--fg-muted)] hover:bg-[color-mix(in_srgb,var(--accent)_24%,transparent)] hover:text-[var(--fg)]'
        }`}
      >
        <span
          aria-hidden="true"
          className={`grid shrink-0 place-items-center rounded-full transition-all duration-300 ${
            isActive ? 'h-8 w-8 bg-[var(--fg)] text-[var(--bg)]' : 'h-6 w-6 text-current'
          }`}
        >
          <Icon set="light" primaryColor="currentColor" size={isActive ? 17 : 19} />
        </span>
        {labelOf(item)}
      </a>
    );
  };

  /* Idioma: globo con el código del idioma actual; un toque cambia al otro. */
  const langButton = (
    <button
      type="button"
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      aria-label={t(lang, 'Cambiar idioma a inglés', 'Switch language to Spanish')}
      className="flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-[var(--fg-muted)] transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--accent)_24%,transparent)] hover:text-[var(--fg)]"
    >
      <HugeiconsIcon icon={Globe02Icon} size={18} strokeWidth={1.7} />
      <span className="tnum">{lang === 'en' ? 'EN' : 'ES'}</span>
    </button>
  );

  return (
    <header ref={headerRef} className="nav-root pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className={`nav-scrim absolute inset-x-0 top-0 ${compact ? 'is-detached' : ''}`}
      />

      {compact ? (
        /* ── Cápsula ─────────────────────────────────────────────────── */
        <div className="pointer-events-auto relative mx-auto mt-4 w-fit">
          <div
            data-flip-id="nav-surface"
            className="nav-surface overflow-hidden rounded-full shadow-[0_10px_32px_-18px_rgb(0_0_0/0.45)]"
          >
            <button
              ref={toggleRef}
              type="button"
              onClick={() => {
                setPanelAnimates(true);
                setMenuOpen((v) => !v);
              }}
              aria-expanded={menuOpen}
              aria-controls="nav-panel"
              className={`flex min-h-12 items-center gap-3 py-1 pr-4 ${
                hasAvatar ? 'pl-1' : 'pl-4'
              }`}
            >
              {hasAvatar && (
                <img
                  data-flip-id="nav-avatar"
                  src={avatar}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 shrink-0 rounded-full bg-[var(--bg)] object-cover"
                />
              )}
              <span
                data-nav-content
                className="flex items-center gap-2 text-[0.95rem] font-medium text-[var(--fg)]"
              >
                <ActiveIcon set="light" primaryColor="currentColor" size={19} />
                {labelOf(activeItem)}
                <span
                  aria-hidden="true"
                  className={`grid text-[var(--fg-muted)] transition-transform duration-300 ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDown set="light" primaryColor="currentColor" size={18} />
                </span>
              </span>
              <span className="sr-only">
                {menuOpen
                  ? t(lang, 'Cerrar menú', 'Close menu')
                  : t(lang, 'Abrir menú de secciones', 'Open sections menu')}
              </span>
            </button>
          </div>

          <div
            id="nav-panel"
            ref={panelRef}
            inert={!menuOpen}
            className={`nav-surface absolute left-1/2 top-full -ml-32 mt-2 w-64 rounded-3xl p-2 shadow-[0_18px_48px_-20px_rgb(0_0_0/0.5)] ${
              panelAnimates ? 'transition-[opacity,translate] duration-200 ease-out' : ''
            } ${menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
          >
            <nav aria-label={t(lang, 'Secciones', 'Sections')} className="flex flex-col gap-0.5">
              {navItems.map((item) => sectionLink(item, true))}
            </nav>
            <div className="mt-2 flex items-center justify-between border-t border-[var(--rule)] px-1 pt-2">
              <ul className="flex items-center gap-0.5">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href || mailto}
                      target={social.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      aria-label={social.label}
                      className={iconButton}
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
              <span aria-hidden="true" className="h-5 w-px bg-[var(--rule)]" />
              {langButton}
            </div>
          </div>
        </div>
      ) : (
        /* ── Barra completa: pestaña + barra de secciones ───────────── */
        <div className="pointer-events-auto mx-auto mt-5 flex w-fit max-w-[94vw] flex-col items-center">
          <div
            data-flip-id="nav-surface"
            className="nav-surface flex items-center gap-1 rounded-full p-1.5 shadow-[0_10px_32px_-20px_rgb(0_0_0/0.4)]"
          >
            <nav
              data-nav-content
              aria-label={t(lang, 'Secciones', 'Sections')}
              className="flex items-center gap-0.5"
            >
              {navItems.map((item) => sectionLink(item))}
            </nav>
            <span aria-hidden="true" className="mx-1 h-6 w-px bg-[var(--rule)]" />
            <div data-nav-content>{langButton}</div>
          </div>
        </div>
      )}
    </header>
  );
}
