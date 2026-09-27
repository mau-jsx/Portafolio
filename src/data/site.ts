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
  linkedin: 'https://www.linkedin.com/in/mauricio-heredia-75b497336',
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

export interface TimelineEntry {
  /** Mes de inicio en dos dígitos y su nombre. */
  month: string;
  monthName: string;
  title: string;
  subtitle: string;
  tag?: string;
  /** Premio o reconocimiento: la etiqueta se marca con una estrella. */
  award?: boolean;
  description: string;
  meta: { label: string; value: string }[];
}

export interface TimelineYear {
  year: string;
  entries: TimelineEntry[];
}

/** Experiencia agrupada por año, para las carpetas de la sección. Sale del CV. */
export const timeline: TimelineYear[] = [
  {
    year: '2023',
    entries: [
      {
        month: '01',
        monthName: 'Enero',
        title: 'Técnico de Infraestructura IT & Capacitador',
        subtitle: 'EPET N.º 7 Vicente A. Salemi',
        description:
          'Mantenimiento del hardware y las redes LAN de la institución, y programas de alfabetización digital para docentes y alumnos.',
        meta: [
          { label: 'Institución', value: 'EPET N.º 7' },
          { label: 'Lugar', value: 'Formosa' },
          { label: 'Período', value: 'Ene — Dic 2023' },
        ],
      },
    ],
  },
  {
    year: '2025',
    entries: [
      {
        month: '11',
        monthName: 'Noviembre',
        title: 'Agente de viajes con IA',
        subtitle: 'Final Proyecto · Politécnico Formosa',
        tag: 'Full stack',
        description:
          'Chatbot conectado a herramientas propias vía MCP para reservar y cambiar vuelos, mover fechas y recomendar destinos según el clima. Me encargué de construir las tools.',
        meta: [
          { label: 'Equipo', value: 'Final Proyecto' },
          { label: 'Rol', value: 'Full stack' },
          { label: 'Período', value: 'Nov 2025' },
        ],
      },
      {
        month: '10',
        monthName: 'Octubre',
        title: 'Tienda de deportes',
        subtitle: 'Final Proyecto · Politécnico Formosa',
        tag: 'Frontend',
        description:
          'Sistema de gestión de stock para una tienda de artículos deportivos. Me enfoqué en el frontend.',
        meta: [
          { label: 'Equipo', value: 'Final Proyecto' },
          { label: 'Rol', value: 'Frontend' },
          { label: 'Período', value: 'Oct — Nov 2025' },
        ],
      },
      {
        month: '10',
        monthName: 'Octubre',
        title: 'Producción Ambiente',
        subtitle: 'Hackatón de 24 horas · Politécnico Formosa',
        tag: '2.º puesto',
        award: true,
        description:
          'Gestión para empresas agropecuarias: cultivos, ganado y stock, con un chatbot que consulta la base de insumos y avisa qué está por agotarse, un panel de KPIs y un mapa con la ubicación del ganado. Me enfoqué en el frontend.',
        meta: [
          { label: 'Desafío', value: 'Innovación agropecuaria' },
          { label: 'Resultado', value: 'Segundo puesto' },
          { label: 'Duración', value: '24 horas' },
        ],
      },
      {
        month: '09',
        monthName: 'Septiembre',
        title: 'Desarrollador de Software',
        subtitle: 'Instituto Politécnico Formosa · Proyecto Numa',
        tag: 'IA & Automation',
        description:
          'Sistema de tutoría inteligente con IA para enseñar matemáticas: interfaces web y móvil, servicios de backend y flujos de datos automatizados.',
        meta: [
          { label: 'Institución', value: 'Politécnico Formosa' },
          { label: 'Lugar', value: 'Formosa' },
          { label: 'Período', value: 'Sep — Nov 2025' },
        ],
      },
    ],
  },
  {
    year: '2026',
    entries: [
      {
        month: '07',
        monthName: 'Julio',
        title: 'Desarrollador Frontend & Mobile',
        subtitle: 'Consultoría Gotechy · Proyecto Nórdico',
        tag: 'Actual',
        description:
          'Plataforma corporativa web y móvil para el Ministerio de Economía y Finanzas de Formosa, con componentes compartidos entre ambas plataformas y entregas continuas bajo Scrum.',
        meta: [
          { label: 'Empresa', value: 'Gotechy' },
          { label: 'Modalidad', value: 'Remoto' },
          { label: 'Período', value: 'Jul 2026 — Hoy' },
        ],
      },
      {
        month: '05',
        monthName: 'Mayo',
        title: 'Desarrollador Frontend Freelance',
        subtitle: 'Proyectos con clientes reales',
        tag: 'Freelance',
        description:
          'Tres productos entregados y desplegados: un e-commerce en uso diario por el cliente, una webapp gastronómica con comandas en tiempo real y una plataforma educativa que sumó una segunda etapa.',
        meta: [
          { label: 'Proyectos', value: 'El Rey del Maní · Don Miguel · Juntos Somos Iglesia' },
          { label: 'Modalidad', value: 'Remoto' },
          { label: 'Período', value: 'May — Ago 2026' },
        ],
      },
    ],
  },
];

