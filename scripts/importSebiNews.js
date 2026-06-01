console.log("SCRIPT STARTED");

import "dotenv/config";
import { XMLParser } from "fast-xml-parser";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const FEED_URL = "https://www.barandbench.com/feed";

console.log("FETCHING BAR & BENCH RSS...");

const response = await fetch(FEED_URL);
console.log("STATUS:", response.status);

const xml = await response.text();

const parser = new XMLParser({
  ignoreAttributes: false,
});

const parsed = parser.parse(xml);

const items = parsed.rss.channel.item || [];

const articles = items.slice(0, 5).map((item) => ({
  title: item.title,
  subtitle: item.description?.replace(/<[^>]*>/g, "").slice(0, 180) || "Latest legal news from Bar & Bench.",
  body: item.description?.replace(/<[^>]*>/g, "") || item.title,
  category: "General Law",
  source_name: "Bar & Bench",
  source_url: item.link,
  external_url: item.link,
  status: "approved",
  image_url: item["media:content"]?.["@_url"] || null,
}));

console.log("FOUND:", articles.length);
console.log(articles.map((article) => article.title));

const { data, error } = await supabase
  .from("articles")
  .insert(articles)
  .select();

console.log("ERROR:", error);
console.log("INSERTED:", data?.length || 0);

process.exit(0);