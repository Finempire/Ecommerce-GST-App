import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
    console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
});

export const query = async (text: string, params?: any[]) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        if (process.env.NODE_ENV === 'development') {
            console.log('📝 Query executed:', { text: text.substring(0, 50), duration, rows: result.rowCount });
        }
        return result;
    } catch (error) {
        console.error('❌ Query error:', error);
        throw error;
    }
};

export const getClient = () => pool.connect();

export default pool;
