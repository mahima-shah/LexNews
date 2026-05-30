import { useEffect, useState } from "react";
import { fetchArticles } from "../services/articlesApi.js";
import { ARTICLE_FILTERS } from "../data/filters.js";
import { TopBar } from "../components/layout/TopBar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { NewsCard } from "../components/news/NewsCard.jsx";
import { ArticleReader } from "../components/news/ArticleReader.jsx";
import { Pill } from "../components/ui/Pill.jsx";
import { formatArticle } from "../utils/formatArticle.js";

export function HomeScreen({ onNavigate, savedIds, onSave, isSignedIn, onNeedSignIn, onShare }) {
  const [category, setCategory] = useState("all");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [readerOpen, setReaderOpen] = useState(false);
  const [readerArticles, setReaderArticles] = useState([]);
  const [readerStart, setReaderStart] = useState(0);

  useEffect(() => {
    async function loadArticles() {
      const data = await fetchArticles();

      const formattedArticles = data.map(formatArticle);

      setArticles(formattedArticles);
      setLoading(false);
    }

    loadArticles();
  }, []);

  const filtered =
    category === "all"
      ? articles
      : category === "fy"
      ? articles
      : articles.filter((article) => article.cat === category);

  const openReader = (index) => {
    setReaderArticles(filtered);
    setReaderStart(index);
    setReaderOpen(true);
  };

  const handleSave = (id) => {
    if (!isSignedIn) return onNeedSignIn();
    onSave(id);
  };

  if (loading) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading articles...
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <TopBar isSignedIn={isSignedIn} onProfile={() => onNavigate("profile")} />

      <div style={{ padding: "10px 0 0 16px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
        {ARTICLE_FILTERS.map((filter) => (
          <Pill
            key={filter.cat}
            active={category === filter.cat}
            onClick={() => {
              if (filter.cat === "fy" && !isSignedIn) return onNeedSignIn();
              setCategory(filter.cat);
            }}
          >
            {filter.label}
            {filter.cat === "fy" && !isSignedIn ? "  🔒" : ""}
          </Pill>
        ))}
      </div>

      <div className="card-feed" style={{ paddingTop: 12 }}>
        {filtered.length === 0 ? (
          <p style={{ padding: 16, color: "var(--muted)", fontSize: 13 }}>No articles found.</p>
        ) : (
          filtered.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              onClick={() => openReader(index)}
              saved={isSignedIn && savedIds.includes(article.id)}
              onSave={handleSave}
              onShare={onShare}
            />
          ))
        )}
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />

      <div className={`reader-wrap ${readerOpen ? "open" : ""}`}>
        {readerOpen && (
          <ArticleReader
            articles={readerArticles}
            startIndex={readerStart}
            onClose={() => setReaderOpen(false)}
            savedIds={savedIds}
            onSave={handleSave}
            onShare={onShare}
          />
        )}
      </div>
    </div>
  );
}