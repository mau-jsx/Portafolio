import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContactModal from "./ContactModal";
import yo from "../assets/yo2.0.jpg";
import { MessageCircle, User, LayoutGrid, Zap, Monitor } from "lucide-react";

const CardNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para cerrar el modal y que el diseño sea minimal
  const openContact = () => setIsModalOpen(true);

  return (
    <>
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 w-[95%] max-w-fit">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            flex items-center justify-between gap-3 md:gap-6 p-1.5 rounded-full border border-white/10 backdrop-blur-xl bg-black/40 shadow-2xl
            ${scrolled ? "px-4 py-2" : "px-6 py-3"}
            transition-all duration-500
          `}
        >
          {/* LOGO / AVATAR */}
          <div className="flex items-center gap-3 pr-2 md:pr-4 border-r border-white/10">
            <div
              className={`
              rounded-full overflow-hidden border border-[#C1FF00]/40 transition-all duration-500
              ${scrolled ? "w-7 h-7" : "w-9 h-9"}
            `}
            >
              <img
                src={yo.src}
                alt="Mauri"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <span className="hidden xs:block text-[10px] font-black text-white italic tracking-tighter">
              MH<span className="text-[#C1FF00]">.</span>
            </span>
          </div>

          {/* LINKS DE NAVEGACIÓN - RESPONSIVOS */}
          <div className="flex items-center gap-4 md:gap-8 px-2">
            <a
              href="#about"
              className="nav-link group flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-[#C1FF00] transition-all"
            >
              <User size={14} className="md:hidden" />
              <span className="hidden md:inline">Sobre Mí</span>
            </a>

            <a
              href="#projects-pin"
              className="nav-link group flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-[#C1FF00] transition-all"
            >
              <LayoutGrid size={14} className="md:hidden" />
              <span className="hidden md:inline">Proyectos</span>
            </a>

            <a
              href="#services"
              className="nav-link group flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-[#C1FF00] transition-all"
            >
              <Zap size={14} className="md:hidden" />
              <span className="hidden md:inline">Servicios</span>
            </a>
          </div>

          {/* BOTÓN CONTACTO */}
          <button
            onClick={openContact}
            className={`
              bg-[#C1FF00] text-black rounded-full font-black uppercase tracking-widest transition-all active:scale-90
              ${scrolled ? "px-4 py-2 text-[8px]" : "px-5 py-2.5 text-[9px] md:text-[10px]"}
            `}
          >
            <span className="hidden sm:inline">Hablemos</span>
            <MessageCircle size={14} className="sm:hidden" />
          </button>
        </motion.div>
      </nav>

      <AnimatePresence>
        {isModalOpen && (
          <ContactModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CardNav;
