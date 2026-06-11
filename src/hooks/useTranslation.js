import { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const LANG_NAMES = { hi: "Hindi", mr: "Marathi", kn: "Kannada" };

// ── in-memory cache (Map) + localStorage persistence ──────────────────────────
const memCache = new Map();

function lsKey(articleId, lang) {
  return `tx:${articleId}:${lang}`;
}
function readCache(articleId, lang) {
  const k = `${articleId}:${lang}`;
  if (memCache.has(k)) return memCache.get(k);
  try {
    const raw = localStorage.getItem(lsKey(articleId, lang));
    if (raw) {
      const parsed = JSON.parse(raw);
      memCache.set(k, parsed);
      return parsed;
    }
  } catch (_) {}
  return null;
}
function writeCache(articleId, lang, value) {
  const k = `${articleId}:${lang}`;
  memCache.set(k, value);
  try {
    localStorage.setItem(lsKey(articleId, lang), JSON.stringify(value));
  } catch (_) {}
}

// ── global serial queue ────────────────────────────────────────────────────────
const queue = [];
let running = false;

function enqueue(task) {
  // Remove any existing queued task for the same article+lang to avoid stale duplicates
  const idx = queue.findIndex((t) => t.key === task.key);
  if (idx !== -1) queue.splice(idx, 1);
  queue.push(task);
  if (!running) drain();
}

async function drain() {
  if (queue.length === 0) { running = false; return; }
  running = true;
  const { run } = queue.shift();
  try {
    await run();
  } catch (_) {}
  await sleep(400); // small gap to stay under RPM
  drain();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── retry with exponential backoff ────────────────────────────────────────────
async function callWithRetry(prompt, retries = 3) {
  let delay = 5000;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      return res;
    } catch (err) {
      const is429 =
        err?.message?.includes("429") ||
        err?.status === 429 ||
        err?.message?.includes("RESOURCE_EXHAUSTED");

      if (is429 && attempt < retries) {
        const hintMatch = err?.message?.match(/retry in ([\d.]+)s/);
        const wait = hintMatch ? Math.ceil(parseFloat(hintMatch[1])) * 1000 : delay;
        console.warn(`[useTranslation] 429 — retrying in ${wait / 1000}s (attempt ${attempt + 1})`);
        await sleep(wait);
        delay *= 2;
        continue;
      }
      throw err;
    }
  }
}

// ── the hook ──────────────────────────────────────────────────────────────────
// isVisible: only enqueue a translation request when the slide is visible.
// This prevents all slides from firing requests simultaneously on mount.
export function useTranslation(article, lang, isVisible) {
  const [translated, setTranslated] = useState(() =>
    article && lang ? readCache(article?.id, lang) : null
  );
  const [loading, setLoading] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    if (!lang || !article) {
      setTranslated(null);
      setLoading(false);
      return;
    }

    // Check cache first — regardless of visibility
    const cached = readCache(article.id, lang);
    if (cached) {
      setTranslated(cached);
      setLoading(false);
      return;
    }

    // Only fire a network request when this slide is actually visible
    if (!isVisible) {
      setTranslated(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setTranslated(null);

    const summaryText = article.ai_summary || article.body || "";
    const langName = LANG_NAMES[lang];

    const prompt = `You are a legal news translator. Translate the following into ${langName}.
Return ONLY a JSON object with exactly two keys: "title" and "summary". No extra text, no markdown.

Title: ${article.title}

Summary: ${summaryText.split(/\s+/).slice(0, 80).join(" ")}`;

    const taskKey = `${article.id}:${lang}`;

    enqueue({
      key: taskKey,
      run: async () => {
        if (cancelledRef.current) return;

        try {
          const res = await callWithRetry(prompt);
          if (cancelledRef.current) return;

          const raw = res.text
            .trim()
            .replace(/^```json|^```|```$/gm, "")
            .trim();
          const parsed = JSON.parse(raw);
          const result = { title: parsed.title, summary: parsed.summary };

          writeCache(article.id, lang, result);
          setTranslated(result);
        } catch (err) {
          if (!cancelledRef.current) {
            console.error("[useTranslation] failed after retries:", err?.message ?? err);
            // Fall back gracefully to original — don't leave skeleton forever
            setTranslated(null);
          }
        } finally {
          if (!cancelledRef.current) setLoading(false);
        }
      },
    });

    return () => {
      cancelledRef.current = true;
      setLoading(false);
    };
  }, [article?.id, lang, isVisible]);

  return { translated, loading };
}