import { useEffect, useState } from "react";
import { SAVED_FILTERS } from "../data/filters.js";
import { Ic } from "../constants/icons.jsx";
import { TopBar } from "../components/layout/TopBar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { ArticleReader } from "../components/news/ArticleReader.jsx";
import { NewsCard } from "../components/news/NewsCard.jsx";
import { Pill } from "../components/ui/Pill.jsx";
import { NotifPanel } from "../components/mira/NotifPanel.jsx";
import { fetchArticlesByIds } from "../services/articlesApi.js";
import { formatArticle } from "../utils/formatArticle.js";
import { useArticleUpdates } from "../hooks/useArticleUpdates.js";

export function SavedScreen({
  onNavigate,
  savedIds,
  onSave,
  isSignedIn,
  onNeedSignIn,
  user,               // ← pass from App.jsx via useAuth
  onMira,             // ← opens Mira with article context
}) {
  const [category, setCategory] = useState("all");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [readerOpen, setReaderOpen] = useState(false);
  const [readerStart, setReaderStart] = useState(0);
  const [readerArticles, setReaderArticles] = useState([]);

  const [notifOpen, setNotifOpen] = useState(false);

  // Load saved articles
  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      const data = await fetchArticlesByIds(savedIds);
      const formattedArticles = data.map(formatArticle);
      setArticles(formattedArticles);
      setLoading(false);
    }
    loadArticles();
  }, [savedIds]);

  // Track updates to saved articles
  const { updatedIds, unreadCount, markAllSeen, markArticleSeen } = useArticleUpdates(
    savedIds,
    articles
  );

  const saved = articles.filter((article) => savedIds.includes(article.id));
  const filtered =
    category === "all" ? saved : saved.filter((article) => article.cat === category);

  const openReader = (index, article) => {
    // If this article had an update badge, clear it
    if (updatedIds.has(article.id)) {
      markArticleSeen(article.id);
    }
    setReaderArticles(filtered);
    setReaderStart(index);
    setReaderOpen(true);
  };

  // Articles with updates — for the NotifPanel list
  const updatedArticles = articles.filter((a) => updatedIds.has(a.id));

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <TopBar
        isSignedIn={isSignedIn}
        user={user}
        onProfile={() => onNavigate("profile")}
        onBell={() => setNotifOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Category filter row */}
      <div
        style={{
          padding: "10px 0 0 16px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
          flexShrink: 0,
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {SAVED_FILTERS.map((filter) => (
          <Pill
            key={filter.cat}
            active={category === filter.cat}
            onClick={() => setCategory(filter.cat)}
          >
            {filter.label}
          </Pill>
        ))}
      </div>

      {/* Article list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {!isSignedIn ? (
          <EmptySaved onNeedSignIn={onNeedSignIn} />
        ) : loading ? (
          <p
            style={{
              fontSize: 13,
              color: "var(--muted)",
              textAlign: "center",
              paddingTop: 60,
            }}
          >
            Loading saved articles...
          </p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>No saved articles yet</p>
          </div>
        ) : (
          filtered.map((article, index) => (
            <div key={article.id} style={{ position: "relative" }}>
              {/* "Updated" badge — shown when this article has changes */}
              {updatedIds.has(article.id) && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "var(--ink)",
                    color: "var(--white)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: 0.4,
                    padding: "3px 8px",
                    borderRadius: 20,
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#fff",
                      display: "inline-block",
                    }}
                  />
                  UPDATED
                </div>
              )}

              <NewsCard
                article={article}
                onClick={() => openReader(index, article)}
                saved={isSignedIn && savedIds.includes(article.id)}
                onSave={onSave}
              />
            </div>
          ))
        )}
      </div>

      <BottomNav active="saved" onNavigate={onNavigate} />

      {/* Article reader */}
      <div className={`reader-wrap ${readerOpen ? "open" : ""}`}>
        {readerOpen && (
          <ArticleReader
            articles={readerArticles}
            startIndex={readerStart}
            onClose={() => setReaderOpen(false)}
            savedIds={savedIds}
            onSave={onSave}
            onMira={onMira}
          />
        )}
      </div>

      {/* Notification panel */}
      <NotifPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        updatedArticles={updatedArticles}
        onMarkAllSeen={markAllSeen}
        onArticleClick={(article) => {
          const idx = filtered.findIndex((a) => a.id === article.id);
          if (idx !== -1) openReader(idx, article);
        }}
      />
    </div>
  );
}

function EmptySaved({ onNeedSignIn }) {
  return (
    <div style={{ textAlign: "center", paddingTop: 60 }}>
      <div
        style={{
          width: 56,
          height: 56,
          background: "var(--surface)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
        }}
      >
        <Ic.Bookmark c="var(--muted-2)" s={24} />
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          color: "var(--ink)",
          marginBottom: 6,
        }}
      >
        Sign in to save articles
      </p>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
        Your saved articles will appear here
      </p>
      <button
        onClick={onNeedSignIn}
        style={{
          padding: "11px 28px",
          background: "var(--ink)",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        Sign in
      </button>
    </div>
  );
}