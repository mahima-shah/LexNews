import { useEffect, useState } from "react";

export function useSavedArticles() {
  const [savedIds, setSavedIds] = useState(() => {
    const saved = localStorage.getItem("lexlegis_saved_articles");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("lexlegis_saved_articles", JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id) => {
    setSavedIds((saved) =>
      saved.includes(id)
        ? saved.filter((item) => item !== id)
        : [...saved, id]
    );
  };

  return { savedIds, toggleSave };
}