import { Router } from 'express';
import { getProcessModels, getProcessGraph, getHeatmap } from '../controllers/discoveryController.js';
import { getFrictionAlerts, getStoredFindings, explainFindingWithAI } from '../controllers/frictionController.js';
import { getRecommendations, updateRecommendationStatus, runSimulation, getKpis, getAuditLogs } from '../controllers/opsController.js';
import { uploadEventLog, parseUnstructuredStaffChat } from '../controllers/ingestController.js';
const router = Router();
// Process Discovery & Heatmap
router.get('/models', getProcessModels);
router.get('/discovery/graph', getProcessGraph);
router.get('/discovery/heatmap', getHeatmap);
// Friction & AI Explanation
router.get('/friction/alerts', getFrictionAlerts);
router.get('/friction/findings', getStoredFindings);
router.post('/friction/explain', explainFindingWithAI);
// Action Board & Recommendations
router.get('/recommendations', getRecommendations);
router.patch('/recommendations/:id/status', updateRecommendationStatus);
// What-If Simulator
router.post('/simulator/run', runSimulation);
// Operational KPIs
router.get('/kpis', getKpis);
// Data Ingestion & Chat Parser
router.post('/ingest/upload', uploadEventLog);
router.post('/ingest/chat', parseUnstructuredStaffChat);
// Compliance & Audit Logs
router.get('/audit', getAuditLogs);
export default router;
