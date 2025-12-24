import dotenv from 'dotenv';
import path from 'path';

// Try loading env from different possible locations
console.log('Loading env...');
const resultLocal = dotenv.config({ path: '.env.local' });
console.log('.env.local loaded:', resultLocal.error ? 'No' : 'Yes');

if (resultLocal.error) {
    const result = dotenv.config();
    console.log('.env loaded:', result.error ? 'No' : 'Yes');
}

console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
console.log('SERVICE_KEY:', (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY) ? 'Set' : 'Missing');

try {
    const { supabaseAdmin } = require('../src/lib/supabase');
    console.log('Supabase client initialized:', !!supabaseAdmin);
} catch (error) {
    console.error('Failed to init supabase:', error);
}
