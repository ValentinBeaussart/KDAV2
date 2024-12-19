
import { supabase } from '/db/connection';

export async function protectRoute(Astro) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return Astro.redirect('/login');
  }

  return session;
}
