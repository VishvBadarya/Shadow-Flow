import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authMiddleware } from './middleware/auth.js';
import { auditMiddleware } from './middleware/audit.js';
import { healthcarePrivacyMiddleware } from './middleware/privacy.js';
import apiRouter from './routes/api.js';
import authRouter from './routes/authRoutes.js';
import { getDb, initDatabaseSchema } from './db/connection.js';
import { runSeed } from './db/seed.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
// -------------------------------------------------------------------
// CORS Configuration
// In production, set FRONTEND_URL env var to your deployed frontend URL
// For local dev, defaults to '*' (all origins)
// -------------------------------------------------------------------
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(s => s.trim())
    : ['*'];
app.use(cors({
    origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Role', 'X-User-Id']
}));
// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Middleware pipeline: Auth -> Audit -> Privacy
app.use(authMiddleware);
app.use(auditMiddleware);
app.use(healthcarePrivacyMiddleware);
// API Router
app.use('/auth', authRouter);
app.use('/api', apiRouter);
// -------------------------------------------------------------------
// Static Frontend Serving (Production Mode)
// Place the built frontend dist folder at ../frontend/dist relative to
// the backend project root, or set FRONTEND_DIST_PATH env var.
// -------------------------------------------------------------------
// -------------------------------------------------------------------
// Static Frontend Serving (if frontend dist exists)
// -------------------------------------------------------------------
const distPath = process.env.FRONTEND_DIST_PATH
    || path.resolve(__dirname, '../../frontend/dist');
const hasFrontendDist = fs.existsSync(path.join(distPath, 'index.html'));
if (hasFrontendDist) {
    app.use(express.static(distPath));
    // SPA fallback: serve index.html for all non-API routes
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/health')) {
            return next();
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
}
else {
    // Root landing endpoint (when backend runs as standalone API)
    app.get('/', (req, res) => {
        if (req.accepts('html')) {
            res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MediCare Nexus — Backend API</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background: #090d16;
              color: #f1f5f9;
              margin: 0;
              padding: 40px 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              min-height: 100vh;
              box-sizing: border-box;
            }
            .card {
              background: #0f172a;
              border: 1px solid #1e293b;
              border-radius: 12px;
              max-width: 640px;
              width: 100%;
              padding: 32px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(20, 184, 166, 0.1);
            }
            .badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 600;
              background: rgba(20, 184, 166, 0.15);
              color: #2dd4bf;
              border: 1px solid rgba(20, 184, 166, 0.3);
              margin-bottom: 16px;
            }
            .pulse {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #2dd4bf;
              box-shadow: 0 0 8px #2dd4bf;
            }
            h1 { margin: 0 0 8px 0; font-size: 24px; color: #f8fafc; }
            p { margin: 0 0 24px 0; color: #94a3b8; font-size: 14px; line-height: 1.5; }
            .cta-btn {
              display: inline-block;
              background: #0d9488;
              color: #ffffff;
              font-weight: 600;
              font-size: 14px;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              transition: background 0.2s;
              margin-bottom: 24px;
            }
            .cta-btn:hover { background: #0f766e; }
            .endpoints {
              border-top: 1px solid #1e293b;
              padding-top: 20px;
            }
            .endpoints h3 { font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0; }
            .endpoint-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
            .endpoint-list a {
              color: #38bdf8;
              text-decoration: none;
              font-family: monospace;
              font-size: 13px;
              background: #1e293b;
              padding: 6px 10px;
              border-radius: 6px;
              display: block;
              transition: background 0.2s;
            }
            .endpoint-list a:hover { background: #334155; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge"><span class="pulse"></span> Backend Engine Online</div>
            <h1>MediCare Nexus Backend API</h1>
            <p>The Express.js process mining engine is active, database seeded with 5,000 cases, and serving API routes.</p>
            <a class="cta-btn" href="http://localhost:5173">Open Frontend (Port 5173) &rarr;</a>
            <div class="endpoints">
              <h3>Key API Endpoints</h3>
              <ul class="endpoint-list">
                <li><a href="/health">GET /health — Service status</a></li>
                <li><a href="/api/models">GET /api/models — Process models</a></li>
                <li><a href="/api/discovery/graph?workflow=W2_PAC_CLEARANCE">GET /api/discovery/graph — DFG mining graph</a></li>
                <li><a href="/api/kpis">GET /api/kpis — Operational KPIs</a></li>
                <li><a href="/api/recommendations">GET /api/recommendations — Action recommendations</a></li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `);
        }
        else {
            res.json({
                status: 'ONLINE',
                service: 'MediCare Nexus API Engine',
                port: PORT,
                frontendUrl: 'http://localhost:5173',
                apiPrefix: '/api'
            });
        }
    });
}
// Health check endpoints
app.get(['/health', '/api/health'], (req, res) => {
    res.json({
        status: 'HEALTHY',
        service: 'MediCare Nexus API Engine',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});
async function startServer() {
    try {
        console.log('🚀 Starting MediCare Nexus Backend Server...');
        await initDatabaseSchema();
        const db = getDb();
        const countRes = await db.query('SELECT COUNT(*) as count FROM event_logs');
        if (Number(countRes.rows[0]?.count || 0) === 0) {
            console.log('🌱 Database is empty. Seeding initial 5,000 cases...');
            await runSeed(5000);
        }
        app.listen(PORT, () => {
            console.log(`✨ MediCare Nexus API Server listening on http://localhost:${PORT}`);
            if (process.env.NODE_ENV === 'production') {
                console.log(`📦 Serving frontend static files from dist`);
            }
        });
    }
    catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}
startServer();
