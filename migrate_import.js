const fs = require('fs');
const { Client } = require('pg');

async function migrate() {
    const destUrl = process.env.DEST_DB_URL;
    if (!destUrl) {
        console.error('Error: DEST_DB_URL environment variable is required');
        console.error('Usage: set DEST_DB_URL=postgresql://... && node migrate_import.js');
        process.exit(1);
    }

    if (!fs.existsSync('dump.sql')) {
        console.error('Error: dump.sql file not found. Please run the dump command first.');
        process.exit(1);
    }

    console.log('Reading dump.sql...');
    const sql = fs.readFileSync('dump.sql', 'utf8');

    console.log('Connecting to destination database...');
    const client = new Client({
        connectionString: destUrl,
        ssl: { rejectUnauthorized: false } // Required for Supabase
    });

    try {
        await client.connect();
        console.log('Connected. executing SQL...');

        // Execute the SQL dump
        // Note: This loads the entire dump into memory. For very large databases, streams are better.
        // But for this MVP migration, this is sufficient.
        await client.query(sql);

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
