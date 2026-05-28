import { createClient } from '@supabase/supabase-js';

// Standard Supabase URL and Anon Key variables
// Prefixed with PUBLIC_ to be exposed to the client in SvelteKit
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
	? createClient(supabaseUrl, supabaseAnonKey)
	: null;
