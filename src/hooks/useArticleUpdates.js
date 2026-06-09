import { useEffect, useState, useCallback } from "react";

const SNAPSHOT_KEY = "lexlegis_article_snapshots";
const SEEN_UPDATES_KEY = "lexlegis_seen_updates";

/**
 * Generates a simple content fingerprint for an article.
 * Compares source count and body length — changes in either = "updated".
 */
function fingerprint(article) {
  return `${article.sources?.length ?? 0}|${article.body?.length ?? 0}|${article.date ?? ""}`;
}

/**
 * useArticleUpdates
 *
 * Tracks which saved articles have changed since the user last viewed them.
 *
 * How it works:
 * 1. On mount (and whenever savedIds/articles change), compares each saved
 *    article's current fingerprint against a stored snapshot in localStorage.
 * 2. If a fingerprint differs → that article is "updated".
 * 3. Calling markAllSeen() saves the current fingerprints as the new baseline
 *    and clears the update count.
 * 4. Calling markArticleSeen(id) clears the update flag for a single article.
 *
 * @param {number[]} savedIds   - array of saved article IDs (from useSavedArticles)
 * @param {object[]} articles   - the full article objects for those IDs
 * @returns {{ updatedIds: Set<number>, unreadCount: number, markAllSeen, markArticleSeen }}
 */
export function useArticleUpdates(savedIds, articles) {
  const [updatedIds, setUpdatedIds] = useState(() => new Set());

  // Load stored snapshots
  const getSnapshots = () => {
    try {
      const raw = localStorage.getItem(SNAPSHOT_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  // Load which updates the user has already dismissed
  const getSeenUpdates = () => {
    try {
      const raw = localStorage.getItem(SEEN_UPDATES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveSnapshots = (snaps) => {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snaps));
  };

  const checkForUpdates = useCallback(() => {
    if (!articles || articles.length === 0) return;

    const snapshots = getSnapshots();
    const seenUpdates = getSeenUpdates();
    const newUpdatedIds = new Set();

    for (const article of articles) {
      if (!savedIds.includes(article.id)) continue;

      const current = fingerprint(article);
      const stored = snapshots[article.id];

      if (stored === undefined) {
        // First time seeing this article — save snapshot, not an "update"
        snapshots[article.id] = current;
      } else if (stored !== current && !seenUpdates.includes(article.id)) {
        // Fingerprint changed and user hasn't dismissed this update
        newUpdatedIds.add(article.id);
      }
    }

    // Persist any new baseline snapshots (for newly saved articles)
    saveSnapshots(snapshots);
    setUpdatedIds(newUpdatedIds);
  }, [savedIds, articles]);

  useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  /**
   * Call when the user opens the notification panel — clears all badges.
   */
  const markAllSeen = useCallback(() => {
    if (!articles) return;

    const snapshots = getSnapshots();
    const seenUpdates = [...getSeenUpdates()];

    for (const article of articles) {
      if (!savedIds.includes(article.id)) continue;
      // Update snapshot to current state
      snapshots[article.id] = fingerprint(article);
      // Mark as seen
      if (!seenUpdates.includes(article.id)) {
        seenUpdates.push(article.id);
      }
    }

    saveSnapshots(snapshots);
    localStorage.setItem(SEEN_UPDATES_KEY, JSON.stringify(seenUpdates));
    setUpdatedIds(new Set());
  }, [savedIds, articles]);

  /**
   * Call when user taps a specific updated article card.
   */
  const markArticleSeen = useCallback((id) => {
    const seenUpdates = getSeenUpdates();
    if (!seenUpdates.includes(id)) {
      localStorage.setItem(SEEN_UPDATES_KEY, JSON.stringify([...seenUpdates, id]));
    }
    setUpdatedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  /**
   * Call this once when you want to "reset" all snapshots
   * (e.g. after a real data refresh from the API).
   */
  const refreshSnapshots = useCallback(() => {
    if (!articles) return;
    const snapshots = getSnapshots();
    for (const article of articles) {
      if (savedIds.includes(article.id)) {
        snapshots[article.id] = fingerprint(article);
      }
    }
    saveSnapshots(snapshots);
    // Clear seen list so fresh updates can be detected next time
    localStorage.removeItem(SEEN_UPDATES_KEY);
  }, [savedIds, articles]);

  return {
    updatedIds,                          // Set<number> of article IDs with updates
    unreadCount: updatedIds.size,        // number — for the bell badge
    markAllSeen,
    markArticleSeen,
    refreshSnapshots,
  };
}