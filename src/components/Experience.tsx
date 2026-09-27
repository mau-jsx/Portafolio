import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Star } from 'react-iconly';
import { timeline } from '../data/site';
import { prefersReducedMotion, EASE_OUT } from '../lib/motion';
import Folder from './Folder';

const PANEL_ID = 'experiencia-detalle';

export default function Experience() {
  // Arranca en el año más reciente: con todo cerrado la sección se vería vacía.
  const [year, setYear] = useState(timeline[timeline.length - 1].year);
  const panelRef = useRef<HTMLDivElement>(null);

  const current = timeline.find((item) => item.year === year);

  /* Cada cambio de año hace entrar las filas en cascada. */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      panel.querySelectorAll('[data-exp-row]'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE_OUT },
    );
    return () => {
      tween.kill();
    };
  }, [year]);

  return (
    <section id="experiencia" className="shell scroll-mt-24 py-24 sm:py-32">
      <p className="type-label">Experiencia</p>
      <h2 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-[var(--fg)]">
        Año por año
      </h2>

      {/* Las hojas salen hacia arriba al abrir: el margen les deja lugar. */}
      <div className="mt-20 flex flex-wrap items-end justify-center gap-x-10 gap-y-12 sm:gap-x-16">
        {timeline.map((item) => (
          <Folder
            key={item.year}
            label={item.year}
            open={item.year === year}
            controls={PANEL_ID}
            onToggle={() => setYear(item.year)}
          />
        ))}
      </div>

      <div
        id={PANEL_ID}
        ref={panelRef}
        role="region"
        aria-label={`Experiencia ${year}`}
        className="mt-16"
      >
        {current?.entries.map((entry) => (
          <article
            key={entry.title}
            data-exp-row
            className="grid gap-6 border-t border-[var(--rule)] py-10 md:grid-cols-[8rem_minmax(0,1fr)_16rem] md:gap-10"
          >
            <div>
              <p className="tnum text-5xl font-bold leading-none tracking-[-0.04em] text-[var(--accent)]">
                {entry.month}
              </p>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">{entry.monthName}</p>
            </div>

            <div>
              <h3 className="text-[clamp(1.375rem,2.4vw,1.875rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--fg)]">
                {entry.title}
              </h3>
              <p className="mt-1.5 text-sm text-[var(--fg-muted)]">{entry.subtitle}</p>
              {entry.tag &&
                (entry.award ? (
                  /* Premio: estrella dorada y tono ámbar, para que no pase como una etiqueta más. */
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-[#e8c874] bg-[#fdf6e3] px-2.5 py-0.5 text-xs font-semibold text-[#7a5200] dark:border-[#8a6a1c] dark:bg-[#2a2210] dark:text-[#f1d27a]">
                    <Star set="bold" primaryColor="#e0a526" size={14} />
                    {entry.tag}
                  </span>
                ) : (
                  <span className="mt-4 inline-block rounded-md border border-[color-mix(in_srgb,var(--accent)_45%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
                    {entry.tag}
                  </span>
                ))}
              <p className="mt-4 max-w-[46rem] text-base leading-relaxed text-[var(--fg-muted)]">
                {entry.description}
              </p>
            </div>

            <dl className="flex flex-col gap-3">
              {entry.meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-[var(--fg-faint)]">{item.label}</dt>
                  <dd className="text-sm font-medium text-[var(--accent)]">{item.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
