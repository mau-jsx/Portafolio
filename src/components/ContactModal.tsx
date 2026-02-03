import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import yo from "../assets/yo2.0.jpg";
import {
  Github,
  Linkedin,
  Mail,
  X,
  ArrowUpRight,
  Instagram,
  Copy,
  Check,
} from "lucide-react";

const ContactModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  // OFUSCACIÓN: Evitamos texto plano para los bots
  const user = "maxcer234";
  const domain = "gmail.com";
  const fullEmail = `${user}@${domain}`;

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${fullEmail}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Overlay más oscuro para enfoque total */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-md"
        />

        {/* Modal Container: Más compacto max-w-2xl */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/5 p-6 md:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Botón Cerrar Minimal */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-[#C1FF00] transition-colors z-30"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 auto-rows-fr">
            {/* 1. PERFIL: Ahora más integrado */}
            <div className="col-span-4 md:col-span-3 row-span-2 bg-zinc-900/30 rounded-[2rem] border border-white/5 p-6 flex flex-col items-center justify-center text-center">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
                <img
                  src={yo.src}
                  alt="Mauri"
                  className="w-full h-full object-cover grayscale rounded-2xl rotate-3"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C1FF00] rounded-full border-4 border-[#0a0a0a] animate-pulse" />
              </div>
              <h3 className="text-white font-bold text-lg uppercase italic tracking-tighter italic">
                ¿Creamos algo?
              </h3>
              <p className="text-[#C1FF00] text-[9px] font-black uppercase tracking-[0.3em] mt-1">
                Online Now
              </p>
            </div>

            {/* 2. LINKEDIN */}
            <a
              href="https://linkedin.com"
              target="_blank"
              className="col-span-2 md:col-span-3 bg-white/5 rounded-[1.5rem] p-5 flex flex-col justify-between group hover:bg-[#0077b5]/10 transition-all border border-white/5"
            >
              <Linkedin
                className="text-zinc-500 group-hover:text-[#0077b5]"
                size={20}
              />
              <div className="flex justify-between items-end">
                <span className="text-white text-xs font-black uppercase italic">
                  LinkedIn
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-zinc-700 group-hover:text-white"
                />
              </div>
            </a>

            {/* 3. GITHUB */}
            <a
              href="https://github.com/mau-jsx"
              target="_blank"
              className="col-span-2 md:col-span-1 bg-white/5 rounded-[1.5rem] p-5 flex flex-col items-center justify-center group hover:border-[#C1FF00]/30 border border-white/5 transition-all"
            >
              <Github
                size={24}
                className="text-zinc-500 group-hover:text-white"
              />
            </a>

            {/* 4. INSTAGRAM */}
            <a
              href="https://instagram.com/mauricio.tsx"
              target="_blank"
              className="col-span-2 md:col-span-2 bg-white/5 rounded-[1.5rem] p-5 flex flex-col justify-between group hover:border-pink-500/30 border border-white/5 transition-all"
            >
              <Instagram
                size={20}
                className="text-zinc-500 group-hover:text-pink-500"
              />
              <span className="text-[10px] text-zinc-500 font-bold uppercase italic">
                Instagram
              </span>
            </a>

            {/* 5. EMAIL CARD: Ofuscada y con Copy */}
            <div
              onClick={handleEmailClick}
              className="col-span-4 md:col-span-4 bg-[#C1FF00] rounded-[2rem] p-6 flex items-center justify-between cursor-pointer group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-[#C1FF00]">
                  <Mail size={20} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-black font-black text-sm uppercase italic">
                    Hablemos
                  </span>
                  <span className="text-black/50 text-[10px] font-bold mt-1">
                    Haz clic para enviar
                  </span>
                </div>
              </div>

              <button
                onClick={copyToClipboard}
                className="p-3 bg-black/10 rounded-lg hover:bg-black/20 transition-colors text-black"
                title="Copiar email"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* 6. STATUS */}
            <div className="col-span-4 md:col-span-2 bg-zinc-900/50 rounded-[1.5rem] flex items-center justify-center p-4 border border-white/5">
              <p className="text-[9px] text-zinc-500 font-mono text-center leading-tight tracking-widest uppercase italic">
                Formosa, ARG <br /> {new Date().getFullYear()} • 16:04
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;
