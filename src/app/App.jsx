import { useState } from "react";
import { SignInModal } from "../components/auth/SignInModal.jsx";
import { MiraPanel } from "../components/mira/MiraPanel.jsx";
import { HomeScreen } from "../screens/HomeScreen.jsx";
import { SearchScreen } from "../screens/SearchScreen.jsx";
import { SavedScreen } from "../screens/SavedScreen.jsx";
import { ProfileScreen } from "../screens/ProfileScreen.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useSavedArticles } from "../hooks/useSavedArticles.js";
import { AdminScreen } from "../screens/AdminScreen.jsx";
import { ShareSheet } from "../components/ui/ShareSheet.jsx";
import { MoreSheet } from "../components/ui/MoreSheet.jsx";
import { MediaTestScreen } from "../screens/MediaTestScreen.jsx";
import { useLang } from "../hooks/useLang.js";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [miraOpen, setMiraOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [moreArticle, setMoreArticle] = useState(null);
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem("lexlegis_read_articles");
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(false);

  const { user, isSignedIn, signIn, signOut } = useAuth();
  const { savedIds, toggleSave } = useSavedArticles();
  const [shareArticle, setShareArticle] = useState(null);
  const { lang, setLang } = useLang();

  const [feedView, setFeedView] = useState(() => {
    return localStorage.getItem("lexnews_feed_view") || "glance";
  });

  const updateFeedView = (view) => {
    setFeedView(view);
    localStorage.setItem("lexnews_feed_view", view);
  };

  const handleNavigate = (id) => {
    if (id === "mira") {
      setMiraOpen(true);
      return;
    }
    setScreen(id);
  };

  const handleNeedSignIn = () => setShowSignIn(true);
  const handleSignInSuccess = async (email) => {
    const result = await signIn(email);
    return result;
  };

  const markRead = (id) => {
    setReadIds((current) => {
      const updated = current.includes(id) ? current : [...current, id];
      localStorage.setItem("lexlegis_read_articles", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      {screen === "home" && (
        <HomeScreen
          onNavigate={handleNavigate}
          savedIds={savedIds}
          onSave={toggleSave}
          isSignedIn={isSignedIn}
          user={user}
          onNeedSignIn={handleNeedSignIn}
          onRead={markRead}
          onShare={setShareArticle}
          onMore={setMoreArticle}
          darkMode={darkMode}
          feedView={feedView}
          onChangeFeedView={updateFeedView}
          lang={lang}
        />
      )}

      {screen === "search" && (
        <SearchScreen
          onNavigate={handleNavigate}
        />
      )}

      {screen === "saved" && (
        <SavedScreen
          onNavigate={handleNavigate}
          savedIds={savedIds}
          onSave={toggleSave}
          isSignedIn={isSignedIn}
          onNeedSignIn={handleNeedSignIn}
          darkMode={darkMode}
          user={user}
          lang={lang}
        />
      )}

      {screen === "profile" && (
        <ProfileScreen
          onNavigate={handleNavigate}
          isSignedIn={isSignedIn}
          user={user}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((value) => !value)}
          readIds={readIds}
          savedIds={savedIds}
          onSignIn={() => setShowSignIn(true)}
          onSignOut={signOut}
          feedView={feedView}
          onChangeFeedView={updateFeedView}
          lang={lang}
          onChangeLang={setLang}
        />
      )}

      {screen === "admin" && (
        <AdminScreen
          onNavigate={handleNavigate}
        />
      )}

      {screen === "media-test" && (
        <MediaTestScreen />
      )}

      <MiraPanel
        open={miraOpen}
        onClose={() => setMiraOpen(false)}
      />

      {shareArticle && (
        <ShareSheet
          article={shareArticle}
          onClose={() => setShareArticle(null)}
        />
      )}

      {moreArticle && (
        <MoreSheet
          article={moreArticle}
          onClose={() => setMoreArticle(null)}
        />
      )}

      {showSignIn && (
        <SignInModal
          onSuccess={handleSignInSuccess}
          onCancel={() => setShowSignIn(false)}
        />
      )}
    </div>
  );
}