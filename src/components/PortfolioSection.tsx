import React from 'react';
import { MaskedHeading } from './MaskedHeading';
import { DepthCarousel } from './DepthCarousel';

export const PortfolioSection: React.FC = () => {
  return (
    <section
      id="portafolio"
      className="relative w-full min-h-screen py-20 md:py-28 px-4 sm:px-6 md:px-8 select-none flex flex-col justify-center overflow-hidden"
    >
      {/* Título de la sección con efecto Masked Reveal */}
      <MaskedHeading
        tag="03 · Portafolio"
        title="Proyectos Destacados"
        subtext="Una mirada profunda a proyectos web creados con animaciones fluidas, arquitectura limpia e interactividad de vanguardia."
        className="mb-6 md:mb-10"
      />

      {/* Carrusel 3D Horizontal de Proyectos */}
      <DepthCarousel />
    </section>
  );
};

export default PortfolioSection;
