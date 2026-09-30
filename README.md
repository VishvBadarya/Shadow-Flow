# ShadowFlow AI / MediCare Nexus 🏥⚡

An enterprise-grade hospital management and clinical process mining platform. Built with a modern healthcare design system, combining real-time hospital operations with AI-powered process discovery, bottleneck detection, and patient flow analytics.

---

## 🌟 Key Features

### 🏥 MediCare Nexus (Hospital Management)
- **Executive Operations Center**: Bed occupancy, ER status, active alerts, and vital trends.
- **Find a Doctor & Online Booking**: Multi-specialty doctor directory with real-time slot scheduling.
- **OPD Queue & Token System**: Live queue tracker, average wait-time calculations, and emergency prioritization.
- **Inpatient & Bed Management**: Interactive ward maps (ICU, General, Semi-Private) with admission workflows.
- **Laboratory & Diagnostics**: Test booking, status tracker, and secure PDF/online report viewing.
- **Pharmacy & Prescriptions**: Inventory alerts, e-prescriptions, and dispensing counters.
- **24/7 Emergency & Ambulance Dispatch**: One-click SOS dispatch with live GPS tracking simulation.
- **Multi-Role Portals**: Dedicated interfaces for Patients, Doctors, and Hospital Administrators.

### 🧠 ShadowFlow AI (Clinical Process Mining)
- **Automated Process Discovery**: Reconstruct patient journeys from electronic health records (EHR/HIS logs).
- **Interactive Process Graphs**: Petri net / DFG visualization of clinical pathways.
- **Bottleneck & Delay Analytics**: Automatic detection of throughput delays and operational logjams.
- **Compliance & Conformance Checking**: Deviation alerts against clinical protocol baselines.

---

## 🏗️ Architecture & Project Structure

The project is structured into standalone, independently deployable services:

```
├── frontend/                # React 18 + Vite + TypeScript frontend
│   ├── src/                 # Application source code
│   │   ├── components/      # UI components & design system
│   │   ├── pages/           # Public & portal routes
│   │   ├── services/        # API clients (process mining & backend)
│   │   └── types/           # TypeScript interfaces
│   ├── public/              # Static assets & medical imagery
│   └── package.json
│
├── backend/                 # Node.js + Express + TypeScript backend
│   ├── src/                 # API controllers, routes, & process mining engine
│   ├── test/                # Test suite
│   └── package.json
│
├── .gitignore               # Root git ignore
└── README.md                # Project documentation
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- npm / yarn

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will start at: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will start at: `http://localhost:5173`

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📦 Deployment Guide

- **Frontend**: Deploy `frontend/` to **Vercel**, **Netlify**, or **Cloudflare Pages**.
  - Build command: `npm run build`
  - Output directory: `dist`
  - Set `VITE_API_URL` to your production backend URL.

- **Backend**: Deploy `backend/` to **Render**, **Railway**, **Fly.io**, or any Node.js hosting platform.
  - Build command: `npm run build`
  - Start command: `npm start`
  - Set `FRONTEND_URL` to your production frontend URL.

---

## 📄 License
MIT License. Developed for enterprise healthcare innovation.
