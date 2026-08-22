import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Menu, X, ArrowUpRight, Github, Linkedin, MessageCircle, Mail, Sparkles } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Moon01Icon, Sun02Icon } from '@hugeicons/core-free-icons';

interface MenuItem {
  num: string;
  name: string;
  href: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { num: '01', name: 'Inicio', href: '#hero' },
  { num: '02', name: 'Portafolio', href: '#proyectos' },
  { num: '03', name: 'Habilidades', href: '#skills' },
  { num: '04', name: 'Servicios', href: '#servicios' },
  { num: '05', name: 'Sobre Mí', href: '#about' },
  { num: '06', name: 'Contacto', href: '#contacto', badge: 'Online' },
];

export const StaggeredNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Inicio');
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const menuCardRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const connectCardRef = useRef<HTMLDivElement>(null);
  const rippleOverlayRef = useRef<HTMLDivElement>(null);

  // Inicializar estado de tema y responsive
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDark(initialDark);

    if (initialDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }

    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Animación Circular Dinámica de Pantalla Completa (Circular Ripple Effect)
  const toggleThemeWithRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const x = buttonRect.left + buttonRect.width / 2;
    const y = buttonRect.top + buttonRect.height / 2;

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Aplicar cambio de clases y almacenamiento inmediatamente
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    const overlay = rippleOverlayRef.current;
    if (overlay) {
      const newBgColor = nextDark ? '#080808' : '#F9F6EE';
      overlay.style.backgroundColor = newBgColor;
      overlay.style.display = 'block';

      gsap.fromTo(
        overlay,
        {
          clipPath: `circle(0px at ${x}px ${y}px)`,
          opacity: 1,
        },
        {
          clipPath: `circle(${maxRadius}px at ${x}px ${y}px)`,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            overlay.style.display = 'none';
          },
        }
      );
    }
  };

  // Animación de apertura y cierre del menú con GSAP
  useEffect(() => {
    const card = menuCardRef.current;
    const backdrop = backdropRef.current;
    const items = linksRef.current.filter(Boolean);
    const connect = connectCardRef.current;

    if (!card) return;

    if (isOpen) {
      card.style.display = 'flex';
      if (backdrop) backdrop.style.display = 'block';

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (backdrop) {
        tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0);
      }

      tl.fromTo(
        card,
        {
          opacity: 0,
          scale: 0.85,
          y: -15,
          transformOrigin: 'top center',
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: 'back.out(1.25)',
        },
        0
      );

      if (items.length > 0) {
        tl.fromTo(
          items,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power3.out' },
          '-=0.25'
        );
      }

      if (connect && isDesktop) {
        tl.fromTo(
          connect,
          { opacity: 0, scale: 0.95, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' },
          '-=0.25'
        );
      }
    } else {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.in' },
        onComplete: () => {
          if (card) card.style.display = 'none';
          if (backdrop) backdrop.style.display = 'none';
        },
      });

      if (backdrop) {
        tl.to(backdrop, { opacity: 0, duration: 0.2 }, 0);
      }

      tl.to(card, { opacity: 0, scale: 0.9, y: -10, duration: 0.2 }, 0);
    }
  }, [isOpen, isDesktop]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleItemClick = (name: string) => {
    setActiveItem(name);
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay para la animación circular dinámica de tema (solo en el fondo, debajo del contenido y navbar) */}
      <div
        ref={rippleOverlayRef}
        style={{ display: 'none' }}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* NAVBAR CENTRADO Y COMPACTO EN EL MEDIO */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <nav className="flex items-center gap-2 bg-[#0d0d0d]/85 hover:bg-[#0d0d0d] text-[#F9F6EE] p-1.5 px-3 rounded-full border border-white/20 shadow-[0_15px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 select-none">
          
          {/* Botón Trigger del Menú */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="group flex items-center gap-2.5 bg-[#F9F6EE] hover:bg-white text-[#080808] pl-2 pr-4 py-1.5 rounded-full font-black text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-[#080808] text-[#F9F6EE] flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
              {isOpen ? <X size={12} strokeWidth={3} /> : <Menu size={12} strokeWidth={3} />}
            </div>
            <span>{isOpen ? 'CERRAR' : 'MENU'}</span>
          </button>

          {/* Separador vertical */}
          <div className="w-px h-5 bg-white/20 my-auto" />

          {/* Botón de Modo Oscuro / Modo Claro con Hugeicons y Animación Circular */}
          <button
            onClick={toggleThemeWithRipple}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
            title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {isDark ? (
              <HugeiconsIcon icon={Moon01Icon} size={18} color="#F9F6EE" strokeWidth={1.75} />
            ) : (
              <HugeiconsIcon icon={Sun02Icon} size={18} color="#00D26A" strokeWidth={1.75} />
            )}
          </button>

        </nav>
      </div>

      {/* Backdrop oscuro para enfocar el menú */}
      <div
        ref={backdropRef}
        onClick={() => setIsOpen(false)}
        style={{ display: 'none' }}
        className="fixed inset-0 z-40 bg-black/65 backdrop-blur-xs cursor-pointer"
        aria-hidden="true"
      />

      {/* BURBUJA DESPLEGABLE HORIZONTAL (DESKTOP) / VERTICAL (MÓVIL) CENTRADA */}
      <div
        ref={menuCardRef}
        style={{ display: 'none' }}
        className={`fixed z-50 bg-[#F9F6EE] text-[#080808] rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.9)] border border-black/10 select-none overflow-hidden ${
          isDesktop
            ? 'top-20 left-1/2 -translate-x-1/2 w-[760px] max-w-[calc(100vw-4rem)] p-8 md:p-10 flex-col md:flex-row gap-8'
            : 'top-20 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] sm:w-[380px] p-7 flex-col gap-4'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navegación principal"
      >
        {/* COLUMNA 1: Enlaces de Navegación Staggered */}
        <div className="flex-1 flex flex-col justify-between">
          
          {/* Header de la columna */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0052FF]" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black/50 font-mono">
                NAVEGACIÓN
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú"
              className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/15 flex items-center justify-center transition-all duration-200 cursor-pointer hover:rotate-90"
            >
              <X size={15} className="text-[#080808]" />
            </button>
          </div>

          {/* Lista de enlaces */}
          <nav className="flex flex-col py-3 gap-1">
            {menuItems.map((item, index) => {
              const isActive = activeItem === item.name;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  ref={(el) => {
                    linksRef.current[index] = el;
                  }}
                  onClick={() => handleItemClick(item.name)}
                  className={`group flex items-center justify-between py-2 px-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-black/5 text-[#080808]'
                      : 'text-black/60 hover:text-[#080808] hover:bg-black/[0.03]'
                  }`}
                >
                  <div className="flex items-baseline gap-3.5">
                    <span className="font-mono text-[11px] font-bold text-black/30 group-hover:text-[#0052FF] transition-colors">
                      {item.num}
                    </span>
                    <span className="text-xl sm:text-2xl font-black uppercase tracking-tight transition-transform duration-200 group-hover:translate-x-1.5">
                      {item.name}
                    </span>
                  </div>

                  {item.badge ? (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00D26A] text-black shadow-xs">
                      {item.badge}
                    </span>
                  ) : (
                    <ArrowUpRight
                      size={16}
                      className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-black/40"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Footer en móvil */}
          {!isDesktop && (
            <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs text-black/70">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-pulse" />
                <span className="text-[11px] font-semibold">Disponible</span>
              </div>
              <a
                href="https://wa.me/3705022130"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#080808] text-[#F9F6EE] text-[10px] font-black uppercase tracking-wider"
              >
                <MessageCircle size={11} /> WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* COLUMNA 2: WIDGET DE CONTACTO, WHATSAPP & LINKEDIN (SOLO EN DESKTOP) */}
        {isDesktop && (
          <div
            ref={connectCardRef}
            className="w-[300px] bg-[#080808] text-[#F9F6EE] rounded-[2rem] p-6 flex flex-col justify-between shadow-xl border border-black/5"
          >
            {/* Header del widget */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D26A] font-bold flex items-center gap-1.5">
                  <Sparkles size={12} /> Contacto Directo
                </span>
                <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-pulse" />
              </div>

              <div className="py-4">
                <h4 className="text-base font-black uppercase tracking-tight text-[#F9F6EE]">
                  Mauricio Heredia
                </h4>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">
                  Frontend & Creative Developer
                </p>
                <p className="text-[11px] text-zinc-500 mt-3 leading-relaxed">
                  Listo para colaborar en proyectos web innovadores con React, Astro, GSAP y Three.js.
                </p>
              </div>
            </div>

            {/* Redes y Accesos directos (WhatsApp, LinkedIn, GitHub, Email) */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              
              {/* WhatsApp Burbuja destacada */}
              <a
                href="https://wa.me/3705022130"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#00D26A] hover:bg-[#00E676] text-black font-black text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-md shadow-[#00D26A]/20"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </div>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/mauricio-heredia"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-[#0052FF] text-white hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                </div>
                <ArrowUpRight size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* GitHub & Email row */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <a
                  href="https://github.com/mau-jsx"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-zinc-300 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  <Github size={13} /> GitHub
                </a>

                <a
                  href="mailto:maurih46322945@gmail.com"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-zinc-300 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  <Mail size={13} /> Email
                </a>
              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
};

export default StaggeredNavbar;
