import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Medal04Icon, 
  GraduationCapIcon
} from '@hugeicons/core-free-icons';
import { 
  Download, 
  ExternalLink, 
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import { MaskedHeading } from './MaskedHeading';

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const sections = [introRef.current, eduRef.current].filter(Boolean);

      gsap.fromTo(
        sections,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
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

  return (
    <section
      ref={containerRef}
      id="sobre-mi"
      className="relative w-full min-h-screen py-20 md:py-28 px-4 sm:px-6 md:px-8 select-none font-poppins"
    >
      {/* TÍTULO EDITORIAL CON EFECTO MASKED REVEAL */}
      <MaskedHeading
        tag="02 · Sobre Mí"
        title="Ingeniería & Sensibilidad Visual"
        subtext="Frontend Developer con sólida base técnica, enfocado en crear experiencias interactivas y estéticas para Web y Mobile."
        className="mb-10 sm:mb-14"
      />

      <div className="max-w-6xl mx-auto w-full flex flex-col gap-10 sm:gap-12">

        {/* ======================================================== */}
        {/* 1. TARJETA DE PRESENTACIÓN + GET IN TOUCH CARDS          */}
        {/* ======================================================== */}
        <div
          ref={introRef}
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* Tarjeta de Presentación / Bio Humana y Auténtica */}
          <div className="lg:col-span-7 bg-white/80 dark:bg-[#0d0d0d]/90 text-[#080808] dark:text-[#F9F6EE] backdrop-blur-2xl rounded-[2.5rem] p-7 sm:p-9 border border-black/10 dark:border-white/15 shadow-xl flex flex-col sm:flex-row gap-6 items-center">
            {/* Foto de Mauricio */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] overflow-hidden border-2 border-black/10 dark:border-white/20 shrink-0 shadow-lg bg-black">
              <img
                src="/avatar.jpg"
                alt="Mauricio Wilfredo Heredia"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Texto de Introducción y Biografía Auténtica */}
            <div className="flex-1 space-y-2.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-mono font-bold text-[#0052FF] dark:text-[#60A5FA]">
                <MapPin size={13} /> Formosa Capital, Argentina
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-black dark:text-white font-poppins">
                Mauricio Wilfredo Heredia
              </h3>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">
                Hola, soy Desarrollador de Software y Técnico en Informática. Me considero un desarrollador fullstack con una profunda pasión y dedicación por el <strong className="text-black dark:text-white font-bold">Frontend y el diseño de interfaces</strong>. Me encanta transformar ideas complejas en experiencias web y móviles intuitivas, estéticas y vivas, donde cada interacción y detalle visual está pensado para conectar de forma natural con las personas.
              </p>
            </div>
          </div>

          {/* Tarjetas de Acción Rápida / Get in Touch */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            {/* WhatsApp Card */}
            <a
              href="https://wa.me/3705022130"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-[2rem] bg-[#25D366] text-black font-poppins flex flex-col justify-between gap-4 shadow-lg hover:scale-[1.03] transition-transform duration-200"
            >
              <div className="flex items-center justify-between">
                <FaWhatsapp size={28} />
                <ExternalLink size={16} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-75">
                  Chat Directo
                </span>
                <span className="text-sm font-black uppercase tracking-tight block">
                  WhatsApp
                </span>
              </div>
            </a>

            {/* LinkedIn Card */}
            <a
              href="https://www.linkedin.com/in/mauricio-heredia-07a829285/"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-[2rem] bg-[#0A66C2] text-white font-poppins flex flex-col justify-between gap-4 shadow-lg hover:scale-[1.03] transition-transform duration-200"
            >
              <div className="flex items-center justify-between">
                <FaLinkedinIn size={26} />
                <ExternalLink size={16} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-white/75">
                  Conectar
                </span>
                <span className="text-sm font-black uppercase tracking-tight block">
                  LinkedIn
                </span>
              </div>
            </a>

            {/* GitHub Card */}
            <a
              href="https://github.com/mau-jsx"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-[2rem] bg-[#181717] text-white font-poppins flex flex-col justify-between gap-4 shadow-lg hover:scale-[1.03] transition-transform duration-200 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <SiGithub size={26} />
                <ExternalLink size={16} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-white/75">
                  Código
                </span>
                <span className="text-sm font-black uppercase tracking-tight block">
                  GitHub
                </span>
              </div>
            </a>

            {/* Descargar CV PDF Card */}
            <a
              href="/CV_Mauricio_Heredia_Frontend_Developer.pdf"
              download="CV_Mauricio_Heredia_Frontend_Developer.pdf"
              className="p-5 rounded-[2rem] bg-white dark:bg-white text-black font-poppins flex flex-col justify-between gap-4 shadow-lg hover:scale-[1.03] transition-transform duration-200 cursor-pointer border border-black/10"
            >
              <div className="flex items-center justify-between">
                <Download size={26} />
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black text-white">
                  PDF
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-70">
                  Descargar
                </span>
                <span className="text-sm font-black uppercase tracking-tight block">
                  Curriculum
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. EDUCACIÓN OFICIAL: 2 TARJETAS BLANCAS CON Medal04Icon */}
        {/* ======================================================== */}
        <div
          ref={eduRef}
          className="w-full flex flex-col gap-6"
        >
          {/* Header de Educación */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={GraduationCapIcon} size={22} color="#0052FF" />
              <h4 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black dark:text-white font-poppins">
                Educación & Titulaciones Oficiales
              </h4>
            </div>

            <span className="text-xs font-mono text-zinc-500">2016 — 2025</span>
          </div>

          {/* 2 Tarjetas Blancas Redondeadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tarjeta 1: Técnico en Informática */}
            <div className="bg-white text-[#080808] rounded-[2.2rem] p-7 sm:p-8 border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col justify-between gap-5 transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-[#00D26A]/15 text-[#008a44] flex items-center justify-center shadow-xs border border-[#00D26A]/30">
                  <HugeiconsIcon icon={Medal04Icon} size={30} color="#008a44" />
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/5 text-black uppercase tracking-wider">
                  2016 — 2023 · Graduado
                </span>
              </div>

              <div>
                <h5 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-poppins">
                  Técnico en Informática
                </h5>
                <p className="text-xs font-mono font-bold text-[#0052FF] mt-1">
                  EPET N° 7 Vicente Arcadio Salemi
                </p>
                <p className="text-xs text-zinc-600 font-light mt-2.5 leading-relaxed">
                  Formación técnica con bases profundas en lógica algorítmica, arquitectura de computadoras, redes LAN y soporte de sistemas.
                </p>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1 text-[#008a44] font-bold">
                  <CheckCircle2 size={13} /> Título Oficial
                </span>
                <span>Formosa, Argentina</span>
              </div>
            </div>

            {/* Tarjeta 2: Técnico Superior en Desarrollo de Software Multiplataforma */}
            <div className="bg-white text-[#080808] rounded-[2.2rem] p-7 sm:p-8 border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col justify-between gap-5 transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-[#0052FF]/15 text-[#0052FF] flex items-center justify-center shadow-xs border border-[#0052FF]/30">
                  <HugeiconsIcon icon={Medal04Icon} size={30} color="#0052FF" />
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/5 text-black uppercase tracking-wider">
                  2024 — 2025 · Graduado
                </span>
              </div>

              <div>
                <h5 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-poppins">
                  Técnico Superior en Desarrollo de Software Multiplataforma
                </h5>
                <p className="text-xs font-mono font-bold text-[#0052FF] mt-1">
                  Instituto Politécnico Formosa
                </p>
                <p className="text-xs text-zinc-600 font-light mt-2.5 leading-relaxed">
                  Especialización superior en desarrollo web fullstack, aplicaciones móviles multiplataforma nativas/híbridas y arquitecturas de software modernas.
                </p>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1 text-[#0052FF] font-bold">
                  <CheckCircle2 size={13} /> Título Superior
                </span>
                <span>Formosa, Argentina</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
