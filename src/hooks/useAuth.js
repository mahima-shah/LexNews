import { useEffect, useState } from "react";

export function useAuth() {
  const [isSignedIn, setIsSignedIn] = useState(() => {
    return localStorage.getItem("lexlegis_signed_in") === "true";
  });

  useEffect(() => {
    localStorage.setItem("lexlegis_signed_in", isSignedIn ? "true" : "false");
  }, [isSignedIn]);

  const signIn = () => setIsSignedIn(true);

  const signOut = () => {
    setIsSignedIn(false);
    localStorage.removeItem("lexlegis_signed_in");
  };

  return { isSignedIn, signIn, signOut };
}