import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowRight01Icon, 
  ArrowLeft01Icon, 
  SparklesIcon,
  Layers01Icon,
  CheckmarkCircle02Icon
} from '@hugeicons/core-free-icons';
import { ArrowUpRight } from 'lucide-react';
import { MaskedHeading } from './MaskedHeading';

interface ProjectItem {
  id: string;
  num: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  accentColor: string;
  bgGradient: string;
  imagePlaceholder?: string;
  tags: string[];
}

const portfolioProjects: ProjectItem[] = [
  {
    id: 'nordico',
    num: '01',
    name: 'Nordico',
    category: 'PROYECTO ACTUAL · WEB & MOBILE',
    tagline: 'Plataforma para el Ministerio de Economía y Finanzas de Formosa.',
    description: 'Trabajo en desarrollo conjunto con el Ministerio de Economía de Formosa, coordinadores de GoTechy y DIHM (Agosto — Noviembre). Equipo de 3 desarrolladores (2 Backend y 1 Frontend). Desarrollo del Frontend en Flutter tanto para Mobile (iOS y Android) como Web utilizando el framework Jaspr, con backend en Java Spring Boot.',
    accentColor: '#0052FF',
    bgGradient: 'from-[#0052FF]/30 via-[#0d0d0d]/90 to-[#080808]',
    tags: ['Flutter Mobile', 'Jaspr Web', 'Java Spring Boot', 'Min. Economía Formosa'],
  },
  {
    id: 'don-miguel',
    num: '02',
    name: 'Don miguel',
    category: 'LIVE SERVER · NEXT.JS FULLSTACK',
    tagline: 'Sistema de pedidos y comandas online para restaurante en tiempo real.',
    description: 'Sistema completo de pedidos gastronómicos desarrollado íntegramente con Next.js (tanto servidor como cliente). Integra Live Server para actualización y sincronización de comandas en vivo entre clientes, mesas y cocina.',
    accentColor: '#FF6B00',
    bgGradient: 'from-[#FF6B00]/30 via-[#0d0d0d]/90 to-[#080808]',
    tags: ['Next.js', 'React', 'Live Server', 'Server Actions'],
  },
  {
    id: 'rey-del-mani',
    num: '03',
    name: 'Rey del mani',
    category: 'LIVE SERVER · E-COMMERCE',
    tagline: 'Plataforma de compras y catálogo dinámico de productos.',
    description: 'Plataforma web de compras y e-commerce construida con Next.js (Frontend y Backend) con Live Server para la recepción ágil de órdenes, catálogo dinámico y confirmación de pedidos en tiempo real.',
    accentColor: '#EAB308',
    bgGradient: 'from-[#EAB308]/30 via-[#0d0d0d]/90 to-[#080808]',
    tags: ['Next.js', 'Live Server', 'Tailwind CSS', 'Carrito Reactivo'],
  },
  {
    id: 'juntos-somos-iglesia',
    num: '04',
    name: 'juntos somos iglesia',
    category: 'PRISMA ORM · E-LEARNING',
    tagline: 'Plataforma de cursos interactivos con subida y aprendizaje por video.',
    description: 'Plataforma educativa con CRUD completo de cursos formativos. Permite gestionar colaboradores y profesores dentro de cada curso, subir contenido audiovisual y aprender directamente desde la plataforma con reproductor integrado. Desarrollado con Next.js en servidor y cliente, y base de datos con Prisma ORM.',
    accentColor: '#7928CA',
    bgGradient: 'from-[#7928CA]/30 via-[#0d0d0d]/90 to-[#080808]',
    tags: ['Next.js', 'Prisma ORM', 'Video Streaming', 'CRUD Cursos'],
  },
  {
    id: 'galeria-jsi',
    num: '05',
    name: 'Galeria JSI',
    category: 'PRISMA ORM · 30-DAY TTL',
    tagline: 'Galería comunitaria con depuración automática programada a los 30 días.',
    description: 'Galería social multimedia para la comunidad eclesiástica donde la gente puede subir fotos de cada reunión y culto, ver álbumes de otros miembros y descargarlas. Incorpora un sistema de purga automática a los 30 días para no sobrecargar la base de datos ni el almacenamiento. Hecho con Next.js y Prisma.',
    accentColor: '#00D26A',
    bgGradient: 'from-[#00D26A]/30 via-[#0d0d0d]/90 to-[#080808]',
    tags: ['Next.js', 'Prisma ORM', 'Cloud Storage', 'Auto-Cleanup 30d'],
  },
  {
    id: 'numa',
    num: '06',
    name: 'Numa',
    category: 'IA ADAPTATIVA · FULLSTACK & MOBILE',
    tagline: 'Sistema de aprendizaje de matemáticas con IA adaptativa y gamificación.',
    description: 'Sistema desarrollado en el Instituto Politécnico para ayudar a los alumnos a aprender matemáticas adaptándose a su nivel. La profesora carga documentos PDF, la IA los procesa y capacita a los estudiantes. Incluye evaluaciones en tiempo real y sistema de puntos/recompensas con ranking. Equipo de 3 (1 Frontend Web, 1 Backend, 1 Frontend Mobile) con Next.js, NestJS, Prisma y React Native.',
    accentColor: '#EC4899',
    bgGradient: 'from-[#EC4899]/30 via-[#0d0d0d]/90 to-[#080808]',
    tags: ['Next.js Web', 'React Native', 'NestJS', 'Prisma', 'IA RAG'],
  },
];

