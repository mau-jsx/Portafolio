import { useEffect, useRef } from 'react';

interface ProjectCoverProps {
  accent: string;
  seed: number;
  label: string;
}

/** PRNG determinista: la misma semilla dibuja siempre la misma carátula. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Carátula generada. No hay capturas de los proyectos, así que cada uno recibe
 * un campo de líneas propio derivado de su semilla y teñido con su color: dos
 * proyectos nunca se ven igual y ninguno finge ser una pantalla real.
 */
export default function ProjectCover({ accent, seed, label }: ProjectCoverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = 640;
    const H = 400;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const random = rng(seed);
    ctx.clearRect(0, 0, W, H);

    // Base: degradado del color del proyecto hacia el negro.
    const base = ctx.createLinearGradient(0, 0, W, H);
    base.addColorStop(0, `${accent}2e`);
    base.addColorStop(0.55, `${accent}12`);
    base.addColorStop(1, '#00000000');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);

    // Campo de curvas: la topografía cambia con la semilla.
    const lines = 26;
    for (let i = 0; i < lines; i += 1) {
      const t = i / (lines - 1);
      const y = 40 + t * (H - 80);
      const amp = 12 + random() * 46;
      const freq = 0.006 + random() * 0.012;
      const phase = random() * Math.PI * 2;

      ctx.beginPath();
      for (let x = 0; x <= W; x += 6) {
        const wave =
          Math.sin(x * freq + phase) * amp * (0.4 + 0.6 * Math.sin(t * Math.PI));
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.06 + (1 - Math.abs(t - 0.5) * 2) * 0.24;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Nodos dispersos: puntos de anclaje sobre la topografía.
    ctx.globalAlpha = 1;
    for (let i = 0; i < 18; i += 1) {
      const x = random() * W;
      const y = random() * H;
      const r = random() * 2.2 + 0.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.25 + random() * 0.5;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }, [accent, seed]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Carátula generada del proyecto ${label}`}
      className="h-full w-full object-cover"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
