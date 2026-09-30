import { Request, Response } from 'express';
import { FrictionDetectorService } from '../services/frictionDetectorService.js';
import { AIExplanationService } from '../services/aiExplanationService.js';
import { getDb } from '../db/connection.js';

const detector = new FrictionDetectorService();
const aiService = new AIExplanationService();

export async function getFrictionAlerts(req: Request, res: Response): Promise<void> {
  try {
    const workflow = req.query.workflow as string | undefined;
    const alerts = await detector.detectAllFriction(workflow);
    res.json(alerts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getStoredFindings(req: Request, res: Response): Promise<void> {
  try {
    const db = getDb();
    const workflow = req.query.workflow as string | undefined;
    const query = workflow
      ? 'SELECT * FROM findings WHERE process_model_id = $1 ORDER BY created_at DESC'
      : 'SELECT * FROM findings ORDER BY created_at DESC';
    const params = workflow ? [workflow] : [];
    const resDb = await db.query(query, params);
    res.json(resDb.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function explainFindingWithAI(req: Request, res: Response): Promise<void> {
  try {
    const { findingTitle, findingType, department, affectedRoles, evidence, processModelName } = req.body;
    if (!findingTitle) {
      res.status(400).json({ error: 'findingTitle is required' });
      return;
    }
    const explanation = await aiService.explainFinding({
      findingTitle,
      findingType: findingType || 'PROCESS_FRICTION',
      department: department || 'Operations',
      affectedRoles: affectedRoles || ['Staff'],
      evidence: evidence || {},
      processModelName: processModelName || 'Perioperative Workflow'
    });
    res.json(explanation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
