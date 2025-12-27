import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy Singleton Pattern to prevent Build-Time Crashes
let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

// Helper to get keys safely
function getEnvConfig() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Choose the best available key for general purpose
    const supabaseKey = supabaseServiceKey || supabaseAnonKey;

    return { supabaseUrl, supabaseKey, supabaseServiceKey };
}

// Lazy Getter for Default Client
export function getSupabase(): SupabaseClient {
    if (supabaseInstance) return supabaseInstance;

    const { supabaseUrl, supabaseKey } = getEnvConfig();

    if (!supabaseUrl || !supabaseKey) {
        // [Safety] If specific keys are missing during runtime, throw descriptive error
        // But during build time, we might want to return a dummy to prevent import crashes if called unintentionally
        if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
            console.warn('[Supabase] Missing Credentials during init. Ensure ENV vars are set.');
        }
        throw new Error('Supabase URL or Key is missing. Check environment variables.');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    return supabaseInstance;
}

// Lazy Getter for Admin Client
export function getSupabaseAdmin(): SupabaseClient {
    if (supabaseAdminInstance) return supabaseAdminInstance;

    const { supabaseUrl, supabaseServiceKey } = getEnvConfig();

    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn('[Supabase] Admin Key missing, falling back to standard client logic.');
        // Fallback to standard (might fail if standard is also missing)
        return getSupabase();
    }

    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey);
    return supabaseAdminInstance;
}

// [BACKWARDS COMPATIBILITY PROXY]
// This allows imports like `import { supabase } from '@/lib/supabase'` to keep working
// without rewriting the entire codebase immediately.
// It proxies property access to the lazy instance.
export const supabase = new Proxy({} as SupabaseClient, {
    get: (_target, prop) => {
        // @ts-ignore
        return getSupabase()[prop];
    }
});

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get: (_target, prop) => {
        // @ts-ignore
        return getSupabaseAdmin()[prop];
    }
});
