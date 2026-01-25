import { useEffect, useState } from 'react';
import { supabase } from '../../supabse/supabase.client';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        setUser(null);
      } else {
        setUser(data.session.user);
      }

      setLoading(false);
    };

    checkSession();

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
