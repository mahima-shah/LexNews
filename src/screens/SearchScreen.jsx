import { useEffect, useState } from "react";
import { Ic } from "../constants/icons.jsx";
import { TRENDING_TOPICS } from "../data/filters.js";
import { TopBar } from "../components/layout/TopBar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { searchArticles } from "../services/articlesApi.js";
import { ArticleReader } from "../components/news/ArticleReader.jsx";
import { formatArticle } from "../utils/formatArticle.js";

export function SearchScreen({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState(() => {
    return JSON.parse(localStorage.getItem("lexnews_recent_searches")) || [];
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [readerOpen, setReaderOpen] = useState(false);
  const [readerStart, setReaderStart] = useState(0);

  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const highlight = (text, query) => {
    if (!text || !query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} style={{ background: "yellow", color: "black", borderRadius: 2, padding: "0 2px" }}>{part}</mark>
        : part
    );
  };

  const getSnippet = (text, query) => {
    if (!text || !query.trim()) return null;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return null;
    const start = Math.max(0, index - 60);
    const end = Math.min(text.length, index + query.length + 60);
    const snippet = (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");
    return snippet;
  };

  const saveRecentSearch = (searchText) => {
    const clean = searchText.trim();
    if (!clean) return;

    const updated = [
      clean,
      ...recents.filter((item) => item.toLowerCase() !== clean.toLowerCase()),
    ].slice(0, 5);

    setRecents(updated);
    localStorage.setItem("lexnews_recent_searches", JSON.stringify(updated));
  };

  const openReader = (index) => {
    setReaderStart(index);
    setReaderOpen(true);
    saveRecentSearch(query);
  };

  const loadMoreSearchResults = async () => {
    if (!nextCursor || loadingMore || !query.trim()) return;

    console.log("LOAD MORE SEARCH:", {
      query,
      cursor: nextCursor,
    });

    setLoadingMore(true);

    const result = await searchArticles({
      query,
      cursor: nextCursor,
      limit: 10,
    });

    const formattedResults = (result.articles || []).map(formatArticle);

    setResults((current) => [...current, ...formattedResults]);
    setNextCursor(result.nextCursor);
    setLoadingMore(false);
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    async function runSearch() {
      setLoading(true);
      const result = await searchArticles({
        query,
        cursor: null,
        limit: 10,
      });

      console.log("SEARCH RESULT:", {
        query,
        count: result.articles?.length || 0,
        nextCursor: result.nextCursor,
      });

      const formattedResults = (result.articles || []).map(formatArticle);
      setResults(formattedResults);
      setNextCursor(result.nextCursor);
      setLoading(false);
    }

    const timer = setTimeout(runSearch, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <TopBar showProfile={false} />

      <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
        <div className="search-input-wrap">
          <Ic.Search c="var(--muted-2)" s={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                saveRecentSearch(query);
              }
            }}
            placeholder="Search cases, acts, keywords…"
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", display: "flex" }}>
              <Ic.Close c="var(--muted-2)" s={16} />
            </button>
          )}
        </div>
      </div>

      <div
        style={{ flex: 1, overflowY: "auto", padding: "0 0 80px" }}
        onScroll={(event) => {
          const element = event.currentTarget;

          const nearBottom =
            element.scrollTop + element.clientHeight >=
            element.scrollHeight - 200;

          if (nearBottom && nextCursor && !loadingMore && query.trim()) {
            loadMoreSearchResults();
          }
        }}
      >
        {query.trim() ? (
          <>
            <p style={{ fontSize: 10, color: "var(--muted)", padding: "14px 16px 6px", fontWeight: 500, letterSpacing: 0.5 }}>
              SEARCH RESULTS
            </p>

            {loading ? (
              <p style={{ padding: "12px 16px", fontSize: 13, color: "var(--muted)" }}>Searching...</p>
            ) : results.length === 0 ? (
              <p style={{ padding: "12px 16px", fontSize: 13, color: "var(--muted)" }}>No matching articles found.</p>
            ) : (
              <div style={{ padding: "0 16px" }}>
                {results.map((article, index) => {
                  const titleHasMatch = article.title?.toLowerCase().includes(query.toLowerCase());
                  const subtitleHasMatch = article.subtitle?.toLowerCase().includes(query.toLowerCase());
                  const bodySnippet = getSnippet(article.body, query);

                  return (
                    <div
                      key={article.id}
                      onClick={() => openReader(index)}
                      style={{
                        padding: "12px 0",
                        borderBottom: "0.5px solid var(--border)",
                        cursor: "pointer",
                      }}
                    >
                      <p style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>
                        {article.category}
                      </p>
                      <p style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500, lineHeight: 1.35 }}>
                        {highlight(article.title, query)}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginTop: 4 }}>
                        {highlight(article.subtitle, query)}
                      </p>
                      {bodySnippet && !titleHasMatch && !subtitleHasMatch && (
                        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginTop: 4, fontStyle: "italic" }}>
                          {highlight(bodySnippet, query)}
                        </p>
                      )}
                    </div>
                  );
                })}

                {loadingMore && (
                  <p style={{ padding: "12px 16px", fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
                    Loading more results...
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {recents.length > 0 && (
              <>
                <p style={{ fontSize: 10, color: "var(--muted)", padding: "14px 16px 6px", fontWeight: 500, letterSpacing: 0.5 }}>
                  RECENT SEARCHES
                </p>

                <div style={{ padding: "0 16px" }}>
                  {recents.map((recent, index) => (
                    <div key={recent} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "0.5px solid var(--border)" }}>
                      <Ic.Clock c="var(--muted-2)" s={16} />

                      <button
                        onClick={() => setQuery(recent)}
                        style={{
                          flex: 1,
                          background: "none",
                          border: "none",
                          textAlign: "left",
                          fontSize: 13,
                          color: "var(--ink)",
                          cursor: "pointer",
                        }}
                      >
                        {recent}
                      </button>

                      <button
                        onClick={() => {
                          const updated = recents.filter((_, itemIndex) => itemIndex !== index);
                          setRecents(updated);
                          localStorage.setItem("lexnews_recent_searches", JSON.stringify(updated));
                        }}
                        style={{ background: "none", border: "none", display: "flex", cursor: "pointer" }}
                      >
                        <Ic.Close c="var(--muted-2)" s={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p style={{ fontSize: 10, color: "var(--muted)", padding: "16px 16px 8px", fontWeight: 500, letterSpacing: 0.5 }}>
              TRENDING TOPICS
            </p>

            <div style={{ padding: "0 16px", display: "flex", flexWrap: "wrap", gap: 7 }}>
              {TRENDING_TOPICS.map((topic) => (
                <button
                  key={topic}
                  className="tag"
                  onClick={() => {
                    setQuery(topic);
                    saveRecentSearch(topic);
                  }}
                  style={{
                    borderRadius: 20,
                    fontSize: 12,
                    padding: "5px 12px",
                    border: "0.5px solid var(--border)",
                    cursor: "pointer",
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav active="search" onNavigate={onNavigate} />

      <div className={`reader-wrap ${readerOpen ? "open" : ""}`}>
        {readerOpen && (
          <ArticleReader
            articles={results}
            startIndex={readerStart}
            onClose={() => setReaderOpen(false)}
            onGoHome={() => {
              setReaderOpen(false);
              onNavigate("home");
            }}
            savedIds={[]}
            onSave={() => { }}
          />
        )}
      </div>
    </div>
  );
}