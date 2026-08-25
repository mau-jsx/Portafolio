import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight, 
  Github
} from 'lucide-react';

export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  githubUrl: string;
  liveUrl?: string;
  previewCode?: string;
}

const projects: ProjectItem[] = [
  {
    id: 1,
    title: 'Don Miguel E-Commerce',
    category: 'E-Commerce Gourmet & Boutique',
    description: 'Tienda digital de alta fidelidad con catálogo interactivo, micro-animaciones en el carrito y renderizado ultra-rápido.',
    tags: ['React 19', 'Tailwind v4', 'GSAP 3', 'TypeScript'],
    gradient: 'from-[#0052FF]/30 via-[#00D26A]/20 to-black/80',
    accentColor: '#00D26A',
    githubUrl: 'https://github.com/mau-jsx',
    liveUrl: 'https://github.com/mau-jsx',
  },
  {
    id: 2,
    title: 'Piaxion Studio Platform',
    category: 'Creative Web & Experiencias 3D',
    description: 'Plataforma interactiva para estudio de diseño con transiciones fluidas, shaders WebGL y arquitectura modular en Astro.',
    tags: ['Astro 5', 'Three.js', 'GSAP', 'TypeScript'],
    gradient: 'from-[#7928CA]/30 via-[#0052FF]/20 to-black/80',
    accentColor: '#0052FF',
    githubUrl: 'https://github.com/mau-jsx',
    liveUrl: 'https://github.com/mau-jsx',
  },
  {
    id: 3,
    title: 'Spatial Web 3D Lab',
    category: 'WebGL & Interactive Shaders',
    description: 'Laboratorio de experimentos visuales 3D con físicas en tiempo real, efectos de partículas y controles inmersivos.',
    tags: ['React 19', 'Three.js', 'WebGL', 'Framer Motion'],
    gradient: 'from-[#00D26A]/30 via-[#0052FF]/30 to-black/80',
    accentColor: '#00D26A',
    githubUrl: 'https://github.com/mau-jsx',
    liveUrl: 'https://github.com/mau-jsx',
  },
];

export const DepthCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Teclado para navegación
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    setTouchStart(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto py-8 sm:py-12 px-4 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ESCENARIO 3D PERSPECTIVE PARA LAS TARJETAS HORIZONTALES */}
      <div 
        className="relative w-full h-[460px] sm:h-[540px] md:h-[600px] flex items-center justify-center"
        style={{ perspective: '1400px' }}
      >
        {projects.map((project, index) => {
          // Calcular la posición relativa respecto a la activa
          const diff = (index - activeIndex + projects.length) % projects.length;
          let offset = diff;
          if (diff > projects.length / 2) {
            offset = diff - projects.length;
          }

          const isActive = offset === 0;
          const isPrev = offset === -1;
          const isNext = offset === 1;

          // Cálculo de transformaciones 3D de profundidad
          let transformStyle = 'translate3d(0, 0, -400px) scale(0.7)';
          let opacity = 0;
          let zIndex = 10;
          let pointerEvents: 'auto' | 'none' = 'none';

          if (isActive) {
            transformStyle = 'translate3d(0, 0, 0px) rotateY(0deg) scale(1)';
            opacity = 1;
            zIndex = 30;
            pointerEvents = 'auto';
          } else if (isPrev) {
            transformStyle = 'translate3d(-60%, 0, -180px) rotateY(26deg) scale(0.86)';
            opacity = 0.55;
            zIndex = 20;
            pointerEvents = 'auto';
          } else if (isNext) {
            transformStyle = 'translate3d(60%, 0, -180px) rotateY(-26deg) scale(0.86)';
            opacity = 0.55;
            zIndex = 20;
            pointerEvents = 'auto';
          }

          return (
            <div
              key={project.id}
              onClick={() => {
                if (isPrev) prevSlide();
                if (isNext) nextSlide();
              }}
              style={{
                transform: transformStyle,
                opacity,
                zIndex,
                pointerEvents,
                transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease',
              }}
              className={`absolute top-0 w-full max-w-[340px] sm:max-w-[560px] md:max-w-[720px] lg:max-w-[820px] bg-[#0d0d0d] text-[#F9F6EE] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex flex-col cursor-pointer ${
                isActive ? 'cursor-default' : 'hover:opacity-80'
              }`}
            >
              {/* Barra Superior del Navegador con botones estilo macOS */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-black/60 border-b border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-mono text-zinc-400">
                  <span>https://{project.title.toLowerCase().replace(/\s+/g, '-')}.dev</span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                  0{project.id}
                </span>
              </div>

              {/* Vista Panorámica Horizontal 16:9 del Proyecto */}
              <div className={`relative w-full aspect-[16/9] bg-gradient-to-tr ${project.gradient} p-6 sm:p-8 flex flex-col justify-between overflow-hidden`}>
                
                {/* Elementos flotantes decorativos del mockup */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-white">
                    {project.category}
                  </span>
                  
                  <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: project.accentColor }} />
                </div>

                {/* Título en grande dentro del mockup */}
                <div className="my-auto">
                  <h3 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg font-poppins">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm md:text-base text-white/85 max-w-lg font-light leading-relaxed drop-shadow-sm font-poppins">
                    {project.description}
                  </p>
                </div>

                {/* Tags Tecnológicos */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 sm:px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono font-bold text-zinc-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer de Acciones del Proyecto */}
              <div className="p-4 sm:p-5 bg-[#121212] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 font-medium">
                    Diseño & Código por Mauricio
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105"
                  >
                    <Github size={14} /> GitHub
                  </a>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00D26A] hover:bg-[#00E676] text-black font-black text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      Demo <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* CONTROLES DEL CARRUSEL (BOTONES ANTERIOR / SIGUIENTE + BULLETS) */}
      <div className="flex items-center justify-between max-w-sm mx-auto mt-6 sm:mt-8 px-4">
        <button
          onClick={prevSlide}
          aria-label="Proyecto anterior"
          className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-[#080808] dark:text-[#F9F6EE] flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer border border-black/10 dark:border-white/15"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Bullets de Paginación */}
        <div className="flex items-center gap-2">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Ir al proyecto ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-7 bg-[#00D26A] shadow-[0_0_10px_#00D26A]'
                  : 'w-2 bg-black/20 dark:bg-white/30 hover:bg-black/40 dark:hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          aria-label="Siguiente proyecto"
          className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-[#080808] dark:text-[#F9F6EE] flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer border border-black/10 dark:border-white/15"
        >
          <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
};

export default DepthCarousel;
