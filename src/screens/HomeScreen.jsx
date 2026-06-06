import { useEffect, useState } from "react";
import { fetchArticles } from "../services/articlesApi.js";
import { ARTICLE_FILTERS } from "../data/filters.js";
import { TopBar } from "../components/layout/TopBar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { NewsCard } from "../components/news/NewsCard.jsx";
import { ArticleReader } from "../components/news/ArticleReader.jsx";
import { Pill } from "../components/ui/Pill.jsx";
import { formatArticle } from "../utils/formatArticle.js";

export function HomeScreen({ onNavigate, savedIds, onSave, isSignedIn, user, onNeedSignIn, onShare, onMore, onRead, feedView }) {
  const [category, setCategory] = useState("all");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [readerOpen, setReaderOpen] = useState(false);
  const [readerArticles, setReaderArticles] = useState([]);
  const [readerStart, setReaderStart] = useState(0);
  const [includeOlder, setIncludeOlder] = useState(false);

  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [olderCursor, setOlderCursor] = useState(null);
  const [olderMode, setOlderMode] = useState(false);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);

      setOlderMode(false);
      setOlderCursor(null);
      setNextCursor(null);

      const result = await fetchArticles({
        includeOlder,
        limit: 3,
        category,
      });

      setArticles(result.articles.map(formatArticle));
      setNextCursor(result.nextCursor);
      setHasMore(!!result.nextCursor);
      setLoading(false);
    }

    loadArticles();
  }, [includeOlder, category]);

  const filtered =
    category === "all"
      ? articles
      : category === "fy"
        ? articles
        : articles.filter((article) => article.cat === category);

  const openReader = (index) => {
    if (onRead) onRead(filtered[index].id);

    setReaderArticles(filtered);
    setReaderStart(index);
    setReaderOpen(true);
  };

  const loadMoreArticles = async () => {
    if (loadingMore) return [];

    const activeMode = olderMode ? "older" : "latest";
    const activeCursor = olderMode ? olderCursor : nextCursor;

    if (!activeCursor) return [];

    console.log("LOAD MORE:", {
      mode: activeMode,
      cursor: activeCursor,
      loadingMore,
    });

    setLoadingMore(true);

    const result = await fetchArticles({
      mode: activeMode,
      cursor: activeCursor,
      limit: 10,
      category,
    });

    const formattedNewArticles = result.articles.map(formatArticle);

    setArticles((current) => [...current, ...formattedNewArticles]);

    if (olderMode) {
      setOlderCursor(result.nextCursor);
    } else {
      setNextCursor(result.nextCursor);
      setHasMore(!!result.nextCursor);
    }

    setLoadingMore(false);

    return formattedNewArticles;
  };

  const loadOlderArticles = async () => {
    console.log("LOAD OLDER:", { olderCursor, loadingMore });
    if (loadingMore) return [];

    setLoadingMore(true);

    const result = await fetchArticles({
      mode: "older",
      cursor: olderCursor,
      limit: 10,
      category,
    });

    const formattedOlderArticles = result.articles.map(formatArticle);

    setArticles((current) => [...current, ...formattedOlderArticles]);
    setReaderArticles((current) => [...current, ...formattedOlderArticles]);

    setOlderCursor(result.nextCursor);
    setHasMore(!!result.nextCursor);
    setOlderMode(true);
    setLoadingMore(false);

    console.log("LOADED OLDER:", {
      count: result.articles.length,
      nextCursor: result.nextCursor,
    });

    return formattedOlderArticles;
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

      <div style={{ padding: "10px 0 10px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
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

      {feedView === "reader" ? (
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <ArticleReader
            articles={filtered}
            startIndex={0}
            onClose={() => { 
              setCategory("all");
            }}
            onGoHome={() => {
              setCategory("all");
            }}
            onViewOlder={async () => {
              await loadOlderArticles();
            }}
            savedIds={savedIds}
            onSave={handleSave}
            onShare={onShare}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMoreArticles}
            canViewOlder={!olderMode}
            embedded={true}
          />
        </div>
      ) : (
        <div
          className="card-feed"
          onScroll={(event) => {
            const element = event.currentTarget;

            const nearBottom =
              element.scrollTop + element.clientHeight >= element.scrollHeight - 200;

            if (nearBottom && hasMore && !loadingMore) {
              loadMoreArticles();
            }
          }}
        >
          {filtered.length === 0 ? (
            <p style={{ padding: 16, color: "var(--muted)", fontSize: 13 }}>
              No articles found.
            </p>
          ) : (
            filtered.map((article, index) => (
              <NewsCard
                key={article.id}
                article={article}
                onClick={() => openReader(index)}
                saved={isSignedIn && savedIds.includes(article.id)}
                onSave={handleSave}
                onShare={onShare}
                onMore={onMore}
              />
            ))
          )}

          {loadingMore && (
            <p
              style={{
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 12,
                padding: 12,
              }}
            >
              Loading more...
            </p>
          )}

          {!hasMore && !olderMode && (
            <button
              onClick={async () => {
                console.log("VIEW OLDER POSTS CLICKED");
                await loadOlderArticles();
              }}
              style={{
                padding: "12px",
                background: "var(--surface)",
                border: "0.5px solid var(--border)",
                borderRadius: 12,
                fontSize: 13,
                color: "var(--ink)",
                fontWeight: 500,
              }}
            >
              View older posts
            </button>
          )}
        </div>
      )}

      <BottomNav active="home" onNavigate={onNavigate} />

      <div className={`reader-wrap ${readerOpen ? "open" : ""}`}>
        {readerOpen && (
          <ArticleReader
            articles={readerArticles}
            startIndex={readerStart}
            onClose={() => setReaderOpen(false)}
            onGoHome={() => {
              setReaderOpen(false);
              onNavigate("home");
            }}
            onViewOlder={async () => {
              await loadOlderArticles();
            }}
            savedIds={savedIds}
            onSave={handleSave}
            onShare={onShare}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={async () => {
              const newArticles = await loadMoreArticles();

              setReaderArticles((current) => [
                ...current,
                ...newArticles,
              ]);
            }}
            canViewOlder={!olderMode}
          />
        )}
      </div>
    </div>
  );
}