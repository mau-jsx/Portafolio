/**
 * Fuente única de verdad del portafolio.
 * Los datos salen del CV (CV-Mauricio-Heredia-Frontend.pdf).
 */

export const profile = {
  name: 'Mauricio Heredia',
  fullName: 'Mauricio Wilfredo Heredia',
  role: 'Desarrollador Frontend',
  specialty: 'UI/UX interactiva y animaciones web',
  location: 'Formosa Capital, Argentina',
  /*
   * El correo va partido a propósito. Los rastreadores que juntan direcciones
   * leen el HTML y buscan el patrón `algo@algo`: si nunca se escribe entero en
   * el marcado, no hay nada que levantar. Se arma recién en el navegador.
   */
  emailUser: 'maxcer234',
  emailDomain: 'gmail.com',
  phoneDisplay: '+54 9 3705 022130',
  phoneIntl: '5493705022130',
  /**
   * Sobre mí: un solo párrafo, en primera persona y sin repetir el nombre.
   * A esta altura de la página ya me presenté en el hero.
   */
  about:
    'Trabajo la interfaz de punta a punta: arquitectura de la información, jerarquía visual, sistemas de componentes y microinteracciones, siempre con la accesibilidad y el rendimiento como parte del diseño, no como un ajuste posterior. Vengo del full stack, así que entiendo lo que pasa detrás y puedo defender una decisión de producto con argumentos técnicos. Y sigo aprendiendo: cada proyecto me deja algo que el anterior no tenía.',
} as const;

/** Arma la dirección. Sólo se llama desde el cliente, nunca al renderizar. */
export const getEmail = () => `${profile.emailUser}@${profile.emailDomain}`;
export const getMailto = () => `mailto:${getEmail()}`;

export const links = {
  github: 'https://github.com/mau-jsx',
  linkedin: 'https://www.linkedin.com/in/mauricio-heredia-dev',
  instagram: 'https://www.instagram.com/mau.jsx/',
  whatsapp: `https://wa.me/${profile.phoneIntl}`,
  cv: '/CV-Mauricio-Heredia-Frontend.pdf',
} as const;

export interface StackGroup {
  label: string;
  items: string[];
}

export const stack: StackGroup[] = [
  {
    label: 'Core',
    items: [
      'Angular',
      'Next.js',
      'React',
      'Astro',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'Shadcn/ui',
    ],
  },
  {
    label: 'Animación e interacción',
    items: ['GSAP', 'Lenis', 'Three.js', 'Parallax', 'Microinteracciones'],
  },
  {
    label: 'Datos e integración',
    items: ['APIs REST', 'Webhooks', 'Prisma ORM', 'PostgreSQL', 'Supabase'],
  },
  {
    label: 'Mobile y backend',
    items: ['Flutter', 'Jaspr', 'Node.js', 'Nest.js', 'Java Spring Boot'],
  },
  {
    label: 'Herramientas',
    items: ['Git', 'GitHub', 'Docker', 'Vercel', 'n8n', 'Scrum'],
  },
];

export interface WorkEntry {
  id: string;
  /** Año de la entrada; ordena la sección y encabeza la tarjeta. */
  year: string;
  period: string;
  /** Para quién fue: empresa, cliente o institución. */
  client: string;
  title: string;
  /** Mi papel concreto en esa entrada. */
  role: string;
  description: string;
  stack: string[];
  href?: string;
  hrefLabel?: string;
  /** Premio o distincion: la tarjeta lo marca con una estrella. */
  award?: string;
  /** Símbolo que representa al proyecto, en lugar de una captura. */
  icon: WorkIcon;
  /** Color de la entrada: tiñe su ícono y su acento. */
  accent: string;
}

/** Los símbolos disponibles; cada uno se dibuja en el componente. */
export type WorkIcon =
  | 'gobierno'
  | 'tienda'
  | 'gastronomia'
  | 'educacion'
  | 'galeria'
  | 'viaje'
  | 'deporte'
  | 'agro'
  | 'infra';

/**
 * Experiencia y proyectos en una sola línea de tiempo. Estaban partidos en dos
 * secciones que contaban lo mismo dos veces: el puesto por un lado y el
 * producto por el otro. Acá cada entrada dice para quién fue, qué se construyó
 * y cuál fue mi parte, que es lo que se venía a buscar en las dos.
 */
