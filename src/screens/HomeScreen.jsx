import { useEffect, useRef, useState } from "react";
import { fetchArticles } from "../services/articlesApi.js";
import { ARTICLE_FILTERS, COURT_FILTERS } from "../data/filters.js";
import { TopBar } from "../components/layout/TopBar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { NewsCard } from "../components/news/NewsCard.jsx";
import { ArticleReader } from "../components/news/ArticleReader.jsx";
import { Pill } from "../components/ui/Pill.jsx";
import { formatArticle } from "../utils/formatArticle.js";

/**
 * useDragScroll — click-and-drag horizontal scroll for containers
 * whose children are <button> elements (which normally eat mousedown).
 * Uses a CSS class "dragging" on the container to disable pointer-events
 * on children during the drag, so the container receives all mouse events.
 */
function useDragScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let scrollLeft = 0;
    let dragging = false;
    let moved = false;

    const onMouseDown = (e) => {
      dragging = true;
      moved = false;
      startX = e.pageX;
      scrollLeft = el.scrollLeft;
      el.classList.add("dragging");
    };

    const onMouseMove = (e) => {
      if (!dragging) return;
      const delta = e.pageX - startX;
      if (Math.abs(delta) > 3) moved = true;
      el.scrollLeft = scrollLeft - delta;
    };

    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("dragging");
      // Re-enable pointer events after a tick so the suppressed
      // mouseup doesn't immediately fire a click on the pill
      if (moved) {
        setTimeout(() => { moved = false; }, 0);
      }
    };

    // Suppress click on children if we actually dragged
    const onClickCapture = (e) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return ref;
}

export function HomeScreen({ onNavigate, savedIds, onSave, isSignedIn, user, onNeedSignIn, onShare, onMore, onRead, feedView, onChangeFeedView, darkMode, lang }) {
  const [category, setCategory] = useState("all");
  const [court, setCourt] = useState("all");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryRowRef = useDragScroll();
  const courtRowRef = useDragScroll();

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

      const result = await fetchArticles({ includeOlder, limit: 3, category });
      setArticles(result.articles.map(formatArticle));
      setNextCursor(result.nextCursor);
      setHasMore(!!result.nextCursor);
      setLoading(false);
    }
    loadArticles();
  }, [includeOlder, category]);

  const filtered = articles
    .filter((article) => {
      if (category === "all" || category === "fy") return true;
      return article.cat === category;
    })
    .filter((article) => {
      if (court === "all") return true;
      return article.courtCat === court;
    });

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

    setLoadingMore(true);
    const result = await fetchArticles({ mode: activeMode, cursor: activeCursor, limit: 10, category });
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
    if (loadingMore) return [];
    setLoadingMore(true);
    const result = await fetchArticles({ mode: "older", cursor: olderCursor, limit: 10, category });
    const formattedOlderArticles = result.articles.map(formatArticle);
    setArticles((current) => [...current, ...formattedOlderArticles]);
    setReaderArticles((current) => [...current, ...formattedOlderArticles]);
    setOlderCursor(result.nextCursor);
    setHasMore(!!result.nextCursor);
    setOlderMode(true);
    setLoadingMore(false);
    return formattedOlderArticles;
  };

  const handleSave = (id) => {
    if (!isSignedIn) return onNeedSignIn();
    onSave(id);
  };

  if (loading) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <div style={{ width: 32, height: 32, border: "2px solid var(--border)", borderTopColor: "var(--ink)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Loading articles...</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <TopBar isSignedIn={isSignedIn} user={user} onProfile={() => onNavigate("profile")} darkMode={darkMode} />

      {/* Category filter row */}
      <div ref={categoryRowRef} style={{ padding: "10px 0 4px 16px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {ARTICLE_FILTERS.map((filter, i) => (
          <Pill
            key={filter.cat}
            active={category === filter.cat}
            onClick={() => {
              if (filter.cat === "fy" && !isSignedIn) return onNeedSignIn();
              setCategory(filter.cat);
              setCourt("all");
            }}
            style={i === ARTICLE_FILTERS.length - 1 ? { marginRight: 16 } : {}}
          >
            {filter.label}{filter.cat === "fy" && !isSignedIn ? " 🔒" : ""}
          </Pill>
        ))}
      </div>

      {/* Court filter row */}
      <div ref={courtRowRef} style={{ padding: "4px 0 8px 16px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {COURT_FILTERS.map((filter, i) => (
          <Pill
            key={filter.court}
            active={court === filter.court}
            onClick={() => setCourt(filter.court)}
            style={i === COURT_FILTERS.length - 1 ? { marginRight: 16 } : {}}
          >
            {filter.label}
          </Pill>
        ))}
      </div>

      {feedView === "reader" ? (
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <ArticleReader
            articles={filtered}
            startIndex={0}
            onClose={() => {
              // Back from reader mode goes to glance mode
              if (onChangeFeedView) onChangeFeedView("glance");
            }}
            onGoHome={() => {
              if (onChangeFeedView) onChangeFeedView("glance");
            }}
            onViewOlder={async () => await loadOlderArticles()}
            savedIds={savedIds}
            onSave={handleSave}
            onShare={onShare}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMoreArticles}
            canViewOlder={!olderMode}
            embedded={true}
            lang={lang}
          />
        </div>
      ) : (
        <div
          className="card-feed"
          onScroll={(e) => {
            const el = e.currentTarget;
            const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 200;
            if (nearBottom && hasMore && !loadingMore) loadMoreArticles();
          }}
        >
          {filtered.length === 0 ? (
            <p style={{ padding: 16, color: "var(--muted)", fontSize: 13, textAlign: "center", paddingTop: 40 }}>
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
                lang={lang}
              />
            ))
          )}

          {loadingMore && (
            <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, padding: 12 }}>
              Loading more...
            </p>
          )}

          {!hasMore && !olderMode && (
            <button
              onClick={async () => await loadOlderArticles()}
              style={{
                padding: "12px",
                background: "var(--surface)",
                border: "0.5px solid var(--border)",
                borderRadius: 12,
                fontSize: 13,
                color: "var(--ink)",
                fontWeight: 500,
                width: "100%",
                transition: "background 0.15s, transform 0.15s",
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.background = "var(--surface-2)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "var(--surface)"; }}
              onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.background = "var(--surface-2)"; }}
              onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "var(--surface)"; }}
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
            onViewOlder={async () => await loadOlderArticles()}
            savedIds={savedIds}
            onSave={handleSave}
            onShare={onShare}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={async () => {
              const newArticles = await loadMoreArticles();
              setReaderArticles((current) => [...current, ...newArticles]);
            }}
            canViewOlder={!olderMode}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
}