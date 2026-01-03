
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('Checking environment...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'FOUND' : 'MISSING');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'FOUND' : 'MISSING');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'FOUND' : 'MISSING');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'FOUND' : 'MISSING');
