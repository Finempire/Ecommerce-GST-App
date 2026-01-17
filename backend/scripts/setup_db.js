
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'gst_automation';

const poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    database: 'postgres' // Connect to default DB first
};

const pool = new Pool(poolConfig);

async function setupDatabase() {
    try {
        console.log('Connecting to default postgres database...');
        let client = await pool.connect();

        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        if (res.rows.length === 0) {
            console.log(`Database '${dbName}' does not exist. Creating...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log('Database created successfully.');
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
        client.release();
        await pool.end();

        // Reconnect to the target database
        console.log(`Connecting to ${dbName}...`);
        const targetPool = new Pool({
            ...poolConfig,
            database: dbName
        });
        client = await targetPool.connect();
        console.log('Connected successfully.');

        // 1. Run Layout/Schema Migration
        console.log('Running migration...');
        const migrationPath = path.join(__dirname, '../src/migrations/001_initial_schema.sql');
        const schemaSql = fs.readFileSync(migrationPath, 'utf8');
        await client.query(schemaSql);
        console.log('Schema created successfully.');

        // 2. Create Default Admin User
        const adminEmail = 'admin@gstpro.com';
        const adminPassword = 'Admin@123';
        const adminName = 'System Admin';

        // Check if admin exists
        const checkRes = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

        if (checkRes.rows.length === 0) {
            console.log('Creating default admin user...');
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

            await client.query(`
                INSERT INTO users (email, name, password_hash, role, subscription_plan)
                VALUES ($1, $2, $3, 'admin', 'Professional')
            `, [adminEmail, adminName, passwordHash]);

            console.log('Default admin user created.');
            console.log('----------------------------------------');
            console.log('Email: ' + adminEmail);
            console.log('Password: ' + adminPassword);
            console.log('----------------------------------------');
        } else {
            console.log('Admin user already exists.');
        }

        client.release();
    } catch (err) {
        console.error('Error setting up database:', err);
        console.error('Please check your .env file and ensure PostgreSQL is running.');
    } finally {
        await pool.end();
    }
}

setupDatabase();
