import { createClient } from '@supabase/supabase-js';

// جلب المتغيرات من البيئة العامة للواجهة (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ متغيرات بيئة Supabase (Client) مفقودة!");
}

// إنشاء الاتصال
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
