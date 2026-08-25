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
  { num: '02', name: 'Sobre mí', href: '#sobre-mi' },
  { num: '03', name: 'Portafolio', href: '#portafolio' },
  { num: '04', name: 'Experiencia y Formación', href: '#experiencia' },
  { num: '05', name: 'Contacto', href: '#contacto', badge: 'Online' },
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

  // Animación de apertura y cierre del menú con GSAP en el contenedor centrado
  useEffect(() => {
    const card = menuCardRef.current;
    const backdrop = backdropRef.current;
    const items = linksRef.current.filter(Boolean);
    const connect = connectCardRef.current;

    if (!card || !backdrop) return;

    if (isOpen) {
      backdrop.style.display = 'flex';

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0);

      tl.fromTo(
        card,
        {
          opacity: 0,
          scale: 0.88,
          y: -20,
          transformOrigin: 'top center',
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: 'back.out(1.2)',
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
          backdrop.style.display = 'none';
        },
      });

      tl.to(backdrop, { opacity: 0, duration: 0.2 }, 0);
      tl.to(card, { opacity: 0, scale: 0.9, y: -10, duration: 0.2 }, 0);
    }
  }, [isOpen, isDesktop]);

  return (
    <>
      {/* CAPA DE ANIMACIÓN CIRCULAR DE CAMBIO DE TEMA */}
      <div
        ref={rippleOverlayRef}
        style={{ display: 'none' }}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* ======================================================== */}
      {/* NAVBAR MAESTRO UNIFICADO: AVATAR + MENU + THEME TOGGLE   */}
      {/* ======================================================== */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <nav className="flex items-center gap-2 bg-[#0d0d0d]/90 hover:bg-[#0d0d0d] text-[#F9F6EE] p-1.5 px-2 rounded-full border border-white/20 shadow-[0_15px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 select-none">
          
          {/* Botón Trigger del Menú con Avatar Integrado */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú de navegación y contacto'}
            className="group flex items-center gap-2.5 bg-[#F9F6EE] hover:bg-white text-[#080808] pl-1.5 pr-4 py-1.5 rounded-full font-black text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-poppins"
          >
            {/* Avatar Circular Integrado */}
            <div className="w-7 h-7 rounded-full overflow-hidden border border-black/15 bg-black shrink-0">
              <img
                src="/avatar.jpg"
                alt="Mauricio Heredia"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/favicon.svg';
                }}
              />
            </div>

            <span>{isOpen ? 'CERRAR' : 'MENU'}</span>

            <div className="w-5 h-5 rounded-full bg-[#080808] text-[#F9F6EE] flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
              {isOpen ? <X size={11} strokeWidth={3} /> : <Menu size={11} strokeWidth={3} />}
            </div>
          </button>

          {/* Separador vertical */}
          <div className="w-px h-5 bg-white/20 my-auto" />

          {/* Botón de Modo Oscuro / Claro con Hugeicons */}
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

      {/* ======================================================== */}
      {/* CONTENEDOR MAESTRO DE CENTRADO ABSOLUTO (FLEXBOX OVERLAY) */}
      {/* ======================================================== */}
      <div
        ref={backdropRef}
        onClick={() => setIsOpen(false)}
        style={{ display: 'none' }}
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 sm:pt-28 pb-10 px-4 cursor-pointer overflow-y-auto"
        aria-hidden="true"
      >
        {/* TARJETA DEL MENÚ PERFECTAMENTE CENTRADA */}
        <div
          ref={menuCardRef}
          onClick={(e) => e.stopPropagation()}
          className={`relative bg-[#F9F6EE] text-[#080808] rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.9)] border border-black/10 select-none overflow-hidden cursor-default w-full ${
            isDesktop
              ? 'max-w-[780px] p-8 md:p-10 flex flex-row gap-8'
              : 'max-w-[390px] p-6 sm:p-7 flex flex-col gap-6'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navegación principal y contacto"
        >
          {/* COLUMNA 1: Las 5 Secciones de Navegación */}
          <div className="flex-1 flex flex-col justify-between">
            
            {/* Header de la columna */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0052FF]" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black/50 font-mono">
                  NAVEGACIÓN
                </span>
              </div>

              {/* Botón de cierre rápido */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar ventana"
                className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Lista de las 5 secciones */}
            <ul className="flex flex-col gap-1.5 my-4">
              {menuItems.map((item, index) => {
                const isActive = activeItem === item.name;
                return (
                  <li key={item.num}>
                    <a
                      ref={(el) => {
                        linksRef.current[index] = el;
                      }}
                      href={item.href}
                      onClick={() => {
                        setActiveItem(item.name);
                        setIsOpen(false);
                      }}
                      className={`group flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'bg-black/10 text-black font-black'
                          : 'hover:bg-black/5 text-black/75 hover:text-black font-extrabold'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono font-medium text-black/40 group-hover:text-[#0052FF] transition-colors">
                          {item.num}
                        </span>
                        <span className="text-lg sm:text-xl uppercase tracking-tight font-poppins">
                          {item.name}
                        </span>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00D26A] text-black uppercase tracking-wider shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Footer de navegación */}
            <div className="pt-3 border-t border-black/10 flex items-center justify-between text-[11px] font-mono text-black/50">
              <span>Mauricio Heredia · 2026</span>
              <span className="flex items-center gap-1 text-[#0052FF] font-bold">
                <Sparkles size={12} /> Frontend Craft
              </span>
            </div>

          </div>

          {/* COLUMNA 2: Tarjeta de Contacto Directo Unificada */}
          <div
            ref={connectCardRef}
            className={`flex flex-col justify-between bg-[#0d0d0d] text-[#F9F6EE] rounded-[2rem] p-6 shadow-xl border border-white/10 ${
              isDesktop ? 'w-[320px]' : 'w-full'
            }`}
          >
            {/* Header de contacto */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#00D26A] flex items-center gap-1.5">
                <Sparkles size={12} /> CONTACTO DIRECTO
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-pulse" />
            </div>

            {/* Perfil */}
            <div className="my-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-black">
                  <img
                    src="/avatar.jpg"
                    alt="Mauricio Heredia"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-black uppercase tracking-tight text-white font-poppins">
                    Mauricio Heredia
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium">
                    Frontend & Creative Dev
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                Listo para colaborar en proyectos innovadores con React, Astro, GSAP y Three.js.
              </p>
            </div>

            {/* Botones de acción rápida */}
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/3705022130"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#00D26A] hover:bg-[#00E676] text-black font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all duration-200 shadow-md hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={15} /> WhatsApp
                </span>
                <ArrowUpRight size={14} />
              </a>

              <a
                href="https://www.linkedin.com/in/mauricio-heredia-07a829285/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  <Linkedin size={14} /> LinkedIn
                </span>
                <ArrowUpRight size={14} />
              </a>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <a
                  href="https://github.com/mau-jsx"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                >
                  <Github size={13} /> GitHub
                </a>

                <a
                  href="mailto:mauricioheredia459@gmail.com"
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                >
                  <Mail size={13} /> Email
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default StaggeredNavbar;
