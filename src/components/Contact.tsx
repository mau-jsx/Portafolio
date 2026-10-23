import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Check, Copy, Mail, MessageCircle, Link2 } from 'lucide-react';
import { profile, links, getEmail, getMailto } from '../data/site';
import { registerGsap, prefersReducedMotion, EASE_OUT, revealTrigger } from '../lib/motion';

interface ContactProps {
  /** El paisaje con el que cierra el sitio: se parte en los tres paneles. */
  closing: { src: string; srcSet?: string };
}

/* Radio de los paneles: entero en las esquinas de afuera, nada en las uniones. */
const R = '1.5rem';
const FRONT_RADIUS = [`${R} 0 0 ${R}`, '0', `0 ${R} ${R} 0`];

/*
 * Botones de cada panel. Primario lleno, secundario con borde: el mismo par
 * en los tres, así se leen como una fila de opciones equivalentes.
 */
const primary =
  'inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-5 py-3 text-sm font-semibold text-[var(--bg)] transition-opacity duration-200 hover:opacity-85';
const secondary =
  'inline-flex items-center gap-1.5 rounded-full border border-[var(--rule-strong)] px-4 py-3 text-sm font-medium text-[var(--fg-muted)] transition-colors duration-200 hover:border-[var(--fg)] hover:text-[var(--fg)]';

/**
 * Contacto: el paisaje del cierre es una sola tarjeta que, al scrollear, se
 * parte en tres paneles y cada uno se da vuelta para mostrar un canal. Correo,
 * WhatsApp y redes: tres caminos, tres paneles.
 *
 * En escritorio la sección se fija y el giro sigue al scroll. En celular no
 * hay pin: cada panel se da vuelta solo cuando entra en pantalla.
 */
