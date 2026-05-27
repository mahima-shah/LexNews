import { useState } from "react";
import { SignInModal } from "../components/auth/SignInModal.jsx";
import { MiraPanel } from "../components/mira/MiraPanel.jsx";
import { HomeScreen } from "../screens/HomeScreen.jsx";
import { SearchScreen } from "../screens/SearchScreen.jsx";
import { SavedScreen } from "../screens/SavedScreen.jsx";
import { ProfileScreen } from "../screens/ProfileScreen.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useSavedArticles } from "../hooks/useSavedArticles.js";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [miraOpen, setMiraOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { isSignedIn, signIn, signOut } = useAuth();
  const { savedIds, toggleSave } = useSavedArticles();

  const handleNavigate = (id) => {
    if (id === "mira") {
      setMiraOpen(true);
      return;
    }
    setScreen(id);
  };

  const handleNeedSignIn = () => setShowSignIn(true);
  const handleSignInSuccess = () => {
    signIn();
    setShowSignIn(false);
  };

  return (
    <div className="app">
      {screen === "home" && <HomeScreen onNavigate={handleNavigate} savedIds={savedIds} onSave={toggleSave} isSignedIn={isSignedIn} onNeedSignIn={handleNeedSignIn} />}
      {screen === "search" && <SearchScreen onNavigate={handleNavigate} />}
      {screen === "saved" && <SavedScreen onNavigate={handleNavigate} savedIds={savedIds} onSave={toggleSave} isSignedIn={isSignedIn} onNeedSignIn={handleNeedSignIn} />}
      {screen === "profile" && <ProfileScreen onNavigate={handleNavigate} isSignedIn={isSignedIn} onSignIn={() => setShowSignIn(true)} onSignOut={signOut} />}
      <MiraPanel open={miraOpen} onClose={() => setMiraOpen(false)} />
      {showSignIn && <SignInModal onSuccess={handleSignInSuccess} onCancel={() => setShowSignIn(false)} />}
    </div>
  );
}
