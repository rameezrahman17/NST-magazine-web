import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url_here' || supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.error("CRITICAL: Supabase environment variables are missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment settings.");
}

// Export a safe client or null if config is missing
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : { 
      from: () => ({ select: () => Promise.resolve({ data: [], error: { message: "Supabase not configured" } }), insert: () => Promise.resolve({ error: { message: "Supabase not configured" } }) }),
      storage: { from: () => ({ upload: () => Promise.resolve({ error: { message: "Supabase not configured" } }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) }
    };

