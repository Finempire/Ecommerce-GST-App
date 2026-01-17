
const { Client } = require('pg');
require('dotenv').config();

const commonPasswords = [
    process.env.DB_PASSWORD, // Try what's in env first
    'password',
    'admin',
    'postgres',
    'root',
    '1234',
    '123456',
    'Pass@123',
    'admin123',
    '' // Try empty
];

async function findCorrectPassword() {
    console.log('Testing common passwords...');

    for (const pass of commonPasswords) {
        if (pass === undefined) continue;

        const client = new Client({
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: 'postgres', // Connect to default DB first to check auth
            password: pass,
            port: process.env.DB_PORT || 5432,
        });

        try {
            await client.connect();
            console.log(`\n✅ SUCCESS! The correct password is: "${pass}"`);

            // Check if our specific DB exists
            const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME || 'gst_automation'}'`);
            if (res.rows.length > 0) {
                console.log(`✅ Database '${process.env.DB_NAME || 'gst_automation'}' exists.`);
            } else {
                console.log(`❌ Database '${process.env.DB_NAME || 'gst_automation'}' does NOT exist yet.`);
                console.log('Attempting to create it...');
                try {
                    await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'gst_automation'}`);
                    console.log('✅ Database created successfully!');
                } catch (createErr) {
                    console.error('Failed to create database:', createErr.message);
                }
            }

            // Update .env file helper message
            console.log('\nPlease update your .env file with this password:');
            console.log(`DB_PASSWORD=${pass}`);

            await client.end();
            process.exit(0);
        } catch (err) {
            // console.log(`Failed with "${pass}": ${err.message}`); // Verbose
            process.stdout.write('.');
            await client.end().catch(() => { });
        }
    }

    console.log('\n\n❌ All common passwords failed. Please check your installation.');
    process.exit(1);
}

findCorrectPassword();
