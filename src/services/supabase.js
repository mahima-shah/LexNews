import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kbgghkogmnojbmwhwpdt.supabase.co'

const supabaseAnonKey =
  'sb_publishable_33SEdUkrxnDsTsMoflkFHg_gFb2ZG0W'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)