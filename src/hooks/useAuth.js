import { useState } from "react";

export function useAuth() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  return {
    isSignedIn,
    signIn: () => setIsSignedIn(true),
    signOut: () => setIsSignedIn(false),
  };
}
