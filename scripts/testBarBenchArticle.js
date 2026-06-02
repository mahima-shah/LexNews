console.log("SCRIPT STARTED");

import * as cheerio from "cheerio";

const ARTICLE_URL = "https://www.barandbench.com/dealstreet/tta-sr-sam-agram-act-on-tata-motors-acquiring-controlling-stake-in-freight-tiger";

console.log("FETCHING ARTICLE...");

const response = await fetch(ARTICLE_URL, {
    headers: {
        "User-Agent": "Mozilla/5.0",
    },
});

console.log("STATUS:", response.status);

const html = await response.text();

console.log("HTML LENGTH:", html.length);

const $ = cheerio.load(html);

const text = $("p")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((paragraph) => paragraph.length > 40)
    .join("\n\n");

console.log("TEXT LENGTH:", text.length);
console.log(text.slice(0, 1000));