// Supabase Client for Browser
// For production, these values should be set via environment variables
// For now, using a simple config approach

// These will be replaced at build time or set via window object
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

let supabaseClient = null;

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not set. Using mock mode.');
    return null;
  }
  
  // Dynamic import for browser
  if (typeof window !== 'undefined' && window.supabase) {
    supabaseClient = window.supabase;
    return supabaseClient;
  }
  
  // Fallback: try to use from CDN (will be loaded via script tag)
  return null;
}

// Initialize Supabase (called after script loads)
export function initSupabase(url, anonKey) {
  if (typeof window === 'undefined') return null;
  
  window.SUPABASE_URL = url;
  window.SUPABASE_ANON_KEY = anonKey;
  
  // Supabase will be loaded via CDN script tag
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(url, anonKey);
    return supabaseClient;
  }
  
  return null;
}
