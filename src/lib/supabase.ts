/**
 * Acceso mínimo a Supabase por su API REST, sin el SDK: el sitio sólo llama a
 * tres funciones de la base, no justifica la dependencia.
 */

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;

/** Id anónimo de este navegador: identifica su me gusta, nada más. */
const VISITOR_KEY = 'perfil:visitante';

export interface ProfileStats {
  views: number;
  likes: number;
  /** Si este navegador ya dio me gusta. */
  liked: boolean;
}

export function getVisitorId(): string {
  try {
    const stored = localStorage.getItem(VISITOR_KEY);
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    // Sin almacenamiento: un id por carga. El me gusta no se recuerda, pero anda.
    return crypto.randomUUID();
  }
}

async function rpc(fn: string, body: Record<string, unknown>): Promise<ProfileStats> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
      // Una sola fila: la API la devuelve como objeto, no como lista.
      Accept: 'application/vnd.pgrst.object+json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Supabase ${fn}: ${res.status}`);
  const { views, likes, liked } = await res.json();
  return { views: Number(views), likes: Number(likes), liked: Boolean(liked) };
}

export const getProfileStats = (visitor: string) => rpc('get_profile_stats', { visitor });

/** Suma una visita. El control de "una por día" lo hace quien llama. */
export const registerProfileView = (visitor: string) => rpc('register_profile_view', { visitor });

/** Pone o saca el me gusta de este visitante; nunca toca el de otros. */
export const setProfileLike = (visitor: string, want: boolean) =>
  rpc('set_profile_like', { visitor, want });
