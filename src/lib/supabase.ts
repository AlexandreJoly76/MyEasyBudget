import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Si une variable manque, on s'arrête tout de suite avec un message clair,
// plutôt que d'avoir une erreur incompréhensible plus tard.

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables supabase manquantes : vérifie le fichier .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
