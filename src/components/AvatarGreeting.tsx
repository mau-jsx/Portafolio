import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { X, MessageCircle, Sparkles } from 'lucide-react';

export const AvatarGreeting: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (!desktop && isOpen) {
        setIsOpen(false);
      }
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, [isOpen]);

  useEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble || !isDesktop) return;

    if (isOpen) {
      bubble.style.display = 'block';
      gsap.fromTo(
        bubble,
        {
          opacity: 0,
          scale: 0.85,
          x: -15,
          transformOrigin: 'left center',
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.35,
          ease: 'back.out(1.4)',
        }
      );
    } else {
      gsap.to(bubble, {
        opacity: 0,
        scale: 0.85,
        x: -10,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          if (bubble) bubble.style.display = 'none';
        },
      });
    }
  }, [isOpen, isDesktop]);

  // Cerrar con Escape o clic afuera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        bubbleRef.current &&
        !bubbleRef.current.contains(e.target as Node) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAvatarClick = () => {
    // Solo permitir abrir el saludo en Desktop para no tapar el navbar en móvil
    if (isDesktop) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="fixed top-6 left-6 md:left-12 z-50 select-none">
      {/* Botón Avatar */}
      <button
        ref={avatarBtnRef}
        onClick={handleAvatarClick}
        aria-label="Avatar de Mauricio Heredia"
        className={`group relative flex items-center p-1 rounded-full bg-[#0d0d0d]/80 hover:bg-[#0d0d0d] dark:bg-[#0d0d0d]/80 dark:hover:bg-[#0d0d0d] backdrop-blur-2xl border border-black/10 dark:border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 ${
          isDesktop ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'
        }`}
      >
        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-black/15 dark:border-white/30">
          <img
            src="/avatar.jpg"
            alt="Mauricio Heredia"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </button>

      {/* Burbuja de Saludo hacia la Derecha (Solo visible en Desktop) */}
      {isDesktop && (
        <div
          ref={bubbleRef}
          style={{ display: 'none' }}
          className="absolute top-0 left-14 sm:left-16 w-[280px] sm:w-[320px] bg-[#F9F6EE] text-[#080808] dark:bg-[#141414] dark:text-[#F9F6EE] rounded-[1.8rem] rounded-tl-xs p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-black/10 dark:border-white/10 origin-left"
          role="dialog"
          aria-label="Saludo interactivo"
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between pb-2.5 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#0052FF] font-mono">
              <Sparkles size={13} />
              <span>¡Hola! Qué tal? 👋</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar saludo"
              className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-inherit"
            >
              <X size={12} />
            </button>
          </div>

          {/* Mensaje */}
          <div className="py-3">
            <p className="text-xs text-black/80 dark:text-white/80 font-medium leading-relaxed">
              Soy <strong className="text-[#080808] dark:text-white font-black">Mauricio Heredia</strong>, desarrollador frontend enfocado en animaciones interactivas de alto rendimiento con GSAP y Three.js.
            </p>
          </div>

          {/* Acción Rápida */}
          <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-500">Mauri.jsx</span>

            <a
              href="https://wa.me/3705022130"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00D26A] hover:bg-[#00E676] text-black font-black text-[10px] uppercase tracking-wider transition-transform duration-200 hover:scale-105 shadow-sm"
            >
              <MessageCircle size={12} /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarGreeting;
