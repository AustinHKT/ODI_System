import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase: กรุณาตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ใน Vercel Environment Variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
