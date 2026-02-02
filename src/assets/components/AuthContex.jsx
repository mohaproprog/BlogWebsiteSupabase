import { createContext } from "react";
import { useEffect, useState } from 'react';
import { supabase } from '../../supabse/supabase.client';
// AuthContext
const AuthContext = createContext(null);
export default AuthContext;

// ContextProvider
export const ContextProvider = ({children})=>{
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checker = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();

      if (error || !sessionData?.session) {
        console.log("No user in the session");
        setUser(null);
      }

      // Validityuser
      const {data:userValidate,error:userVError} = await supabase.auth.getUser()
      if(userVError || !userValidate.user){
        await supabase.auth.signOut();
        setUser(null)
        console.log("userValidate",userValidate);
      }
      else{
        setUser(userValidate.user)
        console.log("userValidate",userValidate.user);

      }
      
      

      setLoading(false);
    };

    checker();

    const { data:Listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user?? null);
      console.log(session);
      
    });

    return () => {
        Listener.subscription?.unsubscribe();

      
    };

  }, []);

  return (
    <AuthContext.Provider value={{user,loading}}>
         {children}
    
    </AuthContext.Provider>
  );
}

