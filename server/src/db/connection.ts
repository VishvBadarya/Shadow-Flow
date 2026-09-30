import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export interface IDatabase {
  query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
  exec(sql: string): Promise<void>;
  close(): Promise<void>;
}

class PostgresDatabase implements IDatabase {
  private pool: pg.Pool;

  constructor(connectionString: string) {
    this.pool = new pg.Pool({ connectionString });
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    const res = await this.pool.query(sql, params);
    return { rows: res.rows as T[], rowCount: res.rowCount ?? res.rows.length };
  }

  async exec(sql: string): Promise<void> {
    await this.pool.query(sql);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

class PGliteDatabase implements IDatabase {
  private client: PGlite | null = null;

  async getClient(): Promise<PGlite> {
    if (!this.client) {
      // In-memory PGlite is blazing fast and immune to Windows filesystem locking
      this.client = new PGlite();
      await this.client.waitReady;
    }
    return this.client;
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    const client = await this.getClient();
    const res = await client.query<T>(sql, params);
    return { rows: res.rows, rowCount: res.rows.length };
  }

  async exec(sql: string): Promise<void> {
    const client = await this.getClient();
    await client.exec(sql);
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }
}

let dbInstance: IDatabase | null = null;

export function getDb(): IDatabase {
  if (!dbInstance) {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl && dbUrl.trim() !== '') {
      console.log('⚡ Initializing Native PostgreSQL connection via DATABASE_URL...');
      dbInstance = new PostgresDatabase(dbUrl);
    } else {
      console.log('📦 Initializing Fast In-Memory PGlite WebAssembly Database...');
      dbInstance = new PGliteDatabase();
    }
  }
  return dbInstance;
}

export async function initDatabaseSchema(): Promise<void> {
  const db = getDb();
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await db.exec(schemaSql);
}