export const work: WorkEntry[] = [
  {
    id: 'nordico',
    icon: 'gobierno',
    year: '2026',
    period: 'Jul 2026 — Hoy',
    client: 'Consultoría Gotechy',
    title: 'Nórdico',
    role: 'Frontend & Mobile',
    description:
      'Plataforma corporativa web y móvil para el Ministerio de Economía y Finanzas de Formosa, con componentes compartidos entre ambas plataformas y entregas continuas bajo Scrum.',
    stack: ['Flutter', 'Jaspr', 'Java Spring Boot'],
    accent: '#3B6DFF',
  },
  {
    id: 'rey-del-mani',
    icon: 'tienda',
    year: '2026',
    period: 'May — Ago 2026',
    client: 'Freelance',
    title: 'El Rey del Maní',
    role: 'Desarrollo completo',
    description:
      'E-commerce mayorista multirrubro con carrusel de productos, secciones de alimentos e insumos y consulta directa por WhatsApp. Desplegado y en uso diario por el cliente.',
    stack: ['Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    href: 'https://el-rey-del-mani-353e.vercel.app/',
    hrefLabel: 'Ver online',
    accent: '#F5B300',
  },
  {
    id: 'don-miguel',
    icon: 'gastronomia',
    year: '2026',
    period: 'May — Ago 2026',
    client: 'Freelance',
    title: 'Don Miguel',
    role: 'Desarrollo completo',
    description:
      'Webapp gastronómica con menú digital, agenda de reservas y envío de comandas en tiempo real hacia cocina. Ordenó el flujo de pedidos y redujo los errores de comunicación con el personal.',
    stack: ['Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    href: 'https://github.com/mau-jsx/Don-Miguel-Restaurante',
    hrefLabel: 'Repositorio',
    accent: '#FF6B2C',
  },
  {
    id: 'juntos-somos-iglesia',
    icon: 'educacion',
    year: '2026',
    period: 'May — Ago 2026',
    client: 'Freelance',
    title: 'Juntos Somos Iglesia',
    role: 'Desarrollo completo',
    description:
      'Plataforma educativa con carga de contenido audiovisual, colaboradores y profesores por curso, y reproductor integrado para cursar dentro de la misma plataforma.',
    stack: ['Next.js', 'Prisma', 'PostgreSQL'],
    href: 'https://github.com/rincon-digital/juntos-somos-iglesia',
    hrefLabel: 'Repositorio',
    accent: '#8B5CF6',
  },
  {
    id: 'galeria-jsi',
    icon: 'galeria',
    year: '2026',
    period: 'May — Ago 2026',
    client: 'Freelance',
    title: 'Galería JSI',
    role: 'Desarrollo completo',
    description:
      'Segunda etapa del proyecto anterior: carga masiva y distribución de fotografías de eventos, con purga automática a los 30 días para no sobrecargar el almacenamiento ni la base.',
    stack: ['Next.js', 'Prisma', 'PostgreSQL', 'Cloud Storage'],
    href: 'https://github.com/rincon-digital/galeria-jsi',
    hrefLabel: 'Repositorio',
    accent: '#00D26A',
  },
  {
    id: 'agente-viajes',
    icon: 'viaje',
    year: '2025',
    period: 'Nov 2025',
    client: 'Final Proyecto · Politécnico Formosa',
    title: 'Agente de viajes con IA',
    role: 'Full stack · construí las tools',
    description:
      'Chatbot conectado a herramientas propias vía MCP para reservar y cambiar vuelos, mover fechas y recomendar destinos según el clima.',
    stack: ['Next.js', 'Node.js', 'TypeScript', 'MCP'],
    accent: '#06B6D4',
  },
  {
    id: 'tienda-deportes',
    icon: 'deporte',
    year: '2025',
    period: 'Oct — Nov 2025',
    client: 'Final Proyecto · Politécnico Formosa',
    title: 'Tienda de deportes',
    role: 'Frontend',
    description:
      'Sistema de gestión de stock para una tienda de artículos deportivos, con el catálogo y el movimiento de mercadería en una sola vista.',
    stack: ['React', 'TypeScript', 'Tailwind CSS'],
    accent: '#22C55E',
  },
  {
    id: 'produccion-ambiente',
    icon: 'agro',
    year: '2025',
    period: 'Oct 2025',
    client: 'Hackatón de 24 horas · Politécnico Formosa',
    title: 'Producción Ambiente',
    role: 'Frontend',
    award: '2.º puesto',
    description:
      'Gestión para empresas agropecuarias: cultivos, ganado y stock, con un chatbot que consulta la base de insumos y avisa qué está por agotarse, un panel de KPIs y un mapa con la ubicación del ganado.',
    stack: ['React', 'Tailwind CSS', 'Node.js'],
    accent: '#E0A526',
  },
  {
    id: 'numa',
    icon: 'educacion',
    year: '2025',
    period: 'Sep — Nov 2025',
    client: 'Instituto Politécnico Formosa',
    title: 'Numa',
    role: 'Desarrollador de software',
    description:
      'Tutoría inteligente para enseñar matemáticas: la docente carga PDFs, la IA los procesa y genera evaluaciones en tiempo real con puntos y ranking, en web y en móvil.',
    stack: ['Next.js', 'React Native', 'Nest.js', 'Prisma'],
    href: 'https://github.com/Final-Proyecto/Piaxion',
    hrefLabel: 'Repositorio',
    accent: '#EC4899',
  },
  {
    id: 'epet-7',
    icon: 'infra',
    year: '2023',
    period: 'Ene — Dic 2023',
    client: 'EPET N.º 7 Vicente A. Salemi',
    title: 'Infraestructura IT y capacitación',
    role: 'Técnico y capacitador',
    description:
      'Mantenimiento del hardware y las redes LAN de la institución, y programas de alfabetización digital para docentes y alumnos.',
    stack: ['Redes LAN', 'Hardware', 'Capacitación'],
    accent: '#64748B',
  },
];

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Perfil', href: '#perfil' },
  { label: 'Trabajo', href: '#trabajo' },
  { label: 'Contacto', href: '#contacto' },
];