export const PortfolioSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  // Animación suave de transición al cambiar de proyecto
  const changeProject = (newIndex: number) => {
    if (newIndex === currentIndex) return;

    const content = contentRef.current;
    if (content) {
      gsap.to(content, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            content,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
          );
        },
      });
    } else {
      setCurrentIndex(newIndex);
    }
  };

  const nextProject = () => {
    const nextIdx = (currentIndex + 1) % portfolioProjects.length;
    changeProject(nextIdx);
  };

  const prevProject = () => {
    const prevIdx = (currentIndex - 1 + portfolioProjects.length) % portfolioProjects.length;
    changeProject(prevIdx);
  };

  const current = portfolioProjects[currentIndex];
  const nextItem = portfolioProjects[(currentIndex + 1) % portfolioProjects.length];

  return (
    <section
      ref={containerRef}
      id="portafolio"
      className="relative w-full min-h-screen py-20 md:py-28 px-4 sm:px-6 md:px-8 select-none font-poppins flex flex-col justify-center items-center"
    >
      {/* TÍTULO EDITORIAL CON EFECTO MASKED REVEAL */}
      <MaskedHeading
        tag="03 · Portafolio"
        title="Proyectos Destacados"
        subtext="Explora mis 6 proyectos principales interactuando con la tarjeta central."
        className="mb-8 sm:mb-12"
      />

      <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">

        {/* ======================================================== */}
        {/* TARJETA GIGANTE ESTILO HERO DE PORTAFOLIO                */}
        {/* ======================================================== */}
        <div
          ref={mainCardRef}
          className={`relative w-full min-h-[560px] sm:min-h-[620px] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-gradient-to-br ${current.bgGradient} transition-all duration-700`}
        >
          {/* Resplandor decorativo de fondo */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: current.accentColor }}
          />

          {/* PARTE SUPERIOR: INDICADORES Y NÚMERO */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: current.accentColor }}
              />
              <span
                className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white/10 text-white backdrop-blur-md border border-white/15"
              >
                {current.category}
              </span>
            </div>

            <span className="text-sm sm:text-base font-mono font-bold text-white/60">
              {current.num} / {portfolioProjects.length < 10 ? `0${portfolioProjects.length}` : portfolioProjects.length}
            </span>
          </div>

          {/* CENTRO: TÍTULO Y DESCRIPCIÓN DEL PROYECTO */}
          <div
            ref={contentRef}
            className="relative z-10 my-auto py-8 max-w-3xl flex flex-col gap-4 sm:gap-5"
          >
            <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white font-poppins leading-[0.95] drop-shadow-lg">
              {current.name}
            </h3>

            <p className="text-base sm:text-xl font-medium text-white/90 leading-snug">
              {current.tagline}
            </p>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-2xl">
              {current.description}
            </p>

            {/* Tags de Tecnologías */}
            <div className="flex flex-wrap gap-2 pt-2">
              {current.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-white shadow-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* PARTE INFERIOR: BARRA DE NAVEGACIÓN & WIDGET EN LA ESQUINA DERECHA */}
          <div className="relative z-10 flex flex-col-reverse sm:flex-row items-stretch sm:items-end justify-between gap-5 pt-4 border-t border-white/15">
            
            {/* SELECTOR RÁPIDO DE LOS 6 PROYECTOS (IZQUIERDA) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {portfolioProjects.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => changeProject(idx)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
                    currentIndex === idx
                      ? 'bg-white text-black font-black scale-105 shadow-md'
                      : 'bg-black/30 hover:bg-black/50 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  {p.num} · {p.name}
                </button>
              ))}
            </div>

            {/* WIDGET INTERACTIVO DE PREVISUALIZACIÓN (ESQUINA INFERIOR DERECHA) */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              
              {/* Tarjeta Flotante del Próximo Proyecto */}
              <button
                type="button"
                onClick={nextProject}
                className="group relative bg-[#F9F6EE] text-[#080808] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-2xl border border-black/10 flex items-center gap-3.5 text-left transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer max-w-[280px] sm:max-w-[320px]"
                title="Ver siguiente proyecto"
              >
                {/* Cuadro de Color/Acento */}
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm"
                  style={{ backgroundColor: nextItem.accentColor }}
                >
                  {nextItem.num}
                </div>

                <div className="overflow-hidden flex-1">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block truncate">
                    SIGUIENTE PROYECTO
                  </span>
                  <span className="text-xs sm:text-sm font-black uppercase text-black font-poppins block truncate">
                    {nextItem.name}
                  </span>
                  <span className="text-[10px] text-zinc-600 block truncate font-light">
                    {nextItem.tagline}
                  </span>
                </div>

                <div className="w-7 h-7 rounded-full bg-black/5 group-hover:bg-black text-black group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </div>
              </button>

              {/* Botón Píldora de Control */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevProject}
                  aria-label="Proyecto anterior"
                  className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                </button>

                <button
                  type="button"
                  onClick={nextProject}
                  className="px-4 py-2 rounded-full bg-[#00D26A] hover:bg-[#00E676] text-black font-black text-xs uppercase tracking-wider font-poppins flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                >
                  <span>SIGUIENTE PROYECTO</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default PortfolioSection;