export default function Contact({ closing }: ContactProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  // Vacío en el HTML servido; se llena recién al hidratar, en el navegador.
  const [mailto, setMailto] = useState('');

  useEffect(() => setMailto(getMailto()), []);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-split-panel]');
      const fronts = gsap.utils.toArray<HTMLElement>('[data-split-front]');

      // Sin animación: los paneles ya dados vuelta, con el canal a la vista.
      if (prefersReducedMotion()) {
        gsap.set(panels, { rotateY: 180 });
        return;
      }

      gsap
        .timeline({ scrollTrigger: revealTrigger(root, 'top 75%'), defaults: { ease: EASE_OUT } })
        .from('[data-contact-head]', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 });

      const mm = gsap.matchMedia();

      // Escritorio: pin y giro atado al scroll.
      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=160%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. La tarjeta se separa: los costados se abren, el medio baja apenas.
        tl.to(panels[0], { x: -22, duration: 0.3 }, 0)
          .to(panels[2], { x: 22, duration: 0.3 }, 0)
          .to(panels, { scale: 0.97, duration: 0.3 }, 0)
          .to(fronts, { borderRadius: R, duration: 0.3 }, 0)
          // 2. Cada panel se da vuelta, uno detrás del otro.
          .to(
            panels,
            { rotateY: 180, scale: 1, duration: 0.5, stagger: 0.14, ease: 'power3.inOut' },
            0.25,
          );
      });

      // Celular: cada panel gira al entrar, sin fijar la sección.
      mm.add('(max-width: 767px)', () => {
        panels.forEach((panel, i) => {
          gsap.set(fronts[i], { borderRadius: R });
          gsap.to(panel, {
            rotateY: 180,
            duration: 1,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: panel, start: 'top 72%', once: true },
          });
        });
      });

      // El pin agrega scroll al final: que el nav y el resto lo cuenten.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(getEmail());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = getMailto();
    }
  };

  const channels = [
    {
      key: 'correo',
      icon: Mail,
      title: 'Correo',
      text: 'Para proyectos y propuestas. Respondo el mismo día.',
      actions: (
        <>
          <a href={mailto} className={primary}>
            Escribime
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </a>
          <button type="button" onClick={copyEmail} className={secondary}>
            {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </>
      ),
    },
    {
      key: 'whatsapp',
      icon: MessageCircle,
      title: 'WhatsApp',
      text: 'Para algo rápido: un mensaje directo y lo vemos.',
      actions: (
        <a href={links.whatsapp} target="_blank" rel="noreferrer" className={primary}>
          Abrir chat
          <ArrowUpRight size={15} strokeWidth={2.2} />
        </a>
      ),
    },
    {
      key: 'redes',
      icon: Link2,
      title: 'Redes',
      text: 'Mi recorrido en LinkedIn y todo el código en GitHub.',
      actions: (
        <>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className={primary}>
            LinkedIn
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </a>
          <a href={links.github} target="_blank" rel="noreferrer" className={secondary}>
            GitHub
            <ArrowUpRight size={14} strokeWidth={2} />
          </a>
        </>
      ),
    },
  ];

  return (
    <section
      ref={rootRef}
      id="contacto"
      aria-label="Contacto"
      className="shell flex flex-col pb-16 pt-24 md:h-[100svh] md:pb-10"
    >
      <header className="max-w-[40rem]">
        <p data-contact-head className="type-label text-[var(--fg-faint)]">
          Contacto
        </p>
        <h2
          data-contact-head
          className="mt-2 text-[clamp(2rem,5vw,3.6rem)] font-bold leading-none tracking-[-0.04em] text-[var(--fg)]"
        >
          Trabajemos juntos
        </h2>
        <p data-contact-head className="mt-4 text-base leading-relaxed text-[var(--fg-muted)]">
          ¿Tenés un proyecto en mente? Elegí por dónde y lo charlamos.
        </p>
      </header>

      {/*
        La tarjeta partida. Cada panel lleva su tercio del paisaje en el frente
        (fondo al 300 % corrido 0, 50 y 100 %: juntos arman la foto entera) y
        su canal en el dorso. La perspectiva vive en el contenedor.
      */}
      <div className="mt-8 grid min-h-0 flex-1 gap-4 [perspective:1800px] md:mt-10 md:grid-cols-3 md:gap-0">
        {channels.map((channel, i) => {
          const Icon = channel.icon;

          return (
            <div
              key={channel.key}
              data-split-panel
              className="relative h-[17rem] [transform-style:preserve-3d] will-change-transform md:h-full"
            >
              {/* Frente: su pedazo del paisaje. */}
              <div
                data-split-front
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden [backface-visibility:hidden] dark:brightness-[0.55]"
                style={{
                  // 1 px de más hacia cada vecino: con anchos de decimales y
                  // transformaciones 3D, la unión dejaba un hilo blanco.
                  left: i > 0 ? '-1px' : 0,
                  right: i < 2 ? '-1px' : 0,
                  borderRadius: FRONT_RADIUS[i],
                  backgroundImage: `url(${closing.src})`,
                  backgroundSize: '300% 100%',
                  backgroundPosition: `${i * 50}% 50%`,
                }}
              />

              {/* Dorso: el canal. */}
              <div
                className="absolute inset-0 flex flex-col rounded-[1.5rem] border border-[var(--rule)] bg-[var(--bg-raised)] p-7 [backface-visibility:hidden] [transform:rotateY(180deg)] lg:p-9"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--fg)]">
                  <Icon size={22} strokeWidth={1.7} />
                </span>

                <h3 className="mt-auto text-[clamp(1.5rem,2.4vw,2.1rem)] font-bold tracking-[-0.03em] text-[var(--fg)]">
                  {channel.title}
                </h3>
                <p className="mt-2 max-w-[26ch] text-[0.95rem] leading-relaxed text-[var(--fg-muted)]">
                  {channel.text}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">{channel.actions}</div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-[var(--fg-faint)]">
        {profile.name} · {profile.location}
      </p>
    </section>
  );
}
