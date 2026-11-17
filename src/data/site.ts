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

/** Pestañas de la sección Trabajo. */
export type WorkCategory = 'freelance' | 'personal' | 'logro';

export interface WorkEntry {
  id: string;
  /** En qué pestaña aparece: clientes, proyectos propios o premios. */
  category: WorkCategory;
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
  /** Los mismos textos en inglés; lo que falta se muestra igual que en español. */
  en: {
    period: string;
    client?: string;
    role: string;
    description: string;
    hrefLabel?: string;
    award?: string;
    title?: string;
  };
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
    id: 'todo-por-mayor',
    category: 'freelance',
    icon: 'tienda',
    year: '2026',
    period: 'Nov 2026',
    client: 'Freelance',
    title: 'Todo por Mayor',
    role: 'Desarrollo completo',
    description:
      'Catálogo de indumentaria por mayor con panel para crear, editar y eliminar productos, selección de talle y color, y pedidos armados que se envían directo por WhatsApp. Publicado y en uso por la dueña.',
    stack: ['Next.js', 'Tailwind CSS', 'Supabase'],
    href: 'https://todopormayor.com.ar/',
    hrefLabel: 'Ver online',
    accent: '#E8508B',
    en: { period: 'Nov 2026', role: 'Full development', description: 'Wholesale clothing catalog with an admin panel to create, edit and delete products, size and color selection, and orders sent straight to WhatsApp. Live and used daily by the owner.', hrefLabel: 'View live' },
  },
  {
    id: 'nordico',
    category: 'freelance',
    icon: 'gobierno',
    year: '2026',
    period: 'Jul 2026 — Hoy',
    client: 'Freelance',
    title: 'Nórdico',
    role: 'Frontend & Mobile',
    description:
      'Plataforma corporativa web y móvil para el Ministerio de Economía y Finanzas de Formosa, con componentes compartidos entre ambas plataformas y entregas continuas bajo Scrum.',
    stack: ['Flutter', 'Jaspr', 'Java Spring Boot'],
    accent: '#3B6DFF',
    en: { period: 'Jul 2026 — Present', role: 'Frontend & Mobile', description: 'Corporate web and mobile platform for the Ministry of Economy and Finance of Formosa, with components shared across both platforms and continuous delivery under Scrum.' },
  },
  {
    id: 'rey-del-mani',
    category: 'freelance',
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
    en: { period: 'May — Aug 2026', role: 'Full development', description: 'Multi-category wholesale e-commerce with a product carousel, food and supplies sections, and direct inquiries via WhatsApp. Deployed and used daily by the client.', hrefLabel: 'View live' },
  },
  {
    id: 'don-miguel',
    category: 'freelance',
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
    en: { period: 'May — Aug 2026', role: 'Full development', description: 'Restaurant web app with a digital menu, table bookings and real-time order tickets sent to the kitchen. It streamlined the order flow and cut communication errors with the staff.', hrefLabel: 'Repository' },
  },
  {
    id: 'juntos-somos-iglesia',
    category: 'freelance',
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
    en: { period: 'May — Aug 2026', role: 'Full development', description: 'Learning platform with video content uploads, collaborators and teachers per course, and a built-in player to take the classes without leaving the platform.', hrefLabel: 'Repository' },
  },
  {
    id: 'galeria-jsi',
    category: 'freelance',
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
    en: { period: 'May — Aug 2026', role: 'Full development', description: 'Second stage of the previous project: bulk upload and sharing of event photos, with automatic cleanup after 30 days so storage and the database never fill up.', hrefLabel: 'Repository' },
  },
  {
    id: 'agente-viajes',
    category: 'personal',
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
    en: { period: 'Nov 2025', client: 'Final Project · Politécnico Formosa', role: 'Full stack · built the tools', description: 'Chatbot connected to custom tools via MCP to book and change flights, move dates and suggest destinations based on the weather.', title: 'AI travel agent' },
  },
  {
    id: 'tienda-deportes',
    category: 'personal',
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
    en: { period: 'Oct — Nov 2025', client: 'Final Project · Politécnico Formosa', role: 'Frontend', description: 'Stock management system for a sporting goods store, with the catalog and inventory movements in a single view.', title: 'Sports store' },
  },
  {
    id: 'produccion-ambiente',
    category: 'logro',
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
    en: { period: 'Oct 2025', client: '24-hour Hackathon · Politécnico Formosa', role: 'Frontend', award: '2nd place', description: 'Management for agricultural businesses: crops, livestock and stock, with a chatbot that checks the supplies database and warns what is running low, a KPI dashboard and a map with the livestock location.' },
  },
  {
    id: 'numa',
    category: 'personal',
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
    en: { period: 'Sep — Nov 2025', role: 'Software developer', description: 'Smart tutoring to teach math: the teacher uploads PDFs, AI processes them and builds real-time quizzes with points and a leaderboard, on web and mobile.' },
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
