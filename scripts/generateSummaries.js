console.log("SUMMARY SCRIPT STARTED");

import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateSummary(article) {
    const prompt = `
  You are a legal news editor for LexLegis.
  
  Summarize the following legal news article in approximately 100–150 words (a hard limit of 150).
  
  Focus on:
  - The core legal development or issue
  - The parties involved
  - The court, tribunal, regulator, or authority involved
  - Key arguments, findings, observations, or actions taken
  - The outcome, decision, or current status of proceedings
  - The practical or legal significance of the development
  
  Requirements:
  - Preserve all important facts, dates, statutes, regulations, legal provisions, and case references mentioned in the source.
  - Do not introduce information that is not contained in the article.
  - Maintain a neutral, factual, professional tone.
  - Write in clear prose suitable for lawyers, law students, compliance professionals, and business readers.
  - Avoid bullet points, headings, opinions, speculation, marketing language, and filler phrases such as "This article discusses" or "The article highlights."
  - The summary should be understandable without reading the original article.
  
  Article title:
  ${article.title}
  
  Article body:
  ${article.body}
  `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}

const { data: articles, error } = await supabase
  .from("articles")
  .select("id, title, body, ai_summary")
  .or("ai_summary.is.null,ai_summary.eq.")
  .not("body", "is", null)
  .order("created_at", { ascending: false })
  .limit(10);

if (error) {
    console.error("Fetch error:", error);
    process.exit(1);
}

console.log("ARTICLES TO SUMMARIZE:", articles.length);

console.log(
    "ARTICLES FOUND:",
    articles.map((article) => ({
      title: article.title,
      bodyLength: article.body?.length || 0,
      aiSummary: article.ai_summary,
    }))
  );

for (const article of articles) {
    if (!article.body || article.body.length < 300) {
        console.log("Skipping short article body:", article.title);
        continue;
      }

    console.log("Summarizing:", article.title);

    try {
        const summary = await generateSummary(article);

        const { data: updatedRows, error: updateError } = await supabase
            .from("articles")
            .update({ ai_summary: summary })
            .eq("id", article.id)
            .select();

        console.log("UPDATED ROWS:", updatedRows);

        if (updateError) {
            console.error("Update error:", updateError);
        } else {
            console.log("Saved summary");
        }
    } catch (error) {
        console.error("Summary failed:", article.title);
        console.error(error.message);
        if (error.message.includes("Quota exceeded")) {
            console.log("Gemini quota reached. Stopping script.");
            break;
          }
    }
}

console.log("DONE");
process.exit(0);