import { supabase } from './supabase'

export async function fetchArticles({
  includeOlder = false,
  olderOnly = false,
  cursor = null,
  limit = 10,
} = {}) {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  let query = supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (olderOnly) {
    query = query.lt("created_at", twoDaysAgo.toISOString());
  } else if (!includeOlder) {
    query = query.gte("created_at", twoDaysAgo.toISOString());
  }

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return { articles: [], nextCursor: null };
  }

  const nextCursor =
    data.length === limit ? data[data.length - 1].created_at : null;

  return { articles: data, nextCursor };
}

export async function searchArticles(query) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,body.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
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