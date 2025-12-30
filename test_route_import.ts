
import { NextRequest } from 'next/server';

async function test() {
    console.log('Testing /api/train logic...');
    // We can't easily test NextRequest/NextResponse outside of Next.js
    // but we can check if the file can be parsed.
    try {
        const route = await import('./src/app/api/train/route');
        console.log('Route imported successfully');
    } catch (e) {
        console.error('Import failed:', e);
    }
}

test();
