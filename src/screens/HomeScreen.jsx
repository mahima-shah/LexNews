import { useState } from "react";
import { ARTICLES } from "../data/articles.js";
import { ARTICLE_FILTERS } from "../data/filters.js";
import { TopBar } from "../components/layout/TopBar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { NewsCard } from "../components/news/NewsCard.jsx";
import { ArticleReader } from "../components/news/ArticleReader.jsx";
import { Pill } from "../components/ui/Pill.jsx";

export function HomeScreen({ onNavigate, savedIds, onSave, isSignedIn, onNeedSignIn }) {
  const [category, setCategory] = useState("fy");
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerArticles, setReaderArticles] = useState([]);
  const [readerStart, setReaderStart] = useState(0);

  const filtered = category === "fy" ? ARTICLES.filter((article) => article.forYou) : category === "all" ? ARTICLES : ARTICLES.filter((article) => article.cat === category);

  const openReader = (index) => {
    setReaderArticles(filtered);
    setReaderStart(index);
    setReaderOpen(true);
  };

  const handleSave = (id) => {
    if (!isSignedIn) return onNeedSignIn();
    onSave(id);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <TopBar isSignedIn={isSignedIn} onProfile={() => onNavigate("profile")} />
      <div style={{ padding: "10px 0 0 16px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
        {ARTICLE_FILTERS.map((filter) => (
          <Pill key={filter.cat} active={category === filter.cat} onClick={() => {
            if (filter.cat === "fy" && !isSignedIn) return onNeedSignIn();
            setCategory(filter.cat);
          }}>
            {filter.label}{filter.cat === "fy" && !isSignedIn ? "  🔒" : ""}
          </Pill>
        ))}
      </div>
      <div className="card-feed" style={{ paddingTop: 12 }}>
        {filtered.map((article, index) => <NewsCard key={article.id} article={article} onClick={() => openReader(index)} saved={savedIds.includes(article.id)} onSave={handleSave} />)}
      </div>
      <BottomNav active="home" onNavigate={onNavigate} />
      <div className={`reader-wrap ${readerOpen ? "open" : ""}`}>
        {readerOpen && <ArticleReader articles={readerArticles} startIndex={readerStart} onClose={() => setReaderOpen(false)} savedIds={savedIds} onSave={handleSave} />}
      </div>
    </div>
  );
}
