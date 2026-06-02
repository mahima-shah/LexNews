export function formatArticle(article) {
  return {
    ...article,

    cat:
      article.category === "Direct Tax"
        ? "dt"
        : article.category === "Indirect Tax"
          ? "it"
          : article.category === "Corporate"
            ? "cl"
            : "gl",

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