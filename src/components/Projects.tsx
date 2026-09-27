import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/site';
import { registerGsap, prefersReducedMotion, EASE_OUT } from '../lib/motion';
import ProjectCover from './ProjectCover';

/**
 * Los proyectos se recorren de costado: la sección se pinnea y el scroll
 * vertical empuja el riel en horizontal. El recorrido lateral es lo que
 * convierte seis fichas en una sala, y cada tarjeta entra con su propio color.
 */
export default function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]');

      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 900px)', () => {
        const distance = () => track.scrollWidth - window.innerWidth + 96;

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              setIndex(Math.round(self.progress * (projects.length - 1))),
          },
        });

        if (progressRef.current) {
          gsap.to(progressRef.current, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: 0.8,
            },
          });
        }

        // Cada tarjeta se endereza al pasar por el centro de la pantalla.
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { rotateY: 12, scale: 0.9, opacity: 0.45 },
            {
              rotateY: 0,
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: scroll,
                start: 'left 92%',
                end: 'left 45%',
                scrub: true,
              },
            },
          );

          gsap.to(card.querySelector('[data-cover]'), {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scroll,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          });
        });

        return () => {
          scroll.kill();
        };
      });

      // En pantallas angostas el riel scrollea a mano; sólo entrada por tarjeta.
      mm.add('(max-width: 899px)', () => {
        cards.forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 32,
            duration: 0.7,
            ease: EASE_OUT,
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          });
        });
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="proyectos"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28"
    >
      <div className="shell flex flex-wrap items-end justify-between gap-6">
        <h2 className="type-title text-[clamp(2.25rem,7vw,5rem)] text-[var(--fg)]">Proyectos</h2>
        <p className="type-body max-w-[46ch]">
          Seis productos: uno corporativo en curso, tres freelance entregados a clientes y dos
          académicos. Deslizá de costado.
        </p>
      </div>

      <div
        ref={trackRef}
        className="mt-14 flex gap-6 px-[max(1.25rem,5vw)] max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto max-lg:pb-6 lg:mt-16 lg:w-max lg:gap-8 lg:will-change-transform"
        style={{ perspective: '1400px' }}
      >
        {projects.map((project) => {
          const Card = project.href ? 'a' : 'div';

          return (
            <Card
              key={project.id}
              data-card
              {...(project.href
                ? { href: project.href, target: '_blank', rel: 'noreferrer' }
                : {})}
              className="group relative flex w-[82vw] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-[var(--rule)] bg-[color-mix(in_srgb,var(--bg-raised)_86%,transparent)] backdrop-blur-xl transition-colors duration-500 hover:border-[color-mix(in_srgb,var(--card-accent)_55%,transparent)] sm:w-[60vw] lg:w-[clamp(26rem,34vw,34rem)]"
              style={{ ['--card-accent' as string]: project.accent }}
            >
              {/* Carátula generada: no hay capturas, hay un campo propio por proyecto. */}
              <div className="relative h-52 overflow-hidden sm:h-60">
                <div data-cover className="absolute inset-0 h-[120%]">
                  <ProjectCover accent={project.accent} seed={project.seed} label={project.name} />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(60% 70% at 50% 40%, ${project.accent}33, transparent 70%)`,
                  }}
                />
                <span
                  className="tnum absolute right-4 top-4 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.14em]"
                  style={{
                    color: project.accent,
                    borderColor: `${project.accent}55`,
                    background: `${project.accent}14`,
                  }}
                >
                  {project.year}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-4 border-t border-[var(--rule)] p-6 sm:p-7">
                <div>
                  <p className="type-serif text-[var(--fg-muted)]">{project.kind}</p>
                  <h3
                    className="type-title mt-1 text-[clamp(1.5rem,2.6vw,2.25rem)] text-[var(--fg)] transition-colors duration-300"
                    style={{ ['--tw-text-opacity' as string]: '1' }}
                  >
                    <span className="transition-colors duration-300 group-hover:text-[var(--card-accent)]">
                      {project.name}
                    </span>
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
                  {project.description}
                </p>

                <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1.5 pt-2">
                  {project.stack.map((tech) => (
                    <li key={tech} className="type-label">
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-[var(--rule)] pt-4">
                  {project.href ? (
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-semibold"
                      style={{ color: project.accent }}
                    >
                      {project.hrefLabel}
                      <ArrowUpRight
                        size={15}
                        strokeWidth={2.2}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  ) : (
                    <span className="text-sm text-[var(--fg-faint)]">Código privado del cliente</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="shell mt-10 hidden items-center gap-4 lg:flex">
        <span className="tnum type-label">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
        <span className="relative h-px flex-1 bg-[var(--rule)]">
          <span
            ref={progressRef}
            className="absolute inset-0 origin-left scale-x-0 bg-[var(--accent)]"
          />
        </span>
      </div>
    </section>
  );
}
