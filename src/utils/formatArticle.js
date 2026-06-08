/**
 * Infers court category from text fields since the `court` column
 * in Supabase is currently NULL for all rows.
 * Checks article.court first, then falls back to scanning
 * title + ai_summary for court mentions.
 */
function inferCourtCat(article) {
  // Use the court column if it's populated
  if (article.court) {
    const c = article.court.toLowerCase();
    if (c.includes("supreme")) return "sc";
    if (c.includes("high")) return "hc";
  }

  // Fall back to scanning title + summary
  const text = `${article.title || ""} ${article.ai_summary || ""}`.toLowerCase();
  if (text.includes("supreme court")) return "sc";
  if (
    text.includes("high court") ||
    text.includes("delhi hc") ||
    text.includes("bombay hc") ||
    text.includes("madras hc") ||
    text.includes("calcutta hc") ||
    text.includes("allahabad hc") ||
    text.includes("kerala hc") ||
    text.includes("madhya pradesh hc")
  ) return "hc";

  return "all"; // no court context — show under All Courts
}

export function formatArticle(article) {
  return {
    ...article,

    cat:
      article.category === "Direct Tax" ? "dt"
      : article.category === "Indirect Tax" ? "it"
      : article.category === "Corporate" ? "cl"
      : "gl",

    courtCat: inferCourtCat(article),

    tag: article.category,
    tagStyle: "tag-gl",

    imgColor: "#f2f2f2",
    imgAccent: "#111111",

    date: new Date(article.created_at).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ),

    readTime: "3 min read",

    sources: [
      {
        name: article.source_name || "Source",
        url: article.source_url || "#",
        time: "Now",
      },
    ],
  };
}