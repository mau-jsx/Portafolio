import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HugeiconsIcon } from '@hugeicons/react';
// Iconly para la interfaz. Hugeicons queda sólo para lo que Iconly gratis no
// trae: logos de marca y el sol/luna del tema.
import {
  Sun02Icon,
  MoonIcon,
  Github01Icon,
  Linkedin01Icon,
  WhatsappIcon,
} from '@hugeicons/core-free-icons';
import { Home, User, Work, Folder, Call, ChevronDown, Message } from 'react-iconly';
import { navItems, links, getMailto } from '../data/site';
import { registerGsap, prefersReducedMotion, refreshOnLoad } from '../lib/motion';

/** Umbral de despegue: lo que hay que bajar para que la barra se compacte. */
const DETACH_AT = 72;

/** Un icono por sección. */
const SECTION_ICONS: Record<string, typeof Home> = {
  inicio: Home,
  perfil: User,
  experiencia: Work,
  proyectos: Folder,
  contacto: Call,
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
  const [isDark, setIsDark] = useState(true);
  // Vacío en el HTML servido; se llena recién al hidratar, en el navegador.
  const [mailto, setMailto] = useState('');

  useEffect(() => setMailto(getMailto()), []);

  const [detached, setDetached] = useState(false);
  const [isWide, setIsWide] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  /*
   * El retrato lo muestra la tarjeta que esté a la vista — la del hero o la de
   * Perfil — y la barra se lo queda cuando no hay ninguna. Mirar las tarjetas
   * y no las secciones es lo que hace que el imán agarre en el momento justo:
   * una sección es alta y entra en pantalla mucho antes que su tarjeta.
   */
  const [cardHolder, setCardHolder] = useState<string | null>('hero');
  const visibleCards = useRef(new Set<string>());
  const [panelAnimates, setPanelAnimates] = useState(false);
  const [active, setActive] = useState('inicio');

  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  /*
   * Arriba y con ancho, la barra completa: pestaña con tu nombre sobre la
   * barra de secciones. Al bajar — o en pantallas angostas, donde las
   * etiquetas no entran — todo se junta en una cápsula que despliega el menú.
   */
  const compact = detached || !isWide;

  /* Quién muestra el retrato en cada tramo del scroll. */
  const avatarHolder = cardHolder ?? 'nav';
  const hasAvatar = avatarHolder === 'nav';

  /* Foto del estado actual justo antes de cambiar de forma, para Flip. */
  const captureFlip = () => {
    flipState.current = Flip.getState('[data-flip-id]');
  };

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

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

      /*
       * Imán del retrato: cada tarjeta lo reclama mientras se la ve, y lo
       * suelta cuando se va por arriba, detrás de la barra.
       */
      document.querySelectorAll<HTMLElement>('[data-avatar-card]').forEach((card) => {
        const key = card.dataset.avatarCard ?? '';
        visibleCards.current.delete(key);

        ScrollTrigger.create({
          trigger: card,
          start: 'top bottom-=24',
          end: 'bottom 116px',
          invalidateOnRefresh: true,
          onToggle: (self) => {
            captureFlip();
            if (self.isActive) visibleCards.current.add(key);
            else visibleCards.current.delete(key);

            const cards = visibleCards.current;
            setCardHolder(cards.has('hero') ? 'hero' : cards.has('perfil') ? 'perfil' : null);
          },
        });
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

    // El hero muestra el retrato mientras la barra no se lo lleve.
    window.dispatchEvent(
      new CustomEvent('portfolio:nav-avatar', { detail: { holder: avatarHolder } }),
    );

    if (!state || prefersReducedMotion()) return;

    const flight = () =>
      Flip.from(state, {
        targets: document.querySelectorAll('[data-flip-id]'),
        duration: 0.6,
        ease: 'expo.out',
        nested: true,
        prune: true,
      });

    /*
     * Hacia la barra el destino ya existe. De vuelta a una tarjeta hay que
     * esperar un cuadro: el destino vive en otra isla de React y todavía no
     * terminó de dibujarse.
     */
    if (hasAvatar) flight();
    else requestAnimationFrame(flight);
    gsap.from('[data-nav-content]', {
      opacity: 0,
      duration: 0.3,
      delay: 0.18,
      ease: 'power1.out',
    });
  }, [compact, avatarHolder]);

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

  const applyTheme = (next: boolean) => {
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.style.colorScheme = next ? 'dark' : 'light';
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  };

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = !isDark;
    const startViewTransition = (
      document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
    ).startViewTransition;

    if (!startViewTransition || prefersReducedMotion()) {
      applyTheme(next);
      return;
    }

    // El tema se abre desde el botón: el origen del cambio queda a la vista.
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    startViewTransition.call(document, () => applyTheme(next)).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 640,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  };

  const activeItem = navItems.find((item) => item.href.slice(1) === active) ?? navItems[0];
  const ActiveIcon = SECTION_ICONS[activeItem.href.slice(1)];

  const iconButton =
    'grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--fg-muted)] transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--accent)_24%,transparent)] hover:text-[var(--fg)]';

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
        className={`flex items-center gap-2 rounded-full pr-3.5 text-sm font-medium transition-all duration-300 ${
          stacked ? 'min-h-11 w-full' : 'min-h-9'
        } ${
          isActive
            ? 'bg-[color-mix(in_srgb,var(--accent)_52%,transparent)] pl-1.5 text-[var(--fg)]'
            : 'pl-3 text-[var(--fg-muted)] hover:bg-[color-mix(in_srgb,var(--accent)_24%,transparent)] hover:text-[var(--fg)]'
        }`}
      >
        <span
          aria-hidden="true"
          className={`grid shrink-0 place-items-center rounded-full transition-all duration-300 ${
            isActive ? 'h-7 w-7 bg-[var(--fg)] text-[var(--bg)]' : 'h-5 w-5 text-current'
          }`}
        >
          <Icon set="light" primaryColor="currentColor" size={isActive ? 15 : 17} />
        </span>
        {item.label}
      </a>
    );
  };

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={iconButton}
    >
      <HugeiconsIcon icon={isDark ? Sun02Icon : MoonIcon} size={16} strokeWidth={1.7} />
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
              className={`flex min-h-11 items-center gap-2.5 py-1 pr-3.5 ${
                hasAvatar ? 'pl-1' : 'pl-3.5'
              }`}
            >
              {hasAvatar && (
                <img
                  data-flip-id="nav-avatar"
                  src={avatar}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 rounded-full bg-[var(--bg)] object-cover"
                />
              )}
              <span
                data-nav-content
                className="flex items-center gap-2 text-sm font-medium text-[var(--fg)]"
              >
                <ActiveIcon set="light" primaryColor="currentColor" size={17} />
                {activeItem.label}
                <span
                  aria-hidden="true"
                  className={`grid text-[var(--fg-muted)] transition-transform duration-300 ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDown set="light" primaryColor="currentColor" size={16} />
                </span>
              </span>
              <span className="sr-only">
                {menuOpen ? 'Cerrar menú' : 'Abrir menú de secciones'}
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
            <nav aria-label="Secciones" className="flex flex-col gap-0.5">
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
              {themeButton}
            </div>
          </div>
        </div>
      ) : (
        /* ── Barra completa: pestaña + barra de secciones ───────────── */
        <div className="pointer-events-auto mx-auto mt-5 flex w-fit max-w-[94vw] flex-col items-center">
          <div
            data-flip-id="nav-surface"
            className="nav-surface flex items-center gap-1 rounded-full p-1"
          >
            <nav
              data-nav-content
              aria-label="Secciones"
              className="flex items-center gap-0.5"
            >
              {navItems.map((item) => sectionLink(item))}
            </nav>
            <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-[var(--rule)]" />
            <div data-nav-content>{themeButton}</div>
          </div>
        </div>
      )}
    </header>
  );
}
