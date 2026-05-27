import { useState } from "react";

export function useSavedArticles() {
  const [savedIds, setSavedIds] = useState([]);
  const toggleSave = (id) => {
    setSavedIds((saved) => saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]);
  };
  return { savedIds, toggleSave };
}
