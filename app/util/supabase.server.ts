import { createClient } from '@supabase/supabase-js';

// جلب المتغيرات من بيئة الخادم (Node.js)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("❌ متغيرات بيئة Supabase (Server) مفقودة!");
}

// إنشاء اتصال بصلاحيات الأدمن متجاوزاً سياسات الأمان (RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
