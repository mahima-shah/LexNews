console.log("SCRIPT STARTED");

import "dotenv/config";
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const FEED_URL = "https://www.livelaw.in/google_feeds.xml";

function createEventKey(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(" ")
        .filter((word) => word.length > 3)
        .slice(0, 6)
        .join("-");
}

function categorizeArticle(title, body) {
    const text = `${title} ${body}`.toLowerCase();
  
    if (
      text.includes("income tax") ||
      text.includes("cbdt") ||
      text.includes("tds")
    ) {
      return "Direct Tax";
    }
  
    if (
      text.includes("gst") ||
      text.includes("customs")
    ) {
      return "Indirect Tax";
    }
  
    if (
      text.includes("sebi") ||
      text.includes("shares") ||
      text.includes("merger") ||
      text.includes("acquisition")
    ) {
      return "Corporate";
    }
  
    return "General Law";
  }

async function extractArticleText(url) {
    console.log("Extracting:", url);

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0",
        },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const text = $("p")
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((paragraph) => paragraph.length > 40)
        .join("\n\n");

    return text;
}

console.log("FETCHING LIVELAW RSS...");

const response = await fetch(FEED_URL);
console.log("STATUS:", response.status);

const xml = await response.text();

const parser = new XMLParser({ ignoreAttributes: false });
const parsed = parser.parse(xml);

const items = parsed.rss?.channel?.item || [];

const since = Date.now() - 24 * 60 * 60 * 1000;

const selectedItems = items.filter((item) => {
  if (!item.pubDate) return false;

  const publishedAt = new Date(item.pubDate).getTime();

  return publishedAt >= since;
});

console.log("ITEMS IN LAST 24 HOURS:", selectedItems.length);

const articles = [];

for (const item of selectedItems) {
    const articleText = await extractArticleText(item.link);

    articles.push({
        title: item.title,
        subtitle:
            item.description?.replace(/<[^>]*>/g, "").slice(0, 180) ||
            "Latest legal news from LiveLaw.",
        body: articleText || item.description?.replace(/<[^>]*>/g, "") || item.title,
        category: categorizeArticle(item.title, articleText),
        source_name: "LiveLaw",
        source_url: item.link,
        external_url: item.link,
        event_key: createEventKey(item.title),
        status: "approved",
        image_url:
            item.enclosure?.["@_url"] ||
            item["media:content"]?.["@_url"] ||
            null,
    });
}

console.log("READY TO INSERT:", articles.length);
console.log(articles.map((article) => article.title));

const { data, error } = await supabase
    .from("articles")
    .upsert(articles, {
        onConflict: "external_url",
        ignoreDuplicates: true,
    })
    .select();

console.log("ERROR:", error);
console.log("INSERTED:", data?.length || 0);

process.exit(0);