/*
 * Carpeta, adaptada de ReactBits "Folder" (MIT + Commons Clause).
 * Cambios: es un <button> real, el estado abierto lo controla quien la usa,
 * sin las hojas que salían al abrir, y en tonos arena y tinta en vez de un
 * color plano: la abierta se distingue por contraste, no por animación.
 */

interface FolderProps {
  open: boolean;
  onToggle: () => void;
  /** Texto visible debajo de la carpeta; también es su nombre accesible. */
  label: string;
  /** id del panel que abre, para aria-controls. */
  controls?: string;
}

export default function Folder({ open, onToggle, label, controls }: FolderProps) {
  // Cerrada: arena. Abierta: tinta (en oscuro se invierte a crema).
  const back = open ? 'bg-[#101216] dark:bg-[#d9d1c1]' : 'bg-[#d4cab6] dark:bg-[#2c2822]';
  const front = open ? 'bg-[#1c1f24] dark:bg-[#f3eee3]' : 'bg-[#e4dccd] dark:bg-[#3a352d]';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      className="group flex flex-col items-center gap-5 rounded-2xl p-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
    >
      <div
        className={`relative transition-transform duration-200 ease-in ${
          open ? '-translate-y-2' : 'group-hover:-translate-y-2'
        }`}
      >
        <div
          className={`relative h-[112px] w-[140px] rounded-[0_14px_14px_14px] transition-colors duration-300 ${back}`}
        >
          <span
            className={`absolute bottom-[98%] left-0 h-[14px] w-[42px] rounded-t-[7px] transition-colors duration-300 ${back}`}
          />

          {/* Las dos tapas: se inclinan hacia lados opuestos al abrir. */}
          {['15deg', '-15deg'].map((skew) => (
            <div
              key={skew}
              aria-hidden="true"
              className={`absolute z-30 h-full w-full origin-bottom rounded-[7px_14px_14px_14px] transition-all duration-300 ease-in-out ${front} ${
                open
                  ? ''
                  : skew === '15deg'
                    ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]'
                    : 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]'
              }`}
              style={{ transform: open ? `skew(${skew}) scaleY(0.6)` : undefined }}
            />
          ))}
        </div>
      </div>

      <span
        className={`tnum text-2xl font-bold tracking-[-0.02em] transition-colors duration-300 ${
          open ? 'text-[var(--accent)]' : 'text-[var(--fg-muted)] group-hover:text-[var(--fg)]'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
