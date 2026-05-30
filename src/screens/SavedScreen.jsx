import { useEffect, useState } from "react";
import { SAVED_FILTERS } from "../data/filters.js";
import { Ic } from "../constants/icons.jsx";
import { TopBar } from "../components/layout/TopBar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { ArticleReader } from "../components/news/ArticleReader.jsx";
import { NewsCard } from "../components/news/NewsCard.jsx";
import { Pill } from "../components/ui/Pill.jsx";
import { fetchArticles } from "../services/articlesApi.js";
import { formatArticle } from "../utils/formatArticle.js";

export function SavedScreen({ onNavigate, savedIds, onSave, isSignedIn, onNeedSignIn }) {
  const [category, setCategory] = useState("all");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [readerOpen, setReaderOpen] = useState(false);
  const [readerStart, setReaderStart] = useState(0);
  const [readerArticles, setReaderArticles] = useState([]);

  useEffect(() => {
    async function loadArticles() {
      const data = await fetchArticles();
      const formattedArticles = data.map(formatArticle);
      setArticles(formattedArticles);
      setLoading(false);
    }

    loadArticles();
  }, []);

  const saved = articles.filter((article) => savedIds.includes(article.id));
  const filtered = category === "all" ? saved : saved.filter((article) => article.cat === category);

  const openReader = (index) => {
    setReaderArticles(filtered);
    setReaderStart(index);
    setReaderOpen(true);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <TopBar isSignedIn={isSignedIn} onProfile={() => onNavigate("profile")} />

      <div style={{ padding: "10px 0 0 16px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
        {SAVED_FILTERS.map((filter) => (
          <Pill key={filter.cat} active={category === filter.cat} onClick={() => setCategory(filter.cat)}>
            {filter.label}
          </Pill>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 16px 80px", display: "flex", flexDirection: "column", gap: 16 }}>
        {!isSignedIn ? (
          <EmptySaved onNeedSignIn={onNeedSignIn} />
        ) : loading ? (
          <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", paddingTop: 60 }}>Loading saved articles...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>No saved articles yet</p>
          </div>
        ) : (
          filtered.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              onClick={() => openReader(index)}
              saved={isSignedIn && savedIds.includes(article.id)}
              onSave={onSave}
            />
          ))
        )}
      </div>

      <BottomNav active="saved" onNavigate={onNavigate} />

      <div className={`reader-wrap ${readerOpen ? "open" : ""}`}>
        {readerOpen && (
          <ArticleReader
            articles={readerArticles}
            startIndex={readerStart}
            onClose={() => setReaderOpen(false)}
            savedIds={savedIds}
            onSave={onSave}
          />
        )}
      </div>
    </div>
  );
}

function EmptySaved({ onNeedSignIn }) {
  return (
    <div style={{ textAlign: "center", paddingTop: 60 }}>
      <div style={{ width: 56, height: 56, background: "var(--surface)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        <Ic.Bookmark c="var(--muted-2)" s={24} />
      </div>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink)", marginBottom: 6 }}>Sign in to save articles</p>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Your saved articles will appear here</p>
      <button onClick={onNeedSignIn} style={{ padding: "11px 28px", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500 }}>
        Sign in
      </button>
    </div>
  );
}