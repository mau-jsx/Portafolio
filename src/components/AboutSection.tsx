import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  GraduationCapIcon, 
  LaptopProgrammingIcon, 
  AiPaintbrushIcon, 
  Layers01Icon, 
  CpuIcon,
  SparklesIcon,
  CheckmarkCircle02Icon
} from '@hugeicons/core-free-icons';
import { MaskedHeading } from './MaskedHeading';

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!container || cards.length === 0) return;

    // Animación de entrada escalonada estilo Apple HIG
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 40,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="sobre-mi"
      className="relative w-full min-h-screen py-20 md:py-28 px-4 sm:px-6 md:px-8 select-none flex flex-col justify-center overflow-hidden font-poppins"
    >
      {/* TÍTULO EDITORIAL CON EFECTO MASKED REVEAL */}
      <MaskedHeading
        tag="02 · Sobre Mí"
        title="Experiencias con Propósito"
        subtext="La intersección entre ingeniería técnica de software y sensibilidad visual para la web moderna."
        className="mb-10 sm:mb-14"
      />

      {/* BENTO GRID DE INSPIRACIÓN APPLE (GLASSMORPHISM & ALTA JERARQUÍA) */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
        
        {/* ======================================================== */}
        {/* TARJETA 1: HERO STORY (2/3 DEL ANCHO EN DESKTOP)          */}
        {/* ======================================================== */}
        <div
          ref={(el) => {
            cardsRef.current[0] = el;
          }}
          className="md:col-span-8 bg-white/70 dark:bg-[#0d0d0d]/80 text-[#080808] dark:text-[#F9F6EE] backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-9 border border-black/10 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col justify-between gap-6 transition-all duration-300 hover:border-black/20 dark:hover:border-white/30"
        >
          {/* Header de la tarjeta */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 text-xs font-mono font-bold text-[#0052FF] dark:text-[#60A5FA]">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>PERFIL & VOCACIÓN</span>
            </div>

            <span className="text-xs font-mono text-black/50 dark:text-zinc-500 font-semibold">
              Fullstack · Frontend Focused
            </span>
          </div>

          {/* Cuerpo principal */}
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#080808] dark:text-white leading-[1.1] font-poppins">
              De la lógica del código a la <br />
              <span className="text-[#00D26A]">sensibilidad estética.</span>
            </h3>

            <p className="mt-4 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
              Soy <strong className="font-bold text-black dark:text-white">Desarrollador de Software Multiplataforma</strong> y <strong className="font-bold text-black dark:text-white">Técnico en Informática</strong> (recibido en 2023). Cuento con una base técnica sólida para construir soluciones de punta a punta como desarrollador fullstack, pero mi auténtica pasión reside en el <strong className="font-bold text-[#00D26A]">Frontend</strong>: transformar sistemas complejos en interfaces intuitivas, elegantes y con animaciones que despiertan emociones.
            </p>
          </div>

          {/* Badges de Formación y Enfoque */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-black/10 dark:border-white/10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-mono font-medium">
              <HugeiconsIcon icon={GraduationCapIcon} size={14} color="#00D26A" />
              <span>Técnico en Informática (2023)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-mono font-medium">
              <HugeiconsIcon icon={LaptopProgrammingIcon} size={14} color="#0052FF" />
              <span>Dev. Software Multiplataforma</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TARJETA 2: ENFOQUE VISUAL & CRAFT (1/3 EN DESKTOP)        */}
        {/* ======================================================== */}
        <div
          ref={(el) => {
            cardsRef.current[1] = el;
          }}
          className="md:col-span-4 bg-white/70 dark:bg-[#0d0d0d]/80 text-[#080808] dark:text-[#F9F6EE] backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-8 border border-black/10 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col justify-between gap-5 transition-all duration-300 hover:border-black/20 dark:hover:border-white/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#00D26A]/15 text-[#00D26A] flex items-center justify-center border border-[#00D26A]/30">
            <HugeiconsIcon icon={AiPaintbrushIcon} size={24} />
          </div>

          <div>
            <h4 className="text-xl font-bold uppercase tracking-tight text-[#080808] dark:text-white font-poppins">
              Obsesión por la Estética
            </h4>
            <p className="mt-2.5 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
              No solo construyo funciones; cuido el espaciado, la tipografía, el contraste y la física del movimiento con GSAP y Three.js para crear productos memorables.
            </p>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-black/10 dark:border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color="#00D26A" />
              <span>Micro-interacciones a 60 FPS</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color="#00D26A" />
              <span>Diseño Responsive Fluido</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TARJETA 3: ARQUITECTURA & MULTIPLATAFORMA (1/3 EN DESKTOP) */}
        {/* ======================================================== */}
        <div
          ref={(el) => {
            cardsRef.current[2] = el;
          }}
          className="md:col-span-4 bg-white/70 dark:bg-[#0d0d0d]/80 text-[#080808] dark:text-[#F9F6EE] backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-8 border border-black/10 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col justify-between gap-5 transition-all duration-300 hover:border-black/20 dark:hover:border-white/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#0052FF]/15 text-[#0052FF] flex items-center justify-center border border-[#0052FF]/30">
            <HugeiconsIcon icon={Layers01Icon} size={24} />
          </div>

          <div>
            <h4 className="text-xl font-bold uppercase tracking-tight text-[#080808] dark:text-white font-poppins">
              Arquitectura Limpia
            </h4>
            <p className="mt-2.5 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
              Estructuras modulares y componentes escalables en React y Astro, optimizados para velocidad de carga instantánea y SEO de alta fidelidad.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-black/10 dark:border-white/10">
            {['React', 'Astro', 'TypeScript', 'Tailwind'].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-[10px] font-mono font-bold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* TARJETA 4: PILARES & TRAYECTORIA EN NÚMEROS (2/3 EN DESKTOP) */}
        {/* ======================================================== */}
        <div
          ref={(el) => {
            cardsRef.current[3] = el;
          }}
          className="md:col-span-8 bg-white/70 dark:bg-[#0d0d0d]/80 text-[#080808] dark:text-[#F9F6EE] backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-8 border border-black/10 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col justify-between gap-6 transition-all duration-300 hover:border-black/20 dark:hover:border-white/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00D26A] flex items-center gap-1.5">
              <HugeiconsIcon icon={CpuIcon} size={15} /> PILARES DE TRABAJO
            </span>
            <span className="text-xs font-mono text-black/40 dark:text-zinc-500">2023 — 2026</span>
          </div>

          {/* 3 Métricas Destacadas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2 text-center sm:text-left">
            <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <div className="text-3xl font-black font-poppins text-black dark:text-white">
                +3 Años
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                Trayectoria y evolución técnica continua.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <div className="text-3xl font-black font-poppins text-[#0052FF] dark:text-[#60A5FA]">
                100%
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                Enfoque en interacción y detalle visual.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <div className="text-3xl font-black font-poppins text-[#00D26A]">
                60 FPS
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                Rendimiento suave en cada animación.
              </p>
            </div>
          </div>

          <p className="text-xs font-mono text-black/60 dark:text-zinc-400">
            Formación sólida + pasión artesanal por el diseño de interfaces web modernas.
          </p>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
