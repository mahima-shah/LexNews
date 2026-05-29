import { supabase } from './supabase'

export async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
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