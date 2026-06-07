console.log("SCRIPT STARTED - India Legal Live");

import "dotenv/config";
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const FEED_URL = "https://indialegallive.com/feed/";

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

  if (text.includes("income tax") || text.includes("cbdt") || text.includes("tds"))
    return "Direct Tax";

  if (text.includes("gst") || text.includes("customs") || text.includes("excise"))
    return "Indirect Tax";

  if (text.includes("sebi") || text.includes("shares") || text.includes("merger") || text.includes("acquisition") || text.includes("companies act") || text.includes("ibc") || text.includes("insolvency"))
    return "Corporate";

  if (text.includes("supreme court") || text.includes("sc ") || text.includes("cji"))
    return "Supreme Court";

  if (text.includes("high court") || text.includes("hc ") || text.includes("allahabad") || text.includes("bombay") || text.includes("madras") || text.includes("calcutta") || text.includes("delhi high") || text.includes("kerala") || text.includes("karnataka"))
    return "High Court";

  return "General Law";
}

async function extractArticleText(url) {
  console.log("Extracting:", url);
  try {
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await response.text();
    const $ = cheerio.load(html);
    return $("p").map((_, el) => $(el).text().trim()).get().filter((p) => p.length > 40).join("\n\n");
  } catch (e) {
    console.log("Extract failed:", e.message);
    return "";
  }
}

console.log("FETCHING RSS...");
const response = await fetch(FEED_URL);
const xml = await response.text();
const parser = new XMLParser({ ignoreAttributes: false });
const parsed = parser.parse(xml);
const rawItems = parsed.rss.channel.item || [];
const items = Array.isArray(rawItems) ? rawItems : [rawItems];
const since = Date.now() - 24 * 60 * 60 * 1000;
const selectedItems = items.filter((item) => item.pubDate && new Date(item.pubDate).getTime() >= since);

console.log("ITEMS IN LAST 24 HOURS:", selectedItems.length);

const articles = [];
for (const item of selectedItems) {
  const articleText = await extractArticleText(item.link);
  articles.push({
    title: item.title,
    subtitle: item.description?.replace(/<[^>]*>/g, "").slice(0, 180) || "Latest legal news from India Legal Live.",
    body: articleText || item.description?.replace(/<[^>]*>/g, "") || item.title,
    category: categorizeArticle(item.title, articleText),
    source_name: "India Legal Live",
    source_url: item.link,
    external_url: item.link,
    event_key: createEventKey(item.title),
    status: "pending",
    image_url: item["media:content"]?.["@_url"] || null,
  });
}

console.log("READY TO INSERT:", articles.length);
const { data, error } = await supabase.from("articles").upsert(articles, { onConflict: "external_url", ignoreDuplicates: true }).select();
console.log("ERROR:", error);
console.log("INSERTED:", data?.length || 0);
process.exit(0);