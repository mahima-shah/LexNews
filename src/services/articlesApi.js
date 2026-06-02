import { supabase } from './supabase'

export async function fetchArticles({ includeOlder = false } = {}) {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  let query = supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (!includeOlder) {
    query = query.gte("created_at", twoDaysAgo.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return data;
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