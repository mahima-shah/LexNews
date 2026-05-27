import { TAG_COLORS } from "../../data/articles.js";

export function Tag({ article }) {
  const [background, color] = TAG_COLORS[article.tagStyle] || ["#eeeeee", "#222222"];
  return <span className="tag" style={{ background, color }}>{article.tag}</span>;
}
