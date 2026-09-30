# MediCare Nexus — Backend

> ShadowFlow MediCare Nexus API & Process Mining Engine (Express + PGlite + TypeScript)

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start dev server with hot-reload (http://localhost:5000)
npm run dev
```

## Production Deployment

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |
| `FRONTEND_URL` | Allowed CORS origins (comma-separated) | `*` (all origins) |
| `FRONTEND_DIST_PATH` | Path to frontend dist folder (production only) | `../../frontend/dist` |
| `SUPABASE_URL` | Supabase project URL (optional) | — |
| `SUPABASE_ANON_KEY` | Supabase anonymous key (optional) | — |
| `DATABASE_URL` | PostgreSQL connection string (optional) | — |

### Local Development
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Production
```env
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Service health check |
| `GET` | `/api/models` | List process models |
| `GET` | `/api/discovery/graph?workflow=ID` | Process mining DFG graph |
| `GET` | `/api/discovery/heatmap` | Activity heatmap |
| `GET` | `/api/friction/alerts` | Friction detection alerts |
| `GET` | `/api/friction/findings` | Stored findings |
| `POST` | `/api/friction/explain` | AI explanation for finding |
| `GET` | `/api/recommendations` | Action recommendations |
| `PATCH` | `/api/recommendations/:id/status` | Update recommendation status |
| `POST` | `/api/simulator/run` | What-if simulation |
| `GET` | `/api/kpis` | Operational KPIs |
| `POST` | `/api/ingest/upload` | Upload event log (CSV/XES) |
| `POST` | `/api/ingest/chat` | Parse staff chat |
| `GET` | `/api/audit` | Compliance audit logs |
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | User login |

## Deploy to Railway / Render / Fly.io

1. Set **Build Command** to: `npm run build`
2. Set **Start Command** to: `npm start`
3. Set environment variables (`PORT`, `FRONTEND_URL`, `NODE_ENV=production`)
4. The server auto-seeds the PGlite in-memory database on first start

## Tech Stack

- Express.js 4
- TypeScript 5
- PGlite (in-memory PostgreSQL via WebAssembly)
- Zod (validation)
- bcrypt (auth)
- Multer (file uploads)
