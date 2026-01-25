import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabse/supabase.client';
import { useNavigate } from 'react-router-dom';

function ProtectedPage({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checker = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error || !session?.session) {
        navigate("/signIn", { replace: true });
        return; // stop further execution
      }
      setLoading(false);
      console.log(session);
      
    };
    checker();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}

export default ProtectedPage;
