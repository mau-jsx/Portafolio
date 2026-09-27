import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Star } from 'react-iconly';
import { recognition } from '../data/site';
import { registerGsap, prefersReducedMotion, EASE_OUT, revealTrigger } from '../lib/motion';

/*
 * Reconocimiento destacado, fuera de las carpetas de Experiencia: un logro así
 * tiene que verse de pasada, sin que el reclutador abra nada.
 */
export default function Recognition() {
  const rootRef = useRef<HTMLElement>(null);
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: revealTrigger(root, 'top 80%'), defaults: { ease: EASE_OUT } })
        .from('[data-rec-card]', { opacity: 0, y: 24, duration: 0.8 })
        .from(starRef.current, { scale: 0.4, rotate: -40, duration: 0.9, ease: 'back.out(2.2)' }, 0.15);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="reconocimiento" aria-label="Reconocimiento" className="shell py-12 sm:py-16">
      <div
        data-rec-card
        className="flex flex-col gap-8 rounded-[1.75rem] border border-[#ecd9a6] bg-[#fdf8ea] p-8 sm:p-10 md:flex-row md:items-center md:gap-12 dark:border-[#5a4618] dark:bg-[#1d180c]"
      >
        <div
          ref={starRef}
          className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-[#fbeec7] ring-8 ring-[#fdf3d6] dark:bg-[#3a2e10] dark:ring-[#2a2210]"
        >
          <Star set="bold" primaryColor="#e0a526" size={46} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="type-label text-[#8a6300] dark:text-[#e9c86a]">Reconocimiento</p>
          <h2 className="mt-2 text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-none tracking-[-0.035em] text-[var(--fg)]">
            {recognition.title}
          </h2>
          <p className="mt-2 text-lg font-medium text-[var(--fg)]">{recognition.event}</p>
          <p className="mt-4 max-w-[46rem] text-base leading-relaxed text-[var(--fg-muted)]">
            <span className="font-semibold text-[var(--fg)]">{recognition.project}.</span>{' '}
            {recognition.description}
          </p>
        </div>

        <dl className="flex gap-8 md:flex-col md:gap-4">
          {recognition.meta.map((item) => (
            <div key={item.label}>
              <dt className="text-xs text-[var(--fg-faint)]">{item.label}</dt>
              <dd className="text-sm font-semibold text-[#8a6300] dark:text-[#e9c86a]">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
