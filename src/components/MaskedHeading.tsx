import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

interface MaskedHeadingProps {
  tag?: string;
  title: string;
  subtext?: string;
  className?: string;
}

export const MaskedHeading: React.FC<MaskedHeadingProps> = ({
  tag = '02 · Portafolio',
  title = 'PROYECTOS DESTACADOS',
  subtext = 'Explora una selección de trabajos creados con foco en rendimiento, animaciones fluidas y diseño de vanguardia.',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const textMaskRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const tagEl = tagRef.current;
    const textMask = textMaskRef.current;
    const subtextEl = subtextRef.current;

    if (!container || !textMask) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    if (tagEl) {
      tl.fromTo(
        tagEl,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }

    // Efecto Masked Reveal con GSAP
    tl.fromTo(
      textMask,
      {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        y: 40,
        opacity: 0,
      },
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power4.out',
      },
      '-=0.3'
    );

    if (subtextEl) {
      tl.fromTo(
        subtextEl,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.5'
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center text-center max-w-3xl mx-auto px-4 select-none ${className}`}
    >
      {/* Badge Superior */}
      {tag && (
        <div
          ref={tagRef}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-mono font-bold tracking-widest text-[#0052FF] dark:text-[#60A5FA] uppercase mb-4"
        >
          <Sparkles size={13} />
          <span>{tag}</span>
        </div>
      )}

      {/* Título con Efecto Masked Heading */}
      <h2
        ref={textMaskRef}
        className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#080808] dark:text-[#F9F6EE] font-poppins leading-[0.98]"
      >
        {title}
      </h2>

      {/* Subtexto */}
      {subtext && (
        <p
          ref={subtextRef}
          className="mt-4 sm:mt-5 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg font-light max-w-xl leading-relaxed font-poppins"
        >
          {subtext}
        </p>
      )}
    </div>
  );
};

export default MaskedHeading;
