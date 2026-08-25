import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MessageCircle } from 'lucide-react';
import fondoImg from '../assets/fondo.jpg';
import iconsImg from '../assets/icons.jpg';

export const HeroScrollExpand: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconBoxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const card = cardRef.current;
    const iconBox = iconBoxRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const desc = descRef.current;
    const cta = ctaRef.current;
    const img = imageRef.current;

    if (!container || !card || !title) return;

    // 1. Animación suave de entrada al cargar
    const entryTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    entryTl
      .fromTo(
        card,
        { scale: 0.96, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.9 }
      )
      .fromTo(
        iconBox,
        { scale: 0.8, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5 },
        '-=0.5'
      )
      .fromTo(
        [title, subtitle],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        '-=0.4'
      )
      .fromTo(
        [desc, cta],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        '-=0.4'
      );

    // 2. Efecto de Scroll en Desktop: expansión armónica
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=100%',
          scrub: 1.2,
          pin: true,
        },
      });

      scrollTl
        .to(card, {
          width: '98vw',
          maxWidth: '98vw',
          height: '92vh',
          borderRadius: '2.5rem',
          paddingLeft: '5vw',
          paddingRight: '5vw',
          ease: 'power1.inOut',
        }, 0)
        .to(
          title,
          {
            letterSpacing: '0.03em',
            scale: 1.03,
            ease: 'power1.out',
          },
          0
        )
        .to(
          img,
          {
            scale: 1.15,
            yPercent: 8,
            ease: 'none',
          },
          0
        );
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center pt-24 md:pt-28 pb-10 px-3 sm:px-6 md:px-8 select-none font-poppins"
    >
      {/* TARJETA GIGANTE CON fondo.jpg */}
      <div
        ref={cardRef}
        className="relative w-full max-w-7xl h-[84vh] min-h-[540px] rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center text-center p-6 sm:p-10 md:p-14"
      >
        {/* IMAGEN DE FONDO fondo.jpg */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            ref={imageRef}
            src={fondoImg.src}
            alt="Fondo Portafolio"
            className="w-full h-full object-cover object-center transform scale-105 will-change-transform brightness-[0.92] dark:brightness-[0.75] contrast-[1.05]"
          />
          {/* Gradientes suaves para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/45 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/80 pointer-events-none" />
        </div>

        {/* CONTENIDO CENTRADO */}
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center my-auto pt-6 sm:pt-4">
          
          {/* ÍCONO SUPERIOR LIMPIO (SIN EFECTO NEÓN) */}
          <div
            ref={iconBoxRef}
            className="relative mb-5 sm:mb-6"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-white/30 shadow-xl bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <img
                src={iconsImg.src}
                alt="Mauricio Icon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/avatar.jpg';
                }}
              />
            </div>
          </div>

          {/* NOMBRE EN GRANDE Y EN BLANCO PURO */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] text-white drop-shadow-2xl font-poppins transition-all will-change-transform"
          >
            Mauricio Heredia
          </h1>

          {/* ROL / SUBTÍTULO */}
          <p
            ref={subtitleRef}
            className="text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-white/95 mt-2 font-poppins drop-shadow-md"
          >
            Desarrollador Fullstack
          </p>

          {/* DESCRIPCIÓN PERSONALIZADA */}
          <p
            ref={descRef}
            className="mt-4 sm:mt-5 text-white/85 text-xs sm:text-sm md:text-base max-w-xl font-light leading-relaxed drop-shadow-md font-poppins text-center"
          >
            Desarrollador de Software Multiplataforma enfocado en el desarrollo frontend, experiencias interactivas y arquitectura web moderna.
          </p>

          {/* BOTONES DE ACCIÓN CENTRADOS */}
          <div
            ref={ctaRef}
            className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#portafolio"
              className="px-6 sm:px-7 py-3 rounded-full bg-white text-black hover:bg-[#F9F6EE] font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 font-poppins"
            >
              Ver Proyectos <ArrowRight size={14} />
            </a>

            <a
              href="https://wa.me/3705022130"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-white/15 hover:bg-[#00D26A] hover:text-black text-white backdrop-blur-md border border-white/25 font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 font-poppins"
            >
              <MessageCircle size={14} /> Contactar
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroScrollExpand;
