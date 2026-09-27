import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { Check, Copy } from 'lucide-react';
import { profile, links, getEmail, getMailto } from '../data/site';
import { registerGsap, prefersReducedMotion, EASE_OUT, revealTrigger } from '../lib/motion';

const channels = [
  { label: 'GitHub', href: links.github, handle: 'mau-jsx' },
  { label: 'LinkedIn', href: links.linkedin, handle: 'mauricio-heredia' },
  { label: 'WhatsApp', href: links.whatsapp, handle: profile.phoneDisplay },
];

interface ContactProps {
  /** Banda de cierre: el paisaje que abría el sitio, ahora despidiendo. */
  closing: { src: string; srcSet?: string };
}

/** Corte de la banda: opaca abajo, disuelta arriba contra el fondo del tema. */
const MASK = 'linear-gradient(to top, #000 78%, transparent 100%)';

export default function Contact({ closing }: ContactProps) {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const closingRef = useRef<HTMLImageElement>(null);
  const [copied, setCopied] = useState(false);
  // Vacío en el HTML servido; se llena recién al hidratar, en el navegador.
  const [mailto, setMailto] = useState('');

  useEffect(() => setMailto(getMailto()), []);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    const heading = headingRef.current;
    if (!root || !heading) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(heading, { type: 'chars,lines', mask: 'lines' });
      if (prefersReducedMotion()) return;

      gsap
        .timeline({ scrollTrigger: revealTrigger(root, 'top 75%'), defaults: { ease: EASE_OUT } })
        .from(split.chars, { yPercent: 120, duration: 0.9, stagger: 0.012 })
        .from('[data-contact-fade]', { opacity: 0, y: 16, duration: 0.6, stagger: 0.07 }, 0.35);

      /* La banda de cierre se acerca a medida que el sitio termina. */
      gsap.fromTo(
        closingRef.current,
        { yPercent: 14 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        },
      );
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

  return (
    <section
      ref={rootRef}
      id="contacto"
      className="relative scroll-mt-24 overflow-hidden border-t border-[var(--rule)] py-24 sm:py-32"
    >
      <div className="shell relative z-10">
        <h2
          ref={headingRef}
          className="type-display text-[clamp(2.5rem,10vw,8rem)] uppercase text-[var(--fg)]"
        >
          {'Trabajemos '}
          <br />
          {'juntos'}
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:gap-16">
          <div data-contact-fade>
            <p className="type-lede text-[var(--fg-muted)]">
              <span className="type-serif">¿Tenés un proyecto en mente?</span> Escribime y lo charlamos.
              Respondo el mismo día.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* La dirección no se publica: el enlace se arma al hidratar. */}
              <a
                href={mailto}
                className="text-[clamp(1.125rem,3.2vw,1.875rem)] font-semibold tracking-[-0.03em] text-[var(--fg)] underline decoration-[var(--rule-strong)] underline-offset-[0.2em] transition-colors duration-200 hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
              >
                Escribime por correo
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rule-strong)] px-3.5 py-1.5 text-xs font-medium text-[var(--fg-muted)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          <ul data-contact-fade className="flex flex-col">
            {channels.map((channel) => (
              <li key={channel.label} className="border-t border-[var(--rule)] last:border-b">
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline justify-between gap-6 py-4 transition-colors duration-200 hover:text-[var(--accent)]"
                >
                  <span className="text-base font-medium text-[var(--fg)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                    {channel.label}
                  </span>
                  <span className="text-sm text-[var(--fg-muted)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                    {channel.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/*
        Cierre: el paisaje con el que abría el sitio, ahora al pie. Recorte
        propio y foto más alta que él, igual que en la portada — el parallax
        pasa adentro y no deja bordes.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[34vh] overflow-hidden"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}
      >
        <img
          ref={closingRef}
          src={closing.src}
          srcSet={closing.srcSet}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-x-0 bottom-0 h-[120%] w-full object-cover object-bottom brightness-[1.1] saturate-[0.9] dark:brightness-[0.32] dark:contrast-125"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      </div>
    </section>
  );
}
