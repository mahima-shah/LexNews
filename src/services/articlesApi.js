import { supabase } from "./supabase";

export async function fetchArticles({
  mode = "latest",
  cursor = null,
  limit = 10,
  category = "all",
} = {}) {

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let query = supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit);

  if (mode === "latest") {
    query = query.gte("created_at", threeDaysAgo.toISOString());
  }

  if (mode === "older") {
    query = query
      .lt("created_at", threeDaysAgo.toISOString())
      .gte("created_at", thirtyDaysAgo.toISOString());
  }

  const categoryMap = {
    dt: "Direct Tax",
    it: "Indirect Tax",
    cl: "Corporate",
    gl: "General Law",
  };

  if (category !== "all" && category !== "fy") {
    query = query.eq("category", categoryMap[category]);
  }

  if (cursor) {
    query = query.or(
      `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
    );
  }

  console.log("FETCH ARTICLES:", {
    mode,
    cursor,
    limit,
    category,
  });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return { articles: [], nextCursor: null };
  }

  console.log("FETCH RESULT:", {
    mode,
    count: data.length,
    nextCursor:
      data.length === limit
        ? {
          created_at: data[data.length - 1].created_at,
          id: data[data.length - 1].id,
        }
        : null,
  });

  return {
    articles: data,
    nextCursor:
      data.length === limit
        ? {
          created_at: data[data.length - 1].created_at,
          id: data[data.length - 1].id,
        }
        : null,
  };
}

export async function searchArticles({
  query,
  cursor = null,
  limit = 10,
} = {}) {
  if (!query?.trim()) {
    return { articles: [], nextCursor: null };
  }

  let request = supabase
    .from("articles")
    .select("*")
    .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,body.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    request = request.lt("created_at", cursor);
  }

  const { data, error } = await request;

  if (error) {
    console.error("Search error:", error);
    return { articles: [], nextCursor: null };
  }

  return {
    articles: data || [],
    nextCursor:
      data?.length === limit ? data[data.length - 1].created_at : null,
  };
}

export async function createArticle(article) {
  const { data, error } = await supabase
    .from("articles")
    .insert([article])
    .select();

  if (error) {
    console.error(error);
    return { success: false, error };
  }

  return { success: true, data };
}