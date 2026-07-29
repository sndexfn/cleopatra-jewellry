import { createServerFn } from '@tanstack/start';
import { supabaseAdmin } from './supabase.server';

export const getProducts = createServerFn({ method: 'GET' }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data;
});
