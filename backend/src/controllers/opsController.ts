import { Request, Response } from 'express';
import { getDb } from '../db/connection.js';
import { SimulatorService } from '../services/simulatorService.js';
import { v4 as uuidv4 } from 'uuid';

const simulator = new SimulatorService();

// RECOMMENDATIONS
export async function getRecommendations(req: Request, res: Response): Promise<void> {
  try {
    const db = getDb();
    const query = 'SELECT * FROM recommendations ORDER BY updated_at DESC';
    const resDb = await db.query(query);
    res.json(resDb.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateRecommendationStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['PROPOSED', 'APPROVED', 'IN_PROGRESS', 'MEASURED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const db = getDb();
    await db.query(
      'UPDATE recommendations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );

    // Audit action
    await db.query(
      `INSERT INTO audit_logs (id, user_role, action, resource_type, resource_id, details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), req.user?.role || 'Administrator', 'RECOMMENDATION_STATUS_CHANGE', 'RECOMMENDATION', id, JSON.stringify({ new_status: status })]
    );

    res.json({ success: true, id, status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// SIMULATOR
export async function runSimulation(req: Request, res: Response): Promise<void> {
  try {
    const { scenarioName, addCssdTechnicians, automateConsentCapture, enforcePacGatekeeper, automateTpaInsuranceBinding, turnoverBufferReductionMin } = req.body;

    const result = await simulator.runWhatIfSimulation({
      scenarioName: scenarioName || 'Custom Operational Scenario',
      addCssdTechnicians: Number(addCssdTechnicians) || 0,
      automateConsentCapture: Boolean(automateConsentCapture),
      enforcePacGatekeeper: Boolean(enforcePacGatekeeper),
      automateTpaInsuranceBinding: Boolean(automateTpaInsuranceBinding),
      turnoverBufferReductionMin: Number(turnoverBufferReductionMin) || 0
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// KPIS
export async function getKpis(req: Request, res: Response): Promise<void> {
  try {
    const db = getDb();
    const resDb = await db.query('SELECT * FROM kpi_metrics ORDER BY id');
    res.json(resDb.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// AUDIT LOGS
export async function getAuditLogs(req: Request, res: Response): Promise<void> {
  try {
    const db = getDb();
    const limit = Number(req.query.limit) || 50;
    const resDb = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1', [limit]);
    res.json(resDb.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
