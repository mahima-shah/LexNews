import { RAW_MEDIA_TEST_ARTICLES } from "../data/mediaTestArticles.js";
import { normalizeMedia } from "./normalizeMedia.js";

export async function fetchMediaTestArticles() {
  return RAW_MEDIA_TEST_ARTICLES.map((item) => ({
    id: item.id,
    title: item.title,
    source: item.source,
    media: normalizeMedia(item),
  }));
}