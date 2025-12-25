
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
fs.writeFileSync('key.txt', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('Key written to key.txt');
