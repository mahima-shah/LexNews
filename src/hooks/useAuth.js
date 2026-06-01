import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const isSignedIn = !!user;

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    }

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email) => {
    return await supabase.auth.signInWithOtp({
      email,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, isSignedIn, signIn, signOut };
}