import { supabase } from "./supabase";

export async function fetchArticles({
  mode = "latest",
  cursor = null,
  limit = 10,
  category = null,
} = {}) {

  const CAT_MAP = {
    dt: "Direct Tax",
    it: "Indirect Tax",
    cl: "Corporate",
    gl: "General Law",
  };

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let query = supabase
    .from("articles")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit);

  // Apply category filter if a specific category is selected
  if (category && category !== "all") {
    const dbCategory = CAT_MAP[category];
    if (dbCategory) query = query.eq("category", dbCategory);
  }

  if (mode === "latest") {
    query = query.gte("created_at", threeDaysAgo.toISOString());
  }

  if (mode === "older") {
    query = query
      .lt("created_at", threeDaysAgo.toISOString())
      .gte("created_at", thirtyDaysAgo.toISOString());
  }

  if (cursor) {
    query = query.or(
      `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return { articles: [], nextCursor: null };
  }

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

export async function fetchArticlesByIds(ids) {
  if (!ids || ids.length === 0) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .in("id", ids)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
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
    .eq("status", "approved")
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

export async function fetchPendingArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function approveArticle(id) {
  const { error } = await supabase
    .from("articles")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    console.error(error);
    return { success: false };
  }

  return { success: true };
}

export async function rejectArticle(id) {
  const { error } = await supabase
    .from("articles")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    console.error(error);
    return { success: false };
  }

  return { success: true };
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