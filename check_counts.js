const { Client } = require('pg');

const url = process.env.DEST_DB_URL;
if (!url) { console.error('No DEST_DB_URL'); process.exit(1); }

const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

async function check() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT 
                (SELECT count(*) FROM nodes) as nodes_count,
                (SELECT count(*) FROM cities) as cities_count
        `);
        console.log('Counts:', res.rows[0]);
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await client.end();
    }
}
check();
