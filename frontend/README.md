# MediCare Nexus — Frontend

> ShadowFlow MediCare Nexus Enterprise Healthcare Platform (React + Vite + TypeScript)

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

> **Note:** In dev mode, API calls to `/api/*` and `/auth/*` are automatically proxied to `http://localhost:5000` (the backend).

## Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The built files are output to `./dist/`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL (no trailing `/`) | _(empty = use Vite proxy)_ |

### Local Development
No env file needed — Vite proxy handles API routing.

### Production Deployment
Create a `.env` file (or set env vars on your hosting platform):

```env
VITE_API_URL=https://api.your-domain.com
```

## Deploy to Vercel / Netlify / Cloudflare Pages

1. Set the **Build Command** to: `npm run build`
2. Set the **Output Directory** to: `dist`
3. Set the **Environment Variable** `VITE_API_URL` to your deployed backend URL
4. Add a redirect rule for SPA routing: `/* → /index.html` (200)

## Tech Stack

- React 19 + TypeScript
- Vite 8
- React Router v7
- Recharts (charts)
- Lucide React (icons)
- XYFlow/React (process flow diagrams)
