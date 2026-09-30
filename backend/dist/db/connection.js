import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { SCHEMA_SQL } from './schemaSql.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class PostgresDatabase {
    pool;
    constructor(connectionString) {
        this.pool = new pg.Pool({ connectionString });
    }
    async query(sql, params = []) {
        const res = await this.pool.query(sql, params);
        return { rows: res.rows, rowCount: res.rowCount ?? res.rows.length };
    }
    async exec(sql) {
        await this.pool.query(sql);
    }
    async close() {
        await this.pool.end();
    }
}
class PGliteDatabase {
    client = null;
    async getClient() {
        if (!this.client) {
            // In-memory PGlite is blazing fast and immune to Windows filesystem locking
            this.client = new PGlite();
            await this.client.waitReady;
        }
        return this.client;
    }
    async query(sql, params = []) {
        const client = await this.getClient();
        const res = await client.query(sql, params);
        return { rows: res.rows, rowCount: res.rows.length };
    }
    async exec(sql) {
        const client = await this.getClient();
        await client.exec(sql);
    }
    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
        }
    }
}
let dbInstance = null;
export function getDb() {
    if (!dbInstance) {
        const dbUrl = process.env.DATABASE_URL;
        if (dbUrl && dbUrl.trim() !== '') {
            console.log('⚡ Initializing Native PostgreSQL connection via DATABASE_URL...');
            dbInstance = new PostgresDatabase(dbUrl);
        }
        else {
            console.log('📦 Initializing Fast In-Memory PGlite WebAssembly Database...');
            dbInstance = new PGliteDatabase();
        }
    }
    return dbInstance;
}
export async function initDatabaseSchema() {
    const db = getDb();
    if (SCHEMA_SQL && SCHEMA_SQL.trim() !== '') {
        await db.exec(SCHEMA_SQL);
        return;
    }
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await db.exec(schemaSql);
}
