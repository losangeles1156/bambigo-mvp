const { Client } = require('pg');

const url = process.argv[2];
if (!url) {
    console.error('Please provide a connection string as an argument.');
    process.exit(1);
}

const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false }
});

async function test() { // Removed unused client argument
    console.log(`Testing connection to: ${url.replace(/:([^:@]+)@/, ':****@')} ...`);
    try {
        await client.connect();
        console.log('✅ Connection Successful!');
        const res = await client.query('SELECT version()');
        console.log('Version:', res.rows[0].version);
    } catch (e) {
        console.error('❌ Connection Failed:', e.message);
    } finally {
        await client.end();
    }
}

test();
