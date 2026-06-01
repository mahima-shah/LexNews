import { useEffect, useState } from "react";

export function useSavedArticles(isSignedIn) {
  const [savedIds, setSavedIds] = useState(() => {
    if (localStorage.getItem("lexlegis_signed_in") !== "true") {
      return [];
    }

    const saved = localStorage.getItem("lexlegis_saved_articles");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!isSignedIn) {
      setSavedIds([]);
      return;
    }

    localStorage.setItem(
      "lexlegis_saved_articles",
      JSON.stringify(savedIds)
    );
  }, [savedIds, isSignedIn]);

  const toggleSave = (id) => {
    if (!isSignedIn) return;

    setSavedIds((saved) =>
      saved.includes(id)
        ? saved.filter((item) => item !== id)
        : [...saved, id]
    );
  };

  return { savedIds, toggleSave };
}