/** Reconocimiento destacado, con bloque propio antes de Experiencia. */
export const recognition = {
  title: '2.º puesto',
  event: 'Hackatón de 24 horas · Politécnico Formosa',
  project: 'Producción Ambiente',
  description:
    'Gestión para empresas agropecuarias: cultivos, ganado y stock, con un chatbot que consulta la base de insumos y avisa qué está por agotarse, un panel de KPIs y un mapa con la ubicación del ganado.',
  meta: [
    { label: 'Duración', value: '24 horas' },
    { label: 'Rol', value: 'Frontend' },
    { label: 'Fecha', value: 'Oct 2025' },
  ],
};

export interface Project {
  id: string;
  name: string;
  year: string;
  kind: string;
  description: string;
  stack: string[];
  href?: string;
  hrefLabel?: string;
  /** Color del proyecto: tiñe su carátula generada y el glow de la fila. */
  accent: string;
  /** Semilla del degradado procedural que reemplaza a la captura. */
  seed: number;
}

export const projects: Project[] = [
  {
    id: 'nordico',
    accent: '#3B6DFF',
    seed: 11,
    name: 'Nórdico',
    year: '2026',
    kind: 'Plataforma corporativa',
    description:
      'Plataforma web y móvil para el Ministerio de Economía y Finanzas de Formosa, junto a Gotechy y DIHM. Frontend en Flutter para iOS y Android y en Jaspr para web, sobre un backend en Java Spring Boot.',
    stack: ['Flutter', 'Jaspr', 'Java Spring Boot'],
  },
  {
    id: 'rey-del-mani',
    accent: '#F5B300',
    seed: 29,
    name: 'El Rey del Maní',
    year: '2026',
    kind: 'E-commerce mayorista',
    description:
      'Catálogo multirrubro con carrusel de productos, secciones de alimentos e insumos y consulta directa por WhatsApp. Desplegado en producción y en uso por el cliente.',
    stack: ['Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    href: 'https://el-rey-del-mani-353e.vercel.app/',
    hrefLabel: 'Ver online',
  },
  {
    id: 'don-miguel',
    accent: '#FF6B2C',
    seed: 47,
    name: 'Don Miguel',
    year: '2026',
    kind: 'Webapp gastronómica',
    description:
      'Menú digital interactivo, agenda de reservas y envío de comandas en tiempo real hacia cocina, ordenando el flujo de pedidos y reduciendo errores de comunicación con el personal.',
    stack: ['Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    href: 'https://github.com/mau-jsx/Don-Miguel-Restaurante',
    hrefLabel: 'Repositorio',
  },
  {
    id: 'juntos-somos-iglesia',
    accent: '#8B5CF6',
    seed: 67,
    name: 'Juntos Somos Iglesia',
    year: '2026',
    kind: 'Plataforma educativa',
    description:
      'Formación y gestión de cursos con carga de contenido audiovisual, colaboradores y profesores por curso, y reproductor integrado para aprender dentro de la plataforma.',
    stack: ['Next.js', 'Prisma', 'PostgreSQL'],
    href: 'https://github.com/rincon-digital/juntos-somos-iglesia',
    hrefLabel: 'Repositorio',
  },
  {
    id: 'galeria-jsi',
    accent: '#00D26A',
    seed: 83,
    name: 'Galería JSI',
    year: '2026',
    kind: 'Galería comunitaria',
    description:
      'Segunda fase del proyecto anterior: carga masiva y distribución de fotografías de eventos, con purga automática a los 30 días para no sobrecargar almacenamiento ni base de datos.',
    stack: ['Next.js', 'Prisma', 'Cloud Storage'],
    href: 'https://github.com/rincon-digital/galeria-jsi',
    hrefLabel: 'Repositorio',
  },
  {
    id: 'numa',
    accent: '#EC4899',
    seed: 101,
    name: 'Numa',
    year: '2025',
    kind: 'Tutoría con IA',
    description:
      'Sistema de aprendizaje de matemáticas que se adapta al nivel del alumno. La docente carga PDFs, la IA los procesa y genera evaluaciones en tiempo real con puntos y ranking.',
    stack: ['Next.js', 'React Native', 'Nest.js', 'Prisma'],
    href: 'https://github.com/Final-Proyecto/Piaxion',
    hrefLabel: 'Repositorio',
  },
];

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Perfil', href: '#perfil' },
  { label: 'Experiencia', href: '#experiencia' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Contacto', href: '#contacto' },
];
