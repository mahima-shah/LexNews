import { useState, useEffect } from "react";
import { createArticle, fetchPendingArticles, approveArticle, rejectArticle } from "../services/articlesApi.js";
import { ArticleReader } from "../components/news/ArticleReader.jsx";
import { formatArticle } from "../utils/formatArticle.js";

export function AdminScreen({ onNavigate }) {
  const [tab, setTab] = useState("queue");

  // --- Queue state ---
  const [pending, setPending] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [undoToast, setUndoToast] = useState(null);

  // --- Reader state ---
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerIndex, setReaderIndex] = useState(0);

  // --- Publish form state ---
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    body: "",
    category: "General Law",
    source_name: "",
    source_url: "",
    image_url: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (tab === "queue") loadPending();
  }, [tab]);

  const loadPending = async () => {
    setLoadingQueue(true);
    const data = await fetchPendingArticles();
    setPending(data.map(formatArticle));
    setLoadingQueue(false);
  };

  const openReader = (index) => {
    setReaderIndex(index);
    setReaderOpen(true);
  };

  const handleApprove = async (article) => {
    setPending((current) => current.filter((a) => a.id !== article.id));
    setReaderOpen(false);
    await approveArticle(article.id);
  };

  const handleReject = (article) => {
    setPending((current) => current.filter((a) => a.id !== article.id));
    setReaderOpen(false);

    let countdown = 30;
    const interval = setInterval(() => {
      countdown -= 1;
      setUndoToast((current) =>
        current?.article.id === article.id ? { ...current, countdown } : current
      );
      if (countdown <= 0) {
        clearInterval(interval);
        rejectArticle(article.id);
        setUndoToast(null);
      }
    }, 1000);

    setUndoToast({ article, interval, countdown });
  };

  const handleUndo = () => {
    if (!undoToast) return;
    clearInterval(undoToast.interval);
    setPending((current) => [undoToast.article, ...current]);
    setUndoToast(null);
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const publishArticle = async () => {
    setMessage("Publishing...");
    const result = await createArticle({ ...form, status: "approved" });
    if (!result.success) {
      setMessage("Could not publish article.");
      return;
    }
    setMessage("Article published.");
    setForm({ title: "", subtitle: "", body: "", category: "General Law", source_name: "", source_url: "", image_url: "" });
  };

  // Current article being viewed in reader
  const currentArticle = pending[readerIndex];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px 0", flexShrink: 0 }}>
        <button
          onClick={() => onNavigate("profile")}
          style={{ background: "none", border: "none", fontSize: 13, color: "var(--muted)", cursor: "pointer", padding: 0, marginBottom: 8 }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>Admin</h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 16, borderBottom: "0.5px solid var(--border)", marginTop: 12 }}>
          {["queue", "publish"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "none",
                border: "none",
                padding: "8px 0",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                color: tab === t ? "var(--ink)" : "var(--muted)",
                borderBottom: tab === t ? "2px solid var(--ink)" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {t === "queue" ? `Review Queue ${pending.length > 0 ? `(${pending.length})` : ""}` : "Publish Article"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 80px" }}>

        {/* Queue Tab */}
        {tab === "queue" && (
          <div>
            {loadingQueue ? (
              <p style={{ padding: "16px 20px", fontSize: 13, color: "var(--muted)" }}>Loading...</p>
            ) : pending.length === 0 ? (
              <p style={{ padding: "16px 20px", fontSize: 13, color: "var(--muted)" }}>No articles pending review.</p>
            ) : (
              pending.map((article, index) => (
                <div
                  key={article.id}
                  style={{ padding: "14px 20px", borderBottom: "0.5px solid var(--border)" }}
                >
                  <p style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4, fontWeight: 500, letterSpacing: 0.5 }}>
                    {article.category} · {article.source_name}
                  </p>

                  {/* Tappable title area opens reader */}
                  <div
                    onClick={() => openReader(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.35, marginBottom: 4 }}>
                      {article.title}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 4 }}>
                      {article.subtitle}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--muted-2)", marginBottom: 10 }}>
                      Tap to read full article →
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleApprove(article)}
                      style={{
                        flex: 1, padding: "8px 0", background: "var(--ink)", color: "var(--white)",
                        border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                      }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(article)}
                      style={{
                        flex: 1, padding: "8px 0", background: "none", color: "var(--ink)",
                        border: "0.5px solid var(--border)", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                      }}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Publish Tab */}
        {tab === "publish" && (
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>Manually publish an article to the feed.</p>
            <input placeholder="Title" value={form.title} onChange={(e) => updateField("title", e.target.value)} style={{ padding: "10px 12px", border: "0.5px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--ink)", background: "var(--white)" }} />
            <input placeholder="Subtitle" value={form.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} style={{ padding: "10px 12px", border: "0.5px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--ink)", background: "var(--white)" }} />
            <select value={form.category} onChange={(e) => updateField("category", e.target.value)} style={{ padding: "10px 12px", border: "0.5px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--ink)", background: "var(--white)" }}>
              <option>General Law</option>
              <option>Corporate</option>
              <option>Direct Tax</option>
              <option>Indirect Tax</option>
            </select>
            <textarea placeholder="Body" value={form.body} onChange={(e) => updateField("body", e.target.value)} rows={5} style={{ padding: "10px 12px", border: "0.5px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--ink)", background: "var(--white)", resize: "vertical" }} />
            <input placeholder="Source Name" value={form.source_name} onChange={(e) => updateField("source_name", e.target.value)} style={{ padding: "10px 12px", border: "0.5px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--ink)", background: "var(--white)" }} />
            <input placeholder="Source URL" value={form.source_url} onChange={(e) => updateField("source_url", e.target.value)} style={{ padding: "10px 12px", border: "0.5px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--ink)", background: "var(--white)" }} />
            <input placeholder="Image URL" value={form.image_url} onChange={(e) => updateField("image_url", e.target.value)} style={{ padding: "10px 12px", border: "0.5px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--ink)", background: "var(--white)" }} />
            <button onClick={publishArticle} style={{ padding: "10px 0", background: "var(--ink)", color: "var(--white)", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Publish Article
            </button>
            {message && <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}>{message}</p>}
          </div>
        )}
      </div>

      {/* Article Reader overlay */}
      <div className={`reader-wrap ${readerOpen ? "open" : ""}`}>
        {readerOpen && currentArticle && (
          <>
            <ArticleReader
              articles={pending}
              startIndex={readerIndex}
              onClose={() => setReaderOpen(false)}
              onGoHome={() => setReaderOpen(false)}
              savedIds={[]}
              onSave={() => {}}
            />
            {/* Approve / Reject bar inside reader */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              gap: 10,
              padding: "12px 16px 20px",
              background: "var(--white)",
              borderTop: "0.5px solid var(--border)",
              zIndex: 50,
            }}>
              <button
                onClick={() => handleApprove(currentArticle)}
                style={{ flex: 1, padding: "10px 0", background: "var(--ink)", color: "var(--white)", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                ✓ Approve
              </button>
              <button
                onClick={() => handleReject(currentArticle)}
                style={{ flex: 1, padding: "10px 0", background: "none", color: "var(--ink)", border: "0.5px solid var(--border)", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                ✕ Reject
              </button>
            </div>
          </>
        )}
      </div>

      {/* Undo Toast */}
      {undoToast && (
        <div style={{
          position: "absolute", bottom: 20, left: 16, right: 16,
          background: "var(--ink)", color: "var(--white)", borderRadius: 12,
          padding: "12px 16px", display: "flex", alignItems: "center",
          justifyContent: "space-between", zIndex: 100,
        }}>
          <p style={{ fontSize: 13, margin: 0 }}>
            Article rejected · undoing in {undoToast.countdown}s
          </p>
          <button
            onClick={handleUndo}
            style={{ background: "none", border: "0.5px solid var(--white)", color: "var(--white)", borderRadius: 6, padding: "4px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}